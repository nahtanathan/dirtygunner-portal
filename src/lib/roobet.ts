import { LeaderboardEntry } from "@/lib/types";

type RoobetAffiliateStat = {
  uid: string;
  username: string;
  wagered: number;
  weightedWagered?: number;
  favoriteGameId?: string;
  favoriteGameTitle?: string;
  rankLevel?: number;
  rankLevelImage?: string;
  highestMultiplier?: {
    multiplier?: number;
    wagered?: number;
    payout?: number;
    gameId?: string;
    gameTitle?: string;
  };
};

type GetLeaderboardOptions = {
  startDate?: string;
  endDate?: string;
};

const API_BASE = "https://roobetconnect.com/affiliate/v2/stats";

function blurUsername(username: string) {
  if (!username) return "••••";
  if (username.length <= 2) return `${username[0] ?? "•"}•`;

  const first = username.slice(0, 2);
  const last = username.slice(-1);
  return `${first}${"•".repeat(Math.max(username.length - 3, 3))}${last}`;
}

function getPrizeForRank(rank: number) {
  if (rank === 1) return 300;
  if (rank === 2) return 200;
  if (rank === 3) return 150;
  if (rank === 4) return 100;
  if (rank === 5) return 75;
  if (rank === 6) return 60;
  if (rank === 7) return 50;
  if (rank === 8) return 30;
  if (rank === 9) return 20;
  if (rank === 10) return 15;
  return undefined;
}

export async function getRoobetLeaderboard(
  options: GetLeaderboardOptions = {}
): Promise<LeaderboardEntry[]> {
  const token = process.env.ROOBET_API_TOKEN;
  const userId = process.env.ROOBET_USER_ID;

  if (!token || !userId) {
    throw new Error("Missing ROOBET_API_TOKEN or ROOBET_USER_ID in environment variables.");
  }

  const params = new URLSearchParams({
    userId,
    categories: "slots,provably fair",
    gameIdentifiers: "-housegames:dice",
    sortBy: "wagered",
  });

  if (options.startDate) params.set("startDate", options.startDate);
  if (options.endDate) params.set("endDate", options.endDate);

  const response = await fetch(`${API_BASE}?${params.toString()}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    next: { revalidate: 900 },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Roobet API failed: ${response.status} ${response.statusText} ${body}`);
  }

  const data = (await response.json()) as RoobetAffiliateStat[];

  return data
    .map((item) => ({
      uid: item.uid,
      username: blurUsername(item.username),
      wageredTotal: Number(item.weightedWagered ?? item.wagered ?? 0),
    }))
    .sort((a, b) => b.wageredTotal - a.wageredTotal)
    .slice(0, 50)
    .map((item, index) => ({
      rank: index + 1,
      username: item.username,
      wageredTotal: item.wageredTotal,
      prize: getPrizeForRank(index + 1),
    }));
}