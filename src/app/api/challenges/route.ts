import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type UpsertChallengePayload = {
  id: string;
  title: string;
  description?: string | null;
  status: "active" | "completed";
  challengeType: "multiplier" | "win_amount";
  targetValue: number;
  minBet: number;
  reward: string;
  rules?: string | null;
  slotName?: string | null;
  provider?: string | null;
  imageUrl?: string | null;
  claimLimit: number;
  requiresProof?: boolean;
  startDate: string;
  endDate: string;
};

type BonusHuntApiBonus = {
  id?: string | null;
  slotName?: string | null;
  provider?: string | null;
  betSize?: number | null;
  payout?: number | null;
  multiplier?: number | null;
  image?: string | null;
  imageUrl?: string | null;
  thumbnail?: string | null;
  thumbnailUrl?: string | null;
  slotImage?: string | null;
  gameImage?: string | null;
  logo?: string | null;
  [key: string]: unknown;
};

type BonusHuntApiListItem = {
  id: string;
  title?: string | null;
  bonuses?: BonusHuntApiBonus[] | null;
  [key: string]: unknown;
};

type BonusHuntApiListResponse = {
  hunts?: BonusHuntApiListItem[] | null;
};

type BonusHuntApiDetailResponse = {
  id: string;
  bonuses?: BonusHuntApiBonus[] | null;
  [key: string]: unknown;
};

class HttpError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

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

function normalizeSpace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeLookupValue(value?: string | null) {
  if (!value) return "";
  return normalizeSpace(value)
    .toLowerCase()
    .replace(/[™®©]/g, "")
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function slugifySlotName(value: string) {
  return normalizeSpace(value)
    .replace(/['’]/g, "")
    .replace(/[™®©]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createSlotLookupCandidates(slotName: string) {
  const normalized = normalizeSpace(slotName);
  const withoutProviderSuffix = normalized.replace(
    /\s+(by|from)\s+[a-z0-9'&.\- ]+$/i,
    "",
  );
  const withoutTrademark = withoutProviderSuffix.replace(/[™®©]/g, "").trim();
  const withoutSlotWord = withoutTrademark.replace(/\bslot\b/gi, "").trim();

  const rawCandidates = [
    normalized,
    withoutProviderSuffix,
    withoutTrademark,
    withoutSlotWord,
    normalized.replace(/\s*1000\b/gi, " 1000"),
  ].filter(Boolean);

  return Array.from(
    new Set(
      rawCandidates
        .map((item) => slugifySlotName(item))
        .filter((item) => item.length > 0),
    ),
  );
}

function absolutizeImageUrl(url: string, pageUrl: string) {
  try {
    return new URL(url, pageUrl).toString();
  } catch {
    return null;
  }
}

function looksLikeUsefulImage(url: string) {
  const lower = url.toLowerCase();

  if (
    lower.includes(".svg") ||
    lower.includes("favicon") ||
    lower.includes("logo-slotcatalog") ||
    lower.includes("flag") ||
    lower.includes("avatar")
  ) {
    return false;
  }

  return (
    lower.includes(".jpg") ||
    lower.includes(".jpeg") ||
    lower.includes(".png") ||
    lower.includes(".webp") ||
    lower.includes("/img/") ||
    lower.includes("/image/") ||
    lower.includes("slot")
  );
}

function scoreImageCandidate(url: string, slotName?: string | null) {
  const lower = url.toLowerCase();
  const normalizedSlot = normalizeLookupValue(slotName);
  let score = 0;

  if (normalizedSlot) {
    for (const token of normalizedSlot.split(" ")) {
      if (token.length >= 3 && lower.includes(token)) {
        score += 3;
      }
    }
  }

  if (lower.includes("slot")) score += 6;
  if (lower.includes("game")) score += 4;
  if (lower.includes("gallery")) score += 3;
  if (lower.includes("logo")) score -= 6;
  if (lower.includes("icon")) score -= 6;
  if (lower.includes("favicon")) score -= 10;

  return score;
}

function extractImageCandidates(html: string, pageUrl: string, slotName?: string | null) {
  const candidates = new Set<string>();

  const patterns = [
    /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/gi,
    /<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/gi,
    /<img[^>]+src=["']([^"']+)["']/gi,
    /<img[^>]+data-src=["']([^"']+)["']/gi,
    /<img[^>]+data-lazy-src=["']([^"']+)["']/gi,
    /<source[^>]+srcset=["']([^"']+)["']/gi,
    /"image"\s*:\s*"([^"]+)"/gi,
    /"contentUrl"\s*:\s*"([^"]+)"/gi,
    /"thumbnailUrl"\s*:\s*"([^"]+)"/gi,
  ];

  for (const pattern of patterns) {
    let match: RegExpExecArray | null = pattern.exec(html);

    while (match) {
      const raw = match[1]?.trim();

      if (raw) {
        const firstSrcsetItem = raw.split(",")[0]?.trim().split(" ")[0]?.trim();
        const absolute = absolutizeImageUrl(firstSrcsetItem || raw, pageUrl);

        if (absolute && looksLikeUsefulImage(absolute)) {
          candidates.add(absolute);
        }
      }

      match = pattern.exec(html);
    }
  }

  return Array.from(candidates).sort(
    (a, b) => scoreImageCandidate(b, slotName) - scoreImageCandidate(a, slotName),
  );
}

