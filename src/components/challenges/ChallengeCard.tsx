import { Challenge } from '@/lib/types';
import { PremiumPanel } from '@/components/ui/PremiumPanel';

export function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const percent = Math.min((challenge.currentProgress / challenge.goal) * 100, 100);

  return (
    <PremiumPanel>
      <div className="mb-3 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-electric">{challenge.status}</div>
      <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-white">{challenge.title}</h3>
      <p className="mt-3 text-sm leading-7 text-silver/70">{challenge.description}</p>
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/5">
        <div className="h-full rounded-full bg-[linear-gradient(90deg,rgba(78,164,255,0.95),rgba(139,92,246,0.9))]" style={{ width: `${percent}%` }} />
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-silver/60">{challenge.currentProgress.toLocaleString()} / {challenge.goal.toLocaleString()}</span>
        <span className="text-white">{challenge.reward}</span>
      </div>
    </PremiumPanel>
  );
}
