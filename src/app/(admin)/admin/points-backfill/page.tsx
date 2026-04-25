"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  DatabaseZap,
  Loader2,
  Play,
  SearchCheck,
  ShieldAlert,
} from "lucide-react";

import { PageHero } from "@/components/ui/PageHero";

type AdminUser = {
  id: string;
  isAdmin: boolean;
};

type PreviewRow = {
  rowNumber: number;
  kickUserId: string | null;
  kickUsername: string | null;
  points: number;
  status:
    | "create"
    | "update"
    | "skip"
    | "duplicate_in_batch"
    | "already_imported";
  reason: string | null;
  userId: string | null;
  currentPoints: number | null;
  resultingPoints: number | null;
};

type PreviewSummary = {
  totalRows: number;
  readyRows: number;
  skippedRows: number;
  totalPoints: number;
};

type PreviewResponse = {
  ok: boolean;
  dryRun: boolean;
  summary: PreviewSummary;
  rows: PreviewRow[];
  appliedRows?: number;
  error?: string;
};

async function readApiResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  return JSON.parse(text) as T;
}

function rowTone(status: PreviewRow["status"]) {
  switch (status) {
    case "create":
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-100";
    case "update":
      return "border-sky-400/20 bg-sky-400/10 text-sky-100";
    case "already_imported":
      return "border-amber-400/20 bg-amber-400/10 text-amber-100";
    case "duplicate_in_batch":
    case "skip":
      return "border-red-400/20 bg-red-500/10 text-red-100";
  }
}

const textareaClassName =
  "min-h-[260px] w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-white/20 focus:bg-white/[0.05]";

const inputClassName =
  "h-12 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-white/20 focus:bg-white/[0.05]";

const exampleRows = `kick_user_id,kick_username,points
80933,DirtyGunner,1200
123456789,viewer_one,850
987654321,viewer_two,450`;

