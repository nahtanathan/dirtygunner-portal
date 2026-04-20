"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  ChevronRight,
  ExternalLink,
  FileCheck,
  Flame,
  Gift,
  Home,
  LayoutDashboard,
  Menu,
  Settings,
  Shield,
  Swords,
  Target,
  Trophy,
  X,
} from "lucide-react";
import { HeaderAuth } from "@/components/layout/header-auth";
import { useMeUser, useSiteSettings } from "@/lib/client/site-context";

type SocialLinkItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const baseNavItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Raffles", href: "/raffles", icon: Gift },
  { name: "Challenges", href: "/challenges", icon: Target },
  { name: "Bonus Hunts", href: "/bonus-hunts", icon: Flame },
  { name: "Slot Tournament", href: "/slot-tournament", icon: Swords },
];

const adminNavItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Settings", href: "/admin/settings", icon: Settings },
  { name: "Leaderboard", href: "/admin/leaderboard", icon: Trophy },
  { name: "Raffles", href: "/admin/raffles", icon: Gift },
  { name: "Challenges", href: "/admin/challenges", icon: Target },
  { name: "Tournament", href: "/admin/tournament", icon: Swords },
  { name: "Challenge Claims", href: "/admin/challenge-claims", icon: FileCheck },
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
  const user = useMeUser();
  const siteSettings = useSiteSettings();

  const navItems = useMemo(() => {
    if (!user?.isAdmin) {
      return baseNavItems;
    }

    return [...baseNavItems, { name: "Admin", href: "/admin", icon: Shield }];
  }, [user]);

  const kickUrl = siteSettings.kickUrl;

  const socialLinks = useMemo<SocialLinkItem[]>(() => {
    const links: SocialLinkItem[] = [];

    if (siteSettings.discordUrl) {
      links.push({
        label: "Discord",
        href: siteSettings.discordUrl,
        icon: <DiscordLogo />,
      });
    }

    if (siteSettings.youtubeUrl) {
      links.push({
        label: "YouTube",
        href: siteSettings.youtubeUrl,
        icon: <YouTubeLogo />,
      });
    }

    if (siteSettings.xUrl) {
      links.push({
        label: "X",
        href: siteSettings.xUrl,
        icon: <XLogo />,
      });
    }

    if (siteSettings.instagramUrl) {
      links.push({
        label: "Instagram",
        href: siteSettings.instagramUrl,
        icon: <InstagramLogo />,
      });
    }

    return links;
  }, [siteSettings]);

  const hasStreamLinks = Boolean(kickUrl || socialLinks.length > 0);

  return (
    <>
      <div
        className="sticky top-0 z-40 border-b px-4 py-3 backdrop-blur-xl sm:px-6"
        style={{
          borderColor: "rgba(255,255,255,0.08)",
          background: "rgba(6,10,20,0.82)",
        }}
      >
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" className="min-w-0 flex-1 overflow-hidden">
            <SidebarBrandMark />
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            <div className="max-w-[124px] sm:max-w-none">
              <HeaderAuth mobileCompact />
            </div>

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
            <div className="flex min-w-0 items-center justify-between gap-3">
              <Link href="/" className="min-w-0 flex-1" onClick={() => setOpen(false)}>
                <SidebarBrandMark />
              </Link>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
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
                        "flex min-w-0 items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-200",
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
                          "h-4 w-4 shrink-0",
                          isActive ? "text-sky-300" : "text-white/50",
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

            {user?.isAdmin && (
              <div className="mt-7">
                <div className="mb-3 flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/40">
                  <Shield className="h-3.5 w-3.5 shrink-0 text-sky-300/70" />
                  <span className="truncate whitespace-nowrap">Admin</span>
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
                          className="flex min-w-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200"
                          style={{
                            background: isActive ? "rgba(255,255,255,0.06)" : "transparent",
                            color: isActive
                              ? "rgba(255,255,255,0.96)"
                              : "rgba(255,255,255,0.68)",
                          }}
                        >
                          <ChevronRight
                            className={clsx(
                              "h-3.5 w-3.5 shrink-0",
                              isActive ? "text-white/70" : "text-white/30",
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

            {hasStreamLinks ? (
              <div className="mt-7">
                <div className="mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/40">
                  Stream
                </div>

                <div className="space-y-2">
                  {kickUrl ? (
                    <Link
                      href={kickUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-white/5"
                      style={{
                        borderColor: "rgba(255,255,255,0.08)",
                        background: "rgba(255,255,255,0.03)",
                        color: "rgba(255,255,255,0.9)",
                      }}
                    >
                      <span className="min-w-0 truncate whitespace-nowrap">Watch on Kick</span>
                      <ExternalLink className="h-4 w-4 shrink-0 text-white/55" />
                    </Link>
                  ) : null}

                  {socialLinks.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {socialLinks.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          className="flex min-w-0 items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-sm font-medium transition-all duration-200 hover:bg-white/5"
                          style={{
                            borderColor: "rgba(255,255,255,0.08)",
                            background: "rgba(255,255,255,0.03)",
                            color: "rgba(255,255,255,0.82)",
                          }}
                        >
                          {item.icon}
                          <span className="truncate whitespace-nowrap">{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
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

function XLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-current" aria-hidden="true">
      <path d="M18.244 2H21l-6.522 7.455L22.15 22h-6.007l-4.705-6.16L6.05 22H3.292l6.978-7.977L1.85 2h6.16l4.253 5.621L18.244 2Zm-1.053 18h1.527L7.18 3.896H5.542L17.19 20Z" />
    </svg>
  );
}

function InstagramLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-current" aria-hidden="true">
      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm8.95 1.35a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 6.85A5.15 5.15 0 1 1 6.85 12 5.16 5.16 0 0 1 12 6.85Zm0 1.8A3.35 3.35 0 1 0 15.35 12 3.35 3.35 0 0 0 12 8.65Z" />
    </svg>
  );
}
