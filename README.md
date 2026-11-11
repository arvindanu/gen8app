# GEN8 — Game Discovery Platform

A Next.js App Router + React + TypeScript gaming discovery platform using IGDB through secure server-side API routes.

## Requirements
- Node.js 20.9+
- A Twitch developer application configured as **Confidential**
- Twitch Client ID and Client Secret

## Setup

```bash
npm install
cp .env.example .env.local
```

Add your credentials to `.env.local`:

```env
TWITCH_CLIENT_ID=your_client_id
TWITCH_CLIENT_SECRET=your_client_secret
```

Then run:

```bash
npm run dev
```

Open http://localhost:3000.

## Features
- Cinematic black / garnet discovery home
- IGDB-backed discovery, search, genre/platform/year/rating filters and sorting
- Trending based on IGDB popularity primitives (IGDB visits), with hype sorting fallback
- Upcoming and recently released game feeds
- Dynamic game detail pages, available screenshots, YouTube videos and metadata
- Local persistent wishlist (no account required)
- Surprise Me random game reveal
- Responsive sidebar/mobile navigation and reduced-motion support

## IGDB setup
1. Create a Twitch account and enable two-factor authentication.
2. Register a Twitch application in the developer console. Use the **Confidential** client type.
3. Generate a client secret and place both credentials in `.env.local`.
4. Restart the dev server after changing environment variables.

The app requests an app access token using the client-credentials grant. The token and client secret are only used on the server. IGDB image URLs are derived from returned image IDs.

## Notes / data limitations
- IGDB is not a live player-count or real-time trend service. The Trending page uses the IGDB Visits popularity primitive when available; if that endpoint is unavailable, it falls back to IGDB `hypes`.
- Game platform IDs and genre IDs are fetched from IGDB and filters are passed to the API query.
- Trailer embedding is shown only when IGDB supplies a video ID. IGDB's video IDs generally point to YouTube.
- Release dates and ratings are shown only when returned by IGDB. Upcoming games are filtered by future Unix release dates.
- Wishlist is stored in this browser's localStorage and does not sync between devices.
- IGDB API access is subject to Twitch/IGDB rate limits and terms. This starter uses Next.js revalidation for data requests; review caching and rate limits before high-traffic deployment.

## Checks
```bash
npm run lint
npm run build
```
