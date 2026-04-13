import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getKickBroadcasterUser, getValidKickAccessToken } from '@/lib/kick';

export async function GET() {
  try {
    const broadcaster = await getKickBroadcasterUser();
    const accessToken = await getValidKickAccessToken(broadcaster.id);

    const kickResponse = await fetch('https://api.kick.com/public/v1/channels/rewards', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    const text = await kickResponse.text();
    let data: any = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text || null;
    }

    if (!kickResponse.ok) {
      const cachedRewards = await prisma.kickReward.findMany({
        orderBy: { cost: 'asc' },
      });

      return NextResponse.json({
        ok: false,
        source: 'cache',
        rewards: cachedRewards,
        error: 'Kick API fetch failed',
        details: data,
      });
    }

    const rewards = Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data)
        ? data
        : [];

    if (rewards.length > 0) {
      await Promise.all(
        rewards.map((reward: any) =>
          prisma.kickReward.upsert({
            where: { kick_reward_id: String(reward.id) },
            update: {
              title: reward.title,
              description: reward.description ?? null,
              cost: reward.cost,
              background_color: reward.background_color ?? '#00e701',
              is_enabled: reward.is_enabled ?? true,
              is_paused: reward.is_paused ?? false,
              is_user_input_required: reward.is_user_input_required ?? false,
              should_redemptions_skip_request_queue:
                reward.should_redemptions_skip_request_queue ?? false,
              raw_json: reward,
            },
            create: {
              kick_reward_id: String(reward.id),
              title: reward.title,
              description: reward.description ?? null,
              cost: reward.cost,
              background_color: reward.background_color ?? '#00e701',
              is_enabled: reward.is_enabled ?? true,
              is_paused: reward.is_paused ?? false,
              is_user_input_required: reward.is_user_input_required ?? false,
              should_redemptions_skip_request_queue:
                reward.should_redemptions_skip_request_queue ?? false,
              raw_json: reward,
            },
          })
        )
      );
    }

    return NextResponse.json({
      ok: true,
      source: 'kick',
      rewards,
    });
  } catch (error) {
    console.error('GET /api/kick/rewards failed', error);

    const cachedRewards = await prisma.kickReward.findMany({
      orderBy: { cost: 'asc' },
    });

    return NextResponse.json({
      ok: false,
      source: 'cache',
      rewards: cachedRewards,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
}