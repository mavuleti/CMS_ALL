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
import { ogImageFor } from '@/lib/seo';
import { puzzleImageAlt } from '@/lib/json-seo';
import { CategoryFaqSection } from '@/components/sections';

export type CollectionRouteProps = { params: Promise<{ locale: string; category: string }> };

type CollectionContentSection = {
  heading: string;
  paragraphs: string[];
  subsections?: CollectionContentSection[];
};

const flowerCardTitles: Record<string, string> = {
  'flax-flower-dot-to-dot-puzzle': 'Flax Dot-to-Dot',
  'nasturtium-flower-dot-to-dot-puzzle': 'Nasturtium Dot-to-Dot',
  'snowdrop-flower-dot-to-dot-puzzle': 'Snowdrop Dot-to-Dot',
  'buttercup-flower-dot-to-dot-puzzle': 'Buttercup Dot-to-Dot',
  'camellia-flower-dot-to-dot-puzzle': 'Camellia Dot-to-Dot',
  'forget-me-not-flower-dot-to-dot-puzzle': 'Forget-Me-Not Dot-to-Dot',
  'geranium-flower-dot-to-dot-puzzle': 'Geranium Dot-to-Dot',
  'jasmine-flower-dot-to-dot-puzzle': 'Jasmine Dot-to-Dot',
  'periwinkle-flower-dot-to-dot-puzzle': 'Periwinkle Dot-to-Dot',
  'petunia-flower-dot-to-dot-puzzle': 'Petunia Dot-to-Dot',
  'plumeria-flower-dot-to-dot-puzzle': 'Plumeria Dot-to-Dot',
  'carnation-flower-dot-to-dot-puzzle': 'Carnation Dot-to-Dot',
  'six-petal-lily-dot-to-dot-puzzle': 'Lily Dot-to-Dot',
  'peony-flower-dot-to-dot-puzzle': 'Peony Dot-to-Dot',
  'orchid-flower-dot-to-dot-puzzle': 'Orchid Dot-to-Dot',
  'lotus-flower-dot-to-dot-puzzle': 'Lotus Dot-to-Dot',
  'kawaii-sunflower-dot-to-dot-puzzle': 'Kawaii Sunflower Dot-to-Dot',
  'poppy-flower-dot-to-dot-puzzle': 'Poppy Dot-to-Dot',
  'tulip-flower-dot-to-dot-puzzle': 'Tulip Dot-to-Dot',
  'rose-flower-dot-to-dot-puzzle': 'Rose Dot-to-Dot'
};

