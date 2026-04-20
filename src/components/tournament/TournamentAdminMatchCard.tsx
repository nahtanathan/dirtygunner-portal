"use client";

import type { ReactNode } from "react";
import { Loader2, Save, Trophy, XCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { TournamentMatchSnapshot } from "@/lib/tournament";

type TournamentAdminMatchCardProps = {
  match: TournamentMatchSnapshot;
  busyKey: string | null;
  onFieldChange: (
    matchId: string,
    key:
      | "leftViewerName"
      | "rightViewerName"
      | "leftSlotName"
      | "rightSlotName"
      | "leftPayout"
      | "rightPayout",
    value: string,
  ) => void;
  onSave: (match: TournamentMatchSnapshot) => Promise<void>;
  onSetWinner: (
    match: TournamentMatchSnapshot,
    winnerSide: "left" | "right",
  ) => Promise<void>;
  onClearWinner: (match: TournamentMatchSnapshot) => Promise<void>;
};

const inputClassName =
  "h-11 w-full border border-white/10 bg-white/[0.03] px-3 text-sm text-white outline-none transition-all duration-200 placeholder:text-white/24 focus:border-sky-400/32 focus:bg-white/[0.05]";

export function TournamentAdminMatchCard({
  match,
  busyKey,
  onFieldChange,
  onSave,
  onSetWinner,
  onClearWinner,
}: TournamentAdminMatchCardProps) {
  const isSeedRound = match.round === 1;
  const hasLeftSeed = Boolean((match.leftViewerName ?? "").trim());
  const hasRightSeed = Boolean((match.rightViewerName ?? "").trim());
  const isMatchBusy = Boolean(busyKey?.startsWith(match.id));

  return (
    <article
      className="overflow-hidden border border-white/10"
      style={{
        background:
          "linear-gradient(180deg, rgba(10,15,25,0.96) 0%, rgba(6,10,18,0.98) 100%)",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.02), inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <div className="border-b border-white/8 px-4 py-4 sm:px-5">
        <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/38">
              {match.roundLabel}
            </div>
            <h3 className="mt-2 text-lg font-black uppercase tracking-[0.06em] text-white">
              Match {match.matchNumber}
            </h3>
            <p className="mt-2 text-sm text-white/52">
              {isSeedRound
                ? "Seed players, slots, and payouts directly here, then click the winning side."
                : "Semis and finals pull names and slot titles from the previous round automatically."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Pill label={match.winnerSide ? `Winner: ${match.winnerSide}` : "Awaiting result"} />
            <Pill label={isSeedRound ? "Editable seeding" : "Auto-fed"} tone="accent" />
          </div>
        </div>
      </div>

      <div className="grid gap-px bg-white/8 lg:grid-cols-2">
        <SideEditor
          heading="Left Side"
          winnerTone={match.winnerSide === "left"}
          viewerValue={match.leftViewerName ?? ""}
          slotValue={match.leftSlotName ?? ""}
          payoutValue={String(match.leftPayout ?? 0)}
          editableNames={isSeedRound}
          winnerBusy={busyKey === `${match.id}-winner-left`}
          canPickWinner={hasLeftSeed}
          onViewerChange={(value) => onFieldChange(match.id, "leftViewerName", value)}
          onSlotChange={(value) => onFieldChange(match.id, "leftSlotName", value)}
          onPayoutChange={(value) => onFieldChange(match.id, "leftPayout", value)}
          onWin={() => onSetWinner(match, "left")}
        />

        <SideEditor
          heading="Right Side"
          winnerTone={match.winnerSide === "right"}
          viewerValue={match.rightViewerName ?? ""}
          slotValue={match.rightSlotName ?? ""}
          payoutValue={String(match.rightPayout ?? 0)}
          editableNames={isSeedRound}
          winnerBusy={busyKey === `${match.id}-winner-right`}
          canPickWinner={hasRightSeed}
          onViewerChange={(value) => onFieldChange(match.id, "rightViewerName", value)}
          onSlotChange={(value) => onFieldChange(match.id, "rightSlotName", value)}
          onPayoutChange={(value) => onFieldChange(match.id, "rightPayout", value)}
          onWin={() => onSetWinner(match, "right")}
        />
      </div>

      <div className="flex flex-wrap gap-3 px-4 py-4 sm:px-5">
        <button
          type="button"
          onClick={() => void onSave(match)}
          disabled={isMatchBusy}
          className="inline-flex h-11 items-center justify-center gap-2 bg-sky-500 px-4 text-sm font-black uppercase tracking-[0.08em] text-white transition-all duration-200 hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busyKey === `${match.id}-save` ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Match
        </button>

        <button
          type="button"
          onClick={() => void onClearWinner(match)}
          disabled={isMatchBusy}
          className="inline-flex h-11 items-center justify-center gap-2 border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold uppercase tracking-[0.08em] text-white transition-all duration-200 hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busyKey === `${match.id}-clear` ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          Clear Winner
        </button>
      </div>
    </article>
  );
}

function SideEditor({
  heading,
  winnerTone,
  viewerValue,
  slotValue,
  payoutValue,
  editableNames,
  canPickWinner,
  onViewerChange,
  onSlotChange,
  onPayoutChange,
  onWin,
  winnerBusy,
}: {
  heading: string;
  winnerTone: boolean;
  viewerValue: string;
  slotValue: string;
  payoutValue: string;
  editableNames: boolean;
  canPickWinner: boolean;
  onViewerChange: (value: string) => void;
  onSlotChange: (value: string) => void;
  onPayoutChange: (value: string) => void;
  onWin: () => void;
  winnerBusy?: boolean;
}) {
  return (
    <div
      className={cn(
        "p-4 sm:p-5",
        winnerTone ? "bg-sky-400/[0.08]" : "bg-transparent",
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-sm font-black uppercase tracking-[0.08em] text-white">
          {heading}
        </div>
        {winnerTone ? (
          <div className="inline-flex items-center gap-1 border border-sky-300/18 bg-sky-300/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-100">
            <Trophy className="h-3 w-3" />
            Winner
          </div>
        ) : null}
      </div>

      <div className="space-y-3">
        <Field label="Viewer">
          <input
            value={viewerValue}
            onChange={(event) => onViewerChange(event.target.value)}
            className={inputClassName}
            placeholder="Viewer name"
            disabled={!editableNames}
          />
        </Field>

        <Field label="Slot">
          <input
            value={slotValue}
            onChange={(event) => onSlotChange(event.target.value)}
            className={inputClassName}
            placeholder="Slot title"
            disabled={!editableNames}
          />
        </Field>

        <Field label="Payout">
          <input
            type="number"
            min="0"
            step="0.01"
            value={payoutValue}
            onChange={(event) => onPayoutChange(event.target.value)}
            className={inputClassName}
            placeholder="0"
          />
        </Field>

        <button
          type="button"
          onClick={() => void onWin()}
          disabled={winnerBusy || !canPickWinner}
          className={cn(
            "inline-flex h-11 w-full items-center justify-center gap-2 px-4 text-sm font-black uppercase tracking-[0.08em] text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
            winnerTone
              ? "bg-sky-400 text-slate-950 hover:bg-sky-300"
              : "border border-white/10 bg-white/[0.03] hover:bg-white/[0.05]",
          )}
        >
          {winnerBusy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trophy className="h-4 w-4" />
          )}
          {heading === "Left Side" ? "Win Left" : "Win Right"}
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block min-w-0">
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/42">
        {label}
      </div>
      {children}
    </label>
  );
}

function Pill({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "neutral" | "accent";
}) {
  return (
    <div
      className={cn(
        "border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em]",
        tone === "accent"
          ? "border-sky-300/18 bg-sky-300/10 text-sky-100"
          : "border-white/10 bg-white/[0.03] text-white/62",
      )}
    >
      {label}
    </div>
  );
}
