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
};

export const leaderboardSettings: LeaderboardSettings = {
  title: "Weekly Roobet Race",
  subtitle: "Top grinders earn premium payouts before the weekly reset.",
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
  ["BlueRush", 104010],
  ["VaultSnipe", 99840],
  ["NightLine", 94220],
  ["WagerHowl", 88570],
  ["SilverRush", 85750],
  ["DustyAce", 83440],
  ["InkReload", 79920],
  ["ArcShot", 76110],
  ["Deadlock777", 72560],
];

export const leaderboardEntries: LeaderboardEntry[] = seededLeaderboardRows.map(
  ([username, wageredTotal], index) => ({
    rank: index + 1,
    username,
    wageredTotal,
    prize: leaderboardSettings.prizeTiers.find(
      (tier) => tier.place === index + 1,
    )?.prize,
  }),
);

export const raffles: Raffle[] = [
  {
    id: "raf-1",
    title: "Controller Loadout Raffle",
    description:
      "A premium custom controller drop for active community members during stream week.",
    status: "active",
    entryMethod: "Enter Now",
    entryCost: 250,
    entryCurrency: "bullets",
    totalEntries: 814,
    startDate: "2026-04-10T20:00:00.000Z",
    endDate: "2026-04-18T23:00:00.000Z",
    prizeDetails: "Custom controller + VIP Discord role + stream shoutout",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
  },
];

export const challenges: Challenge[] = [
  {
    id: "challenge-gates-500x",
    title: "Hit 500x on Gates of Olympus",
    description:
      "Submit a qualifying screenshot showing a 500x or higher hit. Minimum bet is $0.20.",
    status: "active",
    challengeType: "multiplier",
    targetValue: 500,
    minBet: 0.2,
    reward: "$100 bonus balance",
    rules: "Valid screenshot must clearly show slot, bet size, and win multiplier.",
    slotName: "Gates of Olympus",
    provider: "Pragmatic Play",
    imageUrl: null,
    imageSource: null,
    claimLimit: 3,
    approvedClaims: 1,
    pendingClaims: 1,
    remainingClaims: 2,
    requiresProof: true,
    startDate: "2026-04-01T00:00:00.000Z",
    endDate: "2026-04-30T23:59:59.000Z",
  },
  {
    id: "challenge-sweet-1k",
    title: "Win $1,000+ on Sweet Bonanza",
    description:
      "Any qualifying win of $1,000 or more counts as long as the minimum bet rule is met.",
    status: "active",
    challengeType: "win_amount",
    targetValue: 1000,
    minBet: 0.2,
    reward: "Free buy + Discord shoutout",
    rules: "Only one approved claim per user.",
    slotName: "Sweet Bonanza",
    provider: "Pragmatic Play",
    imageUrl: null,
    imageSource: null,
    claimLimit: 5,
    approvedClaims: 0,
    pendingClaims: 0,
    remainingClaims: 5,
    requiresProof: true,
    startDate: "2026-04-05T00:00:00.000Z",
    endDate: "2026-04-30T23:59:59.000Z",
  },
];

export const bonusHunts: BonusHunt[] = [
  {
    id: "hunt-1",
    title: "Friday Night 40 Buy Hunt",
    date: "2026-04-11T22:30:00.000Z",
    status: "active",
    provider: "Mixed Providers",
    buyCount: 40,
    totalCost: 4000,
    totalReturn: 0,
    profitLoss: -4000,
    notes:
      "Live hunt building across the week. Final breakdown module reserved for next phase.",
  },
  {
    id: "hunt-2",
    title: "Chaos Stack Session",
    date: "2026-04-04T22:30:00.000Z",
    status: "archived",
    provider: "Pragmatic / Hacksaw",
    buyCount: 28,
    totalCost: 2800,
    totalReturn: 3515,
    profitLoss: 715,
    notes: "Strong mid-session recovery led by late premium hits.",
  },
  {
    id: "hunt-3",
    title: "Deep Night Recovery Hunt",
    date: "2026-03-29T22:30:00.000Z",
    status: "archived",
    provider: "Mixed Providers",
    buyCount: 35,
    totalCost: 3500,
    totalReturn: 2210,
    profitLoss: -1290,
    notes: "Tough run, saved partly by one 400x return near the close.",
  },
];