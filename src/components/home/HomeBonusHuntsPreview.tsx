// FILE: src/components/home/HomeBonusHuntsPreview.tsx

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
    <section className="mx-auto w-full max-w-[1200px] px-4 md:px-6">
      <SectionHeader
        eyebrow="Bonus Hunts"
        title="Live Opening Feed"
        description="See the current opening hunt at a glance, then jump straight into the full hunt archive for more detail."
        action={<CTAButton href="/bonus-hunts">View Bonus Hunts</CTAButton>}
      />

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <PremiumPanel className="p-6 md:p-7">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="mb-3 inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-300">
                  {liveHunt ? "Live Hunt" : snapshot.source === "fallback" ? "Fallback Feed" : "Standby"}
                </div>

                <h3 className="text-2xl font-bold uppercase tracking-wide text-white md:text-3xl">
                  {liveHunt?.title || "No hunt currently opening"}
                </h3>

                <p className="mt-2 text-sm text-white/58">
                  {liveHunt
                    ? `${liveHunt.casino || liveHunt.provider || "BonusHunt.gg"} · updated ${formatDateTime(
                        liveHunt.updatedAt || liveHunt.date,
                      )}`
                    : snapshot.message || "The feed is online, but no opening hunt is active right now."}
                </p>

                {liveHunt?.currentOpeningSlot ? (
                  <p className="mt-3 text-sm text-emerald-300/90">
                    Opening now: {liveHunt.currentOpeningSlot}
                  </p>
                ) : null}
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/42">
                  Source
                </div>
                <div className="mt-2 text-sm font-semibold text-white">
                  {snapshot.source === "bonushunt" ? "BonusHunt.gg" : "Local fallback"}
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                <div className="grid grid-cols-[minmax(0,1.7fr)_minmax(0,0.8fr)_100px] gap-3 border-b border-white/10 px-4 py-3 text-[11px] uppercase tracking-[0.24em] text-white/42">
                  <div>Game</div>
                  <div>Provider</div>
                  <div className="text-right">Payout</div>
                </div>

                <div className="divide-y divide-white/6">
                  {liveHunt.bonuses.slice(0, 4).map((bonus) => (
                    <div
                      key={bonus.id}
                      className="grid grid-cols-[minmax(0,1.7fr)_minmax(0,0.8fr)_100px] gap-3 px-4 py-3 text-sm"
                    >
                      <div className="truncate text-white">{bonus.slotName}</div>
                      <div className="truncate text-white/58">
                        {bonus.provider || "—"}
                      </div>
                      <div className="text-right text-white">
                        {formatMoney(bonus.payout)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/60">
                {liveHunt
                  ? "Detailed bonus rows will appear here when the upstream hunt returns bonus data."
                  : "Once a live hunt is opening, the homepage will surface the current hunt summary here."}
              </div>
            )}
          </div>
        </PremiumPanel>

        <div className="grid gap-6">
          <PremiumPanel className="p-5 md:p-6">
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42">
              Snapshot
            </div>
            <div className="mt-4 grid gap-3">
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

          <PremiumPanel className="p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42">
                  Recent Archive
                </div>
                <h3 className="mt-2 text-xl font-bold text-white">Completed Hunts</h3>
              </div>

              <Link
                href="/bonus-hunts"
                className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300 transition-opacity hover:opacity-80"
              >
                Open page
              </Link>
            </div>

            {recentArchive.length > 0 ? (
              <div className="space-y-3">
                {recentArchive.map((hunt) => (
                  <div
                    key={hunt.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold uppercase tracking-[0.12em] text-white">
                          {hunt.title}
                        </div>
                        <div className="mt-1 text-xs text-white/48">
                          {formatDateTime(hunt.updatedAt || hunt.date)}
                        </div>
                      </div>

                      <div className="text-right text-sm font-semibold text-white">
                        {formatMoney(hunt.profitLoss)}
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-white/58">
                      <span>{formatCount(hunt.buyCount)} bonuses</span>
                      <span>{formatMoney(hunt.totalReturn)} return</span>
                      <span>{formatSignedPercent(hunt.profitLossPercentage)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/60">
                No archived hunts are available yet.
              </div>
            )}
          </PremiumPanel>
        </div>
      </div>
    </section>
  );
}

function PreviewStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/42">
        {label}
      </div>
      <div className="mt-2 text-base font-semibold text-white md:text-lg">
        {value}
      </div>
    </div>
  );
}