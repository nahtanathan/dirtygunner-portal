// FILE: src/lib/kick/api.ts

import { prisma } from "@/lib/prisma";
import { decryptSecret, encryptSecret } from "@/lib/crypto";
import { refreshKickToken } from "./oauth";
import { KICK_API_BASE } from "./constants";
import type {
  KickApiItemResponse,
  KickApiListResponse,
  KickChannel,
  KickReward,
  KickUser,
} from "./types";

type AuthenticatedKickUser = {
  id: string;
  access_token: string | null;
  refresh_token: string | null;
  kick_token_expires_at: Date | null;
};

async function ensureFreshAccessToken(user: AuthenticatedKickUser) {
  if (!user.access_token || !user.refresh_token) {
    throw new Error("Missing stored Kick tokens");
  }

  const expiresSoon =
    !user.kick_token_expires_at ||
    user.kick_token_expires_at.getTime() - Date.now() < 60_000;

  if (!expiresSoon) {
    return decryptSecret(user.access_token);
  }

  const refreshed = await refreshKickToken(decryptSecret(user.refresh_token));

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      access_token: encryptSecret(refreshed.access_token),
      refresh_token: encryptSecret(refreshed.refresh_token),
      kick_token_expires_at: new Date(Date.now() + refreshed.expires_in * 1000),
    },
    select: {
      access_token: true,
    },
  });

  if (!updated.access_token) {
    throw new Error("Token refresh update failed");
  }

  return decryptSecret(updated.access_token);
}

async function kickFetch<T>(
  user: AuthenticatedKickUser,
  path: string,
  init?: RequestInit
): Promise<T> {
  const token = await ensureFreshAccessToken(user);

  const res = await fetch(`${KICK_API_BASE}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Kick API ${path} failed: ${res.status} ${await res.text()}`);
  }

  return res.json() as Promise<T>;
}

export async function getKickUserRecord(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      access_token: true,
      refresh_token: true,
      kick_token_expires_at: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export async function getCurrentKickUser(userId: string) {
  const authUser = await getKickUserRecord(userId);
  const res = await kickFetch<KickApiListResponse<KickUser>>(authUser, "/users");
  return res.data[0];
}

export async function getCurrentKickChannel(userId: string) {
  const authUser = await getKickUserRecord(userId);
  const res = await kickFetch<KickApiListResponse<KickChannel>>(authUser, "/channels");
  return res.data[0];
}

export async function listKickRewards(userId: string) {
  const authUser = await getKickUserRecord(userId);
  const res = await kickFetch<KickApiListResponse<KickReward>>(authUser, "/channels/rewards");
  return res.data;
}

export async function createKickReward(
  userId: string,
  payload: {
    title: string;
    cost: number;
    description?: string;
    background_color?: string;
    is_enabled?: boolean;
    is_user_input_required?: boolean;
    should_redemptions_skip_request_queue?: boolean;
  }
) {
  const authUser = await getKickUserRecord(userId);
  const res = await kickFetch<KickApiItemResponse<KickReward>>(authUser, "/channels/rewards", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function updateKickReward(
  userId: string,
  rewardId: string,
  payload: Partial<{
    title: string;
    cost: number;
    description: string;
    background_color: string;
    is_enabled: boolean;
    is_paused: boolean;
    is_user_input_required: boolean;
    should_redemptions_skip_request_queue: boolean;
  }>
) {
  const authUser = await getKickUserRecord(userId);
  const res = await kickFetch<KickApiItemResponse<KickReward>>(
    authUser,
    `/channels/rewards/${rewardId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
  return res.data;
}

export async function deleteKickReward(userId: string, rewardId: string) {
  const authUser = await getKickUserRecord(userId);
  await kickFetch(authUser, `/channels/rewards/${rewardId}`, {
    method: "DELETE",
  });
}

export async function listEventSubscriptions(userId: string) {
  const authUser = await getKickUserRecord(userId);
  return kickFetch(authUser, "/events/subscriptions");
}

export async function subscribeKickEvents(
  userId: string,
  events: Array<{ name: string; version: number }>
) {
  const authUser = await getKickUserRecord(userId);
  return kickFetch(authUser, "/events/subscriptions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      events,
      method: "webhook",
    }),
  });
}