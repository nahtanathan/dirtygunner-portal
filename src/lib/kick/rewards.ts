import type { KickReward } from "@/lib/kick/types";

type JsonRecord = Record<string, unknown>;

type KickRewardsApiResponse =
  | KickReward[]
  | {
      data?: KickReward[] | null;
    }
  | JsonRecord
  | string
  | null;

function isObject(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null;
}

function isKickReward(value: unknown): value is KickReward {
  return (
    isObject(value) &&
    "id" in value &&
    "title" in value &&
    "cost" in value &&
    (typeof value.id === "string" || typeof value.id === "number") &&
    typeof value.title === "string" &&
    typeof value.cost === "number"
  );
}

export function parseKickRewardsPayload(payload: string): KickRewardsApiResponse {
  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(payload) as KickRewardsApiResponse;
  } catch {
    return payload;
  }
}

export function extractKickRewards(data: KickRewardsApiResponse): KickReward[] {
  if (Array.isArray(data)) {
    return data.filter(isKickReward);
  }

  if (isObject(data) && Array.isArray(data.data)) {
    return data.data.filter(isKickReward);
  }

  return [];
}
