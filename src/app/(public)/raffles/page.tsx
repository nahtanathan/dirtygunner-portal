// FILE: src/app/(public)/raffles/page.tsx
import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { PageHero } from "@/components/ui/PageHero";
import { PublicRafflesClient } from "@/components/raffles/PublicRafflesClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PublicRafflePageItem = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  status: "active" | "ended";
  entryMethod: string;
  entryCost: number;
  entryCurrency: "bullets" | "points";
  maxEntriesPerUser: number | null;
  totalEntries: number;
  currentUserEntries: number;
  currentUserPoints: number | null;
  startDate: string;
  endDate: string;
  winner: string | null;
  prizeDetails: string;
  winners: number;
};

const DEFAULT_RAFFLE_IMAGE = "/prizes/cash-stack.png";

export default async function RafflesPage() {
  noStore();

  const session = await getSession();

  const [viewer, rows] = await Promise.all([
    session?.sub
      ? prisma.user.findUnique({
          where: { id: session.sub },
          select: {
            id: true,
            points: true,
          },
        })
      : Promise.resolve(null),
    prisma.raffle.findMany({
      orderBy: [{ status: "asc" }, { endDate: "asc" }, { createdAt: "desc" }],
      include: {
        entries: {
          select: {
            userId: true,
          },
        },
      },
    }),
  ]);

  const raffles: PublicRafflePageItem[] = rows.map((item) => {
    const totalEntries = item.entries.length;
    const currentUserEntries = viewer
      ? item.entries.filter((entry) => entry.userId === viewer.id).length
      : 0;

    return {
      id: item.id,
      title: item.title,
      description: item.description ?? "",
      image: item.image || DEFAULT_RAFFLE_IMAGE,
      status: item.status === "active" ? "active" : "ended",
      entryMethod: item.entryMethod,
      entryCost: item.entryCost,
      entryCurrency: item.entryCurrency === "points" ? "points" : "bullets",
      maxEntriesPerUser: item.maxEntriesPerUser,
      totalEntries,
      currentUserEntries,
      currentUserPoints: viewer?.points ?? null,
      startDate: item.startDate.toISOString(),
      endDate: item.endDate.toISOString(),
      winner: item.winner,
      prizeDetails: item.prizeDetails,
      winners: item.winner ? 1 : inferWinnerCount(item.prizeDetails),
    };
  });

  return (
    <div className="space-y-8 md:space-y-10">
      <PageHero
        eyebrow="Raffles"
        title="Raffles"
        description="Enter live raffles, check your entries, and see who won."
      />

      <PublicRafflesClient initialRaffles={raffles} />
    </div>
  );
}

function inferWinnerCount(prizeDetails: string) {
  const match = prizeDetails.match(/(\d+)\s*winners?/i);
  if (!match) return 1;

  const value = Number(match[1]);
  return Number.isFinite(value) && value > 0 ? value : 1;
}
