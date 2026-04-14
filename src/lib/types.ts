// FILE: src/lib/types.ts

// FILE: src/lib/types.ts

export type SiteSettings = {
  kickUrl: string;
  discordUrl?: string;
  youtubeUrl?: string;
};

export type PrizeTier = {
  place: number;
  prize: number;
};

export type LeaderboardSettings = {
  title: string;
  subtitle: string;
  countdownTarget: string;
  startDate?: string;
  endDate?: string;
  prizeTiers: PrizeTier[];
};

export type LeaderboardEntry = {
  id?: string;
  rank?: number;
  username: string;
  wagered?: number;
  wageredTotal?: number;
  prize?: number | null;
};

export type Raffle = {
  id: string;
  title: string;
  description?: string | null;
  status: "active" | "ended";
  entryMethod: string;
  entryCost: number;
  entryCurrency: "bullets" | "points";
  maxEntriesPerUser?: number | null;
  totalEntries: number;
  uniqueEntrants?: number;
  totalSpent?: number;
  currentUserEntries?: number;
  currentUserPoints?: number | null;
  startDate: string;
  endDate: string;
  prizeDetails: string;
  winner?: string | null;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type Challenge = {
  id: string;
  title: string;
  description?: string | null;
  status: "active" | "completed";
  goal: number;
  currentProgress: number;
  reward: string;
  startDate: string;
  endDate: string;
  createdAt?: string;
  updatedAt?: string;
};

export type BonusHuntBonus = {
  id: string;
  slotName: string;
  provider?: string;
  betSize?: number;
  payout?: number;
  multiplier?: number;
};

export type BonusHunt = {
  id: string;
  title: string;
  date?: string;
  updatedAt?: string;
  status: "active" | "archived" | "opening" | "completed";
  provider?: string;
  casino?: string;
  buyCount?: number;
  openedBonuses?: number;
  unopenedBonuses?: number;
  totalCost?: number;
  totalReturn?: number;
  profitLoss?: number;
  profitLossPercentage?: number;
  currentOpeningSlot?: string;
  notes?: string;
  items?: string;
  bonuses?: BonusHuntBonus[];
};

export type BonusHuntSnapshot = {
  liveHunts: BonusHunt[];
  previousHunts: BonusHunt[];
  totalHunts?: number;
  activeHunts?: number;
  completedHunts?: number;
  totalBonuses?: number;
  totalInvested?: number;
  totalWinnings?: number;
  totalProfitLoss?: number;
  totalProfitLossPercentage?: number;
  source: "bonushunt" | "fallback";
  fetchedAt: string;
  message?: string;
  rateLimit?: {
    limit?: number;
    remaining?: number;
    reset?: number;
  };
};