export type PrizeTier = {
  rank: number;
  prize: number;
};

export type SiteSettings = {
  siteTitle: string;
  heroSubtitle: string;
  kickUrl: string;
  discordUrl: string;
  youtubeUrl: string;
  defaultCountdownTarget: string;
  footerNote: string;
};

export type LeaderboardSettings = {
  title: string;
  subtitle: string;
  countdownTarget: string;
  featuredOnHome: boolean;
  message?: string;
  prizeTiers: PrizeTier[];
};

export type LeaderboardEntry = {
  rank: number;
  username: string;
  wageredTotal: number;
  prize?: number;
};

export type Raffle = {
  id: string;
  title: string;
  description: string;
  image: string;
  status: 'active' | 'completed' | 'archived';
  entryMethod: string;
  totalEntries: number;
  startDate: string;
  endDate: string;
  winner?: string;
  prizeDetails: string;
};

export type Challenge = {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed';
  goal: number;
  currentProgress: number;
  reward: string;
  startDate: string;
  endDate: string;
};

export type BonusHunt = {
  id: string;
  title: string;
  date: string;
  status: 'active' | 'archived';
  provider?: string;
  buyCount: number;
  totalCost: number;
  totalReturn: number;
  profitLoss: number;
  notes: string;
  items?: string;
};
