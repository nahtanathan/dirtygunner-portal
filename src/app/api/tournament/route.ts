import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import {
  buildTournamentSnapshot,
  createTournamentMatchSeed,
  recomputeTournamentProgress,
  TOURNAMENT_ID,
} from "@/lib/tournament";

type InitializeTournamentPayload = {
  action: "initialize";
  title?: string;
  description?: string | null;
};

type UpdateTournamentPayload = {
  action: "updateTournament";
  title: string;
  description?: string | null;
  status: "draft" | "active" | "completed";
};

type UpdateMatchPayload = {
  action: "updateMatch";
  matchId: string;
  leftViewerName?: string | null;
  rightViewerName?: string | null;
  leftSlotName?: string | null;
  rightSlotName?: string | null;
  leftPayout?: number;
  rightPayout?: number;
};

type SetWinnerPayload = {
  action: "setWinner";
  matchId: string;
  winnerSide: "left" | "right";
  leftViewerName?: string | null;
  rightViewerName?: string | null;
  leftSlotName?: string | null;
  rightSlotName?: string | null;
  leftPayout?: number;
  rightPayout?: number;
};

type ClearWinnerPayload = {
  action: "clearWinner";
  matchId: string;
};

type DeclareChampionPayload = {
  action: "declareChampion";
  championName?: string | null;
  championSlotName?: string | null;
  status?: "draft" | "active" | "completed";
};

type ResetTournamentPayload = {
  action: "resetTournament";
};

type TournamentMutationPayload =
  | InitializeTournamentPayload
  | UpdateTournamentPayload
  | UpdateMatchPayload
  | SetWinnerPayload
  | ClearWinnerPayload
  | DeclareChampionPayload
  | ResetTournamentPayload;

class HttpError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

function normalizeText(value: string | null | undefined) {
  const nextValue = value?.trim();
  return nextValue ? nextValue : null;
}