async function fetchBonusHuntJson<T>(path: string) {
  const apiKey = getBonusHuntApiKey();

  if (!apiKey) {
    return null;
  }

  const response = await fetch(`${getBonusHuntApiBaseUrl()}${path}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as T;
}

function collectImageUrlsFromUnknown(
  value: unknown,
  results: Set<string>,
  depth = 0,
) {
  if (depth > 4 || value === null || value === undefined) {
    return;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (
      /^https?:\/\//i.test(trimmed) &&
      looksLikeUsefulImage(trimmed)
    ) {
      results.add(trimmed);
    }

    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectImageUrlsFromUnknown(item, results, depth + 1);
    }
    return;
  }

  if (typeof value === "object") {
    for (const [key, nested] of Object.entries(value)) {
      const lowerKey = key.toLowerCase();

      if (
        lowerKey.includes("image") ||
        lowerKey.includes("thumbnail") ||
        lowerKey.includes("poster") ||
        lowerKey.includes("cover") ||
        lowerKey.includes("logo")
      ) {
        collectImageUrlsFromUnknown(nested, results, depth + 1);
      }
    }
  }
}

function bonusMatchesSlot(
  bonus: BonusHuntApiBonus,
  slotName: string,
  provider?: string | null,
) {
  const normalizedBonusSlot = normalizeLookupValue(bonus.slotName);
  const normalizedTargetSlot = normalizeLookupValue(slotName);

  if (!normalizedBonusSlot || !normalizedTargetSlot) {
    return false;
  }

  const slotMatch =
    normalizedBonusSlot === normalizedTargetSlot ||
    normalizedBonusSlot.includes(normalizedTargetSlot) ||
    normalizedTargetSlot.includes(normalizedBonusSlot);

  if (!slotMatch) {
    return false;
  }

  const normalizedTargetProvider = normalizeLookupValue(provider);
  const normalizedBonusProvider = normalizeLookupValue(bonus.provider);

  if (!normalizedTargetProvider) {
    return true;
  }

  if (!normalizedBonusProvider) {
    return true;
  }

  return (
    normalizedBonusProvider === normalizedTargetProvider ||
    normalizedBonusProvider.includes(normalizedTargetProvider) ||
    normalizedTargetProvider.includes(normalizedBonusProvider)
  );
}

async function resolveImageFromBonusHuntApi(
  slotName?: string | null,
  provider?: string | null,
) {
  const apiKey = getBonusHuntApiKey();

  if (!apiKey || !slotName?.trim()) {
    return {
      imageUrl: null,
      imageSource: null,
    };
  }

  console.log("[challenge-image] BonusHunt lookup start", {
    slotName,
    provider,
  });

  const listResponse = await fetchBonusHuntJson<BonusHuntApiListResponse>(
    "/hunts?limit=25",
  );

  const hunts = listResponse?.hunts ?? [];

  for (const hunt of hunts) {
    const inlineBonuses = hunt.bonuses ?? [];

    for (const bonus of inlineBonuses) {
      if (!bonusMatchesSlot(bonus, slotName, provider)) {
        continue;
      }

      const imageCandidates = new Set<string>();
      collectImageUrlsFromUnknown(bonus, imageCandidates);
      collectImageUrlsFromUnknown(hunt, imageCandidates);

      const ordered = Array.from(imageCandidates).sort(
        (a, b) => scoreImageCandidate(b, slotName) - scoreImageCandidate(a, slotName),
      );

      console.log("[challenge-image] BonusHunt inline match", {
        huntId: hunt.id,
        slotName,
        provider,
        imageCandidates: ordered.slice(0, 5),
      });

      if (ordered.length > 0) {
        return {
          imageUrl: ordered[0],
          imageSource: "bonushunt-auto",
        };
      }
    }

    const detail = await fetchBonusHuntJson<BonusHuntApiDetailResponse>(
      `/hunts/${hunt.id}`,
    );

    const detailBonuses = detail?.bonuses ?? [];

    for (const bonus of detailBonuses) {
      if (!bonusMatchesSlot(bonus, slotName, provider)) {
        continue;
      }

      const imageCandidates = new Set<string>();
      collectImageUrlsFromUnknown(bonus, imageCandidates);
      collectImageUrlsFromUnknown(detail, imageCandidates);

      const ordered = Array.from(imageCandidates).sort(
        (a, b) => scoreImageCandidate(b, slotName) - scoreImageCandidate(a, slotName),
      );

      console.log("[challenge-image] BonusHunt detail match", {
        huntId: hunt.id,
        slotName,
        provider,
        imageCandidates: ordered.slice(0, 5),
      });

      if (ordered.length > 0) {
        return {
          imageUrl: ordered[0],
          imageSource: "bonushunt-auto",
        };
      }
    }
  }

  console.log("[challenge-image] BonusHunt lookup found no image", {
    slotName,
    provider,
  });

  return {
    imageUrl: null,
    imageSource: null,
  };
}

async function resolveImageFromSlotCatalog(
  slotName?: string | null,
) {
  if (!slotName?.trim()) {
    return {
      imageUrl: null,
      imageSource: null,
    };
  }

  const candidates = createSlotLookupCandidates(slotName);

  console.log("[challenge-image] SlotCatalog lookup start", {
    slotName,
    slugCandidates: candidates,
  });

  for (const candidate of candidates) {
    const urls = [
      `https://slotcatalog.com/en/slots/${candidate}`,
      `https://slotcatalog.com/slots/${candidate}`,
    ];

    for (const url of urls) {
      try {
        console.log("[challenge-image] SlotCatalog trying url", { slotName, url });

        const response = await fetch(url, {
          headers: {
            Accept: "text/html",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
          },
          cache: "no-store",
          signal: AbortSignal.timeout(8000),
        });

        if (!response.ok) {
          console.log("[challenge-image] SlotCatalog non-ok response", {
            url,
            status: response.status,
            statusText: response.statusText,
          });
          continue;
        }

        const html = await response.text();
        const imageCandidates = extractImageCandidates(html, url, slotName);

        console.log("[challenge-image] SlotCatalog candidates found", {
          url,
          count: imageCandidates.length,
          topCandidates: imageCandidates.slice(0, 5),
        });

        if (imageCandidates.length > 0) {
          return {
            imageUrl: imageCandidates[0],
            imageSource: "slotcatalog-auto",
          };
        }
      } catch (error) {
        console.log("[challenge-image] SlotCatalog lookup failed", {
          url,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  console.log("[challenge-image] SlotCatalog no image found", { slotName });

  return {
    imageUrl: null,
    imageSource: null,
  };
}

async function resolveChallengeImageUrl(
  slotName?: string | null,
  provider?: string | null,
  manualImageUrl?: string | null,
) {
  if (manualImageUrl?.trim()) {
    console.log("[challenge-image] using manual image override", {
      slotName,
      imageUrl: manualImageUrl.trim(),
    });

    return {
      imageUrl: manualImageUrl.trim(),
      imageSource: "manual",
    };
  }

  const bonusHuntResult = await resolveImageFromBonusHuntApi(slotName, provider);

  if (bonusHuntResult.imageUrl) {
    return bonusHuntResult;
  }

  return resolveImageFromSlotCatalog(slotName);
}

function normalizePayload(body: UpsertChallengePayload) {
  const startDate = new Date(body.startDate);
  const endDate = new Date(body.endDate);
  const targetValue = Number(body.targetValue);
  const minBet = Number(body.minBet);
  const claimLimit = Number(body.claimLimit);

  if (!body.id?.trim()) {
    throw new HttpError("Missing challenge id");
  }

  if (!body.title?.trim()) {
    throw new HttpError("Title is required");
  }

  if (!body.reward?.trim()) {
    throw new HttpError("Reward is required");
  }

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new HttpError("Invalid challenge dates");
  }

  if (startDate.getTime() >= endDate.getTime()) {
    throw new HttpError("End date must be after start date");
  }

  if (!Number.isFinite(targetValue) || targetValue <= 0) {
    throw new HttpError("Target value must be greater than 0");
  }

  if (!Number.isFinite(minBet) || minBet < 0) {
    throw new HttpError("Minimum bet must be 0 or more");
  }

  if (!Number.isFinite(claimLimit) || claimLimit < 1) {
    throw new HttpError("Claim limit must be at least 1");
  }

  return {
    id: body.id.trim(),
    title: body.title.trim(),
    description: body.description?.trim() || null,
    status: body.status === "completed" ? "completed" : "active",
    challengeType:
      body.challengeType === "win_amount" ? "win_amount" : "multiplier",
    targetValue,
    minBet,
    reward: body.reward.trim(),
    rules: body.rules?.trim() || null,
    slotName: body.slotName?.trim() || null,
    provider: body.provider?.trim() || null,
    imageUrl: body.imageUrl?.trim() || null,
    claimLimit: Math.floor(claimLimit),
    requiresProof: body.requiresProof !== false,
    startDate,
    endDate,
  };
}

async function requireAdmin() {
  const session = await getSession();

  if (!session?.sub) {
    throw new HttpError("Unauthorized", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: {
      id: true,
      isAdmin: true,
    },
  });

  if (!user?.isAdmin) {
    throw new HttpError("Forbidden", 403);
  }

  return user;
}

function serializeChallenge(
  challenge: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    challengeType: string;
    targetValue: number;
    minBet: number;
    reward: string;
    rules: string | null;
    slotName: string | null;
    provider: string | null;
    imageUrl: string | null;
    imageSource: string | null;
    claimLimit: number;
    requiresProof: boolean;
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
    claims?: Array<{
      status: string;
      userId?: string;
    }>;
  },
  viewerId?: string | null,
) {
  const claims = challenge.claims ?? [];
  const approvedClaims = claims.filter((claim) => claim.status === "approved").length;
  const pendingClaims = claims.filter((claim) => claim.status === "pending").length;
  const remainingClaims = Math.max(challenge.claimLimit - approvedClaims, 0);

  let viewerClaimStatus: "none" | "pending" | "approved" | "rejected" = "none";

  if (viewerId) {
    const viewerClaims = claims.filter((claim) => claim.userId === viewerId);

    if (viewerClaims.some((claim) => claim.status === "approved")) {
      viewerClaimStatus = "approved";
    } else if (viewerClaims.some((claim) => claim.status === "pending")) {
      viewerClaimStatus = "pending";
    } else if (viewerClaims.some((claim) => claim.status === "rejected")) {
      viewerClaimStatus = "rejected";
    }
  }

  return {
    id: challenge.id,
    title: challenge.title,
    description: challenge.description,
    status: challenge.status === "completed" ? "completed" : "active",
    challengeType:
      challenge.challengeType === "win_amount" ? "win_amount" : "multiplier",
    targetValue: challenge.targetValue,
    minBet: challenge.minBet,
    reward: challenge.reward,
    rules: challenge.rules,
    slotName: challenge.slotName,
    provider: challenge.provider,
    imageUrl: challenge.imageUrl,
    imageSource: challenge.imageSource,
    claimLimit: challenge.claimLimit,
    approvedClaims,
    pendingClaims,
    remainingClaims,
    requiresProof: challenge.requiresProof,
    startDate: challenge.startDate.toISOString(),
    endDate: challenge.endDate.toISOString(),
    createdAt: challenge.createdAt.toISOString(),
    updatedAt: challenge.updatedAt.toISOString(),
    viewerClaimStatus,
  };
}

export async function GET() {
  try {
    const session = await getSession();

    const rows = await prisma.challenge.findMany({
      orderBy: [{ status: "asc" }, { endDate: "asc" }, { createdAt: "desc" }],
      include: {
        claims: {
          select: {
            status: true,
            userId: true,
          },
        },
      },
    });

    return NextResponse.json(
      rows.map((row) => serializeChallenge(row, session?.sub ?? null)),
    );
  } catch (error) {
    console.error("Failed to load challenges:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to load challenges",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const body = (await req.json()) as UpsertChallengePayload;
    const data = normalizePayload(body);
    const resolvedImage = await resolveChallengeImageUrl(
      data.slotName,
      data.provider,
      data.imageUrl,
    );

    const challenge = await prisma.challenge.upsert({
      where: { id: data.id },
      update: {
        title: data.title,
        description: data.description,
        status: data.status,
        challengeType: data.challengeType,
        targetValue: data.targetValue,
        minBet: data.minBet,
        reward: data.reward,
        rules: data.rules,
        slotName: data.slotName,
        provider: data.provider,
        imageUrl: resolvedImage.imageUrl,
        imageSource: resolvedImage.imageSource,
        claimLimit: data.claimLimit,
        requiresProof: data.requiresProof,
        startDate: data.startDate,
        endDate: data.endDate,
      },
      create: {
        ...data,
        imageUrl: resolvedImage.imageUrl,
        imageSource: resolvedImage.imageSource,
      },
      include: {
        claims: {
          select: {
            status: true,
            userId: true,
          },
        },
      },
    });

    return NextResponse.json(serializeChallenge(challenge));
  } catch (error) {
    console.error("Failed to save challenge:", error);

    const status = error instanceof HttpError ? error.status : 500;

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to save challenge",
      },
      { status },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin();

    const { id } = (await req.json()) as { id?: string };

    if (!id?.trim()) {
      return NextResponse.json(
        { error: "Missing challenge id" },
        { status: 400 },
      );
    }

    await prisma.challenge.delete({
      where: { id: id.trim() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete challenge:", error);

    const status = error instanceof HttpError ? error.status : 500;

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to delete challenge",
      },
      { status },
    );
  }
}