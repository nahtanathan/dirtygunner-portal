import crypto from "node:crypto";
import { env } from "@/lib/env";
import { KICK_ID_BASE, KICK_SCOPES } from "./constants";

export function randomString(bytes = 32) {
  return crypto.randomBytes(bytes).toString("base64url");
}

export function sha256Base64Url(input: string) {
  return crypto.createHash("sha256").update(input).digest("base64url");
}

export function buildKickAuthorizeUrl(state: string, codeChallenge: string) {
  const url = new URL(`${KICK_ID_BASE}/oauth/authorize`);
  url.searchParams.set("client_id", env.KICK_CLIENT_ID);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", env.KICK_REDIRECT_URI);
  url.searchParams.set("scope", KICK_SCOPES);
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  return url.toString();
}

export type KickTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope?: string;
};

export async function exchangeCodeForToken(params: {
  code: string;
  codeVerifier: string;
}) {
  const body = new URLSearchParams({
    code: params.code,
    client_id: env.KICK_CLIENT_ID,
    client_secret: env.KICK_CLIENT_SECRET,
    redirect_uri: env.KICK_REDIRECT_URI,
    grant_type: "authorization_code",
    code_verifier: params.codeVerifier,
  });

  const res = await fetch(`${KICK_ID_BASE}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Kick token exchange failed: ${res.status} ${await res.text()}`);
  }

  return (await res.json()) as KickTokenResponse;
}

export async function refreshKickToken(refreshToken: string) {
  const body = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: env.KICK_CLIENT_ID,
    client_secret: env.KICK_CLIENT_SECRET,
    grant_type: "refresh_token",
  });

  const res = await fetch(`${KICK_ID_BASE}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Kick token refresh failed: ${res.status} ${await res.text()}`);
  }

  return (await res.json()) as KickTokenResponse;
}