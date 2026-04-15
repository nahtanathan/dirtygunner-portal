// FILE: src/components/navigation/AppSidebar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import {
  ChevronRight,
  ExternalLink,
  FileCheck,
  Flame,
  Gift,
  Home,
  LayoutDashboard,
  Settings,
  Shield,
  Target,
  Trophy,
} from "lucide-react";
import { useAdminStore } from "@/store/admin-store";

type MeUser = {
  isAdmin: boolean;
};

type SiteSettings = {
  kickUrl?: string;
  discordUrl?: string;
  youtubeUrl?: string;
};

const baseNavItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Raffles", href: "/raffles", icon: Gift },
  { name: "Challenges", href: "/challenges", icon: Target },
  { name: "Bonus Hunts", href: "/bonus-hunts", icon: Flame },
];

const adminNavItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "Leaderboard", href: "/admin/leaderboard", icon: Trophy },
  { name: "Raffles", href: "/admin/raffles", icon: Gift },
  { name: "Challenges", href: "/admin/challenges", icon: Target },
  { name: "Challenge Claims", href: "/admin/challenge-claims", icon: FileCheck },
  { name: "Bonus Hunts", href: "/admin/bonus-hunts", icon: Flame },
];

function isPathActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AppSidebar() {
  const pathname = usePathname();
  const siteSettings = useAdminStore(
    (state) => state.siteSettings,
  ) as SiteSettings;
  const [user, setUser] = useState<MeUser | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
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
      }
    }

    void loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  const navItems = useMemo(() => {
    if (!user?.isAdmin) {
      return baseNavItems;
    }

    return [...baseNavItems, { name: "Admin", href: "/admin", icon: Shield }];
  }, [user]);

  const showAdminTree = Boolean(user?.isAdmin);
  const adminSectionActive =
    pathname === "/admin" || pathname.startsWith("/admin/");
  const kickUrl = siteSettings?.kickUrl?.trim() || "#";
  const discordUrl = siteSettings?.discordUrl?.trim() || "#";
  const youtubeUrl = siteSettings?.youtubeUrl?.trim() || "#";

  return (
    <div
      className="flex h-screen w-[300px] min-w-0 flex-col border-r"
      style={{
        background: "linear-gradient(180deg, var(--bg-sidebar) 0%, #0b0f14 100%)",
        borderColor: "var(--border-subtle)",
      }}
    >
      <div className="flex-shrink-0 px-5 pb-5 pt-6">
        <Link
          href="/"
          className="group flex min-w-0 items-center rounded-2xl border px-3 py-3 transition-all duration-200"
          style={{
            borderColor: "var(--border-subtle)",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <SidebarBrandMark />
        </Link>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-5 premium-scrollbar">
        <div className="pb-6">
          <div className="mb-3 px-1 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/40">
            Navigation
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isPathActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "group relative flex min-w-0 items-center gap-3 overflow-hidden rounded-2xl border px-3 py-3 text-sm font-medium transition-all duration-200",
                    isActive && "shadow-[0_0_20px_rgba(109,143,179,0.08)]",
                  )}
                  style={{
                    borderColor: isActive
                      ? "rgba(167,177,191,0.18)"
                      : "transparent",
                    background: isActive
                      ? "linear-gradient(90deg, rgba(255,255,255,0.055), rgba(109,143,179,0.06))"
                      : "transparent",
                    color: isActive
                      ? "rgba(255,255,255,0.96)"
                      : "rgba(255,255,255,0.70)",
                  }}
                >
                  {isActive && (
                    <span
                      className="absolute inset-y-2 left-0 w-[3px] rounded-full"
                      style={{ background: "var(--accent-primary)" }}
                    />
                  )}

                  <Icon
                    className={clsx(
                      "h-4 w-4 shrink-0 transition-transform duration-200",
                      isActive ? "text-white/85" : "text-white/55",
                    )}
                  />

                  <span className="min-w-0 flex-1 truncate whitespace-nowrap">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        {showAdminTree && (
          <div className="pb-6">
            <div className="mb-3 flex items-center gap-2 px-1 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/40">
              <Shield className="h-3.5 w-3.5 shrink-0 text-white/60" />
              <span className="truncate whitespace-nowrap">Admin</span>
            </div>

            <div
              className="overflow-hidden rounded-2xl border p-2"
              style={{
                borderColor: adminSectionActive
                  ? "rgba(167,177,191,0.14)"
                  : "rgba(255,255,255,0.06)",
                background: adminSectionActive
                  ? "linear-gradient(180deg, rgba(255,255,255,0.035), rgba(109,143,179,0.03))"
                  : "rgba(255,255,255,0.02)",
              }}
            >
              <div className="space-y-1">
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isPathActive(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group flex min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200"
                      style={{
                        background: isActive
                          ? "rgba(255,255,255,0.06)"
                          : "transparent",
                        color: isActive
                          ? "rgba(255,255,255,0.96)"
                          : "rgba(255,255,255,0.68)",
                      }}
                    >
                      <ChevronRight
                        className={clsx(
                          "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                          isActive ? "translate-x-0 text-white/70" : "text-white/30",
                        )}
                      />
                      <Icon
                        className={clsx(
                          "h-4 w-4 shrink-0",
                          isActive ? "text-white/82" : "text-white/45",
                        )}
                      />
                      <span className="min-w-0 flex-1 truncate whitespace-nowrap">
                        {item.name}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-shrink-0 px-5 pb-6 pt-4">
        <div className="mb-3 px-1 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/40">
          Stream
        </div>

        <div className="space-y-2">
          <Link
            href={kickUrl}
            target={kickUrl === "#" ? undefined : "_blank"}
            rel={kickUrl === "#" ? undefined : "noreferrer"}
            className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-white/5"
            style={{
              borderColor: "var(--border-subtle)",
              background: "rgba(255,255,255,0.02)",
              color: "rgba(255,255,255,0.9)",
            }}
          >
            <span className="min-w-0 truncate whitespace-nowrap">Watch on Kick</span>
            <ExternalLink className="h-4 w-4 shrink-0 text-white/55" />
          </Link>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={discordUrl}
              target={discordUrl === "#" ? undefined : "_blank"}
              rel={discordUrl === "#" ? undefined : "noreferrer"}
              className="flex min-w-0 items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-sm font-medium transition-all duration-200 hover:bg-white/5"
              style={{
                borderColor: "var(--border-subtle)",
                background: "rgba(255,255,255,0.02)",
                color: "rgba(255,255,255,0.82)",
              }}
            >
              <DiscordLogo />
              <span className="truncate whitespace-nowrap">Discord</span>
            </Link>

            <Link
              href={youtubeUrl}
              target={youtubeUrl === "#" ? undefined : "_blank"}
              rel={youtubeUrl === "#" ? undefined : "noreferrer"}
              className="flex min-w-0 items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-sm font-medium transition-all duration-200 hover:bg-white/5"
              style={{
                borderColor: "var(--border-subtle)",
                background: "rgba(255,255,255,0.02)",
                color: "rgba(255,255,255,0.82)",
              }}
            >
              <YouTubeLogo />
              <span className="truncate whitespace-nowrap">YouTube</span>
            </Link>
          </div>
        </div>

        <div className="mt-6 px-1 text-xs text-white/35">
          © 2026 DirtyGunner Live
        </div>
      </div>
    </div>
  );
}

function SidebarBrandMark() {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="relative h-10 w-10 shrink-0">
        <Image
          src="/brand/logo-mark.png"
          alt="DirtyGunner"
          fill
          className="object-contain drop-shadow-[0_0_12px_rgba(139,92,246,0.45)]"
        />
      </div>

      <div className="min-w-0 flex flex-col leading-tight">
        <span className="truncate text-sm font-semibold tracking-wide text-white">
          DIRTYGUNNER
        </span>
        <span className="truncate text-[10px] tracking-widest text-zinc-400">
          CONTROL PANEL
        </span>
      </div>
    </div>
  );
}

function DiscordLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-current" aria-hidden="true">
      <path d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.078.037c-.211.375-.444.864-.608 1.249a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.249.077.077 0 0 0-.078-.037 19.736 19.736 0 0 0-4.885 1.515.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.077.077 0 0 0 .084-.027c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.105 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.04.106c.36.698.772 1.363 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028ZM8.02 15.331c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.175 1.094 2.156 2.418 0 1.334-.955 2.419-2.156 2.419Zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.418 2.157-2.418 1.21 0 2.175 1.094 2.156 2.418 0 1.334-.946 2.419-2.156 2.419Z" />
    </svg>
  );
}

function YouTubeLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-current" aria-hidden="true">
      <path d="M23.498 6.186a2.997 2.997 0 0 0-2.11-2.12C19.52 3.5 12 3.5 12 3.5s-7.52 0-9.388.566a2.997 2.997 0 0 0-2.11 2.12C-.002 8.07-.002 12-.002 12s0 3.93.504 5.814a2.997 2.997 0 0 0 2.11 2.12C4.48 20.5 12 20.5 12 20.5s7.52 0 9.388-.566a2.997 2.997 0 0 0 2.11-2.12c.504-1.884.504-5.814.504-5.814s0-3.93-.504-5.814ZM9.6 15.568V8.432L15.818 12 9.6 15.568Z" />
    </svg>
  );
}