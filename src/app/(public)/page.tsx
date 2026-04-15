// FILE: src/app/(public)/page.tsx
import Image from "next/image";

import { HomeClient } from "@/components/home/HomeClient";
import { CTAButton } from "@/components/ui/CTAButton";
import { PremiumPanel } from "@/components/ui/PremiumPanel";
import { dataRepository } from "@/lib/data/repository";
import { prisma } from "@/lib/prisma";
import { getRoobetLeaderboard } from "@/lib/roobet";

export const dynamic = "force-dynamic";

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

  let countdownTarget =
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);

  try {
    const leaderboardSettings = await prisma.leaderboardSettings.findUnique({
      where: { id: "leaderboard-settings" },
    });

    if (leaderboardSettings?.countdownTarget) {
      countdownTarget = leaderboardSettings.countdownTarget
        .toISOString()
        .slice(0, 16);
    }
  } catch (error) {
    console.error("Failed to load leaderboard settings:", error);
  }

  let leaderboard: any[] = [];

  try {
    const data = await getRoobetLeaderboard();
    leaderboard = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Roobet leaderboard failed on homepage:", error);
    leaderboard = [];
  }

  const bonusHunts = await dataRepository.getBonusHunts();

  return (
    <div className="space-y-8 md:space-y-10">
      {/* HERO */}
      <section className="mx-auto w-full max-w-[1280px] px-4 pt-2 md:px-6 md:pt-4">
        <PremiumPanel className="overflow-hidden p-5 text-center sm:p-6 md:p-8 xl:p-10">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at top center, rgba(109,143,179,0.12), transparent 34%), linear-gradient(180deg, rgba(255,255,255,0.03), transparent 38%)",
            }}
          />

          <div className="relative mx-auto flex min-w-0 max-w-[980px] flex-col items-center">
            <div className="mb-5 flex w-full justify-center sm:mb-6">
              <Image
                src="/images/dirty-gunner-gaming.png"
                alt="Dirty Gunner Gaming"
                width={1600}
                height={800}
                priority
                className="h-auto w-full max-w-[920px] object-contain"
              />
            </div>

            <p className="max-w-2xl text-sm leading-6 text-zinc-400 md:text-base md:leading-7">
              Weekly leaderboard races, raffles, challenges, and bonus hunt
              tracking.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <CTAButton href="/leaderboard">View Leaderboard</CTAButton>
              <CTAButton href="/bonus-hunts" variant="secondary">
                View Bonus Hunts
              </CTAButton>
              <CTAButton href={kickUrl} variant="secondary">
                Watch Stream
              </CTAButton>
            </div>
          </div>
        </PremiumPanel>
      </section>

      {/* ABOUT LINE */}
      <section className="mx-auto max-w-[800px] px-4 text-center">
        <div className="h-px w-full bg-white/10 mb-4" />

        <p className="text-sm md:text-base text-white/60 leading-relaxed">
          United States Navy Gunner&apos;s Mate 2nd Class active duty from 99-03 reserve from 03-05. Weapons and range instructor 5&quot; gun mechanic.
        </p>

        <div className="h-px w-full bg-white/10 mt-4" />
      </section>

      {/* MAIN CONTENT */}
      <HomeClient
        leaderboard={leaderboard}
        countdownTarget={countdownTarget}
        bonusHunts={bonusHunts}
      />
    </div>
  );
}