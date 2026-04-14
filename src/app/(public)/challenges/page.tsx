import { unstable_noStore as noStore } from "next/cache";

import { ChallengeCard } from "@/components/challenges/ChallengeCard";
import { PageHero } from "@/components/ui/PageHero";
import { PremiumPanel } from "@/components/ui/PremiumPanel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { dataRepository } from "@/lib/data/repository";
import type { Challenge } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function isChallengeArray(value: unknown): value is Challenge[] {
  return Array.isArray(value);
}

type RichChallenge = Challenge & {
  approvedClaims?: number;
  pendingClaims?: number;
  remainingClaims?: number;
};

export default async function ChallengesPage() {
  noStore();

  const repoItems = await dataRepository.getChallenges();
  const items = isChallengeArray(repoItems) ? repoItems : [];

  const activeChallenges = items.filter((item) => item.status === "active");
  const completedChallenges = items.filter(
    (item) => item.status === "completed",
  );

  const approvedClaims = activeChallenges.reduce((sum, item) => {
    const rich = item as RichChallenge;
    return sum + (rich.approvedClaims ?? 0);
  }, 0);

  const pendingClaims = activeChallenges.reduce((sum, item) => {
    const rich = item as RichChallenge;
    return sum + (rich.pendingClaims ?? 0);
  }, 0);

  const remainingClaims = activeChallenges.reduce((sum, item) => {
    const rich = item as RichChallenge;
    return sum + (rich.remainingClaims ?? 0);
  }, 0);

  return (
    <div className="space-y-10">
      <PageHero
        eyebrow="Challenges"
        title="Slot Challenge Drops"
        description="Compact, claimable slot challenges built for quick browsing. Open a challenge, upload proof, and keep the main grid clean."
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
                Approved
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {approvedClaims}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
                Remaining
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {remainingClaims || pendingClaims || 0}
              </p>
            </div>
          </PremiumPanel>
        }
      />

      <section className="space-y-6">
        <SectionHeader
          eyebrow="Active"
          title="Live Challenges"
          description="Current slot challenges with cleaner cards and proof submission tucked behind a modal."
        />

        {activeChallenges.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {activeChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        ) : (
          <PremiumPanel className="border border-white/10 bg-white/[0.03] p-6 text-sm text-white/65">
            No live challenges have been created yet. Add them in admin first so
            users can submit proof against real database-backed challenges.
          </PremiumPanel>
        )}
      </section>

      <section className="space-y-6">
        <SectionHeader
          eyebrow="Completed"
          title="Finished Challenges"
          description="Completed challenge drops and previously claimed runs."
        />

        {completedChallenges.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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