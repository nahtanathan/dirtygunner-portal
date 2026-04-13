import { cn } from '@/lib/utils/cn';

export function ProfitLossBadge({ value }: { value: number }) {
  const positive = value >= 0;
  return (
    <div className={cn('inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em]', positive ? 'bg-emerald-500/15 text-emerald-300' : 'bg-danger/15 text-red-300')}>
      {positive ? '+' : ''}{value.toLocaleString()}
    </div>
  );
}
