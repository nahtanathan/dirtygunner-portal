"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCw, Swords } from "lucide-react";
import { TournamentBracket } from "@/components/tournament/TournamentBracket";
import type { TournamentSnapshot } from "@/lib/tournament";

export function PublicTournamentClient({
  initialTournament,
}: {
  initialTournament: TournamentSnapshot | null;
}) {
  const [tournament, setTournament] = useState<TournamentSnapshot | null>(
    initialTournament,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function refreshTournament() {
      try {
        setIsRefreshing(true);

        const res = await fetch("/api/tournament", {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Could not refresh tournament");
        }

        const data = (await res.json()) as TournamentSnapshot | null;

        if (mounted) {
          setTournament(data);
        }
      } catch (error) {
        console.error("Failed to refresh tournament:", error);
      } finally {
        if (mounted) {
          setIsRefreshing(false);
        }
      }
    }

    const intervalId = window.setInterval(() => {
      void refreshTournament();
    }, 15000);

    return () => {
      mounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  if (!tournament) {
    return (
      <section
        className="relative overflow-hidden rounded-[12px] border border-white/10 p-5 sm:p-6 md:p-8"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,10,18,0.96) 0%, rgba(4,8,15,0.99) 100%)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.05), 0 30px 80px rgba(2,8,23,0.45)",
        }}
      >
        <div className="pointer-events-none absolute inset-0 opacity-[0.14]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/art/bg-grid.png')",
              backgroundSize: "460px 460px",
              backgroundPosition: "center",
            }}
          />
        </div>

        <div className="relative flex min-w-0 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-white/10 bg-white/[0.03] text-white/72">
            <Swords className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-300/80">
              Tournament
            </div>
            <h2 className="mt-2 text-2xl font-bold uppercase tracking-[0.04em] text-white">
              No Tournament Configured
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/56">
              The bracket has not been initialized in admin yet. Once the event
              is seeded, this page will show the full progression live.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/34">
          Live bracket updates refresh automatically every 15 seconds
        </div>

        <button
          type="button"
          onClick={async () => {
            setIsRefreshing(true);

            try {
              const res = await fetch("/api/tournament", {
                method: "GET",
                cache: "no-store",
              });

              const data = (await res.json()) as TournamentSnapshot | null;
              setTournament(data);
            } catch (error) {
              console.error("Failed to refresh tournament:", error);
            } finally {
              setIsRefreshing(false);
            }
          }}
          className="inline-flex h-11 items-center gap-2 self-start border border-white/8 bg-white/[0.03] px-4 text-sm font-semibold uppercase tracking-[0.08em] text-white transition-all duration-200 hover:bg-white/[0.05] sm:self-auto"
        >
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh
        </button>
      </div>

      <TournamentBracket tournament={tournament} mode="public" showRefreshHint />
    </div>
  );
}
