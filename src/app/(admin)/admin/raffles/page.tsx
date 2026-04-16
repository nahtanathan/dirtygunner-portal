// FILE: src/app/(admin)/admin/raffles/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Coins,
  Gift,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  ShieldAlert,
  Trash2,
  Trophy,
  Users,
  XCircle,
} from "lucide-react";

type AdminUser = {
  id: string;
  isAdmin: boolean;
};

type RaffleItem = {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  status: "active" | "ended";
  entryMethod: string;
  entryCost: number;
  entryCurrency: "bullets" | "points";
  maxEntriesPerUser: number | null;
  totalEntries: number;
  uniqueEntrants: number;
  totalSpent: number;
  currentUserEntries: number;
  currentUserPoints: number | null;
  startDate: string;
  endDate: string;
  winner: string | null;
  prizeDetails: string;
  createdAt: string;
  updatedAt: string;
};

type RaffleFormState = {
  id: string;
  title: string;
  description: string;
  image: string;
  status: "active" | "ended";
  entryMethod: string;
  entryCost: string;
  entryCurrency: "bullets" | "points";
  maxEntriesPerUser: string;
  startDate: string;
  endDate: string;
  winner: string;
  prizeDetails: string;
};

const EMPTY_FORM: RaffleFormState = {
  id: "",
  title: "",
  description: "",
  image: "",
  status: "active",
  entryMethod: "Enter Now",
  entryCost: "0",
  entryCurrency: "bullets",
  maxEntriesPerUser: "",
  startDate: "",
  endDate: "",
  winner: "",
  prizeDetails: "",
};

const inputClassName =
  "h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition-all duration-200 placeholder:text-white/28 focus:border-sky-400/30 focus:bg-white/[0.05]";

const textareaClassName =
  "min-h-[110px] w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-all duration-200 placeholder:text-white/28 focus:border-sky-400/30 focus:bg-white/[0.05]";

