// FILE: src/app/(admin)/admin/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Loader2, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

type AdminRaffle = {
  id: string;
  title: string;
  description: string;
  image: string;
  status: "active" | "ended";
  entryMethod: string;
  totalEntries: number;
  startDate: string;
  endDate: string;
  winner: string;
  prizeDetails: string;
};

type ApiRaffle = {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  status: "active" | "ended";
  entryMethod: string;
  totalEntries: number;
  startDate: string;
  endDate: string;
  winner: string | null;
  prizeDetails: string;
  createdAt: string;
  updatedAt: string;
};

function toDateTimeLocal(value: string | Date) {
  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
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

function createEmptyRaffle(): AdminRaffle {
  const now = new Date();
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);

  return {
    id: crypto.randomUUID(),
    title: "",
    description: "",
    image: "",
    status: "active",
    entryMethod: "Join for Free",
    totalEntries: 0,
    startDate: toDateTimeLocal(now),
    endDate: toDateTimeLocal(tomorrow),
    winner: "",
    prizeDetails: "",
  };
}

function normalizeApiRaffle(item: ApiRaffle): AdminRaffle {
  return {
    id: item.id,
    title: item.title ?? "",
    description: item.description ?? "",
    image: item.image ?? "",
    status: item.status,
    entryMethod: item.entryMethod ?? "Join for Free",
    totalEntries: Number(item.totalEntries ?? 0),
    startDate: toDateTimeLocal(item.startDate),
    endDate: toDateTimeLocal(item.endDate),
    winner: item.winner ?? "",
    prizeDetails: item.prizeDetails ?? "",
  };
}

const inputClassName =
  "h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-white/20 focus:bg-white/[0.05]";

const textareaClassName =
  "min-h-[112px] w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-white/20 focus:bg-white/[0.05]";

