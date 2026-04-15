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

  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${formatMoney(Math.abs(value))}`;
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
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getStatusLabel(status: BonusHunt["status"]) {
  switch (status) {
    case "opening":
      return "Opening";
    case "active":
      return "Live";
    case "completed":
      return "Completed";
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
        variant === "live" && "border-emerald-400/15",
      )}
    >
      <div className="relative min-w-0">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent)] opacity-40" />

        <div className="relative flex min-w-0 flex-col gap-5">
          <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <div
                  className={cn(
                    "inline-flex max-w-full items-center rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.24em] sm:text-[11px] sm:tracking-[0.28em]",
                    getStatusClass(hunt.status),
                  )}
                >
                  <span className="truncate whitespace-nowrap">{getStatusLabel(hunt.status)}</span>
                </div>

                <div className="inline-flex max-w-full items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-silver/65 sm:text-[11px] sm:tracking-[0.24em]">
                  <span className="truncate whitespace-nowrap">
                    {hunt.casino || hunt.provider || "BonusHunt.gg"}
                  </span>
                </div>
              </div>

              <h3 className="truncate-2 font-display text-[1.35rem] font-bold uppercase tracking-wide text-white sm:text-[1.55rem] md:text-[1.75rem] lg:text-[2rem]">
                {hunt.title}
              </h3>

              <p className="mt-2 text-sm text-silver/60">
                Updated {formatDateTime(hunt.updatedAt || hunt.date)}
              </p>

              {hunt.currentOpeningSlot ? (
                <div className="mt-3 inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300">
                  <span className="inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-300 shadow-[0_0_10px_rgba(110,231,183,0.95)]" />
                  <span className="min-w-0 truncate whitespace-nowrap">
                    Opening now: {hunt.currentOpeningSlot}
                  </span>
                </div>
              ) : null}
            </div>

            {hasProfitLoss ? (
              <div className="shrink-0 self-start lg:pt-1">
                <ProfitLossBadge value={hunt.profitLoss ?? 0} />
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.9fr)]">
            <div className="min-w-0 rounded-[1.5rem] border border-white/10 bg-black/20 p-4 backdrop-blur-sm sm:p-5">
              <div className="text-label-tight text-silver/45">
                {getResultLabel(hunt.profitLoss)}
              </div>

              <div
                className={cn(
                  "mt-3 max-w-full overflow-hidden text-ellipsis whitespace-nowrap font-display text-[2rem] font-bold leading-none sm:text-[2.35rem] md:text-[2.9rem]",
                  tone.value,
                )}
              >
                {formatSignedMoney(hunt.profitLoss)}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm sm:gap-3">
                <span className="inline-flex max-w-full items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-silver/70">
                  <span className="truncate whitespace-nowrap">Start {formatMoney(hunt.totalCost)}</span>
                </span>
                <span className="inline-flex max-w-full items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-silver/70">
                  <span className="truncate whitespace-nowrap">Return {formatMoney(hunt.totalReturn)}</span>
                </span>
                <span className={cn("inline-flex max-w-full items-center rounded-full border px-3 py-1", tone.stat, tone.accent)}>
                  <span className="truncate whitespace-nowrap">ROI {formatPercent(hunt.profitLossPercentage)}</span>
                </span>
              </div>

              {hunt.notes ? (
                <p className="truncate-3 mt-4 max-w-3xl text-sm leading-6 text-silver/72 md:leading-7">
                  {hunt.notes}
                </p>
              ) : null}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <StatCard tone={tone.stat} label="Bonuses" value={bonusCount !== undefined ? String(bonusCount) : "—"} meta={`${hunt.openedBonuses ?? 0} opened · ${hunt.unopenedBonuses ?? 0} left`} />
              <StatCard tone={tone.stat} label="Best Multi" value={topMultiplier !== undefined ? `${topMultiplier.toFixed(1)}x` : "—"} meta="Top hit from shown session" />
              <StatCard tone={tone.stat} label="Biggest Win" value={leadingBonus?.payout !== undefined ? formatMoney(leadingBonus.payout) : "—"} meta={leadingBonus?.slotName || "No payout data"} />
              <StatCard tone={tone.stat} label="Session State" value={hunt.status === "opening" || hunt.status === "active" ? "Live" : hunt.status === "completed" ? "Final" : "Saved"} meta={variant === "live" ? "Tracking current hunt" : "Previous hunt snapshot"} />
            </div>
          </div>

          {visibleBonuses.length > 0 ? (
            <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/25">
              <div className="flex min-w-0 items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                <div className="text-label-tight text-silver/45">Featured Bonuses</div>
                <div className="shrink-0 whitespace-nowrap text-[11px] uppercase tracking-[0.24em] text-silver/40">
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
                        <div className="mt-1 truncate text-xs text-silver/50 md:hidden">
                          {bonus.provider || "—"}
                        </div>
                      </div>

                      <div className="hidden truncate text-silver/60 md:block">
                        {bonus.provider || "—"}
                      </div>

                      <div className="flex items-center justify-between gap-3 text-sm md:block md:text-right md:text-silver/75">
                        <span className="shrink-0 text-silver/45 md:hidden">Bet</span>
                        <span className="whitespace-nowrap">{formatMoney(bonus.betSize)}</span>
                      </div>

                      <div className="flex items-center justify-between gap-3 text-sm md:block md:text-right md:text-white">
                        <span className="shrink-0 text-silver/45 md:hidden">Payout</span>
                        <span className="whitespace-nowrap">{formatMoney(bonus.payout)}</span>
                      </div>

                      <div className="flex items-center justify-between gap-3 text-sm md:block md:text-right md:text-silver/75">
                        <span className="shrink-0 text-silver/45 md:hidden">Multi</span>
                        <span className="whitespace-nowrap">
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

function StatCard({
  tone,
  label,
  value,
  meta,
}: {
  tone: string;
  label: string;
  value: string;
  meta: string;
}) {
  return (
    <div className={cn("min-w-0 rounded-[1.35rem] border p-4", tone)}>
      <div className="text-label-tight text-silver/45">{label}</div>
      <div className="mt-2 overflow-hidden text-ellipsis whitespace-nowrap font-display text-xl font-bold text-white sm:text-2xl">
        {value}
      </div>
      <div className="mt-1 truncate text-xs text-silver/55">{meta}</div>
    </div>
  );
}