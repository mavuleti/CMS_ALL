import { expect, test } from '@playwright/test';
import {
  displayedDistributionTotal,
  onlinePopularity,
  sortByOnlinePopularity
} from '../lib/distribution-counts';
import { buildDistributionMigrationPatch } from '../scripts/lib/distribution-migration.mjs';

test('displayed count is the offline and online distribution total', () => {
  expect(displayedDistributionTotal({ offlineDistributionCount: 731, onlineDistributionCount: 49 })).toBe(780);
});

test('trending uses only online distribution and ignores offline changes', () => {
  const quietLegacyHit = { offlineDistributionCount: 999, onlineDistributionCount: 2 };
  const currentlyTrending = { offlineDistributionCount: 1, onlineDistributionCount: 40 };

  expect(onlinePopularity(quietLegacyHit)).toBe(2);
  expect(sortByOnlinePopularity([quietLegacyHit, currentlyTrending])[0]).toBe(currentlyTrending);

  quietLegacyHit.offlineDistributionCount = 0;
  expect(sortByOnlinePopularity([quietLegacyHit, currentlyTrending])[0]).toBe(currentlyTrending);
});

test('migration reruns preserve the original offline seed and online progress', () => {
  const existing = { offlineDistributionCount: 517, onlineDistributionCount: 63 };
  expect(buildDistributionMigrationPatch({ totalClickCount: 12 }, existing, 999)).toEqual({});
});
