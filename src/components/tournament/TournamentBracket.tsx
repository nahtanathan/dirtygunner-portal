"use client";

import type { ReactNode } from "react";
import { Crown, Radio, Swords, Trophy } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { TournamentMatchSnapshot, TournamentSnapshot } from "@/lib/tournament";

type TournamentBracketProps = {
  tournament: TournamentSnapshot;
  mode?: "public" | "admin";
  showRefreshHint?: boolean;
};

const STAGE_WIDTH = 1920;
const STAGE_HEIGHT = 1080;
const BOX_W = 160;
const BOX_H = 58;
const CHAMP_W = 255;
const CHAMP_H = 75;

const MATCH_POSITIONS = {
  "1-1-left": { x: 5, y: 245 },
  "1-1-right": { x: 1, y: 405 },
  "1-2-left": { x: 1, y: 565 },
  "1-2-right": { x: 1, y: 720 },
  "2-1-left": { x: 265, y: 330 },
  "2-1-right": { x: 265, y: 650 },
  "3-1-left": { x: 540, y: 500 },
  "1-3-left": { x: 1750, y: 245 },
  "1-3-right": { x: 1750, y: 405 },
  "1-4-left": { x: 1750, y: 565 },
  "1-4-right": { x: 1750, y: 720 },
  "2-2-left": { x: 1480, y: 330 },
  "2-2-right": { x: 1480, y: 650 },
  "3-1-right": { x: 1200, y: 500 },
} as const;

type MatchPositionKey = keyof typeof MATCH_POSITIONS;

const CONNECTORS = [
  {
    path: "M165 274 H212 V359 H265 M165 434 H212 V359 H265",
    tone: "quarter",
  },
  {
    path: "M161 594 H212 V679 H265 M161 749 H212 V679 H265",
    tone: "quarter",
  },
  {
    path: "M425 359 H486 V529 H540 M425 679 H486 V529 H540",
    tone: "semi",
  },
  {
    path: "M1750 274 H1708 V359 H1640 M1750 434 H1708 V359 H1640",
    tone: "quarter",
  },
  {
    path: "M1750 594 H1708 V679 H1640 M1750 749 H1708 V679 H1640",
    tone: "quarter",
  },
  {
    path: "M1480 359 H1438 V529 H1360 M1480 679 H1438 V529 H1360",
    tone: "semi",
  },
  {
    path: "M700 529 H820 M1360 529 H1075",
    tone: "final",
  },
] as const;

const ROUND_COLORS = {
  quarter: {
    border: "rgba(255,170,0,0.45)",
    glow: "rgba(255,170,0,0.2)",
    line: "rgba(255,170,0,0.72)",
    text: "text-amber-200/92",
  },
  semi: {
    border: "rgba(189,22,255,0.42)",
    glow: "rgba(189,22,255,0.18)",
    line: "rgba(189,22,255,0.72)",
    text: "text-fuchsia-200/92",
  },
  final: {
    border: "rgba(52,211,153,0.42)",
    glow: "rgba(16,185,129,0.16)",
    line: "rgba(52,211,153,0.78)",
    text: "text-emerald-200/92",
  },
  champion: {
    border: "rgba(56,189,248,0.42)",
    glow: "rgba(59,130,246,0.2)",
    line: "rgba(56,189,248,0.78)",
    text: "text-sky-200/96",
  },
} as const;

