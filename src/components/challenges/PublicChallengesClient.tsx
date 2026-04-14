"use client";

import { useEffect, useMemo, useState } from "react";

import { ChallengeCard } from "@/components/challenges/ChallengeCard";
import { PremiumPanel } from "@/components/ui/PremiumPanel";
import type { Challenge } from "@/lib/types";

async function readApiResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  return JSON.parse(text) as T;
}

export function PublicChallengesClient({
  isLoggedIn,
}: {
  isLoggedIn: boolean;
}) {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadChallenges() {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/challenges", {
        method: "GET",
        cache: "no-store",
      });

      const data = await readApiResponse<Challenge[] | { error?: string }>(res);

      if (!res.ok || !Array.isArray(data)) {
        throw new Error(
          !Array.isArray(data) && typeof data?.error === "string"
            ? data.error
            : "Failed to load challenges",
        );
      }

      setChallenges(data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load challenges",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadChallenges();
  }, []);

  const activeChallenges = useMemo(
    () => challenges.filter((item) => item.status === "active"),
    [challenges],
  );

  const completedChallenges = useMemo(
    () => challenges.filter((item) => item.status === "completed"),
    [challenges],
  );

  if (isLoading) {
    return (
      <PremiumPanel className="border border-white/10 bg-white/[0.03] p-6 text-sm text-white/65">
        Loading challenges...
      </PremiumPanel>
    );
  }

  if (error) {
    return (
      <PremiumPanel className="border border-red-400/20 bg-red-500/10 p-6 text-sm text-red-100">
        {error}
      </PremiumPanel>
    );
  }

  return (
    <div className="space-y-10">
      <section className="space-y-6">
        {activeChallenges.length > 0 ? (
          <div className="grid gap-6">
            {activeChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>
        ) : (
          <PremiumPanel className="border border-white/10 bg-white/[0.03] p-6 text-sm text-white/65">
            No active challenges are live right now.
          </PremiumPanel>
        )}
      </section>

      <section className="space-y-6">
        {completedChallenges.length > 0 ? (
          <div className="grid gap-6">
            {completedChallenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                isLoggedIn={isLoggedIn}
              />
            ))}
          </div>
        ) : (
          <PremiumPanel className="border border-white/10 bg-white/[0.03] p-6 text-sm text-white/65">
            Completed challenges will show here once they wrap.
          </PremiumPanel>
        )}
      </section>
    </div>
  );
}