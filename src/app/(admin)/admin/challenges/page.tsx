// FILE: src/app/(admin)/admin/challenges/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Flag,
  Image as ImageIcon,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  ShieldAlert,
  Target,
  Trash2,
  XCircle,
} from "lucide-react";

type AdminUser = {
  id: string;
  isAdmin: boolean;
};

type ChallengeItem = {
  id: string;
  title: string;
  description: string | null;
  status: "active" | "completed";
  challengeType: "multiplier" | "win_amount";
  targetValue: number;
  minBet: number;
  reward: string;
  rules: string | null;
  slotName: string | null;
  provider: string | null;
  imageUrl: string | null;
  imageSource: string | null;
  claimLimit: number;
  approvedClaims: number;
  pendingClaims: number;
  remainingClaims: number;
  requiresProof: boolean;
  startDate: string;
  endDate: string;
  createdAt?: string;
  updatedAt?: string;
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

type ChallengeFormState = {
  id: string;
  title: string;
  description: string;
  status: "active" | "completed";
  challengeType: "multiplier" | "win_amount";
  targetValue: string;
  minBet: string;
  reward: string;
  rules: string;
  slotName: string;
  provider: string;
  imageUrl: string;
  claimLimit: string;
  requiresProof: boolean;
  startDate: string;
  endDate: string;
};

const EMPTY_FORM: ChallengeFormState = {
  id: "",
  title: "",
  description: "",
  status: "active",
  challengeType: "multiplier",
  targetValue: "500",
  minBet: "0.20",
  reward: "",
  rules: "",
  slotName: "",
  provider: "",
  imageUrl: "",
  claimLimit: "1",
  requiresProof: true,
  startDate: "",
  endDate: "",
};

const inputClassName =
  "h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/20 focus:bg-white/[0.05]";

const textareaClassName =
  "min-h-[110px] w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/20 focus:bg-white/[0.05]";

function toLocalDateTimeValue(date: Date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

function createChallengeId() {
  return `challenge-${Date.now()}`;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatTarget(type: ChallengeItem["challengeType"], value: number) {
  if (type === "win_amount") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);
  }

  return `${value.toLocaleString()}x`;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block min-w-0 space-y-2">
      <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
        {label}
      </span>
      {children}
    </label>
  );
}

async function readApiResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  return JSON.parse(text) as T;
}

