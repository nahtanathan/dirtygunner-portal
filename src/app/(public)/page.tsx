import Image from "next/image";

import { HomeClient } from "@/components/home/HomeClient";
import { CTAButton } from "@/components/ui/CTAButton";
import { dataRepository } from "@/lib/data/repository";
import { prisma } from "@/lib/prisma";
import { getRoobetLeaderboard } from "@/lib/roobet";

export const dynamic = "force-dynamic";

type LeaderboardEntry = {
  rank: number;
  username: string;
  wageredTotal: number;
  prize?: number;
};

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

  let prizeTiers: Array<{ place: number; prize: number }> = [];

  try {
    const leaderboardSettings = await prisma.leaderboardSettings.findUnique({
      where: { id: "leaderboard-settings" },
      include: {
        prizeTiers: {
          orderBy: { place: "asc" },
        },
      },
    });

    if (leaderboardSettings?.countdownTarget) {
      countdownTarget = leaderboardSettings.countdownTarget
        .toISOString()
        .slice(0, 16);
    }

    if (leaderboardSettings?.prizeTiers?.length) {
      prizeTiers = leaderboardSettings.prizeTiers;
    }
  } catch (error) {
    console.error("Failed to load leaderboard settings:", error);
  }

  let leaderboard: LeaderboardEntry[] = [];

  try {
    const data = await getRoobetLeaderboard();

    leaderboard = Array.isArray(data)
      ? data.map((item) => {
          const settingsPrize = prizeTiers.find(
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
    console.error("Roobet leaderboard failed on homepage:", error);
    leaderboard = [];
  }

  const bonusHunts = await dataRepository.getBonusHunts();

  return (
    <div className="space-y-8 md:space-y-10">
      <section className="mx-auto w-full max-w-[1360px] px-4 pt-2 md:px-6 md:pt-4">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 shadow-[0_24px_90px_rgba(0,0,0,0.42)]">
          <div className="absolute inset-0">
            <Image
              src="/images/home/hero-military-bg.jpg"
              alt="DirtyGunner military themed hero background"
              fill
              priority
              className="object-cover object-center"
            />
          </div>

          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(4,8,14,0.42) 0%, rgba(5,9,16,0.62) 26%, rgba(5,8,14,0.82) 62%, rgba(4,7,12,0.95) 100%)",
            }}
          />

          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at top center, rgba(109,143,179,0.18), transparent 34%), radial-gradient(circle at center, transparent 38%, rgba(3,6,10,0.44) 100%)",
            }}
          />

          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#05080d]" />

          <div className="relative px-5 py-12 text-center sm:px-6 sm:py-14 md:px-8 md:py-16 xl:px-10 xl:py-20">
            <div className="mx-auto flex min-w-0 max-w-[1040px] flex-col items-center">
              <div className="mb-6 flex w-full justify-center sm:mb-8">
                <Image
                  src="/images/dirty-gunner-gaming.png"
                  alt="Dirty Gunner Gaming"
                  width={1600}
                  height={800}
                  priority
                  className="h-auto w-full max-w-[760px] object-contain drop-shadow-[0_8px_40px_rgba(0,0,0,0.55)]"
                />
              </div>

              <div className="rounded-full border border-white/10 bg-black/20 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/60 backdrop-blur-md">
                DirtyGunner Live Portal
              </div>

              <p className="mt-5 max-w-2xl text-sm leading-6 text-white/72 md:text-base md:leading-7">
                Weekly leaderboard races, raffles, challenges, and bonus hunt
                tracking.
              </p>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <CTAButton href="/leaderboard">View Leaderboard</CTAButton>
                <CTAButton href="/bonus-hunts" variant="secondary">
                  View Bonus Hunts
                </CTAButton>
                <CTAButton href={kickUrl} variant="secondary">
                  Watch Stream
                </CTAButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[980px] px-4 md:px-6">
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(14,18,28,0.92),rgba(9,12,20,0.98))] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.32)] sm:p-5">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at top left, rgba(109,143,179,0.10), transparent 30%), linear-gradient(180deg, rgba(255,255,255,0.02), transparent 60%)",
            }}
          />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                <Image
                  src="/brand/logo-mark.png"
                  alt="DirtyGunner"
                  fill
                  className="object-contain p-2 drop-shadow-[0_0_10px_rgba(139,92,246,0.28)]"
                />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
                    Military Background
                  </span>
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
                    United States Navy
                  </span>
                </div>

                <h2 className="mt-3 text-left text-lg font-bold tracking-tight text-white sm:text-xl">
                  DirtyGunner
                </h2>

                <p className="mt-2 max-w-3xl text-left text-sm leading-6 text-white/62 md:text-[15px] md:leading-7">
                  United States Navy Gunner&apos;s Mate 2nd Class active duty from
                  99-03 reserve from 03-05. Weapons and range instructor 5&quot;
                  gun mechanic.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HomeClient
        leaderboard={leaderboard}
        countdownTarget={countdownTarget}
        bonusHunts={bonusHunts}
      />
    </div>
  );
}