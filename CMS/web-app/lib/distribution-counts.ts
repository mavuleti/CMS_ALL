export interface DistributionCount {
  offlineDistributionCount?: number;
  onlineDistributionCount?: number;
}

function safeCount(value: unknown): number {
  const count = Number(value ?? 0);
  return Number.isFinite(count) && count > 0 ? count : 0;
}

export function displayedDistributionTotal(counts?: DistributionCount): number {
  return safeCount(counts?.offlineDistributionCount) + safeCount(counts?.onlineDistributionCount);
}

export function onlinePopularity(counts?: DistributionCount): number {
  return safeCount(counts?.onlineDistributionCount);
}

export function sortByOnlinePopularity<T extends DistributionCount>(entries: T[]): T[] {
  return [...entries].sort((left, right) => onlinePopularity(right) - onlinePopularity(left));
}
