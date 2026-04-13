import Image from "next/image";
import { CTAButton } from "@/components/ui/CTAButton";
import { HomeClient } from "@/components/home/HomeClient";
import { prisma } from "@/lib/prisma";
import { getRoobetLeaderboard } from "@/lib/roobet";

export default async function HomePage() {
  let kickUrl = "https://kick.com/dirtygunner";

  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "site-settings" },
    });

    if (settings?.kickUrl) {
      kickUrl = settings.kickUrl;
    }
  } catch (error) {
    console.error("Failed to load site settings:", error);
  }

  const leaderboardSettings = await prisma.leaderboardSettings.findUnique({
    where: { id: "leaderboard-settings" },
  });

  const countdownTarget =
    leaderboardSettings?.countdownTarget.toISOString().slice(0, 16) ||
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);

  let leaderboard = [];
  try {
    leaderboard = await getRoobetLeaderboard();
  } catch (error) {
    console.error("Roobet leaderboard failed on homepage:", error);
    leaderboard = [];
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center px-4 pt-2 text-center md:px-6 md:pt-6">
        <div className="mb-6 flex w-full justify-center">
          <Image
            src="/images/dirty-gunner-gaming.png"
            alt="Dirty Gunner Gaming"
            width={1600}
            height={800}
            priority
            className="h-auto w-full max-w-[900px] object-contain"
          />
        </div>

        <p className="max-w-2xl text-sm text-zinc-400 md:text-base">
          Weekly leaderboard races, raffles, challenges, and bonus hunt tracking.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <CTAButton href="/leaderboard">View Leaderboard</CTAButton>
          <CTAButton href={kickUrl} variant="secondary">
            Watch Stream
          </CTAButton>
        </div>
      </div>

      <HomeClient leaderboard={leaderboard} countdownTarget={countdownTarget} />
    </div>
  );
}