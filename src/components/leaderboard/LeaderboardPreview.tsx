// FILE: src/components/leaderboard/LeaderboardPreview.tsx
import { LeaderboardEntry } from "@/lib/types";
import { PremiumPanel } from "@/components/ui/PremiumPanel";
import { CTAButton } from "@/components/ui/CTAButton";
import { formatWager } from "@/lib/formatters";

export function LeaderboardPreview({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <PremiumPanel>
      <div className="mb-5 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="text-label-tight text-electric/70">
            Leaderboard Pulse
          </div>
          <h3 className="mt-2 truncate text-responsive-heading font-display font-bold uppercase tracking-wide text-white">
            Current Movers
          </h3>
        </div>
        <div className="shrink-0">
          <CTAButton href="/leaderboard" variant="secondary">
            Full Board
          </CTAButton>
        </div>
      </div>

      <div className="space-y-3">
        {entries.slice(3, 8).map((entry) => (
          <div
            key={entry.rank}
            className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
          >
            <div className="min-w-0">
              <div className="truncate font-semibold text-white">
                #{entry.rank} {entry.username}
              </div>
              <div className="text-xs uppercase tracking-[0.28em] text-silver/45">
                Ranked live
              </div>
            </div>

            <div className="shrink-0 whitespace-nowrap font-medium text-silver">
              ${formatWager(entry.wageredTotal ?? 0)}
            </div>
          </div>
        ))}
      </div>
    </PremiumPanel>
  );
}