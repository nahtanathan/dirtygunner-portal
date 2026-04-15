// FILE: src/app/(admin)/admin/leaderboard/page.tsx
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

const inputClassName =
  "h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/20 focus:bg-white/[0.05]";

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
            : "Failed to load leaderboard settings",
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
          : "Failed to save leaderboard settings",
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
        <div className="rounded-3xl border border-white/10 bg-black/30 p-5 backdrop-blur-xl sm:p-6">
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

      <section className="rounded-3xl border border-white/10 bg-black/30 p-5 backdrop-blur-xl sm:p-6">
        <div className="mb-6 flex min-w-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold text-white sm:text-2xl">
              Event Copy & Timing
            </h2>
            <p className="truncate-3 mt-1 max-w-2xl text-sm leading-6 text-zinc-400">
              These values drive the public leaderboard heading and countdown.
              The countdown target always follows the end time.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              className="inline-flex h-12 min-w-0 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="truncate whitespace-nowrap">
                {saving ? "Saving..." : "Save leaderboard"}
              </span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={saving}
              className="inline-flex h-12 min-w-0 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="truncate whitespace-nowrap">Reset</span>
            </button>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Leaderboard Title">
              <input
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                className={inputClassName}
                placeholder="Weekly Roobet Race"
              />
            </Field>

            <Field label="Leaderboard Subtitle">
              <input
                value={form.subtitle}
                onChange={(e) => updateField("subtitle", e.target.value)}
                className={inputClassName}
                placeholder="Top grinders earn premium payouts before the weekly reset."
              />
            </Field>

            <Field label="Start Time">
              <input
                type="datetime-local"
                value={form.startDate}
                onChange={(e) => updateField("startDate", e.target.value)}
                className={inputClassName}
              />
            </Field>

            <Field label="End Time">
              <input
                type="datetime-local"
                value={form.endDate}
                onChange={(e) => updateField("endDate", e.target.value)}
                className={inputClassName}
              />
            </Field>
          </div>

          <div className="min-w-0 rounded-[24px] border border-white/10 bg-white/[0.03] p-4 sm:p-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
              Countdown Target
            </div>

            <div className="mt-3 truncate text-base font-semibold text-white sm:text-lg">
              {form.endDate || "Not set"}
            </div>

            <p className="truncate-3 mt-3 text-sm leading-6 text-zinc-400">
              This display is locked to the end time so the public countdown
              never drifts from the configured event end.
            </p>

            {message ? (
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-200">
                <span className="truncate-2">{message}</span>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-black/30 p-5 backdrop-blur-xl sm:p-6">
        <div className="mb-5 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold text-white sm:text-2xl">
              Prize Tiers
            </h2>
            <p className="truncate-3 mt-1 max-w-2xl text-sm leading-6 text-zinc-400">
              Add as many payout positions as needed. Values stay aligned and
              stop reflowing awkwardly across widths.
            </p>
          </div>

          <button
            type="button"
            onClick={addPrizeTier}
            className="inline-flex h-11 min-w-0 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:opacity-90"
          >
            <span className="truncate whitespace-nowrap">+ Add Tier</span>
          </button>
        </div>

        <div className="space-y-3">
          {form.prizeTiers.map((tier, index) => (
            <div
              key={tier.place}
              className="grid min-w-0 grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 sm:grid-cols-[72px_minmax(0,1fr)_auto] sm:items-center"
            >
              <div className="whitespace-nowrap text-base font-bold text-white">
                #{tier.place}
              </div>

              <div className="min-w-0">
                <input
                  type="number"
                  min={0}
                  value={tier.prize}
                  onChange={(e) =>
                    updatePrize(index, Number(e.target.value) || 0)
                  }
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-white outline-none transition placeholder:text-zinc-500 focus:border-white/20"
                  placeholder="0"
                />
              </div>

              {form.prizeTiers.length > 1 ? (
                <button
                  type="button"
                  onClick={() => removePrizeTier(index)}
                  className="inline-flex h-10 min-w-0 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10 px-4 text-sm font-semibold text-red-200 transition hover:border-red-500/30 hover:bg-red-500/15"
                >
                  <span className="truncate whitespace-nowrap">Remove</span>
                </button>
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-6 flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="inline-flex h-12 min-w-0 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="truncate whitespace-nowrap">
              {saving ? "Saving..." : "Save leaderboard"}
            </span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={saving}
            className="inline-flex h-12 min-w-0 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="truncate whitespace-nowrap">Reset</span>
          </button>

          {message ? (
            <span className="truncate-2 text-sm text-zinc-300">{message}</span>
          ) : null}
        </div>
      </section>
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
    <label className="block min-w-0 space-y-2">
      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
        {label}
      </span>
      {children}
    </label>
  );
}