"use client";

import { TopThreeCards } from "@/components/leaderboard/TopThreeCards";
import { CountdownTimer } from "@/components/leaderboard/CountdownTimer";

type HomeClientProps = {
  leaderboard: any[];
  countdownTarget: string;
};

export function HomeClient({ leaderboard, countdownTarget }: HomeClientProps) {
  return (
    <>
      <div className="mx-auto w-full max-w-[1200px]">
        <TopThreeCards entries={leaderboard} />
      </div>

      <div className="mx-auto w-full max-w-[1200px]">
        <CountdownTimer target={countdownTarget} />
      </div>
    </>
  );
}