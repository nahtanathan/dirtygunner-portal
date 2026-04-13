"use client";

import { useMemo } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { CountdownTimer } from "@/components/leaderboard/CountdownTimer";
import { TopThreeCards } from "@/components/leaderboard/TopThreeCards";
import { useAdminStore } from "@/store/admin-store";
import { dataRepository } from "@/lib/data/repository";

type PrizeTier = {
  place: number;
  prize: number;
};

type LeaderboardSettingsShape = {
  title?: string;
  subtitle?: string;
  countdownTarget: string;
  startDate?: string;
  endDate?: string;
  prizeTiers: PrizeTier[];
};

export default function LeaderboardPage() {
  const leaderboardSettings = useAdminStore(
    (state) => state.leaderboardSettings
  ) as LeaderboardSettingsShape;

  const entries = useMemo(() => dataRepository.getLeaderboardEntries(), []);

  const topThree = entries.slice(0, 3);
  const remaining = entries.slice(3);

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Leaderboard"
        title={
          leaderboardSettings.title?.trim() || "Weekly Leaderboard"
        }
        description={
          leaderboardSettings.subtitle?.trim() ||
          "Track the current race, countdown, and prize positions."
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {leaderboardSettings.prizeTiers.map((tier) => (
          <div
            key={tier.place}
            className="rounded-3xl border border-white/10 bg-black/30 p-5 backdrop-blur-xl"
          >
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Place #{tier.place}
            </div>
            <div className="mt-2 text-3xl font-bold text-white">
              ${tier.prize.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div className="mx-auto w-full max-w-[1200px]">
        <CountdownTimer target={leaderboardSettings.countdownTarget} />
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/30 p-5 backdrop-blur-xl">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Start
            </div>
            <div className="mt-1 text-white">
              {leaderboardSettings.startDate
                ? new Date(leaderboardSettings.startDate).toLocaleString()
                : "Not set"}
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              End
            </div>
            <div className="mt-1 text-white">
              {leaderboardSettings.endDate
                ? new Date(leaderboardSettings.endDate).toLocaleString()
                : "Not set"}
            </div>
          </div>
        </div>
      </div>

      <TopThreeCards entries={topThree} />

      <section className="rounded-3xl border border-white/10 bg-black/30 p-5 backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Full Leaderboard</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Remaining ranked positions for the current cycle.
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10">
          <div className="grid grid-cols-[80px_minmax(0,1fr)_180px] bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.18em] text-zinc-500">
            <div>Rank</div>
            <div>User</div>
            <div className="text-right">Wager</div>
          </div>

          <div className="divide-y divide-white/10">
            {remaining.map((entry: any, index: number) => (
              <div
                key={entry.id ?? `${entry.username}-${index}`}
                className="grid grid-cols-[80px_minmax(0,1fr)_180px] items-center px-4 py-4 text-sm"
              >
                <div className="font-semibold text-white">
                  #{index + 4}
                </div>

                <div className="min-w-0">
                  <div className="truncate font-semibold text-white">
                    {entry.username ?? entry.name ?? "Unknown"}
                  </div>
                </div>

                <div className="text-right font-semibold text-zinc-200">
                  {typeof entry.wagered === "number"
                    ? `$${entry.wagered.toLocaleString()}`
                    : typeof entry.wager === "number"
                    ? `$${entry.wager.toLocaleString()}`
                    : typeof entry.amount === "number"
                    ? `$${entry.amount.toLocaleString()}`
                    : "$0"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}