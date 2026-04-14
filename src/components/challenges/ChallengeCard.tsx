// FILE: src/components/challenges/ChallengeCard.tsx

import { PremiumPanel } from "@/components/ui/PremiumPanel";
import type { Challenge } from "@/lib/types";

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "TBA";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const safeGoal = challenge.goal > 0 ? challenge.goal : 1;
  const progressPercent = Math.min(
    (challenge.currentProgress / safeGoal) * 100,
    100,
  );
  const remaining = Math.max(challenge.goal - challenge.currentProgress, 0);
  const isCompleted = challenge.status === "completed";

  return (
    <PremiumPanel className="group relative overflow-hidden border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-sm transition duration-300 hover:border-white/15 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.025))]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_35%)] opacity-80" />

      <div className="relative space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${
                isCompleted
                  ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
                  : "border-amber-400/25 bg-amber-400/10 text-amber-200"
              }`}
            >
              {isCompleted ? "Completed" : "Active"}
            </span>

            <h3 className="text-xl font-semibold tracking-tight text-white">
              {challenge.title}
            </h3>
          </div>

          <div className="text-right">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
              Reward
            </p>
            <p className="mt-2 max-w-[15rem] text-sm font-medium text-white/88">
              {challenge.reward}
            </p>
          </div>
        </div>

        {challenge.description ? (
          <p className="text-sm leading-6 text-white/68">
            {challenge.description}
          </p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
              Progress
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              {formatNumber(challenge.currentProgress)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
              Goal
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              {formatNumber(challenge.goal)}
            </p>
          </div>

          <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
              Remaining
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              {formatNumber(remaining)}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/55">Completion</span>
            <span className="font-semibold text-white">
              {Math.round(progressPercent)}%
            </span>
          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-white/8">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,rgba(245,158,11,0.9),rgba(250,204,21,0.95))] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-white/52">
          <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5">
            Starts {formatDate(challenge.startDate)}
          </span>
          <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5">
            Ends {formatDate(challenge.endDate)}
          </span>
        </div>
      </div>
    </PremiumPanel>
  );
}