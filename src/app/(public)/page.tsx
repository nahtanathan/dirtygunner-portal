import Image from "next/image";

import { HomeClient } from "@/components/home/HomeClient";
import { CTAButton } from "@/components/ui/CTAButton";
import { dataRepository } from "@/lib/data/repository";
import { prisma } from "@/lib/prisma";
import { getRoobetLeaderboard } from "@/lib/roobet";
import type { BonusHuntSnapshot, Challenge, Raffle } from "@/lib/types";

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

  const [bonusHunts, raffles, challenges] = await Promise.all([
    dataRepository.getBonusHunts(),
    dataRepository.getRaffles(),
    dataRepository.getChallenges(),
  ]);

  const typedBonusHunts = bonusHunts as BonusHuntSnapshot;
  const typedRaffles = Array.isArray(raffles) ? (raffles as Raffle[]) : [];
  const typedChallenges = Array.isArray(challenges)
    ? (challenges as Challenge[])
    : [];

  return (
    <div className="space-y-6 md:space-y-7">
      <section className="mx-auto w-full max-w-[1360px] px-4 pt-2 md:px-6 md:pt-4">
        <div className="command-card min-h-[360px] border-white/8 lg:min-h-[395px]">
          <div className="absolute inset-0">
            <Image
              src="/art/hero-operator.webp"
              alt="DirtyGunner command hero"
              fill
              priority
              className="object-cover object-[77%_center]"
            />
          </div>

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,8,13,0.988)_0%,rgba(4,8,13,0.958)_17%,rgba(4,8,13,0.84)_39%,rgba(4,8,13,0.38)_66%,rgba(4,8,13,0.08)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_17%_18%,rgba(72,143,236,0.13),transparent_18%),radial-gradient(circle_at_72%_14%,rgba(88,141,214,0.22),transparent_14%),radial-gradient(circle_at_84%_27%,rgba(88,141,214,0.15),transparent_12%),linear-gradient(180deg,rgba(255,255,255,0.018),transparent_18%)]" />

          <div
            className="pointer-events-none absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage: "url('/art/bg-grid.png')",
              backgroundPosition: "center",
              backgroundRepeat: "repeat",
              backgroundSize: "1160px auto",
            }}
          />

          <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "url('/art/bg-topo.png')",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            />
          </div>

          <div className="pointer-events-none absolute left-4 right-4 top-4 hidden h-px hero-frame-line xl:block" />
          <div className="pointer-events-none absolute bottom-4 left-4 right-4 hidden h-px hero-frame-line xl:block" />
          <div className="pointer-events-none absolute left-4 top-4 hidden h-4 w-4 border-l border-t border-[#7da4d2]/45 xl:block" />
          <div className="pointer-events-none absolute right-4 top-4 hidden h-4 w-4 border-r border-t border-[#7da4d2]/45 xl:block" />
          <div className="pointer-events-none absolute bottom-4 left-4 hidden h-4 w-4 border-b border-l border-[#7da4d2]/45 xl:block" />
          <div className="pointer-events-none absolute bottom-4 right-4 hidden h-4 w-4 border-b border-r border-[#7da4d2]/45 xl:block" />

          <div className="relative grid min-h-[360px] gap-4 px-5 py-5 sm:px-6 md:px-7 lg:grid-cols-[minmax(0,1.16fr)_minmax(190px,0.42fr)] lg:items-start lg:gap-3 lg:px-8 lg:py-5 xl:min-h-[395px] xl:px-10">
            <div className="max-w-[590px] pt-0.5">
              <div className="blue-data flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em]">
                <span className="text-[18px] leading-none">›</span>
                <span>Mission Control</span>
              </div>

              <div className="mt-2 h-px w-[168px] bg-[linear-gradient(90deg,rgba(110,169,239,0.78),rgba(110,169,239,0.0))]" />

              <div className="mt-5 flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-[5px] border border-white/10 bg-white/[0.04]">
                  <Image
                    src="/brand/logo-mark.png"
                    alt="DirtyGunner"
                    fill
                    className="object-contain p-2"
                  />
                </div>

                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/54">
                    DirtyGunner
                  </div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/72">
                    Command Portal
                  </div>
                </div>
              </div>

              <h1 className="mt-4 text-[3.05rem] font-black uppercase leading-[0.82] tracking-[-0.02em] text-white sm:text-[4rem] md:text-[4.7rem] xl:text-[5.25rem]">
                DirtyGunner
                <span className="block bg-gradient-to-b from-white to-[#dce8f8] bg-clip-text text-transparent">
                  Portal
                </span>
              </h1>

              <p className="mt-4 text-[0.97rem] font-semibold uppercase leading-[1.48] tracking-[0.09em] text-white/62">
                Leaderboards. Raffles. Challenges.
                <br />
                Bonus Hunts. Community.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <CTAButton href="/leaderboard">Leaderboard</CTAButton>
                <CTAButton href="/bonus-hunts" variant="secondary">
                  Bonus Hunts
                </CTAButton>
                <CTAButton href={kickUrl} variant="secondary">
                  Watch Live
                </CTAButton>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute right-4 top-4 text-right">
                <div className="space-y-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] leading-[1.8] drop-shadow-[0_0_10px_rgba(0,0,0,0.28)]">
                  <div className="text-white/78">GRID: 7A-23</div>
                  <div className="text-white/78">ZONE: BRAVO</div>
                  <div className="blue-data">STATUS: ONLINE</div>
                  <div className="text-white/78">TIME: 14:32:18</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <HomeClient
        leaderboard={leaderboard}
        countdownTarget={countdownTarget}
        bonusHunts={typedBonusHunts}
        raffles={typedRaffles}
        challenges={typedChallenges}
      />
    </div>
  );
}
