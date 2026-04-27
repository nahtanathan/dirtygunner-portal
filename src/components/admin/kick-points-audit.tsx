"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Radio,
  RefreshCw,
  Siren,
  Wrench,
  XCircle,
} from "lucide-react";

type KickPointSubscriptionHealth = {
  name: string;
  version: number;
  active: boolean;
};

type KickPointHealth = {
  broadcaster: {
    id: string;
    kickUserId: string | null;
    kickUsername: string | null;
    isKickBroadcaster: boolean;
    tokenExpiresAt: string | null;
    updatedAt: string;
  } | null;
  subscriptions: KickPointSubscriptionHealth[];
  subscriptionsError: string | null;
  receiptSummary: {
    liveReceiptCount: number;
    awardedPoints: number;
    lastLiveReceiptAt: string | null;
    creditedUsers: number;
  };
  recentReceipts: Array<{
    id: string;
    eventType: string;
    kickUserId: string | null;
    kickUsername: string | null;
    pointsAwarded: number;
    createdAt: string;
  }>;
};

type KickPointHealthResponse = {
  ok?: boolean;
  health?: KickPointHealth;
  error?: string;
};

function formatDateTime(value: string | null) {
  if (!value) {
    return "--";
  }

  return new Date(value).toLocaleString();
}

function subscriptionTone(active: boolean) {
  return active
    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-100"
    : "border-red-400/20 bg-red-500/10 text-red-100";
}

