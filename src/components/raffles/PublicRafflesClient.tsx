
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Clock3, Coins, Gift, Users } from "lucide-react";
import { RaffleEntryButton } from "@/components/raffles/RaffleEntryButton";

type PublicRaffleItem = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  status: "active" | "ended";
  entryMethod: string;
  entryCost: number;
  entryCurrency: "bullets" | "points";
  maxEntriesPerUser: number | null;
  totalEntries: number;
  currentUserEntries: number;
  currentUserPoints: number | null;
  startDate: string;
  endDate: string;
  winner: string | null;
  prizeDetails: string;
  winners: number;
};

type PublicRafflesClientProps = {
  initialRaffles: PublicRaffleItem[];
};

type ApiRaffle = {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  status: "active" | "ended";
  entryMethod: string;
  entryCost: number;
  entryCurrency: "bullets" | "points";
  maxEntriesPerUser: number | null;
  totalEntries: number;
  currentUserEntries: number;
  currentUserPoints: number | null;
  startDate: string;
  endDate: string;
  winner: string | null;
  prizeDetails: string;
};

export function PublicRafflesClient({
  initialRaffles,
}: PublicRafflesClientProps) {
  const [raffles, setRaffles] = useState<PublicRaffleItem[]>(initialRaffles);
  const [now, setNow] = useState(Date.now());
  const pendingEndRefreshRef = useRef(false);

  const refreshRaffles = useCallback(async () => {
    try {
      const res = await fetch("/api/raffles", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to refresh raffles");
      }

      const data = (await res.json()) as ApiRaffle[];

      const normalized: PublicRaffleItem[] = data.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description ?? "",
        image: item.image,
        status: item.status === "active" ? "active" : "ended",
        entryMethod: item.entryMethod,
        entryCost: item.entryCost,
        entryCurrency: item.entryCurrency === "points" ? "points" : "bullets",
        maxEntriesPerUser: item.maxEntriesPerUser,
        totalEntries: item.totalEntries,
        currentUserEntries: item.currentUserEntries,
        currentUserPoints: item.currentUserPoints,
        startDate: new Date(item.startDate).toISOString(),
        endDate: new Date(item.endDate).toISOString(),
        winner: item.winner,
        prizeDetails: item.prizeDetails,
        winners: item.winner ? 1 : inferWinnerCount(item.prizeDetails),
      }));

      setRaffles(normalized);
    } catch (error) {
      console.error("Failed to refresh raffles", error);
    }
  }, []);

  useEffect(() => {
    void refreshRaffles();
  }, [refreshRaffles]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const poller = window.setInterval(() => {
      void refreshRaffles();
    }, 30000);

    return () => {
      window.clearInterval(poller);
    };
  }, [refreshRaffles]);

  useEffect(() => {
    const crossedEnd = raffles.some(
      (raffle) =>
        raffle.status === "active" &&
        new Date(raffle.endDate).getTime() <= now,
    );

    if (!crossedEnd || pendingEndRefreshRef.current) {
      return;
    }

    pendingEndRefreshRef.current = true;

    void refreshRaffles().finally(() => {
      window.setTimeout(() => {
        pendingEndRefreshRef.current = false;
      }, 1500);
    });
  }, [now, raffles, refreshRaffles]);

  const activeRaffles = useMemo(
    () => raffles.filter((item) => isRaffleLive(item, now)),
    [raffles, now],
  );

  const endedRaffles = useMemo(
    () => raffles.filter((item) => !isRaffleLive(item, now)),
    [raffles, now],
  );

  function patchRaffleEntryState(
    raffleId: string,
    payload: {
      totalEntries: number;
      userEntries: number;
      pointsRemaining: number;
    },
  ) {
    setRaffles((current) =>
      current.map((raffle) =>
        raffle.id === raffleId
          ? {
              ...raffle,
              totalEntries: payload.totalEntries,
              currentUserEntries: payload.userEntries,
              currentUserPoints: payload.pointsRemaining,
            }
          : raffle,
      ),
    );
  }

  return (
    <section className="mx-auto w-full max-w-[1280px] space-y-8">
      <section className="space-y-4">
        <div className="flex min-w-0 items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-300/80">
              Live Now
            </div>
            <h2 className="mt-2 truncate text-2xl font-bold text-white md:text-[1.75rem]">
              Active Raffles
            </h2>
          </div>

          <div className="shrink-0 whitespace-nowrap text-sm text-white/45">
            {activeRaffles.length} live
          </div>
        </div>

        {activeRaffles.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {activeRaffles.map((raffle, index) => (
              <RaffleCard
                key={raffle.id}
                raffle={raffle}
                now={now}
                index={index}
                onEntrySuccess={patchRaffleEntryState}
                onRefresh={refreshRaffles}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No active raffles"
            description="Nothing is live right now. New raffles created in admin will appear here automatically."
          />
        )}
      </section>

      <section className="space-y-4">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-[0.28em] text-white/40">
            Results
          </div>
          <h2 className="mt-2 truncate text-2xl font-bold text-white md:text-[1.75rem]">
            Completed Raffles
          </h2>
        </div>

        {endedRaffles.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {endedRaffles.map((raffle, index) => (
              <RaffleCard
                key={raffle.id}
                raffle={raffle}
                now={now}
                index={index}
                onEntrySuccess={patchRaffleEntryState}
                onRefresh={refreshRaffles}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No completed raffles yet"
            description="Ended raffles and winners will show here once draws close."
          />
        )}
      </section>
    </section>
  );
}

function RaffleCard({
  raffle,
  now,
  index,
  onEntrySuccess,
  onRefresh,
}: {
  raffle: PublicRaffleItem;
  now: number;
  index: number;
  onEntrySuccess: (
    raffleId: string,
    payload: {
      totalEntries: number;
      userEntries: number;
      pointsRemaining: number;
    },
  ) => void;
  onRefresh: () => Promise<void>;
}) {
  const presets = [
    {
      border: "rgba(56,189,248,0.16)",
      glow: "0 0 0 1px rgba(56,189,248,0.10), 0 24px 60px rgba(2,8,23,0.50)",
      badge: "rgba(56,189,248,0.12)",
      orb: "rgba(56,189,248,0.22)",
    },
    {
      border: "rgba(139,92,246,0.16)",
      glow: "0 0 0 1px rgba(139,92,246,0.10), 0 24px 60px rgba(2,8,23,0.50)",
      badge: "rgba(139,92,246,0.12)",
      orb: "rgba(139,92,246,0.22)",
    },
    {
      border: "rgba(250,204,21,0.16)",
      glow: "0 0 0 1px rgba(250,204,21,0.10), 0 24px 60px rgba(2,8,23,0.50)",
      badge: "rgba(250,204,21,0.12)",
      orb: "rgba(250,204,21,0.22)",
    },
  ] as const;

  const accent = presets[index % presets.length];
  const live = isRaffleLive(raffle, now);
  const remaining = formatCountdown(raffle.endDate, now);
  const winnerLabel = raffle.winner?.trim() ? raffle.winner : "Winner pending";
  const limitText =
    raffle.maxEntriesPerUser === null
      ? "Unlimited"
      : `${raffle.currentUserEntries} / ${raffle.maxEntriesPerUser}`;

  return (
    <article
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[28px] border p-3 transition-transform duration-200 hover:-translate-y-1"
      style={{
        borderColor: live ? accent.border : "rgba(255,255,255,0.08)",
        background:
          "linear-gradient(180deg, rgba(11,17,32,0.96) 0%, rgba(6,11,22,0.98) 100%)",
        boxShadow: accent.glow,
      }}
    >
      <div
        className="relative overflow-hidden rounded-[22px] border"
        style={{
          borderColor: "rgba(255,255,255,0.08)",
          background:
            "radial-gradient(circle at top left, rgba(56,189,248,0.12), transparent 26%), radial-gradient(circle at top right, rgba(139,92,246,0.14), transparent 24%), linear-gradient(180deg, rgba(10,16,30,0.98) 0%, rgba(5,9,20,1) 100%)",
        }}
      >
        {raffle.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={raffle.image}
            alt={raffle.title}
            className="h-[210px] w-full object-cover"
          />
        ) : (
          <div className="relative h-[210px] w-full overflow-hidden px-5 py-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.10),transparent_12%),radial-gradient(circle_at_80%_18%,rgba(255,255,255,0.08),transparent_10%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_45%)]" />
            <div
              className="absolute -right-10 top-8 h-32 w-32 rounded-full blur-3xl"
              style={{ background: accent.orb }}
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.28))]" />

            <div className="relative z-10 flex h-full min-w-0 items-start justify-between gap-4">
              <div className="min-w-0 max-w-[72%]">
                <div className="text-xs font-black uppercase tracking-[0.22em] text-white/78">
                  {live ? "Live Raffle" : "Completed"}
                </div>

                <div className="truncate-3 mt-4 text-[1.75rem] font-black uppercase leading-none text-white sm:text-[2rem]">
                  {raffle.prizeDetails}
                </div>
              </div>

              <div className="relative flex h-full shrink-0 items-end justify-end pb-2">
                <div className="absolute bottom-8 right-6 h-14 w-14 rounded-full bg-yellow-300/20 blur-2xl" />
                <Coins className="h-16 w-16 text-yellow-300 drop-shadow-[0_0_18px_rgba(250,204,21,0.35)]" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col px-2 pb-2 pt-5">
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate-2 text-[1.1rem] font-bold text-white sm:text-[1.15rem]">
              {raffle.title}
            </h3>
            {raffle.description ? (
              <p className="truncate-3 mt-1 text-sm leading-6 text-white/58">
                {raffle.description}
              </p>
            ) : null}
          </div>

          <div
            className="shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em]"
            style={{
              borderColor: live ? accent.border : "rgba(255,255,255,0.08)",
              background: live ? accent.badge : "rgba(255,255,255,0.03)",
              color: "rgba(255,255,255,0.86)",
            }}
          >
            <span className="whitespace-nowrap">{live ? "Live" : "Ended"}</span>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <InfoTile
            icon={<Coins className="h-4 w-4" />}
            label="Cost"
            value={
              raffle.entryCost > 0
                ? `${raffle.entryCost.toLocaleString()} ${raffle.entryCurrency}`
                : "Free"
            }
          />
          <InfoTile
            icon={<Users className="h-4 w-4" />}
            label="Entries"
            value={raffle.totalEntries.toLocaleString()}
          />
          <InfoTile
            icon={<Gift className="h-4 w-4" />}
            label="Your Entries"
            value={raffle.currentUserEntries.toLocaleString()}
          />
          <InfoTile
            icon={<Clock3 className="h-4 w-4" />}
            label={live ? "Time Left" : "Winner"}
            value={live ? remaining : winnerLabel}
          />
        </div>

        <div className="mt-4 flex min-w-0 flex-col gap-1 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <span className="truncate">You have {raffle.currentUserEntries} entries</span>
          <span className="truncate sm:text-right">{limitText} used</span>
        </div>

        <RaffleEntryButton
          raffleId={raffle.id}
          raffleStatus={live ? "active" : "ended"}
          entryMethod={raffle.entryMethod}
          entryCost={raffle.entryCost}
          entryCurrency={raffle.entryCurrency}
          totalEntries={raffle.totalEntries}
          currentUserEntries={raffle.currentUserEntries}
          currentUserPoints={raffle.currentUserPoints}
          maxEntriesPerUser={raffle.maxEntriesPerUser}
          endDate={raffle.endDate}
          onEntrySuccess={onEntrySuccess}
          onRefresh={onRefresh}
        />
      </div>
    </article>
  );
}

function InfoTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="min-w-0 rounded-2xl border px-4 py-3"
      style={{
        borderColor: "rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.03)",
      }}
    >
      <div className="flex min-w-0 items-center gap-2 text-white/44">
        <span className="shrink-0">{icon}</span>
        <span className="truncate text-[11px] font-semibold uppercase tracking-[0.18em]">
          {label}
        </span>
      </div>
      <div className="mt-2 overflow-hidden text-ellipsis whitespace-nowrap text-base font-bold text-white">
        {value}
      </div>
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
      className="rounded-[28px] border px-6 py-10 text-center"
      style={{
        borderColor: "rgba(255,255,255,0.08)",
        background:
          "linear-gradient(180deg, rgba(12,18,34,0.94) 0%, rgba(7,12,24,0.98) 100%)",
      }}
    >
      <div className="truncate text-xl font-bold text-white">{title}</div>
      <div className="mx-auto mt-2 max-w-[38rem] text-sm text-white/55">
        {description}
      </div>
    </div>
  );
}

function inferWinnerCount(prizeDetails: string) {
  const match = prizeDetails.match(/(\d+)\s*winners?/i);
  if (!match) return 1;

  const value = Number(match[1]);
  return Number.isFinite(value) && value > 0 ? value : 1;
}

function isRaffleLive(raffle: PublicRaffleItem, now: number) {
  return (
    raffle.status === "active" &&
    new Date(raffle.endDate).getTime() > now
  );
}

function formatCountdown(endDate: string, now: number) {
  const diff = new Date(endDate).getTime() - now;

  if (Number.isNaN(diff) || diff <= 0) {
    return "Ended";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  if (days > 0) {
    return `${days}D ${hours}H ${minutes}M ${seconds}S`;
  }

  return `${hours}H ${minutes}M ${seconds}S`;
}