export default function AdminRafflesPage() {
  const [me, setMe] = useState<AdminUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingRaffles, setLoadingRaffles] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [actionRaffleId, setActionRaffleId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [raffles, setRaffles] = useState<RaffleItem[]>([]);
  const [form, setForm] = useState<RaffleFormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function loadUser() {
    setLoadingUser(true);

    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        cache: "no-store",
      });

      const data = (await res.json()) as { user?: AdminUser | null };
      setMe(data.user ?? null);
    } catch {
      setMe(null);
    } finally {
      setLoadingUser(false);
    }
  }

  async function loadRaffles() {
    setLoadingRaffles(true);

    try {
      const res = await fetch("/api/raffles", {
        method: "GET",
        cache: "no-store",
      });

      const data = (await res.json()) as RaffleItem[];

      if (!res.ok) {
        throw new Error("Could not load raffles");
      }

      setRaffles(data);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Could not load raffles",
      );
    } finally {
      setLoadingRaffles(false);
    }
  }

  useEffect(() => {
    void loadUser();
    void loadRaffles();
  }, []);

  const activeRaffles = useMemo(
    () => raffles.filter((item) => item.status === "active"),
    [raffles],
  );

  const endedRaffles = useMemo(
    () => raffles.filter((item) => item.status === "ended"),
    [raffles],
  );

  function setField<K extends keyof RaffleFormState>(
    key: K,
    value: RaffleFormState[K],
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
    resetForm();

    const now = new Date();
    const inSevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    setForm({
      ...EMPTY_FORM,
      id: createRaffleId(),
      startDate: toLocalDateTimeValue(now),
      endDate: toLocalDateTimeValue(inSevenDays),
    });
  }

  function startEdit(raffle: RaffleItem) {
    setEditingId(raffle.id);
    setMessage("");
    setError("");

    setForm({
      id: raffle.id,
      title: raffle.title,
      description: raffle.description ?? "",
      image: raffle.image ?? "",
      status: raffle.status,
      entryMethod: raffle.entryMethod,
      entryCost: String(raffle.entryCost),
      entryCurrency: raffle.entryCurrency,
      maxEntriesPerUser:
        raffle.maxEntriesPerUser === null
          ? ""
          : String(raffle.maxEntriesPerUser),
      startDate: toLocalDateTimeValue(new Date(raffle.startDate)),
      endDate: toLocalDateTimeValue(new Date(raffle.endDate)),
      winner: raffle.winner ?? "",
      prizeDetails: raffle.prizeDetails,
    });
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        id: form.id.trim(),
        title: form.title.trim(),
        description: form.description.trim() || null,
        image: form.image.trim() || null,
        status: form.status,
        entryMethod: form.entryMethod.trim() || "Enter Now",
        entryCost: Number(form.entryCost || 0),
        entryCurrency: form.entryCurrency,
        maxEntriesPerUser:
          form.maxEntriesPerUser.trim() === ""
            ? null
            : Number(form.maxEntriesPerUser),
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
        winner: form.winner.trim() || null,
        prizeDetails: form.prizeDetails.trim(),
      };

      const res = await fetch("/api/raffles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        throw new Error(data.error || "Could not save raffle");
      }

      setMessage(editingId ? "Raffle updated." : "Raffle created.");
      await loadRaffles();

      if (!editingId) {
        startCreate();
      }
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Could not save raffle",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(raffleId: string) {
    if (!window.confirm("Delete this raffle?")) {
      return;
    }

    setActionRaffleId(raffleId);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/raffles", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: raffleId }),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        throw new Error(data.error || "Could not delete raffle");
      }

      if (editingId === raffleId) {
        resetForm();
      }

      setMessage("Raffle deleted.");
      await loadRaffles();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete raffle",
      );
    } finally {
      setActionRaffleId(null);
    }
  }

  async function handleAction(
    raffleId: string,
    action: "pickWinner" | "rerollWinner" | "clearWinner",
  ) {
    setActionRaffleId(raffleId);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/raffles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          raffleId,
        }),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        throw new Error(data.error || "Action failed");
      }

      setMessage(
        action === "pickWinner"
          ? "Winner picked."
          : action === "rerollWinner"
            ? "Winner rerolled."
            : "Winner cleared and raffle reopened.",
      );

      await loadRaffles();
    } catch (actionError) {
      setError(
        actionError instanceof Error ? actionError.message : "Action failed",
      );
    } finally {
      setActionRaffleId(null);
    }
  }

  if (loadingUser) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white/75">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading admin panel...
        </div>
      </div>
    );
  }

  if (!me?.isAdmin) {
    return (
      <div
        className="mx-auto max-w-3xl rounded-[28px] border p-8"
        style={{
          borderColor: "rgba(239,68,68,0.18)",
          background:
            "linear-gradient(180deg, rgba(28,10,14,0.92) 0%, rgba(18,8,11,0.98) 100%)",
          boxShadow:
            "0 0 0 1px rgba(239,68,68,0.08), 0 24px 70px rgba(2,8,23,0.5)",
        }}
      >
        <div className="flex items-center gap-3">
          <ShieldAlert className="h-6 w-6 text-red-300" />
          <div className="text-2xl font-bold text-white">Access denied</div>
        </div>
        <p className="mt-3 text-sm leading-7 text-white/60">
          You must be an admin to manage raffles.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1360px] space-y-6">
      <section
        className="rounded-[30px] border p-5 sm:p-6 md:p-8"
        style={{
          borderColor: "rgba(255,255,255,0.08)",
          background:
            "linear-gradient(180deg, rgba(10,16,30,0.96) 0%, rgba(5,10,22,0.98) 100%)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.02), 0 24px 70px rgba(2,8,23,0.45)",
        }}
      >
        <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300/85">
              Admin
            </div>
            <h1 className="mt-2 truncate text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Raffles
            </h1>
            <p className="truncate-3 mt-3 max-w-2xl text-sm leading-7 text-white/58">
              Create, edit, delete, pick winners, reroll results, and keep the
              public raffle page synced with live data.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <TopStat value={String(raffles.length)} label="Total" />
            <TopStat value={String(activeRaffles.length)} label="Active" />
            <TopStat value={String(endedRaffles.length)} label="Ended" />
          </div>
        </div>
      </section>

      {message ? (
        <Notice tone="success" icon={<CheckCircle2 className="h-4 w-4" />}>
          {message}
        </Notice>
      ) : null}

      {error ? (
        <Notice tone="error" icon={<XCircle className="h-4 w-4" />}>
          {error}
        </Notice>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <section
          className="rounded-[28px] border p-5 sm:p-6"
          style={{
            borderColor: "rgba(255,255,255,0.08)",
            background:
              "linear-gradient(180deg, rgba(12,18,34,0.96) 0%, rgba(7,12,24,0.98) 100%)",
          }}
        >
          <div className="flex min-w-0 items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-[0.26em] text-white/42">
                {editingId ? "Edit raffle" : "New raffle"}
              </div>
              <h2 className="mt-2 truncate text-xl font-bold text-white sm:text-2xl">
                {editingId ? "Edit details" : "New raffle"}
              </h2>
            </div>

            <button
              type="button"
              onClick={startCreate}
              className="inline-flex h-11 min-w-0 items-center gap-2 rounded-2xl border px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/[0.05]"
              style={{
                borderColor: "rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span className="truncate whitespace-nowrap">New</span>
            </button>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSave}>
            <Field label="Raffle ID">
              <input
                value={form.id}
                onChange={(event) => setField("id", event.target.value)}
                className={inputClassName}
                placeholder="weekly-giveaway-apr-1"
                disabled={Boolean(editingId)}
              />
            </Field>

            <Field label="Title">
              <input
                value={form.title}
                onChange={(event) => setField("title", event.target.value)}
                className={inputClassName}
                placeholder="Weekly Stream Giveaway"
              />
            </Field>

            <Field label="Prize Details">
              <input
                value={form.prizeDetails}
                onChange={(event) => setField("prizeDetails", event.target.value)}
                className={inputClassName}
                placeholder="$250 Cash Prize"
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

            <Field label="Image URL">
              <input
                value={form.image}
                onChange={(event) => setField("image", event.target.value)}
                className={inputClassName}
                placeholder="https://..."
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(event) =>
                    setField("status", event.target.value as "active" | "ended")
                  }
                  className={inputClassName}
                >
                  <option value="active">active</option>
                  <option value="ended">ended</option>
                </select>
              </Field>

              <Field label="Entry Currency">
                <select
                  value={form.entryCurrency}
                  onChange={(event) =>
                    setField(
                      "entryCurrency",
                      event.target.value as "bullets" | "points",
                    )
                  }
                  className={inputClassName}
                >
                  <option value="bullets">bullets</option>
                  <option value="points">points</option>
                </select>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Entry Cost">
                <input
                  type="number"
                  min="0"
                  value={form.entryCost}
                  onChange={(event) => setField("entryCost", event.target.value)}
                  className={inputClassName}
                />
              </Field>

              <Field label="Max Entries Per User">
                <input
                  type="number"
                  min="1"
                  value={form.maxEntriesPerUser}
                  onChange={(event) =>
                    setField("maxEntriesPerUser", event.target.value)
                  }
                  className={inputClassName}
                  placeholder="Leave blank for no limit"
                />
              </Field>
            </div>

            <Field label="Entry button text">
              <input
                value={form.entryMethod}
                onChange={(event) => setField("entryMethod", event.target.value)}
                className={inputClassName}
                placeholder="Enter Now"
              />
            </Field>

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

            <Field label="Winner Override (optional)">
              <input
                value={form.winner}
                onChange={(event) => setField("winner", event.target.value)}
                className={inputClassName}
                placeholder="Leave blank to let the system pick"
              />
            </Field>

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
                      ? "Save raffle"
                      : "New raffle"}
                </span>
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="inline-flex h-12 min-w-0 items-center justify-center rounded-2xl border px-4 text-sm font-semibold text-white/80 transition-all duration-200 hover:bg-white/[0.05]"
                style={{
                  borderColor: "rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <span className="truncate whitespace-nowrap">Reset</span>
              </button>
            </div>
          </form>
        </section>

        <section className="space-y-4">
          <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-[0.26em] text-white/42">
                Live Data
              </div>
              <h2 className="mt-2 truncate text-xl font-bold text-white sm:text-2xl">
                Manage Raffles
              </h2>
            </div>

            <button
              type="button"
              onClick={() => void loadRaffles()}
              className="inline-flex h-11 min-w-0 items-center gap-2 rounded-2xl border px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/[0.05]"
              style={{
                borderColor: "rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <RefreshCw className="h-4 w-4 shrink-0" />
              <span className="truncate whitespace-nowrap">Refresh</span>
            </button>
          </div>

          {loadingRaffles ? (
            <div
              className="rounded-[28px] border px-6 py-10 text-center text-white/65"
              style={{
                borderColor: "rgba(255,255,255,0.08)",
                background:
                  "linear-gradient(180deg, rgba(12,18,34,0.96) 0%, rgba(7,12,24,0.98) 100%)",
              }}
            >
              <div className="inline-flex items-center gap-3">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading raffles...
              </div>
            </div>
          ) : raffles.length === 0 ? (
            <div
              className="rounded-[28px] border px-6 py-10 text-center"
              style={{
                borderColor: "rgba(255,255,255,0.08)",
                background:
                  "linear-gradient(180deg, rgba(12,18,34,0.96) 0%, rgba(7,12,24,0.98) 100%)",
              }}
            >
              <div className="text-xl font-bold text-white">No raffles yet</div>
              <div className="mt-2 text-sm text-white/55">
                Create your first raffle from the panel on the left.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {raffles.map((raffle) => {
                const isBusy = actionRaffleId === raffle.id;
                const isEnded = raffle.status === "ended";

                return (
                  <article
                    key={raffle.id}
                    className="rounded-[28px] border p-5 sm:p-6"
                    style={{
                      borderColor: "rgba(255,255,255,0.08)",
                      background:
                        "linear-gradient(180deg, rgba(12,18,34,0.96) 0%, rgba(7,12,24,0.98) 100%)",
                      boxShadow:
                        "0 0 0 1px rgba(255,255,255,0.02), 0 18px 44px rgba(2,8,23,0.35)",
                    }}
                  >
                    <div className="flex min-w-0 flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 flex-wrap items-center gap-2.5">
                          <h3 className="truncate text-xl font-bold text-white sm:text-2xl">
                            {raffle.title}
                          </h3>

                          <span
                            className="inline-flex h-8 max-w-full items-center rounded-full border px-3 text-xs font-semibold uppercase tracking-[0.16em]"
                            style={{
                              borderColor:
                                raffle.status === "active"
                                  ? "rgba(56,189,248,0.18)"
                                  : "rgba(250,204,21,0.16)",
                              background:
                                raffle.status === "active"
                                  ? "rgba(56,189,248,0.10)"
                                  : "rgba(250,204,21,0.08)",
                              color: "rgba(255,255,255,0.82)",
                            }}
                          >
                            <span className="truncate whitespace-nowrap">
                              {raffle.status}
                            </span>
                          </span>
                        </div>

                        <div className="mt-2 truncate-2 text-sm text-white/58">
                          {raffle.prizeDetails}
                        </div>

                        {raffle.description ? (
                          <div className="truncate-3 mt-2 text-sm leading-6 text-white/52">
                            {raffle.description}
                          </div>
                        ) : null}

                        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                          <MiniStat
                            icon={<Users className="h-4 w-4" />}
                            label="Total Entries"
                            value={raffle.totalEntries.toLocaleString()}
                          />
                          <MiniStat
                            icon={<Gift className="h-4 w-4" />}
                            label="Unique Entrants"
                            value={raffle.uniqueEntrants.toLocaleString()}
                          />
                          <MiniStat
                            icon={<Coins className="h-4 w-4" />}
                            label="Entry Cost"
                            value={
                              raffle.entryCost > 0
                                ? `${raffle.entryCost.toLocaleString()} ${raffle.entryCurrency}`
                                : "Free"
                            }
                          />
                          <MiniStat
                            icon={<CheckCircle2 className="h-4 w-4" />}
                            label="Max Per User"
                            value={
                              raffle.maxEntriesPerUser === null
                                ? "Unlimited"
                                : raffle.maxEntriesPerUser.toLocaleString()
                            }
                          />
                          <MiniStat
                            icon={<Trophy className="h-4 w-4" />}
                            label="Winner"
                            value={raffle.winner?.trim() || "Pending"}
                          />
                        </div>

                        <div className="mt-5 grid gap-3 md:grid-cols-2">
                          <MetaRow
                            label="Starts"
                            value={formatAdminDate(raffle.startDate)}
                            icon={<Clock3 className="h-4 w-4" />}
                          />
                          <MetaRow
                            label="Ends"
                            value={formatAdminDate(raffle.endDate)}
                            icon={<Clock3 className="h-4 w-4" />}
                          />
                        </div>
                      </div>

                      <div className="grid gap-2 sm:grid-cols-2 xl:w-[280px] xl:grid-cols-1">
                        <ActionButton
                          label="Edit"
                          icon={<Pencil className="h-4 w-4" />}
                          onClick={() => startEdit(raffle)}
                        />
                        <ActionButton
                          label="Pick Winner"
                          icon={
                            isBusy ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trophy className="h-4 w-4" />
                            )
                          }
                          onClick={() =>
                            void handleAction(raffle.id, "pickWinner")
                          }
                          disabled={isBusy}
                        />
                        <ActionButton
                          label="Reroll Winner"
                          icon={
                            isBusy ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <RefreshCw className="h-4 w-4" />
                            )
                          }
                          onClick={() =>
                            void handleAction(raffle.id, "rerollWinner")
                          }
                          disabled={isBusy || !isEnded}
                        />
                        <ActionButton
                          label="Reopen / Clear Winner"
                          icon={
                            isBusy ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )
                          }
                          onClick={() =>
                            void handleAction(raffle.id, "clearWinner")
                          }
                          disabled={isBusy}
                        />
                        <ActionButton
                          label="Delete"
                          icon={
                            isBusy ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )
                          }
                          onClick={() => void handleDelete(raffle.id)}
                          disabled={isBusy}
                          danger
                        />
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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block min-w-0">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
        {label}
      </div>
      {children}
    </label>
  );
}

function TopStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div
      className="min-w-0 rounded-2xl border px-4 py-3"
      style={{
        borderColor: "rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.03)",
      }}
    >
      <div className="truncate text-lg font-bold text-white">{value}</div>
      <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/42">
        {label}
      </div>
    </div>
  );
}

function Notice({
  tone,
  icon,
  children,
}: {
  tone: "success" | "error";
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const isSuccess = tone === "success";

  return (
    <div
      className="rounded-2xl border px-4 py-3 text-sm"
      style={{
        borderColor: isSuccess
          ? "rgba(34,197,94,0.18)"
          : "rgba(239,68,68,0.18)",
        background: isSuccess
          ? "rgba(34,197,94,0.08)"
          : "rgba(239,68,68,0.08)",
        color: "rgba(255,255,255,0.86)",
      }}
    >
      <div className="flex min-w-0 items-center gap-2">
        <span className="shrink-0">{icon}</span>
        <span className="truncate-2">{children}</span>
      </div>
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
    <div
      className="min-w-0 rounded-2xl border px-4 py-3"
      style={{
        borderColor: "rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.03)",
      }}
    >
      <div className="flex min-w-0 items-center gap-2 text-white/44">
        <span className="shrink-0">{icon}</span>
        <span className="truncate text-[11px] font-semibold uppercase tracking-[0.18em]">
          {label}
        </span>
      </div>
      <div className="mt-2 truncate text-base font-bold text-white">{value}</div>
    </div>
  );
}

function MetaRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="flex min-w-0 items-center gap-3 rounded-2xl border px-4 py-3"
      style={{
        borderColor: "rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <div className="shrink-0 text-white/45">{icon}</div>
      <div className="min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/42">
          {label}
        </div>
        <div className="mt-1 truncate text-sm font-medium text-white">{value}</div>
      </div>
    </div>
  );
}

function ActionButton({
  label,
  icon,
  onClick,
  disabled,
  danger = false,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-50"
      style={{
        borderColor: danger
          ? "rgba(239,68,68,0.18)"
          : "rgba(255,255,255,0.08)",
        background: danger ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.02)",
      }}
    >
      <span className="shrink-0">{icon}</span>
      <span className="truncate whitespace-nowrap">{label}</span>
    </button>
  );
}

function toLocalDateTimeValue(date: Date) {
  const copy = new Date(date);
  copy.setMinutes(copy.getMinutes() - copy.getTimezoneOffset());
  return copy.toISOString().slice(0, 16);
}

function formatAdminDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function createRaffleId() {
  return `raffle-${Date.now()}`;
}