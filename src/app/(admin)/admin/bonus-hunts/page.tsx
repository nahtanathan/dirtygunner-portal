"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Database,
  RefreshCw,
  ShieldAlert,
  Trophy,
  Wallet,
} from "lucide-react";

type AdminBonus = {
  id: string;
  slotName: string;
  provider?: string;
  buyAmount?: number;
  payout?: number;
  multiplier?: number;
  status?: string;
};

type AdminHunt = {
  id: string;
  title: string;
  casino?: string;
  provider?: string;
  date?: string;
  updatedAt?: string;
  buyCount?: number;
  totalCost?: number;
  totalReturn?: number;
  profitLoss?: number;
  profitLossPercentage?: number;
  currentOpeningSlot?: string | null;
  bonuses?: AdminBonus[];
};

type BonusHuntSnapshot = {
  liveHunts: AdminHunt[];
  previousHunts: AdminHunt[];
  source: "bonushunt" | "fallback";
  fetchedAt: string;
  message?: string;
  totalHunts?: number;
  activeHunts?: number;
  completedHunts?: number;
  totalBonuses?: number;
  totalInvested?: number;
  totalWinnings?: number;
  totalProfitLoss?: number;
  totalProfitLossPercentage?: number;
  rateLimit?: {
    limit?: number;
    remaining?: number;
    reset?: number;
  };
};

function formatMoney(value?: number) {
  if (value === undefined || value === null) return "—";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatSignedPercent(value?: number) {
  if (value === undefined || value === null) return "—";
  const sign = value > 0 ? "+" : value < 0 ? "" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function formatAdminDate(value?: string) {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
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
  const isWarning = tone === "warning";

  return (
    <div
      className="flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm"
      style={{
        borderColor: isWarning ? "rgba(245,158,11,0.22)" : "rgba(59,130,246,0.18)",
        background: isWarning
          ? "rgba(245,158,11,0.08)"
          : "rgba(59,130,246,0.08)",
        color: "rgba(255,255,255,0.82)",
      }}
    >
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="min-w-0">{children}</div>
    </div>
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
    <div className="rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-4">
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/42">
        {label}
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
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center gap-2 text-white/45">
        <span className="shrink-0">{icon}</span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">
          {label}
        </span>
      </div>
      <div className="mt-3 text-lg font-semibold text-white">{value}</div>
      <div className="mt-1 text-sm text-white/52">{subtext}</div>
    </div>
  );
}

export default function AdminBonusHuntsPage() {
  const [snapshot, setSnapshot] = useState<BonusHuntSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [unauthorized, setUnauthorized] = useState(false);

  async function loadSnapshot(showRefreshState = false) {
    try {
      if (showRefreshState) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");
      setMessage("");

      const res = await fetch("/api/bonus-hunts", {
        method: "GET",
        cache: "no-store",
      });

      const data = (await res.json().catch(() => null)) as
        | BonusHuntSnapshot
        | { error?: string }
        | null;

      if (res.status === 401 || res.status === 403) {
        setUnauthorized(true);
        return;
      }

      if (!res.ok || !data || "error" in data) {
        throw new Error(
          (data && "error" in data && data.error) || "Failed to load bonus hunts",
        );
      }

      setUnauthorized(false);
      setSnapshot(data);
      setMessage("Bonus hunt data updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bonus hunts");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    void loadSnapshot();
  }, []);

  const totalVisibleHunts = useMemo(() => {
    if (!snapshot) return 0;
    return snapshot.liveHunts.length + snapshot.previousHunts.length;
  }, [snapshot]);

  if (unauthorized) {
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
          You must be an admin to view bonus hunts.
        </p>
      </div>
    );
  }

  if (loading && !snapshot) {
    return (
      <div className="mx-auto w-full max-w-[1360px] space-y-6">
        <section className="rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(10,16,30,0.96),rgba(5,10,22,0.98))] p-6">
          <div className="h-36 animate-pulse rounded-[24px] bg-white/5" />
        </section>
      </div>
    );
  }

  if (!snapshot) {
    return (
      <div className="mx-auto w-full max-w-[1360px]">
        <Notice tone="warning" icon={<AlertTriangle className="h-4 w-4" />}>
          {error || "No bonus hunt data found."}
        </Notice>
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
              Bonus Hunts
            </h1>
            <p className="truncate-3 mt-3 max-w-3xl text-sm leading-7 text-white/58">
              Read-only BonusHunt.gg data for the public site. Track live hunts,
              archive history, source status, and fallback state.
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

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => void loadSnapshot(true)}
          disabled={refreshing}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold text-white transition hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

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
              : "No ROI returned"
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
              ? `${snapshot.rateLimit.remaining ?? "—"} of ${snapshot.rateLimit.limit} left`
              : "Headers not returned"
          }
        />
      </section>
    </div>
  );
}