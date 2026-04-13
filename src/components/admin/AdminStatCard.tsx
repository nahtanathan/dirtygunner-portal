import { PremiumPanel } from '@/components/ui/PremiumPanel';

export function AdminStatCard({ label, value, subtext }: { label: string; value: string; subtext?: string }) {
  return (
    <PremiumPanel>
      <div className="text-xs uppercase tracking-[0.3em] text-silver/45">{label}</div>
      <div className="mt-3 font-display text-4xl font-bold text-white">{value}</div>
      {subtext ? <div className="mt-2 text-sm text-silver/60">{subtext}</div> : null}
    </PremiumPanel>
  );
}