function formatCurrency(value: number) {
  if (!value) {
    return "$0";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

function getMatchByRound(
  tournament: TournamentSnapshot,
  round: number,
  matchNumber: number,
) {
  return (
    tournament.matches.find(
      (match) => match.round === round && match.matchNumber === matchNumber,
    ) ?? null
  );
}

function getMatchTone(round: number) {
  if (round === 1) {
    return "quarter";
  }

  if (round === 2) {
    return "semi";
  }

  return "final";
}

function getDisplayLabel(viewerName: string | null, slotName: string | null) {
  return (slotName || viewerName || "AWAITING").toUpperCase();
}

function getDisplaySubline(viewerName: string | null, slotName: string | null) {
  if (slotName && viewerName) {
    return viewerName;
  }

  if (slotName) {
    return "DIRTYGUNNER ENTRY";
  }

  if (viewerName) {
    return "VIEWER";
  }

  return "WAITING ON RESULT";
}

function getRoundPill(match: TournamentMatchSnapshot | null) {
  if (!match) {
    return "PENDING";
  }

  if (match.winnerSide) {
    return match.winnerSide === "left" ? "LEFT WON" : "RIGHT WON";
  }

  return "LIVE";
}

function getMatchPosition(
  round: number,
  matchNumber: number,
  side: "left" | "right",
) {
  return MATCH_POSITIONS[
    `${round}-${matchNumber}-${side}` as MatchPositionKey
  ];
}

export function TournamentBracket({
  tournament,
  mode = "public",
  showRefreshHint = false,
}: TournamentBracketProps) {
  const isPublic = mode === "public";
  const quarterfinals = [
    getMatchByRound(tournament, 1, 1),
    getMatchByRound(tournament, 1, 2),
    getMatchByRound(tournament, 1, 3),
    getMatchByRound(tournament, 1, 4),
  ];
  const semifinals = [
    getMatchByRound(tournament, 2, 1),
    getMatchByRound(tournament, 2, 2),
  ];
  const finalMatch = getMatchByRound(tournament, 3, 1);
  const completedMatches = tournament.matches.filter((match) => match.winnerSide).length;

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[12px] border border-white/10",
        isPublic ? "min-h-[760px]" : "min-h-[680px]",
      )}
      style={{
        background: isPublic
          ? "linear-gradient(180deg, rgba(4,9,18,0.96) 0%, rgba(6,11,21,0.98) 45%, rgba(4,8,15,1) 100%)"
          : "linear-gradient(180deg, rgba(8,12,22,0.96) 0%, rgba(7,11,18,0.98) 100%)",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.05), 0 35px 90px rgba(2,8,23,0.5)",
      }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url('/art/bg-grid.png'), radial-gradient(circle at 15% 50%, rgba(249,115,22,0.12), transparent 30%), radial-gradient(circle at 50% 55%, rgba(56,189,248,0.16), transparent 34%), radial-gradient(circle at 82% 48%, rgba(59,130,246,0.14), transparent 30%)",
            backgroundSize: "480px 480px, auto, auto, auto",
            backgroundPosition: "center, left center, center center, right center",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: "url('/art/bg-topo.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className={cn(
            "absolute inset-y-0 right-0 w-[42%] opacity-[0.18]",
            isPublic ? "block" : "hidden md:block",
          )}
          style={{
            backgroundImage: "url('/art/hero-operator.webp')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "right center",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.17]"
          style={{
            backgroundImage: "url('/art/sidebar-warzone.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            mixBlendMode: "screen",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            background:
              "linear-gradient(90deg, rgba(3,7,14,0.96) 0%, rgba(3,7,14,0.4) 20%, rgba(3,7,14,0.12) 50%, rgba(3,7,14,0.45) 80%, rgba(3,7,14,0.96) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 border-b border-white/8 px-5 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-300/78">
              Mission Control
            </div>
            <h2
              className={cn(
                "mt-2 font-black uppercase tracking-[0.06em] text-white",
                isPublic ? "text-3xl sm:text-4xl lg:text-5xl" : "text-2xl sm:text-3xl",
              )}
            >
              {tournament.title}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/58 sm:text-[15px]">
              {tournament.description || "Live bracket control and viewer-facing event progression."}
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <InfoBadge
                icon={<Swords className="h-3.5 w-3.5" />}
                label="Matches"
                value={`${completedMatches}/${tournament.matches.length}`}
                tone="neutral"
              />
              <InfoBadge
                icon={<Radio className="h-3.5 w-3.5" />}
                label="Status"
                value={tournament.status.toUpperCase()}
                tone={tournament.status === "completed" ? "final" : "live"}
              />
              <InfoBadge
                icon={<Crown className="h-3.5 w-3.5" />}
                label="Champion"
                value={(tournament.championName || "Pending").toUpperCase()}
                tone={tournament.championName ? "champion" : "neutral"}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:min-w-[420px]">
            <MiniColumn title="Quarterfinals" value={`${quarterfinals.filter(Boolean).length}/4`} tint="quarter" />
            <MiniColumn title="Semifinals" value={`${semifinals.filter(Boolean).length}/2`} tint="semi" />
            <MiniColumn title="Final" value={finalMatch ? getRoundPill(finalMatch) : "PENDING"} tint="final" />
          </div>
        </div>
      </div>

      <div className="relative z-10 px-3 pb-4 pt-4 sm:px-4 lg:px-6 lg:pb-6">
        <div className="overflow-x-auto">
          <div className="min-w-[1120px]">
            <div
              className="relative mx-auto aspect-[16/9] w-full overflow-hidden rounded-[10px] border border-white/8"
              style={{
                background:
                  "linear-gradient(180deg, rgba(5,10,18,0.84) 0%, rgba(4,9,16,0.9) 100%)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.04), inset 0 0 50px rgba(56,189,248,0.05)",
              }}
            >
              <div className="pointer-events-none absolute inset-0">
                <svg
                  viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`}
                  className="absolute inset-0 h-full w-full"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {CONNECTORS.map((connector) => {
                    const tone =
                      connector.tone === "quarter"
                        ? ROUND_COLORS.quarter
                        : connector.tone === "semi"
                          ? ROUND_COLORS.semi
                          : ROUND_COLORS.final;

                    return (
                      <path
                        key={connector.path}
                        d={connector.path}
                        stroke={tone.line}
                        strokeWidth="3"
                        strokeLinecap="square"
                        opacity="0.82"
                      />
                    );
                  })}
                </svg>

                <div className="absolute left-[calc(50%-160px)] top-[16%] h-px w-80 bg-sky-300/35" />
                <div className="absolute left-[calc(50%-210px)] top-[18%] h-[420px] w-[420px] rounded-full border border-sky-400/10 blur-[2px]" />
              </div>

              <RoundMarker title="Quarterfinal" subtitle="Left Wing" x={26} y={188} align="left" />
              <RoundMarker title="Quarterfinal" subtitle="Right Wing" x={1670} y={188} align="right" />
              <RoundMarker title="Semifinal" subtitle="Upper Feed" x={286} y={274} align="left" />
              <RoundMarker title="Semifinal" subtitle="Upper Feed" x={1460} y={274} align="right" />
              <RoundMarker title="Final" subtitle="Center Feed" x={635} y={444} align="left" />

              {tournament.matches.map((match) => (
                <div key={match.id}>
                  <BracketNode
                    match={match}
                    side="left"
                    position={getMatchPosition(match.round, match.matchNumber, "left")}
                    tone={getMatchTone(match.round)}
                  />
                  <BracketNode
                    match={match}
                    side="right"
                    position={getMatchPosition(match.round, match.matchNumber, "right")}
                    tone={getMatchTone(match.round)}
                    align="right"
                  />
                </div>
              ))}

              <ChampionNode tournament={tournament} />
            </div>
          </div>
        </div>

        {showRefreshHint ? (
          <div className="mt-3 flex items-center justify-between gap-3 px-1">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/34">
              Broadcast view updates from admin controls
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-300/72">
              Auto refresh enabled
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function BracketNode({
  match,
  side,
  position,
  tone,
  align = "left",
}: {
  match: TournamentMatchSnapshot;
  side: "left" | "right";
  position: { x: number; y: number };
  tone: "quarter" | "semi" | "final";
  align?: "left" | "right";
}) {
  const palette = ROUND_COLORS[tone];
  const viewerName =
    side === "left" ? match.leftViewerName : match.rightViewerName;
  const slotName = side === "left" ? match.leftSlotName : match.rightSlotName;
  const payout = side === "left" ? match.leftPayout : match.rightPayout;
  const isWinner = match.winnerSide === side;
  const isAwaiting = !viewerName && !slotName;

  return (
    <div
      className="absolute"
      style={{
        left: `${(position.x / STAGE_WIDTH) * 100}%`,
        top: `${(position.y / STAGE_HEIGHT) * 100}%`,
        width: `${(BOX_W / STAGE_WIDTH) * 100}%`,
        height: `${(BOX_H / STAGE_HEIGHT) * 100}%`,
      }}
    >
      <div
        className={cn(
          "relative h-full overflow-hidden border px-3 py-2",
          align === "right" ? "text-right" : "text-left",
        )}
        style={{
          borderColor: isWinner ? palette.line : palette.border,
          background: isWinner
            ? `linear-gradient(180deg, ${palette.glow} 0%, rgba(7,12,20,0.96) 100%)`
            : "linear-gradient(180deg, rgba(12,17,27,0.92) 0%, rgba(6,10,18,0.98) 100%)",
          boxShadow: isWinner
            ? `0 0 26px ${palette.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`
            : "inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <div
          className="absolute inset-y-0 w-[2px]"
          style={{
            [align === "right" ? "right" : "left"]: 0,
            background: palette.line,
            opacity: isWinner ? 1 : 0.72,
          }}
        />

        <div className="flex items-start justify-between gap-2">
          <div
            className={cn(
              "min-w-0 text-[9px] font-semibold uppercase tracking-[0.24em]",
              palette.text,
            )}
          >
            {match.label}
          </div>
          {isWinner ? (
            <Trophy className="h-3.5 w-3.5 shrink-0 text-sky-300" />
          ) : null}
        </div>

        <div
          className={cn(
            "mt-1 truncate text-[15px] font-black uppercase tracking-[0.08em]",
            isAwaiting ? "text-white/56" : "text-white",
          )}
        >
          {getDisplayLabel(viewerName, slotName)}
        </div>

        <div className="mt-1 flex items-center justify-between gap-2">
          <div className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-white/44">
            {getDisplaySubline(viewerName, slotName)}
          </div>
          <div className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/54">
            {formatCurrency(payout)}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChampionNode({ tournament }: { tournament: TournamentSnapshot }) {
  const championLabel = getDisplayLabel(
    tournament.championName,
    tournament.championSlotName,
  );
  const championSubline = getDisplaySubline(
    tournament.championName,
    tournament.championSlotName,
  );

  return (
    <div
      className="absolute"
      style={{
        left: `${(820 / STAGE_WIDTH) * 100}%`,
        top: `${(560 / STAGE_HEIGHT) * 100}%`,
        width: `${(CHAMP_W / STAGE_WIDTH) * 100}%`,
        height: `${(CHAMP_H / STAGE_HEIGHT) * 100}%`,
      }}
    >
      <div
        className="relative h-full overflow-hidden border px-4 py-3"
        style={{
          borderColor: ROUND_COLORS.champion.line,
          background:
            "linear-gradient(180deg, rgba(13,23,40,0.96) 0%, rgba(5,10,18,0.98) 100%)",
          boxShadow:
            "0 0 35px rgba(56,189,248,0.14), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <div className="absolute inset-y-0 left-0 w-[3px] bg-sky-300/90" />

        <div className="flex items-center justify-between gap-3">
          <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-sky-300/86">
            Champion
          </div>
          <Crown className="h-4 w-4 shrink-0 text-sky-300" />
        </div>

        <div className="mt-2 truncate text-[22px] font-black uppercase tracking-[0.08em] text-white">
          {championLabel}
        </div>
        <div className="mt-1 truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-white/54">
          {championSubline}
        </div>
      </div>
    </div>
  );
}

function RoundMarker({
  title,
  subtitle,
  x,
  y,
  align,
}: {
  title: string;
  subtitle: string;
  x: number;
  y: number;
  align: "left" | "right";
}) {
  return (
    <div
      className={cn("absolute", align === "right" ? "text-right" : "text-left")}
      style={{
        left: `${(x / STAGE_WIDTH) * 100}%`,
        top: `${(y / STAGE_HEIGHT) * 100}%`,
      }}
    >
      <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/28">
        {title}
      </div>
      <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-300/72">
        {subtitle}
      </div>
    </div>
  );
}

function InfoBadge({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  tone: "neutral" | "live" | "final" | "champion";
}) {
  const colors =
    tone === "live"
      ? "border-sky-300/18 bg-sky-300/10 text-sky-100"
      : tone === "final"
        ? "border-emerald-300/18 bg-emerald-300/10 text-emerald-100"
        : tone === "champion"
          ? "border-amber-300/18 bg-amber-300/10 text-amber-100"
          : "border-white/10 bg-white/[0.04] text-white/84";

  return (
    <div className={cn("inline-flex items-center gap-2 border px-3 py-2", colors)}>
      <span className="shrink-0">{icon}</span>
      <div className="flex min-w-0 items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/42">
          {label}
        </span>
        <span className="truncate text-[11px] font-black uppercase tracking-[0.08em]">
          {value}
        </span>
      </div>
    </div>
  );
}

function MiniColumn({
  title,
  value,
  tint,
}: {
  title: string;
  value: string;
  tint: "quarter" | "semi" | "final";
}) {
  const palette = ROUND_COLORS[tint];

  return (
    <div
      className="border px-3 py-3"
      style={{
        borderColor: palette.border,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
      }}
    >
      <div className={cn("text-[10px] font-semibold uppercase tracking-[0.22em]", palette.text)}>
        {title}
      </div>
      <div className="mt-2 truncate text-sm font-black uppercase tracking-[0.08em] text-white">
        {value}
      </div>
    </div>
  );
}
