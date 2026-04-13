"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import {
  ExternalLink,
  Flame,
  Gift,
  Home,
  Shield,
  Target,
  Trophy,
} from "lucide-react";
import { useAdminStore } from "@/store/admin-store";

type MeUser = {
  isAdmin: boolean;
};

const baseNavItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Raffles", href: "/raffles", icon: Gift },
  { name: "Challenges", href: "/challenges", icon: Target },
  { name: "Bonus Hunts", href: "/bonus-hunts", icon: Flame },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const siteSettings = useAdminStore((state) => state.siteSettings) as {
    kickUrl?: string;
    discordUrl?: string;
    youtubeUrl?: string;
  };

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

  const navItems = useMemo(
    () =>
      user?.isAdmin
        ? [...baseNavItems, { name: "Admin", href: "/admin", icon: Shield }]
        : baseNavItems,
    [user]
  );

  const kickUrl = siteSettings?.kickUrl?.trim() || "#";
  const discordUrl = siteSettings?.discordUrl?.trim() || "#";
  const youtubeUrl = siteSettings?.youtubeUrl?.trim() || "#";

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-[286px] md:flex">
      <div
        className="relative flex h-screen w-full flex-col overflow-hidden border-r"
        style={{
          background:
            "linear-gradient(180deg, rgba(12,19,38,0.98) 0%, rgba(10,15,28,0.98) 100%)",
          borderColor: "var(--border-subtle)",
          boxShadow: "inset -1px 0 0 rgba(255,255,255,0.02)",
        }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(59,130,246,0.08) 0%, transparent 18%, transparent 82%, rgba(34,211,238,0.05) 100%)",
            }}
          />
          <div
            className="absolute left-0 top-0 h-full w-full"
            style={{
              background:
                "radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 34%)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 h-full w-full"
            style={{
              background:
                "radial-gradient(circle at bottom left, rgba(34,211,238,0.09), transparent 30%)",
            }}
          />
          <div
            className="absolute inset-y-0 right-0 w-px"
            style={{ background: "rgba(255,255,255,0.04)" }}
          />
        </div>

        <div className="relative px-6 pb-5 pt-6">
          <Link
            href="/"
            className="group flex items-center gap-3 rounded-2xl border px-3 py-3 transition-all duration-200"
            style={{
              borderColor: "var(--border-subtle)",
              background:
                "linear-gradient(180deg, rgba(15,22,41,0.92), rgba(12,19,38,0.92))",
              boxShadow:
                "0 16px 38px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            <div className="relative h-11 w-11 shrink-0">
              <Image
                src="/brand/logo-mark.png"
                alt="DirtyGunner"
                fill
                className="object-contain drop-shadow-[0_0_16px_rgba(59,130,246,0.35)]"
              />
            </div>

            <div className="min-w-0">
              <div
                className="truncate text-[15px] font-semibold tracking-[0.08em]"
                style={{ color: "var(--text-primary)" }}
              >
                DIRTYGUNNER
              </div>
              <div
                className="mt-0.5 text-[10px] uppercase tracking-[0.28em]"
                style={{ color: "var(--text-muted)" }}
              >
                Portal
              </div>
            </div>
          </Link>
        </div>

        <div className="relative px-4">
          <div
            className="mb-3 px-2 text-[10px] uppercase tracking-[0.28em]"
            style={{ color: "var(--text-muted)" }}
          >
            Navigation
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    "group relative flex items-center gap-3 overflow-hidden rounded-xl border px-4 py-3 text-sm font-medium tracking-[0.02em] transition-all duration-200"
                  )}
                  style={{
                    background: isActive
                      ? "linear-gradient(90deg, rgba(59,130,246,0.16), rgba(59,130,246,0.05))"
                      : "transparent",
                    borderColor: isActive
                      ? "var(--border-strong)"
                      : "transparent",
                    color: isActive
                      ? "var(--text-primary)"
                      : "var(--text-secondary)",
                    boxShadow: isActive
                      ? "0 0 0 1px rgba(59,130,246,0.08), 0 0 18px rgba(37,99,235,0.16)"
                      : "none",
                  }}
                >
                  {isActive && (
                    <>
                      <div
                        className="absolute inset-y-[1px] left-0 w-[3px] rounded-full"
                        style={{
                          background:
                            "linear-gradient(180deg, var(--accent-primary), var(--accent-secondary))",
                          boxShadow: "0 0 14px rgba(59,130,246,0.4)",
                        }}
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(90deg, rgba(59,130,246,0.10), transparent 62%)",
                        }}
                      />
                    </>
                  )}

                  <span
                    className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-all duration-200"
                    style={{
                      borderColor: isActive
                        ? "rgba(59,130,246,0.24)"
                        : "rgba(255,255,255,0.05)",
                      background: isActive
                        ? "rgba(59,130,246,0.12)"
                        : "rgba(255,255,255,0.03)",
                      boxShadow: isActive
                        ? "inset 0 1px 0 rgba(255,255,255,0.05), 0 0 12px rgba(59,130,246,0.10)"
                        : "none",
                    }}
                  >
                    <Icon
                      size={18}
                      className="transition-colors duration-200"
                      style={{
                        color: isActive
                          ? "var(--text-primary)"
                          : "var(--text-secondary)",
                      }}
                    />
                  </span>

                  <span className="relative">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="relative mt-auto px-4 pb-4 pt-6">
          <div
            className="rounded-2xl border p-4"
            style={{
              borderColor: "var(--border-subtle)",
              background:
                "linear-gradient(180deg, rgba(21,29,52,0.96), rgba(15,22,41,0.94))",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.03)",
            }}
          >
            <div
              className="mb-3 text-[10px] uppercase tracking-[0.26em]"
              style={{ color: "var(--text-muted)" }}
            >
              Stream
            </div>

            <a
              href={kickUrl}
              target={kickUrl !== "#" ? "_blank" : undefined}
              rel={kickUrl !== "#" ? "noreferrer" : undefined}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:brightness-110"
              style={{
                background:
                  "linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))",
                boxShadow: "0 12px 28px rgba(37,99,235,0.28)",
              }}
            >
              <span>Watch on Kick</span>
              <ExternalLink size={16} />
            </a>

            <div className="mt-4 space-y-2">
              <a
                href={discordUrl}
                target={discordUrl !== "#" ? "_blank" : undefined}
                rel={discordUrl !== "#" ? "noreferrer" : undefined}
                className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-all duration-200"
                style={{
                  borderColor: "transparent",
                  color: "var(--text-secondary)",
                  background: "transparent",
                }}
              >
                <span className="flex items-center gap-2">
                  <DiscordLogo />
                  <span>Discord</span>
                </span>
                <ExternalLink size={13} />
              </a>

              <a
                href={youtubeUrl}
                target={youtubeUrl !== "#" ? "_blank" : undefined}
                rel={youtubeUrl !== "#" ? "noreferrer" : undefined}
                className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-all duration-200"
                style={{
                  borderColor: "transparent",
                  color: "var(--text-secondary)",
                  background: "transparent",
                }}
              >
                <span className="flex items-center gap-2">
                  <YouTubeLogo />
                  <span>YouTube</span>
                </span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          <div
            className="mt-4 flex items-center justify-between px-1 text-[11px]"
            style={{ color: "var(--text-muted)" }}
          >
            <span>© 2026 DirtyGunner</span>
            <span
              className="rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.18em]"
              style={{
                borderColor: "var(--border-subtle)",
                color: "var(--text-secondary)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              Live
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function DiscordLogo() {
  return (
    <span className="flex h-4 w-4 items-center justify-center">
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M20.317 4.369A19.791 19.791 0 0 0 15.885 3c-.191.329-.403.775-.551 1.125a18.27 18.27 0 0 0-5.669 0A12.037 12.037 0 0 0 9.114 3a19.736 19.736 0 0 0-4.433 1.369C1.879 8.579 1.118 12.684 1.489 16.729a19.904 19.904 0 0 0 5.993 3.03c.483-.667.914-1.372 1.288-2.108a12.955 12.955 0 0 1-2.028-.985c.17-.124.336-.254.497-.389 3.914 1.84 8.167 1.84 12.035 0 .166.136.332.266.497.389a12.9 12.9 0 0 1-2.032.987c.374.735.805 1.44 1.288 2.107a19.867 19.867 0 0 0 5.996-3.03c.443-4.691-.761-8.759-3.512-12.36ZM8.02 14.285c-1.182 0-2.15-1.085-2.15-2.419s.95-2.419 2.15-2.419c1.208 0 2.169 1.095 2.15 2.419 0 1.334-.95 2.419-2.15 2.419Zm7.974 0c-1.182 0-2.15-1.085-2.15-2.419s.95-2.419 2.15-2.419c1.208 0 2.169 1.095 2.15 2.419 0 1.334-.942 2.419-2.15 2.419Z" />
      </svg>
    </span>
  );
}

function YouTubeLogo() {
  return (
    <span className="flex h-4 w-4 items-center justify-center">
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M23.498 6.186a2.992 2.992 0 0 0-2.108-2.117C19.533 3.5 12 3.5 12 3.5s-7.533 0-9.39.569A2.992 2.992 0 0 0 .502 6.186C0 8.053 0 12 0 12s0 3.947.502 5.814a2.992 2.992 0 0 0 2.108 2.117C4.467 20.5 12 20.5 12 20.5s7.533 0 9.39-.569a2.992 2.992 0 0 0 2.108-2.117C24 15.947 24 12 24 12s0-3.947-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
      </svg>
    </span>
  );
}