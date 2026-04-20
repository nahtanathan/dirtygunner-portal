"use client";

import { useEffect, useState } from "react";

export type MeUser = {
  id?: string;
  kickUserId?: string | number | null;
  kickUsername?: string | null;
  email?: string | null;
  avatar?: string | null;
  points?: number;
  isAdmin: boolean;
};

export type SiteSettings = {
  kickUrl: string;
  discordUrl: string;
  youtubeUrl: string;
  xUrl: string;
  instagramUrl: string;
};

type SiteSettingsResponse = {
  settings?: Partial<SiteSettings> | null;
};

type MeResponse = {
  user?: MeUser | null;
};

export const EMPTY_SITE_SETTINGS: SiteSettings = {
  kickUrl: "",
  discordUrl: "",
  youtubeUrl: "",
  xUrl: "",
  instagramUrl: "",
};

function normalizeHref(value?: string | null) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : "";
}

export function normalizeSiteSettings(
  settings?: Partial<SiteSettings> | null,
): SiteSettings {
  return {
    kickUrl: normalizeHref(settings?.kickUrl),
    discordUrl: normalizeHref(settings?.discordUrl),
    youtubeUrl: normalizeHref(settings?.youtubeUrl),
    xUrl: normalizeHref(settings?.xUrl),
    instagramUrl: normalizeHref(settings?.instagramUrl),
  };
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(EMPTY_SITE_SETTINGS);

  useEffect(() => {
    let mounted = true;

    async function loadSiteSettings() {
      try {
        const res = await fetch("/api/site-settings", {
          method: "GET",
          cache: "no-store",
        });

        const data = (await res.json()) as SiteSettingsResponse;

        if (!mounted) {
          return;
        }

        setSettings(normalizeSiteSettings(data?.settings));
      } catch {
        if (!mounted) {
          return;
        }

        setSettings(EMPTY_SITE_SETTINGS);
      }
    }

    void loadSiteSettings();

    return () => {
      mounted = false;
    };
  }, []);

  return settings;
}

export function useMeUser() {
  const [user, setUser] = useState<MeUser | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
        });

        const data = (await res.json()) as MeResponse;

        if (!mounted) {
          return;
        }

        setUser(data?.user ?? null);
      } catch {
        if (!mounted) {
          return;
        }

        setUser(null);
      }
    }

    void loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  return user;
}
