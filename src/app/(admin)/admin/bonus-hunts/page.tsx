// FILE: src/app/(admin)/admin/bonus-hunts/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Database,
  Loader2,
  RefreshCw,
  ShieldAlert,
  Trophy,
  Wallet,
} from "lucide-react";

type AdminUser = {
  id: string;
  isAdmin: boolean;
};

type BonusRow = {
  id: string;
  slotName: string;
  provider?: string;
  betSize?: number;
  payout?: number;
  multiplier?: number;
};

type BonusHuntItem = {
  id: string;
  title: string;
  date?: string;
  updatedAt?: string;
  status: "active" | "archived" | "opening" | "completed";
  provider?: string;
  casino?: string;
  buyCount?: number;
  openedBonuses?: number;
  unopenedBonuses?: number;
  totalCost?: number;
  totalReturn?: number;
  profitLoss?: number;
  profitLossPercentage?: number;
  currentOpeningSlot?: string;
  notes?: string;
  bonuses?: BonusRow[];
};

type BonusHuntSnapshot = {
  liveHunts: BonusHuntItem[];
  previousHunts: BonusHuntItem[];
  totalHunts?: number;
  activeHunts?: number;
  completedHunts?: number;
  totalBonuses?: number;
  totalInvested?: number;
  totalWinnings?: number;
  totalProfitLoss?: number;
  totalProfitLossPercentage?: number;
  source: "bonushunt" | "fallback";
  fetchedAt: string;
  message?: string;
  rateLimit?: {
    limit?: number;
    remaining?: number;
    reset?: number;
  };
};

const EMPTY_SNAPSHOT: BonusHuntSnapshot = {
  liveHunts: [],
  previousHunts: [],
  source: "fallback",
  fetchedAt: new Date().toISOString(),
};

function formatAdminDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function formatMoney(value?: number) {
  if (value === undefined || value === null) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatSignedPercent(value?: number) {
  if (value === undefined || value === null) {
    return "—";
  }

  const sign = value > 0 ? "+" : value < 0 ? "" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function formatCount(value?: number) {
  if (value === undefined || value === null) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

export default function AdminBonusHuntsPage() {
  const [me, setMe] = useState<AdminUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [snapshot, setSnapshot] = useState<BonusHuntSnapshot>(EMPTY_SNAPSHOT);

  async function loadUser() {
    setLoadingUser(true);

    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        cache: "no-store",
      });

      const data = (await res.json()) as { user?: AdminUser | null };
      setMe(data.user ?? null);
    } catch {
      setMe(null);
    } finally {
      setLoadingUser(false);
    }
  }

  async function loadBonusHunts(options?: { silent?: boolean }) {
    const silent = options?.silent ?? false;

    if (silent) {
      setRefreshing(true);
    } else {
      setLoadingData(true);
    }

    setError("");
    setMessage("");

    try {
      const res = await fetch("/api/bonus-hunts", {
        method: "GET",
        cache: "no-store",
      });

      const data = (await res.json()) as BonusHuntSnapshot & { error?: string };

      if (!res.ok) {
        throw new Error(data.error || "Failed to load bonus hunt data");
      }

      setSnapshot({
        ...EMPTY_SNAPSHOT,
        ...data,
      });

      if (data.message) {
        setMessage(data.message);
      }
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to load bonus hunt data",
      );
    } finally {
      setLoadingData(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void loadUser();
    void loadBonusHunts();
  }, []);

  const totalVisibleHunts = useMemo(
    () => snapshot.liveHunts.length + snapshot.previousHunts.length,
    [snapshot.liveHunts.length, snapshot.previousHunts.length],
  );

  if (loadingUser) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white/75">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading admin panel...
        </div>
      </div>
    );
  }

  if (!me?.isAdmin) {
    return (
      <div
        className="mx-auto max-w-3xl rounded-[28px] border p-8"
        style={{
          borderColor: "rgba(239,68,68,0.18)",
          background:
            "linear-gradient(180deg, rgba(28,10,14,0.92) 0%, rgba(18,8,11,0.98) 100%)",
          boxShadow:
            "0 0 0 1px rgba(239,68,68,0.08), 0 24px 70px rgba(2,8,23,0.5)",
        }}
      >
        <div className="flex items-center gap-3">
          <ShieldAlert className="h-6 w-6 text-red-300" />
          <div className="text-2xl font-bold text-white">Access denied</div>
        </div>
        <p className="mt-3 text-sm leading-7 text-white/60">
          You must be an admin to view bonus hunt monitoring.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1360px] space-y-6">
      <section
        className="rounded-[30px] border p-5 sm:p-6 md:p-8"
        style={{
          borderColor: "rgba(255,255,255,0.08)",
          background:
            "linear-gradient(180deg, rgba(10,16,30,0.96) 0%, rgba(5,10,22,0.98) 100%)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.02), 0 24px 70px rgba(2,8,23,0.45)",
        }}
      >
        <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300/85">
              Admin
            </div>
            <h1 className="mt-2 truncate text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Bonus Hunts Monitor
            </h1>
            <p className="truncate-3 mt-3 max-w-3xl text-sm leading-7 text-white/58">
              Read-only BonusHunt.gg monitoring for the public portal. This phase
              tracks live openings, archive history, upstream availability, and
              fallback state without adding local hunt CRUD.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <TopStat
              value={String(snapshot.activeHunts ?? snapshot.liveHunts.length)}
              label="Live"
            />
            <TopStat
              value={String(
                snapshot.completedHunts ?? snapshot.previousHunts.length,
              )}
              label="Archive"
            />
            <TopStat
              value={String(snapshot.totalBonuses ?? "—")}
              label="Bonuses"
            />
            <TopStat
              value={String(snapshot.totalHunts ?? totalVisibleHunts)}
              label="Total Hunts"
            />
          </div>
        </div>
      </section>

      {message ? (
        <Notice tone="info" icon={<CheckCircle2 className="h-4 w-4" />}>
          {message}
        </Notice>
      ) : null}

      {error ? (
        <Notice tone="warning" icon={<AlertTriangle className="h-4 w-4" />}>
          {error}
        </Notice>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-4">
        <MiniPanel
          icon={<Database className="h-4 w-4" />}
          label="Source"
          value={snapshot.source === "bonushunt" ? "BonusHunt.gg" : "Fallback"}
          subtext={`Fetched ${formatAdminDate(snapshot.fetchedAt)}`}
        />
        <MiniPanel
          icon={<Wallet className="h-4 w-4" />}
          label="Total P/L"
          value={formatMoney(snapshot.totalProfitLoss)}
          subtext={
            snapshot.totalProfitLossPercentage !== undefined
              ? `${formatSignedPercent(snapshot.totalProfitLossPercentage)} overall`
              : "No aggregate ROI returned"
          }
        />
        <MiniPanel
          icon={<Trophy className="h-4 w-4" />}
          label="Total Winnings"
          value={formatMoney(snapshot.totalWinnings)}
          subtext={`Invested ${formatMoney(snapshot.totalInvested)}`}
        />
        <MiniPanel
          icon={<Activity className="h-4 w-4" />}
          label="Rate Limit"
          value={
            snapshot.rateLimit?.remaining !== undefined
              ? `${snapshot.rateLimit.remaining}`
              : "—"
          }
          subtext={
            snapshot.rateLimit?.limit !== undefined
              ? `Remaining of ${snapshot.rateLimit.limit}`
              : "Headers not returned"
          }
        />
      </section>

      <section
        className="rounded-[28px] border p-5 md:p-6"
        style={{
          borderColor: "rgba(255,255,255,0.08)",
          background:
            "linear-gradient(180deg, rgba(12,18,34,0.96) 0%, rgba(7,12,24,0.98) 100%)",
        }}
      >
        <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-[0.26em] text-white/42">
              External Feed
            </div>
            <h2 className="mt-2 truncate text-2xl font-bold text-white">
              Public Data Sync
            </h2>
            <p className="truncate-3 mt-2 text-sm leading-7 text-white/55">
              Refresh the external feed and verify what the public bonus hunts page
              is currently receiving.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadBonusHunts({ silent: true })}
            disabled={refreshing}
            className="inline-flex h-11 min-w-0 items-center gap-2 rounded-2xl border px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              borderColor: "rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            ) : (
              <RefreshCw className="h-4 w-4 shrink-0" />
            )}
            <span className="truncate whitespace-nowrap">
              {refreshing ? "Refreshing..." : "Refresh Feed"}
            </span>
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-[0.26em] text-white/42">
            Live
          </div>
          <h2 className="mt-2 truncate text-2xl font-bold text-white">
            Current Hunt
          </h2>
        </div>

        {loadingData ? (
          <LoadingPanel label="Loading bonus hunts..." />
        ) : snapshot.liveHunts.length === 0 ? (
          <EmptyPanel label="No live hunt is currently opening." />
        ) : (
          <div className="space-y-4">
            {snapshot.liveHunts.map((hunt) => (
              <HuntCard key={hunt.id} hunt={hunt} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-[0.26em] text-white/42">
            Archive
          </div>
          <h2 className="mt-2 truncate text-2xl font-bold text-white">
            Previous Hunts
          </h2>
        </div>

        {loadingData ? (
          <LoadingPanel label="Loading archive..." />
        ) : snapshot.previousHunts.length === 0 ? (
          <EmptyPanel label="No completed hunts are available yet." />
        ) : (
          <div className="space-y-4">
            {snapshot.previousHunts.map((hunt) => (
              <HuntCard key={hunt.id} hunt={hunt} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function HuntCard({ hunt }: { hunt: BonusHuntItem }) {
  const rows = hunt.bonuses?.slice(0, 6) ?? [];

  return (
    <article
      className="rounded-[28px] border p-5 md:p-6"
      style={{
        borderColor: "rgba(255,255,255,0.08)",
        background:
          "linear-gradient(180deg, rgba(12,18,34,0.96) 0%, rgba(7,12,24,0.98) 100%)",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.02), 0 18px 44px rgba(2,8,23,0.35)",
      }}
    >
      <div className="flex min-w-0 flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <h3 className="truncate text-xl font-bold text-white sm:text-2xl">
              {hunt.title}
            </h3>

            <span
              className="inline-flex h-8 max-w-full items-center rounded-full border px-3 text-xs font-semibold uppercase tracking-[0.16em]"
              style={{
                borderColor:
                  hunt.status === "opening" || hunt.status === "active"
                    ? "rgba(34,197,94,0.18)"
                    : "rgba(59,130,246,0.18)",
                background:
                  hunt.status === "opening" || hunt.status === "active"
                    ? "rgba(34,197,94,0.10)"
                    : "rgba(59,130,246,0.10)",
                color: "rgba(255,255,255,0.82)",
              }}
            >
              <span className="truncate whitespace-nowrap">{hunt.status}</span>
            </span>
          </div>

          <div className="mt-2 truncate text-sm text-white/58">
            {hunt.casino || hunt.provider || "BonusHunt.gg"}
          </div>

          {hunt.currentOpeningSlot ? (
            <div className="mt-2 truncate text-sm text-emerald-300/85">
              Opening now: {hunt.currentOpeningSlot}
            </div>
          ) : null}

          {hunt.notes ? (
            <div className="truncate-3 mt-2 text-sm leading-6 text-white/52">
              {hunt.notes}
            </div>
          ) : null}

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <MiniStat
              icon={<Database className="h-4 w-4" />}
              label="Bonuses"
              value={formatCount(hunt.buyCount)}
            />
            <MiniStat
              icon={<CheckCircle2 className="h-4 w-4" />}
              label="Opened"
              value={formatCount(hunt.openedBonuses)}
            />
            <MiniStat
              icon={<Clock3 className="h-4 w-4" />}
              label="Remaining"
              value={formatCount(hunt.unopenedBonuses)}
            />
            <MiniStat
              icon={<Wallet className="h-4 w-4" />}
              label="Cost"
              value={formatMoney(hunt.totalCost)}
            />
            <MiniStat
              icon={<Trophy className="h-4 w-4" />}
              label="Return"
              value={formatMoney(hunt.totalReturn)}
            />
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <MetaRow
              label="Profit / Loss"
              value={formatMoney(hunt.profitLoss)}
              icon={<Wallet className="h-4 w-4" />}
            />
            <MetaRow
              label="ROI"
              value={formatSignedPercent(hunt.profitLossPercentage)}
              icon={<Activity className="h-4 w-4" />}
            />
            <MetaRow
              label="Updated"
              value={formatAdminDate(hunt.updatedAt || hunt.date)}
              icon={<Clock3 className="h-4 w-4" />}
            />
          </div>

          {rows.length > 0 ? (
            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
              <div className="hidden grid-cols-[minmax(0,1.6fr)_minmax(0,0.8fr)_80px_100px_80px] gap-3 border-b border-white/10 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/42 md:grid">
                <div>Game</div>
                <div>Provider</div>
                <div className="text-right">Bet</div>
                <div className="text-right">Payout</div>
                <div className="text-right">Multi</div>
              </div>

              <div className="divide-y divide-white/6">
                {rows.map((row) => (
                  <div key={row.id} className="px-4 py-3 text-sm">
                    <div className="grid gap-2 md:grid-cols-[minmax(0,1.6fr)_minmax(0,0.8fr)_80px_100px_80px] md:items-center md:gap-3">
                      <div className="min-w-0">
                        <div className="truncate text-white">{row.slotName}</div>
                        <div className="mt-1 truncate text-xs text-white/50 md:hidden">
                          {row.provider || "—"}
                        </div>
                      </div>

                      <div className="hidden truncate text-white/55 md:block">
                        {row.provider || "—"}
                      </div>

                      <div className="flex items-center justify-between gap-3 text-white/70 md:block md:text-right">
                        <span className="shrink-0 text-white/45 md:hidden">Bet</span>
                        <span className="whitespace-nowrap">{formatMoney(row.betSize)}</span>
                      </div>

                      <div className="flex items-center justify-between gap-3 text-white md:block md:text-right">
                        <span className="shrink-0 text-white/45 md:hidden">Payout</span>
                        <span className="whitespace-nowrap">{formatMoney(row.payout)}</span>
                      </div>

                      <div className="flex items-center justify-between gap-3 text-white/70 md:block md:text-right">
                        <span className="shrink-0 text-white/45 md:hidden">Multi</span>
                        <span className="whitespace-nowrap">
                          {row.multiplier !== undefined
                            ? `${row.multiplier.toFixed(1)}x`
                            : "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function TopStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div
      className="min-w-0 rounded-2xl border px-4 py-3"
      style={{
        borderColor: "rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.03)",
      }}
    >
      <div className="truncate text-lg font-bold text-white">{value}</div>
      <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/42">
        {label}
      </div>
    </div>
  );
}

function Notice({
  tone,
  icon,
  children,
}: {
  tone: "info" | "warning";
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const warning = tone === "warning";

  return (
    <div
      className="rounded-2xl border px-4 py-3 text-sm"
      style={{
        borderColor: warning
          ? "rgba(245,158,11,0.18)"
          : "rgba(255,255,255,0.08)",
        background: warning
          ? "rgba(245,158,11,0.10)"
          : "rgba(255,255,255,0.03)",
        color: "rgba(255,255,255,0.82)",
      }}
    >
      <div className="flex min-w-0 items-center gap-2">
        <span className="shrink-0">{icon}</span>
        <span className="truncate-2">{children}</span>
      </div>
    </div>
  );
}

function MiniPanel({
  icon,
  label,
  value,
  subtext,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
}) {
  return (
    <div
      className="min-w-0 rounded-[24px] border p-4"
      style={{
        borderColor: "rgba(255,255,255,0.08)",
        background:
          "linear-gradient(180deg, rgba(12,18,34,0.96) 0%, rgba(7,12,24,0.98) 100%)",
      }}
    >
      <div className="flex items-center gap-2 text-white/48">
        <span className="shrink-0">{icon}</span>
        <span className="truncate text-[11px] font-semibold uppercase tracking-[0.2em]">
          {label}
        </span>
      </div>
      <div className="mt-2 truncate text-lg font-bold text-white">{value}</div>
      <div className="truncate-2 mt-1 text-sm text-white/50">{subtext}</div>
    </div>
  );
}

function MiniStat({
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
      <div className="mt-2 truncate text-base font-bold text-white">{value}</div>
    </div>
  );
}

function MetaRow({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className="flex min-w-0 items-center gap-3 rounded-2xl border px-4 py-3"
      style={{
        borderColor: "rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <div className="shrink-0 text-white/45">{icon}</div>
      <div className="min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/42">
          {label}
        </div>
        <div className="mt-1 truncate text-sm font-medium text-white">{value}</div>
      </div>
    </div>
  );
}

function LoadingPanel({ label }: { label: string }) {
  return (
    <div
      className="rounded-[28px] border px-6 py-10 text-center text-white/65"
      style={{
        borderColor: "rgba(255,255,255,0.08)",
        background:
          "linear-gradient(180deg, rgba(12,18,34,0.96) 0%, rgba(7,12,24,0.98) 100%)",
      }}
    >
      <div className="inline-flex items-center gap-3">
        <Loader2 className="h-4 w-4 animate-spin" />
        {label}
      </div>
    </div>
  );
}

function EmptyPanel({ label }: { label: string }) {
  return (
    <div
      className="rounded-[28px] border px-6 py-10 text-center text-white/65"
      style={{
        borderColor: "rgba(255,255,255,0.08)",
        background:
          "linear-gradient(180deg, rgba(12,18,34,0.96) 0%, rgba(7,12,24,0.98) 100%)",
      }}
    >
      {label}
    </div>
  );
}