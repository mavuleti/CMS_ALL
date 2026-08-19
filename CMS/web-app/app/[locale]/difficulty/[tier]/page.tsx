import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getAllPuzzles } from '@/lib/category-registry';
import { routing } from '@/i18n/routing';
import { DIFFICULTY_HUBS, DIFFICULTY_ROUTE_SLUG, getDifficultyHubText } from '@/lib/hub-content';
import { SITE_NAME, buildAlternates } from '@/lib/seo';
import HubTemplate, { hubJsonLd } from '@/components/templates/HubTemplate';

export type DifficultyHubRouteProps = { params: Promise<{ locale: string; tier: string }> };

// Only generate a hub page for tiers that actually have matching puzzles --
// the catalog's real dot counts (32-250 as of 2026-08-19) mean the "easy
// 1-20 dots" tier is currently empty (see homepage FILTERS in
// HomeDiscovery.tsx, which has the same gap); shipping a static page with
// zero puzzles is a dead SEO page, not a hub. Re-included automatically once
// the catalog gets a puzzle in that range. Puzzle inventory (dot counts) is
// the same across every locale's export, so the guard checks the canonical
// 'en' catalog and applies to every locale.
export function generateStaticParams() {
  const activeTiers = DIFFICULTY_HUBS.filter((hub) => getAllPuzzles('en').some((puzzle) => puzzle.dots >= hub.min && puzzle.dots <= hub.max));
  return routing.locales.flatMap((locale) =>
    activeTiers.map((hub) => ({ locale, tier: DIFFICULTY_ROUTE_SLUG[hub.tier] }))
  );
}

export async function generateMetadata({ params }: DifficultyHubRouteProps): Promise<Metadata> {
  const { locale, tier } = await params;
  const hub = DIFFICULTY_HUBS.find((item) => DIFFICULTY_ROUTE_SLUG[item.tier] === tier);
  if (!hub) return {};
  const text = getDifficultyHubText(locale, tier);
  if (!text) return {};
  const path = `/difficulty/${tier}/`;
  return {
    title: text.seoTitle,
    description: text.seoDescription,
    alternates: buildAlternates(locale, path),
    openGraph: { title: text.seoTitle, description: text.seoDescription, url: `/${locale}${path}`, siteName: SITE_NAME, type: 'website' },
    twitter: { card: 'summary', title: text.seoTitle, description: text.seoDescription }
  };
}

export default async function DifficultyHubPage({ params }: DifficultyHubRouteProps) {
  const { locale, tier } = await params;
  const hub = DIFFICULTY_HUBS.find((item) => DIFFICULTY_ROUTE_SLUG[item.tier] === tier);
  if (!hub) notFound();
  const text = getDifficultyHubText(locale, tier);
  if (!text) notFound();
  setRequestLocale(locale);

  const puzzles = getAllPuzzles(locale).filter((puzzle) => puzzle.dots >= hub.min && puzzle.dots <= hub.max);
  if (puzzles.length === 0) notFound();

  const path = `/difficulty/${tier}/`;
  const schema = hubJsonLd({ locale, path, name: text.h1, description: text.seoDescription, puzzles });

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <HubTemplate locale={locale} h1={text.h1} intro={text.intro} puzzleCountLabel={`${puzzles.length} Puzzles`} puzzles={puzzles} />
  </>;
}
