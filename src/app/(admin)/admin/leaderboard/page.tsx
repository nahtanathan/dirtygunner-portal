"use client";

import { useEffect, useState } from "react";
import { PageHero } from "@/components/ui/PageHero";

type PrizeTier = {
  place: number;
  prize: number;
};

type LeaderboardSettingsShape = {
  title: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  countdownTarget: string;
  prizeTiers: PrizeTier[];
};

const EMPTY_SETTINGS: LeaderboardSettingsShape = {
  title: "",
  subtitle: "",
  startDate: "",
  endDate: "",
  countdownTarget: "",
  prizeTiers: [
    { place: 1, prize: 300 },
    { place: 2, prize: 200 },
    { place: 3, prize: 150 },
  ],
};

export default function AdminLeaderboardPage() {
  const [form, setForm] = useState<LeaderboardSettingsShape>(EMPTY_SETTINGS);
  const [initialForm, setInitialForm] =
    useState<LeaderboardSettingsShape>(EMPTY_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      try {
        setLoading(true);
        setMessage("");

        const res = await fetch("/api/leaderboard-settings", {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error ?? "Failed to load leaderboard settings");
        }

        const nextForm: LeaderboardSettingsShape = {
          title: data.settings?.title ?? "",
          subtitle: data.settings?.subtitle ?? "",
          startDate: data.settings?.startDate ?? "",
          endDate: data.settings?.endDate ?? "",
          countdownTarget: data.settings?.countdownTarget ?? "",
          prizeTiers:
            Array.isArray(data.settings?.prizeTiers) &&
            data.settings.prizeTiers.length > 0
              ? data.settings.prizeTiers
              : EMPTY_SETTINGS.prizeTiers,
        };

        if (!mounted) return;

        setForm(nextForm);
        setInitialForm(nextForm);
      } catch (error) {
        if (!mounted) return;
        setMessage(
          error instanceof Error
            ? error.message
            : "Failed to load leaderboard settings"
        );
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  function updateField(key: keyof LeaderboardSettingsShape, value: string) {
    setForm((prev) => {
      const next = {
        ...prev,
        [key]: value,
      };

      if (key === "endDate") {
        next.countdownTarget = value;
      }

      return next;
    });

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

  function addPrizeTier() {
    setForm((prev) => ({
      ...prev,
      prizeTiers: [
        ...prev.prizeTiers,
        {
          place: prev.prizeTiers.length + 1,
          prize: 0,
        },
      ],
    }));
    setMessage("");
  }

  function removePrizeTier(index: number) {
    const updated = form.prizeTiers
      .filter((_, i) => i !== index)
      .map((tier, i) => ({
        ...tier,
        place: i + 1,
      }));

    setForm((prev) => ({
      ...prev,
      prizeTiers: updated,
    }));
    setMessage("");
  }

  async function handleSave() {
    try {
      setSaving(true);
      setMessage("");

      const payload = {
        title: form.title,
        subtitle: form.subtitle,
        startDate: form.startDate,
        endDate: form.endDate,
        prizeTiers: form.prizeTiers,
      };

      const res = await fetch("/api/leaderboard-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error ?? "Failed to save leaderboard settings");
      }

      const nextForm: LeaderboardSettingsShape = {
        title: data.settings?.title ?? "",
        subtitle: data.settings?.subtitle ?? "",
        startDate: data.settings?.startDate ?? "",
        endDate: data.settings?.endDate ?? "",
        countdownTarget: data.settings?.countdownTarget ?? "",
        prizeTiers:
          Array.isArray(data.settings?.prizeTiers) &&
          data.settings.prizeTiers.length > 0
            ? data.settings.prizeTiers
            : EMPTY_SETTINGS.prizeTiers,
      };

      setForm(nextForm);
      setInitialForm(nextForm);
      setMessage("Leaderboard settings saved.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to save leaderboard settings"
      );
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setForm(initialForm);
    setMessage("Changes reset.");
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <PageHero
          eyebrow="Admin"
          title="Leaderboard Control"
          description="Edit title, timing, and prize values."
        />
        <div className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
          <div className="h-48 animate-pulse rounded-2xl bg-white/5" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Admin"
        title="Leaderboard Control"
        description="Edit title, start time, end time, and payout structure."
      />

      <section className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Leaderboard Title
            </label>
            <input
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-white/20"
              placeholder="Weekly Roobet Race"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Leaderboard Subtitle
            </label>
            <input
              value={form.subtitle}
              onChange={(e) => updateField("subtitle", e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-white/20"
              placeholder="Top grinders earn premium payouts before the weekly reset."
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Start Time
            </label>
            <input
              type="datetime-local"
              value={form.startDate}
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
              value={form.endDate}
              onChange={(e) => updateField("endDate", e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/20"
            />
          </div>

          <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Countdown Target
            </div>
            <div className="mt-2 text-sm font-medium text-white">
              {form.endDate || "Not set"}
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              Countdown is always tied directly to the end time.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white">Prize Tiers</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Add as many payout positions as you need.
            </p>
          </div>

          <button
            type="button"
            onClick={addPrizeTier}
            className="inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:opacity-90"
          >
            + Add Tier
          </button>
        </div>

        <div className="space-y-3">
          {form.prizeTiers.map((tier, index) => (
            <div
              key={tier.place}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"
            >
              <div className="w-[64px] shrink-0 text-base font-bold text-white">
                #{tier.place}
              </div>

              <div className="flex-1">
                <input
                  type="number"
                  min={0}
                  value={tier.prize}
                  onChange={(e) =>
                    updatePrize(index, Number(e.target.value) || 0)
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-white/20"
                  placeholder="0"
                />
              </div>

              {form.prizeTiers.length > 1 ? (
                <button
                  type="button"
                  onClick={() => removePrizeTier(index)}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 px-4 text-sm font-semibold text-red-200 transition hover:border-red-500/30 hover:bg-red-500/15"
                >
                  Remove
                </button>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save leaderboard"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={saving}
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Reset
          </button>

          {message ? <span className="text-sm text-zinc-300">{message}</span> : null}
        </div>
      </section>
    </div>
  );
}