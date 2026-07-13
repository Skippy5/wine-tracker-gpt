# Pour Choices · Wine Club Cellar

`wine-tracker-gpt` is a production-ready, mobile-first Next.js application for the **Pour Choices** wine club. It tracks meetings, wine batches through Started → Racked → Bottled, cellar readings, and additions. The project is ready to push to GitHub and deploy to Vercel with no environment variables.

## Bootstrap commands

These are the initial commands used to create the project from an empty parent directory:

```bash
npx create-next-app@latest wine-tracker-gpt --typescript --eslint --tailwind --app --src-dir --import-alias "@/*" --use-npm --yes
cd wine-tracker-gpt
npm install lucide-react
npm install --save-dev vitest
npm run dev
```

Node.js 20.9 or newer is required by Next.js 16.

## What is included

- Dashboard with upcoming club night, active batches, latest SG, and recent activity
- Batch creation and lifecycle transitions with dated Started, Racked, and Bottled events
- Touch-friendly SG, temperature, pH, amount, and native date inputs
- Additions log with common wine agents and flexible amounts/units
- Meeting log with attendee names and general notes
- Typed React context/reducer state management
- Versioned browser repository with seeded mock data and durable `localStorage` persistence
- Custom Pour Choices wine-glass brand, bottle graphics, app icon, Apple icon, and social card
- iOS safe-area layout, 44px+ targets, 16px form controls, decimal keyboard hints, and standalone web-app metadata
- Security headers, private crawler policy, error UI, strict TypeScript, linting, reducer tests, and production build scripts

## Data layer

The repository deliberately uses a zero-configuration local data adapter because SQLite files are not durable on Vercel's serverless filesystem. Data is stored under `pour-choices:wine-club:v1` in the current browser and seeded on first use from [`src/lib/seed-data.ts`](./src/lib/seed-data.ts).

The domain interfaces in [`src/types/wine.ts`](./src/types/wine.ts), reducer actions, and storage boundary are separated from the UI. A shared multi-device deployment can replace [`src/lib/storage.ts`](./src/lib/storage.ts) with a hosted Postgres/Prisma or Vercel Marketplace database adapter without rewriting the screens.

## Project structure

```text
wine-tracker-gpt/
├── public/
├── src/
│   ├── app/
│   │   ├── apple-icon.tsx
│   │   ├── error.tsx
│   │   ├── globals.css
│   │   ├── icon.svg
│   │   ├── layout.tsx
│   │   ├── manifest.ts
│   │   ├── not-found.tsx
│   │   ├── opengraph-image.tsx
│   │   ├── page.tsx
│   │   └── robots.ts
│   ├── components/
│   │   ├── activity/
│   │   ├── batches/
│   │   ├── brand/
│   │   ├── dashboard/
│   │   ├── logging/
│   │   ├── meetings/
│   │   ├── navigation/
│   │   ├── ui/
│   │   └── wine-club-app.tsx
│   ├── context/
│   │   ├── wine-club-provider.test.ts
│   │   └── wine-club-provider.tsx
│   ├── lib/
│   │   ├── activity.ts
│   │   ├── date.ts
│   │   ├── seed-data.ts
│   │   └── storage.ts
│   └── types/wine.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── vitest.config.ts
```

## Scripts

```bash
npm run dev        # local Turbopack development server
npm run lint       # ESLint + Next.js accessibility rules
npm run typecheck  # strict TypeScript check
npm test           # Vitest reducer suite
npm run build      # optimized production build
npm run check      # all four checks in sequence
npm start          # run the production build locally
```

## Deploy to Vercel

1. Push this directory to a GitHub repository named `wine-tracker-gpt`.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Keep the detected **Next.js** framework preset and default build settings.
4. Deploy. No environment variables or build overrides are required.

Vercel will build every subsequent push and create preview deployments for pull requests.

## Implementation research

The implementation follows the current official guidance for [Next.js App Router installation](https://nextjs.org/docs/app/getting-started/installation), [Tailwind CSS with Next.js](https://tailwindcss.com/docs/installation/framework-guides/nextjs), [production optimization](https://nextjs.org/docs/app/guides/production-checklist), [Vercel's Next.js deployment](https://vercel.com/frameworks/nextjs), and Apple's [44×44pt minimum button target guidance](https://developer.apple.com/design/human-interface-guidelines/buttons).
