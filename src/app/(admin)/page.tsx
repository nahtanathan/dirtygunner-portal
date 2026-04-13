"use client";

import { useEffect, useState } from "react";
import { PageHero } from "@/components/ui/PageHero";
import { useAdminStore } from "@/store/admin-store";

type PrizeTier = {
  place: number;
  prize: number;
};

type LeaderboardSettingsShape = {
  title?: string;
  subtitle?: string;
  countdownTarget: string;
  startDate?: string;
  endDate?: string;
  prizeTiers: PrizeTier[];
  [key: string]: unknown;
};

export default function AdminLeaderboardPage() {
  const leaderboardSettings = useAdminStore(
    (state) => state.leaderboardSettings
  ) as LeaderboardSettingsShape;

  const saveLeaderboardSettings = useAdminStore(
    (state) => state.saveLeaderboardSettings
  );

  const [form, setForm] = useState<LeaderboardSettingsShape>(leaderboardSettings);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setForm(leaderboardSettings);
  }, [leaderboardSettings]);

  function updateField(key: keyof LeaderboardSettingsShape, value: unknown) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    setMessage("");
  }

  function updatePrize(index: number, value: number) {
    const updated = [...form.prizeTiers];
    updated[index] = {
      ...updated[index],
      prize: value,
    };

    setForm((prev) => ({
      ...prev,
      prizeTiers: updated,
    }));
    setMessage("");
  }

  function handleSave() {
    saveLeaderboardSettings(form as never);
    setMessage("Leaderboard settings saved.");
  }

  function handleReset() {
    setForm(leaderboardSettings);
    setMessage("Changes reset.");
  }

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Admin"
        title="Leaderboard Control"
        description="Edit title, countdown timing, timeframe, and prize values."
      />

      <section className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Leaderboard Title
            </label>
            <input
              value={typeof form.title === "string" ? form.title : ""}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-white/20"
              placeholder="Weekly Wager Race"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Leaderboard Subtitle
            </label>
            <input
              value={typeof form.subtitle === "string" ? form.subtitle : ""}
              onChange={(e) => updateField("subtitle", e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-white/20"
              placeholder="Top players this cycle"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Start Time
            </label>
            <input
              type="datetime-local"
              value={typeof form.startDate === "string" ? form.startDate : ""}
              onChange={(e) => updateField("startDate", e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              End Time
            </label>
            <input
              type="datetime-local"
              value={typeof form.endDate === "string" ? form.endDate : ""}
              onChange={(e) => updateField("endDate", e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/20"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Countdown Target
            </label>
            <input
              type="datetime-local"
              value={form.countdownTarget}
              onChange={(e) => updateField("countdownTarget", e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/20"
            />
            <p className="mt-2 text-xs text-zinc-500">
              This is the live timer target used on the homepage and leaderboard.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-white">Prize Tiers</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Update payout values shown for the leaderboard cycle.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {form.prizeTiers.map((tier, index) => (
            <div
              key={tier.place}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="mb-2 text-sm font-semibold text-white">
                Place #{tier.place}
              </div>
              <input
                type="number"
                min={0}
                value={tier.prize}
                onChange={(e) => updatePrize(index, Number(e.target.value) || 0)}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-white/20"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:opacity-90"
          >
            Save leaderboard
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
          >
            Reset
          </button>

          {message ? <span className="text-sm text-zinc-300">{message}</span> : null}
        </div>
      </section>
    </div>
  );
}