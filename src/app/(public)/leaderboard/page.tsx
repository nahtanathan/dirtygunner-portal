import { PageHero } from "@/components/ui/PageHero";
import { CountdownTimer } from "@/components/leaderboard/CountdownTimer";
import { TopThreeCards } from "@/components/leaderboard/TopThreeCards";
import { prisma } from "@/lib/prisma";
import { dataRepository } from "@/lib/data/repository";

export default async function LeaderboardPage() {
  const settings = await prisma.leaderboardSettings.findUnique({
    where: { id: "leaderboard-settings" },
    include: {
      prizeTiers: {
        orderBy: { place: "asc" },
      },
    },
  });

  const entries = dataRepository.getLeaderboardEntries();
  const topThree = entries.slice(0, 3);
  const remaining = entries.slice(3);

  const title = settings?.title || "Weekly Roobet Race";
  const subtitle =
    settings?.subtitle ||
    "Top grinders earn premium payouts before the weekly reset. Every wager matters.";

  const countdownTarget =
    settings?.countdownTarget.toISOString().slice(0, 16) ||
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Leaderboard"
        title={title}
        description={subtitle}
      />

      <div className="mx-auto w-full max-w-[1200px]">
        <CountdownTimer target={countdownTarget} />
      </div>

      <TopThreeCards entries={topThree} />

      <section className="rounded-3xl border border-white/10 bg-black/30 p-5 backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Full Leaderboard</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Current ranked positions for this cycle.
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
                <div className="font-semibold text-white">#{index + 4}</div>

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