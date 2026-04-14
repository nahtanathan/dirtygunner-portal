"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  ShieldAlert,
  Trophy,
  UserRound,
  XCircle,
} from "lucide-react";

type AdminUser = {
  id: string;
  isAdmin: boolean;
};

type ClaimItem = {
  id: string;
  challengeId: string;
  challengeTitle: string;
  userId: string;
  userLabel: string;
  proofImageUrl: string;
  note: string | null;
  status: "pending" | "approved" | "rejected";
  rejectionReason: string | null;
  reviewedAt: string | null;
  reviewedByLabel: string | null;
  createdAt: string;
  updatedAt: string;
};

type ReviewAction = "approve" | "reject";

async function readApiResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  return JSON.parse(text) as T;
}

function formatDate(value?: string | null) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function statusTone(status: ClaimItem["status"]) {
  if (status === "approved") {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-100";
  }

  if (status === "rejected") {
    return "border-red-400/20 bg-red-500/10 text-red-100";
  }

  return "border-amber-400/20 bg-amber-400/10 text-amber-100";
}

export default function AdminChallengeClaimsPage() {
  const [me, setMe] = useState<AdminUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingClaims, setLoadingClaims] = useState(true);
  const [claims, setClaims] = useState<ClaimItem[]>([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
  const [reviewClaimId, setReviewClaimId] = useState<string | null>(null);

  async function loadUser() {
    setLoadingUser(true);

    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        cache: "no-store",
      });

      const data = await readApiResponse<{ user?: AdminUser | null }>(res);
      setMe(data.user ?? null);
    } catch {
      setMe(null);
    } finally {
      setLoadingUser(false);
    }
  }

  async function loadClaims() {
    setLoadingClaims(true);
    setError("");

    try {
      const res = await fetch("/api/admin/challenge-claims", {
        method: "GET",
        cache: "no-store",
      });

      const data = await readApiResponse<ClaimItem[] | { error?: string }>(res);

      if (!res.ok || !Array.isArray(data)) {
        throw new Error(
          !Array.isArray(data) && typeof data?.error === "string"
            ? data.error
            : "Failed to load challenge claims",
        );
      }

      setClaims(data);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to load challenge claims",
      );
    } finally {
      setLoadingClaims(false);
    }
  }

  useEffect(() => {
    void loadUser();
    void loadClaims();
  }, []);

  const pendingClaims = useMemo(
    () => claims.filter((claim) => claim.status === "pending"),
    [claims],
  );

  const approvedClaims = useMemo(
    () => claims.filter((claim) => claim.status === "approved"),
    [claims],
  );

  const rejectedClaims = useMemo(
    () => claims.filter((claim) => claim.status === "rejected"),
    [claims],
  );

  async function handleReview(claimId: string, action: ReviewAction) {
    const rejectionReason =
      action === "reject"
        ? window.prompt(
            "Reason for rejection:",
            "Proof did not meet challenge rules.",
          )
        : null;

    if (action === "reject" && rejectionReason === null) {
      return;
    }

    setReviewClaimId(claimId);
    setMessage("");
    setError("");

    try {
      const res = await fetch(`/api/admin/challenge-claims/${claimId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          rejectionReason,
        }),
      });

      const data = await readApiResponse<{ error?: string }>(res);

      if (!res.ok) {
        throw new Error(data.error || "Failed to review claim");
      }

      setMessage(action === "approve" ? "Claim approved." : "Claim rejected.");
      await loadClaims();
    } catch (reviewError) {
      setError(
        reviewError instanceof Error
          ? reviewError.message
          : "Failed to review claim",
      );
    } finally {
      setReviewClaimId(null);
    }
  }

  if (loadingUser) {
    return (
      <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,22,28,0.96),rgba(12,15,20,0.98))] px-6 py-16 text-center text-white/70">
        <div className="inline-flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading admin panel...
        </div>
      </div>
    );
  }

  if (!me?.isAdmin) {
    return (
      <div className="rounded-[32px] border border-red-500/20 bg-[linear-gradient(180deg,rgba(33,11,18,0.94),rgba(18,8,12,0.98))] px-6 py-16 text-center">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 text-red-200">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Access denied</h1>
            <p className="mt-2 text-sm leading-6 text-white/65">
              You must be an admin to review challenge claims.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,22,28,0.96),rgba(12,15,20,0.98))] px-6 py-7 shadow-[0_18px_70px_rgba(0,0,0,0.34)] backdrop-blur-xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-white/42">
                Admin
              </div>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-white">
                Challenge Claims Review
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/65">
                Review uploaded proof, approve valid claims, reject invalid
                submissions, and keep challenge limits accurate from one queue.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <StatCard
                icon={<Clock3 className="h-4 w-4" />}
                label="Pending"
                value={String(pendingClaims.length)}
              />
              <StatCard
                icon={<CheckCircle2 className="h-4 w-4" />}
                label="Approved"
                value={String(approvedClaims.length)}
              />
              <StatCard
                icon={<XCircle className="h-4 w-4" />}
                label="Rejected"
                value={String(rejectedClaims.length)}
              />
            </div>
          </div>

          {message ? (
            <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
              {message}
            </div>
          ) : null}

          {error ? (
            <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100 whitespace-pre-wrap">
              {error}
            </div>
          ) : null}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.26em] text-white/42">
                Review Queue
              </div>
              <h2 className="mt-2 text-2xl font-bold text-white">
                All Challenge Claims
              </h2>
            </div>

            <button
              type="button"
              onClick={() => void loadClaims()}
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/[0.05]"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          {loadingClaims ? (
            <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,22,28,0.96),rgba(12,15,20,0.98))] px-6 py-10 text-center text-white/65">
              <div className="inline-flex items-center gap-3">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading challenge claims...
              </div>
            </div>
          ) : claims.length === 0 ? (
            <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,22,28,0.96),rgba(12,15,20,0.98))] px-6 py-10 text-center text-white/65">
              No challenge claims have been submitted yet.
            </div>
          ) : (
            <div className="grid gap-4">
              {claims.map((claim) => (
                <article
                  key={claim.id}
                  className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,22,28,0.96),rgba(12,15,20,0.98))] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.26)]"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${statusTone(
                            claim.status,
                          )}`}
                        >
                          {claim.status}
                        </span>

                        <span className="inline-flex rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/58">
                          {claim.challengeTitle}
                        </span>
                      </div>

                      <h3 className="mt-3 text-xl font-bold text-white">
                        {claim.challengeTitle}
                      </h3>

                      <div className="mt-3 grid gap-3 sm:grid-cols-3">
                        <MiniStat
                          icon={<UserRound className="h-4 w-4" />}
                          label="User"
                          value={claim.userLabel}
                        />
                        <MiniStat
                          icon={<Clock3 className="h-4 w-4" />}
                          label="Submitted"
                          value={formatDate(claim.createdAt)}
                        />
                        <MiniStat
                          icon={<Trophy className="h-4 w-4" />}
                          label="Reviewed"
                          value={
                            claim.reviewedAt
                              ? `${formatDate(claim.reviewedAt)}${
                                  claim.reviewedByLabel
                                    ? ` · ${claim.reviewedByLabel}`
                                    : ""
                                }`
                              : "Not reviewed"
                          }
                        />
                      </div>

                      {claim.note ? (
                        <div className="mt-4 rounded-2xl border border-white/8 bg-black/20 p-4">
                          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
                            User note
                          </div>
                          <div className="mt-2 text-sm leading-6 text-white/68">
                            {claim.note}
                          </div>
                        </div>
                      ) : null}

                      {claim.rejectionReason ? (
                        <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 p-4">
                          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-red-100/90">
                            Rejection reason
                          </div>
                          <div className="mt-2 text-sm leading-6 text-red-100">
                            {claim.rejectionReason}
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div className="w-full shrink-0 xl:w-[320px]">
                      <button
                        type="button"
                        onClick={() => setActiveImageUrl(claim.proofImageUrl)}
                        className="group block w-full overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] transition-all duration-200 hover:border-white/20"
                      >
                        <div className="relative flex h-[220px] items-center justify-center bg-[linear-gradient(180deg,rgba(28,34,44,0.98),rgba(16,20,26,1))] p-4">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={claim.proofImageUrl}
                            alt={`${claim.challengeTitle} proof`}
                            className="max-h-full max-w-full rounded-xl object-contain"
                          />
                        </div>
                        <div className="flex items-center justify-center gap-2 border-t border-white/10 px-4 py-3 text-sm font-semibold text-white/78">
                          <ImageIcon className="h-4 w-4" />
                          Open Proof
                        </div>
                      </button>

                      {claim.status === "pending" ? (
                        <div className="mt-4 grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            disabled={reviewClaimId === claim.id}
                            onClick={() => void handleReview(claim.id, "approve")}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 text-sm font-semibold text-emerald-100 transition-all duration-200 hover:bg-emerald-400/15 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {reviewClaimId === claim.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4" />
                            )}
                            Approve
                          </button>

                          <button
                            type="button"
                            disabled={reviewClaimId === claim.id}
                            onClick={() => void handleReview(claim.id, "reject")}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 text-sm font-semibold text-red-100 transition-all duration-200 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {reviewClaimId === claim.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}
                            Reject
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {activeImageUrl ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(18,22,28,0.98),rgba(12,15,20,1))] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <button
              type="button"
              onClick={() => setActiveImageUrl(null)}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-white/70 transition hover:bg-white/[0.06] hover:text-white"
              aria-label="Close proof preview"
            >
              <XCircle className="h-4 w-4" />
            </button>

            <div className="flex max-h-[85vh] min-h-[360px] items-center justify-center p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeImageUrl}
                alt="Challenge proof preview"
                className="max-h-[78vh] max-w-full rounded-2xl object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <div className="flex items-center gap-2 text-white/45">{icon}</div>
      <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
        {label}
      </div>
      <div className="mt-1 text-xl font-bold text-white">{value}</div>
    </div>
  );
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/8 bg-black/20 p-3">
      <div className="flex items-center gap-2 text-white/45">{icon}</div>
      <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold leading-6 text-white">
        {value}
      </div>
    </div>
  );
}