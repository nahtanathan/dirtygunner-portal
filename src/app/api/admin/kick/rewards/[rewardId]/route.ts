import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { decryptString } from '@/lib/crypto';
import { encryptString } from '@/lib/crypto';
import { getServerSessionUser } from '@/lib/auth/session';

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

type KickTokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope?: string;
};

async function refreshKickAccessToken(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      refresh_token: true,
    },
  });

  if (!user?.refresh_token) {
    throw new Error('Missing stored Kick refresh token');
  }

  const refreshToken = decryptString(user.refresh_token);

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: process.env.KICK_CLIENT_ID!,
    client_secret: process.env.KICK_CLIENT_SECRET!,
  });

  const response = await fetch('https://id.kick.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body,
    cache: 'no-store',
  });

  const data = (await response.json()) as KickTokenResponse | { message?: string };

  if (!response.ok || !('access_token' in data)) {
    throw new Error(
      `Kick token refresh failed: ${response.status} ${JSON.stringify(data)}`
    );
  }

  const expiresAt = new Date(Date.now() + data.expires_in * 1000);

  await prisma.user.update({
    where: { id: userId },
    data: {
      access_token: encryptString(data.access_token),
      refresh_token: data.refresh_token
        ? encryptString(data.refresh_token)
        : user.refresh_token,
      kick_token_expires_at: expiresAt,
    },
  });

  return data.access_token;
}

async function getValidKickAccessToken(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      access_token: true,
      kick_token_expires_at: true,
    },
  });

  if (!user?.access_token) {
    throw new Error('Missing stored Kick access token');
  }

  const expiresAt = user.kick_token_expires_at?.getTime() ?? 0;
  const shouldRefresh = Date.now() >= expiresAt - 60_000;

  if (shouldRefresh) {
    return refreshKickAccessToken(userId);
  }

  return decryptString(user.access_token);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ rewardId: string }> }
) {
  try {
    const sessionUser = await getServerSessionUser();

    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!sessionUser.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { rewardId } = await context.params;

    if (!rewardId) {
      return NextResponse.json({ error: 'Missing rewardId' }, { status: 400 });
    }

    const json = await request.json();
    const parsed = updateRewardSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Invalid payload',
          issues: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const primaryKickOwner = await prisma.user.findFirst({
      where: {
        kick_user_id: { not: null },
        access_token: { not: null },
        refresh_token: { not: null },
        isKickBroadcaster: true,
      },
      select: {
        id: true,
      },
    });

    if (!primaryKickOwner) {
      return NextResponse.json(
        { error: 'No connected Kick broadcaster found' },
        { status: 400 }
      );
    }

    const accessToken = await getValidKickAccessToken(primaryKickOwner.id);

    const kickResponse = await fetch(
      `https://api.kick.com/public/v1/channels/rewards/${rewardId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(parsed.data),
        cache: 'no-store',
      }
    );

    const text = await kickResponse.text();
    const data = text ? JSON.parse(text) : null;

    if (!kickResponse.ok) {
      return NextResponse.json(
        {
          error: 'Kick API update failed',
          status: kickResponse.status,
          details: data,
        },
        { status: kickResponse.status }
      );
    }

    const reward = data?.data ?? null;

    if (reward) {
      await prisma.kickReward.upsert({
        where: { kick_reward_id: reward.id },
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
          kick_reward_id: reward.id,
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
    console.error('PATCH /api/admin/kick/rewards/[rewardId] failed', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ rewardId: string }> }
) {
  try {
    const sessionUser = await getServerSessionUser();

    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!sessionUser.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { rewardId } = await context.params;

    if (!rewardId) {
      return NextResponse.json({ error: 'Missing rewardId' }, { status: 400 });
    }

    const primaryKickOwner = await prisma.user.findFirst({
      where: {
        kick_user_id: { not: null },
        access_token: { not: null },
        refresh_token: { not: null },
        isKickBroadcaster: true,
      },
      select: {
        id: true,
      },
    });

    if (!primaryKickOwner) {
      return NextResponse.json(
        { error: 'No connected Kick broadcaster found' },
        { status: 400 }
      );
    }

    const accessToken = await getValidKickAccessToken(primaryKickOwner.id);

    const kickResponse = await fetch(
      `https://api.kick.com/public/v1/channels/rewards/${rewardId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
        cache: 'no-store',
      }
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
          error: 'Kick API delete failed',
          status: kickResponse.status,
          details,
        },
        { status: kickResponse.status }
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
    console.error('DELETE /api/admin/kick/rewards/[rewardId] failed', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}