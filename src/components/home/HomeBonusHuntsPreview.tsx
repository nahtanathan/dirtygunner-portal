import Link from "next/link";

import { CTAButton } from "@/components/ui/CTAButton";
import { PremiumPanel } from "@/components/ui/PremiumPanel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { BonusHuntSnapshot } from "@/lib/types";

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

function formatCount(value?: number) {
  if (value === undefined || value === null) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
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

function formatSignedPercent(value?: number) {
  if (value === undefined || value === null) {
    return "—";
  }

  const sign = value > 0 ? "+" : value < 0 ? "" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function HomeBonusHuntsPreview({
  snapshot,
}: {
  snapshot: BonusHuntSnapshot;
}) {
  const liveHunt = snapshot.liveHunts[0];
  const recentArchive = snapshot.previousHunts.slice(0, 2);

  return (
    <section className="mx-auto w-full max-w-[1360px] px-4 md:px-6">
      <SectionHeader
        eyebrow="Bonus Hunts"
        title="Bonus Hunts"
        description=" "
        action={<CTAButton href="/bonus-hunts">Open Bonus Hunts</CTAButton>}
      />

      <div className="grid gap-4 xl:grid-cols-[1.48fr_0.82fr]">
        <PremiumPanel className="panel-hover p-4 sm:p-5 md:p-5">
          <div className="flex min-w-0 flex-col gap-3">
            <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1">
                <div className="mb-2 inline-flex max-w-full rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
                  <span className="truncate whitespace-nowrap">
                    {liveHunt
                      ? "Live Hunt"
                      : snapshot.source === "fallback"
                        ? "Backup Feed"
                        : "Standby"}
                  </span>
                </div>

                <h3 className="truncate-2 text-[1.1rem] font-bold uppercase leading-[1.02] tracking-[0.03em] text-white sm:text-[1.45rem] md:text-[1.7rem]">
                  {liveHunt?.title || "No hunt live right now"}
                </h3>

                <p className="truncate-3 mt-2 text-sm leading-6 text-white/58">
                  {liveHunt
                    ? `${liveHunt.casino || liveHunt.provider || "BonusHunt.gg"} · updated ${formatDateTime(
                        liveHunt.updatedAt || liveHunt.date,
                      )}`
                    : snapshot.message ||
                      "No live hunt is currently opening on BonusHunt.gg."}
                </p>

                {liveHunt?.currentOpeningSlot ? (
                  <p className="mt-2 truncate text-sm text-emerald-300/90">
                    Opening now: {liveHunt.currentOpeningSlot}
                  </p>
                ) : null}
              </div>

              <div className="w-full max-w-[180px] rounded-[6px] border border-white/10 bg-white/[0.03] px-4 py-3 soft-glow-hover lg:w-auto">
                <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/42">
                  Source
                </div>
                <div className="mt-1.5 truncate text-sm font-semibold text-white">
                  {snapshot.source === "bonushunt"
                    ? "BonusHunt.gg"
                    : "Local backup"}
                </div>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              <PreviewStat label="Bonuses" value={formatCount(liveHunt?.buyCount)} />
              <PreviewStat label="Cost" value={formatMoney(liveHunt?.totalCost)} />
              <PreviewStat label="Return" value={formatMoney(liveHunt?.totalReturn)} />
              <PreviewStat
                label="P/L / ROI"
                value={
                  liveHunt
                    ? `${formatMoney(liveHunt.profitLoss)} · ${formatSignedPercent(
                        liveHunt.profitLossPercentage,
                      )}`
                    : "—"
                }
              />
            </div>

            {liveHunt?.bonuses && liveHunt.bonuses.length > 0 ? (
              <div className="overflow-hidden rounded-[6px] border border-white/10 bg-black/20">
                <div className="grid grid-cols-[minmax(0,1.45fr)_minmax(0,0.78fr)_82px] gap-3 border-b border-white/10 px-4 py-2.5 text-[10px] uppercase tracking-[0.22em] text-white/42">
                  <div>Game</div>
                  <div>Provider</div>
                  <div className="text-right">Payout</div>
                </div>

                <div className="divide-y divide-white/6">
                  {liveHunt.bonuses.slice(0, 4).map((bonus) => (
                    <div
                      key={bonus.id}
                      className="grid grid-cols-[minmax(0,1.45fr)_minmax(0,0.78fr)_82px] gap-3 px-4 py-2.5 text-sm transition-colors duration-200 hover:bg-white/[0.025]"
                    >
                      <div className="truncate text-white">{bonus.slotName}</div>
                      <div className="truncate text-white/58">
                        {bonus.provider || "—"}
                      </div>
                      <div className="text-right whitespace-nowrap text-white">
                        {formatMoney(bonus.payout)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-[6px] border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white/60">
                {liveHunt
                  ? "Bonus rows will show here when the hunt feed returns them."
                  : "When a hunt goes live, the current summary will show here."}
              </div>
            )}
          </div>
        </PremiumPanel>

        <div className="grid gap-4">
          <PremiumPanel className="panel-hover p-3.5 md:p-4">
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/42">
              Snapshot
            </div>

            <div className="mt-3 grid gap-2.5">
              <PreviewStat
                label="Active Hunts"
                value={String(snapshot.activeHunts ?? snapshot.liveHunts.length)}
              />
              <PreviewStat
                label="Archived Hunts"
                value={String(
                  snapshot.completedHunts ?? snapshot.previousHunts.length,
                )}
              />
              <PreviewStat
                label="Total Bonuses"
                value={formatCount(snapshot.totalBonuses)}
              />
              <PreviewStat
                label="Overall P/L"
                value={formatMoney(snapshot.totalProfitLoss)}
              />
            </div>
          </PremiumPanel>

          <PremiumPanel className="panel-hover p-3.5 md:p-4">
            <div className="mb-3 flex min-w-0 items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/42">
                  Recent Hunts
                </div>
                <h3 className="mt-1.5 truncate text-[1.35rem] font-bold text-white">
                  Past Hunts
                </h3>
              </div>

              <Link
                href="/bonus-hunts"
                className="shrink-0 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-300 transition-opacity hover:opacity-80"
              >
                Open page
              </Link>
            </div>

            {recentArchive.length > 0 ? (
              <div className="space-y-2.5">
                {recentArchive.map((hunt) => (
                  <div
                    key={hunt.id}
                    className="rounded-[6px] border border-white/10 bg-white/[0.03] px-4 py-3.5 transition-all duration-200 hover:border-white/14 hover:bg-white/[0.045]"
                  >
                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold uppercase tracking-[0.1em] text-white">
                          {hunt.title}
                        </div>
                        <div className="mt-1 text-xs text-white/48">
                          {formatDateTime(hunt.updatedAt || hunt.date)}
                        </div>
                      </div>

                      <div className="shrink-0 whitespace-nowrap text-right text-sm font-semibold text-white">
                        {formatMoney(hunt.profitLoss)}
                      </div>
                    </div>

                    <div className="mt-2.5 grid grid-cols-1 gap-1.5 text-xs text-white/58 sm:grid-cols-3">
                      <span className="truncate">
                        {formatCount(hunt.buyCount)} bonuses
                      </span>
                      <span className="truncate">
                        {formatMoney(hunt.totalReturn)} return
                      </span>
                      <span className="truncate">
                        {formatSignedPercent(hunt.profitLossPercentage)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[6px] border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white/60">
                Past bonus hunts will show here after completed sessions sync.
              </div>
            )}
          </PremiumPanel>
        </div>
      </div>
    </section>
  );
}

function PreviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-[6px] border border-white/10 bg-white/[0.03] px-3.5 py-2.5 transition-all duration-200 hover:border-white/14 hover:bg-white/[0.045]">
      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/42">
        {label}
      </div>
      <div className="mt-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-[1.02rem] font-semibold text-white sm:text-[1.1rem]">
        {value}
      </div>
    </div>
  );
}
