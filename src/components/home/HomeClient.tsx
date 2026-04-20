"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Trophy, ChevronRight, Gift, Flame, Target } from "lucide-react";

import { HomeBonusHuntsPreview } from "@/components/home/HomeBonusHuntsPreview";
import type {
  BonusHuntSnapshot,
  Challenge,
  Raffle,
} from "@/lib/types";

type LeaderboardEntry = {
  rank?: number;
  username: string;
  wageredTotal?: number;
  prize?: number | null;
};

type HomeClientProps = {
  leaderboard: LeaderboardEntry[];
  countdownTarget: string;
  bonusHunts: BonusHuntSnapshot;
  raffles: Raffle[];
  challenges: Challenge[];
};

type TimeLeft = {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(target?: string): TimeLeft {
  if (!target) {
    return {
      totalMs: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  const diff = new Date(target).getTime() - Date.now();
  const safe = Math.max(diff, 0);

  return {
    totalMs: safe,
    days: Math.floor(safe / (1000 * 60 * 60 * 24)),
    hours: Math.floor((safe / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((safe / (1000 * 60)) % 60),
    seconds: Math.floor((safe / 1000) % 60),
  };
}

function formatCountdownCompact(target?: string) {
  const left = getTimeLeft(target);

  return `${String(left.days).padStart(2, "0")}D ${String(left.hours).padStart(
    2,
    "0",
  )}H ${String(left.minutes).padStart(2, "0")}M ${String(
    left.seconds,
  ).padStart(2, "0")}S`;
}

function formatCurrency(value?: number | null) {
  if (value === undefined || value === null) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value?: number | null) {
  if (value === undefined || value === null) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, value));
}

function getActiveRaffle(raffles: Raffle[]) {
  return raffles.find((raffle) => raffle.status === "active") ?? raffles[0] ?? null;
}

function getActiveChallenge(challenges: Challenge[]) {
  return challenges.find((challenge) => challenge.status === "active") ?? challenges[0] ?? null;
}

function getLiveHunt(snapshot: BonusHuntSnapshot) {
  return snapshot.liveHunts[0] ?? snapshot.previousHunts[0] ?? null;
}

export function HomeClient({
  leaderboard,
  countdownTarget,
  bonusHunts,
  raffles,
  challenges,
}: HomeClientProps) {
  const [boardTime, setBoardTime] = useState(() =>
    getTimeLeft(countdownTarget),
  );

  useEffect(() => {
    setBoardTime(getTimeLeft(countdownTarget));

    const interval = window.setInterval(() => {
      setBoardTime(getTimeLeft(countdownTarget));
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [countdownTarget]);

  const activeRaffle = useMemo(() => getActiveRaffle(raffles), [raffles]);
  const activeChallenge = useMemo(
    () => getActiveChallenge(challenges),
    [challenges],
  );
  const liveHunt = useMemo(() => getLiveHunt(bonusHunts), [bonusHunts]);
  const hasAnyRaffles = raffles.length > 0;
  const hasAnyChallenges = challenges.length > 0;

  const raffleTime = useMemo(
    () => formatCountdownCompact(activeRaffle?.endDate),
    [activeRaffle?.endDate, boardTime.totalMs],
  );

  const challengeTime = useMemo(
    () => formatCountdownCompact(activeChallenge?.endDate),
    [activeChallenge?.endDate, boardTime.totalMs],
  );

  const huntOpenCount =
    liveHunt?.openedBonuses ??
    (typeof liveHunt?.buyCount === "number" &&
    typeof liveHunt?.unopenedBonuses === "number"
      ? liveHunt.buyCount - liveHunt.unopenedBonuses
      : undefined);

  const huntTotalCount =
    liveHunt?.buyCount ?? liveHunt?.bonusCount ?? liveHunt?.openedBonuses ?? 0;

  const huntProgress = huntTotalCount
    ? clampPercent(((huntOpenCount ?? 0) / huntTotalCount) * 100)
    : 0;

  const challengeProgress = activeChallenge
    ? clampPercent(
        ((activeChallenge.approvedClaims + activeChallenge.pendingClaims) /
          Math.max(activeChallenge.claimLimit, 1)) *
          100,
      )
    : 0;

  const totalGivenAway = leaderboard.reduce(
    (sum, item) => sum + (item.prize ?? 0),
    0,
  );

  const totalPointsDistributed = leaderboard.reduce(
    (sum, item) => sum + (item.wageredTotal ?? 0),
    0,
  );

  return (
    <div className="space-y-6 md:space-y-7">
      <section className="mx-auto w-full max-w-[1360px] px-4 md:px-6">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.68fr)_minmax(285px,0.78fr)]">
          <div className="command-card overflow-hidden border-white/8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(107,143,183,0.08),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_18%)]" />

            <div className="relative border-b border-white/10 px-5 py-4 sm:px-5 lg:px-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <Trophy className="h-[18px] w-[18px] shrink-0 text-white/78" />
                    <h2 className="truncate text-[1.18rem] font-bold uppercase tracking-[0.05em] text-white">
                      Leaderboard
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <div className="panel-inset soft-glow-hover rounded-[5px] px-3.5 py-2.5">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/38">
                      Season Ends In
                    </div>
                    <div className="blue-data mt-1.5 text-sm font-semibold">
                      {String(boardTime.days).padStart(2, "0")}D{" "}
                      {String(boardTime.hours).padStart(2, "0")}H{" "}
                      {String(boardTime.minutes).padStart(2, "0")}M{" "}
                      {String(boardTime.seconds).padStart(2, "0")}S
                    </div>
                  </div>

                  <div className="panel-inset soft-glow-hover rounded-[5px] px-3.5 py-2.5">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/38">
                      Active Board
                    </div>
                    <div className="mt-1.5 text-sm font-semibold text-white">
                      Weekly Wager Race
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative px-3 pb-3 pt-3 sm:px-4 lg:px-5">
              <div className="panel-inset overflow-hidden rounded-[5px]">
                <div className="grid grid-cols-[56px_minmax(0,1.55fr)_116px_96px_118px] gap-3 border-b border-white/8 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
                  <div>Rank</div>
                  <div>User</div>
                  <div className="text-right">Points</div>
                  <div className="text-right">Prize</div>
                  <div className="text-right">Wagered</div>
                </div>

                <div className="divide-y divide-white/6">
                  {leaderboard.slice(0, 10).map((entry, index) => {
                    const rank = entry.rank ?? index + 1;
                    const isTopThree = rank <= 3;

                    return (
                      <div
                        key={`${entry.username}-${rank}`}
                        className={`grid grid-cols-[56px_minmax(0,1.55fr)_116px_96px_118px] gap-3 px-4 py-2.5 text-sm transition-colors duration-200 hover:bg-white/[0.025] ${
                          isTopThree
                            ? "bg-[linear-gradient(90deg,rgba(107,143,183,0.05),transparent_30%)]"
                            : ""
                        }`}
                      >
                        <div className="flex items-center">
                          {isTopThree ? (
                            <span
                              className={`inline-flex h-7 w-7 items-center justify-center rounded-[6px] border text-xs font-bold ${
                                rank === 1
                                  ? "border-[#d1a24b]/40 bg-[#d1a24b]/16 text-[#f0cb7f]"
                                  : rank === 2
                                    ? "border-slate-300/20 bg-slate-300/10 text-slate-200"
                                    : "border-amber-700/30 bg-amber-700/14 text-amber-300"
                              }`}
                            >
                              {rank}
                            </span>
                          ) : (
                            <span className="text-sm font-semibold text-white/74">
                              {rank}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="truncate font-semibold leading-5 text-white">
                            {entry.username}
                          </div>
                          <div className="mt-0.5 text-[10px] uppercase tracking-[0.20em] text-white/34">
                            Ranked live
                          </div>
                        </div>

                        <div className="blue-data text-right font-semibold">
                          {formatNumber(entry.wageredTotal ?? 0)}
                        </div>

                        <div className="gold-data text-right font-semibold">
                          {formatCurrency(entry.prize ?? 0)}
                        </div>

                        <div className="text-right font-semibold text-white/70">
                          {formatCurrency(entry.wageredTotal ?? 0)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-3">
                <Link
                  href="/leaderboard"
                  className="group flex items-center justify-center gap-3 rounded-[5px] border border-white/10 bg-black/20 px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-all duration-200 hover:border-[#5ca7ff]/20 hover:bg-white/[0.04] hover:shadow-[0_12px_30px_rgba(0,0,0,0.22)]"
                >
                  <span>View Full Leaderboard</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-white/55 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <DashboardCard
              icon={<Gift className="h-4 w-4 shrink-0" />}
              eyebrow="Next Raffle"
              href="/raffles"
              cta="View All"
            >
              <div className="flex gap-3">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[5px] border border-white/10 bg-black/20">
                  <Image
                    src={activeRaffle?.image ?? "/prizes/cash-stack.png"}
                    alt={activeRaffle?.title ?? "Raffle prize"}
                    fill
                    className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-[1rem] font-bold uppercase tracking-[0.03em] text-white">
                    {activeRaffle?.title ?? "No raffles right now"}
                  </div>

                  <div className="mt-1.5 text-sm text-white/58">
                    {activeRaffle?.prizeDetails ??
                      (hasAnyRaffles
                        ? "Enter for your chance to win"
                        : "Check back for the next raffle drop")}
                  </div>

                  <div className="blue-data mt-3 text-[1.25rem] font-bold tracking-[0.03em]">
                    {hasAnyRaffles ? raffleTime : "No live raffle"}
                  </div>
                </div>
              </div>

              <CardButton href="/raffles">View Raffles</CardButton>
            </DashboardCard>

            <DashboardCard
              icon={<Flame className="h-4 w-4 shrink-0" />}
              eyebrow="Bonus Hunt"
              href="/bonus-hunts"
              cta="View All"
            >
              <div className="blue-data text-[10px] font-semibold uppercase tracking-[0.22em]">
                Current Hunt
              </div>

              <div className="mt-2.5 text-[1.2rem] font-black uppercase leading-[1.02] text-white">
                {liveHunt?.startCost
                  ? `${formatCurrency(liveHunt.startCost)} Hunt`
                  : liveHunt?.title ?? "No Active Hunt"}
              </div>

              <div className="mt-2.5 flex items-center justify-between text-sm text-white/62">
                <span>{liveHunt?.casino ?? liveHunt?.provider ?? "Stake"}</span>
                <span>
                  Opening {huntOpenCount ?? 0}/{huntTotalCount}
                </span>
              </div>

              <div className="mt-3 h-2 rounded-full bg-white/8">
                <div
                  className="h-2 rounded-full bg-[linear-gradient(90deg,#2f73d8,#5ca7ff)] transition-[width] duration-500"
                  style={{ width: `${huntProgress}%` }}
                />
              </div>

              <div className="mt-3.5 flex items-center justify-between text-sm">
                <span className="text-white/55">Profit / Loss</span>
                <span
                  className={`font-semibold ${
                    (liveHunt?.profitLoss ?? 0) >= 0
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {formatCurrency(liveHunt?.profitLoss ?? 0)}
                </span>
              </div>

              <CardButton href="/bonus-hunts">View Bonus Hunts</CardButton>
            </DashboardCard>

            <DashboardCard
              icon={<Target className="h-4 w-4 shrink-0" />}
              eyebrow="Challenge"
              href="/challenges"
              cta="View All"
            >
              <div className="blue-data text-[10px] font-semibold uppercase tracking-[0.22em]">
                {activeChallenge?.status === "active"
                  ? "Current Challenge"
                  : hasAnyChallenges
                    ? "Challenge Queue"
                    : "No Challenge"}
              </div>

              <div className="mt-2.5 text-[1.15rem] font-bold uppercase leading-tight text-white">
                {activeChallenge?.title ?? "No active challenge"}
              </div>

              <div className="mt-2.5 flex items-center justify-between text-sm text-white/62">
                <span>
                  {activeChallenge
                    ? activeChallenge.challengeType === "multiplier"
                      ? `Target ${formatNumber(activeChallenge.targetValue)}x`
                      : activeChallenge.reward ?? "Reward active"
                    : "Check back for the next challenge"}
                </span>
                <span>{hasAnyChallenges ? challengeTime : "Stand by"}</span>
              </div>

              <div className="mt-3 h-2 rounded-full bg-white/8">
                <div
                  className="h-2 rounded-full bg-[linear-gradient(90deg,#2f73d8,#5ca7ff)] transition-[width] duration-500"
                  style={{ width: `${challengeProgress}%` }}
                />
              </div>

              <div className="mt-3.5 flex items-center justify-between text-sm">
                <span className="text-white/55">Reward</span>
                <span className="gold-data font-semibold">
                  {activeChallenge?.reward ?? "No reward live"}
                </span>
              </div>

              <CardButton href="/challenges">View Challenges</CardButton>
            </DashboardCard>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <BottomStat
            label="Total Users"
            value={formatNumber(leaderboard.length)}
          />
          <BottomStat
            label="Total Given Away"
            value={formatCurrency(totalGivenAway)}
          />
          <BottomStat
            label="Active Hunts"
            value={formatNumber(
              bonusHunts.activeHunts ?? bonusHunts.liveHunts.length,
            )}
          />
          <BottomStat
            label="Points Distributed"
            value={formatNumber(totalPointsDistributed)}
          />
        </div>
      </section>

      <HomeBonusHuntsPreview snapshot={bonusHunts} />
    </div>
  );
}

function DashboardCard({
  icon,
  eyebrow,
  href,
  cta,
  children,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  href: string;
  cta: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group command-card panel-hover border-white/8 p-4 sm:p-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(107,143,183,0.08),transparent_20%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_16%)]" />

      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-white">
            <span className="text-white/68">{icon}</span>
            <div className="text-[1rem] font-bold uppercase tracking-[0.05em]">
              {eyebrow}
            </div>
          </div>

          <Link
            href={href}
            className="blue-data text-[11px] font-semibold uppercase tracking-[0.20em] transition-opacity hover:opacity-80"
          >
            {cta}
          </Link>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

function CardButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="mt-4 flex items-center justify-center rounded-[5px] border border-[#5c95df]/18 bg-[linear-gradient(180deg,rgba(47,115,216,0.12),rgba(92,167,255,0.05))] px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-all duration-200 hover:border-[#7aaef0]/28 hover:bg-[linear-gradient(180deg,rgba(47,115,216,0.18),rgba(92,167,255,0.08))] hover:shadow-[0_12px_28px_rgba(42,97,173,0.14)]"
    >
      {children}
    </Link>
  );
}

function BottomStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="command-card panel-hover border-white/8 px-4 py-3.5">
      <div className="relative">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/38">
          {label}
        </div>
        <div className="mt-1.5 text-[1.3rem] font-bold tracking-tight text-white">
          {value}
        </div>
      </div>
    </div>
  );
}
