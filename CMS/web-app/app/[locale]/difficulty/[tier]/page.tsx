import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getAllPuzzles } from '@/lib/category-registry';
import { DIFFICULTY_HUBS } from '@/lib/hub-content';
import { SITE_NAME } from '@/lib/seo';
import HubTemplate, { hubJsonLd } from '@/components/templates/HubTemplate';

export type DifficultyHubRouteProps = { params: Promise<{ locale: string; tier: string }> };

// Only generate a hub page for tiers that actually have matching puzzles —
// the catalog's real dot counts (32-250 as of 2026-08-19) mean the "easy
// 1-20 dots" tier is currently empty (see homepage FILTERS in
// HomeDiscovery.tsx, which has the same gap); shipping a static page with
// zero puzzles is a dead SEO page, not a hub. Re-included automatically once
// the catalog gets a puzzle in that range.
export function generateStaticParams() {
  return DIFFICULTY_HUBS
    .filter((hub) => getAllPuzzles('en').some((puzzle) => puzzle.dots >= hub.min && puzzle.dots <= hub.max))
    .map((hub) => ({ locale: 'en', tier: hub.slug }));
}

export async function generateMetadata({ params }: DifficultyHubRouteProps): Promise<Metadata> {
  const { locale, tier } = await params;
  const hub = locale === 'en' ? DIFFICULTY_HUBS.find((item) => item.slug === tier) : undefined;
  if (!hub) return {};
  const path = `/difficulty/${hub.slug}/`;
  return {
    title: hub.seoTitle,
    description: hub.seoDescription,
    alternates: { canonical: `/en${path}`, languages: { 'x-default': `/en${path}`, en: `/en${path}` } },
    openGraph: { title: hub.seoTitle, description: hub.seoDescription, url: `/en${path}`, siteName: SITE_NAME, type: 'website' },
    twitter: { card: 'summary', title: hub.seoTitle, description: hub.seoDescription }
  };
}

export default async function DifficultyHubPage({ params }: DifficultyHubRouteProps) {
  const { locale, tier } = await params;
  const hub = locale === 'en' ? DIFFICULTY_HUBS.find((item) => item.slug === tier) : undefined;
  if (!hub) notFound();
  setRequestLocale(locale);

  const puzzles = getAllPuzzles(locale).filter((puzzle) => puzzle.dots >= hub.min && puzzle.dots <= hub.max);
  if (puzzles.length === 0) notFound();

  const path = `/difficulty/${hub.slug}/`;
  const schema = hubJsonLd({ locale, path, name: hub.h1, description: hub.seoDescription, puzzles });

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <HubTemplate locale={locale} h1={hub.h1} intro={hub.intro} puzzleCountLabel={`${puzzles.length} Puzzles`} puzzles={puzzles} />
  </>;
}
