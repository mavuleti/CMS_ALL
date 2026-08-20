import Link from 'next/link';
import { Download, Flame, Sparkles } from 'lucide-react';
import counts from '@/lib/download-counts.json';
import { puzzlesForLocale, type Puzzle } from '@/lib/site-data';
import { getTranslations } from 'next-intl/server';
import { getRecentPuzzleSlugs } from '@/lib/export-content';
import { displayedDistributionTotal, type DistributionCount } from '@/lib/distribution-counts';

export default async function TopDownloadsLeaderboard({
  locale = 'en',
  variant = 'sidebar'
}: {
  locale?: string;
  /** 'sidebar' is the existing floating panel used on non-home pages.
   *  'columns' lays the two lists side by side for the homepage. */
  variant?: 'sidebar' | 'columns';
}) {
  const isArabic = locale === 'ar' || locale.startsWith('ar-');
  const puzzles = puzzlesForLocale(locale);
  const puzzleT = await getTranslations({ locale, namespace: 'puzzleSection' });
  const commonT = await getTranslations({ locale, namespace: 'common' });
  const homeT = await getTranslations({ locale, namespace: 'homepageUi' });
  const puzzleName = (puzzle: Puzzle) => {
    if (!isArabic) return puzzle.name;
    const key = `items.${puzzle.id}.name`;
    if (puzzleT.has(key)) return puzzleT(key);
    const fallbackKey = `puzzleNames.${puzzle.id}`;
    return homeT.has(fallbackKey) ? homeT(fallbackKey) : puzzle.name;
  };
  const top = (counts as { top?: Array<{ puzzleId: string } & DistributionCount> }).top ?? [];
  const items = top
    .map((entry) => ({ ...entry, puzzle: puzzles.find((puzzle) => puzzle.id === entry.puzzleId) }))
    .filter((entry): entry is typeof entry & { puzzle: NonNullable<typeof entry.puzzle> } =>
      Boolean(entry.puzzle)
    )
    .slice(0, 8);
  const recentItems = getRecentPuzzleSlugs(locale)
    .map((slug) => puzzles.find((puzzle) => puzzle.href.endsWith(`/${slug}/`)))
    .filter((puzzle): puzzle is Puzzle => Boolean(puzzle));

  if (!items.length && !recentItems.length) return null;

  const mostDownloaded = (
    <div className="top-downloads-column">
      <div className="top-downloads-heading">
        <span className="top-downloads-icon" aria-hidden="true"><Flame size={20} /></span>
        <div>
          <p>{homeT('popularEyebrow')}</p>
          <h2 id="top-downloads-title">{homeT('mostDownloaded')}</h2>
        </div>
      </div>
      <ol className="top-downloads-list">
        {items.map(({ puzzle, ...distribution }, index) => {
          const totalDownloadCount = displayedDistributionTotal(distribution);
          return (
          <li key={puzzle!.id}>
            <span className="top-downloads-rank" aria-hidden="true">{index + 1}</span>
            <Link href={`/${locale}${puzzle!.href}`}>{puzzleName(puzzle!)}</Link>
            <span className="top-downloads-count" aria-label={homeT('downloadCountAria', { count: totalDownloadCount.toLocaleString(locale) })}>
              <Download size={13} aria-hidden="true" />
              {totalDownloadCount.toLocaleString(locale)}+
            </span>
          </li>
          );
        })}
      </ol>
    </div>
  );

  const recentlyAdded = recentItems.length > 0 && (
    <div className={variant === 'columns' ? 'top-downloads-column' : 'recent-puzzles-block'}>
      <div className="recent-puzzles-heading">
        <span aria-hidden="true"><Sparkles size={16} /></span>
        <div>
          <p>{homeT('freshPrintables')}</p>
          <h3>{homeT('recentlyAdded')}</h3>
        </div>
      </div>
      <ol className="top-downloads-list recent-puzzles-list">
        {recentItems.map((puzzle, index) => (
          <li key={puzzle.id}>
            <span className="top-downloads-rank" aria-hidden="true">{index + 1}</span>
            <Link href={`/${locale}${puzzle.href}`}>{puzzleName(puzzle)}</Link>
            <span className="recent-puzzle-badge">{commonT('new')}</span>
          </li>
        ))}
      </ol>
    </div>
  );

  return (
    <section
      className={variant === 'columns' ? 'section home-top-downloads-section' : 'section top-downloads-section'}
      aria-labelledby="top-downloads-title"
    >
      <div className={variant === 'columns' ? 'top-downloads-panel home-top-downloads-panel' : 'top-downloads-panel'}>
        {mostDownloaded}
        {recentlyAdded}
      </div>
    </section>
  );
}
