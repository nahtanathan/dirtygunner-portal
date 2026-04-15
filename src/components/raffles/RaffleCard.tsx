// FILE: src/components/raffles/RaffleCard.tsx
import { Raffle } from '@/lib/types';
import { PremiumPanel } from '@/components/ui/PremiumPanel';
import { formatDate } from '@/lib/formatters';

export function RaffleCard({ raffle }: { raffle: Raffle }) {
  return (
    <PremiumPanel className="overflow-hidden p-0">
      <div
        className="h-40 bg-cover bg-center sm:h-44"
        style={{
          backgroundImage: `linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.5)),url(${raffle.image})`,
        }}
      />
      <div className="min-w-0 p-4 sm:p-5">
        <div className="mb-3 inline-flex max-w-full rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-electric sm:text-[11px] sm:tracking-[0.28em]">
          <span className="truncate whitespace-nowrap">{raffle.status}</span>
        </div>
        <h3 className="truncate-2 font-display text-[1.45rem] font-bold uppercase tracking-wide text-white sm:text-2xl">
          {raffle.title}
        </h3>
        <p className="truncate-3 mt-3 text-sm leading-6 text-silver/70 sm:leading-7">
          {raffle.description}
        </p>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
          <div className="min-w-0 rounded-2xl border border-white/10 bg-black/20 p-3">
            <span className="text-silver/45">Entry</span>
            <div className="mt-1 truncate text-white">{raffle.entryMethod}</div>
          </div>
          <div className="min-w-0 rounded-2xl border border-white/10 bg-black/20 p-3">
            <span className="text-silver/45">Entries</span>
            <div className="mt-1 whitespace-nowrap text-white">{raffle.totalEntries}</div>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-silver/45 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:tracking-[0.24em]">
          <span className="truncate">{formatDate(raffle.startDate)}</span>
          <span className="truncate sm:text-right">{formatDate(raffle.endDate)}</span>
        </div>
        {raffle.winner ? (
          <div className="mt-4 rounded-2xl border border-electric/20 bg-electric/10 px-4 py-3 text-sm text-white">
            <span className="block truncate">Winner: {raffle.winner}</span>
          </div>
        ) : null}
      </div>
    </PremiumPanel>
  );
}