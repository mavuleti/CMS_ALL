/**
 * app/rtl-preview/page.tsx
 * -----------------------------------------------------------------------
 * Standalone RTL QA route. Lives OUTSIDE app/[locale]/ so it is not part
 * of locale routing, generateStaticParams for locales, or the sitemap.
 * It exists purely so RTL layout/CSS can be visually reviewed before the
 * 'ar' locale is activated (see MERGE_PLAN.md for the activation steps).
 *
 * Visit /rtl-preview/ after `npm run dev` (or in the static export) to
 * see: a nav sample, a home-hero sample, a 3-card puzzle grid, and a
 * blog post excerpt, all rendered with dir="rtl" via RtlProvider and
 * modules/arabic/rtl.css.
 *
 * Not linked from anywhere in the live site nav — reach it by typing the
 * URL directly. Deleting modules/arabic/ and this file fully removes the
 * feature (see modules/arabic/README.md).
 * -----------------------------------------------------------------------
 */

import RtlProvider from '@/modules/arabic/RtlProvider';
import '@/modules/arabic/rtl.css';

type Dinosaur = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  funFact: string;
};

type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  author: string;
  sections: { heading: string; paragraphs: string[] }[];
};

type Messages = {
  nav: Record<string, string>;
  hero: Record<string, string>;
};

const messages = require('../../content/ar/messages.json') as Messages;
const dinosaurs = require('../../content/ar/puzzles-dinosaurs.json') as Dinosaur[];
const blogPosts = require('../../content/ar/blog.json') as BlogPost[];

const samplePuzzles = dinosaurs.slice(0, 3);
const sampleBlogPost = blogPosts[0];

export const metadata = {
  title: 'RTL Preview (internal QA — not indexed)',
  robots: { index: false, follow: false }
};

export default function RtlPreviewPage() {
  return (
    <RtlProvider as="main" className="rtl-preview-page">
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 16px' }}>
        <p
          style={{
            background: '#fff3cd',
            border: '1px solid #f0c36d',
            borderRadius: 8,
            padding: '10px 14px',
            marginBottom: 24,
            fontWeight: 700
          }}
          data-testid="preview-banner"
        >
          Internal RTL QA preview — content is English-fallback placeholder text (content/ar), not
          real Arabic translation. This route is not part of locale routing.
        </p>

        {/* ---------------------------------------------------------------- */}
        {/* Sample nav                                                       */}
        {/* ---------------------------------------------------------------- */}
        <header className="site-header" data-testid="preview-nav">
          <nav className="nav-shell" aria-label="Main navigation">
            <a href="#" className="brand" aria-label="DotToDotFreePrintables home">
              <span className="brand-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              DotToDotFreePrintables
            </a>
            <div className="nav-links">
              <a href="#">{messages.nav.kids}</a>
              <a href="#">{messages.nav.teachers}</a>
              <a href="#">{messages.nav.parents}</a>
              <a href="#">{messages.nav.blog}</a>
              <a href="#" className="nav-pill">
                {messages.nav.freePack}
              </a>
            </div>
          </nav>
        </header>

        {/* ---------------------------------------------------------------- */}
        {/* Sample hero                                                      */}
        {/* ---------------------------------------------------------------- */}
        <section className="hero" data-testid="preview-hero" style={{ marginTop: 24 }}>
          <div className="hero-text">
            <span className="eyebrow">{messages.hero.badge}</span>
            <h1>{messages.hero.h1}</h1>
            <p>{messages.hero.description}</p>
            <div className="hero-actions">
              <a href="#" className="button primary">
                {messages.hero.browsePuzzles}
              </a>
              <a href="#" className="button secondary">
                {messages.hero.starterPack}
              </a>
            </div>
            <dl className="stats">
              <div>
                <dt>{messages.hero.stat1Value}</dt>
                <dd>{messages.hero.stat1Label}</dd>
              </div>
              <div>
                <dt>{messages.hero.stat2Value}</dt>
                <dd>{messages.hero.stat2Label}</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Sample puzzle card grid                                          */}
        {/* ---------------------------------------------------------------- */}
        <section data-testid="preview-puzzle-grid" style={{ marginTop: 40 }}>
          <h2 className="section-heading">Puzzle grid sample</h2>
          <div className="puzzle-grid">
            {samplePuzzles.map((puzzle, index) => (
              <article className="puzzle-card" key={puzzle.slug} data-testid="preview-puzzle-card">
                <div className="puzzle-image">
                  {index === 0 && <span className="badge">New</span>}
                </div>
                <div className="puzzle-body">
                  <p className="puzzle-category">Dinosaurs</p>
                  <h3>{puzzle.name}</h3>
                  <p>{puzzle.tagline}</p>
                  <div className="puzzle-meta">
                    {/* Dot-count and age use Western digits intentionally — see
                        MERGE_PLAN.md QA checklist item on numeral choice. */}
                    <span data-testid="dot-count">61 dots</span>
                    <span>Ages 6-9</span>
                  </div>
                  <div className="difficulty" aria-hidden="true">
                    <span className="on" />
                    <span className="on" />
                    <span />
                  </div>
                  <a href="#" className="download-link" data-testid="preview-download-button">
                    Download PDF
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Sample blog post                                                 */}
        {/* ---------------------------------------------------------------- */}
        <nav className="breadcrumb" aria-label="Breadcrumb" data-testid="preview-breadcrumb" style={{ marginTop: 40 }}>
          <a href="#">Home</a>
          <span aria-hidden="true">/</span>
          <a href="#">Blog</a>
          <span aria-hidden="true">/</span>
          <span>{sampleBlogPost.title}</span>
        </nav>
        <article data-testid="preview-blog-post" style={{ marginTop: 16 }}>
          <p className="puzzle-category">
            {sampleBlogPost.category} · {sampleBlogPost.readTime}
          </p>
          <h1>{sampleBlogPost.title}</h1>
          <p>{sampleBlogPost.description}</p>
          {sampleBlogPost.sections.slice(0, 2).map((section, index) => (
            <section key={index}>
              {section.heading && <h2>{section.heading}</h2>}
              {section.paragraphs.map((paragraph, pIndex) => (
                <p key={pIndex}>{paragraph}</p>
              ))}
            </section>
          ))}
        </article>

        <footer className="footer" data-testid="preview-footer" style={{ marginTop: 40 }}>
          <nav aria-label="Footer navigation">
            <a href="#">{messages.nav.kids}</a>
            <a href="#">{messages.nav.teachers}</a>
            <a href="#">{messages.nav.contact}</a>
          </nav>
          <p>© 2026 DotToDotFreePrintables — RTL preview footer sample</p>
        </footer>
      </div>
    </RtlProvider>
  );
}