export default function AdminPointsBackfillPage() {
  const [me, setMe] = useState<AdminUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [batchLabel, setBatchLabel] = useState("");
  const [rowsText, setRowsText] = useState(exampleRows);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<PreviewResponse | null>(null);

  useEffect(() => {
    void loadUser();
  }, []);

  async function loadUser() {
    setLoadingUser(true);

    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        cache: "no-store",
      });

      const data = await readApiResponse<{ user?: AdminUser | null }>(res);
      setMe(data.user ?? null);
    } catch {
      setMe(null);
    } finally {
      setLoadingUser(false);
    }
  }

  async function runImport(dryRun: boolean) {
    if (!batchLabel.trim()) {
      setError("Batch label is required.");
      return;
    }

    if (!rowsText.trim()) {
      setError("Paste at least one row before running the backfill.");
      return;
    }

    setError("");
    setMessage("");

    if (dryRun) {
      setIsPreviewing(true);
    } else {
      setIsApplying(true);
    }

    try {
      const res = await fetch("/api/admin/points-backfill", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          batchLabel: batchLabel.trim(),
          rowsText,
          dryRun,
        }),
      });

      const data = await readApiResponse<PreviewResponse>(res);

      if (!res.ok) {
        throw new Error(data.error || "Could not run points backfill");
      }

      setPreview(data);

      if (dryRun) {
        setMessage("Preview generated. Review the rows before applying.");
      } else {
        setMessage(
          `Backfill applied. ${data.appliedRows ?? 0} row(s) were credited for batch "${batchLabel.trim()}".`,
        );
      }
    } catch (runError) {
      setError(
        runError instanceof Error
          ? runError.message
          : "Could not run points backfill",
      );
    } finally {
      setIsPreviewing(false);
      setIsApplying(false);
    }
  }

  const readyRows = useMemo(
    () => preview?.rows.filter((row) => row.status === "create" || row.status === "update") ?? [],
    [preview],
  );

  if (loadingUser) {
    return (
      <div className="rounded-[32px] border border-white/10 bg-black/20 px-6 py-16 text-center text-white/70">
        <div className="inline-flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading admin tools...
        </div>
      </div>
    );
  }

  if (!me?.isAdmin) {
    return (
      <div className="rounded-[32px] border border-red-500/20 bg-red-500/10 px-6 py-16 text-center">
        <div className="mx-auto flex max-w-md flex-col items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-400/20 bg-red-500/10 text-red-200">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Access denied</h1>
            <p className="mt-2 text-sm leading-6 text-white/65">
              You must be an admin to run points backfills.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHero
        eyebrow="Admin"
        title="Points Backfill"
        description="Kick does not expose a supported historical points balance API, so this tool lets you safely bulk-credit site points from a manual export or curated list."
      />

      {message ? (
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          <div className="flex min-w-0 items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span className="truncate-2">{message}</span>
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          <div className="flex min-w-0 items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span className="truncate-2">{error}</span>
          </div>
        </div>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
        <section className="rounded-3xl border border-white/10 bg-black/20 p-5 sm:p-6">
          <div className="mb-5 min-w-0">
            <div className="text-xs uppercase tracking-[0.32em] text-sky-300/70">
              Batch Setup
            </div>
            <h2 className="mt-2 truncate text-2xl font-bold uppercase tracking-wide text-white">
              Import Input
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/60">
              Use a unique batch label for each import. Reusing the same batch label
              with the same user key will be treated as already imported.
            </p>
          </div>

          <div className="space-y-4">
            <label className="block">
              <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-white/50">
                Batch Label
              </div>
              <input
                value={batchLabel}
                onChange={(event) => setBatchLabel(event.target.value)}
                placeholder="example: kick-preportal-2026-04-01_to_2026-04-25"
                className={inputClassName}
              />
            </label>

            <label className="block">
              <div className="mb-2 text-[11px] uppercase tracking-[0.24em] text-white/50">
                Rows
              </div>
              <textarea
                value={rowsText}
                onChange={(event) => setRowsText(event.target.value)}
                className={textareaClassName}
                spellCheck={false}
              />
            </label>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/68">
              <div className="font-semibold text-white">Supported format</div>
              <div className="mt-2 whitespace-pre-wrap font-mono text-xs leading-6 text-white/58">
                {exampleRows}
              </div>
              <div className="mt-3 space-y-1 text-white/58">
                <div>`kick_user_id` is strongly recommended and can create new users safely.</div>
                <div>`kick_username`-only rows can only match existing site users.</div>
                <div>CSV and TSV are both supported. Comment lines starting with `#` are ignored.</div>
              </div>
            </div>

            <div className="flex min-w-0 flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="button"
                onClick={() => void runImport(true)}
                disabled={isPreviewing || isApplying}
                className="inline-flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPreviewing ? (
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                ) : (
                  <SearchCheck className="h-4 w-4 shrink-0" />
                )}
                <span className="truncate whitespace-nowrap">Preview Dry Run</span>
              </button>

              <button
                type="button"
                onClick={() => void runImport(false)}
                disabled={isPreviewing || isApplying}
                className="inline-flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-5 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isApplying ? (
                  <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                ) : (
                  <Play className="h-4 w-4 shrink-0" />
                )}
                <span className="truncate whitespace-nowrap">Apply Backfill</span>
              </button>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-black/20 p-5 sm:p-6">
          <div className="mb-5 min-w-0">
            <div className="text-xs uppercase tracking-[0.32em] text-sky-300/70">
              Preview
            </div>
            <h3 className="mt-2 truncate text-2xl font-bold uppercase tracking-wide text-white">
              Import Results
            </h3>
          </div>

          {preview ? (
            <>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  icon={<DatabaseZap className="h-4 w-4" />}
                  label="Rows"
                  value={String(preview.summary.totalRows)}
                />
                <StatCard
                  icon={<CheckCircle2 className="h-4 w-4" />}
                  label="Ready"
                  value={String(preview.summary.readyRows)}
                />
                <StatCard
                  icon={<AlertTriangle className="h-4 w-4" />}
                  label="Skipped"
                  value={String(preview.summary.skippedRows)}
                />
                <StatCard
                  icon={<Play className="h-4 w-4" />}
                  label="Points"
                  value={preview.summary.totalPoints.toLocaleString()}
                />
              </div>

              <div className="mt-5 space-y-3">
                {preview.rows.map((row) => (
                  <article
                    key={`${row.rowNumber}-${row.kickUserId ?? row.kickUsername ?? "row"}`}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex min-w-0 flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex max-w-full rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${rowTone(
                              row.status,
                            )}`}
                          >
                            <span className="truncate whitespace-nowrap">{row.status}</span>
                          </span>

                          <span className="inline-flex max-w-full rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/60">
                            <span className="truncate whitespace-nowrap">Row {row.rowNumber}</span>
                          </span>
                        </div>

                        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                          <MiniStat label="Kick User ID" value={row.kickUserId ?? "—"} />
                          <MiniStat label="Kick Username" value={row.kickUsername ?? "—"} />
                          <MiniStat label="Current" value={row.currentPoints?.toLocaleString() ?? "—"} />
                          <MiniStat
                            label="Result"
                            value={row.resultingPoints?.toLocaleString() ?? "—"}
                          />
                        </div>

                        <div className="mt-3 text-sm text-white/70">
                          Granting <span className="font-semibold text-white">{row.points.toLocaleString()}</span> points
                        </div>

                        {row.reason ? (
                          <div className="mt-3 text-sm leading-6 text-white/52">{row.reason}</div>
                        ) : null}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {readyRows.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                  No rows are currently ready to import.
                </div>
              ) : null}
            </>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-10 text-center text-sm text-white/58">
              Run a dry preview to see which rows will create users, update users, or be skipped.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <div className="flex items-center gap-2 text-white/45">{icon}</div>
      <div className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">
        {label}
      </div>
      <div className="mt-1 truncate text-xl font-bold text-white">{value}</div>
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
