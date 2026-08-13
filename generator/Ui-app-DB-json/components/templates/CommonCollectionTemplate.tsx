/* eslint-disable no-restricted-syntax -- Category fallback copy is centralized in the shared registry. */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Download, Home } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import AdSlot from '@/components/AdSlot';
import ResponsiveImage from '@/components/ResponsiveImage';
import { routing } from '@/i18n/routing';
import { categories, getCategory } from '@/lib/category-registry';
import { localizeAge } from '@/lib/age';
import { buildCommonHeaderMetadata } from '@/components/templates/CommonHeaderTemplate';
import { puzzleImageAlt } from '@/lib/json-seo';
import { FaqBlock } from '@/components/sections';

export type CollectionRouteProps = { params: Promise<{ locale: string; category: string }> };

const collectionPageNamespaces: Record<string, string> = {
  dinosaurs: 'dinosaursPage', ocean: 'oceanPage', uae: 'uaePage',
  playgrounds: 'playgroundsPage', garden: 'gardenPage', cute: 'cutePage',
  'usa-250': 'usa250Page', circus: 'circusPage', space: 'spacePage',
};

export function generateCollectionStaticParams() {
  return Object.values(categories).flatMap((category) =>
    routing.locales.filter(category.isAvailable).map((locale) => ({ locale, category: category.slug }))
  );
}

export async function generateCollectionMetadata({ params }: CollectionRouteProps): Promise<Metadata> {
  const { locale, category: slug } = await params;
  const category = getCategory(slug, locale);
  if (!category) return {};
  setRequestLocale(locale);
  const pageNamespace = collectionPageNamespaces[slug];
  const tPage = pageNamespace ? await getTranslations(pageNamespace) : null;
  const tCategories = await getTranslations('categories');
  const categoryId = slug === 'usa-250' ? 'usa250' : slug;
  const header = category.header;
  return buildCommonHeaderMetadata({
    locale,
    path: `/${slug}`,
    title: tPage?.has('h1')
      ? tPage('h1')
      : tCategories.has(`items.${categoryId}.name`)
        ? tCategories(`items.${categoryId}.name`)
        : header.title ?? category.h1,
    description: tPage?.has('description')
      ? tPage('description')
      : tCategories.has(`items.${categoryId}.description`)
        ? tCategories(`items.${categoryId}.description`, { count: category._puzzles.length })
        : header.meta_description ?? category.description,
    type: 'website',
    ogTitle: header.og?.title,
    ogDescription: header.og?.description,
    image: header.og?.image
  });
}

function DifficultyBar({ level, ariaLabel }: { level: 1 | 2 | 3; ariaLabel: string }) {
  return <div className="difficulty" role="img" aria-label={ariaLabel}>{[1, 2, 3].map((value) => <span key={value} className={value <= level ? 'on' : ''} />)}</div>;
}

