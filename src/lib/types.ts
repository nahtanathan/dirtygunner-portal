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

export type BonusHunt = {
  id: string;
  title: string;
  date?: string;
  status: "active" | "archived";
  provider?: string;
  buyCount?: number;
  totalCost?: number;
  totalReturn?: number;
  profitLoss?: number;
  notes?: string;
  items?: string;
};