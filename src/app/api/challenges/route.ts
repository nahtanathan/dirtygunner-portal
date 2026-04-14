// FILE: src/app/api/challenges/route.ts

import { NextResponse } from "next/server";

import { challenges as fallbackChallenges } from "@/lib/data/mock-data";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type UpsertChallengePayload = {
  id: string;
  title: string;
  description?: string | null;
  status: "active" | "completed";
  goal: number;
  currentProgress: number;
  reward: string;
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

function normalizePayload(body: UpsertChallengePayload) {
  const startDate = new Date(body.startDate);
  const endDate = new Date(body.endDate);
  const goal = Number(body.goal);
  const currentProgress = Number(body.currentProgress);

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

  if (!Number.isFinite(goal) || goal < 1) {
    throw new HttpError("Goal must be at least 1");
  }

  if (!Number.isFinite(currentProgress) || currentProgress < 0) {
    throw new HttpError("Current progress must be 0 or more");
  }

  return {
    id: body.id.trim(),
    title: body.title.trim(),
    description: body.description?.trim() || null,
    status: body.status === "completed" ? "completed" : "active",
    goal: Math.floor(goal),
    currentProgress: Math.floor(currentProgress),
    reward: body.reward.trim(),
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

function serializeChallenge(challenge: {
  id: string;
  title: string;
  description: string | null;
  status: string;
  goal: number;
  currentProgress: number;
  reward: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: challenge.id,
    title: challenge.title,
    description: challenge.description,
    status: challenge.status === "completed" ? "completed" : "active",
    goal: challenge.goal,
    currentProgress: challenge.currentProgress,
    reward: challenge.reward,
    startDate: challenge.startDate.toISOString(),
    endDate: challenge.endDate.toISOString(),
    createdAt: challenge.createdAt.toISOString(),
    updatedAt: challenge.updatedAt.toISOString(),
  };
}

export async function GET() {
  try {
    const rows = await prisma.challenge.findMany({
      orderBy: [{ status: "asc" }, { endDate: "asc" }, { createdAt: "desc" }],
    });

    if (rows.length === 0) {
      return NextResponse.json(fallbackChallenges);
    }

    return NextResponse.json(rows.map(serializeChallenge));
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

    const challenge = await prisma.challenge.upsert({
      where: { id: data.id },
      update: {
        title: data.title,
        description: data.description,
        status: data.status,
        goal: data.goal,
        currentProgress: data.currentProgress,
        reward: data.reward,
        startDate: data.startDate,
        endDate: data.endDate,
      },
      create: data,
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
      return NextResponse.json({ error: "Missing challenge id" }, { status: 400 });
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