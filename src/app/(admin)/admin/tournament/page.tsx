"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Crown,
  Loader2,
  RefreshCw,
  RotateCcw,
  Save,
  ShieldAlert,
  Swords,
  XCircle,
} from "lucide-react";
import { LegacyTournamentOverlayFrame } from "@/components/tournament/LegacyTournamentOverlayFrame";
import { TournamentAdminMatchCard } from "@/components/tournament/TournamentAdminMatchCard";
import type {
  TournamentMatchSnapshot,
  TournamentSnapshot,
} from "@/lib/tournament";

type AdminUser = {
  id: string;
  isAdmin: boolean;
};

type TournamentStatus = "draft" | "active" | "completed";

type TournamentMetaForm = {
  title: string;
  description: string;
  status: TournamentStatus;
};

type ChampionForm = {
  championName: string;
  championSlotName: string;
};

const inputClassName =
  "h-12 w-full border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition-all duration-200 placeholder:text-white/28 focus:border-sky-400/30 focus:bg-white/[0.05]";

const textareaClassName =
  "min-h-[120px] w-full border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none transition-all duration-200 placeholder:text-white/28 focus:border-sky-400/30 focus:bg-white/[0.05]";

export default function AdminTournamentPage() {
  const [me, setMe] = useState<AdminUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingTournament, setLoadingTournament] = useState(true);
  const [tournament, setTournament] = useState<TournamentSnapshot | null>(null);
  const [metaForm, setMetaForm] = useState<TournamentMetaForm>({
    title: "",
    description: "",
    status: "draft",
  });
  const [championForm, setChampionForm] = useState<ChampionForm>({
    championName: "",
    championSlotName: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busyKey, setBusyKey] = useState<string | null>(null);

  useEffect(() => {
    void loadUser();
    void loadTournament();
  }, []);

  useEffect(() => {
    if (!tournament) {
      setMetaForm({
        title: "",
        description: "",
        status: "draft",
      });
      setChampionForm({
        championName: "",
        championSlotName: "",
      });
      return;
    }

    setMetaForm({
      title: tournament.title,
      description: tournament.description,
      status: tournament.status,
    });
    setChampionForm({
      championName: tournament.championName ?? "",
      championSlotName: tournament.championSlotName ?? "",
    });
  }, [tournament]);

  const rounds = useMemo(() => {
    if (!tournament) {
      return [];
    }

    return tournament.matches.reduce<
      Array<{
        round: number;
        label: string;
        matches: TournamentMatchSnapshot[];
      }>
    >((groups, match) => {
      const existing = groups.find((item) => item.round === match.round);

      if (existing) {
        existing.matches.push(match);
        return groups;
      }

      groups.push({
        round: match.round,
        label: match.roundLabel,
        matches: [match],
      });

      return groups;
    }, []);
  }, [tournament]);

  const quarterfinalMatches = useMemo(
    () => tournament?.matches.filter((match) => match.round === 1) ?? [],
    [tournament],
  );

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

      setTournament((data as TournamentSnapshot | null) ?? null);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "Could not load tournament",
      );
    } finally {
      setLoadingTournament(false);
    }
  }

  function updateMatchField(
    matchId: string,
    key:
      | "leftViewerName"
      | "rightViewerName"
      | "leftSlotName"
      | "rightSlotName"
      | "leftPayout"
      | "rightPayout",
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
                [key]:
                  key === "leftPayout" || key === "rightPayout"
                    ? Number(value || 0)
                    : value,
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
        description:
          "Live bracket control for the current DirtyGunner slot tournament.",
      },
      "Tournament initialized.",
    );
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
              Live Operator Console
            </div>
            <h1 className="mt-2 truncate text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              Tournament Control
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/58">
              Run the full bracket from this page: seed quarterfinals, set
              payouts, click winners, and let the bracket advance through to the
              champion automatically.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <TopStat value={String(tournament?.matches.length ?? 0)} label="Matches" />
            <TopStat value={tournament?.status ?? "draft"} label="Status" />
            <TopStat
              value={tournament?.championName ?? "Pending"}
              label="Champion"
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

      {loadingTournament ? (
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
            Loading tournament...
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
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/56">
                Create the native tournament shell first, then seed the bracket
                and manage the event from this page.
              </p>
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
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_420px]">
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
                  Bracket Preview
                </div>
                <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                  Event Screen
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/56">
                  This mirrors the public-facing tournament stage so the admin
                  operator can see exactly how current bracket state will read live.
                </p>
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
                  Secondary Controls
                </div>
                <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                  Tournament Meta
                </h2>
              </div>

              <div className="space-y-6 p-5 sm:p-6">
                <Field label="Title">
                  <input
                    value={metaForm.title}
                    onChange={(event) =>
                      setMetaForm((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                    className={inputClassName}
                  />
                </Field>

                <Field label="Description">
                  <textarea
                    value={metaForm.description}
                    onChange={(event) =>
                      setMetaForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    className={textareaClassName}
                  />
                </Field>

                <Field label="Status">
                  <select
                    value={metaForm.status}
                    onChange={(event) =>
                      setMetaForm((current) => ({
                        ...current,
                        status: event.target.value as TournamentStatus,
                      }))
                    }
                    className={inputClassName}
                  >
                    <option value="draft">draft</option>
                    <option value="active">active</option>
                    <option value="completed">completed</option>
                  </select>
                </Field>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() =>
                      void submitAction(
                        "save-meta",
                        {
                          action: "updateTournament",
                          title: metaForm.title,
                          description: metaForm.description,
                          status: metaForm.status,
                        },
                        "Tournament details updated.",
                      )
                    }
                    disabled={busyKey === "save-meta"}
                    className="inline-flex h-12 items-center justify-center gap-2 bg-sky-500 px-4 text-sm font-extrabold uppercase tracking-[0.08em] text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {busyKey === "save-meta" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save Meta
                  </button>

                  <button
                    type="button"
                    onClick={() => void loadTournament()}
                    disabled={busyKey === "refresh"}
                    className="inline-flex h-12 items-center justify-center gap-2 border border-white/8 bg-white/[0.03] px-4 text-sm font-semibold uppercase tracking-[0.08em] text-white transition-all duration-200 hover:bg-white/[0.05]"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </button>
                </div>

                <div className="border-t border-white/8 pt-6">
                  <div className="text-xs font-semibold uppercase tracking-[0.26em] text-white/42">
                    Champion Override
                  </div>
                  <p className="mt-3 text-sm leading-7 text-white/56">
                    Final winner updates automatically. Use this only if you need
                    to force the champion state for production cleanup.
                  </p>

                  <div className="mt-4 space-y-4">
                    <Field label="Champion Name">
                      <input
                        value={championForm.championName}
                        onChange={(event) =>
                          setChampionForm((current) => ({
                            ...current,
                            championName: event.target.value,
                          }))
                        }
                        className={inputClassName}
                        placeholder="Viewer name"
                      />
                    </Field>

                    <Field label="Winning Slot">
                      <input
                        value={championForm.championSlotName}
                        onChange={(event) =>
                          setChampionForm((current) => ({
                            ...current,
                            championSlotName: event.target.value,
                          }))
                        }
                        className={inputClassName}
                        placeholder="Slot title"
                      />
                    </Field>

                    <button
                      type="button"
                      onClick={() =>
                        void submitAction(
                          "champion",
                          {
                            action: "declareChampion",
                            championName: championForm.championName,
                            championSlotName: championForm.championSlotName,
                            status: "completed",
                          },
                          "Champion updated.",
                        )
                      }
                      disabled={busyKey === "champion"}
                      className="inline-flex h-12 w-full items-center justify-center gap-2 border border-amber-300/18 bg-amber-300/10 px-4 text-sm font-semibold uppercase tracking-[0.08em] text-white transition-all duration-200 hover:bg-amber-300/15 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {busyKey === "champion" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Crown className="h-4 w-4" />
                      )}
                      Set Champion
                    </button>
                  </div>
                </div>

                <div className="border-t border-white/8 pt-6">
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
                    className="inline-flex h-11 w-full items-center justify-center gap-2 border border-red-400/18 bg-red-400/10 px-4 text-sm font-semibold uppercase tracking-[0.08em] text-white transition-all duration-200 hover:bg-red-400/15 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {busyKey === "reset-tournament" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RotateCcw className="h-4 w-4" />
                    )}
                    Reset Tournament
                  </button>
                </div>
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
                Simple Setup
              </div>
              <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                Seed The 8 Entrants
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/56">
                Type the viewer name and slot name for each round-one side, save
                the match, then click the winning side when that match is over.
                The public bracket updates from these entries automatically.
              </p>
            </div>

            <div className="grid gap-4 p-5 sm:p-6 xl:grid-cols-2">
              {quarterfinalMatches.map((match) => (
                <SimpleSeedMatchCard
                  key={match.id}
                  match={match}
                  busyKey={busyKey}
                  onFieldChange={updateMatchField}
                  onSave={async (selectedMatch) => {
                    await submitAction(
                      `${selectedMatch.id}-save`,
                      {
                        action: "updateMatch",
                        matchId: selectedMatch.id,
                        leftViewerName: selectedMatch.leftViewerName,
                        rightViewerName: selectedMatch.rightViewerName,
                        leftSlotName: selectedMatch.leftSlotName,
                        rightSlotName: selectedMatch.rightSlotName,
                        leftPayout: selectedMatch.leftPayout,
                        rightPayout: selectedMatch.rightPayout,
                      },
                      `${selectedMatch.label} saved.`,
                    );
                  }}
                  onSetWinner={async (selectedMatch, winnerSide) => {
                    await submitAction(
                      `${selectedMatch.id}-winner-${winnerSide}`,
                      {
                        action: "setWinner",
                        matchId: selectedMatch.id,
                        winnerSide,
                        leftViewerName: selectedMatch.leftViewerName,
                        rightViewerName: selectedMatch.rightViewerName,
                        leftSlotName: selectedMatch.leftSlotName,
                        rightSlotName: selectedMatch.rightSlotName,
                        leftPayout: selectedMatch.leftPayout,
                        rightPayout: selectedMatch.rightPayout,
                      },
                      `${selectedMatch.label} winner updated.`,
                    );
                  }}
                  onClearWinner={async (selectedMatch) => {
                    await submitAction(
                      `${selectedMatch.id}-clear`,
                      {
                        action: "clearWinner",
                        matchId: selectedMatch.id,
                      },
                      `${selectedMatch.label} winner cleared.`,
                    );
                  }}
                />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex min-w-0 items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.26em] text-white/42">
                  Step 2
                </div>
                <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                  Run The Remaining Bracket
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-white/56">
                  After quarterfinal seeding is saved, use these match cards to
                  record semifinal and final payouts and choose winners as the
                  tournament progresses.
                </p>
              </div>

              <div className="hidden shrink-0 lg:block">
                <TopStat
                  value={String(
                    rounds.reduce((total, round) => total + round.matches.length, 0),
                  )}
                  label="Total Matches"
                />
              </div>
            </div>

            {rounds
              .filter((round) => round.round > 1)
              .map((round) => (
              <div key={round.round} className="space-y-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="h-px flex-1 bg-white/8" />
                  <div className="shrink-0 text-sm font-semibold uppercase tracking-[0.24em] text-blue-300/80">
                    {round.label}
                  </div>
                  <div className="h-px flex-1 bg-white/8" />
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                  {round.matches.map((match) => (
                    <TournamentAdminMatchCard
                      key={match.id}
                      match={match}
                      busyKey={busyKey}
                      onFieldChange={updateMatchField}
                      onSave={async (selectedMatch) => {
                        await submitAction(
                          `${selectedMatch.id}-save`,
                          {
                            action: "updateMatch",
                            matchId: selectedMatch.id,
                            leftViewerName: selectedMatch.leftViewerName,
                            rightViewerName: selectedMatch.rightViewerName,
                            leftSlotName: selectedMatch.leftSlotName,
                            rightSlotName: selectedMatch.rightSlotName,
                            leftPayout: selectedMatch.leftPayout,
                            rightPayout: selectedMatch.rightPayout,
                          },
                          `${selectedMatch.label} saved.`,
                        );
                      }}
                      onSetWinner={async (selectedMatch, winnerSide) => {
                        await submitAction(
                          `${selectedMatch.id}-winner-${winnerSide}`,
                          {
                            action: "setWinner",
                            matchId: selectedMatch.id,
                            winnerSide,
                            leftViewerName: selectedMatch.leftViewerName,
                            rightViewerName: selectedMatch.rightViewerName,
                            leftSlotName: selectedMatch.leftSlotName,
                            rightSlotName: selectedMatch.rightSlotName,
                            leftPayout: selectedMatch.leftPayout,
                            rightPayout: selectedMatch.rightPayout,
                          },
                          `${selectedMatch.label} winner updated.`,
                        );
                      }}
                      onClearWinner={async (selectedMatch) => {
                        await submitAction(
                          `${selectedMatch.id}-clear`,
                          {
                            action: "clearWinner",
                            matchId: selectedMatch.id,
                          },
                          `${selectedMatch.label} winner cleared.`,
                        );
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </section>
        </>
      )}
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
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
        {label}
      </div>
      {children}
    </label>
  );
}

function SimpleSeedMatchCard({
  match,
  busyKey,
  onFieldChange,
  onSave,
  onSetWinner,
  onClearWinner,
}: {
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
}) {
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
              Quarterfinal
            </div>
            <h3 className="mt-2 text-lg font-black uppercase tracking-[0.06em] text-white">
              {match.label}
            </h3>
          </div>

          <div className="border border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/62">
            {match.winnerSide ? `Winner: ${match.winnerSide}` : "Awaiting result"}
          </div>
        </div>
      </div>

      <div className="grid gap-px bg-white/8 lg:grid-cols-2">
        <div className="space-y-3 bg-transparent p-4 sm:p-5">
          <div className="text-sm font-black uppercase tracking-[0.08em] text-white">
            Left Side
          </div>
          <Field label="Viewer Name">
            <input
              value={match.leftViewerName ?? ""}
              onChange={(event) =>
                onFieldChange(match.id, "leftViewerName", event.target.value)
              }
              className={inputClassName}
              placeholder="Viewer name"
            />
          </Field>
          <Field label="Slot Name">
            <input
              value={match.leftSlotName ?? ""}
              onChange={(event) =>
                onFieldChange(match.id, "leftSlotName", event.target.value)
              }
              className={inputClassName}
              placeholder="Slot name"
            />
          </Field>
          <Field label="Payout">
            <input
              type="number"
              min="0"
              step="0.01"
              value={String(match.leftPayout ?? 0)}
              onChange={(event) =>
                onFieldChange(match.id, "leftPayout", event.target.value)
              }
              className={inputClassName}
              placeholder="0"
            />
          </Field>
        </div>

        <div className="space-y-3 bg-transparent p-4 sm:p-5">
          <div className="text-sm font-black uppercase tracking-[0.08em] text-white">
            Right Side
          </div>
          <Field label="Viewer Name">
            <input
              value={match.rightViewerName ?? ""}
              onChange={(event) =>
                onFieldChange(match.id, "rightViewerName", event.target.value)
              }
              className={inputClassName}
              placeholder="Viewer name"
            />
          </Field>
          <Field label="Slot Name">
            <input
              value={match.rightSlotName ?? ""}
              onChange={(event) =>
                onFieldChange(match.id, "rightSlotName", event.target.value)
              }
              className={inputClassName}
              placeholder="Slot name"
            />
          </Field>
          <Field label="Payout">
            <input
              type="number"
              min="0"
              step="0.01"
              value={String(match.rightPayout ?? 0)}
              onChange={(event) =>
                onFieldChange(match.id, "rightPayout", event.target.value)
              }
              className={inputClassName}
              placeholder="0"
            />
          </Field>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 px-4 py-4 sm:px-5">
        <button
          type="button"
          onClick={() => void onSave(match)}
          disabled={isBusy}
          className="inline-flex h-11 items-center justify-center gap-2 bg-sky-500 px-4 text-sm font-black uppercase tracking-[0.08em] text-white disabled:cursor-not-allowed disabled:opacity-60"
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
          onClick={() => void onSetWinner(match, "left")}
          disabled={isBusy}
          className="inline-flex h-11 items-center justify-center gap-2 border border-emerald-300/18 bg-emerald-300/10 px-4 text-sm font-semibold uppercase tracking-[0.08em] text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busyKey === `${match.id}-winner-left` ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : null}
          Win Left
        </button>

        <button
          type="button"
          onClick={() => void onSetWinner(match, "right")}
          disabled={isBusy}
          className="inline-flex h-11 items-center justify-center gap-2 border border-amber-300/18 bg-amber-300/10 px-4 text-sm font-semibold uppercase tracking-[0.08em] text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busyKey === `${match.id}-winner-right` ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : null}
          Win Right
        </button>

        <button
          type="button"
          onClick={() => void onClearWinner(match)}
          disabled={isBusy}
          className="inline-flex h-11 items-center justify-center gap-2 border border-white/10 bg-white/[0.03] px-4 text-sm font-semibold uppercase tracking-[0.08em] text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busyKey === `${match.id}-clear` ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RotateCcw className="h-4 w-4" />
          )}
          Clear Winner
        </button>
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
