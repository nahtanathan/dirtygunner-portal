import { unstable_noStore as noStore } from "next/cache";
import { PublicTournamentClient } from "@/components/tournament/PublicTournamentClient";
import { prisma } from "@/lib/prisma";
import { buildTournamentSnapshot, TOURNAMENT_ID } from "@/lib/tournament";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SlotTournamentPage() {
  noStore();

  const tournament = await prisma.tournament.findUnique({
    where: { id: TOURNAMENT_ID },
    include: {
      matches: {
        orderBy: [{ round: "asc" }, { matchNumber: "asc" }],
      },
    },
  });

  const snapshot = buildTournamentSnapshot(tournament);

  return (
    <div className="space-y-6 md:space-y-8">
      <section
        className="relative overflow-hidden rounded-[12px] border border-white/10 px-5 py-6 sm:px-6 md:px-8 md:py-8"
        style={{
          background:
            "linear-gradient(180deg, rgba(6,11,19,0.95) 0%, rgba(4,8,14,0.99) 100%)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.05), 0 35px 90px rgba(2,8,23,0.48)",
        }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                "url('/art/bg-grid.png'), radial-gradient(circle at 12% 50%, rgba(249,115,22,0.14), transparent 30%), radial-gradient(circle at 84% 48%, rgba(56,189,248,0.14), transparent 32%)",
              backgroundSize: "480px 480px, auto, auto",
              backgroundPosition: "center, left center, right center",
            }}
          />
        </div>

        <div className="relative flex min-w-0 flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sky-300/82">
              Event Feed
            </div>
            <h1 className="mt-2 text-3xl font-black uppercase tracking-[0.06em] text-white sm:text-4xl md:text-5xl">
              {snapshot?.title ?? "Slot Tournament"}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-white/58 sm:text-[15px]">
              {snapshot?.description ||
                "Track the live bracket, seeded slot picks, match payouts, and final champion from the current DirtyGunner tournament."}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="border border-white/10 bg-white/[0.03] px-4 py-3">
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
                Format
              </div>
              <div className="mt-2 text-sm font-black uppercase tracking-[0.08em] text-white">
                Eight Entry Bracket
              </div>
            </div>
            <div className="border border-white/10 bg-white/[0.03] px-4 py-3">
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
                Feed
              </div>
              <div className="mt-2 text-sm font-black uppercase tracking-[0.08em] text-sky-200">
                DirtyGunner Live
              </div>
            </div>
            <div className="border border-white/10 bg-white/[0.03] px-4 py-3">
              <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/40">
                State
              </div>
              <div className="mt-2 text-sm font-black uppercase tracking-[0.08em] text-amber-200">
                {snapshot?.status ?? "draft"}
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicTournamentClient initialTournament={snapshot} />
    </div>
  );
}
