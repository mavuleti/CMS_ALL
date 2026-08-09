import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Download, Home } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import AdSlot from '@/components/AdSlot';
import ResponsiveImage from '@/components/ResponsiveImage';
import { CategoryFaqSection } from '@/components/sections';
import { routing } from '@/i18n/routing';
import { categories, getCategory } from '@/lib/category-registry';
import { localizeAge } from '@/lib/age';
import { buildAlternates, SITE_NAME } from '@/lib/seo';
import { puzzleImageAlt } from '@/lib/localized-seo';

export type CollectionRouteProps = { params: Promise<{ locale: string; category: string }> };

export function generateCollectionStaticParams() {
  return Object.values(categories).flatMap((category) =>
    routing.locales.filter(category.isAvailable).map((locale) => ({ locale, category: category.slug }))
  );
}

export async function generateCollectionMetadata({ params }: CollectionRouteProps): Promise<Metadata> {
  const { locale, category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  const title = `${category.h1} — Free PDF Worksheets`;
  return {
    title,
    description: category.description,
    alternates: buildAlternates(locale, `/${slug}`),
    openGraph: { title, description: category.description, url: `/${locale}/${slug}/`, siteName: SITE_NAME, type: 'website' }
  };
}

function DifficultyBar({ level, ariaLabel }: { level: 1 | 2 | 3; ariaLabel: string }) {
  return <div className="difficulty" role="img" aria-label={ariaLabel}>{[1, 2, 3].map((value) => <span key={value} className={value <= level ? 'on' : ''} />)}</div>;
}

export default async function CommonCollectionTemplate({ params }: CollectionRouteProps) {
  const { locale, category: slug } = await params;
  const category = getCategory(slug);
  if (!category || !category.isAvailable(locale)) notFound();
  setRequestLocale(locale);
  const tc = await getTranslations('common');
  const puzzles = category.getPuzzles(locale);
  const breadcrumbSchema = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `https://dottodotfreeprintables.com/${locale}/` },
    { '@type': 'ListItem', position: 2, name: category.name, item: `https://dottodotfreeprintables.com/${locale}/${slug}/` }
  ] };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <main>
      <nav className="breadcrumb" aria-label={tc('breadcrumbAria')}><Link href={`/${locale}/`}><Home size={14} aria-hidden="true" /> {tc('home')}</Link><span aria-hidden="true"> › </span><span aria-current="page">{category.name}</span></nav>
      <div className="dino-page-hero"><p className="eyebrow">{puzzles.length} free printable puzzles</p><h1>{category.h1}</h1><p className="hero-text" style={{ maxWidth: '60ch', margin: '16px auto 0' }}>{category.description}</p></div>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px 24px' }}><AdSlot id={`ad-${slug}-top`} size="leaderboard" label={`${category.name} page — top`} /></div>
      <section className="section" style={{ paddingTop: 0 }}><div className="puzzle-grid">{puzzles.map((puzzle, index) =>
        <article className="puzzle-card dino-card" key={puzzle.slug}>
          <Link href={`/${locale}/${slug}/${puzzle.slug}/`} className="puzzle-image"><ResponsiveImage src={puzzle.image} alt={puzzleImageAlt(locale, puzzle, 'card')} width={420} height={320} sizes="(max-width: 760px) 92vw, 30vw" priority={index === 0} />{puzzle.isNew && <span className="badge">{tc('new')}</span>}</Link>
          <div className="puzzle-body"><p className="puzzle-category">{category.name}</p><h2 style={{ fontSize: '1.2rem' }}>{puzzle.name}</h2><p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: '4px 0 8px', lineHeight: 1.4 }}>{puzzle.tagline}</p><div className="puzzle-meta"><span>{localizeAge(tc, puzzle.age)}</span><span>{tc('dots', { count: puzzle.dots })}</span></div><DifficultyBar level={puzzle.difficulty} ariaLabel={tc('difficultyLabel', { level: puzzle.difficulty })} /><Link href={`/${locale}/${slug}/${puzzle.slug}/`} className="download-link" aria-label={`${tc('viewDownload')} - ${puzzle.name}`}><Download size={17} aria-hidden="true" /> {tc('viewDownload')}</Link></div>
        </article>
      )}</div></section>
      <section className="section" style={{ paddingTop: 0, maxWidth: 760, textAlign: 'center' }}><h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>{category.whyH2}</h2><p style={{ color: 'var(--muted)', lineHeight: 1.7, marginTop: 12 }}>{category.whyP}</p><Link href={`/${locale}/`} className="button secondary" style={{ marginTop: 24, display: 'inline-flex' }}>← Back to all categories</Link></section>
      <CategoryFaqSection categoryKey={slug} />
    </main>
  </>;
}
