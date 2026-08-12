/* eslint-disable no-restricted-syntax -- Shared template fallback labels are combined with localized puzzle data. */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Home, Star } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import AdSlot from '@/components/AdSlot';
import BestOf2026BookAd from '@/components/BestOf2026BookAd';
import DownloadButton from '@/components/DownloadButton';
import ResponsiveImage from '@/components/ResponsiveImage';
import ShareButtons from '@/components/ShareButtons';
import { routing } from '@/i18n/routing';
import { bareAgeRange, localizeAge } from '@/lib/age';
import { categories, getCategory } from '@/lib/category-registry';
import { localizeHtmlLinks } from '@/lib/localize-html-links';
import { puzzleImageAlt } from '@/lib/json-seo';
import { buildCommonHeaderMetadata } from '@/components/templates/CommonHeaderTemplate';
import { FaqBlock } from '@/components/sections';

export type PuzzleRouteProps = { params: Promise<{ locale: string; category: string; slug: string }> };

export function generatePuzzleStaticParams() {
  return Object.values(categories).flatMap((category) => routing.locales.flatMap((locale) =>
    category.isAvailable(locale) ? category.getPuzzles(locale).map((puzzle) => ({ locale, category: category.slug, slug: puzzle.slug })) : []
  ));
}

export async function generatePuzzleMetadata({ params }: PuzzleRouteProps): Promise<Metadata> {
  const { locale, category: categorySlug, slug } = await params;
  const category = getCategory(categorySlug);
  const puzzle = category?.getPuzzle(slug, locale);
  if (!category || !puzzle) return {};
  const title = puzzle.seoTitle ?? puzzle.name;
  const description = puzzle.seoDescription ?? puzzle.description;
  return buildCommonHeaderMetadata({
    locale,
    path: `/${categorySlug}/${slug}`,
    title,
    description,
    type: 'article',
    ogTitle: puzzle.seoOgTitle,
    ogDescription: puzzle.seoOgDescription,
    image: puzzle.image,
    imageAlt: puzzle.seoImageAlt ?? puzzleImageAlt(locale, puzzle, 'card')
  });
}

function DifficultyBar({ level, labels, ariaLabel }: { level: 1 | 2 | 3; labels: [string, string, string]; ariaLabel: string }) {
  return <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><div className="difficulty" role="img" aria-label={ariaLabel} style={{ margin: 0 }}>{[1, 2, 3].map((value) => <span key={value} className={value <= level ? 'on' : ''} />)}</div><span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--muted)' }}>{labels[level - 1]}</span></div>;
}

function ColoringGuide({ schemes, heading }: { schemes: any[]; heading: string }) {
  if (!Array.isArray(schemes) || schemes.length === 0) return null;
  return <section id="coloring-guide" className="section" style={{ paddingTop: 0, maxWidth: 800, margin: '0 auto', padding: '0 24px 48px' }}>
    <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', marginBottom: 18 }}>{heading}</h2>
    {schemes.map((scheme) => <article key={scheme.name} style={{ marginBottom: 28, paddingLeft: 16, borderLeft: '3px solid var(--pink-light, #f6a5c0)' }}>
      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: 6 }}>{scheme.name}</h3>
      {scheme.note && <p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: 10 }}>{scheme.note}</p>}
      {Array.isArray(scheme.mapping) && <ul style={{ lineHeight: 1.8, paddingLeft: 20, margin: 0 }}>{scheme.mapping.map((mapping: any) => <li key={`${scheme.name}-${mapping.range}-${mapping.part}`}>
        <strong>{mapping.range}{mapping.part ? ` (${mapping.part})` : ''}:</strong>{' '}
        {mapping.hex && <span aria-hidden="true" style={{ display: 'inline-block', width: 34, height: 14, borderRadius: 7, background: mapping.hex, border: '1px solid rgba(0,0,0,0.18)', verticalAlign: 'middle', marginRight: 6 }} />}
        {mapping.color}{mapping.why ? ` — ${mapping.why}` : ''}
      </li>)}</ul>}
    </article>)}
  </section>;
}

