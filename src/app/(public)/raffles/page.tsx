// FILE: src/app/(public)/raffles/page.tsx

import { cookies } from "next/headers";
import { unstable_noStore as noStore } from "next/cache";
import { Gift } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHero } from "@/components/ui/PageHero";
import { PublicRafflesClient } from "@/components/raffles/PublicRafflesClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function RafflesPage() {
  noStore();

  const cookieStore = await cookies();
  const sessionUserId = cookieStore.get("session_user_id")?.value ?? null;

  const [viewer, rows] = await Promise.all([
    sessionUserId
      ? prisma.user.findUnique({
          where: { id: sessionUserId },
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

  const raffles = rows.map((item) => {
    const totalEntries = item.entries.length;
    const currentUserEntries = viewer
      ? item.entries.filter((entry) => entry.userId === viewer.id).length
      : 0;

    return {
      id: item.id,
      title: item.title,
      description: item.description ?? "",
      image: item.image,
      status: item.status === "active" ? "active" : "ended",
      entryMethod: item.entryMethod,
      entryCost: item.entryCost,
      entryCurrency:
        item.entryCurrency === "points" ? "points" : "bullets",
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
    <div className="space-y-8">
      <PageHero
        eyebrow="Raffles"
        title="Live Community Raffles"
        description="Enter premium community raffles, track your entries in real time, and watch each draw close down to the second."
        aside={
          <div
            className="rounded-[28px] border p-5"
            style={{
              borderColor: "rgba(255,255,255,0.08)",
              background:
                "linear-gradient(180deg, rgba(9,14,28,0.88) 0%, rgba(5,10,22,0.94) 100%)",
              boxShadow:
                "0 0 0 1px rgba(56,189,248,0.08), 0 24px 60px rgba(2,8,23,0.45)",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(56,189,248,0.18), rgba(59,130,246,0.12))",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
                }}
              >
                <Gift className="h-5 w-5 text-sky-300" />
              </div>

              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.28em] text-white/45">
                  Portal Status
                </div>
                <div className="mt-1 text-lg font-bold text-white">
                  {raffles.filter((item) => item.status === "active").length} Active
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <MetricTile
                value={raffles.length.toString()}
                label="Total Raffles"
              />
              <MetricTile
                value={raffles
                  .reduce((sum, item) => sum + item.totalEntries, 0)
                  .toLocaleString()}
                label="Total Entries"
              />
            </div>
          </div>
        }
      />

      <PublicRafflesClient initialRaffles={raffles} />
    </div>
  );
}

function MetricTile({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div
      className="rounded-2xl border px-4 py-3"
      style={{
        borderColor: "rgba(255,255,255,0.08)",
        background: "rgba(255,255,255,0.03)",
      }}
    >
      <div className="text-lg font-bold text-white">{value}</div>
      <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/45">
        {label}
      </div>
    </div>
  );
}

function inferWinnerCount(prizeDetails: string) {
  const match = prizeDetails.match(/(\d+)\s*winners?/i);
  if (!match) return 1;

  const value = Number(match[1]);
  return Number.isFinite(value) && value > 0 ? value : 1;
}