export type TournamentStatus = "draft" | "active" | "completed";
export type TournamentWinnerSide = "left" | "right" | null;

export type TournamentMatchSnapshot = {
  id: string;
  round: number;
  matchNumber: number;
  roundLabel: string;
  label: string;
  leftViewerName: string | null;
  rightViewerName: string | null;
  leftSlotName: string | null;
  rightSlotName: string | null;
  leftPayout: number;
  rightPayout: number;
  winnerSide: TournamentWinnerSide;
  updatedAt: string;
};

export type TournamentSnapshot = {
  id: string;
  title: string;
  description: string;
  status: TournamentStatus;
  prizeAmount: number;
  championName: string | null;
  championSlotName: string | null;
  bracketSize: number;
  updatedAt: string;
  matches: TournamentMatchSnapshot[];
};

export type EditableTournamentMatch = {
  id: string;
  round: number;
  matchNumber: number;
  leftViewerName: string | null;
  rightViewerName: string | null;
  leftSlotName: string | null;
  rightSlotName: string | null;
  leftPayout: number;
  rightPayout: number;
  winnerSide: TournamentWinnerSide;
};

export const TOURNAMENT_ID = "slot-tournament";

export const TOURNAMENT_ROUNDS = [
  { round: 1, label: "Quarterfinals", matchCount: 4 },
  { round: 2, label: "Semifinals", matchCount: 2 },
  { round: 3, label: "Final", matchCount: 1 },
] as const;

const TOURNAMENT_FEEDS: Record<
  string,
  {
    left?: { round: number; matchNumber: number };
    right?: { round: number; matchNumber: number };
  }
> = {
  "2-1": {
    left: { round: 1, matchNumber: 1 },
    right: { round: 1, matchNumber: 2 },
  },
  "2-2": {
    left: { round: 1, matchNumber: 3 },
    right: { round: 1, matchNumber: 4 },
  },
  "3-1": {
    left: { round: 2, matchNumber: 1 },
    right: { round: 2, matchNumber: 2 },
  },
};

function makeKey(round: number, matchNumber: number) {
  return `${round}-${matchNumber}`;
}

function getRoundLabel(round: number) {
  return (
    TOURNAMENT_ROUNDS.find((item) => item.round === round)?.label ?? `Round ${round}`
  );
}

function getMatchLabel(round: number, matchNumber: number) {
  const roundLabel = getRoundLabel(round);
  if (round === 3) {
    return roundLabel;
  }

  return `${roundLabel} ${matchNumber}`;
}

function normalizeName(value: string | null | undefined) {
  const nextValue = value?.trim();
  return nextValue ? nextValue : null;
}

function normalizePayout(value: number | null | undefined) {
  const nextValue = Number(value ?? 0);
  return Number.isFinite(nextValue) && nextValue >= 0 ? nextValue : 0;
}

const PRIZE_PREFIX = "PRIZE::";

export function encodeTournamentPrizeAmount(value: number | null | undefined) {
  return `${PRIZE_PREFIX}${normalizePayout(value)}`;
}

export function parseTournamentPrizeAmount(value: string | null | undefined) {
  const nextValue = value?.trim();

  if (!nextValue?.startsWith(PRIZE_PREFIX)) {
    return 0;
  }

  return normalizePayout(Number(nextValue.slice(PRIZE_PREFIX.length)));
}

function getWinnerPayload(match: EditableTournamentMatch) {
  if (match.winnerSide === "left") {
    return {
      viewerName: normalizeName(match.leftViewerName),
      slotName: normalizeName(match.leftSlotName),
    };
  }

  if (match.winnerSide === "right") {
    return {
      viewerName: normalizeName(match.rightViewerName),
      slotName: normalizeName(match.rightSlotName),
    };
  }

  return { viewerName: null, slotName: null };
}

export function createTournamentMatchSeed(tournamentId: string) {
  return TOURNAMENT_ROUNDS.flatMap((roundConfig) =>
    Array.from({ length: roundConfig.matchCount }).map((_, index) => ({
      tournamentId,
      round: roundConfig.round,
      matchNumber: index + 1,
      leftViewerName: null,
      rightViewerName: null,
      leftSlotName: null,
      rightSlotName: null,
      leftPayout: 0,
      rightPayout: 0,
      winnerSide: null,
    })),
  );
}

