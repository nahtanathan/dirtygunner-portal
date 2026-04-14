// FILE: src/components/home/HomeClient.tsx

"use client";

import { CountdownTimer } from "@/components/leaderboard/CountdownTimer";
import { TopThreeCards } from "@/components/leaderboard/TopThreeCards";
import { HomeBonusHuntsPreview } from "@/components/home/HomeBonusHuntsPreview";
import type { BonusHuntSnapshot } from "@/lib/types";

type HomeClientProps = {
  leaderboard: any[];
  countdownTarget: string;
  bonusHunts: BonusHuntSnapshot;
};

export function HomeClient({
  leaderboard,
  countdownTarget,
  bonusHunts,
}: HomeClientProps) {
  return (
    <>
      <div className="mx-auto w-full max-w-[1200px]">
        <TopThreeCards entries={leaderboard} />
      </div>

      <div className="mx-auto w-full max-w-[1200px]">
        <CountdownTimer target={countdownTarget} />
      </div>

      <HomeBonusHuntsPreview snapshot={bonusHunts} />
    </>
  );
}