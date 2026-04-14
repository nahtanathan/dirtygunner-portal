// FILE: src/components/bonus-hunts/BonusHuntCard.tsx

import { PremiumPanel } from "@/components/ui/PremiumPanel";
import { ProfitLossBadge } from "@/components/bonus-hunts/ProfitLossBadge";
import type { BonusHunt } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

function formatMoney(value?: number) {
  if (value === undefined || value === null) return "—";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatSignedMoney(value?: number) {
  if (value === undefined || value === null) return "—";

  const abs = Math.abs(value);
  const formatted = formatMoney(abs);

  if (value > 0) return `+${formatted}`;
  if (value < 0) return `-${formatted}`;
  return formatted;
}

function formatDateTime(value?: string) {
  if (!value) return "Unknown update";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown update";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function BonusHuntCard({
  hunt,
}: {
  hunt: BonusHunt;
}) {
  const isLoss = (hunt.profitLoss ?? 0) < 0;

  return (
    <PremiumPanel className="overflow-hidden">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
        
        {/* LEFT SIDE */}
        <div className="min-w-0 flex-1">
          {/* tags */}
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-electric/20 bg-electric/10 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-electric">
              Completed
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-silver/70">
              {hunt.casino || "BonusHunt.gg"}
            </span>
          </div>

          {/* TITLE FIX */}
          <h3 className="min-w-0 truncate font-display text-2xl font-bold uppercase tracking-wide text-white md:text-3xl">
            {hunt.title}
          </h3>

          <p className="mt-2 text-sm text-silver/60">
            Updated {formatDateTime(hunt.updatedAt || hunt.date)}
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="shrink-0">
          <ProfitLossBadge value={hunt.profitLoss ?? 0} />
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        
        {/* RESULT BLOCK */}
        <div className="min-w-0 rounded-2xl border border-white/10 bg-black/30 p-5">
          <div className="text-xs uppercase tracking-[0.28em] text-silver/45">
            {isLoss ? "Loss" : "Profit"}
          </div>

          {/* BIG NUMBER FIX */}
          <div className={cn(
            "mt-2 min-w-0 break-words font-display text-4xl font-bold md:text-5xl",
            isLoss ? "text-rose-300" : "text-emerald-300"
          )}>
            {formatSignedMoney(hunt.profitLoss)}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-silver/70">
              Start {formatMoney(hunt.totalCost)}
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs text-silver/70">
              Return {formatMoney(hunt.totalReturn)}
            </span>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid gap-3 sm:grid-cols-2">
          
          <div className="min-w-0 rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="text-xs uppercase tracking-[0.28em] text-silver/45">
              Bonuses
            </div>
            <div className="mt-2 truncate text-xl font-bold text-white">
              {hunt.buyCount ?? "—"}
            </div>
          </div>

          <div className="min-w-0 rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="text-xs uppercase tracking-[0.28em] text-silver/45">
              Best Multi
            </div>
            <div className="mt-2 truncate text-xl font-bold text-white">
              —
            </div>
          </div>

          <div className="min-w-0 rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="text-xs uppercase tracking-[0.28em] text-silver/45">
              Biggest Win
            </div>
            <div className="mt-2 truncate text-xl font-bold text-white">
              —
            </div>
          </div>

          <div className="min-w-0 rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="text-xs uppercase tracking-[0.28em] text-silver/45">
              Session
            </div>
            <div className="mt-2 truncate text-xl font-bold text-white">
              Completed
            </div>
          </div>
        </div>
      </div>
    </PremiumPanel>
  );
}