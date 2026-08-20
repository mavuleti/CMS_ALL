# Fix Puzzle Download Count Tracking

## Background / Problem

Puzzle cards across the DotToDotFreePrintables application currently display
incorrect download counts (e.g. "1.9k downloads", "2.2k downloads"). These are
placeholder/default values that don't reflect real usage. This is because the
puzzles were originally distributed **offline** before this web application
existed, so there is no historical online tracking data to show.

We need to replace this placeholder logic with a system that combines real
historical offline distribution with real, currently-tracked online downloads.

## Phase 1: Data layer changes (Firestore)

1. **Do not modify the existing download-tracking table/collection.** Leave it
   completely untouched as a fallback/reference.
2. Create a **new table/collection**, mirroring the structure of the existing
   one, with two additional numeric fields per puzzle:
   - `offlineDistributionCount`
   - `onlineDistributionCount`
3. **Seed `onlineDistributionCount`** for every existing puzzle from whatever
   real download number is already being tracked today (e.g. if "T-Rex" has
   45–50 genuine tracked downloads currently, that becomes its starting
   `onlineDistributionCount` — not zero).
4. **Seed `offlineDistributionCount`** for every existing puzzle with a
   one-time random value under 1,000, representing legacy offline
   distribution before launch. This value is set once and should not change
   afterward.
5. Going forward, only `onlineDistributionCount` increments, based on real
   download events happening in the live app. `offlineDistributionCount`
   stays fixed.
6. Write a one-time backfill/migration script to populate these fields for
   every existing puzzle document in the new table, using the sourcing rules
   above.

## Phase 2: Application changes

1. Audit the codebase for every place a download count is read, computed, or
   displayed — puzzle cards on listing/category pages, puzzle detail pages,
   download pages, and the static export/build pipeline that generates JSON
   from Firestore for the site. The goal is consistency everywhere, not just
   the surface listing page.
2. Update all of these to read from the **new table** instead of the old one.
3. **Displayed total download count** = `offlineDistributionCount +
   onlineDistributionCount`.
4. **"Recently downloaded" / "trending" / "most popular" logic** (sorting,
   badges, etc., if it exists anywhere in the app) must use
   `onlineDistributionCount` **only** — never factor in
   `offlineDistributionCount`, since offline has no real-time signal.
5. Visual styling, card layout, and badges should remain unchanged — this is
   a data-correctness fix only, not a redesign.

## Testing

- Add a unit test confirming the displayed total = offline + online.
- Add a unit test confirming trending/recent logic only reads the online
  field and is unaffected by changes to the offline field.
- Verify the migration script is idempotent (safe to re-run without
  duplicating or re-randomizing offline seed values).
