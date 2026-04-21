// FILE: src/components/ui/PremiumPanel.tsx
import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export function PremiumPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'panel-shell metal-border relative min-w-0 overflow-hidden rounded-[10px] p-4 sm:rounded-[10px] sm:p-5 md:rounded-[10px] md:p-6',
        'before:pointer-events-none before:absolute before:inset-0 before:bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent_30%)]',
        className,
      )}
    >
      {children}
    </div>
  );
}
