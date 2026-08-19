import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getAllPuzzles } from '@/lib/category-registry';
import { getAgeRange } from '@/lib/age';
import { AGE_HUBS } from '@/lib/hub-content';
import { SITE_NAME } from '@/lib/seo';
import HubTemplate, { hubJsonLd } from '@/components/templates/HubTemplate';

export type AgeHubRouteProps = { params: Promise<{ locale: string; range: string }> };

// Only generate a hub page for ranges that actually have matching puzzles —
// see the equivalent guard in app/[locale]/difficulty/[tier]/page.tsx.
export function generateStaticParams() {
  const puzzles = getAllPuzzles('en');
  return AGE_HUBS
    .filter((hub) => puzzles.some((puzzle) => {
      const puzzleRange = getAgeRange(puzzle.age);
      return Boolean(puzzleRange) && puzzleRange!.max >= hub.min && puzzleRange!.min <= hub.max;
    }))
    .map((hub) => ({ locale: 'en', range: hub.range }));
}

export async function generateMetadata({ params }: AgeHubRouteProps): Promise<Metadata> {
  const { locale, range } = await params;
  const hub = locale === 'en' ? AGE_HUBS.find((item) => item.range === range) : undefined;
  if (!hub) return {};
  const path = `/ages/${hub.range}/`;
  return {
    title: hub.seoTitle,
    description: hub.seoDescription,
    alternates: { canonical: `/en${path}`, languages: { 'x-default': `/en${path}`, en: `/en${path}` } },
    openGraph: { title: hub.seoTitle, description: hub.seoDescription, url: `/en${path}`, siteName: SITE_NAME, type: 'website' },
    twitter: { card: 'summary', title: hub.seoTitle, description: hub.seoDescription }
  };
}

export default async function AgeHubPage({ params }: AgeHubRouteProps) {
  const { locale, range } = await params;
  const hub = locale === 'en' ? AGE_HUBS.find((item) => item.range === range) : undefined;
  if (!hub) notFound();
  setRequestLocale(locale);

  const puzzles = getAllPuzzles(locale).filter((puzzle) => {
    const puzzleRange = getAgeRange(puzzle.age);
    return Boolean(puzzleRange) && puzzleRange!.max >= hub.min && puzzleRange!.min <= hub.max;
  });
  if (puzzles.length === 0) notFound();

  const path = `/ages/${hub.range}/`;
  const schema = hubJsonLd({ locale, path, name: hub.h1, description: hub.seoDescription, puzzles });

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <HubTemplate locale={locale} h1={hub.h1} intro={hub.intro} puzzleCountLabel={`${puzzles.length} Puzzles`} puzzles={puzzles} />
  </>;
}
