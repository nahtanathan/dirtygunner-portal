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
    [accentColor]
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
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex h-10 items-center gap-2 rounded-full border border-white/10 bg-[#0d0d11] px-4 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-[#121218]"
        >
          <span className="text-white/60">←</span>
          Home
        </Link>

        <div className="text-sm text-zinc-500">Profile</div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <section
          className="rounded-3xl border bg-black/30 p-6 backdrop-blur-xl"
          style={accentStyle}
        >
          <div className="flex items-start gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl ring-1 ring-white/10">
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

            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold text-white">
                {user.display_name || user.kick_username || "User"}
              </h1>
              <p className="truncate text-sm text-zinc-400">
                @{user.kick_username || "unknown"}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {user.isAdmin ? (
                  <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
                    Admin
                  </span>
                ) : null}

                {user.isKickBroadcaster ? (
                  <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-semibold text-violet-200">
                    Broadcaster
                  </span>
                ) : null}

                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                  {user.points.toLocaleString()} Bullets
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-4 text-sm">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Kick User ID
              </div>
              <div className="mt-1 font-medium text-white">
                {user.kick_user_id || "Not connected"}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Email
              </div>
              <div className="mt-1 font-medium text-white">
                {user.email || "No email available"}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                Joined
              </div>
              <div className="mt-1 font-medium text-white">
                {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Profile Settings</h2>
            <p className="mt-1 text-sm text-zinc-400">
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

              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      profile_accent: e.target.value,
                    }))
                  }
                  className="h-12 w-16 cursor-pointer rounded-xl border border-white/10 bg-transparent p-1"
                />

                <input
                  value={form.profile_accent}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      profile_accent: e.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-zinc-500 focus:border-white/20"
                  placeholder="#7d5cff"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-3 text-sm font-medium text-zinc-300">Preview</div>

              <div
                className="inline-flex items-center gap-3 rounded-full border bg-[#0d0d11] px-3 pr-4 text-white"
                style={{
                  borderColor: `${accentColor}55`,
                  boxShadow: `0 0 0 1px ${accentColor}20 inset`,
                }}
              >
                <span className="relative block h-7 w-7 overflow-hidden rounded-full ring-1 ring-white/10">
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

                <span className="max-w-[120px] truncate text-sm font-semibold text-white">
                  {form.display_name || user.kick_username || "Connected"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saving}
                className="inline-flex h-12 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save profile"}
              </button>

              <button
                type="button"
                onClick={() => void loadProfile()}
                disabled={saving}
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Reset
              </button>

              {message ? <span className="text-sm text-zinc-300">{message}</span> : null}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}