// FILE: src/components/navigation/MobileNav.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  ChevronRight,
  ExternalLink,
  Flame,
  Gift,
  Home,
  LayoutDashboard,
  Menu,
  Settings,
  Shield,
  Target,
  Trophy,
  X,
} from "lucide-react";
import { useAdminStore } from "@/store/admin-store";
import { HeaderAuth } from "@/components/layout/header-auth";

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
  { name: "Bonus Hunts", href: "/admin/bonus-hunts", icon: Flame },
];

function isPathActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<MeUser | null>(null);
  const siteSettings = useAdminStore(
    (state) => state.siteSettings,
  ) as SiteSettings;

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

  const kickUrl = siteSettings?.kickUrl?.trim() || "#";
  const discordUrl = siteSettings?.discordUrl?.trim() || "#";
  const youtubeUrl = siteSettings?.youtubeUrl?.trim() || "#";

  return (
    <>
      <div
        className="sticky top-0 z-40 border-b px-4 py-3 backdrop-blur-xl sm:px-6"
        style={{
          borderColor: "rgba(255,255,255,0.08)",
          background: "rgba(6,10,20,0.82)",
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="min-w-0 flex-1 overflow-hidden">
            <SidebarBrandMark />
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            <HeaderAuth mobileCompact />

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition-all duration-200"
              style={{
                borderColor: "rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.92)",
              }}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() => setOpen(false)}
          style={{ background: "rgba(2,6,14,0.72)" }}
        >
          <div
            className="h-full w-[88vw] max-w-[360px] border-r px-4 py-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            style={{
              borderColor: "rgba(255,255,255,0.08)",
              background:
                "linear-gradient(180deg, rgba(7,12,24,0.98) 0%, rgba(6,10,20,0.96) 100%)",
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <Link href="/" className="min-w-0" onClick={() => setOpen(false)}>
                <SidebarBrandMark />
              </Link>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border"
                style={{
                  borderColor: "rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                }}
                aria-label="Close menu"
              >
                <X className="h-4 w-4 text-white/80" />
              </button>
            </div>

            <div className="mt-7">
              <div className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/40">
                Navigation
              </div>

              <div className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isPathActive(pathname, item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={clsx(
                        "flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-200",
                        isActive && "shadow-[0_0_24px_rgba(56,189,248,0.12)]",
                      )}
                      style={{
                        background: isActive
                          ? "linear-gradient(90deg, rgba(56,189,248,0.13), rgba(59,130,246,0.05))"
                          : "transparent",
                        borderColor: isActive
                          ? "rgba(56,189,248,0.24)"
                          : "transparent",
                        color: isActive
                          ? "rgba(255,255,255,0.96)"
                          : "rgba(255,255,255,0.72)",
                      }}
                    >
                      <Icon
                        className={clsx(
                          "h-4 w-4",
                          isActive ? "text-sky-300" : "text-white/50",
                        )}
                      />
                      <span className="flex-1">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {user?.isAdmin && (
              <div className="mt-7">
                <div className="mb-3 flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/40">
                  <Shield className="h-3.5 w-3.5 text-sky-300/70" />
                  Admin
                </div>

                <div
                  className="rounded-2xl border p-2"
                  style={{
                    borderColor: "rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.02)",
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
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200"
                          style={{
                            background: isActive
                              ? "rgba(56,189,248,0.12)"
                              : "transparent",
                            color: isActive
                              ? "rgba(255,255,255,0.96)"
                              : "rgba(255,255,255,0.68)",
                          }}
                        >
                          <ChevronRight
                            className={clsx(
                              "h-3.5 w-3.5",
                              isActive ? "text-sky-300" : "text-white/30",
                            )}
                          />
                          <Icon
                            className={clsx(
                              "h-4 w-4",
                              isActive ? "text-sky-300" : "text-white/45",
                            )}
                          />
                          <span className="flex-1">{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-7">
              <div className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/40">
                Stream
              </div>

              <div className="space-y-2">
                <Link
                  href={kickUrl}
                  target={kickUrl === "#" ? undefined : "_blank"}
                  rel={kickUrl === "#" ? undefined : "noreferrer"}
                  className="flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium"
                  style={{
                    borderColor: "rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.02)",
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  <span>Watch on Kick</span>
                  <ExternalLink className="h-4 w-4 text-white/55" />
                </Link>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={discordUrl}
                    target={discordUrl === "#" ? undefined : "_blank"}
                    rel={discordUrl === "#" ? undefined : "noreferrer"}
                    className="flex items-center justify-center rounded-2xl border px-3 py-3 text-sm font-medium"
                    style={{
                      borderColor: "rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.02)",
                      color: "rgba(255,255,255,0.82)",
                    }}
                  >
                    Discord
                  </Link>

                  <Link
                    href={youtubeUrl}
                    target={youtubeUrl === "#" ? undefined : "_blank"}
                    rel={youtubeUrl === "#" ? undefined : "noreferrer"}
                    className="flex items-center justify-center rounded-2xl border px-3 py-3 text-sm font-medium"
                    style={{
                      borderColor: "rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.02)",
                      color: "rgba(255,255,255,0.82)",
                    }}
                  >
                    YouTube
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
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
          className="object-contain drop-shadow-[0_0_12px_rgba(139,92,246,0.6)]"
        />
      </div>

      <div className="flex min-w-0 flex-col leading-tight">
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