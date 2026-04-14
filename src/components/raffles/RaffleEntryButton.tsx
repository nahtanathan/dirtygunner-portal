// FILE: src/components/raffles/RaffleEntryButton.tsx

"use client";

import { useMemo, useState } from "react";

type RaffleEntryButtonProps = {
  raffleId: string;
  raffleStatus: "active" | "ended";
  entryMethod: string;
  entryCost: number;
  entryCurrency: "bullets" | "points";
  initialTotalEntries: number;
  initialCurrentUserEntries: number;
  initialCurrentUserPoints: number | null;
  endDate: string;
};

export function RaffleEntryButton({
  raffleId,
  raffleStatus,
  entryMethod,
  entryCost,
  entryCurrency,
  initialTotalEntries,
  initialCurrentUserEntries,
  initialCurrentUserPoints,
  endDate,
}: RaffleEntryButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [totalEntries, setTotalEntries] = useState(initialTotalEntries);
  const [currentUserEntries, setCurrentUserEntries] = useState(
    initialCurrentUserEntries,
  );
  const [currentUserPoints, setCurrentUserPoints] = useState(
    initialCurrentUserPoints,
  );

  const isEnded = useMemo(() => {
    return raffleStatus !== "active" || new Date(endDate).getTime() <= Date.now();
  }, [raffleStatus, endDate]);

  const notEnoughBalance =
    currentUserPoints !== null && entryCost > currentUserPoints;

  const buttonLabel = useMemo(() => {
    if (isEnded) {
      return "View Results";
    }

    if (entryCost <= 0) {
      return entryMethod || "Join for Free";
    }

    return entryMethod || `Enter for ${entryCost} ${entryCurrency}`;
  }, [entryCost, entryCurrency, entryMethod, isEnded]);

  async function handleEnter() {
    if (isEnded || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const res = await fetch("/api/raffles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "enter",
          raffleId,
          quantity: 1,
        }),
      });

      const data = (await res.json()) as
        | {
            ok: true;
            raffleId: string;
            quantityAdded: number;
            totalEntries: number;
            userEntries: number;
            pointsRemaining: number;
            entryCurrency: string;
          }
        | { error?: string };

      if (!res.ok) {
        throw new Error(data && "error" in data ? data.error || "Failed to enter raffle" : "Failed to enter raffle");
      }

      if ("ok" in data && data.ok) {
        setTotalEntries(data.totalEntries);
        setCurrentUserEntries(data.userEntries);
        setCurrentUserPoints(data.pointsRemaining);
        setMessage(`Entered successfully`);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to enter raffle");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => void handleEnter()}
        disabled={isEnded || isSubmitting || notEnoughBalance}
        className="inline-flex h-12 w-full items-center justify-center rounded-xl text-sm font-extrabold uppercase tracking-[0.08em] text-white disabled:cursor-not-allowed disabled:opacity-60"
        style={{
          background:
            "linear-gradient(180deg, rgba(59,130,246,0.96), rgba(37,99,235,0.96))",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
        }}
      >
        {isSubmitting ? "Entering..." : buttonLabel}
      </button>

      <div className="mt-2 flex items-center justify-between text-xs text-white/55">
        <span>{totalEntries.toLocaleString()} total entries</span>
        <span>
          {currentUserPoints === null
            ? "Log in to enter"
            : `${currentUserEntries} entries · ${currentUserPoints.toLocaleString()} ${entryCurrency}`}
        </span>
      </div>

      {notEnoughBalance ? (
        <div className="mt-1 text-xs text-red-300">
          Not enough {entryCurrency}
        </div>
      ) : null}

      {message ? (
        <div className="mt-1 text-xs text-white/70">{message}</div>
      ) : null}
    </div>
  );
}