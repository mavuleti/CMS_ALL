/** Stable identifier used by download tracking. */
export function puzzleIdFromSlug(slug: string): string {
  return slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function puzzleIdFromHref(href: string): string {
  const slug = href.replace(/\/$/, '').split('/').pop() ?? href;
  return puzzleIdFromSlug(slug);
}

/** Adds the stable ID used by download tracking at the data boundary. */
export function withPuzzleId<T extends { slug: string }>(puzzle: T): T & { id: string } {
  return { ...puzzle, id: puzzleIdFromSlug(puzzle.slug) };
}

export function withPuzzleIds<T extends { slug: string }>(puzzles: T[]): Array<T & { id: string }> {
  return puzzles.map(withPuzzleId);
}
