import { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

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
        "vault-panel relative min-w-0 overflow-hidden rounded-[24px] p-5 sm:p-6 md:p-7",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/10" />
      <div className="pointer-events-none absolute inset-0 metal-pattern opacity-[0.06]" />
      <div className="relative">{children}</div>
    </div>
  );
}
