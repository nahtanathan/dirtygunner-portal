// FILE: src/lib/env.ts

import { z } from "zod";

const rawEnv = {
  NODE_ENV: process.env.NODE_ENV,

  DATABASE_URL: process.env.DATABASE_URL,

  APP_URL:
    process.env.APP_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000",
  APP_SESSION_SECRET:
    process.env.APP_SESSION_SECRET ?? process.env.SESSION_SECRET,

  KICK_CLIENT_ID: process.env.KICK_CLIENT_ID,
  KICK_CLIENT_SECRET: process.env.KICK_CLIENT_SECRET,
  KICK_REDIRECT_URI:
    process.env.KICK_REDIRECT_URI ??
    "http://localhost:3000/api/auth/kick/callback",

  KICK_TOKEN_ENCRYPTION_KEY:
    process.env.KICK_TOKEN_ENCRYPTION_KEY ?? process.env.TOKEN_ENCRYPTION_KEY,

  KICK_WEBHOOK_SECRET:
    process.env.KICK_WEBHOOK_SECRET ?? "dev-kick-webhook-secret-change-me",

  KICK_BROADCASTER_USER_ID:
    process.env.KICK_BROADCASTER_USER_ID ??
    process.env.KICK_BROADCASTER_ID ??
    "",

  KICK_BROADCASTER_SLUG: process.env.KICK_BROADCASTER_SLUG ?? "",

  POINTS_CHAT_MESSAGE: process.env.POINTS_CHAT_MESSAGE ?? "2",
  POINTS_FOLLOW: process.env.POINTS_FOLLOW ?? "50",
  POINTS_SUB: process.env.POINTS_SUB ?? "250",

  BONUSHUNT_API_BASE_URL:
    process.env.BONUSHUNT_API_BASE_URL ??
    process.env.BONUS_HUNT_API_BASE_URL ??
    "https://bonushunt.gg/api/public",
  BONUSHUNT_API_KEY:
    process.env.BONUSHUNT_API_KEY ??
    process.env.BONUS_HUNT_API_KEY ??
    process.env.BONUSHUNTGG_API_KEY ??
    "",
};

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  DATABASE_URL: z.string().min(1),

  APP_URL: z.string().url(),
  APP_SESSION_SECRET: z.string().min(32),

  KICK_CLIENT_ID: z.string().min(1),
  KICK_CLIENT_SECRET: z.string().min(1),
  KICK_REDIRECT_URI: z.string().url(),

  KICK_TOKEN_ENCRYPTION_KEY: z.string().min(1),
  KICK_WEBHOOK_SECRET: z.string().min(1),

  KICK_BROADCASTER_USER_ID: z.string().optional(),
  KICK_BROADCASTER_SLUG: z.string().optional(),

  POINTS_CHAT_MESSAGE: z.coerce.number().int().nonnegative().default(2),
  POINTS_FOLLOW: z.coerce.number().int().nonnegative().default(50),
  POINTS_SUB: z.coerce.number().int().nonnegative().default(250),

  BONUSHUNT_API_BASE_URL: z.string().url().default("https://bonushunt.gg/api/public"),
  BONUSHUNT_API_KEY: z.string().optional(),
});

const parsed = envSchema.parse(rawEnv);

export const env = {
  ...parsed,
  KICK_BROADCASTER_USER_ID: parsed.KICK_BROADCASTER_USER_ID || undefined,
  KICK_BROADCASTER_SLUG: parsed.KICK_BROADCASTER_SLUG || undefined,
  BONUSHUNT_API_KEY: parsed.BONUSHUNT_API_KEY || undefined,
};