// FILE: src/app/(public)/raffles/page.tsx

import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  Coins,
  Gift,
  Search,
  Trophy,
  Users,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/ui/PageHero";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PrismaRaffle = {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  status: string;
  entryMethod: string;
  totalEntries: number;
  startDate: Date;
  endDate: Date;
  winner: string | null;
  prizeDetails: string;
};

type DisplayRaffle = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  status: "active" | "ended";
  entryMethod: string;
  totalEntries: number;
  startDate: string;
  endDate: string;
  winner: string | null;
  prizeDetails: string;
  winners: number;
};

export default async function RafflesPage() {
  noStore();

  let raffles: DisplayRaffle[] = [];

  try {
    const rows = await prisma.raffle.findMany({
      orderBy: [{ status: "asc" }, { endDate: "asc" }, { createdAt: "desc" }],
    });

    console.log(
      "Public raffles page rows:",
      rows.map((row) => ({
        id: row.id,
        title: row.title,
        status: row.status,
        endDate: row.endDate,
      })),
    );

    raffles = rows.map(normalizeRaffle);
  } catch (error) {
    console.error("Failed to load raffles from Prisma:", error);
    raffles = [];
  }

  const activeRaffles = raffles.filter((item) => item.status === "active");
  const endedRaffles = raffles.filter((item) => item.status === "ended");

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Raffles"
        title="Live Community Raffles"
        description="Join active raffles, track entries, and keep an eye on closing time without leaving the site."
      />

      <section className="mx-auto w-full max-w-[1280px] space-y-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid flex-1 gap-3 md:grid-cols-[minmax(0,1fr)_240px]">
            <div
              className="flex h-14 items-center gap-3 rounded-2xl border px-4"
              style={{
                borderColor: "rgba(255,255,255,0.08)",
                background:
                  "linear-gradient(180deg, rgba(20,24,40,0.9) 0%, rgba(14,18,32,0.96) 100%)",
              }}
            >
              <Search className="h-4 w-4 text-white/35" />
              <span className="text-base text-white/55">Search Items</span>
            </div>

            <div
              className="flex h-14 items-center justify-between rounded-2xl border px-4"
              style={{
                borderColor: "rgba(255,255,255,0.08)",
                background:
                  "linear-gradient(180deg, rgba(20,24,40,0.9) 0%, rgba(14,18,32,0.96) 100%)",
              }}
            >
              <span className="text-base font-medium text-white">Ending Soonest</span>
              <ChevronRight className="h-4 w-4 rotate-90 text-white/35" />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              className="inline-flex h-12 w-12 items-center justify-center rounded-xl border text-white/55"
              style={{
                borderColor: "rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
              }}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div
              className="inline-flex h-12 min-w-[48px] items-center justify-center rounded-xl border px-4 text-sm font-semibold text-white"
              style={{
                borderColor: "rgba(56,189,248,0.24)",
                background: "rgba(56,189,248,0.08)",
              }}
            >
              1
            </div>

            <button
              type="button"
              className="inline-flex h-12 w-12 items-center justify-center rounded-xl border text-white/55"
              style={{
                borderColor: "rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
              }}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <Gift className="h-5 w-5 text-sky-300" />
            <h2 className="text-2xl font-bold text-white">Active Raffles</h2>
          </div>

          {activeRaffles.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {activeRaffles.map((raffle, index) => (
                <RaffleShowcaseCard key={raffle.id} raffle={raffle} index={index} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No active raffles"
              description="Nothing is live right now. New raffles will show up here automatically once they are created in admin."
            />
          )}
        </section>

        {endedRaffles.length > 0 && (
          <section className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <Trophy className="h-5 w-5 text-white/75" />
              <h2 className="text-2xl font-bold text-white">Ended Raffles</h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {endedRaffles.map((raffle, index) => (
                <RaffleShowcaseCard key={raffle.id} raffle={raffle} index={index} />
              ))}
            </div>
          </section>
        )}
      </section>
    </div>
  );
}

function normalizeRaffle(item: PrismaRaffle): DisplayRaffle {
  const normalizedStatus = item.status === "active" ? "active" : "ended";

  return {
    id: item.id,
    title: item.title,
    description: item.description ?? "",
    image: item.image,
    status: normalizedStatus,
    entryMethod: item.entryMethod,
    totalEntries: item.totalEntries,
    startDate: item.startDate.toISOString(),
    endDate: item.endDate.toISOString(),
    winner: item.winner,
    prizeDetails: item.prizeDetails,
    winners: item.winner ? 1 : inferWinnerCount(item.prizeDetails),
  };
}

function inferWinnerCount(prizeDetails: string) {
  const match = prizeDetails.match(/(\d+)\s*winners?/i);
  if (!match) return 1;

  const value = Number(match[1]);
  return Number.isFinite(value) && value > 0 ? value : 1;
}

function RaffleShowcaseCard({
  raffle,
  index,
}: {
  raffle: DisplayRaffle;
  index: number;
}) {
  const accentPresets = [
    {
      glow: "0 0 0 1px rgba(96,165,250,0.18), 0 16px 40px rgba(15,23,42,0.45)",
      button: "linear-gradient(180deg, rgba(59,130,246,0.96), rgba(37,99,235,0.96))",
      badge: "rgba(56,189,248,0.16)",
    },
    {
      glow: "0 0 0 1px rgba(139,92,246,0.18), 0 16px 40px rgba(15,23,42,0.45)",
      button: "linear-gradient(180deg, rgba(99,102,241,0.96), rgba(79,70,229,0.96))",
      badge: "rgba(139,92,246,0.16)",
    },
    {
      glow: "0 0 0 1px rgba(251,191,36,0.18), 0 16px 40px rgba(15,23,42,0.45)",
      button: "linear-gradient(180deg, rgba(59,130,246,0.96), rgba(37,99,235,0.96))",
      badge: "rgba(245,158,11,0.16)",
    },
  ] as const;

  const accent = accentPresets[index % accentPresets.length];
  const timeLeft = formatTimeLeft(raffle.endDate);

  return (
    <article
      className="group overflow-hidden rounded-[22px] border p-3 transition-transform duration-200 hover:-translate-y-1"
      style={{
        borderColor:
          raffle.status === "active"
            ? "rgba(96,165,250,0.18)"
            : "rgba(255,255,255,0.08)",
        background:
          "linear-gradient(180deg, rgba(15,20,36,0.96) 0%, rgba(10,14,28,0.98) 100%)",
        boxShadow: accent.glow,
      }}
    >
      <div
        className="relative overflow-hidden rounded-[18px] border"
        style={{
          borderColor: "rgba(255,255,255,0.08)",
          background:
            "radial-gradient(circle at top left, rgba(96,165,250,0.18), transparent 30%), radial-gradient(circle at top right, rgba(139,92,246,0.18), transparent 28%), linear-gradient(180deg, rgba(10,15,30,0.96) 0%, rgba(15,23,42,0.98) 100%)",
        }}
      >
        {raffle.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={raffle.image}
            alt={raffle.title}
            className="h-[155px] w-full object-cover"
          />
        ) : (
          <div className="relative h-[155px] w-full overflow-hidden px-4 py-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(255,255,255,0.14),transparent_14%),radial-gradient(circle_at_82%_20%,rgba(255,255,255,0.10),transparent_10%),radial-gradient(circle_at_50%_65%,rgba(255,215,0,0.14),transparent_26%)]" />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.18))]" />

            <div className="relative z-10 flex h-full items-start justify-between">
              <div className="max-w-[65%]">
                <div className="text-xs font-black uppercase tracking-[0.22em] text-white/80">
                  {raffle.status === "active" ? "Live Raffle" : "Ended"}
                </div>
                <div className="mt-3 line-clamp-2 text-[1.8rem] font-black uppercase leading-none text-white">
                  {raffle.prizeDetails}
                </div>
                <div className="mt-2 text-sm font-bold uppercase tracking-[0.18em] text-sky-300/90">
                  DirtyGunner
                </div>
              </div>

              <div className="relative flex h-full items-end justify-end">
                <div className="absolute bottom-5 right-10 h-12 w-12 rounded-full bg-yellow-300/25 blur-xl" />
                <div className="relative">
                  <div className="absolute -left-5 top-6 h-16 w-16 rounded-full bg-yellow-300/20 blur-2xl" />
                  <Coins className="h-16 w-16 text-yellow-300 drop-shadow-[0_0_16px_rgba(250,204,21,0.45)]" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-2 pb-2 pt-4">
        <div className="line-clamp-1 text-[1.1rem] font-bold text-white">
          {raffle.title}
        </div>

        <div className="mt-1 min-h-[2.5rem] text-sm leading-6 text-white/55">
          {raffle.description || "Community raffle live on the DirtyGunner portal."}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <StatBlock
            icon={<Trophy className="h-4 w-4" />}
            value={String(raffle.winners)}
            label={raffle.winners === 1 ? "Winner" : "Winners"}
          />
          <StatBlock
            icon={<Users className="h-4 w-4" />}
            value={raffle.totalEntries.toLocaleString()}
            label="Entries"
          />
        </div>

        <div
          className="mt-4 flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold text-white"
          style={{
            borderColor: "rgba(255,255,255,0.08)",
            background: accent.badge,
          }}
        >
          <Clock3 className="h-4 w-4 text-white/70" />
          <span>{timeLeft}</span>
        </div>

        <button
          type="button"
          className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-xl text-sm font-extrabold uppercase tracking-[0.08em] text-white"
          style={{
            background: accent.button,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
          }}
        >
          {raffle.status === "active" ? raffle.entryMethod : "View Results"}
        </button>
      </div>
    </article>
  );
}

