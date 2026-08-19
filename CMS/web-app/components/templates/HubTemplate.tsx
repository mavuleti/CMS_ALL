/* eslint-disable no-restricted-syntax -- Age/difficulty hub pages are English-only by
   explicit decision (see lib/hub-content.ts) — no content/<locale> pipeline backs this
   copy yet, so it isn't routed through next-intl. Route it through t() once translated
   copy exists and locales are added to generateStaticParams. */
import Link from 'next/link';
import { Download, Home } from 'lucide-react';
import ResponsiveImage from '@/components/ResponsiveImage';
import { puzzleImageAlt } from '@/lib/json-seo';
import { absoluteUrl } from '@/lib/seo';
import type { CrossTierPuzzle } from '@/lib/category-registry';

function DifficultyBar({ level, ariaLabel }: { level: 1 | 2 | 3; ariaLabel: string }) {
  return <div className="difficulty" role="img" aria-label={ariaLabel}>{[1, 2, 3].map((value) => <span key={value} className={value <= level ? 'on' : ''} />)}</div>;
}

export function hubJsonLd({ locale, path, name, description, puzzles }: { locale: string; path: string; name: string; description: string; puzzles: CrossTierPuzzle[] }) {
  const normalizedPath = path.endsWith('/') ? path : `${path}/`;
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    url: absoluteUrl(`/${locale}${normalizedPath}`),
    inLanguage: locale,
    hasPart: puzzles.map((puzzle) => ({
      '@type': 'CreativeWork',
      name: puzzle.name,
      url: absoluteUrl(`/${locale}/${puzzle.categorySlug}/${puzzle.slug}/`)
    }))
  };
}

export default function HubTemplate({ locale, h1, intro, puzzleCountLabel, puzzles }: {
  locale: string;
  h1: string;
  intro: string;
  puzzleCountLabel: string;
  puzzles: CrossTierPuzzle[];
}) {
  return (
    <main>
      <nav className="breadcrumb" aria-label="Breadcrumb"><Link href={`/${locale}/`}><Home size={14} aria-hidden="true" /> Home</Link><span aria-hidden="true"> › </span><span aria-current="page">{h1}</span></nav>
      <div className="dino-page-hero"><p className="eyebrow">{puzzleCountLabel}</p><h1>{h1}</h1><p className="hero-text" style={{ maxWidth: '60ch', margin: '16px auto 0' }}>{intro}</p></div>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="puzzle-grid">{puzzles.map((puzzle, index) =>
          <article className="puzzle-card" key={`${puzzle.categorySlug}-${puzzle.slug}`}>
            <Link href={`/${locale}/${puzzle.categorySlug}/${puzzle.slug}/`} className="puzzle-image">
              <figure style={{ margin: 0, height: '100%' }}>
                <ResponsiveImage src={puzzle.image} alt={puzzleImageAlt(locale, puzzle, 'card')} width={420} height={320} sizes="(max-width: 760px) 92vw, 30vw" priority={index === 0} />
                <figcaption className="sr-only">{puzzleImageAlt(locale, puzzle, 'card')}</figcaption>
              </figure>
            </Link>
            <div className="puzzle-body">
              <p className="puzzle-category">{puzzle.categoryName}</p>
              <h2 style={{ fontSize: '1.2rem' }}>{puzzle.name}</h2>
              <div className="puzzle-meta"><span>Ages {puzzle.age}</span><span>{puzzle.dots} dots</span></div>
              <DifficultyBar level={puzzle.difficulty} ariaLabel={`Difficulty level ${puzzle.difficulty} of 3`} />
              <Link href={`/${locale}/${puzzle.categorySlug}/${puzzle.slug}/`} className="download-link" aria-label={`View & download - ${puzzle.name}`}><Download size={17} aria-hidden="true" /> View & Download</Link>
            </div>
          </article>
        )}</div>
      </section>
    </main>
  );
}
