import { unstable_noStore as noStore } from "next/cache";
import { PageHero } from "@/components/ui/PageHero";
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
    <div className="space-y-8 md:space-y-10">
      <PageHero
        eyebrow="Slot Tournament"
        title={snapshot?.title ?? "Slot Tournament"}
        description={
          snapshot?.description ||
          "Track the live bracket, match outcomes, and final champion from the current DirtyGunner tournament."
        }
      />

      <PublicTournamentClient initialTournament={snapshot} />
    </div>
  );
}
