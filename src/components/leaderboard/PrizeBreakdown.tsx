import { PremiumPanel } from "@/components/ui/PremiumPanel";
import { PrizeTier } from "@/lib/types";
import { formatCurrency } from "@/lib/formatters";

export function PrizeBreakdown({ prizes }: { prizes: PrizeTier[] }) {
  return (
    <PremiumPanel className="rounded-[24px]">
      <div className="mb-5">
        <div className="vault-label">Prize Structure</div>
        <h3 className="mt-3 font-display text-2xl font-semibold tracking-[-0.03em] text-[#f5f7fa]">
          Payout positions
        </h3>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {prizes.map((tier) => (
          <div
            key={tier.place}
            className="rounded-[20px] border border-white/7 bg-black/20 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.02)]"
          >
            <div className="text-[10px] uppercase tracking-[0.24em] text-[#6f7986]">
              Place {tier.place}
            </div>
            <div className="mt-3 font-display text-[1.6rem] font-semibold tracking-[-0.04em] text-[#f5f7fa]">
              {formatCurrency(tier.prize)}
            </div>
          </div>
        ))}
      </div>
    </PremiumPanel>
  );
}
