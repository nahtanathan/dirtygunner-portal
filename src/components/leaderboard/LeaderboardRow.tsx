// FILE: src/components/leaderboard/LeaderboardRow.tsx
import { LeaderboardEntry } from "@/lib/types";
import { formatCurrency, formatWager } from "@/lib/formatters";
import { cn } from "@/lib/utils/cn";

export function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  const rank = entry.rank ?? 0;
  const wageredTotal = entry.wageredTotal ?? entry.wagered ?? 0;

  return (
    <div
      className={cn(
        "grid min-w-0 grid-cols-[56px_minmax(0,1fr)_92px] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3 transition hover:border-electric/20 hover:bg-white/[0.05] sm:grid-cols-[64px_minmax(0,1fr)_120px] sm:px-4 sm:py-4 md:grid-cols-[72px_minmax(0,1fr)_130px_120px]",
        rank > 0 &&
          rank <= 3 &&
          "bg-[linear-gradient(135deg,rgba(78,164,255,0.08),rgba(139,92,246,0.06))]",
      )}
    >
      <div className="whitespace-nowrap font-display text-base font-bold text-white sm:text-lg">
        {rank > 0 ? `#${rank}` : "—"}
      </div>

      <div className="min-w-0">
        <div className="truncate font-semibold text-white">{entry.username}</div>
        <div className="hidden text-xs uppercase tracking-[0.28em] text-silver/45 md:block">
          Ranked live
        </div>
      </div>

      <div className="text-right font-medium text-white whitespace-nowrap">
        ${formatWager(wageredTotal)}
      </div>

      <div className="hidden text-right text-sm text-electric md:block whitespace-nowrap">
        {entry.prize ? formatCurrency(entry.prize) : "—"}
      </div>
    </div>
  );
}