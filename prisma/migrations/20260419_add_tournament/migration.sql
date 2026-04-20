CREATE TABLE "Tournament" (
    "id" TEXT NOT NULL DEFAULT 'slot-tournament',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "championName" TEXT,
    "championSlotName" TEXT,
    "bracketSize" INTEGER NOT NULL DEFAULT 8,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TournamentMatch" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "round" INTEGER NOT NULL,
    "matchNumber" INTEGER NOT NULL,
    "leftViewerName" TEXT,
    "rightViewerName" TEXT,
    "leftSlotName" TEXT,
    "rightSlotName" TEXT,
    "leftPayout" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rightPayout" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "winnerSide" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TournamentMatch_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TournamentMatch_tournamentId_round_matchNumber_key" ON "TournamentMatch"("tournamentId", "round", "matchNumber");
CREATE INDEX "TournamentMatch_tournamentId_round_idx" ON "TournamentMatch"("tournamentId", "round");
CREATE INDEX "TournamentMatch_updatedAt_idx" ON "TournamentMatch"("updatedAt");

ALTER TABLE "TournamentMatch"
ADD CONSTRAINT "TournamentMatch_tournamentId_fkey"
FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
