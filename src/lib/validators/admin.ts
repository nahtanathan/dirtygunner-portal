import { z } from 'zod';

export const raffleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3),
  description: z.string().min(10),
  image: z.string().url(),
  status: z.enum(['active', 'completed', 'archived']),
  entryMethod: z.string().min(2),
  totalEntries: z.coerce.number().min(0),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  winner: z.string().optional().or(z.literal('')),
  prizeDetails: z.string().min(2),
});

export const challengeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3),
  description: z.string().min(10),
  status: z.enum(['active', 'completed']),
  goal: z.coerce.number().min(1),
  currentProgress: z.coerce.number().min(0),
  reward: z.string().min(2),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
});

export const bonusHuntSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(3),
  date: z.string().min(1),
  status: z.enum(['active', 'archived']),
  provider: z.string().optional(),
  buyCount: z.coerce.number().min(1),
  totalCost: z.coerce.number().min(0),
  totalReturn: z.coerce.number().min(0),
  profitLoss: z.coerce.number(),
  notes: z.string().min(3),
  items: z.string().optional(),
});

export const siteSettingsSchema = z.object({
  siteTitle: z.string().min(2),
  heroSubtitle: z.string().min(10),
  kickUrl: z.string().url(),
  discordUrl: z.string().url(),
  youtubeUrl: z.string().url(),
  defaultCountdownTarget: z.string().min(1),
  footerNote: z.string().min(5),
});

export const leaderboardSettingsSchema = z.object({
  title: z.string().min(2),
  subtitle: z.string().min(10),
  countdownTarget: z.string().min(1),
  featuredOnHome: z.boolean(),
  message: z.string().optional(),
  prizeTiers: z.array(
    z.object({
      rank: z.coerce.number().min(1),
      prize: z.coerce.number().min(0),
    })
  ).min(1),
});
