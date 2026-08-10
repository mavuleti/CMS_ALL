import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import {
  ArrowRight,
  BookOpenCheck,
  Brain,
  ChevronDown,
  Clock,
  Download,
  Hand,
  HeartHandshake,
  Home,
  LayoutGrid,
  Pencil,
  Printer,
  ShieldCheck,
  Smile,
  Star,
  Users,
  Youtube
} from 'lucide-react';
import { getTranslations, getLocale } from 'next-intl/server';
import { siteFaqs, categoryFaqs, puzzleFaqs, blogFaqs } from '@/lib/faqs';
import { categories, puzzles } from '@/lib/site-data';
import { getActiveCategories } from '@/lib/nav-categories';
import { isPuzzlePageAvailable, isSectionAvailable, readSectionItems, contentLocaleFor } from '@/lib/section-locales';
import CategoryMenu, { type CategoryMenuItem } from '@/components/CategoryMenu';
import { getAllBlogPostsForLocale, formatBlogDate } from '@/lib/blog-data';
import ResponsiveImage from '@/components/ResponsiveImage';
import LiteYouTubeEmbed from '@/components/LiteYouTubeEmbed';
import FeedbackForm from '@/components/FeedbackForm';
import { isArabic, isGerman, isRussian, isSpanish, localizedPuzzleCardAlt } from '@/lib/json-seo';
import ShareButtons from '@/components/ShareButtons';
import HeaderSharePopover from '@/components/HeaderSharePopover';
import { appVersion } from '@/lib/app-version';
import TrustBadge from '@/components/TrustBadge';
import TopDownloadsLeaderboard from '@/components/TopDownloadsLeaderboard';
import HideOnLocaleHome from '@/components/HideOnLocaleHome';
import HeaderDotAnimation from '@/components/HeaderDotAnimation';

const NewsletterForm = dynamic(() => import('@/components/NewsletterForm'), { ssr: false });

function getPuzzleMessageKey(href: string) {
  return href.split('/').filter(Boolean).at(-1) ?? href;
}

function getAgeRange(age: string) {
  const match = age.match(/(\d+)[-–](\d+)/);
  if (!match) return null;
  return { min: Number(match[1]), max: Number(match[2]) };
}

