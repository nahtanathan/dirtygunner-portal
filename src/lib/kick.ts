import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { decryptSecret, encryptSecret } from "@/lib/crypto";

export type KickTokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope?: string;
};

export type KickMeResponse = {
  data?: Array<{
    user_id: number;
    name: string;
    email?: string;
    profile_picture?: string;
  }>;
};

export async function exchangeCodeForToken(code: string, codeVerifier: string) {
  const body = new URLSearchParams({
    code,
    client_id: env.KICK_CLIENT_ID,
    client_secret: env.KICK_CLIENT_SECRET,
    redirect_uri: env.KICK_REDIRECT_URI,
    grant_type: "authorization_code",
    code_verifier: codeVerifier,
  });

  const response = await fetch("https://id.kick.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body,
    cache: "no-store",
  });

  const data = (await response.json()) as KickTokenResponse | { message?: string };

  if (!response.ok || !("access_token" in data)) {
    throw new Error(`Kick token exchange failed: ${response.status} ${JSON.stringify(data)}`);
  }

  return data;
}

export async function fetchKickMe(accessToken: string) {
  const response = await fetch("https://api.kick.com/public/v1/users", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const data = (await response.json()) as KickMeResponse | { message?: string };

  if (!response.ok) {
    throw new Error(`Kick /users failed: ${response.status} ${JSON.stringify(data)}`);
  }

  return data;
}

export async function refreshKickAccessToken(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      refresh_token: true,
    },
  });

  if (!user?.refresh_token) {
    throw new Error("Missing stored Kick refresh token");
  }

  const refreshToken = decryptSecret(user.refresh_token);

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: env.KICK_CLIENT_ID,
    client_secret: env.KICK_CLIENT_SECRET,
  });

  const response = await fetch("https://id.kick.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body,
    cache: "no-store",
  });

  const data = (await response.json()) as KickTokenResponse | { message?: string };

  if (!response.ok || !("access_token" in data)) {
    throw new Error(`Kick token refresh failed: ${response.status} ${JSON.stringify(data)}`);
  }

  const expiresAt = new Date(Date.now() + data.expires_in * 1000);

  await prisma.user.update({
    where: { id: userId },
    data: {
      access_token: encryptSecret(data.access_token),
      refresh_token: data.refresh_token
        ? encryptSecret(data.refresh_token)
        : user.refresh_token,
      kick_token_expires_at: expiresAt,
    },
  });

  return data.access_token;
}

export async function getValidKickAccessToken(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      access_token: true,
      kick_token_expires_at: true,
    },
  });

  if (!user?.access_token) {
    throw new Error("Missing stored Kick access token");
  }

  const expiresAt = user.kick_token_expires_at?.getTime() ?? 0;
  const shouldRefresh = Date.now() >= expiresAt - 60_000;

  if (shouldRefresh) {
    return refreshKickAccessToken(userId);
  }

  return decryptSecret(user.access_token);
}

export async function getKickBroadcasterUser() {
  const broadcaster = await prisma.user.findFirst({
    where: {
      kick_user_id: { not: null },
      access_token: { not: null },
      refresh_token: { not: null },
      isKickBroadcaster: true,
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

  return broadcaster;
}