export function recomputeTournamentProgress(matches: EditableTournamentMatch[]) {
  const nextMatches = matches
    .map((match) => ({
      ...match,
      leftViewerName: normalizeName(match.leftViewerName),
      rightViewerName: normalizeName(match.rightViewerName),
      leftSlotName: normalizeName(match.leftSlotName),
      rightSlotName: normalizeName(match.rightSlotName),
      leftPayout: normalizePayout(match.leftPayout),
      rightPayout: normalizePayout(match.rightPayout),
      winnerSide:
        match.winnerSide === "left" || match.winnerSide === "right"
          ? match.winnerSide
          : null,
    }))
    .sort((left, right) => {
      if (left.round !== right.round) {
        return left.round - right.round;
      }

      return left.matchNumber - right.matchNumber;
    });

  const byKey = new Map(
    nextMatches.map((match) => [makeKey(match.round, match.matchNumber), match]),
  );

  for (const match of nextMatches) {
    if (match.round === 1) {
      continue;
    }

    const feeds = TOURNAMENT_FEEDS[makeKey(match.round, match.matchNumber)];

    if (!feeds) {
      continue;
    }

    const leftSource = feeds.left
      ? byKey.get(makeKey(feeds.left.round, feeds.left.matchNumber))
      : null;
    const rightSource = feeds.right
      ? byKey.get(makeKey(feeds.right.round, feeds.right.matchNumber))
      : null;
    const leftWinner = leftSource ? getWinnerPayload(leftSource) : null;
    const rightWinner = rightSource ? getWinnerPayload(rightSource) : null;

    match.leftViewerName = leftWinner?.viewerName ?? null;
    match.leftSlotName = leftWinner?.slotName ?? null;
    match.rightViewerName = rightWinner?.viewerName ?? null;
    match.rightSlotName = rightWinner?.slotName ?? null;

    if (
      (match.winnerSide === "left" && !match.leftViewerName) ||
      (match.winnerSide === "right" && !match.rightViewerName)
    ) {
      match.winnerSide = null;
    }
  }

  const finalMatch = byKey.get("3-1");
  const finalWinner = finalMatch ? getWinnerPayload(finalMatch) : null;

  return {
    matches: nextMatches,
    championName: finalWinner?.viewerName ?? null,
    championSlotName: finalWinner?.slotName ?? null,
  };
}

export function buildTournamentSnapshot(
  tournament:
    | {
        id: string;
        title: string;
        description: string | null;
        status: string;
        championName: string | null;
        championSlotName: string | null;
        bracketSize: number;
        updatedAt: Date;
        matches: Array<{
          id: string;
          round: number;
          matchNumber: number;
          leftViewerName: string | null;
          rightViewerName: string | null;
          leftSlotName: string | null;
          rightSlotName: string | null;
          leftPayout: number;
          rightPayout: number;
          winnerSide: string | null;
          updatedAt: Date;
        }>;
      }
    | null,
): TournamentSnapshot | null {
  if (!tournament) {
    return null;
  }

  return {
    id: tournament.id,
    title: tournament.title,
    description: tournament.description ?? "",
    status:
      tournament.status === "active" || tournament.status === "completed"
        ? tournament.status
        : "draft",
    prizeAmount: parseTournamentPrizeAmount(tournament.description),
    championName: tournament.championName,
    championSlotName: tournament.championSlotName,
    bracketSize: tournament.bracketSize,
    updatedAt: tournament.updatedAt.toISOString(),
    matches: [...tournament.matches]
      .sort((left, right) => {
        if (left.round !== right.round) {
          return left.round - right.round;
        }

        return left.matchNumber - right.matchNumber;
      })
      .map((match) => ({
        id: match.id,
        round: match.round,
        matchNumber: match.matchNumber,
        roundLabel: getRoundLabel(match.round),
        label: getMatchLabel(match.round, match.matchNumber),
        leftViewerName: match.leftViewerName,
        rightViewerName: match.rightViewerName,
        leftSlotName: match.leftSlotName,
        rightSlotName: match.rightSlotName,
        leftPayout: normalizePayout(match.leftPayout),
        rightPayout: normalizePayout(match.rightPayout),
        winnerSide:
          match.winnerSide === "left" || match.winnerSide === "right"
            ? match.winnerSide
            : null,
        updatedAt: match.updatedAt.toISOString(),
      })),
  };
}
