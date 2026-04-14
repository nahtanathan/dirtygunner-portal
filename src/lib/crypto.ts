// FILE: src/lib/crypto.ts

import crypto from "node:crypto";
import { requireKickAuthEnv } from "@/lib/env";

const ENC_ALGO = "aes-256-gcm";

function getKey(): Buffer {
  const { KICK_TOKEN_ENCRYPTION_KEY } = requireKickAuthEnv();
  const key = Buffer.from(KICK_TOKEN_ENCRYPTION_KEY, "base64");

  if (key.length !== 32) {
    throw new Error("KICK_TOKEN_ENCRYPTION_KEY must decode to 32 bytes");
  }

  return key;
}

export function encryptSecret(plainText: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ENC_ALGO, getKey(), iv);

  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [
    iv.toString("base64"),
    tag.toString("base64"),
    encrypted.toString("base64"),
  ].join(".");
}

export function decryptSecret(payload: string): string {
  const [ivB64, tagB64, dataB64] = payload.split(".");

  if (!ivB64 || !tagB64 || !dataB64) {
    throw new Error("Invalid encrypted payload format");
  }

  const decipher = crypto.createDecipheriv(
    ENC_ALGO,
    getKey(),
    Buffer.from(ivB64, "base64")
  );

  decipher.setAuthTag(Buffer.from(tagB64, "base64"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataB64, "base64")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}