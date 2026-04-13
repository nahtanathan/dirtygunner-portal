import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { env } from "@/lib/env";

const SESSION_COOKIE = "dg_session";

export type AppSession = {
  sub: string;
  kickUserId?: string;
  kickUsername?: string;
  isAdmin?: boolean;
};

function sessionKey() {
  return new TextEncoder().encode(env.APP_SESSION_SECRET);
}

export async function createSession(session: AppSession): Promise<string> {
  return await new SignJWT({
    kickUserId: session.kickUserId,
    kickUsername: session.kickUsername,
    isAdmin: session.isAdmin ?? false,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(session.sub)
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(sessionKey());
}

export async function setSessionCookie(token: string) {
  const store = await cookies();

  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();

  store.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
}

export async function getSession(): Promise<AppSession | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, sessionKey());

    return {
      sub: payload.sub as string,
      kickUserId: payload.kickUserId as string | undefined,
      kickUsername: payload.kickUsername as string | undefined,
      isAdmin: Boolean(payload.isAdmin),
    };
  } catch {
    return null;
  }
}