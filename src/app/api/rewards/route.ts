import { NextResponse } from "next/server";

import { getKickBroadcasterUser, getValidKickAccessToken } from "@/lib/kick";
import { extractKickRewards, parseKickRewardsPayload } from "@/lib/kick/rewards";
import type { KickReward } from "@/lib/kick/types";
import { prisma } from "@/lib/prisma";

function toRewardUpsertData(reward: KickReward) {
  return {
    title: reward.title,
    description: reward.description ?? null,
    cost: reward.cost,
    background_color: reward.background_color ?? "#00e701",
    is_enabled: reward.is_enabled ?? true,
    is_paused: reward.is_paused ?? false,
    is_user_input_required: reward.is_user_input_required ?? false,
    should_redemptions_skip_request_queue:
      reward.should_redemptions_skip_request_queue ?? false,
    raw_json: reward,
  };
}

export async function GET() {
  try {
    const broadcaster = await getKickBroadcasterUser();
    const accessToken = await getValidKickAccessToken(broadcaster.id);

    const kickResponse = await fetch("https://api.kick.com/public/v1/channels/rewards", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    const text = await kickResponse.text();
    const data = parseKickRewardsPayload(text);

    if (!kickResponse.ok) {
      const cachedRewards = await prisma.kickReward.findMany({
        orderBy: { cost: "asc" },
      });

      return NextResponse.json({
        ok: false,
        source: "cache",
        rewards: cachedRewards,
        error: "Kick API fetch failed",
        details: data,
      });
    }

    const rewards = extractKickRewards(data);

    if (rewards.length > 0) {
      await Promise.all(
        rewards.map((reward) =>
          prisma.kickReward.upsert({
            where: { kick_reward_id: String(reward.id) },
            update: toRewardUpsertData(reward),
            create: {
              kick_reward_id: String(reward.id),
              ...toRewardUpsertData(reward),
            },
          }),
        ),
      );
    }

    return NextResponse.json({
      ok: true,
      source: "kick",
      rewards,
    });
  } catch (error) {
    console.error("GET /api/kick/rewards failed", error);

    const cachedRewards = await prisma.kickReward.findMany({
      orderBy: { cost: "asc" },
    });

    return NextResponse.json({
      ok: false,
      source: "cache",
      rewards: cachedRewards,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
