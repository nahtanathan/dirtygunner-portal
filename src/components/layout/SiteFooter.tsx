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

export default function SiteFooter() {
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
        <div className="grid gap-10 px-6 py-6 md:grid-cols-[minmax(0,1.2fr)_auto_auto] md:px-7 lg:px-8 lg:py-7">
          <div className="min-w-0">
            <div className="flex items-start gap-4">
              <div className="relative h-12 w-12 flex-shrink-0">
                <Image
                  src="/brand/logo-mark.png"
                  alt="DirtyGunner"
                  fill
                  className="object-contain drop-shadow-[0_0_12px_rgba(139,92,246,0.35)]"
                />
              </div>

              <div className="min-w-0">
                <div className="text-lg font-semibold tracking-wide text-white">
                  DirtyGunner
                </div>
                <div className="text-sm font-medium uppercase tracking-[0.22em] text-white/58">
                  Portal
                </div>
              </div>
            </div>

            <div className="mt-5 max-w-[560px] text-sm leading-7 text-white/62">
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

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <SocialLink
                href="https://kick.com/dirtygunner"
                label="Kick"
                icon={<Radio className="h-4 w-4" />}
              />
              <SocialLink
                href="https://discord.gg/dirtygunner"
                label="Discord"
                icon={<Disc3 className="h-4 w-4" />}
              />
              <SocialLink
                href="https://youtube.com/@dirtygunner"
                label="YouTube"
                icon={<Youtube className="h-4 w-4" />}
              />
            </div>
          </div>

          <FooterColumn
            title="Explore"
            links={[
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
            ]}
          />

          <FooterColumn
            title="Social Media"
            links={[
              {
                href: "https://kick.com/dirtygunner",
                label: "Kick",
                icon: <Radio className="h-4 w-4" />,
                external: true,
              },
              {
                href: "https://discord.gg/dirtygunner",
                label: "Discord",
                icon: <Disc3 className="h-4 w-4" />,
                external: true,
              },
              {
                href: "https://youtube.com/@dirtygunner",
                label: "YouTube",
                icon: <Youtube className="h-4 w-4" />,
                external: true,
              },
            ]}
          />
        </div>

        <div
          className="flex flex-col gap-3 border-t px-6 py-4 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between md:px-7 lg:px-8"
          style={{
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <div>© 2026 DirtyGunner. All Rights Reserved.</div>

          <div className="flex flex-wrap items-center gap-5">
            <Link href="/terms" className="transition hover:text-white">
              Terms of Service
            </Link>
            <Link href="/privacy" className="transition hover:text-white">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

type FooterColumnLink = {
  href: string;
  label: string;
  icon: React.ReactNode;
  external?: boolean;
};

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: FooterColumnLink[];
}) {
  return (
    <div className="min-w-[170px]">
      <div className="mb-3 text-sm font-black uppercase tracking-[0.16em] text-white/68">
        {title}
      </div>

      <div className="space-y-2.5">
        {links.map((link) => {
          const content = (
            <>
              <span className="text-white/62">{link.icon}</span>
              <span>{link.label}</span>
            </>
          );

          if (link.external) {
            return (
              <Link
                key={`${title}-${link.href}`}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 text-[1rem] font-semibold text-white transition hover:text-white/78"
              >
                {content}
              </Link>
            );
          }

          return (
            <Link
              key={`${title}-${link.href}`}
              href={link.href}
              className="flex items-center gap-2.5 text-[1rem] font-semibold text-white transition hover:text-white/78"
            >
              {content}
            </Link>
          );
        })}
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
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/[0.03] hover:text-white"
      style={{
        borderColor: "rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <span className="text-white/68">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}