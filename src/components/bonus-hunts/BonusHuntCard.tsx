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

function formatSignedMoney(value?: number) {
  if (value === undefined || value === null) {
    return "—";
  }

  const abs = Math.abs(value);
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(abs);

  if (value > 0) return `+${formatted}`;
  if (value < 0) return `-${formatted}`;
  return formatted;
}

function formatPercent(value?: number) {
  if (value === undefined || value === null) {
    return "—";
  }

  const sign = value > 0 ? "+" : "";
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

function getProfitTone(value?: number) {
  if (typeof value !== "number") {
    return {
      card:
        "bg-[radial-gradient(circle_at_top_right,rgba(78,164,255,0.12),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))]",
      value: "text-white",
      accent: "text-silver/70",
      glow: "hover:shadow-[0_0_36px_rgba(78,164,255,0.12)]",
      stat: "border-white/10 bg-black/20",
    };
  }

  if (value > 0) {
    return {
      card:
        "bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))]",
      value: "text-emerald-300",
      accent: "text-emerald-300/80",
      glow: "hover:shadow-[0_0_36px_rgba(16,185,129,0.14)]",
      stat: "border-emerald-400/10 bg-emerald-500/[0.05]",
    };
  }

  if (value < 0) {
    return {
      card:
        "bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.16),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))]",
      value: "text-rose-300",
      accent: "text-rose-300/80",
      glow: "hover:shadow-[0_0_36px_rgba(239,68,68,0.12)]",
      stat: "border-rose-400/10 bg-rose-500/[0.05]",
    };
  }

  return {
    card:
      "bg-[radial-gradient(circle_at_top_right,rgba(78,164,255,0.12),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))]",
    value: "text-white",
    accent: "text-silver/70",
    glow: "hover:shadow-[0_0_36px_rgba(78,164,255,0.12)]",
    stat: "border-white/10 bg-black/20",
  };
}

function getTopMultiplier(hunt: BonusHunt) {
  if (!hunt.bonuses?.length) {
    return undefined;
  }

  const values = hunt.bonuses
    .map((bonus) => bonus.multiplier)
    .filter((value): value is number => typeof value === "number");

  if (!values.length) {
    return undefined;
  }

  return Math.max(...values);
}

function getLeadingBonus(hunt: BonusHunt) {
  if (!hunt.bonuses?.length) {
    return undefined;
  }

  return [...hunt.bonuses]
    .filter((bonus) => typeof bonus.payout === "number")
    .sort((a, b) => (b.payout ?? 0) - (a.payout ?? 0))[0];
}

function getResultLabel(value?: number) {
  if (typeof value !== "number") {
    return "Session Result";
  }

  if (value > 0) {
    return "Profit";
  }

  if (value < 0) {
    return "Loss";
  }

  return "Break Even";
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
  const tone = getProfitTone(hunt.profitLoss);
  const topMultiplier = getTopMultiplier(hunt);
  const leadingBonus = getLeadingBonus(hunt);

  return (
    <PremiumPanel
      className={cn(
        "group overflow-hidden border border-white/10 transition duration-300 hover:-translate-y-1",
        tone.card,
        tone.glow,
        variant === "live" && "border-emerald-400/15"
      )}
    >
      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent)] opacity-40" />

        <div className="relative flex flex-col gap-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <div
                  className={cn(
                    "inline-flex rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.28em]",
                    getStatusClass(hunt.status)
                  )}
                >
                  {getStatusLabel(hunt.status)}
                </div>

                <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-silver/65">
                  {hunt.casino || hunt.provider || "BonusHunt.gg"}
                </div>
              </div>

              <h3 className="max-w-3xl font-display text-2xl font-bold uppercase tracking-wide text-white md:text-3xl">
                {hunt.title}
              </h3>

              <p className="mt-2 text-sm text-silver/60">
                Updated {formatDateTime(hunt.updatedAt || hunt.date)}
              </p>

              {hunt.currentOpeningSlot ? (
                <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300">
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.95)]" />
                  Opening now: {hunt.currentOpeningSlot}
                </div>
              ) : null}
            </div>

            {hasProfitLoss ? (
              <div className="shrink-0">
                <ProfitLossBadge value={hunt.profitLoss ?? 0} />
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.9fr)]">
            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5 backdrop-blur-sm">
              <div className="text-[11px] uppercase tracking-[0.3em] text-silver/45">
                {getResultLabel(hunt.profitLoss)}
              </div>

              <div className={cn("mt-3 font-display text-4xl font-bold md:text-5xl", tone.value)}>
                {formatSignedMoney(hunt.profitLoss)}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-silver/70">
                  Start {formatMoney(hunt.totalCost)}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-silver/70">
                  Return {formatMoney(hunt.totalReturn)}
                </span>
                <span className={cn("rounded-full border px-3 py-1", tone.stat, tone.accent)}>
                  ROI {formatPercent(hunt.profitLossPercentage)}
                </span>
              </div>

              {hunt.notes ? (
                <p className="mt-4 max-w-3xl text-sm leading-7 text-silver/72">{hunt.notes}</p>
              ) : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className={cn("rounded-[1.35rem] border p-4", tone.stat)}>
                <div className="text-[11px] uppercase tracking-[0.28em] text-silver/45">
                  Bonuses
                </div>
                <div className="mt-2 font-display text-2xl font-bold text-white">
                  {bonusCount !== undefined ? bonusCount : "—"}
                </div>
                <div className="mt-1 text-xs text-silver/55">
                  {hunt.openedBonuses ?? 0} opened · {hunt.unopenedBonuses ?? 0} left
                </div>
              </div>

              <div className={cn("rounded-[1.35rem] border p-4", tone.stat)}>
                <div className="text-[11px] uppercase tracking-[0.28em] text-silver/45">
                  Best Multi
                </div>
                <div className="mt-2 font-display text-2xl font-bold text-white">
                  {topMultiplier !== undefined ? `${topMultiplier.toFixed(1)}x` : "—"}
                </div>
                <div className="mt-1 text-xs text-silver/55">
                  Top hit from shown session
                </div>
              </div>

              <div className={cn("rounded-[1.35rem] border p-4", tone.stat)}>
                <div className="text-[11px] uppercase tracking-[0.28em] text-silver/45">
                  Biggest Win
                </div>
                <div className="mt-2 font-display text-2xl font-bold text-white">
                  {leadingBonus?.payout !== undefined ? formatMoney(leadingBonus.payout) : "—"}
                </div>
                <div className="mt-1 truncate text-xs text-silver/55">
                  {leadingBonus?.slotName || "No payout data"}
                </div>
              </div>

              <div className={cn("rounded-[1.35rem] border p-4", tone.stat)}>
                <div className="text-[11px] uppercase tracking-[0.28em] text-silver/45">
                  Session State
                </div>
                <div className="mt-2 font-display text-2xl font-bold text-white">
                  {hunt.status === "opening" || hunt.status === "active"
                    ? "Live"
                    : hunt.status === "completed"
                      ? "Final"
                      : "Saved"}
                </div>
                <div className="mt-1 text-xs text-silver/55">
                  {variant === "live" ? "Tracking current hunt" : "Previous hunt snapshot"}
                </div>
              </div>
            </div>
          </div>

          {visibleBonuses.length > 0 ? (
            <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/25">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <div className="text-[11px] uppercase tracking-[0.28em] text-silver/45">
                  Featured Bonuses
                </div>
                <div className="text-[11px] uppercase tracking-[0.24em] text-silver/40">
                  Showing {visibleBonuses.length}
                </div>
              </div>

              <div className="hidden grid-cols-[minmax(0,1.7fr)_minmax(0,0.8fr)_90px_120px_90px] gap-3 border-b border-white/10 px-4 py-3 text-[11px] uppercase tracking-[0.24em] text-silver/45 md:grid">
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
                    className="px-4 py-3 transition-colors hover:bg-white/[0.03]"
                  >
                    <div className="grid gap-2 md:grid-cols-[minmax(0,1.7fr)_minmax(0,0.8fr)_90px_120px_90px] md:items-center md:gap-3">
                      <div className="min-w-0">
                        <div className="truncate font-medium text-white">{bonus.slotName}</div>
                        <div className="mt-1 text-xs text-silver/50 md:hidden">
                          {bonus.provider || "—"}
                        </div>
                      </div>

                      <div className="hidden truncate text-silver/60 md:block">
                        {bonus.provider || "—"}
                      </div>

                      <div className="flex items-center justify-between text-sm md:block md:text-right md:text-silver/75">
                        <span className="text-silver/45 md:hidden">Bet</span>
                        <span>{formatMoney(bonus.betSize)}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm md:block md:text-right md:text-white">
                        <span className="text-silver/45 md:hidden">Payout</span>
                        <span>{formatMoney(bonus.payout)}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm md:block md:text-right md:text-silver/75">
                        <span className="text-silver/45 md:hidden">Multi</span>
                        <span>
                          {bonus.multiplier !== undefined && bonus.multiplier !== null
                            ? `${bonus.multiplier.toFixed(1)}x`
                            : "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </PremiumPanel>
  );
}