import crypto from "node:crypto";

import { env } from "@/lib/env";
import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { listEventSubscriptions, subscribeKickEvents } from "@/lib/kick/api";

const KICK_WEBHOOK_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAq/+l1WnlRrGSolDMA+A8
6rAhMbQGmQ2SapVcGM3zq8ANXjnhDWocMqfWcTd95btDydITa10kDvHzw9WQOqp2
MZI7ZyrfzJuz5nhTPCiJwTwnEtWft7nV14BYRDHvlfqPUaZ+1KR4OCaO/wWIk/rQ
L/TjY0M70gse8rlBkbo2a8rKhu69RQTRsoaf4DVhDPEeSeI5jVrRDGAMGL3cGuyY
6CLKGdjVEM78g3JfYOvDU/RvfqD7L89TZ3iN94jrmWdGz34JNlEI5hqK8dd7C5EF
BEbZ5jgB8s8ReQV8H+MkuffjdAj3ajDDX3DOJMIut1lBrUVD1AaSrGCKHooWoL2e
twIDAQAB
-----END PUBLIC KEY-----`;

const kickWebhookPublicKey = crypto.createPublicKey(KICK_WEBHOOK_PUBLIC_KEY);

export const KICK_POINT_EVENT_SUBSCRIPTIONS = [
  { name: "chat.message.sent", version: 1 },
  { name: "channel.followed", version: 1 },
  { name: "channel.subscription.new", version: 1 },
  { name: "channel.subscription.renewal", version: 1 },
] as const;

type KickWebhookHeaders = {
  messageId: string;
  subscriptionId: string | null;
  signature: string;
  timestamp: string;
  eventType: string;
  eventVersion: number | null;
};

type KickEventUser = {
  user_id?: number | string | null;
  username?: string | null;
  profile_picture?: string | null;
};

type SupportedKickEventPayload =
  | {
      broadcaster?: KickEventUser | null;
      sender?: KickEventUser | null;
      created_at?: string | null;
    }
  | {
      broadcaster?: KickEventUser | null;
      follower?: KickEventUser | null;
    }
  | {
      broadcaster?: KickEventUser | null;
      subscriber?: KickEventUser | null;
      created_at?: string | null;
      expires_at?: string | null;
    };

type KickPointAward =
  | {
      reason: string;
    }
  | {
      kickUserId: string;
      kickUsername: string | null;
      avatar: string | null;
      pointsAwarded: number;
      dedupeKey: string | null;
    };

type ProcessKickWebhookResult =
  | {
      status: "awarded";
      eventType: string;
      kickUserId: string;
      pointsAwarded: number;
      totalPoints: number;
    }
  | {
      status: "duplicate" | "ignored";
      eventType: string;
      reason: string;
      kickUserId?: string | null;
      pointsAwarded?: number;
    };

type KickPointSubscriptionHealth = {
  name: (typeof KICK_POINT_EVENT_SUBSCRIPTIONS)[number]["name"];
  version: (typeof KICK_POINT_EVENT_SUBSCRIPTIONS)[number]["version"];
  active: boolean;
};

export type KickPointHealthSnapshot = {
  broadcaster: {
    id: string;
    kickUserId: string | null;
    kickUsername: string | null;
    isKickBroadcaster: boolean;
    tokenExpiresAt: string | null;
    updatedAt: string;
  } | null;
  subscriptions: KickPointSubscriptionHealth[];
  subscriptionsError: string | null;
  receiptSummary: {
    liveReceiptCount: number;
    awardedPoints: number;
    lastLiveReceiptAt: string | null;
    creditedUsers: number;
  };
  recentReceipts: Array<{
    id: string;
    eventType: string;
    kickUserId: string | null;
    kickUsername: string | null;
    pointsAwarded: number;
    createdAt: string;
  }>;
};

function asObject(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function normalizeKickUserId(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  return null;
}

function readKickUser(value: unknown): KickEventUser | null {
  const objectValue = asObject(value);

  if (!objectValue) {
    return null;
  }

  return {
    user_id:
      typeof objectValue.user_id === "number" || typeof objectValue.user_id === "string"
        ? objectValue.user_id
        : null,
    username: typeof objectValue.username === "string" ? objectValue.username : null,
    profile_picture:
      typeof objectValue.profile_picture === "string"
        ? objectValue.profile_picture
        : null,
  };
}

function isUniqueConstraintError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const code = "code" in error ? error.code : undefined;
  const message = "message" in error ? error.message : undefined;

  return (
    code === "P2002" ||
    (typeof message === "string" &&
      (message.includes("Unique constraint failed") ||
        message.includes("duplicate key value violates unique constraint")))
  );
}

function buildKickWebhookSignaturePayload(
  messageId: string,
  timestamp: string,
  rawBody: string,
) {
  return `${messageId}.${timestamp}.${rawBody}`;
}

function toAuditPayload(params: {
  deliveryStatus: "ignored" | "awarded";
  reason?: string;
  payload: unknown;
}) {
  return {
    audit: {
      deliveryStatus: params.deliveryStatus,
      reason: params.reason ?? null,
    },
    payload: params.payload,
  } as Prisma.InputJsonValue;
}

async function createIgnoredAuditReceipt(params: {
  webhookHeaders: KickWebhookHeaders;
  payload: unknown;
  reason: string;
  kickUserId?: string | null;
  kickUsername?: string | null;
  dedupeKey?: string | null;
}) {
  try {
    await prisma.kickEventReceipt.create({
      data: {
        kick_message_id: params.webhookHeaders.messageId,
        dedupe_key: params.dedupeKey ?? null,
        kick_subscription_id: params.webhookHeaders.subscriptionId,
        event_type: params.webhookHeaders.eventType,
        event_version: params.webhookHeaders.eventVersion,
        kick_user_id: params.kickUserId ?? null,
        kick_username: params.kickUsername ?? null,
        points_awarded: 0,
        payload: toAuditPayload({
          deliveryStatus: "ignored",
          reason: params.reason,
          payload: params.payload,
        }),
      },
    });
  } catch (error) {
    if (!isUniqueConstraintError(error)) {
      throw error;
    }
  }
}

export function getKickWebhookHeaders(headers: Headers): KickWebhookHeaders | null {
  const messageId = headers.get("Kick-Event-Message-Id");
  const signature = headers.get("Kick-Event-Signature");
  const timestamp = headers.get("Kick-Event-Message-Timestamp");
  const eventType = headers.get("Kick-Event-Type");

  if (!messageId || !signature || !timestamp || !eventType) {
    return null;
  }

  const versionHeader = headers.get("Kick-Event-Version");
  const parsedVersion = Number(versionHeader);

  return {
    messageId,
    subscriptionId: headers.get("Kick-Event-Subscription-Id"),
    signature,
    timestamp,
    eventType,
    eventVersion: Number.isFinite(parsedVersion) ? parsedVersion : null,
  };
}

export function verifyKickWebhookSignature(
  webhookHeaders: KickWebhookHeaders,
  rawBody: string,
) {
  try {
    return crypto.verify(
      "sha256",
      Buffer.from(
        buildKickWebhookSignaturePayload(
          webhookHeaders.messageId,
          webhookHeaders.timestamp,
          rawBody,
        ),
      ),
      kickWebhookPublicKey,
      Buffer.from(webhookHeaders.signature, "base64"),
    );
  } catch (error) {
    console.error("Kick webhook signature verification failed", error);
    return false;
  }
}

function getEventAward(
  payload: SupportedKickEventPayload,
  eventType: string,
): KickPointAward {
  const broadcaster = readKickUser(asObject(payload)?.broadcaster);
  const broadcasterUserId = normalizeKickUserId(broadcaster?.user_id);

  switch (eventType) {
    case "chat.message.sent": {
      const sender = readKickUser(asObject(payload)?.sender);
      const kickUserId = normalizeKickUserId(sender?.user_id);

      if (!kickUserId) {
        return { reason: "missing_sender" } as const;
      }

      if (broadcasterUserId && kickUserId === broadcasterUserId) {
        return { reason: "broadcaster_message" } as const;
      }

      return {
        kickUserId,
        kickUsername: sender?.username ?? null,
        avatar: sender?.profile_picture ?? null,
        pointsAwarded: env.POINTS_CHAT_MESSAGE,
        dedupeKey: null,
      } as const;
    }

    case "channel.followed": {
      const follower = readKickUser(asObject(payload)?.follower);
      const kickUserId = normalizeKickUserId(follower?.user_id);

      if (!kickUserId) {
        return { reason: "missing_follower" } as const;
      }

      return {
        kickUserId,
        kickUsername: follower?.username ?? null,
        avatar: follower?.profile_picture ?? null,
        pointsAwarded: env.POINTS_FOLLOW,
        dedupeKey: broadcasterUserId
          ? `channel.followed:${broadcasterUserId}:${kickUserId}`
          : `channel.followed:${kickUserId}`,
      } as const;
    }

    case "channel.subscription.new":
    case "channel.subscription.renewal": {
      const subscriber = readKickUser(asObject(payload)?.subscriber);
      const kickUserId = normalizeKickUserId(subscriber?.user_id);
      const payloadObject = asObject(payload);
      const createdAt =
        typeof payloadObject?.created_at === "string" ? payloadObject.created_at : null;
      const expiresAt =
        typeof payloadObject?.expires_at === "string" ? payloadObject.expires_at : null;

      if (!kickUserId) {
        return { reason: "missing_subscriber" } as const;
      }

      const semanticTimestamp = createdAt ?? expiresAt;

      return {
        kickUserId,
        kickUsername: subscriber?.username ?? null,
        avatar: subscriber?.profile_picture ?? null,
        pointsAwarded: env.POINTS_SUB,
        dedupeKey: semanticTimestamp
          ? `${eventType}:${broadcasterUserId ?? "unknown"}:${kickUserId}:${semanticTimestamp}`
          : null,
      } as const;
    }

    default:
      return { reason: "unsupported_event" } as const;
  }
}

export async function processKickPointsWebhook(params: {
  webhookHeaders: KickWebhookHeaders;
  rawBody: string;
  payload: unknown;
}): Promise<ProcessKickWebhookResult> {
  const payloadObject = asObject(params.payload);

  if (!payloadObject) {
    await createIgnoredAuditReceipt({
      webhookHeaders: params.webhookHeaders,
      payload: params.payload,
      reason: "invalid_payload",
    });

    return {
      status: "ignored",
      eventType: params.webhookHeaders.eventType,
      reason: "invalid_payload",
    };
  }

  const award = getEventAward(
    payloadObject as SupportedKickEventPayload,
    params.webhookHeaders.eventType,
  );

  if ("reason" in award) {
    await createIgnoredAuditReceipt({
      webhookHeaders: params.webhookHeaders,
      payload: payloadObject,
      reason: award.reason,
    });

    return {
      status: "ignored",
      eventType: params.webhookHeaders.eventType,
      reason: award.reason,
    };
  }

  if (award.pointsAwarded <= 0) {
    await createIgnoredAuditReceipt({
      webhookHeaders: params.webhookHeaders,
      payload: payloadObject,
      reason: "points_disabled",
      kickUserId: award.kickUserId,
      kickUsername: award.kickUsername,
      dedupeKey: award.dedupeKey,
    });

    return {
      status: "ignored",
      eventType: params.webhookHeaders.eventType,
      reason: "points_disabled",
      kickUserId: award.kickUserId,
      pointsAwarded: 0,
    };
  }

  try {
    const updatedUser = await prisma.$transaction(async (tx) => {
      await tx.kickEventReceipt.create({
        data: {
          kick_message_id: params.webhookHeaders.messageId,
          dedupe_key: award.dedupeKey,
          kick_subscription_id: params.webhookHeaders.subscriptionId,
          event_type: params.webhookHeaders.eventType,
          event_version: params.webhookHeaders.eventVersion,
          kick_user_id: award.kickUserId,
          kick_username: award.kickUsername,
          points_awarded: award.pointsAwarded,
          payload: payloadObject as Prisma.InputJsonValue,
        },
      });

      return tx.user.upsert({
        where: { kick_user_id: award.kickUserId },
        update: {
          kick_username: award.kickUsername ?? undefined,
          avatar: award.avatar ?? undefined,
          points: {
            increment: award.pointsAwarded,
          },
        },
        create: {
          kick_user_id: award.kickUserId,
          kick_username: award.kickUsername ?? null,
          avatar: award.avatar ?? null,
          points: award.pointsAwarded,
        },
        select: {
          points: true,
        },
      });
    });

    return {
      status: "awarded",
      eventType: params.webhookHeaders.eventType,
      kickUserId: award.kickUserId,
      pointsAwarded: award.pointsAwarded,
      totalPoints: updatedUser.points,
    };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        status: "duplicate",
        eventType: params.webhookHeaders.eventType,
        reason: "duplicate_event",
        kickUserId: award.kickUserId,
        pointsAwarded: 0,
      };
    }

    throw error;
  }
}

export async function ensureKickPointSubscriptions(userId: string) {
  const response = (await listEventSubscriptions(userId)) as
    | { data?: Array<Record<string, unknown>> }
    | undefined;

  const subscriptions = Array.isArray(response?.data) ? response.data : [];
  const missing = KICK_POINT_EVENT_SUBSCRIPTIONS.filter((target) => {
    return !subscriptions.some((subscription) => {
      const name =
        typeof subscription.event === "string"
          ? subscription.event
          : typeof subscription.name === "string"
            ? subscription.name
            : null;
      const versionRaw = subscription.version;
      const version =
        typeof versionRaw === "number"
          ? versionRaw
          : typeof versionRaw === "string"
            ? Number(versionRaw)
            : null;

      return name === target.name && version === target.version;
    });
  });

  if (missing.length === 0) {
    return {
      created: [],
    };
  }

  await subscribeKickEvents(userId, [...missing]);

  return {
    created: missing,
  };
}

export async function ensureKickPointSubscriptionsForBroadcaster() {
  const broadcaster = await prisma.user.findFirst({
    where: {
      isKickBroadcaster: true,
      access_token: { not: null },
      refresh_token: { not: null },
    },
    select: {
      id: true,
      kick_user_id: true,
      kick_username: true,
    },
  });

  if (!broadcaster) {
    throw new Error("No connected Kick broadcaster found");
  }

  const result = await ensureKickPointSubscriptions(broadcaster.id);

  return {
    broadcaster,
    ...result,
  };
}

export async function getKickPointHealthSnapshot(): Promise<KickPointHealthSnapshot> {
  const broadcaster = await prisma.user.findFirst({
    where: {
      isKickBroadcaster: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      kick_user_id: true,
      kick_username: true,
      isKickBroadcaster: true,
      kick_token_expires_at: true,
      updatedAt: true,
    },
  });

  let subscriptions: Array<Record<string, unknown>> = [];
  let subscriptionsError: string | null = null;

  if (broadcaster) {
    try {
      const response = (await listEventSubscriptions(broadcaster.id)) as
        | { data?: Array<Record<string, unknown>> }
        | undefined;
      subscriptions = Array.isArray(response?.data) ? response.data : [];
    } catch (error) {
      subscriptionsError =
        error instanceof Error ? error.message : "Failed to load subscriptions";
    }
  } else {
    subscriptionsError = "No broadcaster is currently connected.";
  }

  const liveEventTypes = KICK_POINT_EVENT_SUBSCRIPTIONS.map(
    (subscription) => subscription.name,
  );

  const [liveReceiptCount, liveReceiptAggregate, lastLiveReceipt, creditedUsers, recentReceipts] =
    await Promise.all([
      prisma.kickEventReceipt.count({
        where: {
          event_type: {
            in: liveEventTypes,
          },
        },
      }),
      prisma.kickEventReceipt.aggregate({
        where: {
          event_type: {
            in: liveEventTypes,
          },
        },
        _sum: {
          points_awarded: true,
        },
      }),
      prisma.kickEventReceipt.findFirst({
        where: {
          event_type: {
            in: liveEventTypes,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          createdAt: true,
        },
      }),
      prisma.user.count({
        where: {
          kick_user_id: { not: null },
          points: { gt: 0 },
        },
      }),
      prisma.kickEventReceipt.findMany({
        where: {
          event_type: {
            in: [...liveEventTypes, "manual.backfill"],
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 12,
        select: {
          id: true,
          event_type: true,
          kick_user_id: true,
          kick_username: true,
          points_awarded: true,
          createdAt: true,
        },
      }),
    ]);

  return {
    broadcaster: broadcaster
      ? {
          id: broadcaster.id,
          kickUserId: broadcaster.kick_user_id,
          kickUsername: broadcaster.kick_username,
          isKickBroadcaster: broadcaster.isKickBroadcaster,
          tokenExpiresAt: broadcaster.kick_token_expires_at?.toISOString() ?? null,
          updatedAt: broadcaster.updatedAt.toISOString(),
        }
      : null,
    subscriptions: KICK_POINT_EVENT_SUBSCRIPTIONS.map((target) => {
      const active = subscriptions.some((subscription) => {
        const name =
          typeof subscription.event === "string"
            ? subscription.event
            : typeof subscription.name === "string"
              ? subscription.name
              : null;
        const versionRaw = subscription.version;
        const version =
          typeof versionRaw === "number"
            ? versionRaw
            : typeof versionRaw === "string"
              ? Number(versionRaw)
              : null;

        return name === target.name && version === target.version;
      });

      return {
        name: target.name,
        version: target.version,
        active,
      };
    }),
    subscriptionsError,
    receiptSummary: {
      liveReceiptCount,
      awardedPoints: liveReceiptAggregate._sum.points_awarded ?? 0,
      lastLiveReceiptAt: lastLiveReceipt?.createdAt.toISOString() ?? null,
      creditedUsers,
    },
    recentReceipts: recentReceipts.map((receipt) => ({
      id: receipt.id,
      eventType: receipt.event_type,
      kickUserId: receipt.kick_user_id,
      kickUsername: receipt.kick_username,
      pointsAwarded: receipt.points_awarded,
      createdAt: receipt.createdAt.toISOString(),
    })),
  };
}
