import { Archive, Crosshair, Gift, Home, Shield, Swords, Trophy, Youtube, Disc3, Radio } from 'lucide-react';

export const publicNav = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/raffles', label: 'Raffles', icon: Gift },
  { href: '/challenges', label: 'Challenges', icon: Crosshair },
  { href: '/bonus-hunts', label: 'Bonus Hunts', icon: Archive },
];

export const adminNav = [
  { href: '/admin', label: 'Overview', icon: Shield },
  { href: '/admin/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/admin/raffles', label: 'Raffles', icon: Gift },
  { href: '/admin/challenges', label: 'Challenges', icon: Crosshair },
  { href: '/admin/bonus-hunts', label: 'Bonus Hunts', icon: Archive },
  { href: '/admin/settings', label: 'Settings', icon: Swords },
];

export const socialNav = [
  { href: 'https://kick.com/dirtygunner', label: 'Kick', icon: Radio },
  { href: 'https://discord.gg/dirtygunner', label: 'Discord', icon: Disc3 },
  { href: 'https://youtube.com/@dirtygunner', label: 'YouTube', icon: Youtube },
];
