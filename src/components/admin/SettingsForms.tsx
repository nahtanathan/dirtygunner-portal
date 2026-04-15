"use client";

import { useEffect, useMemo, useState } from "react";

type SiteSettingsShape = {
  kickUrl: string;
  discordUrl: string;
  youtubeUrl: string;
  xUrl: string;
  instagramUrl: string;
};

const EMPTY_SETTINGS: SiteSettingsShape = {
  kickUrl: "",
  discordUrl: "",
  youtubeUrl: "",
  xUrl: "",
  instagramUrl: "",
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
          xUrl: data.settings?.xUrl ?? "",
          instagramUrl: data.settings?.instagramUrl ?? "",
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
        xUrl: data.settings?.xUrl ?? "",
        instagramUrl: data.settings?.instagramUrl ?? "",
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
      xUrl: form.xUrl.trim(),
      instagramUrl: form.instagramUrl.trim(),
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

          <Field label="X URL">
            <input
              value={form.xUrl}
              onChange={(e) => updateField("xUrl", e.target.value)}
              className={inputClassName}
              placeholder="https://x.com/dirtygunner"
            />
          </Field>

          <Field label="Instagram URL">
            <input
              value={form.instagramUrl}
              onChange={(e) => updateField("instagramUrl", e.target.value)}
              className={inputClassName}
              placeholder="https://instagram.com/dirtygunner"
            />
          </Field>
        </div>

        {message ? (
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
            {message}
          </div>
        ) : null}
      </section>

      <section className="rounded-3xl border border-white/10 bg-black/30 p-5 backdrop-blur-xl sm:p-6">
        <div className="mb-4 min-w-0">
          <h3 className="truncate text-lg font-semibold text-white sm:text-xl">
            Preview
          </h3>
          <p className="truncate-3 mt-1 text-sm leading-6 text-zinc-400">
            These are the exact values the site will use.
          </p>
        </div>

        <div className="grid gap-3 text-sm md:grid-cols-2 xl:grid-cols-5">
          <PreviewCard label="Kick" value={preview.kickUrl || "Not set"} />
          <PreviewCard label="Discord" value={preview.discordUrl || "Not set"} />
          <PreviewCard label="YouTube" value={preview.youtubeUrl || "Not set"} />
          <PreviewCard label="X" value={preview.xUrl || "Not set"} />
          <PreviewCard label="Instagram" value={preview.instagramUrl || "Not set"} />
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
    <label className="grid gap-2">
      <span className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/45">
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
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-white/40">
        {label}
      </div>
      <div className="mt-2 truncate text-sm text-white/85">{value}</div>
    </div>
  );
}