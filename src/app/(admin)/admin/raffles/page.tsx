// FILE: src/app/(admin)/raffles/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminResourceManager } from "@/components/admin/AdminResourceManager";
import { raffleSchema } from "@/lib/validators/admin";
import { Raffle } from "@/lib/types";

type ApiEntrant = {
  userId: string;
  displayName: string;
  kickUsername: string | null;
  entryCount: number;
  totalSpent: number;
  pointsRemaining: number | null;
  lastEnteredAt: string;
};

type ApiRaffle = {
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
  entrants: ApiEntrant[];
  currentUserEntries: number;
  currentUserPoints: number | null;
  startDate: string;
  endDate: string;
  winner: string | null;
  prizeDetails: string;
  createdAt: string;
  updatedAt: string;
};

type AdminRaffleWithEntrants = Raffle & {
  entrants: ApiEntrant[];
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

function createEmptyRaffle(): AdminRaffleWithEntrants {
  const now = new Date();
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);

  return {
    id: crypto.randomUUID(),
    title: "",
    description: "",
    image: "",
    status: "active",
    entryMethod: "Join for Free",
    entryCost: 0,
    entryCurrency: "bullets",
    maxEntriesPerUser: null,
    totalEntries: 0,
    uniqueEntrants: 0,
    totalSpent: 0,
    currentUserEntries: 0,
    currentUserPoints: 0,
    startDate: toDateTimeLocal(now),
    endDate: toDateTimeLocal(tomorrow),
    winner: "",
    prizeDetails: "",
    entrants: [],
  };
}

function normalizeRaffleForEditor(item: ApiRaffle): AdminRaffleWithEntrants {
  return {
    id: item.id,
    title: item.title ?? "",
    description: item.description ?? "",
    image: item.image ?? "",
    status: item.status === "active" ? "active" : "ended",
    entryMethod: item.entryMethod ?? "Join for Free",
    entryCost: Number(item.entryCost ?? 0),
    entryCurrency: item.entryCurrency === "points" ? "points" : "bullets",
    maxEntriesPerUser: item.maxEntriesPerUser ?? null,
    totalEntries: Number(item.totalEntries ?? 0),
    uniqueEntrants: Number(item.uniqueEntrants ?? 0),
    totalSpent: Number(item.totalSpent ?? 0),
    currentUserEntries: Number(item.currentUserEntries ?? 0),
    currentUserPoints: Number(item.currentUserPoints ?? 0),
    startDate: toDateTimeLocal(item.startDate),
    endDate: toDateTimeLocal(item.endDate),
    winner: item.winner ?? "",
    prizeDetails: item.prizeDetails ?? "",
    entrants: Array.isArray(item.entrants) ? item.entrants : [],
  };
}