export default function AdminPage() {
  const [raffles, setRaffles] = useState<AdminRaffle[]>([]);
  const [form, setForm] = useState<AdminRaffle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");

  const activeCount = useMemo(
    () => raffles.filter((item) => item.status === "active").length,
    [raffles],
  );

  useEffect(() => {
    void loadRaffles();
  }, []);

  async function loadRaffles() {
    try {
      setIsLoading(true);

      const res = await fetch("/api/raffles", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = (await res.json()) as ApiRaffle[];
      const normalized = Array.isArray(data) ? data.map(normalizeApiRaffle) : [];

      setRaffles(normalized);

      setForm((current) => {
        if (!current) {
          return createEmptyRaffle();
        }

        const updatedCurrent = normalized.find((item) => item.id === current.id);
        return updatedCurrent ?? current;
      });
    } catch (error) {
      console.error("Could not load raffles:", error);
      setMessage("Could not load raffles");
      setForm(createEmptyRaffle());
    } finally {
      setIsLoading(false);
    }
  }

  function updateField<K extends keyof AdminRaffle>(key: K, value: AdminRaffle[K]) {
    setForm((current) => {
      const base = current ?? createEmptyRaffle();
      return {
        ...base,
        [key]: value,
      };
    });
  }

  function startNewRaffle() {
    setForm(createEmptyRaffle());
    setMessage("");
  }

  function startEditRaffle(raffle: AdminRaffle) {
    setForm({ ...raffle });
    setMessage("");
  }

  async function saveRaffle() {
    if (!form) return;

    if (!form.title.trim()) {
      setMessage("Title is required");
      return;
    }

    if (!form.entryMethod.trim()) {
      setMessage("Button text is required");
      return;
    }

    if (!form.prizeDetails.trim()) {
      setMessage("Prize details are required");
      return;
    }

    if (!form.startDate || !form.endDate) {
      setMessage("Start and end dates are required");
      return;
    }

    const payload = {
      id: form.id,
      title: form.title.trim(),
      description: form.description.trim() || null,
      image: form.image.trim() || null,
      status: form.status,
      entryMethod: form.entryMethod.trim(),
      totalEntries: Number(form.totalEntries) || 0,
      startDate: new Date(form.startDate).toISOString(),
      endDate: new Date(form.endDate).toISOString(),
      winner: form.winner.trim() || null,
      prizeDetails: form.prizeDetails.trim(),
    };

    try {
      setIsSaving(true);
      setMessage("");

      const res = await fetch("/api/raffles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      await loadRaffles();
      setForm(createEmptyRaffle());
      setMessage("Raffle saved.");
    } catch (error) {
      console.error("Could not save raffle:", error);
      setMessage(
        error instanceof Error ? error.message : "Could not save raffle",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteRaffle(id: string) {
    try {
      setDeletingId(id);
      setMessage("");

      const res = await fetch("/api/raffles", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      await loadRaffles();

      setForm((current) => {
        if (current?.id === id) {
          return createEmptyRaffle();
        }
        return current;
      });

      setMessage("Raffle deleted.");
    } catch (error) {
      console.error("Could not delete raffle:", error);
      setMessage(
        error instanceof Error ? error.message : "Could not delete raffle",
      );
    } finally {
      setDeletingId(null);
    }
  }

  const currentForm = form ?? createEmptyRaffle();
  const isEditingExisting = raffles.some((item) => item.id === currentForm.id);

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Admin"
        title="Site Admin"
        description="Manage raffles and core site settings."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <AdminStatCard label="Active Raffles" value={String(activeCount)} />
        <AdminStatCard label="Total Raffles" value={String(raffles.length)} />
        <AdminStatCard
          label="Backend Status"
          value="Prisma Live"
          subtext="Raffles save straight to the database."
        />
      </div>

      {message ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/78">
          <div className="flex min-w-0 items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-white/65" />
            <span className="truncate-2">{message}</span>
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(340px,0.92fr)]">
        <section className="rounded-3xl border border-white/10 bg-black/20 p-5 sm:p-6">
          <div className="mb-5 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-[0.32em] text-sky-300/70">
                Manage Raffles
              </div>
              <h2 className="mt-2 truncate text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
                Existing Raffles
              </h2>
            </div>

            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => void loadRaffles()}
                className="inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/[0.05]"
              >
                <RefreshCw className="h-4 w-4 shrink-0" />
                <span className="truncate whitespace-nowrap">Refresh</span>
              </button>

              <button
                type="button"
                onClick={startNewRaffle}
                className="inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/[0.05]"
              >
                <Plus className="h-4 w-4 shrink-0" />
                <span className="truncate whitespace-nowrap">New</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {isLoading ? (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
                Loading raffles...
              </div>
            ) : raffles.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
                No raffles yet.
              </div>
            ) : (
              raffles.map((raffle) => (
                <article
                  key={raffle.id}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <h3 className="truncate text-lg font-semibold text-white">
                          {raffle.title}
                        </h3>

                        <span className="inline-flex max-w-full rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
                          <span className="truncate whitespace-nowrap">{raffle.status}</span>
                        </span>
                      </div>

                      <div className="mt-2 truncate-2 text-sm text-white/58">
                        {raffle.prizeDetails}
                      </div>

                      {raffle.description ? (
                        <div className="truncate-3 mt-2 text-sm leading-6 text-white/48">
                          {raffle.description}
                        </div>
                      ) : null}

                      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        <InfoCard label="Entries" value={String(raffle.totalEntries)} />
                        <InfoCard label="Starts" value={formatAdminDate(raffle.startDate)} />
                        <InfoCard label="Ends" value={formatAdminDate(raffle.endDate)} />
                      </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 lg:w-[190px] lg:grid-cols-1">
                      <button
                        type="button"
                        onClick={() => startEditRaffle(raffle)}
                        className="inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-2xl border border-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/[0.05]"
                        disabled={isSaving || deletingId === raffle.id}
                      >
                        <Pencil className="h-4 w-4 shrink-0" />
                        <span className="truncate whitespace-nowrap">Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => void deleteRaffle(raffle.id)}
                        className="inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 text-sm font-semibold text-red-200"
                        disabled={isSaving || deletingId === raffle.id}
                      >
                        <Trash2 className="h-4 w-4 shrink-0" />
                        <span className="truncate whitespace-nowrap">
                          {deletingId === raffle.id ? "Deleting..." : "Delete"}
                        </span>
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-black/20 p-5 sm:p-6">
          <div className="mb-5 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-[0.32em] text-sky-300/70">
                Editor
              </div>
              <h3 className="mt-2 truncate text-2xl font-bold uppercase tracking-wide text-white">
                {isEditingExisting ? "Edit raffle" : "New raffle"}
              </h3>
            </div>

            <button
              type="button"
              onClick={startNewRaffle}
              className="inline-flex h-11 min-w-0 items-center justify-center rounded-2xl border border-white/10 px-4 text-sm font-semibold text-white/80 transition hover:bg-white/[0.05]"
              disabled={isSaving}
            >
              <span className="truncate whitespace-nowrap">Reset</span>
            </button>
          </div>

          <div className="space-y-4">
            <Field label="Title">
              <input
                value={currentForm.title}
                onChange={(event) => updateField("title", event.target.value)}
                className={inputClassName}
              />
            </Field>

            <Field label="Description">
              <textarea
                value={currentForm.description}
                onChange={(event) => updateField("description", event.target.value)}
                rows={4}
                className={textareaClassName}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Status">
                <select
                  value={currentForm.status}
                  onChange={(event) =>
                    updateField("status", event.target.value as "active" | "ended")
                  }
                  className={inputClassName}
                >
                  <option value="active">active</option>
                  <option value="ended">ended</option>
                </select>
              </Field>

              <Field label="Entry button text">
                <input
                  value={currentForm.entryMethod}
                  onChange={(event) => updateField("entryMethod", event.target.value)}
                  className={inputClassName}
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Entries">
                <input
                  type="number"
                  value={currentForm.totalEntries}
                  onChange={(event) =>
                    updateField("totalEntries", Number(event.target.value) || 0)
                  }
                  className={inputClassName}
                />
              </Field>

              <Field label="Prize Details">
                <input
                  value={currentForm.prizeDetails}
                  onChange={(event) => updateField("prizeDetails", event.target.value)}
                  className={inputClassName}
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Start Date">
                <input
                  type="datetime-local"
                  value={currentForm.startDate}
                  onChange={(event) => updateField("startDate", event.target.value)}
                  className={inputClassName}
                />
              </Field>

              <Field label="End Date">
                <input
                  type="datetime-local"
                  value={currentForm.endDate}
                  onChange={(event) => updateField("endDate", event.target.value)}
                  className={inputClassName}
                />
              </Field>
            </div>

            <Field label="Winner">
              <input
                value={currentForm.winner}
                onChange={(event) => updateField("winner", event.target.value)}
                className={inputClassName}
              />
            </Field>

            <Field label="Image URL">
              <input
                value={currentForm.image}
                onChange={(event) => updateField("image", event.target.value)}
                className={inputClassName}
              />
            </Field>

            <div className="flex min-w-0 flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={() => void saveRaffle()}
                disabled={isSaving}
                className="inline-flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                ) : isEditingExisting ? (
                  <Pencil className="h-4 w-4 shrink-0" />
                ) : (
                  <Plus className="h-4 w-4 shrink-0" />
                )}
                <span className="truncate whitespace-nowrap">
                  {isSaving
                    ? "Saving..."
                    : isEditingExisting
                      ? "Save raffle"
                      : "New raffle"}
                </span>
              </button>

              <button
                type="button"
                onClick={startNewRaffle}
                className="inline-flex h-12 min-w-0 items-center justify-center rounded-2xl border border-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/[0.05]"
                disabled={isSaving}
              >
                <span className="truncate whitespace-nowrap">Clear</span>
              </button>
            </div>
          </div>
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
      <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-white/50">
        {label}
      </div>
      {children}
    </label>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <div className="text-[11px] uppercase tracking-[0.2em] text-white/42">
        {label}
      </div>
      <div className="mt-1 truncate text-sm font-semibold text-white">{value}</div>
    </div>
  );
}