import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getServerSessionUser } from '@/lib/auth/session';
import { getKickBroadcasterUser, getValidKickAccessToken } from '@/lib/kick';

const createRewardSchema = z.object({
  title: z.string().min(1).max(50),
  description: z.string().max(200).optional().nullable(),
  cost: z.number().int().min(1),
  background_color: z
    .string()
    .regex(/^#(?:[0-9a-fA-F]{3}){1,2}$/)
    .optional(),
  is_enabled: z.boolean().optional(),
  is_paused: z.boolean().optional(),
  is_user_input_required: z.boolean().optional(),
  should_redemptions_skip_request_queue: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getServerSessionUser();

    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!sessionUser.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const json = await request.json();
    const parsed = createRewardSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid payload',
          issues: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const broadcaster = await getKickBroadcasterUser();
    const accessToken = await getValidKickAccessToken(broadcaster.id);

    const kickResponse = await fetch('https://api.kick.com/public/v1/channels/rewards', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(parsed.data),
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
      return NextResponse.json(
        {
          error: 'Kick API create failed',
          status: kickResponse.status,
          details: data,
        },
        { status: kickResponse.status }
      );
    }

    const reward = data?.data ?? data ?? null;

    if (reward) {
      await prisma.kickReward.upsert({
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
      });
    }

    return NextResponse.json({
      ok: true,
      reward,
    });
  } catch (error) {
    console.error('POST /api/admin/kick/rewards failed', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}