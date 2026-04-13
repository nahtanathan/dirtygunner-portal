import { BonusHunt } from '@/lib/types';
import { PremiumPanel } from '@/components/ui/PremiumPanel';
import { ProfitLossBadge } from '@/components/bonus-hunts/ProfitLossBadge';
import { formatCurrency, formatDate } from '@/lib/formatters';

export function BonusHuntCard({ hunt }: { hunt: BonusHunt }) {
  return (
    <PremiumPanel>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-electric">{hunt.status}</div>
          <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-white">{hunt.title}</h3>
          <p className="mt-2 text-sm text-silver/60">{hunt.provider ?? 'Mixed providers'} · {formatDate(hunt.date)}</p>
        </div>
        <ProfitLossBadge value={hunt.profitLoss} />
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><div className="text-xs uppercase tracking-[0.28em] text-silver/45">Buy Count</div><div className="mt-2 text-xl text-white">{hunt.buyCount}</div></div>
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><div className="text-xs uppercase tracking-[0.28em] text-silver/45">Total Cost</div><div className="mt-2 text-xl text-white">{formatCurrency(hunt.totalCost)}</div></div>
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4"><div className="text-xs uppercase tracking-[0.28em] text-silver/45">Return</div><div className="mt-2 text-xl text-white">{formatCurrency(hunt.totalReturn)}</div></div>
      </div>
      <p className="mt-4 text-sm leading-7 text-silver/70">{hunt.notes}</p>
    </PremiumPanel>
  );
}
