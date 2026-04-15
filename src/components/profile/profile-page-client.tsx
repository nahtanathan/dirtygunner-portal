// FILE: src/components/profile/profile-page-client.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ProfileUser = {
  id: string;
  kick_user_id?: string | null;
  kick_username?: string | null;
  email?: string | null;
  avatar?: string | null;
  points: number;
  display_name?: string | null;
  bio?: string | null;
  profile_accent?: string | null;
  isAdmin: boolean;
  isKickBroadcaster: boolean;
  createdAt: string;
  updatedAt: string;
};

type FormState = {
  display_name: string;
  bio: string;
  profile_accent: string;
};

export function ProfilePageClient() {
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [form, setForm] = useState<FormState>({
    display_name: "",
    bio: "",
    profile_accent: "#7d5cff",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function loadProfile() {
    try {
      setLoading(true);
      setMessage(null);

      const res = await fetch("/api/profile", {
        method: "GET",
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error ?? "Failed to load profile");
      }

      const loadedUser = data.user as ProfileUser;

      setUser(loadedUser);
      setForm({
        display_name: loadedUser.display_name ?? "",
        bio: loadedUser.bio ?? "",
        profile_accent: loadedUser.profile_accent ?? "#7d5cff",
      });
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProfile();
  }, []);

  const accentColor = form.profile_accent || "#7d5cff";

  const accentStyle = useMemo(
    () => ({
      boxShadow: `0 0 0 1px ${accentColor}20 inset`,
      borderColor: `${accentColor}33`,
    }),
    [accentColor],
  );

  async function handleSave() {
    try {
      setSaving(true);
      setMessage(null);

      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error ?? "Failed to save profile");
      }

      setUser(data.user);
      setMessage("Profile updated.");
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="h-40 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-red-200">
          Failed to load profile.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <div className="mb-8 flex min-w-0 items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex h-10 max-w-full items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-[#0d0d11] px-4 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-[#121218]"
        >
          <span className="text-white/60">←</span>
          <span className="truncate">Home</span>
        </Link>

        <div className="shrink-0 whitespace-nowrap text-sm text-zinc-500">Profile</div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <section
          className="min-w-0 rounded-3xl border bg-black/30 p-5 backdrop-blur-xl sm:p-6"
          style={accentStyle}
        >
          <div className="flex min-w-0 items-start gap-4">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/10">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.kick_username || "Profile"}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white/10 text-2xl font-bold text-white">
                  {(user.kick_username?.[0] || "U").toUpperCase()}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-2xl font-bold text-white">
                {user.display_name || user.kick_username || "User"}
              </h1>
              <p className="truncate text-sm text-zinc-400">
                @{user.kick_username || "unknown"}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {user.isAdmin ? (
                  <span className="inline-flex max-w-full rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
                    <span className="truncate whitespace-nowrap">Admin</span>
                  </span>
                ) : null}

                {user.isKickBroadcaster ? (
                  <span className="inline-flex max-w-full rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-semibold text-violet-200">
                    <span className="truncate whitespace-nowrap">Broadcaster</span>
                  </span>
                ) : null}

                <span className="inline-flex max-w-full rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                  <span className="truncate whitespace-nowrap">
                    {user.points.toLocaleString()} Bullets
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4 text-sm">
            <ProfileInfoCard label="Kick User ID" value={user.kick_user_id || "Not connected"} />
            <ProfileInfoCard label="Email" value={user.email || "No email available"} />
            <ProfileInfoCard
              label="Joined"
              value={new Date(user.createdAt).toLocaleDateString()}
            />
          </div>
        </section>

        <section className="min-w-0 rounded-3xl border border-white/10 bg-black/30 p-5 backdrop-blur-xl sm:p-6">
          <div className="mb-6 min-w-0">
            <h2 className="truncate text-xl font-bold text-white">Profile Settings</h2>
            <p className="truncate-3 mt-1 text-sm leading-6 text-zinc-400">
              Edit your local profile details. Your Kick username and Kick avatar
              stay synced from Kick login.
            </p>
          </div>

          <div className="grid gap-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Display name
              </label>
              <input
                value={form.display_name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, display_name: e.target.value }))
                }
                maxLength={40}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-white/20"
                placeholder="How your profile should display"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Bio
              </label>
              <textarea
                value={form.bio}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, bio: e.target.value }))
                }
                maxLength={240}
                rows={5}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-white/20"
                placeholder="Write a short bio"
              />
              <div className="mt-2 text-xs text-zinc-500">{form.bio.length}/240</div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Accent color
              </label>

              <div className="flex min-w-0 items-center gap-3">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      profile_accent: e.target.value,
                    }))
                  }
                  className="h-12 w-16 shrink-0 cursor-pointer rounded-xl border border-white/10 bg-transparent p-1"
                />

                <input
                  value={form.profile_accent}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      profile_accent: e.target.value,
                    }))
                  }
                  className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-white/20"
                  placeholder="#7d5cff"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-3 text-sm font-medium text-zinc-300">Preview</div>

              <div
                className="inline-flex max-w-full min-w-0 items-center gap-3 rounded-full border bg-[#0d0d11] px-3 pr-4 text-white"
                style={{
                  borderColor: `${accentColor}55`,
                  boxShadow: `0 0 0 1px ${accentColor}20 inset`,
                }}
              >
                <span className="relative block h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-white/10">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.kick_username || "Profile"}
                      fill
                      sizes="28px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-white/10 text-xs font-bold text-white">
                      {(user.kick_username?.[0] || "U").toUpperCase()}
                    </span>
                  )}
                </span>

                <span className="min-w-0 max-w-[140px] truncate text-sm font-semibold text-white sm:max-w-[180px]">
                  {form.display_name || user.kick_username || "Connected"}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saving}
                className="inline-flex h-12 max-w-full items-center justify-center whitespace-nowrap rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="truncate">{saving ? "Saving..." : "Save profile"}</span>
              </button>

              <button
                type="button"
                onClick={() => void loadProfile()}
                disabled={saving}
                className="inline-flex h-12 max-w-full items-center justify-center whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span className="truncate">Reset</span>
              </button>

              {message ? (
                <span className="truncate-2 text-sm text-zinc-300">{message}</span>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ProfileInfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">{label}</div>
      <div className="mt-1 truncate text-sm font-medium text-white sm:text-base">
        {value}
      </div>
    </div>
  );
}