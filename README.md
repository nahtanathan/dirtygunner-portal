# DirtyGunner Portal

Premium streamer portal scaffold for DirtyGunner built with Next.js App Router, TypeScript, Tailwind, Framer Motion-ready structure, and a styled mock-data admin panel.

## Included
- Public pages: home, leaderboard, raffles, challenges, bonus hunts
- Admin pages: overview, leaderboard, raffles, challenges, bonus hunts, settings
- Premium sidebar + mobile drawer shell
- Mock/local typed architecture structured for later backend replacement
- Zustand admin state for optimistic-feeling local editing
- React Hook Form + Zod validation for admin forms

## Notes
- The current build uses a temporary `DG` brand mark placeholder because the actual DirtyGunner logo files were not attached in this request.
- Replace `BrandMark.tsx` with your logo asset component or `next/image` implementation once the final logos are dropped into `/public`.
- Roobet API wiring is intentionally separated from UI so you can swap `repository.ts` into a real data layer later.

## Run
```bash
npm install
npm run dev
```

## Suggested next phase
- wire real logo assets
- connect leaderboard repository to Roobet API
- persist admin edits to Supabase or your preferred backend
- add auth to `/admin`
