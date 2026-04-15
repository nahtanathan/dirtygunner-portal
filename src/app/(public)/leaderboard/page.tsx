// FILE: src/app/(public)/leaderboard/page.tsx
import { PageHero } from "@/components/ui/PageHero";
import { CountdownTimer } from "@/components/leaderboard/CountdownTimer";
import { TopThreeCards } from "@/components/leaderboard/TopThreeCards";
import { prisma } from "@/lib/prisma";
import { getRoobetLeaderboard } from "@/lib/roobet";

type LeaderboardEntry = {
  rank: number;
  username: string;
  wageredTotal: number;
  prize?: number;
};

export default async function LeaderboardPage() {
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
    "Top grinders earn premium payouts before the weekly reset. Every wager matters.";

  const countdownTarget =
    settings?.countdownTarget?.toISOString().slice(0, 16) ||
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16);

  return (
    <div className="space-y-8 md:space-y-10">
      <PageHero
        eyebrow="Leaderboard"
        title={title}
        description={subtitle}
      />

      <div className="mx-auto w-full max-w-[1200px]">
        <CountdownTimer target={countdownTarget} />
      </div>

      <TopThreeCards entries={topThree} />

      <section className="rounded-3xl border border-white/10 bg-black/30 p-5 backdrop-blur-xl sm:p-6">
        <div className="mb-5 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold text-white sm:text-2xl">
              Full Leaderboard
            </h2>
            <p className="truncate-2 mt-1 text-sm leading-6 text-zinc-400">
              Current ranked positions for this cycle.
            </p>
          </div>

          <div className="shrink-0 whitespace-nowrap text-sm text-zinc-500">
            {remaining.length} entries
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10">
          <div className="grid grid-cols-[68px_minmax(0,1fr)_110px] gap-3 bg-white/5 px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-zinc-500 sm:grid-cols-[80px_minmax(0,1fr)_180px]">
            <div>Rank</div>
            <div>User</div>
            <div className="text-right">Wager</div>
          </div>

          <div className="divide-y divide-white/10">
            {remaining.length > 0 ? (
              remaining.map((entry) => (
                <div
                  key={`${entry.rank}-${entry.username}`}
                  className="grid grid-cols-[68px_minmax(0,1fr)_110px] items-center gap-3 px-4 py-4 text-sm sm:grid-cols-[80px_minmax(0,1fr)_180px]"
                >
                  <div className="whitespace-nowrap font-semibold text-white">
                    #{entry.rank}
                  </div>

                  <div className="min-w-0">
                    <div className="truncate font-semibold text-white">
                      {entry.username}
                    </div>
                  </div>

                  <div className="whitespace-nowrap text-right font-semibold text-zinc-200">
                    ${entry.wageredTotal.toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm text-zinc-400">
                No leaderboard entries available right now.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}