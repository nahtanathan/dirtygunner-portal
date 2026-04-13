'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  bonusHunts,
  challenges,
  leaderboardSettings,
  raffles,
  siteSettings,
} from '@/lib/data/mock-data';
import {
  BonusHunt,
  Challenge,
  LeaderboardSettings,
  Raffle,
  SiteSettings,
} from '@/lib/types';

type AdminState = {
  siteSettings: SiteSettings;
  leaderboardSettings: LeaderboardSettings;
  raffles: Raffle[];
  challenges: Challenge[];
  bonusHunts: BonusHunt[];

  saveSiteSettings: (payload: SiteSettings) => void;
  saveLeaderboardSettings: (payload: LeaderboardSettings) => void;

  upsertRaffle: (payload: Raffle) => void;
  deleteRaffle: (id: string) => void;

  upsertChallenge: (payload: Challenge) => void;
  deleteChallenge: (id: string) => void;

  upsertBonusHunt: (payload: BonusHunt) => void;
  deleteBonusHunt: (id: string) => void;
};

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      siteSettings,
      leaderboardSettings,
      raffles,
      challenges,
      bonusHunts,

      saveSiteSettings: (payload) => set({ siteSettings: payload }),

      saveLeaderboardSettings: (payload) =>
        set({ leaderboardSettings: payload }),

      upsertRaffle: (payload) =>
        set((state) => ({
          raffles: state.raffles.some((item) => item.id === payload.id)
            ? state.raffles.map((item) =>
                item.id === payload.id ? payload : item
              )
            : [payload, ...state.raffles],
        })),

      deleteRaffle: (id) =>
        set((state) => ({
          raffles: state.raffles.filter((item) => item.id !== id),
        })),

      upsertChallenge: (payload) =>
        set((state) => ({
          challenges: state.challenges.some(
            (item) => item.id === payload.id
          )
            ? state.challenges.map((item) =>
                item.id === payload.id ? payload : item
              )
            : [payload, ...state.challenges],
        })),

      deleteChallenge: (id) =>
        set((state) => ({
          challenges: state.challenges.filter(
            (item) => item.id !== id
          ),
        })),

      upsertBonusHunt: (payload) =>
        set((state) => ({
          bonusHunts: state.bonusHunts.some(
            (item) => item.id === payload.id
          )
            ? state.bonusHunts.map((item) =>
                item.id === payload.id ? payload : item
              )
            : [payload, ...state.bonusHunts],
        })),

      deleteBonusHunt: (id) =>
        set((state) => ({
          bonusHunts: state.bonusHunts.filter(
            (item) => item.id !== id
          ),
        })),
    }),
    {
      name: 'admin-storage', // localStorage key
    }
  )
);