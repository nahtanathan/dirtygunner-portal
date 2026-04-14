// FILE: src/app/(admin)/admin/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
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
      console.error("Failed to load raffles:", error);
      setMessage("Failed to load raffles");
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
      setMessage("Raffle saved");
    } catch (error) {
      console.error("Failed to save raffle:", error);
      setMessage(
        error instanceof Error ? error.message : "Failed to save raffle",
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

      setMessage("Raffle deleted");
    } catch (error) {
      console.error("Failed to delete raffle:", error);
      setMessage(
        error instanceof Error ? error.message : "Failed to delete raffle",
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
        title="DirtyGunner Control Panel"
        description="Manage raffles, leaderboard settings, and live site content."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <AdminStatCard label="Active Raffles" value={String(activeCount)} />
        <AdminStatCard label="Total Raffles" value={String(raffles.length)} />
        <AdminStatCard
          label="Backend Status"
          value="Prisma Live"
          subtext="Raffles save directly into the database."
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-white/10 bg-black/20 p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.32em] text-sky-300/70">
                Manage Raffles
              </div>
              <h2 className="mt-2 text-3xl font-bold uppercase tracking-wide text-white">
                Existing Raffles
              </h2>
            </div>

            <button
              type="button"
              onClick={startNewRaffle}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/[0.05]"
            >
              New Raffle
            </button>
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
                <div
                  key={raffle.id}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold text-white">
                        {raffle.title}
                      </div>
                      <div className="mt-1 text-sm text-white/60">
                        {raffle.status} • {raffle.totalEntries} entries • ends{" "}
                        {new Date(raffle.endDate).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEditRaffle(raffle)}
                        className="rounded-xl border border-white/10 px-3 py-2 text-sm text-white hover:bg-white/[0.05]"
                        disabled={isSaving || deletingId === raffle.id}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => void deleteRaffle(raffle.id)}
                        className="rounded-xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-200"
                        disabled={isSaving || deletingId === raffle.id}
                      >
                        {deletingId === raffle.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-black/20 p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.32em] text-sky-300/70">
                Editor
              </div>
              <h3 className="mt-2 text-2xl font-bold uppercase tracking-wide text-white">
                {isEditingExisting ? "Edit Raffle" : "Create Raffle"}
              </h3>
            </div>

            <button
              type="button"
              onClick={startNewRaffle}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/[0.05]"
              disabled={isSaving}
            >
              Reset
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-white/50">
                Title
              </label>
              <input
                value={currentForm.title}
                onChange={(event) => updateField("title", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-sky-400/40"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-white/50">
                Description
              </label>
              <textarea
                value={currentForm.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                rows={4}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-sky-400/40"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-white/50">
                Status
              </label>
              <select
                value={currentForm.status}
                onChange={(event) =>
                  updateField("status", event.target.value as "active" | "ended")
                }
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-sky-400/40"
              >
                <option value="active">active</option>
                <option value="ended">ended</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-white/50">
                Button Text
              </label>
              <input
                value={currentForm.entryMethod}
                onChange={(event) =>
                  updateField("entryMethod", event.target.value)
                }
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-sky-400/40"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-white/50">
                Entries
              </label>
              <input
                type="number"
                value={currentForm.totalEntries}
                onChange={(event) =>
                  updateField("totalEntries", Number(event.target.value) || 0)
                }
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-sky-400/40"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-white/50">
                Start Date
              </label>
              <input
                type="datetime-local"
                value={currentForm.startDate}
                onChange={(event) => updateField("startDate", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-sky-400/40"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-white/50">
                End Date
              </label>
              <input
                type="datetime-local"
                value={currentForm.endDate}
                onChange={(event) => updateField("endDate", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-sky-400/40"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-white/50">
                Prize Details
              </label>
              <input
                value={currentForm.prizeDetails}
                onChange={(event) =>
                  updateField("prizeDetails", event.target.value)
                }
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-sky-400/40"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-white/50">
                Winner
              </label>
              <input
                value={currentForm.winner}
                onChange={(event) => updateField("winner", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-sky-400/40"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-white/50">
                Image URL
              </label>
              <input
                value={currentForm.image}
                onChange={(event) => updateField("image", event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-sky-400/40"
              />
            </div>

            {message ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/80">
                {message}
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => void saveRaffle()}
              disabled={isSaving}
              className="w-full rounded-2xl bg-[linear-gradient(135deg,rgba(78,164,255,0.95),rgba(139,92,246,0.9))] px-4 py-3 font-semibold uppercase tracking-[0.2em] text-white shadow-glow disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save Raffle"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}