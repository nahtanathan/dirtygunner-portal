// FILE: src/app/admin/page.tsx

"use client";

import { useEffect, useState } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { AdminResourceManager } from "@/components/admin/AdminResourceManager";
import { z } from "zod";
import { Raffle } from "@/lib/types";

export default function AdminPage() {
  const [raffles, setRaffles] = useState<Raffle[]>([]);

  // ✅ load from Prisma (NOT Zustand)
  useEffect(() => {
    fetch("/api/raffles")
      .then((res) => res.json())
      .then(setRaffles);
  }, []);

  const raffleSchema = z.object({
    id: z.string(),
    title: z.string().min(1),
    description: z.string().optional(),
    status: z.enum(["active", "ended"]),
    entryMethod: z.string(),
    totalEntries: z.number(),
    startDate: z.string(),
    endDate: z.string(),
    prizeDetails: z.string(),
    winner: z.string().optional().nullable(),
    image: z.string().optional().nullable(),
  });

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Admin"
        title="DirtyGunner Control Panel"
        description="Manage raffles, leaderboard, and challenges."
      />

      {/* ✅ STATS (now real data) */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <AdminStatCard
          label="Active Raffles"
          value={String(raffles.filter((r) => r.status === "active").length)}
        />
        <AdminStatCard
          label="Total Raffles"
          value={String(raffles.length)}
        />
      </div>

      {/* 🔥 THIS IS THE IMPORTANT PART */}
      <AdminResourceManager<Raffle>
        title="Raffles"
        description="Create and manage raffles"
        items={raffles}
        schema={raffleSchema}
        emptyValue={{
          id: crypto.randomUUID(),
          title: "",
          description: "",
          status: "active",
          entryMethod: "Join for Free",
          totalEntries: 0,
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
          prizeDetails: "",
          winner: null,
          image: "",
        }}
        fields={[
          { name: "title", label: "Title" },
          { name: "description", label: "Description", type: "textarea" },
          { name: "status", label: "Status", type: "select", options: ["active", "ended"] },
          { name: "entryMethod", label: "Button Text" },
          { name: "totalEntries", label: "Entries", type: "number" },
          { name: "startDate", label: "Start Date", type: "datetime-local" },
          { name: "endDate", label: "End Date", type: "datetime-local" },
          { name: "prizeDetails", label: "Prize" },
          { name: "image", label: "Image URL", type: "url" },
        ]}
        onSave={async (raffle) => {
          await fetch("/api/raffles", {
            method: "POST",
            body: JSON.stringify(raffle),
          });

          const updated = await fetch("/api/raffles").then((r) => r.json());
          setRaffles(updated);
        }}
        onDelete={async (id) => {
          await fetch("/api/raffles", {
            method: "DELETE",
            body: JSON.stringify({ id }),
          });

          setRaffles((prev) => prev.filter((r) => r.id !== id));
        }}
        renderMeta={(r) => `${r.status} • ${r.totalEntries} entries`}
      />
    </div>
  );
}