const collectionPageNamespaces: Record<string, string> = {
  dinosaurs: 'dinosaursPage', ocean: 'oceanPage', uae: 'uaePage',
  playgrounds: 'playgroundsPage', garden: 'gardenPage', cute: 'cutePage',
  'usa-250': 'usa250Page', circus: 'circusPage', space: 'spacePage',
  canada: 'canadaPage', flowers: 'flowersPage'
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
    // Collection headers never carry their own og.image (the mapping_audit DBs
    // never captured one), so fall back to the category's first puzzle image —
    // same source puzzle pages already use for their own ogImage.
    image: header.og?.image ?? ogImageFor(category.getPuzzles(locale)[0]?.image)
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
  const contentSections = Array.isArray(exportedBody?.content_sections)
    ? exportedBody.content_sections as CollectionContentSection[]
    : [];
  const gridHeading = exportedBody?.grid_heading as string | undefined;
  const faqHeading = exportedBody?.faq_heading as string | undefined;
  const breadcrumbSchema = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `https://dottodotfreeprintables.com/${locale}/` },
    { '@type': 'ListItem', position: 2, name: categoryName, item: `https://dottodotfreeprintables.com/${locale}/${slug}/` }
  ] };
  const exportedSchema = category.header?.json_ld ? { '@context': 'https://schema.org', '@type': category.header.json_ld.type, name: category.header.json_ld.name, description: category.header.json_ld.description, image: category.header.json_ld.image } : null;
  const itemListSchema = {
    '@context': 'https://schema.org', '@type': 'ItemList', name: categoryName, numberOfItems: puzzles.length,
    itemListElement: puzzles.map((puzzle, index) => ({
      '@type': 'ListItem', position: index + 1,
      item: { '@type': 'CreativeWork', name: puzzle.name, url: `https://dottodotfreeprintables.com/${locale}/${slug}/${puzzle.slug}/` }
    }))
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
    {exportedSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(exportedSchema) }} />}
    <main>
      <nav className="breadcrumb" aria-label={tc('breadcrumbAria')}><Link href={`/${locale}/`}><Home size={14} aria-hidden="true" /> {tc('home')}</Link><span aria-hidden="true"> › </span><span aria-current="page">{categoryName}</span></nav>
      <div className="dino-page-hero"><p className="eyebrow">{tPage?.has('eyebrow') ? tPage('eyebrow', { count: puzzles.length }) : tCategories('puzzles', { count: puzzles.length })}</p><h1>{categoryH1}</h1><p className="hero-text" style={{ maxWidth: '60ch', margin: '16px auto 0' }}>{categoryDescription}</p></div>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px 24px' }}><AdSlot id={`ad-${slug}-top`} size="leaderboard" label={`${categoryName} page — top`} /></div>
      <section className="section" style={{ paddingTop: 0 }}>{gridHeading && <h2 style={{ textAlign: 'center', marginBottom: 28 }}>{gridHeading}</h2>}<div className="puzzle-grid">{puzzles.map((puzzle, index) =>
        <article className="puzzle-card dino-card" key={puzzle.slug}>
          <Link href={`/${locale}/${slug}/${puzzle.slug}/`} className="puzzle-image"><figure style={{ margin: 0, height: '100%' }}><ResponsiveImage src={puzzle.image} alt={puzzleImageAlt(locale, puzzle, 'card')} width={420} height={320} sizes="(max-width: 760px) 92vw, 30vw" priority={index === 0} /><figcaption className="sr-only">{puzzleImageAlt(locale, puzzle, 'card')}</figcaption></figure>{puzzle.isNew && <span className="badge">{tc('new')}</span>}</Link>
          <div className="puzzle-body"><p className="puzzle-category">{categoryName}</p>{slug === 'flowers' ? <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{flowerCardTitles[puzzle.slug] ?? puzzle.name}</div> : <h2 style={{ fontSize: '1.2rem' }}>{puzzle.name}</h2>}<p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: '4px 0 8px', lineHeight: 1.4 }}>{puzzle.tagline}</p><div className="puzzle-meta"><span>{localizeAge(tc, puzzle.age)}</span><span>{tc('dots', { count: puzzle.dots })}</span></div><DifficultyBar level={puzzle.difficulty} ariaLabel={tc('difficultyLabel', { level: puzzle.difficulty })} /><Link href={`/${locale}/${slug}/${puzzle.slug}/`} className="download-link" aria-label={`${tc('viewDownload')} - ${puzzle.name}`}><Download size={17} aria-hidden="true" /> {tc('viewDownload')}</Link></div>
        </article>
      )}</div></section>
      {contentSections.length > 0 ? <section className="section" style={{ paddingTop: 0, maxWidth: 820 }}>
        {contentSections.map((section) => <div key={section.heading} style={{ marginBottom: 38 }}>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>{section.heading}</h2>
          {section.paragraphs.map((paragraph) => <p key={paragraph} style={{ color: 'var(--muted)', lineHeight: 1.7, marginTop: 12 }}>{paragraph}</p>)}
          {section.subsections?.map((subsection) => <div key={subsection.heading} style={{ marginTop: 24 }}><h3>{subsection.heading}</h3>{subsection.paragraphs.map((paragraph) => <p key={paragraph} style={{ color: 'var(--muted)', lineHeight: 1.7, marginTop: 12 }}>{paragraph}</p>)}</div>)}
        </div>)}
      </section> : <section className="section" style={{ paddingTop: 0, maxWidth: 760, textAlign: 'center' }}><h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>{categoryTagline}</h2><p style={{ color: 'var(--muted)', lineHeight: 1.7, marginTop: 12 }}>{tPage?.has('whyP') ? tPage.rich('whyP', { link: (chunks) => <Link href={`/${locale}/`}>{chunks}</Link> }) : categoryDescription}</p><Link href={`/${locale}/`} className="button secondary" style={{ marginTop: 24, display: 'inline-flex' }}>{tPage?.has('backToCategories') ? tPage('backToCategories') : tc('home')}</Link></section>}
      <CategoryFaqSection categoryKey={slug} heading={faqHeading} />
    </main>
  </>;
}
