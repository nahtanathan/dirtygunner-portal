// FILE: src/app/(public)/challenges/page.tsx

import { unstable_noStore as noStore } from "next/cache";

import { ChallengeCard } from "@/components/challenges/ChallengeCard";
import { PageHero } from "@/components/ui/PageHero";
import { PremiumPanel } from "@/components/ui/PremiumPanel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { challenges as fallbackChallenges } from "@/lib/data/mock-data";
import { dataRepository } from "@/lib/data/repository";
import type { Challenge } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function isChallengeArray(value: unknown): value is Challenge[] {
  return Array.isArray(value);
}

export default async function ChallengesPage() {
  noStore();

  const repoItems = await dataRepository.getChallenges();
  const items =
    isChallengeArray(repoItems) && repoItems.length > 0
      ? repoItems
      : fallbackChallenges;

  const activeChallenges = items.filter((item) => item.status === "active");
  const completedChallenges = items.filter(
    (item) => item.status === "completed",
  );

  const totalGoal = activeChallenges.reduce((sum, item) => sum + item.goal, 0);
  const totalProgress = activeChallenges.reduce(
    (sum, item) => sum + item.currentProgress,
    0,
  );
  const overallPercent =
    totalGoal > 0 ? Math.min(Math.round((totalProgress / totalGoal) * 100), 100) : 0;

  return (
    <div className="space-y-10">
      <PageHero
        eyebrow="Challenges"
        title="Community Missions"
        description="Track live DirtyGunner community goals, unlock rewards, and keep the active push front and center with a cleaner premium layout."
        aside={
          <PremiumPanel className="grid gap-4 border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
                Live now
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {activeChallenges.length}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
                Completed
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {completedChallenges.length}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
                Overall progress
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {overallPercent}%
              </p>
            </div>
          </PremiumPanel>
        }
      />

      <section className="space-y-6">
        <SectionHeader
          eyebrow="Active"
          title="Live Challenges"
          description="Current community targets pushing the next reward unlock."
        />

        {activeChallenges.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {activeChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        ) : (
          <PremiumPanel className="border border-white/10 bg-white/[0.03] p-6 text-sm text-white/65">
            No active challenges are live right now.
          </PremiumPanel>
        )}
      </section>

      <section className="space-y-6">
        <SectionHeader
          eyebrow="Completed"
          title="Finished Challenges"
          description="Completed community pushes and previously unlocked reward runs."
        />

        {completedChallenges.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {completedChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        ) : (
          <PremiumPanel className="border border-white/10 bg-white/[0.03] p-6 text-sm text-white/65">
            Completed challenges will show here once they wrap.
          </PremiumPanel>
        )}
      </section>
    </div>
  );
}