import { bonusHunts, challenges, leaderboardEntries, leaderboardSettings, raffles, siteSettings } from '@/lib/data/mock-data';

export const dataRepository = {
  getSiteSettings: () => siteSettings,
  getLeaderboardSettings: () => leaderboardSettings,
  getLeaderboardEntries: () => leaderboardEntries,
  getRaffles: () => raffles,
  getChallenges: () => challenges,
  getBonusHunts: () => bonusHunts,
};
