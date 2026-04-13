// FILE: src/app/(admin)/admin/page.tsx

"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { PageHero } from "@/components/ui/PageHero";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminResourceManager } from "@/components/admin/AdminResourceManager";
import { Raffle } from "@/lib/types";

const raffleSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["active", "ended"]),
  entryMethod: z.string().min(1),
  totalEntries: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  prizeDetails: z.string().min(1),
  winner: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
});

function createEmptyRaffle(): Raffle {
  return {
    id: crypto.randomUUID(),
    title: "",
    description: "",
    status: "active",
    entryMethod: "Join for Free",
    totalEntries: 0,
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16),
    prizeDetails: "",
    winner: null,
    image: "",
  };
}

export default function AdminPage() {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [emptyRaffle, setEmptyRaffle] = useState<Raffle>(createEmptyRaffle());

  useEffect(() => {
    void loadRaffles();
  }, []);

  async function loadRaffles() {
    const res = await fetch("/api/raffles", { cache: "no-store" });
    const data = await res.json();
    setRaffles(Array.isArray(data) ? data : []);
  }

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Admin"
        title="DirtyGunner Control Panel"
        description="Manage raffles, leaderboard settings, and live site content."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <AdminStatCard
          label="Active Raffles"
          value={String(raffles.filter((item) => item.status === "active").length)}
        />
        <AdminStatCard label="Total Raffles" value={String(raffles.length)} />
        <AdminStatCard
          label="Backend Status"
          value="Prisma Live"
          subtext="Raffles now persist through the database."
        />
      </div>

      <AdminResourceManager<Raffle>
        title="Raffles"
        description="Create and manage raffles"
        items={raffles}
        schema={raffleSchema}
        emptyValue={emptyRaffle}
        fields={[
          { name: "title", label: "Title" },
          { name: "description", label: "Description", type: "textarea" },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: ["active", "ended"],
          },
          { name: "entryMethod", label: "Button Text" },
          { name: "totalEntries", label: "Entries", type: "number" },
          { name: "startDate", label: "Start Date", type: "datetime-local" },
          { name: "endDate", label: "End Date", type: "datetime-local" },
          { name: "prizeDetails", label: "Prize Details" },
          { name: "winner", label: "Winner" },
          { name: "image", label: "Image URL", type: "url" },
        ]}
        onSave={async (raffle) => {
          const payload = {
            ...raffle,
            description: raffle.description || "",
            image: raffle.image || null,
            winner: raffle.winner || null,
            startDate: new Date(raffle.startDate).toISOString(),
            endDate: new Date(raffle.endDate).toISOString(),
          };

          const res = await fetch("/api/raffles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Failed to save raffle");
          }

          await loadRaffles();
          setEmptyRaffle(createEmptyRaffle());
        }}
        onDelete={async (id) => {
          const res = await fetch("/api/raffles", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          });

          if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Failed to delete raffle");
          }

          await loadRaffles();
          setEmptyRaffle(createEmptyRaffle());
        }}
        renderMeta={(item) =>
          `${item.status} • ${item.totalEntries} entries • ends ${new Date(
            item.endDate,
          ).toLocaleString()}`
        }
      />
    </div>
  );
}