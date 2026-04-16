// FILE: src/app/(admin)/admin/kick-rewards/page.tsx
import { PageHero } from "@/components/ui/PageHero";
import { KickRewardsManager } from "@/components/admin/kick-rewards-manager";

export default function AdminKickRewardsPage() {
  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Admin"
        title="Kick Rewards"
        description="Create, enable, disable, and clean up Kick channel point rewards."
      />
      <KickRewardsManager />
    </div>
  );
}