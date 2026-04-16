import type {
  BonusHunt,
  Challenge,
  LeaderboardEntry,
  LeaderboardSettings,
  Raffle,
  SiteSettings,
} from "@/lib/types";

export const siteSettings: SiteSettings = {
  kickUrl: "https://kick.com/dirtygunner",
  discordUrl: "https://discord.gg/dirtygunner",
  youtubeUrl: "https://youtube.com/@dirtygunner",
  xUrl: "https://x.com/dirtygunner",
  instagramUrl: "https://instagram.com/dirtygunner",
};

export const leaderboardSettings: LeaderboardSettings = {
  title: "Weekly Roobet Race",
  subtitle: "Top grinders get paid at reset.",
  countdownTarget: "2026-04-19T23:59:59.000Z",
  prizeTiers: [
    { place: 1, prize: 300 },
    { place: 2, prize: 200 },
    { place: 3, prize: 150 },
    { place: 4, prize: 100 },
    { place: 5, prize: 75 },
    { place: 6, prize: 60 },
    { place: 7, prize: 50 },
    { place: 8, prize: 30 },
    { place: 9, prize: 20 },
    { place: 10, prize: 15 },
  ],
};

const seededLeaderboardRows: [string, number][] = [
  ["GunnerCore", 152340],
  ["SpinTactix", 146900],
  ["VantaRush", 139120],
  ["RazeChip", 128340],
  ["ColdStackz", 117600],
  ["GhostReels", 113080],
  ["VaultNexus", 108940],
  ["LumaDice", 101275],
  ["TurboCrown", 96540],
  ["NightJack", 91280],
  ["AceLedger", 87420],
  ["HexPulse", 82810],
  ["RiskCoded", 79230],
  ["MintRider", 75690],
  ["StackTheory", 71940],
];

export const leaderboardEntries: LeaderboardEntry[] = seededLeaderboardRows.map(
  ([username, wageredTotal], index) => ({
    id: `${username.toLowerCase()}-${index + 1}`,
    rank: index + 1,
    username,
    wageredTotal,
  }),
);

export const raffles: Raffle[] = [
  {
    id: "raffle-1",
    title: "Weekend Cash Drop",
    description: "Enter for a shot at the weekly cash giveaway.",
    image: "/images/raffles/weekend-cash-drop.jpg",
    status: "active",
    entryMethod: "Enter Now",
    entryCost: 10,
    entryCurrency: "points",
    maxEntriesPerUser: 25,
    totalEntries: 186,
    prizeDetails: "$250 Cash Prize",
    startDate: "2026-04-10T00:00:00.000Z",
    endDate: "2026-04-19T23:59:59.000Z",
    winner: null,
    createdAt: "2026-04-10T00:00:00.000Z",
    updatedAt: "2026-04-10T00:00:00.000Z",
  },
];

export const challenges: Challenge[] = [
  {
    id: "challenge-1",
    title: "Hit a 500x",
    description: "Land a 500x or higher multiplier on any qualifying slot.",
    status: "active",
    challengeType: "multiplier",
    targetValue: 500,
    minBet: 0.2,
    reward: "500 Points",
    rules: "Valid on stream-approved slots only.",
    slotName: null,
    provider: null,
    imageUrl: null,
    imageSource: null,
    claimLimit: 3,
    approvedClaims: 1,
    pendingClaims: 1,
    remainingClaims: 2,
    requiresProof: true,
    startDate: "2026-04-10T00:00:00.000Z",
    endDate: "2026-04-19T23:59:59.000Z",
    createdAt: "2026-04-10T00:00:00.000Z",
    updatedAt: "2026-04-10T00:00:00.000Z",
    viewerClaimStatus: "none",
  },
];

export const bonusHunts: BonusHunt[] = [
  {
    id: "hunt-1",
    title: "Friday Night Hunt",
    date: "2026-04-11T22:00:00.000Z",
    updatedAt: "2026-04-11T22:00:00.000Z",
    status: "completed",
    provider: "Mixed",
    casino: "Stake",
    buyCount: 24,
    totalCost: 1200,
    totalReturn: 1486.42,
    profitLoss: 286.42,
    profitLossPercentage: 23.87,
    currentOpeningSlot: null,
    bonuses: [],
  },
];