function normalizePayout(value: number | null | undefined) {
  const nextValue = Number(value ?? 0);
  return Number.isFinite(nextValue) && nextValue >= 0 ? nextValue : 0;
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

async function getTournamentRecord() {
  const tournament = await prisma.tournament.findUnique({
    where: { id: TOURNAMENT_ID },
    include: {
      matches: {
        orderBy: [{ round: "asc" }, { matchNumber: "asc" }],
      },
    },
  });

  return tournament;
}

async function persistBracketState(
  status?: "draft" | "active" | "completed",
  championOverride?: {
    championName: string | null;
    championSlotName: string | null;
  },
) {
  const tournament = await getTournamentRecord();

  if (!tournament) {
    throw new HttpError("Tournament not found", 404);
  }

  const recalculated = recomputeTournamentProgress(
    tournament.matches.map((match) => ({
      id: match.id,
      round: match.round,
      matchNumber: match.matchNumber,
      leftViewerName: match.leftViewerName,
      rightViewerName: match.rightViewerName,
      leftSlotName: match.leftSlotName,
      rightSlotName: match.rightSlotName,
      leftPayout: Number(match.leftPayout),
      rightPayout: Number(match.rightPayout),
      winnerSide:
        match.winnerSide === "left" || match.winnerSide === "right"
          ? match.winnerSide
          : null,
    })),
  );

  await prisma.$transaction(async (tx) => {
    for (const match of recalculated.matches) {
      await tx.tournamentMatch.update({
        where: { id: match.id },
        data: {
          leftViewerName: match.leftViewerName,
          rightViewerName: match.rightViewerName,
          leftSlotName: match.leftSlotName,
          rightSlotName: match.rightSlotName,
          leftPayout: match.leftPayout,
          rightPayout: match.rightPayout,
          winnerSide: match.winnerSide,
        },
      });
    }

    await tx.tournament.update({
      where: { id: TOURNAMENT_ID },
      data: {
        championName:
          championOverride?.championName ?? recalculated.championName,
        championSlotName:
          championOverride?.championSlotName ?? recalculated.championSlotName,
        status:
          status ??
          (recalculated.championName ? "completed" : tournament.status),
      },
    });
  });

  return getTournamentRecord();
}

export async function GET() {
  try {
    const tournament = await getTournamentRecord();
    return NextResponse.json(buildTournamentSnapshot(tournament));
  } catch (error) {
    console.error("Failed to load tournament:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to load tournament",
      },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const body = (await req.json()) as TournamentMutationPayload;

    if (body.action === "initialize") {
      const existingTournament = await prisma.tournament.findUnique({
        where: { id: TOURNAMENT_ID },
        select: { id: true },
      });

      if (existingTournament) {
        throw new HttpError("Tournament already exists");
      }

      await prisma.tournament.create({
        data: {
          id: TOURNAMENT_ID,
          title: normalizeText(body.title) ?? "Slot Tournament",
          description:
            normalizeText(body.description) ??
            "Live bracket control for the current DirtyGunner slot tournament.",
          status: "draft",
          matches: {
            create: createTournamentMatchSeed(TOURNAMENT_ID).map(
              ({ tournamentId, ...match }) => match,
            ),
          },
        },
      });

      const snapshot = buildTournamentSnapshot(await getTournamentRecord());
      return NextResponse.json(snapshot);
    }

    const tournament = await getTournamentRecord();

    if (!tournament) {
      throw new HttpError("Tournament not found", 404);
    }

    if (body.action === "updateTournament") {
      await prisma.tournament.update({
        where: { id: TOURNAMENT_ID },
        data: {
          title: normalizeText(body.title) ?? "Slot Tournament",
          description: normalizeText(body.description),
          status:
            body.status === "active" || body.status === "completed"
              ? body.status
              : "draft",
        },
      });

      return NextResponse.json(buildTournamentSnapshot(await getTournamentRecord()));
    }

    if (body.action === "updateMatch") {
      const match = tournament.matches.find((item) => item.id === body.matchId);

      if (!match) {
        throw new HttpError("Match not found", 404);
      }

      await prisma.tournamentMatch.update({
        where: { id: match.id },
        data: {
          leftViewerName:
            match.round === 1
              ? normalizeText(body.leftViewerName)
              : match.leftViewerName,
          rightViewerName:
            match.round === 1
              ? normalizeText(body.rightViewerName)
              : match.rightViewerName,
          leftSlotName:
            match.round === 1
              ? normalizeText(body.leftSlotName)
              : match.leftSlotName,
          rightSlotName:
            match.round === 1
              ? normalizeText(body.rightSlotName)
              : match.rightSlotName,
          leftPayout: normalizePayout(body.leftPayout),
          rightPayout: normalizePayout(body.rightPayout),
        },
      });

      return NextResponse.json(buildTournamentSnapshot(await persistBracketState()));
    }

    if (body.action === "setWinner") {
      const match = tournament.matches.find((item) => item.id === body.matchId);

      if (!match) {
        throw new HttpError("Match not found", 404);
      }

      const nextLeftViewerName =
        match.round === 1
          ? normalizeText(body.leftViewerName)
          : match.leftViewerName;
      const nextRightViewerName =
        match.round === 1
          ? normalizeText(body.rightViewerName)
          : match.rightViewerName;
      const nextLeftSlotName =
        match.round === 1 ? normalizeText(body.leftSlotName) : match.leftSlotName;
      const nextRightSlotName =
        match.round === 1
          ? normalizeText(body.rightSlotName)
          : match.rightSlotName;
      const winnerSide = body.winnerSide === "right" ? "right" : "left";
      const winnerName =
        winnerSide === "left" ? nextLeftViewerName : nextRightViewerName;

      if (!normalizeText(winnerName)) {
        throw new HttpError("Pick a seeded side before setting a winner");
      }

      await prisma.tournamentMatch.update({
        where: { id: match.id },
        data: {
          leftViewerName: nextLeftViewerName,
          rightViewerName: nextRightViewerName,
          leftSlotName: nextLeftSlotName,
          rightSlotName: nextRightSlotName,
          leftPayout: normalizePayout(body.leftPayout ?? match.leftPayout),
          rightPayout: normalizePayout(body.rightPayout ?? match.rightPayout),
          winnerSide,
        },
      });

      return NextResponse.json(buildTournamentSnapshot(await persistBracketState("active")));
    }

    if (body.action === "clearWinner") {
      const match = tournament.matches.find((item) => item.id === body.matchId);

      if (!match) {
        throw new HttpError("Match not found", 404);
      }

      await prisma.tournamentMatch.update({
        where: { id: match.id },
        data: {
          winnerSide: null,
        },
      });

      return NextResponse.json(buildTournamentSnapshot(await persistBracketState("active")));
    }

    if (body.action === "declareChampion") {
      const snapshot = await persistBracketState(
        body.status === "draft" || body.status === "active"
          ? body.status
          : "completed",
        {
          championName: normalizeText(body.championName),
          championSlotName: normalizeText(body.championSlotName),
        },
      );

      return NextResponse.json(buildTournamentSnapshot(snapshot));
    }

    if (body.action === "resetTournament") {
      await prisma.$transaction(async (tx) => {
        await tx.tournament.update({
          where: { id: TOURNAMENT_ID },
          data: {
            status: "draft",
            championName: null,
            championSlotName: null,
          },
        });

        for (const match of tournament.matches) {
          await tx.tournamentMatch.update({
            where: { id: match.id },
            data: {
              leftViewerName: match.round === 1 ? null : match.leftViewerName,
              rightViewerName: match.round === 1 ? null : match.rightViewerName,
              leftSlotName: match.round === 1 ? null : match.leftSlotName,
              rightSlotName: match.round === 1 ? null : match.rightSlotName,
              leftPayout: 0,
              rightPayout: 0,
              winnerSide: null,
            },
          });
        }
      });

      return NextResponse.json(buildTournamentSnapshot(await persistBracketState("draft")));
    }

    throw new HttpError("Unsupported tournament action");
  } catch (error) {
    console.error("Failed to update tournament:", error);

    const status = error instanceof HttpError ? error.status : 500;

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update tournament",
      },
      { status },
    );
  }
}
