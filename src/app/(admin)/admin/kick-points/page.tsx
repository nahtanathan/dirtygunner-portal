import { KickPointsAudit } from "@/components/admin/kick-points-audit";
import { PageHero } from "@/components/ui/PageHero";

export default function AdminKickPointsPage() {
  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Admin"
        title="Kick Points Audit"
        description="Inspect broadcaster health, event subscriptions, and recent Kick point receipts without relying on guesswork."
      />
      <KickPointsAudit />
    </div>
  );
}
