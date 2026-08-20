export function buildDistributionMigrationPatch(source, target, offlineSeed) {
  if (!target) {
    return {
      ...source,
      offlineDistributionCount: offlineSeed,
      onlineDistributionCount: Number(source.totalClickCount ?? 0)
    };
  }

  const patch = {};
  if (typeof target.offlineDistributionCount !== 'number') {
    patch.offlineDistributionCount = offlineSeed;
  }
  if (typeof target.onlineDistributionCount !== 'number') {
    patch.onlineDistributionCount = Number(source.totalClickCount ?? 0);
  }
  return patch;
}
