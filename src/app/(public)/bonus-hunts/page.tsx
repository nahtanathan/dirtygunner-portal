import { BonusHuntCard } from '@/components/bonus-hunts/BonusHuntCard';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { dataRepository } from '@/lib/data/repository';

export default function BonusHuntsPage() {
  const items = dataRepository.getBonusHunts();
  return (
    <div className="space-y-8">
      <PageHero eyebrow="Bonus Hunts" title="Active Sessions and Premium Archive History" description="A structured hunt archive with active spotlighting, clean P/L presentation, and room for deeper drilldowns later." />
      <section>
        <SectionHeader eyebrow="Active" title="Current Hunt" />
        <div className="grid gap-6">{items.filter((item) => item.status === 'active').map((hunt) => <BonusHuntCard key={hunt.id} hunt={hunt} />)}</div>
      </section>
      <section>
        <SectionHeader eyebrow="Archive" title="Previous Hunts" />
        <div className="grid gap-6 lg:grid-cols-2">{items.filter((item) => item.status === 'archived').map((hunt) => <BonusHuntCard key={hunt.id} hunt={hunt} />)}</div>
      </section>
    </div>
  );
}
