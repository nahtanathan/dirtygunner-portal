// FILE: src/app/(public)/challenges/page.tsx
import { unstable_noStore as noStore } from "next/cache";

import { PublicChallengesClient } from "@/components/challenges/PublicChallengesClient";
import { PageHero } from "@/components/ui/PageHero";
import { PremiumPanel } from "@/components/ui/PremiumPanel";
import { dataRepository } from "@/lib/data/repository";
import { getSession } from "@/lib/session";
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

  const session = await getSession();
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
        title="Challenges"
        description=" "
        aside={
          <PremiumPanel className="grid gap-4 border border-white/10 bg-white/[0.03] p-5 sm:grid-cols-3">
            <MetricBlock label="Live now" value={String(activeChallenges.length)} />
            <MetricBlock label="Approved" value={String(approvedClaims)} />
            <MetricBlock
              label="Remaining"
              value={String(remainingClaims || pendingClaims || 0)}
            />
          </PremiumPanel>
        }
      />

      <PublicChallengesClient isLoggedIn={Boolean(session?.sub)} />
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