export function KickPointsAudit() {
  const [health, setHealth] = useState<KickPointHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [reconciling, setReconciling] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadHealth() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/kick/points-health", {
        method: "GET",
        cache: "no-store",
      });
      const data = (await res.json()) as KickPointHealthResponse;

      if (!res.ok || !data.health) {
        throw new Error(data.error || "Failed to load Kick points health");
      }

      setHealth(data.health);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load Kick points health",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadHealth();
  }, []);

  async function reconcileSubscriptions() {
    setReconciling(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/admin/kick/points-health", {
        method: "POST",
      });
      const data = (await res.json()) as KickPointHealthResponse & {
        reconciled?: {
          created?: Array<{ name: string; version: number }>;
        };
      };

      if (!res.ok || !data.health) {
        throw new Error(data.error || "Failed to reconcile Kick subscriptions");
      }

      setHealth(data.health);
      setMessage(
        data.reconciled?.created?.length
          ? `Kick subscriptions reconciled. Added ${data.reconciled.created.length} missing subscription(s).`
          : "Kick subscriptions checked. No missing subscriptions were found.",
      );
    } catch (reconcileError) {
      setError(
        reconcileError instanceof Error
          ? reconcileError.message
          : "Failed to reconcile Kick subscriptions",
      );
    } finally {
      setReconciling(false);
    }
  }

  const activeSubscriptionCount = useMemo(
    () => health?.subscriptions.filter((subscription) => subscription.active).length ?? 0,
    [health],
  );

  return (
    <div className="space-y-6">
      {message ? (
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span className="truncate-2">{message}</span>
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span className="truncate-2">{error}</span>
          </div>
        </div>
      ) : null}

      <section className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(12,18,34,0.96),rgba(7,12,24,0.98))] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.26)] sm:p-6">
        <div className="mb-5 flex min-w-0 flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-[0.26em] text-white/42">
              Health
            </div>
            <h2 className="mt-2 truncate text-xl font-bold text-white sm:text-2xl">
              Kick Points Delivery
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/62">
              This checks the connected broadcaster account, the required Kick event
              subscriptions, and the recent point receipts saved by the app.
            </p>
          </div>

          <div className="flex min-w-0 flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => void loadHealth()}
              disabled={loading || reconciling}
              className="inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin shrink-0" />
              ) : (
                <RefreshCw className="h-4 w-4 shrink-0" />
              )}
              <span className="truncate whitespace-nowrap">Refresh Health</span>
            </button>

            <button
              type="button"
              onClick={() => void reconcileSubscriptions()}
              disabled={loading || reconciling}
              className="inline-flex h-11 min-w-0 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                background:
                  "linear-gradient(180deg, rgba(59,130,246,0.96), rgba(37,99,235,0.96))",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.18), 0 12px 28px rgba(37,99,235,0.22)",
              }}
            >
              {reconciling ? (
                <Loader2 className="h-4 w-4 animate-spin shrink-0" />
              ) : (
                <Wrench className="h-4 w-4 shrink-0" />
              )}
              <span className="truncate whitespace-nowrap">Reconcile Subscriptions</span>
            </button>
          </div>
        </div>

        {loading && !health ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-8 text-sm text-white/58">
            Loading Kick points health...
          </div>
        ) : health ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <TopStat
                label="Live Receipts"
                value={String(health.receiptSummary.liveReceiptCount)}
              />
              <TopStat
                label="Awarded Points"
                value={health.receiptSummary.awardedPoints.toLocaleString()}
              />
              <TopStat
                label="Credited Users"
                value={String(health.receiptSummary.creditedUsers)}
              />
              <TopStat
                label="Active Subs"
                value={`${activeSubscriptionCount}/${health.subscriptions.length}`}
              />
            </div>

            <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/42">
                  Broadcaster
                </div>
                {health.broadcaster ? (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <MiniStat
                      label="Kick Username"
                      value={health.broadcaster.kickUsername ?? "--"}
                    />
                    <MiniStat
                      label="Kick User ID"
                      value={health.broadcaster.kickUserId ?? "--"}
                    />
                    <MiniStat
                      label="Last Broadcaster Login"
                      value={formatDateTime(health.broadcaster.updatedAt)}
                    />
                    <MiniStat
                      label="Token Expires At"
                      value={formatDateTime(health.broadcaster.tokenExpiresAt)}
                    />
                  </div>
                ) : (
                  <div className="mt-3 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                    No connected broadcaster account was found.
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/42">
                  <Radio className="h-4 w-4 shrink-0" />
                  Required Subscriptions
                </div>

                {health.subscriptionsError ? (
                  <div className="mt-3 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                    {health.subscriptionsError}
                  </div>
                ) : null}

                <div className="mt-3 space-y-3">
                  {health.subscriptions.map((subscription) => (
                    <article
                      key={`${subscription.name}:${subscription.version}`}
                      className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 p-3"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-white">
                          {subscription.name}
                        </div>
                        <div className="mt-1 text-xs text-white/45">
                          Version {subscription.version}
                        </div>
                      </div>

                      <span
                        className={`inline-flex max-w-full rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${subscriptionTone(
                          subscription.active,
                        )}`}
                      >
                        {subscription.active ? "active" : "missing"}
                      </span>
                    </article>
                  ))}
                </div>
              </section>
            </div>

            <section className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/42">
                <Siren className="h-4 w-4 shrink-0" />
                Recent Receipts
              </div>
              <div className="mt-2 text-sm text-white/58">
                Last live Kick receipt: {formatDateTime(health.receiptSummary.lastLiveReceiptAt)}
              </div>

              <div className="mt-4 space-y-3">
                {health.recentReceipts.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-6 text-sm text-white/58">
                    No Kick receipts have been recorded yet.
                  </div>
                ) : (
                  health.recentReceipts.map((receipt) => (
                    <article
                      key={receipt.id}
                      className="flex min-w-0 flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 lg:flex-row lg:items-center lg:justify-between"
                    >
                      <div className="min-w-0">
                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                          <span className="truncate text-sm font-semibold text-white">
                            {receipt.eventType}
                          </span>
                          <span className="inline-flex max-w-full rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/60">
                            {receipt.pointsAwarded > 0 ? "awarded" : "audit"}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-white/58">
                          {receipt.kickUsername ?? "--"} ({receipt.kickUserId ?? "--"})
                        </div>
                        <div className="mt-1 text-xs text-white/40">
                          {formatDateTime(receipt.createdAt)}
                        </div>
                      </div>

                      <div className="flex min-w-0 items-center gap-2">
                        {receipt.pointsAwarded > 0 ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />
                        ) : (
                          <XCircle className="h-4 w-4 shrink-0 text-white/35" />
                        )}
                        <span className="truncate text-sm font-semibold text-white">
                          {receipt.pointsAwarded.toLocaleString()} pts
                        </span>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          </>
        ) : null}
      </section>
    </div>
  );
}

function TopStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/42">
        {label}
      </div>
      <div className="mt-2 truncate text-xl font-bold text-white">{value}</div>
    </div>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-black/20 p-3">
      <div className="text-[11px] uppercase tracking-[0.2em] text-white/42">{label}</div>
      <div className="mt-1 truncate text-sm font-semibold text-white">{value}</div>
    </div>
  );
}
