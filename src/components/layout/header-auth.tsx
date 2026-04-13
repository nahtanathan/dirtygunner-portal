"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type MeUser = {
  id: string;
  kickUserId?: string | null;
  kickUsername?: string | null;
  email?: string | null;
  avatar?: string | null;
  points: number;
  isAdmin: boolean;
};

export function HeaderAuth() {
  const [user, setUser] = useState<MeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadMe() {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json();

        if (!mounted) return;
        setUser(data?.user ?? null);
      } catch {
        if (!mounted) return;
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadMe();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleLogout() {
    try {
      setLoggingOut(true);

      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Logout failed");
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
      setLoggingOut(false);
    }
  }

  if (loading) {
    return (
      <div className="h-11 w-28 animate-pulse rounded-full border border-white/10 bg-white/5" />
    );
  }

  if (!user) {
    return (
      <a
        href="/api/auth/kick/login"
        className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
      >
        Login with Kick
      </a>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {/* 🔥 BULLETS (IMAGE VERSION) */}
      <div className="inline-flex h-11 items-center gap-1.5 rounded-full border border-white/10 bg-[#0d0d11] px-3.5 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]">
        <Image
          src="/images/bullet.png"
          alt="bullets"
          width={40}
          height={40}
          className="rotate-[-10deg] object-contain drop-shadow-[0_0_6px_rgba(255,215,0,0.5)]"
        />
        <span>{user.points.toLocaleString()}</span>
      </div>

      {/* PROFILE */}
      <a
        href="/profile"
        className="inline-flex h-11 items-center gap-3 rounded-full border border-white/10 bg-[#0d0d11] px-3 pr-4 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset] transition hover:border-white/20 hover:bg-[#121218]"
      >
        <span className="relative block h-7 w-7 overflow-hidden rounded-full ring-1 ring-white/10">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.kickUsername || "Profile"}
              fill
              sizes="28px"
              className="object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-white/10 text-xs font-bold text-white">
              {(user.kickUsername?.[0] || "U").toUpperCase()}
            </span>
          )}
        </span>

        <span className="max-w-[120px] truncate text-sm font-semibold text-white">
          {user.kickUsername || "Connected"}
        </span>
      </a>

      {/* LOGOUT */}
      <button
        type="button"
        onClick={() => void handleLogout()}
        disabled={loggingOut}
        className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loggingOut ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}