export async function Navbar() {
  const t = await getTranslations('nav');
  const tCommon = await getTranslations('common');
  const tCategories = await getTranslations('categories');
  const tHome = await getTranslations('homepageUi');
  const { getLocale } = await import('next-intl/server');
  const locale = await getLocale();
  const homeHref = `/${locale}/`;
  const qrTargetUrl = `https://dottodotfreeprintables.com/${locale}/`;

  // Nav tile labels intentionally skip the homepage grid's "New!"/"Available
  // now!" badge popups — a quiet inline "New" suffix on Flowers/Cute reads
  // less noisy at this small tile size.
  const NAV_NEW_CATEGORY_IDS = new Set(['flowers', 'cute', 'circus']);
  const homeCategory: CategoryMenuItem = {
    id: 'home',
    href: homeHref,
    name: tCommon('home'),
    color: '#3578c7',
    icon: <Home size={26} aria-hidden="true" />
  };
  const navCategories: CategoryMenuItem[] = [
    homeCategory,
    ...getActiveCategories(locale)
      .sort((a, b) => {
        const trailingOrder = ['usa250', 'canada', 'uae'];
        const aIndex = trailingOrder.indexOf(a.id);
        const bIndex = trailingOrder.indexOf(b.id);
        if (aIndex === -1 && bIndex === -1) return 0;
        if (aIndex === -1) return -1;
        if (bIndex === -1) return 1;
        return aIndex - bIndex;
      })
      .map((category) => {
      const nameKey = `items.${category.id}.name`;
      const homeCategoryNameKey = `categoryNames.${category.id}`;
      const name = tHome.has(homeCategoryNameKey)
        ? tHome(homeCategoryNameKey)
        : tCategories.has(nameKey)
          ? tCategories(nameKey)
          : category.name;
      const Icon = category.Icon;
      return {
        id: category.id,
        href: `/${locale}${category.href}`,
        name,
        color: category.color,
        isNew: NAV_NEW_CATEGORY_IDS.has(category.id),
        // Rendered server-side and passed down as an element — categories
        // without an Icon (none currently, but new ones added via data only
        // might omit it) fall back to an initial-letter tile in CategoryMenu.
        icon: category.id === 'dinosaurs'
          ? <span className="category-emoji-icon" aria-hidden="true">🦖</span>
          : category.id === 'playgrounds'
            ? <span className="category-emoji-icon" aria-hidden="true">🛝</span>
            : category.id === 'circus'
              ? <span className="category-emoji-icon" aria-hidden="true">🤡</span>
            : category.id === 'canada'
              ? <span className="category-emoji-icon" aria-hidden="true">🍁</span>
              : category.id === 'cute'
                ? <span className="category-emoji-icon" aria-hidden="true">🐶</span>
            : Icon
              ? <Icon size={26} aria-hidden="true" />
              : null
      };
      })
  ];
  const learnCategory: CategoryMenuItem = {
    id: 'learn',
    href: `/${locale}/#categories`,
    name: tHome('more'),
    color: '#7c3aed',
    icon: <LayoutGrid size={26} aria-hidden="true" />
  };
  const firstCountryIndex = navCategories.findIndex((category) => category.id === 'usa250');
  navCategories.splice(firstCountryIndex === -1 ? navCategories.length : firstCountryIndex, 0, learnCategory);

  return (
    <>
    {/* Gives Next.js route scroll restoration a normal, visible target before
        it encounters the sticky header and fixed utility controls. */}
    <div className="route-scroll-anchor" aria-hidden="true" />
    <header className="site-header">
      <nav className="nav-shell" aria-label={tCategories('heading')}>
        {/* eslint-disable-next-line no-restricted-syntax -- "DotToDotFreePrintables" is the brand name; tCommon('home') supplies the translated part */}
        <Link href={homeHref} className="brand" aria-label={`DotToDotFreePrintables — ${tCommon('home')}`}>
          <span className="brand-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          {'DotToDotFreePrintables'}
        </Link>
        <CategoryMenu
          categories={navCategories}
          labels={{
            menuLabel: tHome('browseCategories'),
            openMenu: tHome('openCategories'),
            closeMenu: tHome('closeCategories')
          }}
        />
        <LanguageSwitcher currentLocale={locale} />
      </nav>
      <HeaderDotAnimation />
    </header>
    <HideOnLocaleHome locale={locale}>
      <HeaderSharePopover className="mobile-share-toggle" shareUrl={qrTargetUrl} shareTitle="DotToDotFreePrintables" />
    </HideOnLocaleHome>
    <HideOnLocaleHome locale={locale}><div className="floating-qr">
      <Link
        className="floating-qr-link icon-tooltip"
        href={homeHref}
        aria-label={t('scanMe')}
        title={t('scanMe')}
      >
        <img
          className="floating-qr-image"
          src="/images/site-qr.png"
          width={110}
          height={110}
          alt={t('scanMe')}
          loading="lazy"
        />
      </Link>
      <span className="floating-qr-label">{t('scanMe')}</span>
    </div></HideOnLocaleHome>
    </>
  );
}

export function HomeTopDownloads() {
  return <TopDownloadsLeaderboard />;
}

