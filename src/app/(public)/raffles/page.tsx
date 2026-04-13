import { RaffleCard } from '@/components/raffles/RaffleCard';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { dataRepository } from '@/lib/data/repository';

export default function RafflesPage() {
  const items = dataRepository.getRaffles();
  return (
    <div className="space-y-8">
      <PageHero eyebrow="Raffles" title="Premium Community Drops" description="Active raffles, finished events, and reward-driven community moments in one elevated archive." />
      <section>
        <SectionHeader eyebrow="Active" title="Open Raffles" />
        <div className="grid gap-6 lg:grid-cols-2">{items.filter((item) => item.status === 'active').map((raffle) => <RaffleCard key={raffle.id} raffle={raffle} />)}</div>
      </section>
      <section>
        <SectionHeader eyebrow="Archive" title="Past Raffles" />
        <div className="grid gap-6 lg:grid-cols-2">{items.filter((item) => item.status !== 'active').map((raffle) => <RaffleCard key={raffle.id} raffle={raffle} />)}</div>
      </section>
    </div>
  );
}
