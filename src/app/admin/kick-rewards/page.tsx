import { KickRewardsManager } from "@/components/admin/kick-rewards-manager";

export default function AdminKickRewardsPage() {
  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-2xl font-bold text-white">Kick Rewards Admin</h1>
      <KickRewardsManager />
    </div>
  );
}