import { unstable_noStore as noStore } from "next/cache";

import { LeaderboardHeroSlab } from "@/components/leaderboard/LeaderboardHeroSlab";
import { LeaderboardRow } from "@/components/leaderboard/LeaderboardRow";
import { PrizeBreakdown } from "@/components/leaderboard/PrizeBreakdown";
import { TopThreeCards } from "@/components/leaderboard/TopThreeCards";
import { PremiumPanel } from "@/components/ui/PremiumPanel";
import { prisma } from "@/lib/prisma";
import { getRoobetLeaderboard } from "@/lib/roobet";
import type { PrizeTier } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type LeaderboardEntry = {
  rank: number;
  username: string;
  wageredTotal: number;
  prize?: number;
};

export default async function LeaderboardPage() {
  noStore();

  const settings = await prisma.leaderboardSettings.findUnique({
    where: { id: "leaderboard-settings" },
    include: {
      prizeTiers: {
        orderBy: { place: "asc" },
      },
    },
  });

  let entries: LeaderboardEntry[] = [];

  try {
    const raw = await getRoobetLeaderboard();

    entries = Array.isArray(raw)
      ? raw.map((item) => {
          const settingsPrize = settings?.prizeTiers?.find(
            (tier) => tier.place === item.rank,
          )?.prize;

          const fallbackPrize =
            typeof item.prize === "number" ? item.prize : undefined;

          return {
            rank: typeof item.rank === "number" ? item.rank : 0,
            username: item.username ?? "Unknown",
            wageredTotal:
              typeof item.wageredTotal === "number" ? item.wageredTotal : 0,
            prize: settingsPrize ?? fallbackPrize,
          };
        })
      : [];
  } catch (error) {
    console.error("Roobet leaderboard failed on leaderboard page:", error);
    entries = [];
  }

  const topThree = entries.slice(0, 3);
  const remaining = entries.slice(3);

  const title = settings?.title || "Weekly Roobet Race";
  const subtitle =
    settings?.subtitle ||
    "A restrained live read of the current race, machined down to only the numbers that matter.";
  const prizeTiers: PrizeTier[] = settings?.prizeTiers ?? [];
  const prizePool = prizeTiers.reduce((total, tier) => total + tier.prize, 0);

  const countdownTarget =
    settings?.countdownTarget?.toISOString().slice(0, 16) ||
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16);

  return (
    <div
      className="space-y-8 md:space-y-10"
      style={{
        background:
          "linear-gradient(180deg, rgba(13,17,23,0.10) 0%, rgba(10,14,20,0.12) 20%, rgba(7,10,15,0.24) 50%, rgba(5,7,10,0.44) 78%, rgba(2,3,4,0.72) 100%)",
      }}
    >
      <LeaderboardHeroSlab
        title={title}
        subtitle={subtitle}
        prizePool={prizePool}
        countdownTarget={countdownTarget}
      />

      <TopThreeCards entries={topThree} />

      <section className="vault-panel relative overflow-hidden rounded-[24px] p-5 sm:p-6 md:p-7">
        <div className="pointer-events-none absolute inset-0 metal-pattern opacity-[0.04]" />

        <div className="relative mb-5 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="vault-label">Live Standings</div>
            <h2 className="mt-3 truncate font-display text-2xl font-semibold tracking-[-0.03em] text-[#f5f7fa] sm:text-3xl">
              Full Leaderboard
            </h2>
            <p className="truncate-2 mt-2 text-sm leading-6 text-[#a1acb8]">
              Current ranked positions for this cycle.
            </p>
          </div>

          <div className="shrink-0 whitespace-nowrap text-sm text-[#6f7986]">
            {remaining.length} entries
          </div>
        </div>

        <div className="panel-inset overflow-hidden rounded-[22px]">
          <div className="grid grid-cols-[68px_minmax(0,1fr)_110px_110px] gap-3 border-b border-white/6 px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-[#6f7986] sm:grid-cols-[80px_minmax(0,1fr)_160px_180px]">
            <div>Rank</div>
            <div>User</div>
            <div className="text-right">Prize</div>
            <div className="text-right">Wager</div>
          </div>

          <div>
            {remaining.length > 0 ? (
              remaining.map((entry) => (
                <LeaderboardRow
                  key={`${entry.rank}-${entry.username}`}
                  entry={entry}
                />
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm text-[#a1acb8]">
                No leaderboard entries available right now.
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <PrizeBreakdown prizes={prizeTiers} />

        <PremiumPanel className="rounded-[24px]">
          <div className="vault-label">Lower Vault</div>
          <h3 className="mt-3 font-display text-2xl font-semibold tracking-[-0.03em] text-[#f5f7fa]">
            Engineered to stay quiet.
          </h3>
          <p className="mt-4 text-sm leading-7 text-[#a1acb8]">
            The hero carries the shimmer and engraved detail. Every section below it steps back
            into darker surfaces, thinner borders, and softer motion so the numbers stay in charge.
          </p>
          <div className="mt-6 space-y-3">
            <div className="rounded-[18px] border border-white/7 bg-black/20 px-4 py-4">
              <div className="text-[10px] uppercase tracking-[0.24em] text-[#6f7986]">
                Surface logic
              </div>
              <div className="mt-2 text-sm text-[#f5f7fa]">
                Brightest dark slab at the top, quieter panels below, deepest tone near the footer.
              </div>
            </div>
            <div className="rounded-[18px] border border-white/7 bg-black/20 px-4 py-4">
              <div className="text-[10px] uppercase tracking-[0.24em] text-[#6f7986]">
                Motion logic
              </div>
              <div className="mt-2 text-sm text-[#f5f7fa]">
                Tilt is restrained, hover states are low contrast, and shimmer opacity stays deliberately low.
              </div>
            </div>
          </div>
        </PremiumPanel>
      </div>
    </div>
  );
}
