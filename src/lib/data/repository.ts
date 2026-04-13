export const dataRepository = {
  getSiteSettings: async () => {
    const res = await fetch("/api/site-settings");
    return res.json();
  },

  getLeaderboardSettings: async () => {
    const res = await fetch("/api/leaderboard-settings");
    return res.json();
  },

  getLeaderboardEntries: async () => {
    const res = await fetch("/api/leaderboard");
    return res.json();
  },

  getRaffles: async () => {
    const res = await fetch("/api/raffles");
    return res.json();
  },

  getChallenges: async () => {
    const res = await fetch("/api/challenges");
    return res.json();
  },

  getBonusHunts: async () => {
    const res = await fetch("/api/bonus-hunts");
    return res.json();
  },
};