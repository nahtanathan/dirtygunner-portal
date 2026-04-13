import { Raffle } from '@/lib/types';
import { PremiumPanel } from '@/components/ui/PremiumPanel';
import { formatDate } from '@/lib/formatters';

export function RaffleCard({ raffle }: { raffle: Raffle }) {
  return (
    <PremiumPanel className="overflow-hidden p-0">
      <div className="h-44 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.5)),url(${raffle.image})` }} />
      <div className="p-5">
        <div className="mb-3 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.28em] text-electric">{raffle.status}</div>
        <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-white">{raffle.title}</h3>
        <p className="mt-3 text-sm leading-7 text-silver/70">{raffle.description}</p>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-3"><span className="text-silver/45">Entry</span><div className="mt-1 text-white">{raffle.entryMethod}</div></div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-3"><span className="text-silver/45">Entries</span><div className="mt-1 text-white">{raffle.totalEntries}</div></div>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.24em] text-silver/45">
          <span>{formatDate(raffle.startDate)}</span>
          <span>{formatDate(raffle.endDate)}</span>
        </div>
        {raffle.winner ? <div className="mt-4 rounded-2xl border border-electric/20 bg-electric/10 px-4 py-3 text-sm text-white">Winner: {raffle.winner}</div> : null}
      </div>
    </PremiumPanel>
  );
}
