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
import { buildCommonHeaderMetadata } from '@/components/templates/CommonHeaderTemplate';
import { collectionBodyContent, collectionHeaderSeo, puzzleImageAlt } from '@/lib/json-seo';

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
  const header = collectionHeaderSeo(locale, slug);
  return buildCommonHeaderMetadata({
    locale,
    path: `/${slug}`,
    title: header.title,
    description: header.description,
    type: 'website',
    ogTitle: header.ogTitle,
    ogDescription: header.ogDescription,
    image: header.image
  });
}

function DifficultyBar({ level, ariaLabel }: { level: 1 | 2 | 3; ariaLabel: string }) {
  return <div className="difficulty" role="img" aria-label={ariaLabel}>{[1, 2, 3].map((value) => <span key={value} className={value <= level ? 'on' : ''} />)}</div>;
}

const SITE_URL = 'https://dottodotfreeprintables.com';

export default async function CommonCollectionTemplate({ params }: CollectionRouteProps) {
  const { locale, category: slug } = await params;
  const category = getCategory(slug);
  if (!category || !category.isAvailable(locale)) notFound();
  setRequestLocale(locale);
  const tc = await getTranslations('common');
  const puzzles = category.getPuzzles(locale);
  const exportedHeader = collectionHeaderSeo(locale, slug);
  const exportedBody = collectionBodyContent(locale, slug);
  const categorySlug = exportedBody?.slug ?? slug;
  const categoryName = exportedBody?.name ?? category.name;
  const categoryH1 = exportedBody?.h1 ?? category.h1;
  const categoryDescription = exportedBody?.description ?? category.description;
  const categoryTagline = exportedBody?.tagline ?? category.whyH2;

  const breadcrumbSchema = exportedHeader.breadcrumbJsonLd
    ? { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: exportedHeader.breadcrumbJsonLd.items.map((item) => ({ '@type': 'ListItem', position: item.position, name: item.name, item: `${SITE_URL}/${locale}${item.path}` })) }
    : { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: tc('home'), item: `${SITE_URL}/${locale}/` },
        { '@type': 'ListItem', position: 2, name: categoryName, item: `${SITE_URL}/${locale}/${categorySlug}/` }
      ] };

  const collectionJsonLd = exportedHeader.jsonLd ? {
    '@context': 'https://schema.org',
    '@type': exportedHeader.jsonLd.type,
    name: exportedHeader.jsonLd.name ?? categoryName,
    description: exportedHeader.jsonLd.description ?? categoryDescription,
    image: exportedHeader.jsonLd.image ? `${SITE_URL}${exportedHeader.jsonLd.image}` : undefined,
    mainEntity: exportedHeader.jsonLd.main_entity ? {
      '@type': exportedHeader.jsonLd.main_entity.type,
      itemListElement: puzzles.map((puzzle, index) => ({ '@type': 'ListItem', position: index + 1, url: `${SITE_URL}/${locale}/${categorySlug}/${puzzle.slug}/` }))
    } : undefined
  } : null;

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    {collectionJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />}
    <main>
      <nav className="breadcrumb" aria-label={tc('breadcrumbAria')}><Link href={`/${locale}/`}><Home size={14} aria-hidden="true" /> {tc('home')}</Link><span aria-hidden="true"> › </span><span aria-current="page">{categoryName}</span></nav>
      <div className="dino-page-hero"><p className="eyebrow">{tc('freePrintablePuzzlesCount', { count: puzzles.length })}</p><h1>{categoryH1}</h1><p className="hero-text" style={{ maxWidth: '60ch', margin: '16px auto 0' }}>{categoryDescription}</p></div>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px 24px' }}><AdSlot id={`ad-${categorySlug}-top`} size="leaderboard" label={`${categoryName} page — top`} /></div>
      <section className="section" style={{ paddingTop: 0 }}><div className="puzzle-grid">{puzzles.map((puzzle, index) =>
        <article className="puzzle-card dino-card" key={puzzle.slug}>
          <Link href={`/${locale}/${categorySlug}/${puzzle.slug}/`} className="puzzle-image"><ResponsiveImage src={puzzle.image} alt={puzzleImageAlt(locale, puzzle, 'card')} width={420} height={320} sizes="(max-width: 760px) 92vw, 30vw" priority={index === 0} />{puzzle.isNew && <span className="badge">{tc('new')}</span>}</Link>
          <div className="puzzle-body"><p className="puzzle-category">{categoryName}</p><h2 style={{ fontSize: '1.2rem' }}>{puzzle.name}</h2><p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: '4px 0 8px', lineHeight: 1.4 }}>{puzzle.tagline}</p><div className="puzzle-meta"><span>{localizeAge(tc, puzzle.age)}</span><span>{tc('dots', { count: puzzle.dots })}</span></div><DifficultyBar level={puzzle.difficulty} ariaLabel={tc('difficultyLabel', { level: puzzle.difficulty })} /><Link href={`/${locale}/${categorySlug}/${puzzle.slug}/`} className="download-link" aria-label={`${tc('viewDownload')} - ${puzzle.name}`}><Download size={17} aria-hidden="true" /> {tc('viewDownload')}</Link></div>
        </article>
      )}</div></section>
      <section className="section" style={{ paddingTop: 0, maxWidth: 760, textAlign: 'center' }}><h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>{categoryTagline}</h2><p style={{ color: 'var(--muted)', lineHeight: 1.7, marginTop: 12 }}>{categoryDescription}</p><Link href={`/${locale}/`} className="button secondary" style={{ marginTop: 24, display: 'inline-flex' }}><span aria-hidden="true">← </span>{tc('backToAllCategories')}</Link></section>
      <CategoryFaqSection categoryKey={categorySlug} contentFaqs={exportedBody?.faqs} />
    </main>
  </>;
}
