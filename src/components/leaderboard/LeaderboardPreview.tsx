import { LeaderboardEntry } from '@/lib/types';
import { PremiumPanel } from '@/components/ui/PremiumPanel';
import { CTAButton } from '@/components/ui/CTAButton';
import { formatWager } from '@/lib/formatters';

export function LeaderboardPreview({ entries }: { entries: LeaderboardEntry[] }) {
  return (
    <PremiumPanel>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="font-display text-xs uppercase tracking-[0.32em] text-electric/70">Leaderboard Pulse</div>
          <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-wide text-white">Current Movers</h3>
        </div>
        <CTAButton href="/leaderboard" variant="secondary">Full Board</CTAButton>
      </div>
      <div className="space-y-3">
        {entries.slice(3, 8).map((entry) => (
          <div key={entry.rank} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            <div>
              <div className="font-semibold text-white">#{entry.rank} {entry.username}</div>
              <div className="text-xs uppercase tracking-[0.28em] text-silver/45">Ranked live</div>
            </div>
            <div className="font-medium text-silver">${formatWager(entry.wageredTotal)}</div>
          </div>
        ))}
      </div>
    </PremiumPanel>
  );
}
