// FILE: src/components/bonus-hunts/BonusHuntCard.tsx

import { PremiumPanel } from "@/components/ui/PremiumPanel";
import { ProfitLossBadge } from "@/components/bonus-hunts/ProfitLossBadge";
import type { BonusHunt } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

function formatMoney(value?: number) {
  if (value === undefined || value === null) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value?: number) {
  if (value === undefined || value === null) {
    return "—";
  }

  const sign = value > 0 ? "+" : value < 0 ? "" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function formatDateTime(value?: string) {
  if (!value) {
    return "Unknown update";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown update";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getStatusLabel(status: BonusHunt["status"]) {
  switch (status) {
    case "opening":
      return "Live Opening";
    case "completed":
      return "Completed";
    case "active":
      return "Live";
    case "archived":
      return "Archive";
    default:
      return status;
  }
}

function getStatusClass(status: BonusHunt["status"]) {
  switch (status) {
    case "opening":
    case "active":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    case "completed":
      return "border-electric/20 bg-electric/10 text-electric";
    default:
      return "border-white/10 bg-white/[0.04] text-white/65";
  }
}

function getBonusCount(hunt: BonusHunt) {
  if (typeof hunt.buyCount === "number") {
    return hunt.buyCount;
  }

  const opened = hunt.openedBonuses ?? 0;
  const unopened = hunt.unopenedBonuses ?? 0;
  const total = opened + unopened;

  return total > 0 ? total : undefined;
}

export function BonusHuntCard({
  hunt,
  variant = "archive",
}: {
  hunt: BonusHunt;
  variant?: "live" | "archive";
}) {
  const bonusCount = getBonusCount(hunt);
  const visibleBonuses = hunt.bonuses?.slice(0, variant === "live" ? 6 : 4) ?? [];
  const hasProfitLoss = typeof hunt.profitLoss === "number";

  return (
    <PremiumPanel
      className={cn(
        "overflow-hidden",
        variant === "live" &&
          "border border-emerald-400/10 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))]",
      )}
    >
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div
            className={cn(
              "mb-3 inline-flex rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.28em]",
              getStatusClass(hunt.status),
            )}
          >
            {getStatusLabel(hunt.status)}
          </div>

          <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-white">
            {hunt.title}
          </h3>

          <p className="mt-2 text-sm text-silver/60">
            {hunt.casino || hunt.provider || "BonusHunt.gg"} ·{" "}
            {formatDateTime(hunt.updatedAt || hunt.date)}
          </p>

          {hunt.currentOpeningSlot ? (
            <p className="mt-3 text-sm text-emerald-300/90">
              Opening now: {hunt.currentOpeningSlot}
            </p>
          ) : null}
        </div>

        {hasProfitLoss ? <ProfitLossBadge value={hunt.profitLoss ?? 0} /> : null}
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="text-xs uppercase tracking-[0.28em] text-silver/45">
            Bonuses
          </div>
          <div className="mt-2 text-xl text-white">
            {bonusCount !== undefined ? bonusCount : "—"}
          </div>
          {(hunt.openedBonuses !== undefined || hunt.unopenedBonuses !== undefined) && (
            <div className="mt-1 text-xs text-silver/50">
              {hunt.openedBonuses ?? 0} opened · {hunt.unopenedBonuses ?? 0} left
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="text-xs uppercase tracking-[0.28em] text-silver/45">
            Start Cost
          </div>
          <div className="mt-2 text-xl text-white">{formatMoney(hunt.totalCost)}</div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="text-xs uppercase tracking-[0.28em] text-silver/45">
            Total Return
          </div>
          <div className="mt-2 text-xl text-white">
            {formatMoney(hunt.totalReturn)}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="text-xs uppercase tracking-[0.28em] text-silver/45">
            Profit / Loss
          </div>
          <div className="mt-2 text-xl text-white">
            {hasProfitLoss ? formatMoney(hunt.profitLoss) : "—"}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="text-xs uppercase tracking-[0.28em] text-silver/45">
            ROI
          </div>
          <div className="mt-2 text-xl text-white">
            {formatPercent(hunt.profitLossPercentage)}
          </div>
        </div>
      </div>

      {hunt.notes ? (
        <p className="mt-4 text-sm leading-7 text-silver/70">{hunt.notes}</p>
      ) : null}

      {visibleBonuses.length > 0 ? (
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
          <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,0.8fr)_90px_110px_90px] gap-3 border-b border-white/10 px-4 py-3 text-[11px] uppercase tracking-[0.24em] text-silver/45">
            <div>Game</div>
            <div>Provider</div>
            <div className="text-right">Bet</div>
            <div className="text-right">Payout</div>
            <div className="text-right">Multi</div>
          </div>

          <div className="divide-y divide-white/5">
            {visibleBonuses.map((bonus) => (
              <div
                key={bonus.id}
                className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,0.8fr)_90px_110px_90px] gap-3 px-4 py-3 text-sm"
              >
                <div className="min-w-0">
                  <div className="truncate text-white">{bonus.slotName}</div>
                </div>
                <div className="truncate text-silver/60">
                  {bonus.provider || "—"}
                </div>
                <div className="text-right text-silver/75">
                  {formatMoney(bonus.betSize)}
                </div>
                <div className="text-right text-white">
                  {formatMoney(bonus.payout)}
                </div>
                <div className="text-right text-silver/75">
                  {bonus.multiplier !== undefined && bonus.multiplier !== null
                    ? `${bonus.multiplier.toFixed(1)}x`
                    : "—"}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </PremiumPanel>
  );
}