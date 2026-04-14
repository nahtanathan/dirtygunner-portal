// FILE: src/app/api/raffles/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type UpsertRafflePayload = {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  status: "active" | "ended";
  entryMethod: string;
  entryCost?: number;
  entryCurrency?: "bullets" | "points";
  maxEntriesPerUser?: number | null;
  totalEntries?: number;
  startDate: string;
  endDate: string;
  winner?: string | null;
  prizeDetails: string;
};

type EnterRafflePayload = {
  action: "enter";
  raffleId: string;
  quantity?: number;
};

type PickWinnerPayload = {
  action: "pickWinner";
  raffleId: string;
};

type RerollWinnerPayload = {
  action: "rerollWinner";
  raffleId: string;
};

type ClearWinnerPayload = {
  action: "clearWinner";
  raffleId: string;
};

type RaffleActionPayload =
  | EnterRafflePayload
  | PickWinnerPayload
  | RerollWinnerPayload
  | ClearWinnerPayload;

class HttpError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

function normalizePayload(body: UpsertRafflePayload) {
  const startDate = new Date(body.startDate);
  const endDate = new Date(body.endDate);
  const entryCost = Number(body.entryCost ?? 0);
  const maxEntriesPerUser =
    body.maxEntriesPerUser === null ||
    body.maxEntriesPerUser === undefined ||
    body.maxEntriesPerUser === ("" as never)
      ? null
      : Number(body.maxEntriesPerUser);

  if (!body.id?.trim()) {
    throw new HttpError("Missing raffle id");
  }

  if (!body.title?.trim()) {
    throw new HttpError("Title is required");
  }

  if (!body.entryMethod?.trim()) {
    throw new HttpError("Entry method is required");
  }

  if (!body.prizeDetails?.trim()) {
    throw new HttpError("Prize details are required");
  }

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new HttpError("Invalid raffle dates");
  }

  if (!Number.isFinite(entryCost) || entryCost < 0) {
    throw new HttpError("Entry cost must be 0 or more");
  }

  if (
    maxEntriesPerUser !== null &&
    (!Number.isFinite(maxEntriesPerUser) || maxEntriesPerUser < 1)
  ) {
    throw new HttpError("Max entries per user must be at least 1");
  }

  return {
    id: body.id.trim(),
    title: body.title.trim(),
    description: body.description?.trim() || null,
    image: body.image?.trim() || null,
    status: body.status,
    entryMethod: body.entryMethod.trim(),
    entryCost,
    entryCurrency: body.entryCurrency === "points" ? "points" : "bullets",
    maxEntriesPerUser,
    totalEntries: Number(body.totalEntries ?? 0) || 0,
    startDate,
    endDate,
    winner: body.winner?.trim() || null,
    prizeDetails: body.prizeDetails.trim(),
  };
}