export default function AdminRafflesPage() {
  const [items, setItems] = useState<AdminRaffleWithEntrants[]>([]);
  const [emptyValue, setEmptyValue] = useState<AdminRaffleWithEntrants>(createEmptyRaffle());
  const [resetToken, setResetToken] = useState(0);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const activeCount = useMemo(
    () => items.filter((item) => item.status === "active").length,
    [items],
  );

  useEffect(() => {
    void loadRaffles();
  }, []);

  async function loadRaffles() {
    const res = await fetch("/api/raffles", {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to load raffles");
    }

    const data = (await res.json()) as ApiRaffle[];
    const normalized = Array.isArray(data)
      ? data.map(normalizeRaffleForEditor)
      : [];

    setItems(normalized);
  }

  function resetEditor() {
    setEmptyValue(createEmptyRaffle());
    setResetToken((value) => value + 1);
  }

  async function saveRaffle(payload: AdminRaffleWithEntrants) {
    const body = {
      id: payload.id,
      title: payload.title.trim(),
      description: payload.description?.trim() || null,
      image: payload.image?.trim() || null,
      status: payload.status,
      entryMethod: payload.entryMethod.trim(),
      entryCost: Number(payload.entryCost ?? 0),
      entryCurrency: payload.entryCurrency,
      maxEntriesPerUser:
        payload.maxEntriesPerUser === null ||
        payload.maxEntriesPerUser === undefined ||
        payload.maxEntriesPerUser === ("" as never)
          ? null
          : Number(payload.maxEntriesPerUser),
      totalEntries: Number(payload.totalEntries ?? 0),
      startDate: new Date(payload.startDate).toISOString(),
      endDate: new Date(payload.endDate).toISOString(),
      winner: payload.winner?.trim() || null,
      prizeDetails: payload.prizeDetails.trim(),
    };

    const res = await fetch("/api/raffles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to save raffle");
    }

    await loadRaffles();
    resetEditor();
  }

  async function removeRaffle(id: string) {
    const res = await fetch("/api/raffles", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Failed to delete raffle");
    }

    await loadRaffles();
    resetEditor();
  }

  async function runRaffleAction(
    raffleId: string,
    action: "pickWinner" | "rerollWinner" | "clearWinner",
  ) {
    try {
      setActionLoadingId(`${raffleId}:${action}`);

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

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          data && typeof data === "object" && "error" in data
            ? String(data.error)
            : "Failed to update raffle winner",
        );
      }

      await loadRaffles();
    } finally {
      setActionLoadingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <AdminResourceManager<AdminRaffleWithEntrants>
        title="Raffles"
        description={`Create, edit, end, and manage community raffle events. ${activeCount} active.`}
        items={items}
        schema={raffleSchema}
        emptyValue={emptyValue}
        resetToken={resetToken}
        fields={[
          { name: "title", label: "Title" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "image", label: "Image URL", type: "url" },
          { name: "status", label: "Status", type: "select", options: ["active", "ended"] },
          { name: "entryMethod", label: "Button Text" },
          { name: "entryCost", label: "Entry Cost", type: "number" },
          { name: "entryCurrency", label: "Currency", type: "select", options: ["bullets", "points"] },
          { name: "maxEntriesPerUser", label: "Max Entries Per User", type: "number" },
          { name: "startDate", label: "Start Date", type: "datetime-local" },
          { name: "endDate", label: "End Date", type: "datetime-local" },
          { name: "winner", label: "Winner" },
          { name: "prizeDetails", label: "Prize Details", type: "textarea" },
        ]}
        onSave={saveRaffle}
        onDelete={removeRaffle}
        renderMeta={(item) => {
          const costLabel =
            item.entryCost > 0
              ? `${item.entryCost.toLocaleString()} ${item.entryCurrency}`
              : "free";

          return `${item.status} · ${item.totalEntries} entries · ${item.uniqueEntrants ?? 0} entrants · ${costLabel} · spent ${(item.totalSpent ?? 0).toLocaleString()}`;
        }}
      />

      <section className="grid gap-4">
        {items.map((raffle) => (
          <article
            key={`entrant-panel-${raffle.id}`}
            className="rounded-3xl border border-white/10 bg-black/20 p-5"
          >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.28em] text-electric/70">
                    Entrants
                  </div>
                  <h3 className="mt-2 text-2xl font-bold uppercase tracking-wide text-white">
                    {raffle.title}
                  </h3>
                  <div className="mt-2 text-sm text-silver/60">
                    {raffle.status} · {raffle.totalEntries} total entries ·{" "}
                    {raffle.uniqueEntrants ?? 0} unique entrants · spent{" "}
                    {(raffle.totalSpent ?? 0).toLocaleString()} {raffle.entryCurrency}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <MiniStat label="Entries" value={String(raffle.totalEntries)} />
                  <MiniStat label="Entrants" value={String(raffle.uniqueEntrants ?? 0)} />
                  <MiniStat
                    label="Cost"
                    value={
                      raffle.entryCost > 0
                        ? `${raffle.entryCost} ${raffle.entryCurrency}`
                        : "Free"
                    }
                  />
                  <MiniStat
                    label="Winner"
                    value={raffle.winner?.trim() ? raffle.winner : "Pending"}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => void runRaffleAction(raffle.id, "pickWinner")}
                  disabled={actionLoadingId !== null}
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/[0.05] disabled:opacity-60"
                >
                  {actionLoadingId === `${raffle.id}:pickWinner`
                    ? "Picking..."
                    : "Pick Winner"}
                </button>

                <button
                  type="button"
                  onClick={() => void runRaffleAction(raffle.id, "rerollWinner")}
                  disabled={actionLoadingId !== null}
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/[0.05] disabled:opacity-60"
                >
                  {actionLoadingId === `${raffle.id}:rerollWinner`
                    ? "Rerolling..."
                    : "Reroll Winner"}
                </button>

                <button
                  type="button"
                  onClick={() => void runRaffleAction(raffle.id, "clearWinner")}
                  disabled={actionLoadingId !== null}
                  className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 disabled:opacity-60"
                >
                  {actionLoadingId === `${raffle.id}:clearWinner`
                    ? "Clearing..."
                    : "Clear Winner"}
                </button>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10">
                <div className="grid grid-cols-[minmax(0,1.4fr)_120px_140px_180px] gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-3 text-xs uppercase tracking-[0.2em] text-silver/55">
                  <div>User</div>
                  <div>Entries</div>
                  <div>Total Spent</div>
                  <div>Last Entered</div>
                </div>

                {raffle.entrants.length > 0 ? (
                  raffle.entrants.map((entrant) => (
                    <div
                      key={`${raffle.id}-${entrant.userId}`}
                      className="grid grid-cols-[minmax(0,1.4fr)_120px_140px_180px] gap-3 border-b border-white/5 px-4 py-3 text-sm last:border-b-0"
                    >
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-white">
                          {entrant.displayName}
                        </div>
                        <div className="truncate text-xs text-silver/55">
                          {entrant.kickUsername ? `@${entrant.kickUsername}` : entrant.userId}
                        </div>
                      </div>

                      <div className="text-white">{entrant.entryCount}</div>

                      <div className="text-white">
                        {entrant.totalSpent.toLocaleString()} {raffle.entryCurrency}
                      </div>

                      <div className="text-silver/70">
                        {new Date(entrant.lastEnteredAt).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-5 text-sm text-silver/60">
                    No entrants yet.
                  </div>
                )}
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <div className="text-[10px] uppercase tracking-[0.24em] text-silver/45">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}