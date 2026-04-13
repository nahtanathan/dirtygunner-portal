// FILE: src/lib/data/repository.ts

type JsonValue =
  | Record<string, unknown>
  | unknown[]
  | string
  | number
  | boolean
  | null;

async function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }

  const { headers } = await import("next/headers");
  const headerStore = await headers();

  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  const protocol =
    headerStore.get("x-forwarded-proto") ??
    (host?.includes("localhost") ? "http" : "https");

  if (host) {
    return `${protocol}://${host}`;
  }

  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/+$/, "");
  }

  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL.replace(/\/+$/, "");
  }

  return "http://localhost:3000";
}

async function fetchJson(
  path: string,
  fallback: JsonValue = null,
): Promise<JsonValue> {
  try {
    const baseUrl = await getBaseUrl();
    const url = `${baseUrl}${path}`;

    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) {
        return fallback;
      }

      const body = await res.text().catch(() => "");
      throw new Error(
        `Request failed for ${path}: ${res.status} ${res.statusText} ${body}`,
      );
    }

    return res.json();
  } catch (error) {
    if (fallback !== null) {
      return fallback;
    }

    throw error;
  }
}

export const dataRepository = {
  getSiteSettings: async () => {
    return fetchJson("/api/site-settings", {});
  },

  getLeaderboardSettings: async () => {
    return fetchJson("/api/leaderboard-settings", {});
  },

  getLeaderboardEntries: async () => {
    return fetchJson("/api/leaderboard", []);
  },

  getRaffles: async () => {
    return fetchJson("/api/raffles", []);
  },

  getChallenges: async () => {
    return fetchJson("/api/challenges", []);
  },

  getBonusHunts: async () => {
    return fetchJson("/api/bonus-hunts", []);
  },
};