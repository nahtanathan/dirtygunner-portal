// FILE: src/app/api/bonus-hunts/route.ts

import { NextResponse } from "next/server";

import { bonusHunts as fallbackBonusHunts } from "@/lib/data/mock-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type BonusHuntApiBonus = {
  id?: string | null;
  slotName?: string | null;
  provider?: string | null;
  betSize?: number | null;
  payout?: number | null;
  multiplier?: number | null;
};

type BonusHuntApiStats = {
  bonusCount?: number | null;
  openedBonuses?: number | null;
  unopenedBonuses?: number | null;
  totalWinnings?: number | null;
  profitLoss?: number | null;
  profitLossPercentage?: number | null;
};

type BonusHuntApiListItem = {
  id: string;
  title?: string | null;
  casino?: string | null;
  startCost?: number | null;
  isOpening?: boolean | null;
  currentOpeningSlot?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  stats?: BonusHuntApiStats | null;
  bonuses?: BonusHuntApiBonus[] | null;
};

type BonusHuntApiListResponse = {
  hunts?: BonusHuntApiListItem[] | null;
  pagination?: {
    limit?: number;
    offset?: number;
    total?: number;
    hasMore?: boolean;
  } | null;
};

type BonusHuntApiDetailResponse = {
  id: string;
  title?: string | null;
  casino?: string | null;
  startCost?: number | null;
  isOpening?: boolean | null;
  currentOpeningSlot?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  stats?: BonusHuntApiStats | null;
  bonuses?: BonusHuntApiBonus[] | null;
};

type BonusHuntApiStatsResponse = {
  hunts?: {
    total?: number | null;
    active?: number | null;
    completed?: number | null;
  } | null;
  bonuses?: {
    total?: number | null;
    opened?: number | null;
    unopened?: number | null;
  } | null;
  financial?: {
    totalInvested?: number | null;
    totalWinnings?: number | null;
    totalProfitLoss?: number | null;
    totalProfitLossPercentage?: number | null;
  } | null;
};

type NormalizedBonus = {
  id: string;
  slotName: string;
  provider?: string;
  betSize?: number;
  payout?: number;
  multiplier?: number;
};

type NormalizedBonusHunt = {
  id: string;
  title: string;
  date?: string;
  updatedAt?: string;
  status: "active" | "archived" | "opening" | "completed";
  provider?: string;
  casino?: string;
  buyCount?: number;
  openedBonuses?: number;
  unopenedBonuses?: number;
  totalCost?: number;
  totalReturn?: number;
  profitLoss?: number;
  profitLossPercentage?: number;
  currentOpeningSlot?: string;
  notes?: string;
  bonuses?: NormalizedBonus[];
};

type BonusHuntRouteResponse = {
  liveHunts: NormalizedBonusHunt[];
  previousHunts: NormalizedBonusHunt[];
  totalHunts?: number;
  activeHunts?: number;
  completedHunts?: number;
  totalBonuses?: number;
  totalInvested?: number;
  totalWinnings?: number;
  totalProfitLoss?: number;
  totalProfitLossPercentage?: number;
  source: "bonushunt" | "fallback";
  fetchedAt: string;
  message?: string;
  rateLimit?: {
    limit?: number;
    remaining?: number;
    reset?: number;
  };
};

function getBonusHuntApiBaseUrl() {
  return (
    process.env.BONUSHUNT_API_BASE_URL?.trim() ||
    process.env.BONUS_HUNT_API_BASE_URL?.trim() ||
    "https://bonushunt.gg/api/public"
  ).replace(/\/+$/, "");
}

function getBonusHuntApiKey() {
  return (
    process.env.BONUSHUNT_API_KEY?.trim() ||
    process.env.BONUS_HUNT_API_KEY?.trim() ||
    process.env.BONUSHUNTGG_API_KEY?.trim() ||
    ""
  );
}

function toNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function parseRateLimit(headers: Headers) {
  const limit = headers.get("x-ratelimit-limit");
  const remaining = headers.get("x-ratelimit-remaining");
  const reset = headers.get("x-ratelimit-reset");

  return {
    limit: limit ? Number(limit) : undefined,
    remaining: remaining ? Number(remaining) : undefined,
    reset: reset ? Number(reset) : undefined,
  };
}

