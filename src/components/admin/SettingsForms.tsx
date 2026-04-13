"use client";

import { useEffect, useState } from "react";
import { useAdminStore } from "@/store/admin-store";

type SiteSettingsShape = {
  kickUrl?: string;
  discordUrl?: string;
  youtubeUrl?: string;
  [key: string]: unknown;
};

export function SiteSettingsForm() {
  const siteSettings = useAdminStore((state) => state.siteSettings) as SiteSettingsShape;
  const saveSiteSettings = useAdminStore((state) => state.saveSiteSettings);

  const [form, setForm] = useState<SiteSettingsShape>(siteSettings);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setForm(siteSettings);
  }, [siteSettings]);

  function updateField(key: keyof SiteSettingsShape, value: string) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    setMessage("");
  }

  function handleSave() {
    saveSiteSettings(form as never);
    setMessage("Site settings saved.");
  }

  function handleReset() {
    setForm(siteSettings);
    setMessage("Changes reset.");
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Social & Stream Links</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Control the sidebar stream and social links.
          </p>
        </div>

        <div className="grid gap-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Kick URL
            </label>
            <input
              value={typeof form.kickUrl === "string" ? form.kickUrl : ""}
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
              value={typeof form.discordUrl === "string" ? form.discordUrl : ""}
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
              value={typeof form.youtubeUrl === "string" ? form.youtubeUrl : ""}
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
            These are the live values used by the site.
          </p>
        </div>

        <div className="grid gap-3 text-sm">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Kick
            </div>
            <div className="mt-1 break-all text-white">
              {typeof form.kickUrl === "string" && form.kickUrl.trim()
                ? form.kickUrl
                : "Not set"}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Discord
            </div>
            <div className="mt-1 break-all text-white">
              {typeof form.discordUrl === "string" && form.discordUrl.trim()
                ? form.discordUrl
                : "Not set"}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              YouTube
            </div>
            <div className="mt-1 break-all text-white">
              {typeof form.youtubeUrl === "string" && form.youtubeUrl.trim()
                ? form.youtubeUrl
                : "Not set"}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:opacity-90"
          >
            Save links
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