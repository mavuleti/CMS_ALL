import type { Metadata } from 'next';
import RtlProvider from '@/modules/arabic/RtlProvider';

// This route sits outside app/[locale]/ and is not linked from site
// navigation — it's a lightweight, no-server-render-needed way to QA
// modules/arabic/rtl.css in isolation, before/without touching the real
// locale layout. Content here is deliberately English placeholder copy
// (see the on-page banner) since only the CSS/layout behavior under
// dir="rtl" is under test, not translated Arabic text.
export const metadata: Metadata = {
  title: 'RTL Preview (internal QA) | DotToDotFreePrintables.com',
  description: 'Internal-only RTL CSS QA preview. Not a real site page.',
  robots: { index: false, follow: false }
};

export default function RtlPreviewPage() {
  return (
    <RtlProvider>
      <div data-testid="preview-banner" style={{ background: '#fff3cd', color: '#664d03', padding: '10px 16px', textAlign: 'center', fontWeight: 700 }}>
        Internal QA preview — English-fallback placeholder copy, not real Arabic translations. For RTL CSS/layout QA only.
      </div>

      <header data-testid="preview-nav">
        <div className="nav-shell">
          <span className="brand-dots" style={{ fontWeight: 900 }}>
            DotToDot
          </span>
          <nav className="nav-links">
            <a href="#">Dinosaurs</a>
            <a href="#">Ocean</a>
            <a href="#">Blog</a>
          </nav>
        </div>
      </header>

      <nav className="breadcrumb" data-testid="preview-breadcrumb" aria-label="Breadcrumb">
        <a href="#">Home</a>
        <span>/</span>
        <a href="#">Dinosaurs</a>
        <span>/</span>
        <span>Brontosaurus</span>
      </nav>

      <section className="hero" data-testid="preview-hero">
        <h1>Free Printable Dot to Dot Puzzles</h1>
        <p>Sample hero copy for RTL layout QA.</p>
        <div className="hero-actions">
          <a href="#" className="button primary">
            Download Now
          </a>
          <a href="#" className="button secondary">
            Browse All
          </a>
        </div>
      </section>

      <section aria-label="Sample puzzles">
        {['Brontosaurus', 'T-Rex', 'Stegosaurus'].map((name, index) => (
          <article key={name} data-testid="preview-puzzle-card">
            <div className="puzzle-image">
              <span className="badge">Popular</span>
            </div>
            <div className="puzzle-body">
              <h3>{name} Dot to Dot</h3>
              <div className="puzzle-meta">
                <span data-testid="dot-count">{50 + index} dots</span>
                <span>Ages 4-8</span>
              </div>
              <a href="#" className="button download-link" data-testid="preview-download-button">
                <span aria-hidden="true">⬇</span> Download PDF
              </a>
            </div>
          </article>
        ))}
      </section>

      <article data-testid="preview-blog-post">
        {/* This sample blog post excerpt intentionally uses its own top-level
            heading (via role/aria-level rather than a real <h1> tag) so the
            page keeps exactly one true <h1> — see scripts/audit-static-html.mjs's
            sitewide "exactly one <h1>" rule, which this noindex QA route still
            has to satisfy. */}
        <div role="heading" aria-level={1} style={{ fontSize: '1.6rem', fontWeight: 900 }}>
          Benefits of Dot to Dot Puzzles for Kids
        </div>
        <h2>Fine Motor Skills</h2>
        <p>Sample blog excerpt copy for RTL layout QA.</p>
      </article>

      <footer className="footer" data-testid="preview-footer">
        <nav>
          <a href="#">About</a>
          <a href="#">Contact</a>
          <a href="#">Privacy Policy</a>
        </nav>
      </footer>
    </RtlProvider>
  );
}
