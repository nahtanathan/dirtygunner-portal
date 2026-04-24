"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Loader2,
  RefreshCw,
  RotateCcw,
  Save,
  ShieldAlert,
  Swords,
  Trophy,
  XCircle,
} from "lucide-react";
import { LegacyTournamentOverlayFrame } from "@/components/tournament/LegacyTournamentOverlayFrame";
import type {
  TournamentMatchSnapshot,
  TournamentSnapshot,
} from "@/lib/tournament";

type AdminUser = {
  id: string;
  isAdmin: boolean;
};

type SeedSlot = {
  seedNumber: number;
  matchId: string;
  side: "left" | "right";
  bracketLabel: string;
  viewerName: string;
  slotName: string;
};

const inputClassName =
  "h-12 w-full border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition-all duration-200 placeholder:text-white/28 focus:border-sky-400/30 focus:bg-white/[0.05]";

export default function AdminTournamentPage() {
  const [me, setMe] = useState<AdminUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingTournament, setLoadingTournament] = useState(true);
  const [repairingBracket, setRepairingBracket] = useState(false);
  const [tournament, setTournament] = useState<TournamentSnapshot | null>(null);
  const [poolPercentInput, setPoolPercentInput] = useState("10");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busyKey, setBusyKey] = useState<string | null>(null);

  useEffect(() => {
    void loadUser();
    void loadTournament();
  }, []);

  useEffect(() => {
    setPoolPercentInput(String(tournament?.poolContributionPercent ?? 10));
  }, [tournament?.poolContributionPercent]);

  const quarterfinalMatches = useMemo(
    () =>
      [...(tournament?.matches ?? [])]
        .filter((match) => match.round === 1)
        .sort((left, right) => left.matchNumber - right.matchNumber),
    [tournament],
  );

  const semifinalMatches = useMemo(
    () =>
      [...(tournament?.matches ?? [])]
        .filter((match) => match.round === 2)
        .sort((left, right) => left.matchNumber - right.matchNumber),
    [tournament],
  );

  const finalMatch = useMemo(
    () => tournament?.matches.find((match) => match.round === 3) ?? null,
    [tournament],
  );

  const seedSlots = useMemo<SeedSlot[]>(() => {
    const positions: SeedSlot[] = [];

    for (const match of quarterfinalMatches) {
      positions.push({
        seedNumber: positions.length + 1,
        matchId: match.id,
        side: "left",
        bracketLabel: `${match.label} Left`,
        viewerName: match.leftViewerName ?? "",
        slotName: match.leftSlotName ?? "",
      });

      positions.push({
        seedNumber: positions.length + 1,
        matchId: match.id,
        side: "right",
        bracketLabel: `${match.label} Right`,
        viewerName: match.rightViewerName ?? "",
        slotName: match.rightSlotName ?? "",
      });
    }

    return positions;
  }, [quarterfinalMatches]);

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

  async function loadTournament() {
    setLoadingTournament(true);
    setError("");

    try {
      const res = await fetch("/api/tournament", {
        method: "GET",
        cache: "no-store",
      });

      const data = (await res.json()) as TournamentSnapshot | null | { error?: string };

      if (!res.ok) {
        throw new Error(
          typeof data === "object" && data && "error" in data
            ? data.error || "Could not load tournament"
            : "Could not load tournament",
        );
      }

      let snapshot = (data as TournamentSnapshot | null) ?? null;

      if (snapshot && snapshot.matches.length === 0) {
        setRepairingBracket(true);

        const repairRes = await fetch("/api/tournament", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action: "repairBracket" }),
        });

        const repairData = (await repairRes.json()) as
          | TournamentSnapshot
          | { error?: string };

        if (!repairRes.ok) {
          throw new Error(
            typeof repairData === "object" && repairData && "error" in repairData
              ? repairData.error || "Could not repair tournament bracket"
              : "Could not repair tournament bracket",
          );
        }

        snapshot = repairData as TournamentSnapshot;
      }

      setTournament(snapshot);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Could not load tournament",
      );
    } finally {
      setRepairingBracket(false);
      setLoadingTournament(false);
    }
  }

  function updateSeedField(
    seedNumber: number,
    key: "viewerName" | "slotName",
    value: string,
  ) {
    setTournament((current) => {
      if (!current) {
        return current;
      }

      const targetSeed = seedSlots.find((item) => item.seedNumber === seedNumber);

      if (!targetSeed) {
        return current;
      }

      return {
        ...current,
        matches: current.matches.map((match) => {
          if (match.id !== targetSeed.matchId) {
            return match;
          }

          if (targetSeed.side === "left") {
            return {
              ...match,
              leftViewerName:
                key === "viewerName" ? value : (match.leftViewerName ?? ""),
              leftSlotName:
                key === "slotName" ? value : (match.leftSlotName ?? ""),
            };
          }

          return {
            ...match,
            rightViewerName:
              key === "viewerName" ? value : (match.rightViewerName ?? ""),
            rightSlotName:
              key === "slotName" ? value : (match.rightSlotName ?? ""),
          };
        }),
      };
    });
  }

  function updateMatchPayout(
    matchId: string,
    side: "left" | "right",
    value: string,
  ) {
    setTournament((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        matches: current.matches.map((match) =>
          match.id === matchId
            ? {
                ...match,
                [side === "left" ? "leftPayout" : "rightPayout"]: Number(value || 0),
              }
            : match,
        ),
      };
    });
  }

  async function submitAction(
    key: string,
    body: Record<string, unknown>,
    successMessage: string,
  ) {
    setBusyKey(key);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/tournament", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = (await res.json()) as TournamentSnapshot | { error?: string };

      if (!res.ok) {
        throw new Error(
          typeof data === "object" && data && "error" in data
            ? data.error || "Request failed"
            : "Request failed",
        );
      }

      setTournament(data as TournamentSnapshot);
      setMessage(successMessage);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Request failed",
      );
    } finally {
      setBusyKey(null);
    }
  }

  async function handleInitialize() {
    await submitAction(
      "initialize",
      {
        action: "initialize",
        title: "Slot Tournament",
        description: "DirtyGunner slot tournament bracket.",
      },
      "Tournament initialized.",
    );
  }

  async function handleSaveSeeds() {
    if (!tournament) {
      return;
    }

    const roundOneMatches = tournament.matches
      .filter((match) => match.round === 1)
      .sort((left, right) => left.matchNumber - right.matchNumber);

    await submitAction(
      "save-seeds",
      {
        action: "updateSeeds",
        seeds: roundOneMatches.map((match) => ({
          matchId: match.id,
          leftViewerName: match.leftViewerName,
          rightViewerName: match.rightViewerName,
          leftSlotName: match.leftSlotName,
          rightSlotName: match.rightSlotName,
        })),
      },
      "Seeds saved.",
    );
  }

  async function handleSaveResult(match: TournamentMatchSnapshot) {
    await submitAction(
      `${match.id}-save`,
      {
        action: "updateMatch",
        matchId: match.id,
        leftPayout: match.leftPayout,
        rightPayout: match.rightPayout,
      },
      `${match.label} result saved.`,
    );
  }

  function getAutomaticWinner(match: TournamentMatchSnapshot) {
    const hasLeft = Boolean((match.leftViewerName ?? "").trim());
    const hasRight = Boolean((match.rightViewerName ?? "").trim());

    if (!hasLeft || !hasRight) {
      return null;
    }

    if (match.leftPayout > match.rightPayout) {
      return "left";
    }

    if (match.rightPayout > match.leftPayout) {
      return "right";
    }

    return null;
  }

  if (loadingUser) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="inline-flex items-center gap-3 border border-white/10 bg-white/[0.03] px-5 py-4 text-white/75">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading tournament admin...
        </div>
      </div>
    );
  }

  if (!me?.isAdmin) {
    return (
      <div
        className="mx-auto max-w-3xl border p-8"
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
          You must be an admin to manage the slot tournament.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[1440px] space-y-6">
      <section
        className="overflow-hidden border p-5 sm:p-6 md:p-8"
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
              Simple Tournament Admin
            </div>
            <h1 className="mt-2 truncate text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Enter Seeds, Amounts, And Let It Flow
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/58">
              Enter the 8 players, save the seeds, then enter each side&apos;s win
              amount. The higher amount advances automatically. Every winning
              result adds its cut into the champion prize pool.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <TopStat value={String(tournament?.matches.length ?? 0)} label="Matches" />
            <TopStat
              value={`${tournament?.poolContributionPercent ?? 10}%`}
              label="Pool Cut"
            />
            <TopStat
              value={`$${tournament?.prizeAmount ?? 0}`}
              label="Prize Pool"
            />
          </div>
        </div>
      </section>

      {message ? (
        <Notice tone="success" icon={<CheckCircle2 className="h-4 w-4" />}>
          {message}
        </Notice>
      ) : null}

      {error ? (
        <Notice tone="error" icon={<XCircle className="h-4 w-4" />}>
          {error}
        </Notice>
      ) : null}

      {loadingTournament || repairingBracket ? (
        <section
          className="border px-6 py-10 text-center text-white/65"
          style={{
            borderColor: "rgba(255,255,255,0.08)",
            background:
              "linear-gradient(180deg, rgba(12,18,34,0.96) 0%, rgba(7,12,24,0.98) 100%)",
          }}
        >
          <div className="inline-flex items-center gap-3">
            <Loader2 className="h-4 w-4 animate-spin" />
            {repairingBracket ? "Repairing bracket..." : "Loading tournament..."}
          </div>
        </section>
      ) : !tournament ? (
        <section
          className="border p-6 sm:p-8"
          style={{
            borderColor: "rgba(255,255,255,0.08)",
            background:
              "linear-gradient(180deg, rgba(12,18,34,0.96) 0%, rgba(7,12,24,0.98) 100%)",
          }}
        >
          <div className="flex min-w-0 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-[0.26em] text-white/42">
                Tournament
              </div>
              <h2 className="mt-2 text-2xl font-bold text-white">
                No Tournament Initialized
              </h2>
            </div>

            <button
              type="button"
              onClick={() => void handleInitialize()}
              disabled={busyKey === "initialize"}
              className="inline-flex h-12 min-w-0 items-center justify-center gap-2 bg-sky-500 px-5 text-sm font-extrabold uppercase tracking-[0.08em] text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busyKey === "initialize" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Swords className="h-4 w-4" />
              )}
              Initialize Tournament
            </button>
          </div>
        </section>
      ) : (
        <>
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_360px]">
            <section
              className="overflow-hidden border"
              style={{
                borderColor: "rgba(255,255,255,0.08)",
                background:
                  "linear-gradient(180deg, rgba(12,18,34,0.96) 0%, rgba(7,12,24,0.98) 100%)",
              }}
            >
              <div className="border-b border-white/8 px-5 py-5 sm:px-6">
                <div className="text-xs font-semibold uppercase tracking-[0.26em] text-white/42">
                  Public View
                </div>
                <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                  Live Bracket Preview
                </h2>
              </div>

              <div className="p-3 sm:p-4">
                <div className="overflow-hidden border border-white/8 bg-black">
                  <LegacyTournamentOverlayFrame className="aspect-[16/9] w-full border-0" />
                </div>
              </div>
            </section>

            <section
              className="overflow-hidden border"
              style={{
                borderColor: "rgba(255,255,255,0.08)",
                background:
                  "linear-gradient(180deg, rgba(12,18,34,0.96) 0%, rgba(7,12,24,0.98) 100%)",
              }}
            >
              <div className="border-b border-white/8 px-5 py-5 sm:px-6">
                <div className="text-xs font-semibold uppercase tracking-[0.26em] text-white/42">
                  Prize Pool
                </div>
                <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                  Pool Settings
                </h2>
              </div>

              <div className="space-y-4 p-5 sm:p-6">
                <Field label="Winning Cut Percent">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={poolPercentInput}
                    onChange={(event) => setPoolPercentInput(event.target.value)}
                    className={inputClassName}
                    placeholder="10"
                  />
                </Field>

                <button
                  type="button"
                  onClick={() =>
                    void submitAction(
                      "save-pool-percent",
                      {
                        action: "updatePoolContribution",
                        poolContributionPercent: Number(poolPercentInput || 10),
                      },
                      "Pool contribution updated.",
                    )
                  }
                  disabled={busyKey === "save-pool-percent"}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 bg-sky-500 px-4 text-sm font-extrabold uppercase tracking-[0.08em] text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {busyKey === "save-pool-percent" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Pool Percent
                </button>

                <div className="border border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/78">
                  Current champion prize:{" "}
                  <span className="font-bold text-white">
                    ${tournament.prizeAmount}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => void loadTournament()}
                  disabled={busyKey === "refresh"}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 border border-white/8 bg-white/[0.03] px-4 text-sm font-semibold uppercase tracking-[0.08em] text-white transition-all duration-200 hover:bg-white/[0.05]"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (!window.confirm("Reset the full tournament bracket?")) {
                      return;
                    }

                    void submitAction(
                      "reset-tournament",
                      { action: "resetTournament" },
                      "Tournament reset.",
                    );
                  }}
                  disabled={busyKey === "reset-tournament"}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 border border-red-400/18 bg-red-400/10 px-4 text-sm font-semibold uppercase tracking-[0.08em] text-white transition-all duration-200 hover:bg-red-400/15 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {busyKey === "reset-tournament" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RotateCcw className="h-4 w-4" />
                  )}
                  Reset Tournament
                </button>
              </div>
            </section>
          </div>

          <section
            className="overflow-hidden border"
            style={{
              borderColor: "rgba(255,255,255,0.08)",
              background:
                "linear-gradient(180deg, rgba(12,18,34,0.96) 0%, rgba(7,12,24,0.98) 100%)",
            }}
          >
            <div className="border-b border-white/8 px-5 py-5 sm:px-6">
              <div className="text-xs font-semibold uppercase tracking-[0.26em] text-white/42">
                Step 1
              </div>
              <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                Enter Seeds 1 Through 8
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/56">
                Seeds 1 to 4 fill the left side top-down. Seeds 5 to 8 fill the
                right side top-down.
              </p>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {seedSlots.map((seed) => (
                  <SeedInputCard
                    key={seed.seedNumber}
                    seed={seed}
                    onViewerChange={(value) =>
                      updateSeedField(seed.seedNumber, "viewerName", value)
                    }
                    onSlotChange={(value) =>
                      updateSeedField(seed.seedNumber, "slotName", value)
                    }
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => void handleSaveSeeds()}
                disabled={busyKey === "save-seeds" || seedSlots.length === 0}
                className="inline-flex h-12 items-center justify-center gap-2 bg-sky-500 px-5 text-sm font-extrabold uppercase tracking-[0.08em] text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busyKey === "save-seeds" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save All Seeds
              </button>
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.26em] text-white/42">
                Step 2
              </div>
              <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                Quarterfinal Results
              </h2>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              {quarterfinalMatches.map((match) => (
                <AmountResultCard
                  key={match.id}
                  match={match}
                  busyKey={busyKey}
                  onLeftAmountChange={(value) =>
                    updateMatchPayout(match.id, "left", value)
                  }
                  onRightAmountChange={(value) =>
                    updateMatchPayout(match.id, "right", value)
                  }
                  onSave={() => void handleSaveResult(match)}
                />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.26em] text-white/42">
                Step 3
              </div>
              <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                Semifinal And Final Results
              </h2>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              {semifinalMatches.map((match) => (
                <AmountResultCard
                  key={match.id}
                  match={match}
                  busyKey={busyKey}
                  onLeftAmountChange={(value) =>
                    updateMatchPayout(match.id, "left", value)
                  }
                  onRightAmountChange={(value) =>
                    updateMatchPayout(match.id, "right", value)
                  }
                  onSave={() => void handleSaveResult(match)}
                />
              ))}

              {finalMatch ? (
                <AmountResultCard
                  match={finalMatch}
                  busyKey={busyKey}
                  onLeftAmountChange={(value) =>
                    updateMatchPayout(finalMatch.id, "left", value)
                  }
                  onRightAmountChange={(value) =>
                    updateMatchPayout(finalMatch.id, "right", value)
                  }
                  onSave={() => void handleSaveResult(finalMatch)}
                />
              ) : null}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function SeedInputCard({
  seed,
  onViewerChange,
  onSlotChange,
}: {
  seed: SeedSlot;
  onViewerChange: (value: string) => void;
  onSlotChange: (value: string) => void;
}) {
  return (
    <article
      className="overflow-hidden border border-white/10 p-4"
      style={{
        background:
          "linear-gradient(180deg, rgba(10,15,25,0.96) 0%, rgba(6,10,18,0.98) 100%)",
      }}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-lg font-black uppercase tracking-[0.08em] text-white">
          Seed {seed.seedNumber}
        </div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/42">
          {seed.bracketLabel}
        </div>
      </div>

      <div className="space-y-3">
        <Field label="Username">
          <input
            value={seed.viewerName}
            onChange={(event) => onViewerChange(event.target.value)}
            className={inputClassName}
            placeholder={`Player ${seed.seedNumber}`}
          />
        </Field>

        <Field label="Slot Name">
          <input
            value={seed.slotName}
            onChange={(event) => onSlotChange(event.target.value)}
            className={inputClassName}
            placeholder="Slot title"
          />
        </Field>
      </div>
    </article>
  );
}

function AmountResultCard({
  match,
  busyKey,
  onLeftAmountChange,
  onRightAmountChange,
  onSave,
}: {
  match: TournamentMatchSnapshot;
  busyKey: string | null;
  onLeftAmountChange: (value: string) => void;
  onRightAmountChange: (value: string) => void;
  onSave: () => void;
}) {
  const automaticWinner = getAutomaticWinner(match);
  const isBusy = Boolean(busyKey?.startsWith(match.id));

  return (
    <article
      className="overflow-hidden border border-white/10"
      style={{
        background:
          "linear-gradient(180deg, rgba(10,15,25,0.96) 0%, rgba(6,10,18,0.98) 100%)",
      }}
    >
      <div className="border-b border-white/8 px-4 py-4 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/38">
              {match.roundLabel}
            </div>
            <h3 className="mt-2 text-lg font-black uppercase tracking-[0.06em] text-white">
              {match.label}
            </h3>
          </div>

          <div className="border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/62">
            {automaticWinner === "left"
              ? "Left advances"
              : automaticWinner === "right"
                ? "Right advances"
                : "Tie or incomplete"}
          </div>
        </div>
      </div>

      <div className="grid gap-px bg-white/8 lg:grid-cols-2">
        <AmountSidePanel
          title="Left"
          viewerName={match.leftViewerName}
          slotName={match.leftSlotName}
          amount={String(match.leftPayout ?? 0)}
          isWinner={automaticWinner === "left"}
          onAmountChange={onLeftAmountChange}
        />
        <AmountSidePanel
          title="Right"
          viewerName={match.rightViewerName}
          slotName={match.rightSlotName}
          amount={String(match.rightPayout ?? 0)}
          isWinner={automaticWinner === "right"}
          onAmountChange={onRightAmountChange}
        />
      </div>

      <div className="px-4 py-4 sm:px-5">
        <button
          type="button"
          onClick={onSave}
          disabled={isBusy}
          className="inline-flex h-11 items-center justify-center gap-2 bg-sky-500 px-4 text-sm font-black uppercase tracking-[0.08em] text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busyKey === `${match.id}-save` ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Result
        </button>
      </div>
    </article>
  );
}

function AmountSidePanel({
  title,
  viewerName,
  slotName,
  amount,
  isWinner,
  onAmountChange,
}: {
  title: string;
  viewerName: string | null;
  slotName: string | null;
  amount: string;
  isWinner: boolean;
  onAmountChange: (value: string) => void;
}) {
  return (
    <div
      className="p-4 sm:p-5"
      style={{
        background: isWinner ? "rgba(56,189,248,0.08)" : "transparent",
      }}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="text-sm font-black uppercase tracking-[0.08em] text-white">
          {title} Side
        </div>
        {isWinner ? <Trophy className="h-4 w-4 text-sky-300" /> : null}
      </div>

      <div className="space-y-2">
        <div className="text-lg font-bold text-white">
          {viewerName?.trim() || "Awaiting previous round"}
        </div>
        <div className="text-sm text-white/55">
          {slotName?.trim() || "No slot selected"}
        </div>
      </div>

      <div className="mt-4">
        <Field label="Win Amount">
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(event) => onAmountChange(event.target.value)}
            className={inputClassName}
            placeholder="0"
          />
        </Field>
      </div>
    </div>
  );
}

function getAutomaticWinner(match: TournamentMatchSnapshot) {
  const hasLeft = Boolean((match.leftViewerName ?? "").trim());
  const hasRight = Boolean((match.rightViewerName ?? "").trim());

  if (!hasLeft || !hasRight) {
    return null;
  }

  if (match.leftPayout > match.rightPayout) {
    return "left";
  }

  if (match.rightPayout > match.leftPayout) {
    return "right";
  }

  return null;
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
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
        {label}
      </div>
      {children}
    </label>
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
      className="min-w-0 border px-4 py-3"
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
  tone: "success" | "error";
  icon: ReactNode;
  children: ReactNode;
}) {
  const isSuccess = tone === "success";

  return (
    <div
      className="border px-4 py-3 text-sm"
      style={{
        borderColor: isSuccess
          ? "rgba(34,197,94,0.18)"
          : "rgba(239,68,68,0.18)",
        background: isSuccess
          ? "rgba(34,197,94,0.08)"
          : "rgba(239,68,68,0.08)",
        color: "rgba(255,255,255,0.86)",
      }}
    >
      <div className="flex min-w-0 items-center gap-2">
        <span className="shrink-0">{icon}</span>
        <span className="truncate-2">{children}</span>
      </div>
    </div>
  );
}
