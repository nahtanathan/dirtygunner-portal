// FILE: src/app/api/auth/kick/login/route.ts

import crypto from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { requireKickAuthEnv } from "@/lib/env";

const PKCE_COOKIE = "kick_pkce_verifier";
const STATE_COOKIE = "kick_oauth_state";

function randomString(bytes = 32) {
  return crypto.randomBytes(bytes).toString("base64url");
}

function sha256Base64Url(input: string) {
  return crypto.createHash("sha256").update(input).digest("base64url");
}

export async function GET() {
  const { KICK_CLIENT_ID, KICK_REDIRECT_URI } = requireKickAuthEnv();

  const state = randomString(32);
  const verifier = randomString(64);
  const challenge = sha256Base64Url(verifier);

  const url = new URL("https://id.kick.com/oauth/authorize");
  url.searchParams.set("client_id", KICK_CLIENT_ID);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri", KICK_REDIRECT_URI);
  url.searchParams.set(
    "scope",
    [
      "user:read",
      "channel:read",
      "channel:rewards:read",
      "channel:rewards:write",
      "events:subscribe",
    ].join(" "),
  );
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");

  const store = await cookies();

  store.set(STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });

  store.set(PKCE_COOKIE, verifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });

  return NextResponse.redirect(url);
}