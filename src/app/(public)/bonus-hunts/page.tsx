// FILE: src/app/(public)/bonus-hunts/page.tsx
import { unstable_noStore as noStore } from "next/cache";

import { BonusHuntCard } from "@/components/bonus-hunts/BonusHuntCard";
import { PageHero } from "@/components/ui/PageHero";
import { PremiumPanel } from "@/components/ui/PremiumPanel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { dataRepository } from "@/lib/data/repository";
import type { BonusHuntSnapshot } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function isSnapshot(value: unknown): value is BonusHuntSnapshot {
  if (!value || typeof value !== "object") {
    return false;
  }

  const maybe = value as Partial<BonusHuntSnapshot>;
  return Array.isArray(maybe.liveHunts) && Array.isArray(maybe.previousHunts);
}

export default async function BonusHuntsPage() {
  noStore();

  const repoData = await dataRepository.getBonusHunts();
  const data: BonusHuntSnapshot = isSnapshot(repoData)
    ? repoData
    : {
        liveHunts: [],
        previousHunts: [],
        source: "fallback",
        fetchedAt: new Date().toISOString(),
        message: "Bonus hunt data is currently unavailable.",
      };

  const liveHunts = data.liveHunts;
  const previousHunts = data.previousHunts;

  return (
    <div className="space-y-10">
      <PageHero
        eyebrow="Bonus Hunts"
        title="Live Hunts and Archive History"
        description=" "
        aside={
          <PremiumPanel className="grid gap-4 border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-3">
            <MetricBlock
              label="Live hunts"
              value={String(data.activeHunts ?? liveHunts.length)}
            />
            <MetricBlock
              label="Archived"
              value={String(data.completedHunts ?? previousHunts.length)}
            />
            <MetricBlock
              label="Total bonuses"
              value={String(data.totalBonuses ?? "—")}
            />
          </PremiumPanel>
        }
      />

      {data.message ? (
        <PremiumPanel className="border border-white/10 bg-white/[0.03] p-5">
          <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
                Data source
              </p>
              <p className="truncate-3 mt-2 text-sm leading-7 text-white/70">
                {data.message}
              </p>
            </div>
            <div className="shrink-0 whitespace-nowrap text-xs uppercase tracking-[0.24em] text-white/40">
              {data.source === "bonushunt" ? "BonusHunt.gg" : "Local fallback"} ·{" "}
              {new Intl.DateTimeFormat("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              }).format(new Date(data.fetchedAt))}
            </div>
          </div>
        </PremiumPanel>
      ) : null}

      <section className="space-y-6">
        <SectionHeader
          eyebrow="Live"
          title="Current Hunt"
          description=" "
        />

        {liveHunts.length > 0 ? (
          <div className="grid gap-6">
            {liveHunts.map((hunt) => (
              <BonusHuntCard key={hunt.id} hunt={hunt} variant="live" />
            ))}
          </div>
        ) : (
          <PremiumPanel className="border border-white/10 bg-white/[0.03] p-6 text-sm text-white/65">
            No live hunt is currently opening.
          </PremiumPanel>
        )}
      </section>

      <section className="space-y-6">
        <SectionHeader
          eyebrow="Archive"
          title="Previous Hunts"
          description=" "
        />

        {previousHunts.length > 0 ? (
          <div className="grid gap-6 xl:grid-cols-2">
            {previousHunts.map((hunt) => (
              <BonusHuntCard key={hunt.id} hunt={hunt} variant="archive" />
            ))}
          </div>
        ) : (
          <PremiumPanel className="border border-white/10 bg-white/[0.03] p-6 text-sm text-white/65">
            Completed hunts will show here once BonusHunt.gg history is available.
          </PremiumPanel>
        )}
      </section>
    </div>
  );
}

function MetricBlock({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
        {label}
      </p>
      <p className="mt-2 truncate text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}