// FILE: src/app/(admin)/admin/challenges/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Flag,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  ShieldAlert,
  Target,
  Trash2,
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
  goal: number;
  currentProgress: number;
  reward: string;
  startDate: string;
  endDate: string;
  createdAt?: string;
  updatedAt?: string;
};

type ChallengeFormState = {
  id: string;
  title: string;
  description: string;
  status: "active" | "completed";
  goal: string;
  currentProgress: string;
  reward: string;
  startDate: string;
  endDate: string;
};

const EMPTY_FORM: ChallengeFormState = {
  id: "",
  title: "",
  description: "",
  status: "active",
  goal: "1000",
  currentProgress: "0",
  reward: "",
  startDate: "",
  endDate: "",
};

const inputClassName =
  "h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/20 focus:bg-white/[0.05]";

const textareaClassName =
  "min-h-[110px] w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/20 focus:bg-white/[0.05]";

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function toLocalDateTimeValue(date: Date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

function createChallengeId() {
  return `challenge-${Date.now()}`;
}

function progressPercent(item: Pick<ChallengeItem, "goal" | "currentProgress">) {
  if (item.goal <= 0) return 0;
  return Math.min(Math.round((item.currentProgress / item.goal) * 100), 100);
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
        {label}
      </span>
      {children}
    </label>
  );
}

async function readApiResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  if (!contentType.includes("application/json")) {
    const trimmed = text.trim();
    const shortPreview =
      trimmed.length > 220 ? `${trimmed.slice(0, 220)}...` : trimmed;

    throw new Error(
      `API did not return JSON. This usually means the route crashed or Prisma is not updated yet. Run: npx prisma generate && npx prisma db push. Response preview: ${shortPreview}`,
    );
  }

  return JSON.parse(text) as T;
}

