"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard,
  Settings,
  Trophy,
  Gift,
  Target,
} from "lucide-react";

const adminNavItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    description: "Overview",
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
    description: "Site links",
  },
  {
    name: "Leaderboard",
    href: "/admin/leaderboard",
    icon: Trophy,
    description: "Timing & prizes",
  },
  {
    name: "Raffles",
    href: "/admin/raffles",
    icon: Gift,
    description: "Manage raffles",
  },
  {
    name: "Challenges",
    href: "/admin/challenges",
    icon: Target,
    description: "Manage challenges",
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex w-full max-w-[1600px] gap-6 px-4 py-6 md:px-6">
      <aside className="hidden w-[280px] shrink-0 lg:block">
        <div className="sticky top-6">
          <div className="rounded-3xl border border-white/10 bg-black/30 p-4 backdrop-blur-xl">
            <div className="mb-4 border-b border-white/10 pb-4">
              <div className="text-xs font-semibold uppercase tracking-[0.26em] text-zinc-500">
                Admin Panel
              </div>
              <div className="mt-2 text-xl font-bold text-white">
                DirtyGunner
              </div>
              <div className="mt-1 text-sm text-zinc-400">
                Control panel for site content and leaderboard settings.
              </div>
            </div>

            <nav className="space-y-2">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      "group flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-200",
                      isActive
                        ? "border-white/15 bg-white/10"
                        : "border-transparent bg-transparent hover:border-white/10 hover:bg-white/5"
                    )}
                  >
                    <div
                      className={clsx(
                        "flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200",
                        isActive
                          ? "border-white/15 bg-white/10 text-white"
                          : "border-white/10 bg-white/5 text-zinc-400 group-hover:text-white"
                      )}
                    >
                      <Icon size={18} />
                    </div>

                    <div className="min-w-0">
                      <div
                        className={clsx(
                          "text-sm font-semibold",
                          isActive ? "text-white" : "text-zinc-200"
                        )}
                      >
                        {item.name}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}