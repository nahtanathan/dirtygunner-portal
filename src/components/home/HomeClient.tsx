"use client";

import { TopThreeCards } from "@/components/leaderboard/TopThreeCards";
import { CountdownTimer } from "@/components/leaderboard/CountdownTimer";
import { useAdminStore } from "@/store/admin-store";

type HomeClientProps = {
  leaderboard: any[];
};

export function HomeClient({ leaderboard }: HomeClientProps) {
  const leaderboardSettings = useAdminStore((state) => state.leaderboardSettings);

  return (
    <>
      <div className="mx-auto w-full max-w-[1200px]">
        <TopThreeCards entries={leaderboard} />
      </div>

      <div className="mx-auto w-full max-w-[1200px]">
        <CountdownTimer target={leaderboardSettings.countdownTarget} />
      </div>
    </>
  );
}