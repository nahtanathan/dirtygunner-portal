import clsx from "clsx";
import { Crown, RefreshCw, Swords } from "lucide-react";
import { PremiumPanel } from "@/components/ui/PremiumPanel";
import type {
  TournamentMatchSnapshot,
  TournamentSnapshot,
} from "@/lib/tournament";

export function TournamentBracket({
  tournament,
  showRefreshHint = false,
}: {
  tournament: TournamentSnapshot;
  showRefreshHint?: boolean;
}) {
  const rounds = groupMatchesByRound(tournament);

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="grid gap-5 lg:grid-cols-3">
        {rounds.map((round) => (
          <PremiumPanel
            key={round.round}
            className="overflow-hidden p-0"
          >
            <div className="border-b border-white/8 px-4 py-4 sm:px-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-300/80">
                Round {round.round}
              </div>
              <h2 className="mt-2 text-lg font-bold uppercase tracking-[0.06em] text-white">
                {round.label}
              </h2>
            </div>

            <div className="space-y-3 p-4 sm:p-5">
              {round.matches.map((match) => (
                <article
                  key={match.id}
                  className="rounded-[8px] border border-white/8 bg-white/[0.025] p-3"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold uppercase tracking-[0.06em] text-white">
                        {match.label}
                      </div>
                    </div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/34">
                      Match {match.matchNumber}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <MatchSide
                      side="left"
                      viewerName={match.leftViewerName}
                      slotName={match.leftSlotName}
                      payout={match.leftPayout}
                      isWinner={match.winnerSide === "left"}
                    />
                    <MatchSide
                      side="right"
                      viewerName={match.rightViewerName}
                      slotName={match.rightSlotName}
                      payout={match.rightPayout}
                      isWinner={match.winnerSide === "right"}
                    />
                  </div>
                </article>
              ))}
            </div>
          </PremiumPanel>
        ))}
      </div>

      <div className="space-y-5">
        <PremiumPanel className="p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] border border-amber-300/20 bg-amber-300/10 text-amber-200">
              <Crown className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-200/70">
                Champion
              </div>
              <div className="mt-2 text-2xl font-bold uppercase tracking-[0.04em] text-white">
                {tournament.championName ?? "Awaiting Champion"}
              </div>
              <div className="mt-2 text-sm text-white/55">
                {tournament.championSlotName
                  ? `Winning slot: ${tournament.championSlotName}`
                  : "The final winner will lock in here once the bracket is complete."}
              </div>
            </div>
          </div>
        </PremiumPanel>

        <PremiumPanel className="p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] border border-sky-300/16 bg-sky-300/10 text-sky-200">
              <Swords className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-200/70">
                Tournament Status
              </div>
              <div className="mt-2 inline-flex items-center rounded-[6px] border border-white/8 bg-white/[0.03] px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/82">
                {tournament.status}
              </div>
              <div className="mt-3 text-sm leading-6 text-white/55">
                Updated {formatTimestamp(tournament.updatedAt)}
              </div>

              {showRefreshHint ? (
                <div className="mt-3 inline-flex items-center gap-2 text-sm text-blue-200/70">
                  <RefreshCw className="h-4 w-4" />
                  Auto-refresh is enabled on this page.
                </div>
              ) : null}
            </div>
          </div>
        </PremiumPanel>
      </div>
    </div>
  );
}

function MatchSide({
  side,
  viewerName,
  slotName,
  payout,
  isWinner,
}: {
  side: "left" | "right";
  viewerName: string | null;
  slotName: string | null;
  payout: number;
  isWinner: boolean;
}) {
  return (
    <div
      className={clsx(
        "rounded-[7px] border px-3 py-3 transition-colors duration-200",
        isWinner ? "bg-blue-500/[0.12]" : "bg-black/20",
      )}
      style={{
        borderColor: isWinner ? "rgba(96,165,250,0.24)" : "rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/38">
            {side}
          </div>
          <div className="mt-1 truncate text-sm font-bold uppercase tracking-[0.04em] text-white">
            {viewerName ?? "Awaiting"}
          </div>
          <div className="mt-1 truncate text-xs text-white/52">
            {slotName ?? "Slot not assigned"}
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/34">
            Payout
          </div>
          <div className="mt-1 whitespace-nowrap text-sm font-semibold text-amber-200">
            ${Number(payout || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    </div>
  );
}

function groupMatchesByRound(tournament: TournamentSnapshot) {
  return tournament.matches.reduce<
    Array<{ round: number; label: string; matches: TournamentMatchSnapshot[] }>
  >((groups, match) => {
    const existing = groups.find((item) => item.round === match.round);

    if (existing) {
      existing.matches.push(match);
      return groups;
    }

    groups.push({
      round: match.round,
      label: match.roundLabel,
      matches: [match],
    });

    return groups;
  }, []);
}

function formatTimestamp(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "recently";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
