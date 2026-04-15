// FILE: src/components/bonus-hunts/ProfitLossBadge.tsx
import { cn } from "@/lib/utils/cn";

function formatSignedCurrency(value: number) {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}${new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Math.abs(value))}`;
}

export function ProfitLossBadge({ value }: { value: number }) {
  const positive = value >= 0;

  return (
    <div
      className={cn(
        "inline-flex max-w-full items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] sm:text-xs sm:tracking-[0.25em]",
        positive
          ? "bg-emerald-500/15 text-emerald-300"
          : "bg-danger/15 text-red-300",
      )}
    >
      <span className="truncate whitespace-nowrap">{formatSignedCurrency(value)}</span>
    </div>
  );
}