function deriveProvider(
  casino?: string | null,
  bonuses?: BonusHuntApiBonus[] | null,
) {
  const providers = Array.from(
    new Set(
      (bonuses ?? [])
        .map((bonus) => bonus.provider?.trim())
        .filter((value): value is string => Boolean(value)),
    ),
  );

  if (providers.length === 0) {
    return casino?.trim() || undefined;
  }

  if (providers.length === 1) {
    return providers[0];
  }

  if (providers.length === 2) {
    return providers.join(" / ");
  }

  return `${providers.slice(0, 2).join(" / ")} +${providers.length - 2}`;
}

function normalizeBonusRows(
  bonuses?: BonusHuntApiBonus[] | null,
): NormalizedBonus[] {
  const normalized: NormalizedBonus[] = [];

  for (const [index, bonus] of (bonuses ?? []).entries()) {
    const slotName = bonus.slotName?.trim();

    if (!slotName) {
      continue;
    }

    normalized.push({
      id: bonus.id?.trim() || `${slotName}-${index}`,
      slotName,
      provider: bonus.provider?.trim() || undefined,
      betSize: toNumber(bonus.betSize),
      payout: toNumber(bonus.payout),
      multiplier: toNumber(bonus.multiplier),
    });
  }

  return normalized;
}

function normalizeHunt(
  hunt: BonusHuntApiListItem | BonusHuntApiDetailResponse,
  forcedStatus?: "opening" | "completed",
): NormalizedBonusHunt {
  const bonuses = normalizeBonusRows(hunt.bonuses);
  const stats = hunt.stats ?? undefined;

  const statsBonusCount = toNumber(stats?.bonusCount);
  const bonusLength = bonuses.length;
  const computedBuyCount =
    statsBonusCount !== undefined
      ? statsBonusCount
      : bonusLength > 0
        ? bonusLength
        : undefined;

  return {
    id: hunt.id,
    title: hunt.title?.trim() || "Untitled Hunt",
    date: hunt.createdAt ?? hunt.updatedAt ?? undefined,
    updatedAt: hunt.updatedAt ?? hunt.createdAt ?? undefined,
    status: hunt.isOpening
      ? "opening"
      : forcedStatus === "completed"
        ? "completed"
        : "archived",
    provider: deriveProvider(hunt.casino, hunt.bonuses),
    casino: hunt.casino?.trim() || undefined,
    buyCount: computedBuyCount,
    openedBonuses: toNumber(stats?.openedBonuses),
    unopenedBonuses: toNumber(stats?.unopenedBonuses),
    totalCost: toNumber(hunt.startCost),
    totalReturn: toNumber(stats?.totalWinnings),
    profitLoss: toNumber(stats?.profitLoss),
    profitLossPercentage: toNumber(stats?.profitLossPercentage),
    currentOpeningSlot: hunt.currentOpeningSlot?.trim() || undefined,
    notes: hunt.isOpening
      ? "Live hunt data pulled from BonusHunt.gg."
      : "Completed hunt data pulled from BonusHunt.gg.",
    bonuses,
  };
}

function createFallbackPayload(message: string): BonusHuntRouteResponse {
  const liveHunts = fallbackBonusHunts
    .filter((hunt) => hunt.status === "active")
    .map((hunt) => ({
      id: hunt.id,
      title: hunt.title,
      date: hunt.date,
      updatedAt: hunt.date,
      status: "active" as const,
      provider: hunt.provider,
      buyCount: hunt.buyCount,
      totalCost: hunt.totalCost,
      totalReturn: hunt.totalReturn,
      profitLoss: hunt.profitLoss,
      notes: hunt.notes,
      bonuses: [],
    }));

  const previousHunts = fallbackBonusHunts
    .filter((hunt) => hunt.status === "archived")
    .map((hunt) => ({
      id: hunt.id,
      title: hunt.title,
      date: hunt.date,
      updatedAt: hunt.date,
      status: "archived" as const,
      provider: hunt.provider,
      buyCount: hunt.buyCount,
      totalCost: hunt.totalCost,
      totalReturn: hunt.totalReturn,
      profitLoss: hunt.profitLoss,
      notes: hunt.notes,
      bonuses: [],
    }));

  return {
    liveHunts,
    previousHunts,
    totalHunts: liveHunts.length + previousHunts.length,
    activeHunts: liveHunts.length,
    completedHunts: previousHunts.length,
    totalBonuses: fallbackBonusHunts.reduce(
      (sum, hunt) => sum + (hunt.buyCount ?? 0),
      0,
    ),
    source: "fallback",
    fetchedAt: new Date().toISOString(),
    message,
  };
}

