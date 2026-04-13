import { ChallengeCard } from '@/components/challenges/ChallengeCard';
import { PageHero } from '@/components/ui/PageHero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { dataRepository } from '@/lib/data/repository';

export default function ChallengesPage() {
  const items = dataRepository.getChallenges();
  return (
    <div className="space-y-8">
      <PageHero eyebrow="Challenges" title="Community Targets With Real Presence" description="Scalable challenge presentation for stream-driven events, progress pushes, and reward unlocks." />
      <section>
        <SectionHeader eyebrow="Active" title="Live Challenges" />
        <div className="grid gap-6 lg:grid-cols-2">{items.filter((item) => item.status === 'active').map((challenge) => <ChallengeCard key={challenge.id} challenge={challenge} />)}</div>
      </section>
      <section>
        <SectionHeader eyebrow="Completed" title="Finished Challenges" />
        <div className="grid gap-6 lg:grid-cols-2">{items.filter((item) => item.status === 'completed').map((challenge) => <ChallengeCard key={challenge.id} challenge={challenge} />)}</div>
      </section>
    </div>
  );
}
