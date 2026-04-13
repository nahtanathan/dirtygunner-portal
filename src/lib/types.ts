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
  id: string;
  username: string;
  wagered: number;
};

export type Raffle = {
  id: string;
  title: string;
  description?: string;
  status: "active" | "ended";
};

export type Challenge = {
  id: string;
  title: string;
  description?: string;
  status: "active" | "ended";
};

export type BonusHunt = {
  id: string;
  title: string;
  status: "active" | "ended";
};