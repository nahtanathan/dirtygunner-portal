// FILE: src/app/api/auth/kick/callback/route.ts

import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { encryptSecret } from "@/lib/crypto";
import { createSession, setSessionCookie } from "@/lib/session";
import { exchangeCodeForToken, fetchKickMe } from "@/lib/kick";
import { env } from "@/lib/env";
import { ensureKickPointSubscriptions } from "@/lib/kick/events";

const PKCE_COOKIE = "kick_pkce_verifier";
const STATE_COOKIE = "kick_oauth_state";

function isBroadcasterMatch(params: {
  kickUserId: string;
  kickUsername: string | null;
}) {
  const byId = env.KICK_BROADCASTER_USER_ID
    ? params.kickUserId === env.KICK_BROADCASTER_USER_ID
    : false;

  const bySlug = env.KICK_BROADCASTER_SLUG
    ? (params.kickUsername ?? "").toLowerCase() ===
      env.KICK_BROADCASTER_SLUG.toLowerCase()
    : false;

  return byId || bySlug;
}

type KickUserProfile = {
  user_id: number;
  name: string;
  email?: string;
  profile_picture?: string;
};

function getKickUserFromMeResponse(payload: unknown): KickUserProfile | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  if (!("data" in payload)) {
    return null;
  }

  const data = (payload as { data?: unknown }).data;

  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  const first = data[0];

  if (!first || typeof first !== "object") {
    return null;
  }

  const candidate = first as Partial<KickUserProfile>;

  if (typeof candidate.user_id !== "number" || typeof candidate.name !== "string") {
    return null;
  }

  return {
    user_id: candidate.user_id,
    name: candidate.name,
    email: typeof candidate.email === "string" ? candidate.email : undefined,
    profile_picture:
      typeof candidate.profile_picture === "string"
        ? candidate.profile_picture
        : undefined,
  };
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/?kick_auth=error", env.APP_URL));
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL("/?kick_auth=missing_code", env.APP_URL));
  }

  const store = await cookies();
  const expectedState = store.get(STATE_COOKIE)?.value;
  const verifier = store.get(PKCE_COOKIE)?.value;

  if (!expectedState || !verifier || expectedState !== state) {
    return NextResponse.redirect(new URL("/?kick_auth=state_mismatch", env.APP_URL));
  }

  store.delete(STATE_COOKIE);
  store.delete(PKCE_COOKIE);

  const token = await exchangeCodeForToken(code, verifier);
  const me = await fetchKickMe(token.access_token);
  const kickUser = getKickUserFromMeResponse(me);

  if (!kickUser) {
    return NextResponse.redirect(new URL("/?kick_auth=no_user", env.APP_URL));
  }

  const kickUserId = String(kickUser.user_id);
  const kickUsername = kickUser.name ?? null;
  const email = kickUser.email ?? null;
  const avatar = kickUser.profile_picture ?? null;
  const expiresAt = new Date(Date.now() + token.expires_in * 1000);

  const adminIds = (process.env.KICK_ADMIN_USER_IDS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const isAdmin = adminIds.includes(kickUserId);

  const existingByKick = await prisma.user.findUnique({
    where: { kick_user_id: kickUserId },
  });

  const existingByEmail = email
    ? await prisma.user.findUnique({
        where: { email },
      })
    : null;

  const existingUser = existingByKick ?? existingByEmail;
  const shouldBeBroadcaster = isBroadcasterMatch({
    kickUserId,
    kickUsername,
  });

  const user = existingUser
    ? await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          kick_user_id: kickUserId,
          kick_username: kickUsername,
          email,
          avatar,
          access_token: encryptSecret(token.access_token),
          refresh_token: token.refresh_token
            ? encryptSecret(token.refresh_token)
            : existingUser.refresh_token,
          kick_token_expires_at: expiresAt,
          isAdmin: existingUser.isAdmin || isAdmin,
          isKickBroadcaster: shouldBeBroadcaster,
        },
      })
    : await prisma.user.create({
        data: {
          kick_user_id: kickUserId,
          kick_username: kickUsername,
          email,
          avatar,
          access_token: encryptSecret(token.access_token),
          refresh_token: token.refresh_token
            ? encryptSecret(token.refresh_token)
            : null,
          kick_token_expires_at: expiresAt,
          points: 0,
          isAdmin,
          isKickBroadcaster: shouldBeBroadcaster,
        },
      });

  const sessionToken = await createSession({
    sub: user.id,
    kickUserId: user.kick_user_id ?? undefined,
    kickUsername: user.kick_username ?? undefined,
    isAdmin: user.isAdmin,
  });

  if (shouldBeBroadcaster) {
    try {
      await ensureKickPointSubscriptions(user.id);
    } catch (error) {
      console.error("Failed to ensure Kick point subscriptions", error);
    }
  }

  await setSessionCookie(sessionToken);

  return NextResponse.redirect(new URL("/", env.APP_URL));
}
