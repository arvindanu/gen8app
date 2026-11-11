# GEN8 feature expansion

This update adds six routes to the existing GEN8 application while retaining the existing discovery, trending, upcoming, wishlist, game detail, game-card and global design components.

## New navigation routes

- `/for-you` — preference-based discovery using IGDB genre/platform filters and local browser preferences.
- `/countdown` — countdown to the nearest future game release date available from IGDB.
- `/versus` — side-by-side comparison of two IGDB game records.
- `/roulette` — random game discovery using the existing IGDB-backed game endpoint.
- `/can-i-run-it` — PC requirement comparison form. Users enter their own PC specs and the game's minimum requirements.
- `/franchise` — search IGDB franchises and browse linked game records.

## Data-source notes

- IGDB does not provide a complete, verified PC system-requirements dataset through the current integration. The Can I Run It page therefore does not invent CPU/GPU compatibility scores. It compares user-entered CPU/GPU model names for manual inspection and directly checks numeric RAM, VRAM and storage values when entered.
- GEN8 For You is a transparent preference-based filter, not a machine-learning recommendation engine.
- Release Countdown uses IGDB's `first_release_date` field and only displays future-dated records.
- Franchise search depends on franchise/game relationships present in IGDB metadata.

## Existing code preservation

The original project files are retained. Only `components/shell.tsx` (to add the navigation links) and `app/globals.css` (to append styles for the new screens and allow the longer sidebar menu to scroll) were modified. Existing page/view/API implementation files were not rewritten.
