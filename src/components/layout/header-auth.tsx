
"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, LogOut, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type MeUser = {
  id: string;
  kickUserId?: string | null;
  kickUsername?: string | null;
  email?: string | null;
  avatar?: string | null;
  points: number;
  isAdmin: boolean;
};

type HeaderAuthProps = {
  mobileCompact?: boolean;
};

export function HeaderAuth({ mobileCompact = false }: HeaderAuthProps) {
  const [user, setUser] = useState<MeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
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
    return mobileCompact ? (
      <div className="h-10 w-[132px] animate-pulse rounded-full border border-white/10 bg-white/5 sm:w-[148px]" />
    ) : (
      <div className="h-11 w-[248px] animate-pulse rounded-full border border-white/10 bg-white/5" />
    );
  }

  if (!user) {
    return (
      <a
        href="/api/auth/kick/login"
        className={
          mobileCompact
            ? "inline-flex h-10 max-w-full items-center justify-center whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10 sm:px-4"
            : "inline-flex h-11 max-w-full items-center justify-center whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
        }
      >
        <span className="truncate">{mobileCompact ? "Login" : "Login with Kick"}</span>
      </a>
    );
  }

  if (mobileCompact) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          className="inline-flex h-10 max-w-[132px] min-w-0 items-center gap-2 rounded-full border border-white/10 bg-[#0d0d11] px-2.5 pr-3 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset] transition hover:border-white/20 hover:bg-[#121218] sm:max-w-[170px]"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-label="Open account menu"
        >
          <span className="inline-flex h-7 shrink-0 items-center gap-1 rounded-full bg-white/[0.04] pl-1 pr-2">
            <Image
              src="/images/bullet.png"
              alt="bullets"
              width={22}
              height={22}
              className="rotate-[-10deg] object-contain drop-shadow-[0_0_6px_rgba(255,215,0,0.45)]"
            />
            <span className="max-w-[42px] truncate text-[11px] font-semibold text-white/90 sm:max-w-[56px]">
              {user.points.toLocaleString()}
            </span>
          </span>

          <span className="relative block h-6 w-6 shrink-0 overflow-hidden rounded-full ring-1 ring-white/10">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.kickUsername || "Profile"}
                fill
                sizes="24px"
                className="object-cover"
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-white/10 text-[10px] font-bold text-white">
                {(user.kickUsername?.[0] || "U").toUpperCase()}
              </span>
            )}
          </span>

          <span className="min-w-0 flex-1 truncate text-sm font-semibold">
            {user.kickUsername || "Profile"}
          </span>

          <ChevronDown
            className={`h-4 w-4 shrink-0 text-white/60 transition-transform ${
              menuOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 top-[calc(100%+10px)] w-[180px] overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d11] p-1.5 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl"
          >
            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              className="flex min-w-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-white/90 transition hover:bg-white/[0.06]"
              role="menuitem"
            >
              <User className="h-4 w-4 shrink-0 text-white/60" />
              <span className="truncate whitespace-nowrap">Profile</span>
            </Link>

            <button
              type="button"
              onClick={() => void handleLogout()}
              disabled={loggingOut}
              className="flex w-full min-w-0 items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-white/90 transition hover:bg-white/[0.06] disabled:cursor-not-allowed disabled:opacity-60"
              role="menuitem"
            >
              <LogOut className="h-4 w-4 shrink-0 text-white/60" />
              <span className="truncate whitespace-nowrap">
                {loggingOut ? "Logging out..." : "Logout"}
              </span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-2 sm:gap-3">
      <div className="inline-flex h-11 max-w-[140px] min-w-0 items-center gap-1.5 rounded-full border border-white/10 bg-[#0d0d11] px-3 text-sm font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset] sm:max-w-none sm:px-3.5">
        <Image
          src="/images/bullet.png"
          alt="bullets"
          width={40}
          height={40}
          className="shrink-0 rotate-[-10deg] object-contain drop-shadow-[0_0_6px_rgba(255,215,0,0.5)]"
        />
        <span className="truncate whitespace-nowrap">{user.points.toLocaleString()}</span>
      </div>

      <a
        href="/profile"
        className="inline-flex h-11 max-w-[180px] min-w-0 items-center gap-3 rounded-full border border-white/10 bg-[#0d0d11] px-3 pr-4 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset] transition hover:border-white/20 hover:bg-[#121218] sm:max-w-[220px]"
      >
        <span className="relative block h-7 w-7 shrink-0 overflow-hidden rounded-full ring-1 ring-white/10">
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

        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-white">
          {user.kickUsername || "Connected"}
        </span>
      </a>

      <button
        type="button"
        onClick={() => void handleLogout()}
        disabled={loggingOut}
        className="inline-flex h-11 max-w-full items-center justify-center whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-3 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
      >
        <span className="truncate">{loggingOut ? "Logging out..." : "Logout"}</span>
      </button>
    </div>
  );
}