async function fetchBonusHuntJson<T>(path: string) {
  const response = await fetch(`${getBonusHuntApiBaseUrl()}${path}`, {
    headers: {
      Authorization: `Bearer ${getBonusHuntApiKey()}`,
      Accept: "application/json",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `BonusHunt API request failed (${response.status} ${response.statusText})${
        body ? `: ${body}` : ""
      }`,
    );
  }

  return {
    data: (await response.json()) as T,
    rateLimit: parseRateLimit(response.headers),
  };
}

async function fetchHuntDetails(
  hunts: BonusHuntApiListItem[],
  forcedStatus: "opening" | "completed",
) {
  return Promise.all(
    hunts.map(async (hunt) => {
      try {
        const detail = await fetchBonusHuntJson<BonusHuntApiDetailResponse>(
          `/hunts/${hunt.id}`,
        );
        return normalizeHunt(detail.data, forcedStatus);
      } catch {
        return normalizeHunt(hunt, forcedStatus);
      }
    }),
  );
}

export async function GET() {
  try {
    const apiKey = getBonusHuntApiKey();

    if (!apiKey) {
      return NextResponse.json(
        createFallbackPayload(
          "BonusHunt API key is not configured yet. Showing local fallback hunts until the server key is added.",
        ),
        {
          headers: {
            "Cache-Control": "no-store",
          },
        },
      );
    }

    const [openingResult, completedResult, statsResult] = await Promise.all([
      fetchBonusHuntJson<BonusHuntApiListResponse>("/hunts?limit=1&status=opening"),
      fetchBonusHuntJson<BonusHuntApiListResponse>("/hunts?limit=8&status=completed"),
      fetchBonusHuntJson<BonusHuntApiStatsResponse>("/stats").catch(() => ({
        data: {} as BonusHuntApiStatsResponse,
        rateLimit: {
          limit: undefined,
          remaining: undefined,
          reset: undefined,
        },
      })),
    ]);

    const openingHunts = openingResult.data.hunts ?? [];
    const completedHunts = completedResult.data.hunts ?? [];

    const [liveHunts, previousHunts] = await Promise.all([
      fetchHuntDetails(openingHunts, "opening"),
      fetchHuntDetails(completedHunts, "completed"),
    ]);

    const stats = statsResult.data;

    const payload: BonusHuntRouteResponse = {
      liveHunts,
      previousHunts,
      totalHunts: toNumber(stats.hunts?.total),
      activeHunts: toNumber(stats.hunts?.active) ?? liveHunts.length,
      completedHunts: toNumber(stats.hunts?.completed) ?? previousHunts.length,
      totalBonuses: toNumber(stats.bonuses?.total),
      totalInvested: toNumber(stats.financial?.totalInvested),
      totalWinnings: toNumber(stats.financial?.totalWinnings),
      totalProfitLoss: toNumber(stats.financial?.totalProfitLoss),
      totalProfitLossPercentage: toNumber(stats.financial?.totalProfitLossPercentage),
      source: "bonushunt",
      fetchedAt: new Date().toISOString(),
      message:
        liveHunts.length === 0
          ? "No live hunt is currently opening on BonusHunt.gg."
          : undefined,
      rateLimit: openingResult.rateLimit,
    };

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Failed to load BonusHunt data:", error);

    return NextResponse.json(
      createFallbackPayload(
        error instanceof Error
          ? `BonusHunt.gg is currently unavailable. ${error.message}`
          : "BonusHunt.gg is currently unavailable. Showing fallback hunt data.",
      ),
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  }
}