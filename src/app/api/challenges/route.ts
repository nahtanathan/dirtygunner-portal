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

class HttpError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

function slugifySlotName(value: string) {
  return value
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function resolveChallengeImageUrl(
  slotName?: string | null,
  manualImageUrl?: string | null,
) {
  if (manualImageUrl?.trim()) {
    return {
      imageUrl: manualImageUrl.trim(),
      imageSource: "manual",
    };
  }

  if (!slotName?.trim()) {
    return {
      imageUrl: null,
      imageSource: null,
    };
  }

  const slug = slugifySlotName(slotName);
  const url = `https://slotcatalog.com/en/slots/${slug}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "text/html",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(7000),
    });

    if (!response.ok) {
      return {
        imageUrl: null,
        imageSource: null,
      };
    }

    const html = await response.text();

    const match =
      html.match(
        /<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i,
      ) ??
      html.match(
        /<meta\s+name=["']twitter:image["']\s+content=["']([^"']+)["']/i,
      );

    const imageUrl = match?.[1]?.trim();

    if (!imageUrl) {
      return {
        imageUrl: null,
        imageSource: null,
      };
    }

    return {
      imageUrl,
      imageSource: "slotcatalog-auto",
    };
  } catch {
    return {
      imageUrl: null,
      imageSource: null,
    };
  }
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