// FILE: src/components/admin/SettingsForms.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type SiteSettingsShape = {
  kickUrl: string;
  discordUrl: string;
  youtubeUrl: string;
};

const EMPTY_SETTINGS: SiteSettingsShape = {
  kickUrl: "",
  discordUrl: "",
  youtubeUrl: "",
};

const inputClassName =
  "h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-white/20 focus:bg-white/[0.05]";

export function SiteSettingsForm() {
  const [form, setForm] = useState<SiteSettingsShape>(EMPTY_SETTINGS);
  const [initialForm, setInitialForm] = useState<SiteSettingsShape>(EMPTY_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      try {
        setLoading(true);
        setMessage("");

        const res = await fetch("/api/site-settings", {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error ?? "Failed to load site settings");
        }

        const nextForm: SiteSettingsShape = {
          kickUrl: data.settings?.kickUrl ?? "",
          discordUrl: data.settings?.discordUrl ?? "",
          youtubeUrl: data.settings?.youtubeUrl ?? "",
        };

        if (!mounted) return;

        setForm(nextForm);
        setInitialForm(nextForm);
      } catch (error) {
        if (!mounted) return;
        setMessage(
          error instanceof Error ? error.message : "Failed to load site settings",
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

  function updateField(key: keyof SiteSettingsShape, value: string) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    setMessage("");
  }

  async function handleSave() {
    try {
      setSaving(true);
      setMessage("");

      const res = await fetch("/api/site-settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error ?? "Failed to save site settings");
      }

      const nextForm: SiteSettingsShape = {
        kickUrl: data.settings?.kickUrl ?? "",
        discordUrl: data.settings?.discordUrl ?? "",
        youtubeUrl: data.settings?.youtubeUrl ?? "",
      };

      setForm(nextForm);
      setInitialForm(nextForm);
      setMessage("Site settings saved.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to save site settings",
      );
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setForm(initialForm);
    setMessage("Changes reset.");
  }

  const preview = useMemo(
    () => ({
      kickUrl: form.kickUrl.trim(),
      discordUrl: form.discordUrl.trim(),
      youtubeUrl: form.youtubeUrl.trim(),
    }),
    [form],
  );

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-black/30 p-5 backdrop-blur-xl sm:p-6">
        <div className="h-40 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border border-white/10 bg-black/30 p-5 backdrop-blur-xl sm:p-6">
        <div className="mb-6 flex min-w-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <h2 className="truncate text-xl font-bold text-white sm:text-2xl">
              Social & Stream Links
            </h2>
            <p className="truncate-3 mt-1 max-w-2xl text-sm leading-6 text-zinc-400">
              These control the sidebar stream button and public social links.
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
                {saving ? "Saving..." : "Save settings"}
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

        <div className="grid gap-5">
          <Field label="Kick URL">
            <input
              value={form.kickUrl}
              onChange={(e) => updateField("kickUrl", e.target.value)}
              className={inputClassName}
              placeholder="https://kick.com/dirtygunner"
            />
          </Field>

          <Field label="Discord URL">
            <input
              value={form.discordUrl}
              onChange={(e) => updateField("discordUrl", e.target.value)}
              className={inputClassName}
              placeholder="https://discord.gg/your-invite"
            />
          </Field>

          <Field label="YouTube URL">
            <input
              value={form.youtubeUrl}
              onChange={(e) => updateField("youtubeUrl", e.target.value)}
              className={inputClassName}
              placeholder="https://youtube.com/@dirtygunner"
            />
          </Field>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-black/30 p-5 backdrop-blur-xl sm:p-6">
        <div className="mb-4 min-w-0">
          <h3 className="truncate text-lg font-semibold text-white sm:text-xl">
            Preview
          </h3>
          <p className="truncate-3 mt-1 text-sm leading-6 text-zinc-400">
            These are the exact values the site will use. Long URLs now truncate
            cleanly instead of wrapping across the card.
          </p>
        </div>

        <div className="grid gap-3 text-sm md:grid-cols-3">
          <PreviewCard label="Kick" value={preview.kickUrl || "Not set"} />
          <PreviewCard label="Discord" value={preview.discordUrl || "Not set"} />
          <PreviewCard label="YouTube" value={preview.youtubeUrl || "Not set"} />
        </div>

        <div className="mt-6 flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="inline-flex h-12 min-w-0 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="truncate whitespace-nowrap">
              {saving ? "Saving..." : "Save settings"}
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

function PreviewCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
      <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </div>
      <div className="mt-2 truncate text-sm font-medium text-white sm:text-base">
        {value}
      </div>
    </div>
  );
}