export default async function CommonCollectionTemplate({ params }: CollectionRouteProps) {
  const { locale, category: slug } = await params;
  const category = getCategory(slug, locale);
  if (!category || !category.isAvailable(locale)) notFound();
  setRequestLocale(locale);
  const tc = await getTranslations('common');
  const tFaq = await getTranslations('faq');
  const tCategories = await getTranslations('categories');
  const pageNamespace = collectionPageNamespaces[slug];
  const tPage = pageNamespace ? await getTranslations(pageNamespace) : null;
  const puzzles = category.getPuzzles(locale);
  const exportedBody = category.body;
  const categoryId = slug === 'usa-250' ? 'usa250' : slug;
  const categoryItemKey = `items.${categoryId}`;
  const categoryName = tPage?.has('category')
    ? tPage('category')
    : tCategories.has(`${categoryItemKey}.name`)
      ? tCategories(`${categoryItemKey}.name`)
      : exportedBody?.name ?? category.name;
  const categoryH1 = tPage?.has('h1') ? tPage('h1') : exportedBody?.h1 ?? categoryName;
  const categoryDescription = tPage?.has('description')
    ? tPage('description')
    : tCategories.has(`${categoryItemKey}.description`)
      ? tCategories(`${categoryItemKey}.description`, { count: puzzles.length })
      : exportedBody?.description ?? category.description;
  const categoryTagline = tPage?.has('whyH2') ? tPage('whyH2') : exportedBody?.tagline ?? categoryName;
  const breadcrumbSchema = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `https://dottodotfreeprintables.com/${locale}/` },
    { '@type': 'ListItem', position: 2, name: categoryName, item: `https://dottodotfreeprintables.com/${locale}/${slug}/` }
  ] };
  const exportedSchema = category.header?.json_ld ? { '@context': 'https://schema.org', '@type': category.header.json_ld.type, name: category.header.json_ld.name, description: category.header.json_ld.description, image: category.header.json_ld.image } : null;

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    {exportedSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(exportedSchema) }} />}
    <main>
      <nav className="breadcrumb" aria-label={tc('breadcrumbAria')}><Link href={`/${locale}/`}><Home size={14} aria-hidden="true" /> {tc('home')}</Link><span aria-hidden="true"> › </span><span aria-current="page">{categoryName}</span></nav>
      <div className="dino-page-hero"><p className="eyebrow">{tPage?.has('eyebrow') ? tPage('eyebrow', { count: puzzles.length }) : tCategories('puzzles', { count: puzzles.length })}</p><h1>{categoryH1}</h1><p className="hero-text" style={{ maxWidth: '60ch', margin: '16px auto 0' }}>{categoryDescription}</p></div>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px 24px' }}><AdSlot id={`ad-${slug}-top`} size="leaderboard" label={`${categoryName} page — top`} /></div>
      <section className="section" style={{ paddingTop: 0 }}><div className="puzzle-grid">{puzzles.map((puzzle, index) =>
        <article className="puzzle-card dino-card" key={puzzle.slug}>
          <Link href={`/${locale}/${slug}/${puzzle.slug}/`} className="puzzle-image"><ResponsiveImage src={puzzle.image} alt={puzzleImageAlt(locale, puzzle, 'card')} width={420} height={320} sizes="(max-width: 760px) 92vw, 30vw" priority={index === 0} />{puzzle.isNew && <span className="badge">{tc('new')}</span>}</Link>
          <div className="puzzle-body"><p className="puzzle-category">{categoryName}</p><h2 style={{ fontSize: '1.2rem' }}>{puzzle.name}</h2><p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: '4px 0 8px', lineHeight: 1.4 }}>{puzzle.tagline}</p><div className="puzzle-meta"><span>{localizeAge(tc, puzzle.age)}</span><span>{tc('dots', { count: puzzle.dots })}</span></div><DifficultyBar level={puzzle.difficulty} ariaLabel={tc('difficultyLabel', { level: puzzle.difficulty })} /><Link href={`/${locale}/${slug}/${puzzle.slug}/`} className="download-link" aria-label={`${tc('viewDownload')} - ${puzzle.name}`}><Download size={17} aria-hidden="true" /> {tc('viewDownload')}</Link></div>
        </article>
      )}</div></section>
      <section className="section" style={{ paddingTop: 0, maxWidth: 760, textAlign: 'center' }}><h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>{categoryTagline}</h2><p style={{ color: 'var(--muted)', lineHeight: 1.7, marginTop: 12 }}>{tPage?.has('whyP') ? tPage.rich('whyP', { link: (chunks) => <Link href={`/${locale}/`}>{chunks}</Link> }) : categoryDescription}</p><Link href={`/${locale}/`} className="button secondary" style={{ marginTop: 24, display: 'inline-flex' }}>{tPage?.has('backToCategories') ? tPage('backToCategories') : tc('home')}</Link></section>
      {category.faqs.length > 0 && <FaqBlock faqs={category.faqs} eyebrow={tFaq('eyebrow')} heading={tFaq('heading')} />}
    </main>
  </>;
}
