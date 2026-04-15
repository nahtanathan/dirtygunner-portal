// FILE: src/components/layout/SiteFooter.tsx
"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Archive,
  Crosshair,
  Disc3,
  Gift,
  Radio,
  Trophy,
  Youtube,
} from "lucide-react";

type FooterColumnLink = {
  href: string;
  label: string;
  icon: ReactNode;
  external?: boolean;
};

type SiteSettings = {
  kickUrl?: string;
  discordUrl?: string;
  youtubeUrl?: string;
  xUrl?: string;
  instagramUrl?: string;
};

type SocialLinkItem = {
  href: string;
  label: string;
  icon: ReactNode;
};

const EMPTY_SETTINGS: SiteSettings = {
  kickUrl: "",
  discordUrl: "",
  youtubeUrl: "",
  xUrl: "",
  instagramUrl: "",
};

function normalizeHref(value?: string | null) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : "";
}

export default function SiteFooter() {
  const [settings, setSettings] = useState<SiteSettings>(EMPTY_SETTINGS);

  useEffect(() => {
    let mounted = true;

    async function loadSiteSettings() {
      try {
        const res = await fetch("/api/site-settings", {
          method: "GET",
          cache: "no-store",
        });

        const data = await res.json();

        if (!mounted) return;

        setSettings({
          kickUrl: normalizeHref(data?.settings?.kickUrl),
          discordUrl: normalizeHref(data?.settings?.discordUrl),
          youtubeUrl: normalizeHref(data?.settings?.youtubeUrl),
          xUrl: normalizeHref(data?.settings?.xUrl),
          instagramUrl: normalizeHref(data?.settings?.instagramUrl),
        });
      } catch (error) {
        console.error("Failed to load footer site settings:", error);

        if (!mounted) return;
        setSettings(EMPTY_SETTINGS);
      }
    }

    void loadSiteSettings();

    return () => {
      mounted = false;
    };
  }, []);

  const socialLinks = useMemo<SocialLinkItem[]>(() => {
    const links: SocialLinkItem[] = [];

    if (normalizeHref(settings.kickUrl)) {
      links.push({
        href: normalizeHref(settings.kickUrl),
        label: "Kick",
        icon: <Radio className="h-4 w-4" />,
      });
    }

    if (normalizeHref(settings.discordUrl)) {
      links.push({
        href: normalizeHref(settings.discordUrl),
        label: "Discord",
        icon: <Disc3 className="h-4 w-4" />,
      });
    }

    if (normalizeHref(settings.youtubeUrl)) {
      links.push({
        href: normalizeHref(settings.youtubeUrl),
        label: "YouTube",
        icon: <Youtube className="h-4 w-4" />,
      });
    }

    if (normalizeHref(settings.xUrl)) {
      links.push({
        href: normalizeHref(settings.xUrl),
        label: "X",
        icon: <XLogo />,
      });
    }

    if (normalizeHref(settings.instagramUrl)) {
      links.push({
        href: normalizeHref(settings.instagramUrl),
        label: "Instagram",
        icon: <InstagramLogo />,
      });
    }

    return links;
  }, [settings]);

  const hasSocialLinks = socialLinks.length > 0;

  const exploreLinks: FooterColumnLink[] = [
    {
      href: "/leaderboard",
      label: "Leaderboard",
      icon: <Trophy className="h-4 w-4" />,
    },
    {
      href: "/raffles",
      label: "Raffles",
      icon: <Gift className="h-4 w-4" />,
    },
    {
      href: "/challenges",
      label: "Challenges",
      icon: <Crosshair className="h-4 w-4" />,
    },
    {
      href: "/bonus-hunts",
      label: "Bonus Hunts",
      icon: <Archive className="h-4 w-4" />,
    },
  ];

  return (
    <footer className="px-4 pb-6 pt-10 sm:px-6 lg:px-8 lg:pb-8 lg:pt-12">
      <div
        className="overflow-hidden rounded-[20px] border"
        style={{
          borderColor: "rgba(255,255,255,0.08)",
          background:
            "linear-gradient(180deg, rgba(18,22,28,0.96) 0%, rgba(12,15,20,0.98) 100%)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.28)",
        }}
      >
        <div
          className={[
            "grid gap-8 px-5 py-6 md:px-7 lg:px-8 lg:py-7",
            hasSocialLinks
              ? "md:grid-cols-[minmax(0,1.2fr)_minmax(180px,auto)_minmax(180px,auto)]"
              : "md:grid-cols-[minmax(0,1.2fr)_minmax(180px,auto)]",
          ].join(" ")}
        >
          <div className="min-w-0">
            <div className="flex min-w-0 items-start gap-4">
              <div className="relative h-12 w-12 flex-shrink-0">
                <Image
                  src="/brand/logo-mark.png"
                  alt="DirtyGunner"
                  fill
                  className="object-contain drop-shadow-[0_0_12px_rgba(139,92,246,0.35)]"
                />
              </div>

              <div className="min-w-0">
                <div className="truncate text-base font-semibold tracking-wide text-white sm:text-lg">
                  DirtyGunner
                </div>
                <div className="truncate text-xs font-medium uppercase tracking-[0.22em] text-white/58 sm:text-sm">
                  Portal
                </div>
              </div>
            </div>

            <div className="mt-5 max-w-[560px] text-sm leading-6 text-white/62 md:leading-7">
              <Link
                href="https://www.gambleaware.org/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-white transition hover:text-white/80"
              >
                GambleAware
              </Link>{" "}
              provides support and information for safer gambling. We do not take
              responsibility for losses from gambling on third-party sites or
              services linked or referenced on this website. Please play
              responsibly.
            </div>

            {hasSocialLinks ? (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                {socialLinks.map((link) => (
                  <SocialLink
                    key={`pill-${link.label}`}
                    href={link.href}
                    label={link.label}
                    icon={link.icon}
                  />
                ))}
              </div>
            ) : null}
          </div>

          <FooterColumn title="Explore" links={exploreLinks} />

          {hasSocialLinks ? (
            <FooterColumn
              title="Social Media"
              links={socialLinks.map((link) => ({
                href: link.href,
                label: link.label,
                icon: link.icon,
                external: true,
              }))}
            />
          ) : null}
        </div>

        <div
          className="flex flex-col gap-3 border-t px-5 py-4 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between md:px-7 lg:px-8"
          style={{
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <div className="truncate">© 2026 DirtyGunner. All Rights Reserved.</div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/terms" className="whitespace-nowrap transition hover:text-white">
              Terms of Service
            </Link>
            <Link href="/privacy" className="whitespace-nowrap transition hover:text-white">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: FooterColumnLink[];
}) {
  return (
    <div className="min-w-0">
      <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/42">
        {title}
      </div>

      <div className="space-y-2">
        {links.map((link) => (
          <Link
            key={`${title}-${link.label}`}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noreferrer" : undefined}
            className="flex min-w-0 items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-3 text-sm text-white/72 transition hover:bg-white/[0.05] hover:text-white"
          >
            <span className="shrink-0 text-white/45">{link.icon}</span>
            <span className="min-w-0 flex-1 truncate whitespace-nowrap">{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex min-w-0 max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/75 transition hover:bg-white/[0.05] hover:text-white"
    >
      <span className="shrink-0 text-white/55">{icon}</span>
      <span className="truncate whitespace-nowrap">{label}</span>
    </Link>
  );
}

function XLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M18.244 2H21l-6.522 7.455L22.15 22h-6.007l-4.705-6.16L6.05 22H3.292l6.978-7.977L1.85 2h6.16l4.253 5.621L18.244 2Zm-1.053 18h1.527L7.18 3.896H5.542L17.19 20Z" />
    </svg>
  );
}

function InstagramLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
      <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5Zm8.95 1.35a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 6.85A5.15 5.15 0 1 1 6.85 12 5.16 5.16 0 0 1 12 6.85Zm0 1.8A3.35 3.35 0 1 0 15.35 12 3.35 3.35 0 0 0 12 8.65Z" />
    </svg>
  );
}