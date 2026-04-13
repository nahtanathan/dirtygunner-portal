'use client';

import { PageHero } from '@/components/ui/PageHero';
import { AdminStatCard } from '@/components/admin/AdminStatCard';
import { useAdminStore } from '@/store/admin-store';

export default function AdminPage() {
  const raffles = useAdminStore((state) => state.raffles);
  const challenges = useAdminStore((state) => state.challenges);
  const hunts = useAdminStore((state) => state.bonusHunts);
  const leaderboard = useAdminStore((state) => state.leaderboardSettings);

  return (
    <div className="space-y-8">
      <PageHero eyebrow="Admin" title="DirtyGunner Control Panel" description="Premium internal command layer for leaderboard settings, challenge ops, raffles, and bonus hunt archive control." />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <AdminStatCard label="Active Raffles" value={String(raffles.filter((item) => item.status === 'active').length)} />
        <AdminStatCard label="Active Challenges" value={String(challenges.filter((item) => item.status === 'active').length)} />
        <AdminStatCard label="Active Bonus Hunts" value={String(hunts.filter((item) => item.status === 'active').length)} />
        <AdminStatCard label="Leaderboard End" value={new Date(leaderboard.countdownTarget).toLocaleDateString()} />
        <AdminStatCard label="Top Prize" value={`$${leaderboard.prizeTiers[0]?.prize ?? 0}`} />
        <AdminStatCard label="Fallback Status" value="Mock Local" subtext="Structured to swap into a real data layer later." />
      </div>
    </div>
  );
}
