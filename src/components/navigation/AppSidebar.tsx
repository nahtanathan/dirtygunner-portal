"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
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
  const user = useMeUser();
  const siteSettings = useSiteSettings();

  const navItems = useMemo(() => {
    if (!user?.isAdmin) {
      return baseNavItems;
    }

    return [...baseNavItems, { name: "Admin", href: "/admin", icon: Shield }];
  }, [user]);

  const showAdminTree = Boolean(user?.isAdmin);
  const adminSectionActive =
    pathname === "/admin" || pathname.startsWith("/admin/");

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
    <div
      className="relative flex h-screen w-[264px] min-w-0 flex-col overflow-hidden border-r"
      style={{
        background:
          "linear-gradient(180deg, rgba(13,16,20,0.985) 0%, rgba(8,10,14,0.985) 100%)",
        borderColor: "rgba(255,255,255,0.06)",
      }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: "url('/art/sidebar-warzone.webp')",
            backgroundPosition: "center bottom",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,12,16,0.90)_0%,rgba(10,12,16,0.86)_26%,rgba(10,12,16,0.94)_56%,rgba(10,12,16,0.985)_100%)]" />
        <div className="absolute inset-y-0 right-0 w-px bg-[linear-gradient(180deg,transparent,rgba(162,174,191,0.18),transparent)]" />
      </div>

      <div className="relative z-10 flex-shrink-0 px-4 pb-4 pt-4">
        <Link
          href="/"
          className="group flex min-w-0 items-center rounded-[6px] border px-3 py-3 transition-all duration-200"
          style={{
            borderColor: "rgba(255,255,255,0.08)",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.018))",
          }}
        >
          <SidebarBrandMark />
        </Link>

        <div className="mt-4 overflow-hidden rounded-[6px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.025),rgba(255,255,255,0.012))]">
          <div className="relative h-[118px]">
            <Image
              src="/art/sidebar-warzone.webp"
              alt="Sidebar atmosphere"
              fill
              className="object-cover opacity-28 grayscale"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,12,16,0.34),rgba(10,12,16,0.88))]" />
            <div className="absolute inset-x-0 bottom-0 p-3.5">
              <div className="text-[10px] font-semibold uppercase tracking-[0.26em] text-white/44">
                Command Center
              </div>
              <div className="mt-2 text-sm font-semibold text-white">
                Live hub online
              </div>
              <div className="mt-1 text-xs leading-5 text-white/58">
                Boards, raffles, hunts, and challenges in one command shell.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 min-h-0 flex-1 overflow-y-auto px-4 premium-scrollbar">
        <div className="pb-5">
          <div className="mb-3 px-1 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/34">
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
                    "group relative flex min-w-0 items-center gap-3 overflow-hidden rounded-[5px] border px-3 py-3 text-sm font-medium transition-all duration-200",
                    isActive && "shadow-[0_0_0_1px_rgba(255,255,255,0.03)]",
                  )}
                  style={{
                    borderColor: isActive
                      ? "rgba(142,156,175,0.14)"
                      : "rgba(255,255,255,0.035)",
                    background: isActive
                      ? "linear-gradient(90deg, rgba(39,92,166,0.32), rgba(17,26,39,0.16))"
                      : "linear-gradient(180deg, rgba(255,255,255,0.018), rgba(255,255,255,0.008))",
                    color: isActive
                      ? "rgba(255,255,255,0.96)"
                      : "rgba(255,255,255,0.72)",
                  }}
                >
                  {isActive && (
                    <span
                      className="absolute inset-y-2 left-0 w-[2px]"
                      style={{ background: "rgba(182,196,214,0.82)" }}
                    />
                  )}

                  <Icon
                    className={clsx(
                      "h-4 w-4 shrink-0 transition-transform duration-200",
                      isActive ? "text-white/88" : "text-white/48",
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
          <div className="pb-5">
            <div className="mb-3 flex items-center gap-2 px-1 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/34">
              <Shield className="h-3.5 w-3.5 shrink-0 text-white/56" />
              <span className="truncate whitespace-nowrap">Admin</span>
            </div>

            <div
              className="overflow-hidden rounded-[6px] border p-2"
              style={{
                borderColor: adminSectionActive
                  ? "rgba(255,255,255,0.10)"
                  : "rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.015)",
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
                      className="group flex min-w-0 items-center gap-3 rounded-[5px] px-3 py-2.5 text-sm transition-all duration-200"
                      style={{
                        background: isActive
                          ? "rgba(255,255,255,0.055)"
                          : "transparent",
                        color: isActive
                          ? "rgba(255,255,255,0.95)"
                          : "rgba(255,255,255,0.66)",
                      }}
                    >
                      <ChevronRight
                        className={clsx(
                          "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                          isActive ? "translate-x-0 text-white/66" : "text-white/28",
                        )}
                      />
                      <Icon
                        className={clsx(
                          "h-4 w-4 shrink-0",
                          isActive ? "text-white/82" : "text-white/42",
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

      <div className="relative z-10 flex-shrink-0 px-4 pb-4 pt-3">
        {hasStreamLinks ? (
          <>
            <div className="mb-3 px-1 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-white/34">
              Stream
            </div>

            <div className="space-y-2">
              {kickUrl ? (
                <Link
                  href={kickUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-w-0 items-center justify-between gap-3 rounded-[5px] border px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-white/[0.03]"
                  style={{
                    borderColor: "rgba(255,255,255,0.07)",
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.018), rgba(255,255,255,0.008))",
                    color: "rgba(255,255,255,0.88)",
                  }}
                >
                  <span className="min-w-0 truncate whitespace-nowrap">Watch on Kick</span>
                  <ExternalLink className="h-4 w-4 shrink-0 text-white/48" />
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
                      className="flex min-w-0 items-center justify-center gap-2 rounded-[5px] border px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-white/[0.03]"
                      style={{
                        borderColor: "rgba(255,255,255,0.07)",
                        background: "rgba(255,255,255,0.014)",
                        color: "rgba(255,255,255,0.76)",
                      }}
                    >
                      {item.icon}
                      <span className="truncate whitespace-nowrap">{item.label}</span>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </>
        ) : null}

        <div className={clsx("px-1 text-xs text-white/30", hasStreamLinks ? "mt-5" : "mt-2")}>
          © 2026 DirtyGunner Live
        </div>
      </div>
    </div>
  );
}

function SidebarBrandMark() {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="relative h-9 w-9 shrink-0">
        <Image
          src="/brand/logo-mark.png"
          alt="DirtyGunner"
          fill
          className="object-contain drop-shadow-[0_0_12px_rgba(136,174,216,0.18)]"
        />
      </div>

      <div className="min-w-0 flex flex-col leading-tight">
        <span className="truncate text-sm font-semibold tracking-[0.16em] text-white">
          DIRTYGUNNER
        </span>
        <span className="truncate text-[10px] tracking-[0.30em] text-white/36">
          COMMAND HUB
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
      <path d="M18.901 2H21.98l-6.726 7.687L23.167 22h-6.194l-4.85-6.35L6.566 22H3.485l7.194-8.222L.833 2h6.352l4.384 5.79L18.901 2Zm-1.086 18.145h1.706L6.26 3.758H4.429l13.386 16.387Z" />
    </svg>
  );
}

function InstagramLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-current" aria-hidden="true">
      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.75A4 4 0 0 0 3.75 7.75v8.5a4 4 0 0 0 4 4h8.5a4 4 0 0 0 4-4v-8.5a4 4 0 0 0-4-4h-8.5Zm8.875 1.312a1.063 1.063 0 1 1 0 2.126 1.063 1.063 0 0 1 0-2.126ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.75A3.25 3.25 0 1 0 12 15.25 3.25 3.25 0 0 0 12 8.75Z" />
    </svg>
  );
}
