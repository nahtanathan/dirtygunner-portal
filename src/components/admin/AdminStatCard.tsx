// FILE: src/components/admin/AdminStatCard.tsx
import { PremiumPanel } from "@/components/ui/PremiumPanel";

export function AdminStatCard({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string;
  subtext?: string;
}) {
  return (
    <PremiumPanel className="min-w-0 p-5 sm:p-6">
      <div className="text-label-tight text-silver/45">{label}</div>
      <div className="mt-3 overflow-hidden text-ellipsis whitespace-nowrap font-display text-[1.9rem] font-bold leading-none text-white sm:text-[2.2rem] md:text-[2.5rem]">
        {value}
      </div>
      {subtext ? (
        <div className="mt-2 truncate-2 text-sm leading-6 text-silver/60">
          {subtext}
        </div>
      ) : null}
    </PremiumPanel>
  );
}