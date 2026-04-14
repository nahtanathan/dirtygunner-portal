// FILE: src/app/api/leaderboard-settings/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type PrizeTierInput = {
  place?: unknown;
  prize?: unknown;
};

type LeaderboardSettingsInput = {
  title?: unknown;
  subtitle?: unknown;
  startDate?: unknown;
  endDate?: unknown;
  prizeTiers?: unknown;
};

function normalizeDate(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date;
}

async function ensureLeaderboardSettings() {
  const existing = await prisma.leaderboardSettings.findUnique({
    where: { id: "leaderboard-settings" },
    include: {
      prizeTiers: {
        orderBy: { place: "asc" },
      },
    },
  });

  if (existing) return existing;

  const now = new Date();
  const weekFromNow = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  return prisma.leaderboardSettings.create({
    data: {
      id: "leaderboard-settings",
      title: "Weekly Roobet Race",
      subtitle: "Top grinders earn premium payouts before the weekly reset.",
      countdownTarget: weekFromNow,
      startDate: now,
      endDate: weekFromNow,
      prizeTiers: {
        create: [
          { place: 1, prize: 300 },
          { place: 2, prize: 200 },
          { place: 3, prize: 150 },
        ],
      },
    },
    include: {
      prizeTiers: {
        orderBy: { place: "asc" },
      },
    },
  });
}

function serialize(settings: {
  title: string;
  subtitle: string;
  startDate: Date | null;
  endDate: Date | null;
  prizeTiers: Array<{ place: number; prize: number }>;
}) {
  const countdownSource = settings.endDate;

  return {
    title: settings.title,
    subtitle: settings.subtitle,
    startDate: settings.startDate
      ? settings.startDate.toISOString().slice(0, 16)
      : "",
    endDate: settings.endDate ? settings.endDate.toISOString().slice(0, 16) : "",
    countdownTarget: countdownSource
      ? countdownSource.toISOString().slice(0, 16)
      : "",
    prizeTiers: settings.prizeTiers.map((tier) => ({
      place: tier.place,
      prize: tier.prize,
    })),
  };
}

export async function GET() {
  const settings = await ensureLeaderboardSettings();

  return NextResponse.json({
    settings: serialize(settings),
  });
}

export async function PUT(req: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { isAdmin: true },
  });

  if (!user?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await req.json().catch(() => null)) as LeaderboardSettingsInput | null;

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const subtitle = typeof body.subtitle === "string" ? body.subtitle.trim() : "";
  const startDate = normalizeDate(body.startDate);
  const endDate = normalizeDate(body.endDate);

  const rawPrizeTiers: PrizeTierInput[] = Array.isArray(body.prizeTiers)
    ? (body.prizeTiers as PrizeTierInput[])
    : [];

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  if (!subtitle) {
    return NextResponse.json({ error: "Subtitle is required" }, { status: 400 });
  }

  if (!startDate) {
    return NextResponse.json({ error: "Start time is required" }, { status: 400 });
  }

  if (!endDate) {
    return NextResponse.json({ error: "End time is required" }, { status: 400 });
  }

  if (startDate >= endDate) {
    return NextResponse.json(
      { error: "End time must be after start time" },
      { status: 400 },
    );
  }

  if (rawPrizeTiers.length === 0) {
    return NextResponse.json(
      { error: "At least one prize tier is required" },
      { status: 400 },
    );
  }

  const prizeTiers = rawPrizeTiers
    .map((tier: PrizeTierInput) => ({
      place: Number(tier.place),
      prize: Number(tier.prize),
    }))
    .filter(
      (tier) =>
        Number.isInteger(tier.place) &&
        tier.place > 0 &&
        Number.isFinite(tier.prize) &&
        tier.prize >= 0,
    )
    .sort((a, b) => a.place - b.place);

  if (prizeTiers.length === 0) {
    return NextResponse.json(
      { error: "Prize tiers are invalid" },
      { status: 400 },
    );
  }

  await prisma.leaderboardSettings.upsert({
    where: { id: "leaderboard-settings" },
    update: {
      title,
      subtitle,
      startDate,
      endDate,
      countdownTarget: endDate,
    },
    create: {
      id: "leaderboard-settings",
      title,
      subtitle,
      startDate,
      endDate,
      countdownTarget: endDate,
    },
  });

  await prisma.leaderboardPrizeTier.deleteMany({
    where: { leaderboardId: "leaderboard-settings" },
  });

  await prisma.leaderboardPrizeTier.createMany({
    data: prizeTiers.map((tier) => ({
      leaderboardId: "leaderboard-settings",
      place: tier.place,
      prize: tier.prize,
    })),
  });

  const settings = await prisma.leaderboardSettings.findUniqueOrThrow({
    where: { id: "leaderboard-settings" },
    include: {
      prizeTiers: {
        orderBy: { place: "asc" },
      },
    },
  });

  return NextResponse.json({
    settings: serialize(settings),
  });
}