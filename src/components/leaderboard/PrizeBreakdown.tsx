import { PremiumPanel } from '@/components/ui/PremiumPanel';
import { PrizeTier } from '@/lib/types';
import { formatCurrency } from '@/lib/formatters';

export function PrizeBreakdown({ prizes }: { prizes: PrizeTier[] }) {
  return (
    <PremiumPanel>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="font-display text-xs uppercase tracking-[0.32em] text-electric/70">Prize Structure</div>
          <h3 className="mt-2 font-display text-2xl font-bold uppercase tracking-wide text-white">Payout Positions</h3>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {prizes.map((tier) => (
          <div key={tier.rank} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="text-xs uppercase tracking-[0.28em] text-silver/45">#{tier.rank}</div>
            <div className="mt-2 font-display text-2xl font-bold text-white">{formatCurrency(tier.prize)}</div>
          </div>
        ))}
      </div>
    </PremiumPanel>
  );
}
