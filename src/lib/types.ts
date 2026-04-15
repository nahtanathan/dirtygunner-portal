export type SiteSettings = {
  kickUrl: string;
  discordUrl?: string;
  youtubeUrl?: string;
  xUrl?: string;
  instagramUrl?: string;
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

export type ChallengeType = "multiplier" | "win_amount";
export type ChallengeStatus = "active" | "completed";
export type ChallengeClaimStatus = "none" | "pending" | "approved" | "rejected";

export type Challenge = {
  id: string;
  title: string;
  description?: string | null;
  status: ChallengeStatus;
  challengeType: ChallengeType;
  targetValue: number;
  minBet: number;
  reward: string;
  rules?: string | null;
  slotName?: string | null;
  provider?: string | null;
  imageUrl?: string | null;
  imageSource?: string | null;
  claimLimit: number;
  approvedClaims: number;
  pendingClaims: number;
  remainingClaims: number;
  requiresProof: boolean;
  startDate: string;
  endDate: string;
  createdAt?: string;
  updatedAt?: string;
  viewerClaimStatus?: ChallengeClaimStatus;
};

export type ChallengeClaim = {
  id: string;
  challengeId: string;
  challengeTitle: string;
  userId: string;
  userLabel: string;
  proofImageUrl: string;
  note?: string | null;
  status: Exclude<ChallengeClaimStatus, "none">;
  rejectionReason?: string | null;
  reviewedAt?: string | null;
  reviewedByLabel?: string | null;
  createdAt: string;
  updatedAt: string;
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
  startCost?: number;
  totalWinnings?: number;
  bonusCount?: number;
  currentOpeningSlot?: string | null;
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