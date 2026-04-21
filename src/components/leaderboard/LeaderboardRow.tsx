import { LeaderboardEntry } from "@/lib/types";
import { formatCurrency, formatWager } from "@/lib/formatters";
import { cn } from "@/lib/utils/cn";

export function LeaderboardRow({ entry }: { entry: LeaderboardEntry }) {
  const rank = entry.rank ?? 0;
  const wageredTotal = entry.wageredTotal ?? entry.wagered ?? 0;

  return (
    <div
      className={cn(
        "grid min-w-0 grid-cols-[58px_minmax(0,1fr)_96px] items-center gap-3 border-b border-white/6 px-4 py-4 text-sm transition-colors duration-200 last:border-b-0 sm:grid-cols-[64px_minmax(0,1fr)_118px] sm:px-5 md:grid-cols-[72px_minmax(0,1fr)_132px_138px]",
        "hover:bg-white/[0.025]",
      )}
    >
      <div className="whitespace-nowrap font-display text-base font-medium tracking-[-0.03em] text-[#f5f7fa] sm:text-lg">
        {rank > 0 ? `#${rank}` : "-"}
      </div>

      <div className="min-w-0">
        <div className="truncate font-medium text-[#f5f7fa]">{entry.username}</div>
        <div className="hidden text-[10px] uppercase tracking-[0.24em] text-[#6f7986] md:block">
          Ranked live
        </div>
      </div>

      <div className="whitespace-nowrap text-right font-medium text-[#f5f7fa]">
        ${formatWager(wageredTotal)}
      </div>

      <div className="hidden whitespace-nowrap text-right text-sm text-[#a1acb8] md:block">
        {entry.prize ? formatCurrency(entry.prize) : "-"}
      </div>
    </div>
  );
}