export async function HomeVideoSection() {
  const tc = await getTranslations('common');
  const tp = await getTranslations('puzzleSection');
  const videoTitle = tc('homeVideoH2');
  return (
    <section className="section" aria-labelledby="home-video-title">
      <div className="section-heading" style={{ textAlign: 'center' }}>
        <p className="eyebrow">{tc('homeVideoEyebrow')}</p>
        <h2 id="home-video-title">{videoTitle}</h2>
      </div>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <LiteYouTubeEmbed
          videoId="z9wam99CxJ0"
          title={videoTitle}
          thumbnailSrc="/images/dot-to-dot-video-thumbnail-380.webp"
          thumbnailSrcSet="/images/dot-to-dot-video-thumbnail-380.webp 380w, /images/dot-to-dot-video-thumbnail-480.webp 480w"
          thumbnailSizes="(max-width: 640px) 92vw, 380px"
        />
        <p className="home-video-download">
          <span>{tc('downloadFree')}:</span>
          <a href="/ocean/mermaid-dot-to-dot-printable.pdf" download>
            <Download size={18} aria-hidden="true" />
            {tp('items.mermaid-dot-to-dot-puzzle.name')}
          </a>
        </p>
      </div>
    </section>
  );
}

export async function AudienceStrip() {
  const t = await getTranslations('audience');
  const audiences = [
    { id: 'kids', title: t('kidsTitle'), text: t('kidsText'), Icon: Star },
    { id: 'parents', title: t('parentsTitle'), text: t('parentsText'), Icon: HeartHandshake },
    { id: 'teachers', title: t('teachersTitle'), text: t('teachersText'), Icon: BookOpenCheck }
  ];

  return (
    <section className="audience-grid" aria-label={`${t('kidsTitle')}, ${t('parentsTitle')}, ${t('teachersTitle')}`}>
      {audiences.map(({ id, title, text, Icon }) => (
        <article className="audience-card" id={id} key={title}>
          <Icon size={26} aria-hidden="true" />
          <h2>{title}</h2>
          <p>{text}</p>
        </article>
      ))}
    </section>
  );
}

