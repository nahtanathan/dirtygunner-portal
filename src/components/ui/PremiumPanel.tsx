import { cn } from '@/lib/utils/cn';
import { ReactNode } from 'react';

export function PremiumPanel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'panel-shell metal-border relative overflow-hidden rounded-[28px] p-5 md:p-6',
        'before:absolute before:inset-0 before:bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent_30%)] before:pointer-events-none',
        className,
      )}
    >
      {children}
    </div>
  );
}