export default function AdminChallengesPage() {
  const [me, setMe] = useState<AdminUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingChallenges, setLoadingChallenges] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [actionChallengeId, setActionChallengeId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [challenges, setChallenges] = useState<ChallengeItem[]>([]);
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
    setError("");

    try {
      const res = await fetch("/api/challenges", {
        method: "GET",
        cache: "no-store",
      });

      const data = await readApiResponse<ChallengeItem[] | { error?: string }>(res);

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

  useEffect(() => {
    void loadUser();
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

  const totalGoal = useMemo(
    () => activeChallenges.reduce((sum, item) => sum + item.goal, 0),
    [activeChallenges],
  );

  const totalProgress = useMemo(
    () => activeChallenges.reduce((sum, item) => sum + item.currentProgress, 0),
    [activeChallenges],
  );

  const totalPercent =
    totalGoal > 0
      ? Math.min(Math.round((totalProgress / totalGoal) * 100), 100)
      : 0;

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
    setError("");
    setMessage("");
  }

  function startCreate() {
    const now = new Date();
    const inSevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    setEditingId(null);
    setError("");
    setMessage("");
    setForm({
      id: createChallengeId(),
      title: "",
      description: "",
      status: "active",
      goal: "1000",
      currentProgress: "0",
      reward: "",
      startDate: toLocalDateTimeValue(now),
      endDate: toLocalDateTimeValue(inSevenDays),
    });
  }

  function startEdit(challenge: ChallengeItem) {
    setEditingId(challenge.id);
    setError("");
    setMessage("");
    setForm({
      id: challenge.id,
      title: challenge.title,
      description: challenge.description ?? "",
      status: challenge.status,
      goal: String(challenge.goal),
      currentProgress: String(challenge.currentProgress),
      reward: challenge.reward,
      startDate: toLocalDateTimeValue(new Date(challenge.startDate)),
      endDate: toLocalDateTimeValue(new Date(challenge.endDate)),
    });
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        id: form.id.trim(),
        title: form.title.trim(),
        description: form.description.trim() || null,
        status: form.status,
        goal: Number(form.goal || 0),
        currentProgress: Number(form.currentProgress || 0),
        reward: form.reward.trim(),
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
    setError("");
    setMessage("");

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
      await loadChallenges();
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
      <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,18,34,0.96),rgba(7,12,24,0.98))] px-6 py-7 shadow-[0_18px_70px_rgba(0,0,0,0.34)] backdrop-blur-xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-white/42">
              Admin
            </div>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white">
              Challenges Control
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/65">
              Create, edit, delete, and sync public challenge cards from one
              place with the same admin protection pattern used for live raffles.
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
              label="Completed"
              value={String(completedChallenges.length)}
            />
            <StatCard
              icon={<Target className="h-4 w-4" />}
              label="Progress"
              value={`${totalPercent}%`}
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

      <div className="grid gap-8 xl:grid-cols-[420px,minmax(0,1fr)]">
        <section className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,18,34,0.96),rgba(7,12,24,0.98))] p-6 shadow-[0_18px_70px_rgba(0,0,0,0.34)] backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.26em] text-white/42">
                Editor
              </div>
              <h2 className="mt-2 text-2xl font-bold text-white">
                {editingId ? "Edit Challenge" : "Create Challenge"}
              </h2>
            </div>

            <button
              type="button"
              onClick={startCreate}
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/[0.05]"
            >
              <Plus className="h-4 w-4" />
              New
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <Field label="Challenge ID">
              <input
                value={form.id}
                onChange={(event) => setField("id", event.target.value)}
                className={inputClassName}
                placeholder="challenge-weekend-push"
                disabled={Boolean(editingId)}
              />
            </Field>

            <Field label="Title">
              <input
                value={form.title}
                onChange={(event) => setField("title", event.target.value)}
                className={inputClassName}
                placeholder="Weekend Wager Sprint"
              />
            </Field>

            <Field label="Description">
              <textarea
                value={form.description}
                onChange={(event) => setField("description", event.target.value)}
                className={textareaClassName}
                placeholder="Short premium description for the public challenges page"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
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

              <Field label="Reward">
                <input
                  value={form.reward}
                  onChange={(event) => setField("reward", event.target.value)}
                  className={inputClassName}
                  placeholder="Bonus stream + giveaway"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Goal">
                <input
                  type="number"
                  min="1"
                  value={form.goal}
                  onChange={(event) => setField("goal", event.target.value)}
                  className={inputClassName}
                />
              </Field>

              <Field label="Current Progress">
                <input
                  type="number"
                  min="0"
                  value={form.currentProgress}
                  onChange={(event) =>
                    setField("currentProgress", event.target.value)
                  }
                  className={inputClassName}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
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

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl text-sm font-extrabold uppercase tracking-[0.08em] text-white disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(59,130,246,0.96), rgba(37,99,235,0.96))",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.18), 0 12px 28px rgba(37,99,235,0.22)",
                }}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : editingId ? (
                  <Pencil className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}

                {isSaving
                  ? "Saving..."
                  : editingId
                    ? "Update Challenge"
                    : "Create Challenge"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02] px-4 text-sm font-semibold text-white/80 transition-all duration-200 hover:bg-white/[0.05]"
              >
                Reset
              </button>
            </div>
          </form>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.26em] text-white/42">
                Live Data
              </div>
              <h2 className="mt-2 text-2xl font-bold text-white">
                Manage Challenges
              </h2>
            </div>

            <button
              type="button"
              onClick={() => void loadChallenges()}
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/[0.05]"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          {loadingChallenges ? (
            <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,18,34,0.96),rgba(7,12,24,0.98))] px-6 py-10 text-center text-white/65">
              <div className="inline-flex items-center gap-3">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading challenges...
              </div>
            </div>
          ) : challenges.length === 0 ? (
            <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,18,34,0.96),rgba(7,12,24,0.98))] px-6 py-10 text-center text-white/65">
              No challenges yet.
            </div>
          ) : (
            <div className="grid gap-4">
              {challenges.map((challenge) => {
                const percent = progressPercent(challenge);

                return (
                  <article
                    key={challenge.id}
                    className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,18,34,0.96),rgba(7,12,24,0.98))] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.26)]"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${
                              challenge.status === "completed"
                                ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
                                : "border-amber-400/25 bg-amber-400/10 text-amber-200"
                            }`}
                          >
                            {challenge.status}
                          </span>

                          <span className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/52">
                            {percent}% complete
                          </span>
                        </div>

                        <h3 className="mt-3 text-xl font-bold text-white">
                          {challenge.title}
                        </h3>

                        {challenge.description ? (
                          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/65">
                            {challenge.description}
                          </p>
                        ) : null}

                        <div className="mt-4 grid gap-3 sm:grid-cols-4">
                          <MiniStat
                            icon={<Target className="h-4 w-4" />}
                            label="Goal"
                            value={formatNumber(challenge.goal)}
                          />
                          <MiniStat
                            icon={<Flag className="h-4 w-4" />}
                            label="Progress"
                            value={formatNumber(challenge.currentProgress)}
                          />
                          <MiniStat
                            icon={<CheckCircle2 className="h-4 w-4" />}
                            label="Reward"
                            value={challenge.reward}
                          />
                          <MiniStat
                            icon={<Clock3 className="h-4 w-4" />}
                            label="Ends"
                            value={new Date(challenge.endDate).toLocaleDateString()}
                          />
                        </div>

                        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/8">
                          <div
                            className="h-full rounded-full bg-[linear-gradient(90deg,rgba(59,130,246,0.95),rgba(147,51,234,0.92))]"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(challenge)}
                          className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/[0.05]"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => void handleDelete(challenge.id)}
                          disabled={actionChallengeId === challenge.id}
                          className="inline-flex h-11 items-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 text-sm font-semibold text-red-100 transition-all duration-200 hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {actionChallengeId === challenge.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
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
      <div className="mt-1 truncate text-sm font-semibold text-white">
        {value}
      </div>
    </div>
  );
}