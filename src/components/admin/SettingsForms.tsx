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
          error instanceof Error ? error.message : "Failed to load site settings"
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
        error instanceof Error ? error.message : "Failed to save site settings"
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
    [form]
  );

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
        <div className="h-40 animate-pulse rounded-2xl bg-white/5" />
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Social & Stream Links</h2>
          <p className="mt-1 text-sm text-zinc-400">
            These control the sidebar stream button and social links.
          </p>
        </div>

        <div className="grid gap-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Kick URL
            </label>
            <input
              value={form.kickUrl}
              onChange={(e) => updateField("kickUrl", e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-white/20"
              placeholder="https://kick.com/dirtygunner"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Discord URL
            </label>
            <input
              value={form.discordUrl}
              onChange={(e) => updateField("discordUrl", e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-white/20"
              placeholder="https://discord.gg/your-invite"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              YouTube URL
            </label>
            <input
              value={form.youtubeUrl}
              onChange={(e) => updateField("youtubeUrl", e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-white/20"
              placeholder="https://youtube.com/@dirtygunner"
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white">Preview</h3>
          <p className="mt-1 text-sm text-zinc-400">
            These are the live values the site will use.
          </p>
        </div>

        <div className="grid gap-3 text-sm">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Kick
            </div>
            <div className="mt-1 break-all text-white">
              {preview.kickUrl || "Not set"}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Discord
            </div>
            <div className="mt-1 break-all text-white">
              {preview.discordUrl || "Not set"}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              YouTube
            </div>
            <div className="mt-1 break-all text-white">
              {preview.youtubeUrl || "Not set"}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save settings"}
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