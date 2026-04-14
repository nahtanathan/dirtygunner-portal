// FILE: src/app/api/admin/kick/rewards/[rewardId]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { getKickBroadcasterUser, getValidKickAccessToken } from "@/lib/kick";

const updateRewardSchema = z.object({
  title: z.string().min(1).max(50).optional(),
  description: z.string().max(200).optional().nullable(),
  cost: z.number().int().min(1).optional(),
  background_color: z
    .string()
    .regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/)
    .optional(),
  is_enabled: z.boolean().optional(),
  is_paused: z.boolean().optional(),
  is_user_input_required: z.boolean().optional(),
  should_redemptions_skip_request_queue: z.boolean().optional(),
});

async function requireAdmin() {
  const session = await getSession();

  if (!session?.sub) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: {
      id: true,
      isAdmin: true,
    },
  });

  if (!user?.isAdmin) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { user };
}

function toPrismaJson(value: unknown) {
  return JSON.parse(JSON.stringify(value ?? null));
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ rewardId: string }> },
) {
  try {
    const auth = await requireAdmin();

    if ("error" in auth) {
      return auth.error;
    }

    const { rewardId } = await context.params;

    if (!rewardId) {
      return NextResponse.json({ error: "Missing rewardId" }, { status: 400 });
    }

    const json = await request.json();
    const parsed = updateRewardSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid payload",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const broadcaster = await getKickBroadcasterUser();
    const accessToken = await getValidKickAccessToken(broadcaster.id);

    const kickResponse = await fetch(
      `https://api.kick.com/public/v1/channels/rewards/${rewardId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(parsed.data),
        cache: "no-store",
      },
    );

    const text = await kickResponse.text();
    let data: unknown = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text || null;
    }

    if (!kickResponse.ok) {
      return NextResponse.json(
        {
          error: "Kick API update failed",
          status: kickResponse.status,
          details: data,
        },
        { status: kickResponse.status },
      );
    }

    const reward =
      (data as { data?: Record<string, unknown> } | null)?.data ?? null;

    if (reward) {
      const rewardIdFromApi = String(reward.id ?? rewardId);

      await prisma.kickReward.upsert({
        where: { kick_reward_id: rewardIdFromApi },
        update: {
          title: String(reward.title ?? ""),
          description:
            typeof reward.description === "string" ? reward.description : null,
          cost: Number(reward.cost ?? 0),
          background_color:
            typeof reward.background_color === "string"
              ? reward.background_color
              : "#00e701",
          is_enabled:
            typeof reward.is_enabled === "boolean" ? reward.is_enabled : true,
          is_paused:
            typeof reward.is_paused === "boolean" ? reward.is_paused : false,
          is_user_input_required:
            typeof reward.is_user_input_required === "boolean"
              ? reward.is_user_input_required
              : false,
          should_redemptions_skip_request_queue:
            typeof reward.should_redemptions_skip_request_queue === "boolean"
              ? reward.should_redemptions_skip_request_queue
              : false,
          raw_json: toPrismaJson(reward),
        },
        create: {
          kick_reward_id: rewardIdFromApi,
          title: String(reward.title ?? ""),
          description:
            typeof reward.description === "string" ? reward.description : null,
          cost: Number(reward.cost ?? 0),
          background_color:
            typeof reward.background_color === "string"
              ? reward.background_color
              : "#00e701",
          is_enabled:
            typeof reward.is_enabled === "boolean" ? reward.is_enabled : true,
          is_paused:
            typeof reward.is_paused === "boolean" ? reward.is_paused : false,
          is_user_input_required:
            typeof reward.is_user_input_required === "boolean"
              ? reward.is_user_input_required
              : false,
          should_redemptions_skip_request_queue:
            typeof reward.should_redemptions_skip_request_queue === "boolean"
              ? reward.should_redemptions_skip_request_queue
              : false,
          raw_json: toPrismaJson(reward),
        },
      });
    }

    return NextResponse.json({
      ok: true,
      reward,
    });
  } catch (error) {
    console.error("PATCH /api/admin/kick/rewards/[rewardId] failed", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ rewardId: string }> },
) {
  try {
    const auth = await requireAdmin();

    if ("error" in auth) {
      return auth.error;
    }

    const { rewardId } = await context.params;

    if (!rewardId) {
      return NextResponse.json({ error: "Missing rewardId" }, { status: 400 });
    }

    const broadcaster = await getKickBroadcasterUser();
    const accessToken = await getValidKickAccessToken(broadcaster.id);

    const kickResponse = await fetch(
      `https://api.kick.com/public/v1/channels/rewards/${rewardId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );

    const text = await kickResponse.text();
    let details: unknown = null;

    try {
      details = text ? JSON.parse(text) : null;
    } catch {
      details = text || null;
    }

    if (!kickResponse.ok) {
      return NextResponse.json(
        {
          error: "Kick API delete failed",
          status: kickResponse.status,
          details,
        },
        { status: kickResponse.status },
      );
    }

    await prisma.kickReward.deleteMany({
      where: {
        OR: [{ kick_reward_id: rewardId }, { id: rewardId }],
      },
    });

    return NextResponse.json({
      ok: true,
      deletedRewardId: rewardId,
    });
  } catch (error) {
    console.error("DELETE /api/admin/kick/rewards/[rewardId] failed", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}