export default async function CommonPuzzleTemplate({ params }: PuzzleRouteProps) {
  const { locale, category: categorySlug, slug } = await params;
  const category = getCategory(categorySlug);
  const puzzle = category?.getPuzzle(slug, locale);
  if (!category || !puzzle || !category.isAvailable(locale)) notFound();
  setRequestLocale(locale);
  const tp = await getTranslations('puzzleDetail');
  const tc = await getTranslations('common');
  const tFaq = await getTranslations('faq');
  const difficultyLabels = [tp('difficultyEasy'), tp('difficultyMedium'), tp('difficultyHard')] as [string, string, string];
  const related = category.getPuzzles(locale).filter((item) => item.slug !== puzzle.slug).slice(0, 3);
  const breadcrumbSchema = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `https://dottodotfreeprintables.com/${locale}/` },
    { '@type': 'ListItem', position: 2, name: category.name, item: `https://dottodotfreeprintables.com/${locale}/${categorySlug}/` },
    { '@type': 'ListItem', position: 3, name: puzzle.name, item: `https://dottodotfreeprintables.com/${locale}/${categorySlug}/${puzzle.slug}/` }
  ] };
  const exportedSchema = puzzle.header?.json_ld ? { '@context': 'https://schema.org', '@type': puzzle.header.json_ld.type, name: puzzle.header.json_ld.name, description: puzzle.header.json_ld.description, image: puzzle.header.json_ld.image, educationalUse: puzzle.header.json_ld.educational_use, typicalAgeRange: puzzle.header.json_ld.age_range } : null;

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    {exportedSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(exportedSchema) }} />}
    <main>
      <nav className="breadcrumb" aria-label={tc('breadcrumbAria')}><Link href={`/${locale}/`}><Home size={14} aria-hidden="true" /> {tc('home')}</Link><span aria-hidden="true"> › </span><Link href={`/${locale}/${categorySlug}/`}>{category.name}</Link><span aria-hidden="true"> › </span><span aria-current="page">{puzzle.name}</span></nav>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px 20px' }}><AdSlot id={`ad-puzzle-top-${puzzle.slug}`} size="leaderboard" label="Puzzle page - top" /></div>
      <div className="puzzle-page-layout section" style={{ paddingTop: 0 }}>
        <div className="puzzle-preview-col"><div className="puzzle-preview-card"><ResponsiveImage src={puzzle.image} alt={puzzleImageAlt(locale, puzzle, 'preview')} width={540} height={420} priority sizes="(max-width: 640px) 92vw, (max-width: 960px) 600px, 540px" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 16 }} /></div><div className="puzzle-side-ad"><AdSlot id={`ad-puzzle-side-${puzzle.slug}`} size="rectangle" label="Puzzle page - beside image" /></div></div>
        <div className="puzzle-details-col"><p className="eyebrow">Free {category.name} Printable</p><h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)' }}>{locale === 'en' && puzzle.seoH1 ? puzzle.seoH1 : `${puzzle.name} Dot-to-Dot Printable`}</h1><p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.65, margin: '14px 0 20px' }}>{puzzle.description}</p>
          <div className="meta-chips"><span className="chip">{tp('agesLabel')} {bareAgeRange(puzzle.age)}</span><span className="chip">{tp('dotsLabel')} 1–{puzzle.dots}</span><span className="chip chip--free">{tp('freeLabel')}</span></div>
          <div style={{ margin: '16px 0' }}><p style={{ fontWeight: 800, marginBottom: 8, fontSize: '0.9rem' }}>{tp('difficultyHeading')}</p><DifficultyBar level={puzzle.difficulty} labels={difficultyLabels} ariaLabel={tc('difficultyLabel', { level: puzzle.difficulty })} /></div>
          <div className="fun-fact-box"><span style={{ fontSize: '1.3rem' }} aria-hidden="true">!</span><div><strong>{tp('funFactPrefix')}</strong> {puzzle.funFact}</div></div>
          <div style={{ margin: '20px 0 16px' }}><AdSlot id={`ad-puzzle-predownload-${puzzle.slug}`} size="inline" label="Puzzle page - pre-download" /></div>
          {puzzle.pdf ? <DownloadButton puzzleId={puzzle.slug} pdfUrl={puzzle.pdf} locale={locale} ariaLabel={tc('downloadAria', { name: puzzle.name })} /> : <p className="asset-note">Printable PDF path is not present in the export JSON.</p>}
          <BestOf2026BookAd locale={locale} /><ShareButtons title={tc('shareTitle', { name: puzzle.name })} imageUrl={puzzle.image} compact /><p style={{ fontSize: '0.8rem', color: 'var(--muted)', marginTop: 10, lineHeight: 1.5 }}>{tp('noSignUp')}</p>
          <Link href={`/${locale}/${categorySlug}/`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 18, fontWeight: 800, color: '#d94f70', textDecoration: 'none' }}><ArrowLeft size={16} aria-hidden="true" /> Back to all {category.name} puzzles</Link>
        </div>
      </div>
      {puzzle.dotGuide && <section id="dot-guide" className="section" style={{ paddingTop: 0, maxWidth: 800, margin: '0 auto', padding: '0 24px 48px' }}><h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', marginBottom: 12 }}>{puzzle.name} Dot-to-Dot Puzzle Guide</h2><p style={{ color: 'var(--muted)', lineHeight: 1.7, marginBottom: 28 }} dangerouslySetInnerHTML={{ __html: localizeHtmlLinks(puzzle.dotGuide.intro, locale) }} />{puzzle.dotGuide.sections?.map((section: any) => <div key={section.range} style={{ marginBottom: 24, paddingLeft: 16, borderLeft: '3px solid var(--blue-light, #63b3ed)' }}><h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: 6 }}>{section.range} — {section.title}</h3><p style={{ lineHeight: 1.7, marginBottom: 6 }}>{section.learn}</p><div className="guide-fact"><span className="guide-fact__icon" aria-hidden="true">💡</span><div className="guide-fact__body"><span className="guide-fact__label">{tp('funFactLabel')}</span><br />{section.fact}</div></div></div>)}</section>}
      {related.length > 0 && <section className="section" style={{ paddingTop: 8 }}><div className="section-heading"><p className="eyebrow">More free {category.name} printables</p><h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}>{tp('youMightLike')}</h2></div><div className="puzzle-grid">{related.map((item) => <article className="puzzle-card" key={item.slug}><Link href={`/${locale}/${categorySlug}/${item.slug}/`} className="puzzle-image"><ResponsiveImage src={item.image} alt={puzzleImageAlt(locale, item, 'card')} width={420} height={320} sizes="(max-width: 760px) 92vw, 30vw" /></Link><div className="puzzle-body"><p className="puzzle-category">{category.name}</p><h3>{item.name}</h3><div className="puzzle-meta"><span>{localizeAge(tc, item.age)}</span><span>{tc('dots', { count: item.dots })}</span></div><Link href={`/${locale}/${categorySlug}/${item.slug}/`} className="download-link"><Star size={15} aria-hidden="true" /> {tc('viewDownload')}</Link></div></article>)}</div></section>}
      {puzzle.dotGuide?.outro && <section className="section" style={{ paddingTop: 0, maxWidth: 800 }}><p dangerouslySetInnerHTML={{ __html: localizeHtmlLinks(puzzle.dotGuide.outro, locale) }} /></section>}
      <ColoringGuide schemes={puzzle.dotGuide?.colorSchemes} heading={`${puzzle.name} Coloring Guide`} />
      {puzzle.faqs && puzzle.faqs.length > 0 && <FaqBlock faqs={puzzle.faqs} eyebrow={tFaq('eyebrow')} heading={tFaq('heading')} />}
    </main>
  </>;
}
