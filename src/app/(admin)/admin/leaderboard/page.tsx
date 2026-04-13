"use client";

import { PageHero } from "@/components/ui/PageHero";
import { useAdminStore } from "@/store/admin-store";

export default function AdminLeaderboardPage() {
  const settings = useAdminStore((state) => state.leaderboardSettings);
  const update = useAdminStore((state) => state.updateLeaderboardSettings);

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Admin"
        title="Leaderboard Control"
        description="Control prizes, timing, and countdown behavior."
      />

      <div className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl space-y-6">
        
        {/* Countdown Target */}
        <div>
          <label className="text-sm text-zinc-400">End Time</label>
          <input
            type="datetime-local"
            value={settings.countdownTarget}
            onChange={(e) =>
              update({ countdownTarget: e.target.value })
            }
            className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white"
          />
        </div>

        {/* Prize Tiers */}
        <div>
          <label className="text-sm text-zinc-400">Prize Tiers</label>

          <div className="mt-2 space-y-2">
            {settings.prizeTiers.map((tier, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="number"
                  value={tier.prize}
                  onChange={(e) => {
                    const updated = [...settings.prizeTiers];
                    updated[index].prize = Number(e.target.value);
                    update({ prizeTiers: updated });
                  }}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}