export async function CategoryGrid({ excludeIds, includeBlog }: { excludeIds?: string[]; includeBlog?: boolean } = {}) {
  const t = await getTranslations('categories');
  const tBlog = await getTranslations('blog');
  const tNav = await getTranslations('nav');
  const { getLocale } = await import('next-intl/server');
  const locale = await getLocale();
  // Sections without real (or, for usa250, editorially-permitted) content
  // for this locale get their tile dropped entirely rather than showing a
  // dead-end category — see lib/section-locales.ts (also layout.tsx house ad
  // and Hero slider above).
  // Hide empty "coming soon" categories until they have puzzles — empty
  // category tiles read as under-construction content to AdSense reviewers.
  const sortedCategories = getActiveCategories(locale)
    .filter((category) => !excludeIds?.includes(category.id));

  return (
    <section className="section" id="categories">
      <div className="section-heading" style={{ textAlign: 'center' }}>
        <p className="eyebrow">{t('eyebrow')}</p>
        <h2>{t('heading')}</h2>
        <p style={{ maxWidth: '56ch', margin: '0.5rem auto 0', color: 'var(--muted)', lineHeight: 1.6 }}>
          {t('description')}
        </p>
      </div>

      <div className="category-grid">
        {sortedCategories.map(({ id, name, count, description, color, Icon, href, badge }) => {
          const isActive = !!href;
          const categoryNameKey = `items.${id}.name`;
          const categoryDescriptionKey = `items.${id}.description`;
          const categoryBadgeKey = `badges.${id}`;
          let categoryName = t.has(categoryNameKey) ? t(categoryNameKey) : name;
          let categoryDescription = t.has(categoryDescriptionKey) ? t(categoryDescriptionKey, { count }) : description;
          let categoryBadge = badge ? (t.has(categoryBadgeKey) ? t(categoryBadgeKey) : badge) : null;
          if (id === 'flowers' && locale === 'es') {
            categoryName = 'Flores';
            categoryDescription = 'Rosas y flores bonitas para practicar los números de forma tranquila y creativa.';
            categoryBadge = '¡Nuevo!';
          } else if (id === 'flowers' && locale.startsWith('ar')) {
            categoryName = 'الزهور';
            categoryDescription = 'ورود وأزهار جميلة لتدريب هادئ ومبدع على الأرقام.';
            categoryBadge = 'جديد!';
          }
          const categoryHref = href ? `/${locale}${href}` : undefined;
          const cardStyle = {
            '--accent': color,
            opacity: isActive ? 1 : 0.52,
            position: 'relative' as const,
            transition: 'transform 0.18s, box-shadow 0.18s',
            cursor: isActive ? 'pointer' : 'default'
          } as React.CSSProperties;

          const inner = (
            <>
              {badge && (
                <span className="category-badge">
                  {categoryBadge}
                </span>
              )}
              <span className="category-card__copy">
                <Icon size={30} aria-hidden="true" />
                <h3 style={{ marginTop: 8 }}>{categoryName}</h3>
                <p style={{ margin: '6px 0 10px', fontSize: '0.93rem' }}>{categoryDescription}</p>
              </span>
              {/* Per-category puzzle count hidden while the catalog is small; re-enable once counts are impressive.
              <span style={{ fontSize: '0.85rem' }}>{t('puzzles', { count })}</span> */}
              {!isActive && (
                <span style={{ display: 'block', marginTop: 10, fontSize: '0.75rem', fontWeight: 900, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  {t('comingSoon')}
                </span>
              )}
            </>
          );

          return isActive ? (
            <Link href={categoryHref!} key={id} className={id === 'usa250' ? 'category-card category-card--usa250' : 'category-card'} style={cardStyle}>
              {inner}
            </Link>
          ) : (
            <article className="category-card" key={name} style={cardStyle} aria-label={`${name} — ${t('comingSoon')}`}>
              {inner}
            </article>
          );
        })}
        {includeBlog && (
          <Link
            href={`/${locale}/blog/`}
            className="category-card"
            style={{ '--accent': '#7c3aed', position: 'relative' } as React.CSSProperties}
          >
            <span className="category-card__copy">
              <BookOpenCheck size={30} aria-hidden="true" />
              <h3 style={{ marginTop: 8 }}>{tNav('blog')}</h3>
              <p style={{ margin: '6px 0 10px', fontSize: '0.93rem' }}>{tBlog('heading')}</p>
            </span>
          </Link>
        )}
      </div>
    </section>
  );
}

export async function PuzzleSection() {
  const t = await getTranslations('puzzleSection');
  const tc = await getTranslations('common');
  const { getLocale } = await import('next-intl/server');
  const locale = await getLocale();
  const localizedPuzzleNames = new Map<string, string>();
  if (locale !== 'en') {
    for (const file of ['dinosaurs', 'ocean', 'playgrounds', 'garden', 'cute', 'uae', 'canada', 'usa-250']) {
      if (!isSectionAvailable(locale, `${file}/`)) continue;
      const items = readSectionItems(contentLocaleFor(locale), `${file}/`) as Array<{ slug: string; name: string }>;
      for (const item of items) localizedPuzzleNames.set(item.slug, item.name);
    }
  }
  const visiblePuzzles = puzzles
    .filter((puzzle) => {
      const [section, slug] = puzzle.href.split('/').filter(Boolean);
      return isPuzzlePageAvailable(locale, `${section}/`, slug);
    });

  return (
    <section className="section puzzles-section" id="puzzles">
      <div className="section-heading split">
        <div>
          <p className="eyebrow">{t('eyebrow')}</p>
          <h2>{t('heading')}</h2>
        </div>
      </div>
      <div className="puzzle-grid">
        {visiblePuzzles.map((puzzle) => {
          const puzzleKey = getPuzzleMessageKey(puzzle.href);
          const messageKey = `items.${puzzleKey}.name`;
          const puzzleName = t.has(messageKey)
            ? t(messageKey)
            : localizedPuzzleNames.get(puzzleKey) ?? puzzle.name;
          const ageRange = getAgeRange(puzzle.age);
          const localizedAge = ageRange ? tc('ageRange', ageRange) : puzzle.age;

          return (
            <article className="puzzle-card" key={puzzle.name}>
              <Link href={`/${locale}${puzzle.href}`} className="puzzle-image">
                <ResponsiveImage
                  src={puzzle.image}
                  alt={isArabic(locale) || isSpanish(locale) || isGerman(locale) || isRussian(locale)
                    ? localizedPuzzleCardAlt(locale, puzzleName)
                    : t('imageAlt', { name: puzzleName, age: localizedAge })}
                  width={420}
                  height={356}
                  sizes="(max-width: 760px) 92vw, 30vw"
                />
                {puzzle.isNew ? <span className="badge" aria-hidden="true">{t('new')}</span> : null}
              </Link>
              <div className="puzzle-body">
                <p className="puzzle-category">{t.has(`categories.${puzzle.category}`) ? t(`categories.${puzzle.category}`) : puzzle.category}</p>
                <h3>{puzzleName}</h3>
                <div className="puzzle-meta">
                  <span>{localizedAge}</span>
                  <span>{tc('dots', { count: puzzle.dots })}</span>
                </div>
                <div className="difficulty" role="img" aria-label={tc('difficultyLabel', { level: puzzle.difficulty })}>
                  {[1, 2, 3].map((level) => (
                    <span className={level <= puzzle.difficulty ? 'on' : ''} key={level} />
                  ))}
                </div>
                <Link href={`/${locale}${puzzle.href}`} className="download-link">
                  <Download size={17} aria-hidden="true" /> {t('downloadLink')}
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export async function BenefitsSection() {
  const t = await getTranslations('benefits');
  const benefits = [
    { Icon: Hand, title: t('fineMotorTitle'), text: t('fineMotorText') },
    { Icon: Brain, title: t('numberTitle'), text: t('numberText') },
    { Icon: Pencil, title: t('focusTitle'), text: t('focusText') },
    { Icon: Smile, title: t('confidenceTitle'), text: t('confidenceText') }
  ];

  return (
    <section className="section" aria-label={t('heading')}>
      <div className="section-heading">
        <p className="eyebrow">{t('eyebrow')}</p>
        <h2>{t('heading')}</h2>
        <p style={{ maxWidth: '60ch', margin: '0 auto', color: 'var(--text-2)' }}>{t('description')}</p>
      </div>
      <div className="trust-list" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
        {benefits.map(({ Icon, title, text }) => (
          <div className="trust-item" key={title}>
            <Icon size={24} aria-hidden="true" />
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export async function HowToSection() {
  const t = await getTranslations('howTo');
  const steps = [
    { number: '1', title: t('step1Title'), text: t('step1Text') },
    { number: '2', title: t('step2Title'), text: t('step2Text') },
    { number: '3', title: t('step3Title'), text: t('step3Text') }
  ];

  return (
    <section className="section" aria-label={t('heading')}>
      <div className="section-heading">
        <p className="eyebrow">{t('eyebrow')}</p>
        <h2>{t('heading')}</h2>
      </div>
      <ol className="howto-steps" style={{ listStyle: 'none', padding: 0, display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {steps.map(({ number, title, text }) => (
          <li key={number} className="trust-item" style={{ flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: 'var(--brand)', color: '#fff', fontWeight: 800, fontSize: '1rem', flexShrink: 0 }}>{number}</span>
              <h3 style={{ margin: 0 }}>{title}</h3>
            </div>
            <p style={{ margin: 0 }}>{text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export async function TrustSection() {
  const t = await getTranslations('trust');
  const items = [
    [t('noAccountTitle'), t('noAccountText')],
    [t('safeTitle'), t('safeText')],
    [t('fastTitle'), t('fastText')]
  ];

  return (
    <section className="trust-section" aria-label={t('heading')}>
      <div>
        <p className="eyebrow">{t('eyebrow')}</p>
        <h2>{t('heading')}</h2>
      </div>
      <div className="trust-list">
        {items.map(([title, text]) => (
          <div className="trust-item" key={title}>
            <Clock size={22} aria-hidden="true" />
            <div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

type FaqItem = { q: string; a: string };

// Shared FAQ renderer: visible <details> Q&A plus matching FAQPage JSON-LD.
// The JSON-LD mirrors the visible text exactly (a Google requirement) so
// search engines and AI assistants (AEO/GEO) can quote these answers directly.
function FaqBlock({ faqs, eyebrow, heading, sectionId }: { faqs: FaqItem[]; eyebrow: string; heading: string; sectionId?: string }) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a }
    }))
  };

  return (
    <section className="section" id={sectionId} aria-label={heading}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="section-heading">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{heading}</h2>
      </div>
      <div className="faq-list" style={{ maxWidth: '72ch', margin: '0 auto', display: 'grid', gap: '1rem' }}>
        {faqs.map(({ q, a }) => (
          <details key={q} className="faq-item" style={{ border: '1px solid var(--border)', borderRadius: '0.75rem', padding: '1.25rem 1.5rem' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 700, fontSize: '1.05rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', listStyle: 'none', userSelect: 'none' }}>
              {q}
              <ChevronDown size={20} aria-hidden="true" style={{ flexShrink: 0, transition: 'transform 0.2s' }} />
            </summary>
            <p style={{ margin: '1rem 0 0', color: 'var(--text-2)', lineHeight: 1.65 }}>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

// Homepage FAQ: rich AEO/GEO pack from content/<locale>/faqs.json when
// available (en/es/ar/de/fr, ~18 questions), else the templated 8-question set.
export async function FaqSection() {
  const t = await getTranslations('faq');
  const locale = await getLocale();
  const rich = siteFaqs(locale);
  const faqs = rich ?? [1, 2, 3, 4, 5, 6, 7, 8].map((i) => ({ q: t(`q${i}`), a: t(`a${i}`) }));
  return <FaqBlock faqs={faqs} eyebrow={t('eyebrow')} heading={t('heading')} sectionId="faq" />;
}

// Category-page FAQ: category-specific questions from the locale's faqs.json
// pack when available, else the four most relevant site-wide questions
// (free?, ages, PDF format, classroom use) from templated translations.
export async function CategoryFaqSection({ categoryKey }: { categoryKey?: string } = {}) {
  const t = await getTranslations('faq');
  const locale = await getLocale();
  const rich = categoryKey ? categoryFaqs(locale, categoryKey) : null;
  const faqs = rich ?? [1, 2, 3, 5].map((i) => ({ q: t(`q${i}`), a: t(`a${i}`) }));
  return <FaqBlock faqs={faqs} eyebrow={t('eyebrow')} heading={t('heading')} />;
}

// Puzzle-detail FAQ: unique per-puzzle questions (dot count, difficulty tier,
// skills, fun fact) from the locale's faqs.json pack when available, else
// three templated questions parameterized with name/age/dots.
export async function PuzzleFaqSection({ name, age, dots, category, slug }: { name: string; age: string; dots: number; category?: string; slug?: string }) {
  const t = await getTranslations('faq');
  const tp = await getTranslations('puzzleDetail');
  const locale = await getLocale();
  const rich = category && slug ? puzzleFaqs(locale, category, slug) : null;
  const values = { name, age, dots };
  const faqs = rich ?? [1, 2, 3].map((i) => ({ q: tp(`faqQ${i}`, values), a: tp(`faqA${i}`, values) }));
  return <FaqBlock faqs={faqs} eyebrow={t('eyebrow')} heading={t('heading')} />;
}

// Blog-post FAQ: post-specific questions from the locale's faqs.json pack.
// Renders nothing for locales/posts without a pack (no wrong-language text).
export async function BlogFaqSection({ slug }: { slug: string }) {
  const t = await getTranslations('faq');
  const locale = await getLocale();
  const faqs = blogFaqs(locale, slug);
  if (!faqs || faqs.length === 0) return null;
  return <FaqBlock faqs={faqs} eyebrow={t('eyebrow')} heading={t('heading')} />
}

export async function Newsletter() {
  const t = await getTranslations('newsletter');
  return (
    <section className="newsletter" id="free-pack">
      <div>
        <p className="eyebrow light">{t('eyebrow')}</p>
        <h2>{t('heading')}</h2>
        <p>{t('description')}</p>
      </div>
      <NewsletterForm />
    </section>
  );
}

export async function BlogPreview() {
  const t = await getTranslations('blog');
  const { getLocale } = await import('next-intl/server');
  const locale = await getLocale();
  const localizedPosts = getAllBlogPostsForLocale(locale).slice(0, 3);
  return (
    <section className="section" aria-labelledby="blog-preview-title">
      <div className="section-heading split">
        <div>
          <p className="eyebrow">{t('eyebrow')}</p>
          <h2 id="blog-preview-title">{t('heading')}</h2>
        </div>
        <Link href={`/${locale}/blog/`} className="text-link">
          {t('viewAll')}
        </Link>
      </div>
      <div className="blog-grid">
        {localizedPosts.map((post) => (
          <article className="blog-card" key={post.slug}>
            <div className="blog-card-top">
              <span className="blog-category">{post.category}</span>
              <span>{post.readTime}</span>
            </div>
            <h3><Link href={`/${locale}/blog/${post.slug}/`}>{post.title}</Link></h3>
            <p>{post.description}</p>
            <div className="blog-card-footer">
              <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt, locale)}</time>
              <Link href={`/${locale}/blog/${post.slug}/`} aria-label={`${t('read')} ${post.title}`}>
                {t('read')} <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export async function Feedback() {
  const t = await getTranslations('feedback');
  return (
    <section className="section feedback-section" id="feedback" aria-label={t('heading')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="section-heading" style={{ textAlign: 'center' }}>
        <p className="eyebrow">{t('eyebrow')}</p>
        <h2>{t('heading')}</h2>
        <p style={{ maxWidth: '52ch', margin: '0 auto', color: 'var(--text-2)' }}>{t('description')}</p>
      </div>
      <div style={{ maxWidth: '480px', width: '100%', margin: '0 auto' }}>
        <FeedbackForm />
      </div>
    </section>
  );
}

export async function Footer() {
  const t = await getTranslations('footer');
  const tPurchase = await getTranslations('purchase');
  const { getLocale } = await import('next-intl/server');
  const locale = await getLocale();
  return (
    <footer className="footer">
      <div className="footer-brand">
        <Users size={22} aria-hidden="true" />
        {'DotToDotFreePrintables.com'}
      </div>
      <p>{t('description')}</p>
      <nav aria-label={t('description')}>
        <Link href={`/${locale}/blog/`}>{t('blog')}</Link>
        <Link href={`/${locale}/#faq`}>{t('faq')}</Link>
        <Link href={`/${locale}/#feedback`}>{t('feedback')}</Link>
        <Link href={`/${locale}/about/`}>{t('about')}</Link>
        <Link href={`/${locale}/contact/`}>{t('contact')}</Link>
        <Link href={`/${locale}/privacy-policy/`}>{t('privacy')}</Link>
        <Link href={`/${locale}/terms/`}>{t('terms')}</Link>
        <Link href={`/${locale}/premium/`}>{tPurchase('ad.packName')}</Link>
        <Link href="/sitemap.xml">{t('sitemap')}</Link>
      </nav>
      <div className="footer-social-bar" aria-label={t('description')}>
        <a
          className="desktop-social-link desktop-social-link--youtube icon-tooltip"
          href="https://www.youtube.com/@dottodotfreeprintables_com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={'YouTube'}
          title={'YouTube'}
        >
          <Youtube size={17} aria-hidden="true" />
        </a>
        <a
          className="desktop-social-link desktop-social-link--pinterest icon-tooltip"
          href="https://www.pinterest.com/hellokidsbookworld/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={'Pinterest'}
          title={'Pinterest'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
          </svg>
        </a>
      </div>
      <p style={{ fontSize: '0.8rem', marginTop: '1rem' }}>
        {t('copyright', { year: new Date().getFullYear() })} - v{appVersion}
      </p>
    </footer>
  );
}