function StatBlock({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div
      className="rounded-xl border px-3 py-2.5"
      style={{
        borderColor: "rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <div className="flex items-center gap-2 text-white/45">
        {icon}
        <span className="text-xs uppercase tracking-[0.18em]">{label}</span>
      </div>
      <div className="mt-1.5 text-lg font-bold text-white">{value}</div>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      className="rounded-3xl border px-6 py-10 text-center"
      style={{
        borderColor: "rgba(255,255,255,0.08)",
        background:
          "linear-gradient(180deg, rgba(15,20,36,0.9) 0%, rgba(10,14,28,0.96) 100%)",
      }}
    >
      <div className="text-xl font-bold text-white">{title}</div>
      <div className="mt-2 text-sm text-white/55">{description}</div>
      <div className="mt-5">
        <Link
          href="https://kick.com/dirtygunner"
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center justify-center rounded-xl border px-4 text-sm font-semibold text-white"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          Watch Stream
        </Link>
      </div>
    </div>
  );
}

function formatTimeLeft(endsAt: string) {
  const diff = new Date(endsAt).getTime() - Date.now();

  if (Number.isNaN(diff)) {
    return "Ends soon";
  }

  if (diff <= 0) {
    return "Ended";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return `${days}D ${hours}H ${minutes}M ${seconds}S`;
}