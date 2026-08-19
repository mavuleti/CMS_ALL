import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getAllPuzzles } from '@/lib/category-registry';
import { getAgeRange } from '@/lib/age';
import { routing } from '@/i18n/routing';
import { AGE_HUBS, getAgeHubText } from '@/lib/hub-content';
import { SITE_NAME, buildAlternates } from '@/lib/seo';
import HubTemplate, { hubJsonLd } from '@/components/templates/HubTemplate';

export type AgeHubRouteProps = { params: Promise<{ locale: string; range: string }> };

// Only generate a hub page for ranges that actually have matching puzzles --
// see the equivalent guard in app/[locale]/difficulty/[tier]/page.tsx. Age
// ranges parsed off puzzle data are structural (not translated text), so
// this guard checks the canonical 'en' catalog and applies to every locale.
export function generateStaticParams() {
  const puzzles = getAllPuzzles('en');
  const activeRanges = AGE_HUBS.filter((hub) => puzzles.some((puzzle) => {
    const puzzleRange = getAgeRange(puzzle.age);
    return Boolean(puzzleRange) && puzzleRange!.max >= hub.min && puzzleRange!.min <= hub.max;
  }));
  return routing.locales.flatMap((locale) => activeRanges.map((hub) => ({ locale, range: hub.range })));
}

export async function generateMetadata({ params }: AgeHubRouteProps): Promise<Metadata> {
  const { locale, range } = await params;
  const hub = AGE_HUBS.find((item) => item.range === range);
  if (!hub) return {};
  const text = getAgeHubText(locale, range);
  if (!text) return {};
  const path = `/ages/${hub.range}/`;
  return {
    title: text.seoTitle,
    description: text.seoDescription,
    alternates: buildAlternates(locale, path),
    openGraph: { title: text.seoTitle, description: text.seoDescription, url: `/${locale}${path}`, siteName: SITE_NAME, type: 'website' },
    twitter: { card: 'summary', title: text.seoTitle, description: text.seoDescription }
  };
}

export default async function AgeHubPage({ params }: AgeHubRouteProps) {
  const { locale, range } = await params;
  const hub = AGE_HUBS.find((item) => item.range === range);
  if (!hub) notFound();
  const text = getAgeHubText(locale, range);
  if (!text) notFound();
  setRequestLocale(locale);

  const puzzles = getAllPuzzles(locale).filter((puzzle) => {
    const puzzleRange = getAgeRange(puzzle.age);
    return Boolean(puzzleRange) && puzzleRange!.max >= hub.min && puzzleRange!.min <= hub.max;
  });
  if (puzzles.length === 0) notFound();

  const path = `/ages/${hub.range}/`;
  const schema = hubJsonLd({ locale, path, name: text.h1, description: text.seoDescription, puzzles });

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <HubTemplate locale={locale} h1={text.h1} intro={text.intro} puzzleCountLabel={`${puzzles.length} Puzzles`} puzzles={puzzles} />
  </>;
}
