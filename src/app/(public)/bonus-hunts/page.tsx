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
        description="Track the current opening session, review finished hunt performance, and keep the DirtyGunner bonus hunt feed clean, premium, and readable without clutter."
        aside={
          <PremiumPanel className="grid gap-4 border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
                Live hunts
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {data.activeHunts ?? liveHunts.length}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
                Archived
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {data.completedHunts ?? previousHunts.length}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
                Total bonuses
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {data.totalBonuses ?? "—"}
              </p>
            </div>
          </PremiumPanel>
        }
      />

      {data.message ? (
        <PremiumPanel className="border border-white/10 bg-white/[0.03] p-5">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
                Data source
              </p>
              <p className="mt-2 text-sm leading-7 text-white/70">{data.message}</p>
            </div>
            <div className="text-xs uppercase tracking-[0.24em] text-white/40">
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
          description="The active opening session stays isolated up top so viewers can see the live state instantly."
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
          description="Finished sessions stay separated below with clean performance data and recent slot rows when available."
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