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

  DATABASE_URL: z.string().min(1).optional(),

  APP_URL: z.string().url(),
  APP_SESSION_SECRET: z.string().min(32).optional(),

  KICK_CLIENT_ID: z.string().min(1).optional(),
  KICK_CLIENT_SECRET: z.string().min(1).optional(),
  KICK_REDIRECT_URI: z.string().url(),

  KICK_TOKEN_ENCRYPTION_KEY: z.string().min(1).optional(),
  KICK_WEBHOOK_SECRET: z.string().min(1),

  KICK_BROADCASTER_USER_ID: z.string().optional(),
  KICK_BROADCASTER_SLUG: z.string().optional(),

  POINTS_CHAT_MESSAGE: z.coerce.number().int().nonnegative().default(2),
  POINTS_FOLLOW: z.coerce.number().int().nonnegative().default(50),
  POINTS_SUB: z.coerce.number().int().nonnegative().default(250),

  BONUSHUNT_API_BASE_URL: z
    .string()
    .url()
    .default("https://bonushunt.gg/api/public"),

  BONUSHUNT_API_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse(rawEnv);

if (!parsed.success) {
  console.error("Environment validation warning:", parsed.error.flatten());
}

const safeEnv = parsed.success
  ? parsed.data
  : {
      NODE_ENV:
        rawEnv.NODE_ENV === "test" || rawEnv.NODE_ENV === "production"
          ? rawEnv.NODE_ENV
          : "development",
      DATABASE_URL: rawEnv.DATABASE_URL,
      APP_URL: rawEnv.APP_URL,
      APP_SESSION_SECRET: rawEnv.APP_SESSION_SECRET,
      KICK_CLIENT_ID: rawEnv.KICK_CLIENT_ID,
      KICK_CLIENT_SECRET: rawEnv.KICK_CLIENT_SECRET,
      KICK_REDIRECT_URI: rawEnv.KICK_REDIRECT_URI,
      KICK_TOKEN_ENCRYPTION_KEY: rawEnv.KICK_TOKEN_ENCRYPTION_KEY,
      KICK_WEBHOOK_SECRET: rawEnv.KICK_WEBHOOK_SECRET,
      KICK_BROADCASTER_USER_ID: rawEnv.KICK_BROADCASTER_USER_ID,
      KICK_BROADCASTER_SLUG: rawEnv.KICK_BROADCASTER_SLUG,
      POINTS_CHAT_MESSAGE: Number(rawEnv.POINTS_CHAT_MESSAGE ?? 2),
      POINTS_FOLLOW: Number(rawEnv.POINTS_FOLLOW ?? 50),
      POINTS_SUB: Number(rawEnv.POINTS_SUB ?? 250),
      BONUSHUNT_API_BASE_URL:
        rawEnv.BONUSHUNT_API_BASE_URL ?? "https://bonushunt.gg/api/public",
      BONUSHUNT_API_KEY: rawEnv.BONUSHUNT_API_KEY,
    };

export const env = {
  ...safeEnv,
  DATABASE_URL: safeEnv.DATABASE_URL || undefined,
  APP_SESSION_SECRET: safeEnv.APP_SESSION_SECRET || undefined,
  KICK_CLIENT_ID: safeEnv.KICK_CLIENT_ID || undefined,
  KICK_CLIENT_SECRET: safeEnv.KICK_CLIENT_SECRET || undefined,
  KICK_TOKEN_ENCRYPTION_KEY: safeEnv.KICK_TOKEN_ENCRYPTION_KEY || undefined,
  KICK_BROADCASTER_USER_ID: safeEnv.KICK_BROADCASTER_USER_ID || undefined,
  KICK_BROADCASTER_SLUG: safeEnv.KICK_BROADCASTER_SLUG || undefined,
  BONUSHUNT_API_KEY: safeEnv.BONUSHUNT_API_KEY || undefined,
};

export function requireDatabaseEnv() {
  if (!env.DATABASE_URL) {
    throw new Error("Missing DATABASE_URL");
  }

  return {
    DATABASE_URL: env.DATABASE_URL,
  };
}

export function requireSessionEnv() {
  if (!env.APP_SESSION_SECRET) {
    throw new Error("Missing APP_SESSION_SECRET");
  }

  return {
    APP_SESSION_SECRET: env.APP_SESSION_SECRET,
  };
}

export function requireKickAuthEnv() {
  if (!env.KICK_CLIENT_ID) {
    throw new Error("Missing KICK_CLIENT_ID");
  }

  if (!env.KICK_CLIENT_SECRET) {
    throw new Error("Missing KICK_CLIENT_SECRET");
  }

  if (!env.KICK_TOKEN_ENCRYPTION_KEY) {
    throw new Error("Missing KICK_TOKEN_ENCRYPTION_KEY");
  }

  if (!env.APP_SESSION_SECRET) {
    throw new Error("Missing APP_SESSION_SECRET");
  }

  return {
    KICK_CLIENT_ID: env.KICK_CLIENT_ID,
    KICK_CLIENT_SECRET: env.KICK_CLIENT_SECRET,
    KICK_REDIRECT_URI: env.KICK_REDIRECT_URI,
    KICK_TOKEN_ENCRYPTION_KEY: env.KICK_TOKEN_ENCRYPTION_KEY,
    APP_SESSION_SECRET: env.APP_SESSION_SECRET,
  };
}