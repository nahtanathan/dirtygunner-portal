import { TopThreeCards } from "@/components/leaderboard/TopThreeCards";
import { CountdownTimer } from "@/components/leaderboard/CountdownTimer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LeaderboardRow } from "@/components/leaderboard/LeaderboardRow";
import { dataRepository } from "@/lib/data/repository";
import { getRoobetLeaderboard } from "@/lib/roobet";

export default async function LeaderboardPage() {
  const leaderboardSettings = dataRepository.getLeaderboardSettings();

  let leaderboard = [];
  try {
    leaderboard = await getRoobetLeaderboard();
  } catch (error) {
    console.error("Roobet leaderboard failed on leaderboard page:", error);
    leaderboard = dataRepository.getLeaderboardEntries();
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="mx-auto w-full max-w-[1200px]">
        <SectionHeader
          eyebrow="Leaderboard"
          title="Current Race Standings"
          description="Player names are intentionally obscured. Weighted wagers are used for standings."
        />
      </div>

      <div className="mx-auto w-full max-w-[1200px]">
        <TopThreeCards entries={leaderboard} />
      </div>

      <div className="mx-auto w-full max-w-[1200px]">
        <CountdownTimer target={leaderboardSettings.countdownTarget} />
      </div>

      <div className="mx-auto w-full max-w-[1320px]">
        <section
          className="overflow-hidden rounded-[28px] border"
          style={{
            borderColor: "var(--border-subtle)",
            background:
              "linear-gradient(180deg, rgba(18,26,48,0.95) 0%, rgba(11,16,30,0.96) 100%)",
            boxShadow:
              "0 24px 60px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <div className="border-b px-5 py-5 md:px-6">
            <div
              className="text-xs font-semibold uppercase tracking-[0.34em]"
              style={{ color: "#60A5FA" }}
            >
              
            </div>

            <h3
              className="mt-2 text-2xl font-bold uppercase tracking-[0.04em]"
              style={{ color: "var(--text-primary)" }}
            >
             Full Leaderboard
            </h3>

            <div
              className="mt-4 max-w-4xl text-sm leading-6"
              style={{ color: "var(--text-secondary)" }}
            >
              Your wagers on Roobet count toward the leaderboard using weighted
              contribution rules. Games at 97% RTP or less count 100%, games above
              97% count 50%, and games at 98%+ count 10%. Only slots and provably
              fair/house games count, with dice excluded.
            </div>
          </div>

          <div className="space-y-3 p-4 md:p-5">
            {leaderboard.map((entry) => (
              <LeaderboardRow key={entry.rank} entry={entry} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}