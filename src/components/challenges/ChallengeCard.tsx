"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ImagePlus, Trophy, X } from "lucide-react";

import { PremiumPanel } from "@/components/ui/PremiumPanel";
import type { Challenge } from "@/lib/types";

type RichChallenge = Challenge & {
  challengeType?: "multiplier" | "win_amount";
  targetValue?: number;
  minBet?: number;
  rules?: string | null;
  slotName?: string | null;
  provider?: string | null;
  imageUrl?: string | null;
  imageSource?: string | null;
  claimLimit?: number;
  approvedClaims?: number;
  pendingClaims?: number;
  remainingClaims?: number;
  requiresProof?: boolean;
  viewerClaimStatus?: "none" | "pending" | "approved" | "rejected";
  reward?: string;
  goal?: number;
  currentProgress?: number;
};

function formatDate(value?: string) {
  if (!value) {
    return "TBA";
  }

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

function formatCurrency(value?: number) {
  if (value === undefined || value === null) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatTarget(challenge: RichChallenge) {
  if (
    challenge.challengeType === "win_amount" &&
    typeof challenge.targetValue === "number"
  ) {
    return formatCurrency(challenge.targetValue);
  }

  if (
    challenge.challengeType === "multiplier" &&
    typeof challenge.targetValue === "number"
  ) {
    return `${challenge.targetValue.toLocaleString()}x`;
  }

  if (typeof challenge.goal === "number") {
    return challenge.goal.toLocaleString();
  }

  return "Challenge";
}

function getClaimSummary(challenge: RichChallenge) {
  if (
    typeof challenge.approvedClaims === "number" &&
    typeof challenge.claimLimit === "number"
  ) {
    return `${challenge.approvedClaims}/${challenge.claimLimit}`;
  }

  if (
    typeof challenge.currentProgress === "number" &&
    typeof challenge.goal === "number"
  ) {
    return `${challenge.currentProgress}/${challenge.goal}`;
  }

  return "—";
}

function getMinBet(challenge: RichChallenge) {
  if (typeof challenge.minBet === "number") {
    return formatCurrency(challenge.minBet);
  }

  return null;
}

function getSlotLabel(challenge: RichChallenge) {
  if (challenge.slotName?.trim()) {
    return challenge.slotName.trim();
  }

  return challenge.title;
}

function getStatusLabel(challenge: RichChallenge) {
  if (challenge.viewerClaimStatus === "approved") {
    return "Approved";
  }

  if (challenge.viewerClaimStatus === "pending") {
    return "Pending Review";
  }

  return challenge.status === "completed" ? "Completed" : "Active";
}

export function ChallengeCard({
  challenge,
  isLoggedIn = true,
}: {
  challenge: Challenge;
  isLoggedIn?: boolean;
}) {
  const rich = challenge as RichChallenge;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    if (rich.status === "completed") {
      return false;
    }

    if (rich.viewerClaimStatus === "approved") {
      return false;
    }

    if (rich.viewerClaimStatus === "pending") {
      return false;
    }

    if (
      typeof rich.remainingClaims === "number" &&
      rich.remainingClaims <= 0
    ) {
      return false;
    }

    return isLoggedIn;
  }, [isLoggedIn, rich.remainingClaims, rich.status, rich.viewerClaimStatus]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!proofFile) {
      setError("Please choose a proof image first.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("proof", proofFile);
      formData.append("note", note);

      const res = await fetch(`/api/challenges/${rich.id}/claims`, {
        method: "POST",
        body: formData,
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit proof");
      }

      setMessage("Proof submitted and sent for review.");
      setProofFile(null);
      setNote("");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to submit proof",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <PremiumPanel className="group overflow-hidden border border-white/10 bg-[linear-gradient(180deg,rgba(36,24,42,0.88),rgba(19,24,35,0.96))] p-0 shadow-[0_20px_60px_rgba(0,0,0,0.30)]">
        <div className="relative">
          <div className="relative h-[180px] overflow-hidden bg-[linear-gradient(180deg,rgba(33,23,38,0.95),rgba(19,24,35,1))]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_55%)]" />

            {rich.imageUrl ? (
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <div className="relative h-full w-full">
                  <Image
                    src={rich.imageUrl}
                    alt={getSlotLabel(rich)}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 320px"
                  />
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(88,39,82,0.42),rgba(19,24,35,0.96))]" />
            )}

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,13,22,0.10),rgba(17,13,22,0.55))]" />

            <div className="absolute left-4 top-4">
              <span className="inline-flex rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-amber-100">
                {getStatusLabel(rich)}
              </span>
            </div>
          </div>

          <div className="space-y-4 p-4">
            <div>
              <h3 className="line-clamp-2 text-xl font-bold leading-tight text-white">
                {getSlotLabel(rich)}
                {rich.challengeType === "multiplier" &&
                typeof rich.targetValue === "number"
                  ? ` ${rich.targetValue.toLocaleString()}x`
                  : ""}
                {rich.challengeType === "win_amount" &&
                typeof rich.targetValue === "number"
                  ? ` ${formatCurrency(rich.targetValue)}`
                  : ""}
                {getMinBet(rich) ? ` with min ${getMinBet(rich)} bet` : ""}
              </h3>

              {rich.provider ? (
                <p className="mt-2 text-sm text-white/52">{rich.provider}</p>
              ) : null}
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#2b4771]/80 px-4 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <div className="flex items-center justify-center gap-2 text-white">
                <Trophy className="h-4 w-4 text-slate-200" />
                <span className="text-2xl font-black">
                  {rich.reward || getClaimSummary(rich)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(180deg,#3f86e8,#2f6dca)] text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_10px_24px_rgba(47,109,202,0.26)] transition hover:brightness-110"
            >
              <ImagePlus className="h-4 w-4" />
              Provide Proof
            </button>
          </div>
        </div>
      </PremiumPanel>

      {isModalOpen ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,24,32,0.98),rgba(12,16,22,0.99))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42">
                  Challenge Proof
                </div>
                <h3 className="mt-2 text-2xl font-bold text-white">
                  {rich.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-white/62">
                  Target {formatTarget(rich)} ·
                  {getMinBet(rich) ? ` Minimum bet ${getMinBet(rich)} ·` : ""}
                  Ends {formatDate(rich.endDate)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/70 transition hover:bg-white/[0.06] hover:text-white"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {rich.rules ? (
              <div className="mb-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42">
                  Rules
                </p>
                <p className="mt-3 text-sm leading-6 text-white/68">
                  {rich.rules}
                </p>
              </div>
            ) : null}

            {rich.viewerClaimStatus === "approved" ? (
              <div className="mb-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
                You already have an approved claim for this challenge.
              </div>
            ) : null}

            {rich.viewerClaimStatus === "pending" ? (
              <div className="mb-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                You already have a pending proof submission under review.
              </div>
            ) : null}

            {!isLoggedIn ? (
              <div className="mb-4 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/68">
                Log in with Kick to submit proof for this challenge.
              </div>
            ) : null}

            {typeof rich.remainingClaims === "number" && rich.remainingClaims <= 0 ? (
              <div className="mb-4 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/68">
                This challenge has reached its claim limit.
              </div>
            ) : null}

            {message ? (
              <div className="mb-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
                {message}
              </div>
            ) : null}

            {error ? (
              <div className="mb-4 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {error}
              </div>
            ) : null}

            {canSubmit ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor={`proof-input-${rich.id}`}
                    className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42"
                  >
                    Upload Proof
                  </label>
                  <input
                    id={`proof-input-${rich.id}`}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(event) =>
                      setProofFile(event.target.files?.[0] ?? null)
                    }
                    className="block w-full text-sm text-white/72 file:mr-4 file:rounded-xl file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42">
                    Note (Optional)
                  </label>
                  <textarea
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    className="min-h-[110px] w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/20 focus:bg-white/[0.05]"
                    placeholder="Add any context for the admin review."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex h-12 items-center justify-center rounded-2xl bg-white px-5 text-sm font-bold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Proof"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-sm font-semibold text-white transition hover:bg-white/[0.06]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}