import { BonusHunt, Challenge, LeaderboardEntry, LeaderboardSettings, Raffle, SiteSettings } from '@/lib/types';

export const siteSettings: SiteSettings = {
  siteTitle: 'DirtyGunner',
  heroSubtitle: 'Elite stream events, leaderboard races, community raffles, and bonus hunt archives built into one premium portal.',
  kickUrl: 'https://kick.com/dirtygunner',
  discordUrl: 'https://discord.gg/dirtygunner',
  youtubeUrl: 'https://youtube.com/@dirtygunner',
  defaultCountdownTarget: '2026-04-19T23:59:59.000Z',
  footerNote: 'DirtyGunner community portal. Premium event tracking, challenges, and bonus hunt history.',
};

export const leaderboardSettings: LeaderboardSettings = {
  title: 'Weekly Roobet Race',
  subtitle: 'Top grinders earn premium payouts before the weekly reset. Every wager matters.',
  countdownTarget: '2026-04-19T23:59:59.000Z',
  featuredOnHome: true,
  message: 'Leaderboard sync is prepared for the Roobet API. Manual fallback data is seeded for first launch.',
  prizeTiers: [
    { rank: 1, prize: 300 },
    { rank: 2, prize: 200 },
    { rank: 3, prize: 150 },
    { rank: 4, prize: 100 },
    { rank: 5, prize: 75 },
    { rank: 6, prize: 60 },
    { rank: 7, prize: 50 },
    { rank: 8, prize: 30 },
    { rank: 9, prize: 20 },
    { rank: 10, prize: 15 },
  ],
};

const seededLeaderboardRows: [string, number][] = [
  ['GunnerCore', 152340],
  ['SpinTactix', 146900],
  ['VantaRush', 139120],
  ['RazeChip', 128340],
  ['ColdStackz', 117600],
  ['GhostReels', 113080],
  ['BlueRush', 104010],
  ['VaultSnipe', 99840],
  ['NightLine', 94220],
  ['WagerHowl', 88570],
  ['SilverRush', 85750],
  ['DustyAce', 83440],
  ['InkReload', 79920],
  ['ArcShot', 76110],
  ['Deadlock777', 72560],
];

export const leaderboardEntries: LeaderboardEntry[] = seededLeaderboardRows.map(
  ([username, wageredTotal], index) => ({
    rank: index + 1,
    username,
    wageredTotal,
    prize: leaderboardSettings.prizeTiers.find((tier) => tier.rank === index + 1)?.prize,
  })
);

export const raffles: Raffle[] = [
  {
    id: 'raf-1',
    title: 'Controller Loadout Raffle',
    description: 'A premium custom controller drop for active community members during stream week.',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    status: 'active',
    entryMethod: '250 Bullets per ticket',
    totalEntries: 814,
    startDate: '2026-04-10T20:00:00.000Z',
    endDate: '2026-04-18T23:00:00.000Z',
    prizeDetails: 'Custom controller + VIP Discord role + stream shoutout',
  },
  {
    id: 'raf-2',
    title: 'Merch Crate Drop',
    description: 'Branded DirtyGunner bundle with tactical hoodie, cap, and metal tumbler.',
    image: 'https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=80',
    status: 'completed',
    entryMethod: 'Free for verified community members',
    totalEntries: 1261,
    startDate: '2026-03-15T18:00:00.000Z',
    endDate: '2026-03-22T18:00:00.000Z',
    winner: 'SpinTactix',
    prizeDetails: 'Full merch crate',
  },
];

export const challenges: Challenge[] = [
  {
    id: 'chl-1',
    title: '50,000 Bullet Push',
    description: 'The community needs to hit 50,000 total Bullets earned across tracked stream activities.',
    status: 'active',
    goal: 50000,
    currentProgress: 32640,
    reward: 'Exclusive raffle unlock + Discord badge',
    startDate: '2026-04-01T00:00:00.000Z',
    endDate: '2026-04-30T23:59:59.000Z',
  },
  {
    id: 'chl-2',
    title: 'Weekend Wager Sprint',
    description: 'Hit the community target across the featured race window to unlock a surprise stream event.',
    status: 'completed',
    goal: 100000,
    currentProgress: 100000,
    reward: 'Bonus stream + giveaway',
    startDate: '2026-03-21T00:00:00.000Z',
    endDate: '2026-03-23T00:00:00.000Z',
  },
];

export const bonusHunts: BonusHunt[] = [
  {
    id: 'hunt-1',
    title: 'Friday Night 40 Buy Hunt',
    date: '2026-04-11T22:30:00.000Z',
    status: 'active',
    provider: 'Mixed Providers',
    buyCount: 40,
    totalCost: 4000,
    totalReturn: 0,
    profitLoss: -4000,
    notes: 'Live hunt building across the week. Final breakdown module reserved for next phase.',
  },
  {
    id: 'hunt-2',
    title: 'Chaos Stack Session',
    date: '2026-04-04T22:30:00.000Z',
    status: 'archived',
    provider: 'Pragmatic / Hacksaw',
    buyCount: 28,
    totalCost: 2800,
    totalReturn: 3515,
    profitLoss: 715,
    notes: 'Strong mid-session recovery led by late premium hits.',
  },
  {
    id: 'hunt-3',
    title: 'Deep Night Recovery Hunt',
    date: '2026-03-29T22:30:00.000Z',
    status: 'archived',
    provider: 'Mixed Providers',
    buyCount: 35,
    totalCost: 3500,
    totalReturn: 2210,
    profitLoss: -1290,
    notes: 'Tough run, saved partly by one 400x return near the close.',
  },
];