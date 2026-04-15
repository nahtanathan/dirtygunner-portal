
"use client";

import { useMemo, useState } from "react";

type RaffleEntryButtonProps = {
  raffleId: string;
  raffleStatus: "active" | "ended";
  entryMethod: string;
  entryCost: number;
  entryCurrency: "bullets" | "points";
  totalEntries: number;
  currentUserEntries: number;
  currentUserPoints: number | null;
  maxEntriesPerUser: number | null;
  endDate: string;
  onEntrySuccess: (
    raffleId: string,
    payload: {
      totalEntries: number;
      userEntries: number;
      pointsRemaining: number;
    },
  ) => void;
  onRefresh: () => Promise<void>;
};

type EnterSuccessResponse = {
  ok: true;
  raffleId: string;
  quantityAdded: number;
  totalEntries: number;
  userEntries: number;
  pointsRemaining: number;
  entryCurrency: string;
};

type ErrorResponse = {
  error?: string;
};

export function RaffleEntryButton({
  raffleId,
  raffleStatus,
  entryMethod,
  entryCost,
  entryCurrency,
  totalEntries,
  currentUserEntries,
  currentUserPoints,
  maxEntriesPerUser,
  endDate,
  onEntrySuccess,
  onRefresh,
}: RaffleEntryButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const isEnded = useMemo(() => {
    return raffleStatus !== "active" || new Date(endDate).getTime() <= Date.now();
  }, [raffleStatus, endDate]);

  const limitReached =
    maxEntriesPerUser !== null && currentUserEntries >= maxEntriesPerUser;

  const notEnoughBalance =
    currentUserPoints !== null && entryCost > currentUserPoints;

  const isLoggedOut = currentUserPoints === null;

  const isDisabled =
    isEnded || isSubmitting || limitReached || notEnoughBalance || isLoggedOut;

  const buttonLabel = useMemo(() => {
    if (isEnded) {
      return "Raffle Ended";
    }

    if (isSubmitting) {
      return "Entering...";
    }

    if (isLoggedOut) {
      return "Log In To Enter";
    }

    if (limitReached) {
      return "Entry Limit Reached";
    }

    if (entryCost <= 0) {
      return entryMethod?.trim() || "Join For Free";
    }

    return `Enter for ${entryCost.toLocaleString()} ${entryCurrency}`;
  }, [
    entryCost,
    entryCurrency,
    entryMethod,
    isEnded,
    isLoggedOut,
    isSubmitting,
    limitReached,
  ]);

  async function handleEnter() {
    if (isDisabled) {
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

      const data = ((await res.json()) as EnterSuccessResponse | ErrorResponse) ?? {};

      if (!res.ok) {
        throw new Error(
          "error" in data && data.error
            ? data.error
            : "Failed to enter raffle",
        );
      }

      if (!("ok" in data) || !data.ok) {
        throw new Error("Failed to enter raffle");
      }

      onEntrySuccess(raffleId, {
        totalEntries: data.totalEntries,
        userEntries: data.userEntries,
        pointsRemaining: data.pointsRemaining,
      });

      setMessage("Entry submitted successfully.");
      await onRefresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to enter raffle",
      );
      await onRefresh().catch(() => undefined);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-5 min-w-0">
      <button
        type="button"
        onClick={() => void handleEnter()}
        disabled={isDisabled}
        className="inline-flex h-12 w-full min-w-0 items-center justify-center rounded-2xl px-4 text-sm font-extrabold uppercase tracking-[0.08em] text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
        style={{
          background:
            isDisabled && !isSubmitting
              ? "linear-gradient(180deg, rgba(71,85,105,0.72), rgba(51,65,85,0.82))"
              : "linear-gradient(180deg, rgba(59,130,246,0.96), rgba(37,99,235,0.96))",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.18), 0 12px 28px rgba(37,99,235,0.22)",
        }}
      >
        <span className="truncate whitespace-nowrap">{buttonLabel}</span>
      </button>

      <div className="mt-3 flex min-w-0 flex-col gap-1 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <span className="truncate">{totalEntries.toLocaleString()} total entries</span>
        <span className="truncate sm:text-right">
          {isLoggedOut
            ? "Log in to view your balance"
            : `${currentUserEntries} entries • ${currentUserPoints.toLocaleString()} ${entryCurrency}`}
        </span>
      </div>

      <div className="mt-2 flex min-w-0 flex-wrap gap-x-4 gap-y-1 text-xs">
        <span className="truncate text-white/65">You have {currentUserEntries} entries</span>
        <span className="truncate text-white/45">
          {maxEntriesPerUser === null
            ? "Unlimited entries"
            : `${currentUserEntries} / ${maxEntriesPerUser} used`}
        </span>
      </div>

      {isLoggedOut ? (
        <div className="mt-2 text-xs text-white/55">
          Sign in to enter this raffle.
        </div>
      ) : null}

      {notEnoughBalance ? (
        <div className="mt-2 text-xs text-red-300">
          Not enough {entryCurrency} for this entry.
        </div>
      ) : null}

      {limitReached ? (
        <div className="mt-2 text-xs text-amber-300">
          You already reached the max entries for this raffle.
        </div>
      ) : null}

      {message ? (
        <div className="mt-2 truncate-2 text-xs text-white/72">{message}</div>
      ) : null}
    </div>
  );
}