export default function AdminChallengesPage() {
  const [me, setMe] = useState<AdminUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingChallenges, setLoadingChallenges] = useState(true);
  const [loadingClaims, setLoadingClaims] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [actionChallengeId, setActionChallengeId] = useState<string | null>(
    null,
  );
  const [reviewClaimId, setReviewClaimId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [challenges, setChallenges] = useState<ChallengeItem[]>([]);
  const [claims, setClaims] = useState<ClaimItem[]>([]);
  const [form, setForm] = useState<ChallengeFormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);

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

  async function loadChallenges() {
    setLoadingChallenges(true);

    try {
      const res = await fetch("/api/challenges", {
        method: "GET",
        cache: "no-store",
      });

      const data = await readApiResponse<ChallengeItem[] | { error?: string }>(
        res,
      );

      if (!res.ok || !Array.isArray(data)) {
        throw new Error(
          !Array.isArray(data) && typeof data?.error === "string"
            ? data.error
            : "Failed to load challenges",
        );
      }

      setChallenges(data);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to load challenges",
      );
    } finally {
      setLoadingChallenges(false);
    }
  }

  async function loadClaims() {
    setLoadingClaims(true);

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
            : "Failed to load claims",
        );
      }

      setClaims(data);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to load claims",
      );
    } finally {
      setLoadingClaims(false);
    }
  }

  useEffect(() => {
    void loadUser();
    void loadChallenges();
    void loadClaims();
  }, []);

  const activeChallenges = useMemo(
    () => challenges.filter((item) => item.status === "active"),
    [challenges],
  );

  const pendingClaims = useMemo(
    () => claims.filter((item) => item.status === "pending"),
    [claims],
  );

  function setField<K extends keyof ChallengeFormState>(
    key: K,
    value: ChallengeFormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setMessage("");
    setError("");
  }

  function startCreate() {
    const now = new Date();
    const inSevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    setEditingId(null);
    setMessage("");
    setError("");
    setForm({
      id: createChallengeId(),
      title: "",
      description: "",
      status: "active",
      challengeType: "multiplier",
      targetValue: "500",
      minBet: "0.20",
      reward: "",
      rules: "",
      slotName: "",
      provider: "",
      imageUrl: "",
      claimLimit: "1",
      requiresProof: true,
      startDate: toLocalDateTimeValue(now),
      endDate: toLocalDateTimeValue(inSevenDays),
    });
  }

  function startEdit(challenge: ChallengeItem) {
    setEditingId(challenge.id);
    setMessage("");
    setError("");
    setForm({
      id: challenge.id,
      title: challenge.title,
      description: challenge.description ?? "",
      status: challenge.status,
      challengeType: challenge.challengeType,
      targetValue: String(challenge.targetValue),
      minBet: String(challenge.minBet),
      reward: challenge.reward,
      rules: challenge.rules ?? "",
      slotName: challenge.slotName ?? "",
      provider: challenge.provider ?? "",
      imageUrl: challenge.imageUrl ?? "",
      claimLimit: String(challenge.claimLimit),
      requiresProof: challenge.requiresProof,
      startDate: toLocalDateTimeValue(new Date(challenge.startDate)),
      endDate: toLocalDateTimeValue(new Date(challenge.endDate)),
    });
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        id: form.id.trim(),
        title: form.title.trim(),
        description: form.description.trim() || null,
        status: form.status,
        challengeType: form.challengeType,
        targetValue: Number(form.targetValue || 0),
        minBet: Number(form.minBet || 0),
        reward: form.reward.trim(),
        rules: form.rules.trim() || null,
        slotName: form.slotName.trim() || null,
        provider: form.provider.trim() || null,
        imageUrl: form.imageUrl.trim() || null,
        claimLimit: Number(form.claimLimit || 1),
        requiresProof: form.requiresProof,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
      };

      const res = await fetch("/api/challenges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await readApiResponse<{ error?: string }>(res);

      if (!res.ok) {
        throw new Error(data.error || "Failed to save challenge");
      }

      setMessage(editingId ? "Challenge updated." : "Challenge created.");
      await loadChallenges();

      if (!editingId) {
        startCreate();
      }
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to save challenge",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(challengeId: string) {
    if (!window.confirm("Delete this challenge?")) {
      return;
    }

    setActionChallengeId(challengeId);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/challenges", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: challengeId }),
      });

      const data = await readApiResponse<{ error?: string }>(res);

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete challenge");
      }

      if (editingId === challengeId) {
        resetForm();
      }

      setMessage("Challenge deleted.");
      await Promise.all([loadChallenges(), loadClaims()]);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete challenge",
      );
    } finally {
      setActionChallengeId(null);
    }
  }

  async function handleReview(
    claimId: string,
    action: "approve" | "reject",
  ) {
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
      await Promise.all([loadChallenges(), loadClaims()]);
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
      <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,18,34,0.94),rgba(7,12,24,0.98))] px-6 py-16 text-center text-white/70">
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
              You must be an admin to manage challenges.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,18,34,0.96),rgba(7,12,24,0.98))] px-5 py-6 shadow-[0_18px_70px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:px-6 sm:py-7">
        <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-white/42">
              Admin
            </div>
            <h1 className="mt-2 truncate text-2xl font-black tracking-tight text-white sm:text-3xl">
              Challenges Control
            </h1>
            <p className="truncate-3 mt-3 max-w-3xl text-sm leading-7 text-white/65">
              Create slot challenges, auto-fill slot art when available, and review
              proof submissions from users.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard
              icon={<Flag className="h-4 w-4" />}
              label="Live"
              value={String(activeChallenges.length)}
            />
            <StatCard
              icon={<CheckCircle2 className="h-4 w-4" />}
              label="Pending Claims"
              value={String(pendingClaims.length)}
            />
            <StatCard
              icon={<Target className="h-4 w-4" />}
              label="Total Challenges"
              value={String(challenges.length)}
            />
          </div>
        </div>

        {message ? (
          <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
            <span className="truncate-2">{message}</span>
          </div>
        ) : null}

        {error ? (
          <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm whitespace-pre-wrap text-red-100">
            {error}
          </div>
        ) : null}
      </section>

      <div className="grid gap-8 xl:grid-cols-[430px,minmax(0,1fr)]">
        <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,18,34,0.96),rgba(7,12,24,0.98))] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.34)] backdrop-blur-xl sm:p-6">
          <div className="mb-6 flex min-w-0 items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-[0.26em] text-white/42">
                Editor
              </div>
              <h2 className="mt-2 truncate text-xl font-bold text-white sm:text-2xl">
                {editingId ? "Edit Challenge" : "Create Challenge"}
              </h2>
            </div>

            <button
              type="button"
              onClick={startCreate}
              className="inline-flex h-11 min-w-0 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/[0.05]"
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span className="truncate whitespace-nowrap">New</span>
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <Field label="Challenge ID">
              <input
                value={form.id}
                onChange={(event) => setField("id", event.target.value)}
                className={inputClassName}
                placeholder="challenge-gates-500x"
                disabled={Boolean(editingId)}
              />
            </Field>

            <Field label="Title">
              <input
                value={form.title}
                onChange={(event) => setField("title", event.target.value)}
                className={inputClassName}
                placeholder="Hit 500x on Gates of Olympus"
              />
            </Field>

            <Field label="Description">
              <textarea
                value={form.description}
                onChange={(event) => setField("description", event.target.value)}
                className={textareaClassName}
                placeholder="Short public description"
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(event) =>
                    setField(
                      "status",
                      event.target.value as "active" | "completed",
                    )
                  }
                  className={inputClassName}
                >
                  <option value="active">active</option>
                  <option value="completed">completed</option>
                </select>
              </Field>

              <Field label="Challenge Type">
                <select
                  value={form.challengeType}
                  onChange={(event) =>
                    setField(
                      "challengeType",
                      event.target.value as "multiplier" | "win_amount",
                    )
                  }
                  className={inputClassName}
                >
                  <option value="multiplier">multiplier</option>
                  <option value="win_amount">win_amount</option>
                </select>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Target Value">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.targetValue}
                  onChange={(event) => setField("targetValue", event.target.value)}
                  className={inputClassName}
                />
              </Field>

              <Field label="Minimum Bet">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.minBet}
                  onChange={(event) => setField("minBet", event.target.value)}
                  className={inputClassName}
                />
              </Field>
            </div>

            <Field label="Reward">
              <input
                value={form.reward}
                onChange={(event) => setField("reward", event.target.value)}
                className={inputClassName}
                placeholder="$100 balance / free buy / shoutout"
              />
            </Field>

            <Field label="Rules">
              <textarea
                value={form.rules}
                onChange={(event) => setField("rules", event.target.value)}
                className={textareaClassName}
                placeholder="Proof must show slot name, bet size, and result clearly."
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Slot Name">
                <input
                  value={form.slotName}
                  onChange={(event) => setField("slotName", event.target.value)}
                  className={inputClassName}
                  placeholder="Gates of Olympus"
                />
              </Field>

              <Field label="Provider">
                <input
                  value={form.provider}
                  onChange={(event) => setField("provider", event.target.value)}
                  className={inputClassName}
                  placeholder="Pragmatic Play"
                />
              </Field>
            </div>

            <Field label="Manual Image URL (optional)">
              <input
                value={form.imageUrl}
                onChange={(event) => setField("imageUrl", event.target.value)}
                className={inputClassName}
                placeholder="Leave blank to auto-lookup from slot name"
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Claim Limit">
                <input
                  type="number"
                  min="1"
                  value={form.claimLimit}
                  onChange={(event) => setField("claimLimit", event.target.value)}
                  className={inputClassName}
                />
              </Field>

              <Field label="Requires Proof">
                <select
                  value={form.requiresProof ? "yes" : "no"}
                  onChange={(event) =>
                    setField("requiresProof", event.target.value === "yes")
                  }
                  className={inputClassName}
                >
                  <option value="yes">yes</option>
                  <option value="no">no</option>
                </select>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Start Date">
                <input
                  type="datetime-local"
                  value={form.startDate}
                  onChange={(event) => setField("startDate", event.target.value)}
                  className={inputClassName}
                />
              </Field>

              <Field label="End Date">
                <input
                  type="datetime-local"
                  value={form.endDate}
                  onChange={(event) => setField("endDate", event.target.value)}
                  className={inputClassName}
                />
              </Field>
            </div>

            <div className="flex min-w-0 flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl text-sm font-extrabold uppercase tracking-[0.08em] text-white disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(59,130,246,0.96), rgba(37,99,235,0.96))",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.18), 0 12px 28px rgba(37,99,235,0.22)",
                }}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                ) : editingId ? (
                  <Pencil className="h-4 w-4 shrink-0" />
                ) : (
                  <Plus className="h-4 w-4 shrink-0" />
                )}
                <span className="truncate whitespace-nowrap">
                  {isSaving
                    ? "Saving..."
                    : editingId
                      ? "Update Challenge"
                      : "Create Challenge"}
                </span>
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="inline-flex h-12 min-w-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] px-4 text-sm font-semibold text-white/80 transition-all duration-200 hover:bg-white/[0.05]"
              >
                <span className="truncate whitespace-nowrap">Reset</span>
              </button>
            </div>
          </form>
        </section>

        <section className="space-y-8">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-[0.26em] text-white/42">
                Live Data
              </div>
              <h2 className="mt-2 truncate text-xl font-bold text-white sm:text-2xl">
                Manage Challenges
              </h2>
            </div>

            <button
              type="button"
              onClick={() => {
                void loadChallenges();
                void loadClaims();
              }}
              className="inline-flex h-11 min-w-0 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/[0.05]"
            >
              <RefreshCw className="h-4 w-4 shrink-0" />
              <span className="truncate whitespace-nowrap">Refresh</span>
            </button>
          </div>

          {loadingChallenges ? (
            <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,18,34,0.96),rgba(7,12,24,0.98))] px-6 py-10 text-center text-white/65">
              <div className="inline-flex items-center gap-3">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading challenges...
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {challenges.map((challenge) => (
                <article
                  key={challenge.id}
                  className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,18,34,0.96),rgba(7,12,24,0.98))] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.26)]"
                >
                  <div className="flex min-w-0 flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <span className="inline-flex max-w-full rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
                          <span className="truncate whitespace-nowrap">
                            {challenge.challengeType === "win_amount"
                              ? "Win Amount"
                              : "Multiplier"}
                          </span>
                        </span>
                        <span className="inline-flex max-w-full rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
                          <span className="truncate whitespace-nowrap">
                            {challenge.status}
                          </span>
                        </span>
                        <span className="inline-flex max-w-full rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
                          <span className="truncate whitespace-nowrap">
                            {challenge.approvedClaims}/{challenge.claimLimit} claimed
                          </span>
                        </span>
                      </div>

                      <h3 className="mt-3 truncate text-xl font-bold text-white">
                        {challenge.title}
                      </h3>

                      {challenge.description ? (
                        <p className="truncate-3 mt-2 max-w-3xl text-sm leading-6 text-white/65">
                          {challenge.description}
                        </p>
                      ) : null}

                      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <MiniStat
                          icon={<Target className="h-4 w-4" />}
                          label="Target"
                          value={formatTarget(
                            challenge.challengeType,
                            challenge.targetValue,
                          )}
                        />
                        <MiniStat
                          icon={<Flag className="h-4 w-4" />}
                          label="Min Bet"
                          value={challenge.minBet.toFixed(2)}
                        />
                        <MiniStat
                          icon={<ImageIcon className="h-4 w-4" />}
                          label="Image"
                          value={challenge.imageSource || "none"}
                        />
                        <MiniStat
                          icon={<Clock3 className="h-4 w-4" />}
                          label="Ends"
                          value={new Date(challenge.endDate).toLocaleDateString()}
                        />
                      </div>

                      {challenge.imageUrl ? (
                        <a
                          href={challenge.imageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex max-w-full text-sm font-medium text-white/70 underline-offset-4 hover:text-white hover:underline"
                        >
                          <span className="truncate whitespace-nowrap">
                            Open current challenge image
                          </span>
                        </a>
                      ) : null}
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 xl:w-[220px] xl:grid-cols-1">
                      <button
                        type="button"
                        onClick={() => startEdit(challenge)}
                        className="inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/[0.05]"
                      >
                        <Pencil className="h-4 w-4 shrink-0" />
                        <span className="truncate whitespace-nowrap">Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => void handleDelete(challenge.id)}
                        disabled={actionChallengeId === challenge.id}
                        className="inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 text-sm font-semibold text-red-100 transition-all duration-200 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {actionChallengeId === challenge.id ? (
                          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                        ) : (
                          <Trash2 className="h-4 w-4 shrink-0" />
                        )}
                        <span className="truncate whitespace-nowrap">Delete</span>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="space-y-4">
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-[0.26em] text-white/42">
                Review Queue
              </div>
              <h2 className="mt-2 truncate text-xl font-bold text-white sm:text-2xl">
                Challenge Claims
              </h2>
            </div>

            {loadingClaims ? (
              <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,18,34,0.96),rgba(7,12,24,0.98))] px-6 py-10 text-center text-white/65">
                <div className="inline-flex items-center gap-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading claims...
                </div>
              </div>
            ) : claims.length === 0 ? (
              <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,18,34,0.96),rgba(7,12,24,0.98))] px-6 py-10 text-center text-white/65">
                No claims yet.
              </div>
            ) : (
              <div className="grid gap-4">
                {claims.map((claim) => (
                  <article
                    key={claim.id}
                    className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,18,34,0.96),rgba(7,12,24,0.98))] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.26)]"
                  >
                    <div className="flex min-w-0 flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                          <span className="inline-flex max-w-full rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
                            <span className="truncate whitespace-nowrap">
                              {claim.status}
                            </span>
                          </span>
                          <span className="inline-flex max-w-full rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
                            <span className="truncate whitespace-nowrap">
                              {claim.userLabel}
                            </span>
                          </span>
                        </div>

                        <h3 className="mt-3 truncate text-xl font-bold text-white">
                          {claim.challengeTitle}
                        </h3>

                        <div className="mt-2 text-sm text-white/65">
                          Submitted {formatDate(claim.createdAt)}
                        </div>

                        {claim.note ? (
                          <p className="truncate-3 mt-3 text-sm leading-6 text-white/65">
                            {claim.note}
                          </p>
                        ) : null}

                        {claim.rejectionReason ? (
                          <div className="mt-3 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                            <span className="truncate-3">{claim.rejectionReason}</span>
                          </div>
                        ) : null}

                        <a
                          href={claim.proofImageUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex max-w-full text-sm font-medium text-white/80 underline-offset-4 hover:text-white hover:underline"
                        >
                          <span className="truncate whitespace-nowrap">
                            Open proof image
                          </span>
                        </a>
                      </div>

                      {claim.status === "pending" ? (
                        <div className="grid gap-2 sm:grid-cols-2 xl:w-[220px] xl:grid-cols-1">
                          <button
                            type="button"
                            disabled={reviewClaimId === claim.id}
                            onClick={() => void handleReview(claim.id, "approve")}
                            className="inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 text-sm font-semibold text-emerald-100 transition-all duration-200 hover:bg-emerald-400/15 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {reviewClaimId === claim.id ? (
                              <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4 shrink-0" />
                            )}
                            <span className="truncate whitespace-nowrap">Approve</span>
                          </button>

                          <button
                            type="button"
                            disabled={reviewClaimId === claim.id}
                            onClick={() => void handleReview(claim.id, "reject")}
                            className="inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 text-sm font-semibold text-red-100 transition-all duration-200 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {reviewClaimId === claim.id ? (
                              <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                            ) : (
                              <XCircle className="h-4 w-4 shrink-0" />
                            )}
                            <span className="truncate whitespace-nowrap">Reject</span>
                          </button>
                        </div>
                      ) : (
                        <div className="shrink-0 text-sm text-white/55">
                          {claim.reviewedByLabel
                            ? `Reviewed by ${claim.reviewedByLabel}`
                            : "Reviewed"}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
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
    <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <div className="flex items-center gap-2 text-white/45">
        <span className="shrink-0">{icon}</span>
      </div>
      <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
        {label}
      </div>
      <div className="mt-1 truncate text-xl font-bold text-white">{value}</div>
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
    <div className="min-w-0 rounded-2xl border border-white/8 bg-black/20 p-3">
      <div className="flex min-w-0 items-center gap-2 text-white/45">
        <span className="shrink-0">{icon}</span>
        <span className="truncate text-[11px] font-semibold uppercase tracking-[0.22em] text-white/45">
          {label}
        </span>
      </div>
      <div className="mt-1 truncate text-sm font-semibold text-white">{value}</div>
    </div>
  );
}