function formatWinnerName(entry: {
  user: { display_name: string | null; kick_username: string | null; id: string };
}) {
  return (
    entry.user.display_name ||
    entry.user.kick_username ||
    `User ${entry.user.id.slice(0, 8)}`
  );
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

async function chooseWinnerForRaffle(
  raffleId: string,
  options?: { forceReroll?: boolean; endRaffle?: boolean },
) {
  const raffle = await prisma.raffle.findUnique({
    where: { id: raffleId },
    include: {
      entries: {
        include: {
          user: {
            select: {
              id: true,
              display_name: true,
              kick_username: true,
            },
          },
        },
      },
    },
  });

  if (!raffle) {
    throw new HttpError("Raffle not found", 404);
  }

  let winner: string | null = raffle.winner;

  if (options?.forceReroll || !winner) {
    if (raffle.entries.length === 0) {
      winner = "No Entries";
    } else {
      const winningEntry =
        raffle.entries[Math.floor(Math.random() * raffle.entries.length)];
      winner = formatWinnerName(winningEntry);
    }
  }

  const updated = await prisma.raffle.update({
    where: { id: raffle.id },
    data: {
      winner,
      status: options?.endRaffle ? "ended" : raffle.status,
      totalEntries: raffle.entries.length,
    },
  });

  return updated;
}

async function syncExpiredRaffles() {
  const now = new Date();

  const expiredActiveRaffles = await prisma.raffle.findMany({
    where: {
      status: "active",
      endDate: {
        lte: now,
      },
    },
    select: {
      id: true,
    },
  });

  for (const raffle of expiredActiveRaffles) {
    await chooseWinnerForRaffle(raffle.id, {
      forceReroll: false,
      endRaffle: true,
    });
  }
}

export async function GET() {
  try {
    await syncExpiredRaffles();

    const session = await getSession();

    const [viewer, raffles] = await Promise.all([
      session?.sub
        ? prisma.user.findUnique({
            where: { id: session.sub },
            select: {
              id: true,
              points: true,
            },
          })
        : Promise.resolve(null),
      prisma.raffle.findMany({
        orderBy: [{ status: "asc" }, { endDate: "asc" }, { createdAt: "desc" }],
        include: {
          entries: {
            orderBy: [{ createdAt: "desc" }],
            select: {
              id: true,
              userId: true,
              cost: true,
              currency: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  display_name: true,
                  kick_username: true,
                  points: true,
                },
              },
            },
          },
        },
      }),
    ]);

    const result = raffles.map((raffle) => {
      const totalEntries = raffle.entries.length;
      const uniqueEntrantIds = new Set(raffle.entries.map((entry) => entry.userId));
      const uniqueEntrants = uniqueEntrantIds.size;
      const totalSpent = raffle.entries.reduce((sum, entry) => sum + entry.cost, 0);
      const currentUserEntries = viewer
        ? raffle.entries.filter((entry) => entry.userId === viewer.id).length
        : 0;

      const entrantMap = new Map<
        string,
        {
          userId: string;
          displayName: string;
          kickUsername: string | null;
          entryCount: number;
          totalSpent: number;
          pointsRemaining: number | null;
          lastEnteredAt: string;
        }
      >();

      for (const entry of raffle.entries) {
        const existing = entrantMap.get(entry.userId);

        const displayName =
          entry.user.display_name ||
          entry.user.kick_username ||
          `User ${entry.user.id.slice(0, 8)}`;

        if (existing) {
          existing.entryCount += 1;
          existing.totalSpent += entry.cost;

          if (new Date(entry.createdAt).getTime() > new Date(existing.lastEnteredAt).getTime()) {
            existing.lastEnteredAt = entry.createdAt.toISOString();
          }
        } else {
          entrantMap.set(entry.userId, {
            userId: entry.userId,
            displayName,
            kickUsername: entry.user.kick_username,
            entryCount: 1,
            totalSpent: entry.cost,
            pointsRemaining: entry.user.points ?? null,
            lastEnteredAt: entry.createdAt.toISOString(),
          });
        }
      }

      const entrants = Array.from(entrantMap.values()).sort((a, b) => {
        if (b.entryCount !== a.entryCount) {
          return b.entryCount - a.entryCount;
        }
        return (
          new Date(b.lastEnteredAt).getTime() - new Date(a.lastEnteredAt).getTime()
        );
      });

      return {
        id: raffle.id,
        title: raffle.title,
        description: raffle.description,
        image: raffle.image,
        status: raffle.status,
        entryMethod: raffle.entryMethod,
        entryCost: raffle.entryCost,
        entryCurrency: raffle.entryCurrency,
        maxEntriesPerUser: raffle.maxEntriesPerUser,
        totalEntries,
        uniqueEntrants,
        totalSpent,
        entrants,
        currentUserEntries,
        currentUserPoints: viewer?.points ?? null,
        startDate: raffle.startDate,
        endDate: raffle.endDate,
        winner: raffle.winner,
        prizeDetails: raffle.prizeDetails,
        createdAt: raffle.createdAt,
        updatedAt: raffle.updatedAt,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to load raffles:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to load raffles",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as UpsertRafflePayload | RaffleActionPayload;

    if ("action" in body && body.action === "enter") {
      const session = await getSession();

      if (!session?.sub) {
        throw new HttpError("You must be logged in to enter this raffle", 401);
      }

      const quantity = Math.max(1, Math.floor(Number(body.quantity ?? 1)));

      const result = await prisma.$transaction(async (tx) => {
        const [user, raffle] = await Promise.all([
          tx.user.findUnique({
            where: { id: session.sub },
            select: {
              id: true,
              points: true,
              display_name: true,
              kick_username: true,
              isAdmin: true,
            },
          }),
          tx.raffle.findUnique({
            where: { id: body.raffleId },
            select: {
              id: true,
              status: true,
              entryCost: true,
              entryCurrency: true,
              maxEntriesPerUser: true,
              startDate: true,
              endDate: true,
              totalEntries: true,
            },
          }),
        ]);

        if (!user) {
          throw new HttpError("You must be logged in to enter this raffle", 401);
        }

        if (!raffle) {
          throw new HttpError("Raffle not found", 404);
        }

        const now = new Date();

        if (raffle.status !== "active") {
          throw new HttpError("This raffle is not active");
        }

        if (raffle.startDate.getTime() > now.getTime()) {
          throw new HttpError("This raffle has not started yet");
        }

        if (raffle.endDate.getTime() <= now.getTime()) {
          throw new HttpError("This raffle has already ended");
        }

        const existingEntries = await tx.raffleEntry.count({
          where: {
            raffleId: raffle.id,
            userId: user.id,
          },
        });

        if (
          raffle.maxEntriesPerUser !== null &&
          existingEntries >= raffle.maxEntriesPerUser
        ) {
          throw new HttpError("You already reached the max entries for this raffle");
        }

        const allowedQuantity =
          raffle.maxEntriesPerUser !== null
            ? Math.min(quantity, raffle.maxEntriesPerUser - existingEntries)
            : quantity;

        if (allowedQuantity <= 0) {
          throw new HttpError("No more entries available for this user");
        }

        const totalCost = raffle.entryCost * allowedQuantity;

        if (user.points < totalCost) {
          throw new HttpError(
            `Not enough ${raffle.entryCurrency}. You need ${totalCost}.`,
          );
        }

        if (totalCost > 0) {
          await tx.user.update({
            where: { id: user.id },
            data: {
              points: {
                decrement: totalCost,
              },
            },
          });
        }

        await tx.raffleEntry.createMany({
          data: Array.from({ length: allowedQuantity }).map(() => ({
            raffleId: raffle.id,
            userId: user.id,
            cost: raffle.entryCost,
            currency: raffle.entryCurrency,
          })),
        });

        const [updatedUser, updatedEntryCount] = await Promise.all([
          tx.user.findUnique({
            where: { id: user.id },
            select: {
              points: true,
            },
          }),
          tx.raffleEntry.count({
            where: {
              raffleId: raffle.id,
            },
          }),
        ]);

        await tx.raffle.update({
          where: { id: raffle.id },
          data: {
            totalEntries: updatedEntryCount,
          },
        });

        return {
          ok: true,
          raffleId: raffle.id,
          quantityAdded: allowedQuantity,
          totalEntries: updatedEntryCount,
          userEntries: existingEntries + allowedQuantity,
          pointsRemaining: updatedUser?.points ?? user.points - totalCost,
          entryCurrency: raffle.entryCurrency,
        };
      });

      return NextResponse.json(result);
    }

    await requireAdmin();

    if ("action" in body && body.action === "pickWinner") {
      const raffle = await chooseWinnerForRaffle(body.raffleId, {
        forceReroll: false,
        endRaffle: true,
      });

      return NextResponse.json({
        ok: true,
        raffleId: raffle.id,
        winner: raffle.winner,
        status: raffle.status,
      });
    }

    if ("action" in body && body.action === "rerollWinner") {
      const raffle = await chooseWinnerForRaffle(body.raffleId, {
        forceReroll: true,
        endRaffle: true,
      });

      return NextResponse.json({
        ok: true,
        raffleId: raffle.id,
        winner: raffle.winner,
        status: raffle.status,
      });
    }

    if ("action" in body && body.action === "clearWinner") {
      const raffle = await prisma.raffle.update({
        where: { id: body.raffleId },
        data: {
          winner: null,
          status: "active",
        },
      });

      return NextResponse.json({
        ok: true,
        raffleId: raffle.id,
        winner: raffle.winner,
        status: raffle.status,
      });
    }

    const data = normalizePayload(body);

    const raffle = await prisma.raffle.upsert({
      where: { id: data.id },
      update: {
        title: data.title,
        description: data.description,
        image: data.image,
        status: data.status,
        entryMethod: data.entryMethod,
        entryCost: data.entryCost,
        entryCurrency: data.entryCurrency,
        maxEntriesPerUser: data.maxEntriesPerUser,
        startDate: data.startDate,
        endDate: data.endDate,
        winner: data.winner,
        prizeDetails: data.prizeDetails,
      },
      create: data,
    });

    return NextResponse.json(raffle);
  } catch (error) {
    console.error("Failed to save raffle:", error);

    const status = error instanceof HttpError ? error.status : 500;

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to save raffle",
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
      return NextResponse.json({ error: "Missing raffle id" }, { status: 400 });
    }

    await prisma.raffle.delete({
      where: { id: id.trim() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete raffle:", error);

    const status = error instanceof HttpError ? error.status : 500;

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to delete raffle",
      },
      { status },
    );
  }
}