"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  ExternalLink,
  Flame,
  Gift,
  Home,
  Menu,
  Target,
  Trophy,
  X,
} from "lucide-react";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Raffles", href: "/raffles", icon: Gift },
  { name: "Challenges", href: "/challenges", icon: Target },
  { name: "Bonus Hunts", href: "/bonus-hunts", icon: Flame },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="sticky top-0 z-50 border-b backdrop-blur-xl md:hidden"
        style={{
          borderColor: "var(--border-subtle)",
          background: "rgba(10, 15, 28, 0.92)",
        }}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-2xl border px-3 py-2.5"
            style={{
              borderColor: "rgba(255,255,255,0.04)",
              background:
                "linear-gradient(180deg, rgba(15,22,41,0.9), rgba(12,19,38,0.9))",
            }}
          >
            <div className="relative h-10 w-10">
              <Image
                src="/brand/logo-mark.png"
                alt="DirtyGunner"
                fill
                className="object-contain drop-shadow-[0_0_14px_rgba(59,130,246,0.25)]"
              />
            </div>
            <div>
              <div
                className="text-sm font-semibold tracking-[0.08em]"
                style={{ color: "var(--text-primary)" }}
              >
                DIRTYGUNNER
              </div>
              <div
                className="text-[10px] uppercase tracking-[0.24em]"
                style={{ color: "var(--text-muted)" }}
              >
                Portal
              </div>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border transition-all duration-200"
            style={{
              borderColor: "var(--border-subtle)",
              background: "rgba(255,255,255,0.03)",
              color: "var(--text-primary)",
            }}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-[88%] max-w-[360px] border-l p-4"
            style={{
              borderColor: "var(--border-subtle)",
              background:
                "linear-gradient(180deg, rgba(12,19,38,0.98) 0%, rgba(10,15,28,0.98) 100%)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="mb-5 flex items-center gap-3 rounded-2xl border p-3"
              style={{
                borderColor: "var(--border-subtle)",
                background:
                  "linear-gradient(180deg, rgba(15,22,41,0.92), rgba(12,19,38,0.92))",
              }}
            >
              <div className="relative h-11 w-11">
                <Image
                  src="/brand/logo-mark.png"
                  alt="DirtyGunner"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <div
                  className="text-sm font-semibold tracking-[0.08em]"
                  style={{ color: "var(--text-primary)" }}
                >
                  DIRTYGUNNER
                </div>
                <div
                  className="text-[10px] uppercase tracking-[0.24em]"
                  style={{ color: "var(--text-muted)" }}
                >
                  Portal
                </div>
              </div>
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
                    onClick={() => setOpen(false)}
                    className={clsx(
                      "relative flex items-center gap-3 overflow-hidden rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200"
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
                        ? "0 0 18px rgba(37,99,235,0.14)"
                        : "none",
                    }}
                  >
                    {isActive && (
                      <div
                        className="absolute inset-y-[1px] left-0 w-[3px] rounded-full"
                        style={{
                          background:
                            "linear-gradient(180deg, var(--accent-primary), var(--accent-secondary))",
                        }}
                      />
                    )}

                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-lg border"
                      style={{
                        borderColor: isActive
                          ? "rgba(59,130,246,0.24)"
                          : "rgba(255,255,255,0.05)",
                        background: isActive
                          ? "rgba(59,130,246,0.12)"
                          : "rgba(255,255,255,0.03)",
                      }}
                    >
                      <Icon size={18} />
                    </span>

                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div
              className="mt-6 rounded-2xl border p-4"
              style={{
                borderColor: "var(--border-subtle)",
                background:
                  "linear-gradient(180deg, rgba(21,29,52,0.96), rgba(15,22,41,0.94))",
              }}
            >
              <a
                href="#"
                className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-white"
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
                {["Kick", "Discord", "YouTube"].map((label) => (
                  <a
                    key={label}
                    href="#"
                    className="flex items-center justify-between rounded-lg px-2 py-2 text-sm transition-all duration-200"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <span>{label}</span>
                    <ExternalLink size={13} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}