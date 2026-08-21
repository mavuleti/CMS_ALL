import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, Home, Users } from 'lucide-react';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import ShareButtons from '@/components/ShareButtons';
import { formatBlogDate, getAllBlogPostsForLocale, getBlogPostForLocale } from '@/lib/blog-data';
import { localizeHtmlLinks } from '@/lib/localize-html-links';
import { routing } from '@/i18n/routing';
import { SITE_NAME, absoluteUrl, buildAlternates } from '@/lib/seo';
import ResponsiveImage from '@/components/ResponsiveImage';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllBlogPostsForLocale(locale).map((post) => ({ locale, slug: post.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getBlogPostForLocale(slug, locale);
  if (!post) return {};
  const path = `/${locale}/blog/${post.slug}/`;
  const ogImage = { url: absoluteUrl(post.heroImage?.src ?? '/images/trex-61-puzzle.webp'), width: post.heroImage?.width ?? 1401, height: post.heroImage?.height ?? 1123, alt: post.heroImage?.alt ?? post.title };
  return {
    title: post.title,
    description: post.description,
    alternates: buildAlternates(locale, `/blog/${post.slug}`),
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: path,
      siteName: SITE_NAME,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [post.author],
      locale: localeToOgLocale[locale] ?? 'en_US',
      alternateLocale: allOgLocales.filter(l => l !== (localeToOgLocale[locale] ?? 'en_US')),
      images: [ogImage]
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImage.url]
    }
  };
}

const localeToLang: Record<string, string> = {
  en: 'en-US',
  fr: 'fr-FR',
  es: 'es-ES',
  de: 'de-DE',
  pt: 'pt-PT',
  it: 'it-IT',
  nl: 'nl-NL',
  sv: 'sv-SE',
  no: 'no-NO',
  pl: 'pl-PL',
  da: 'da-DK',
  fi: 'fi-FI',
  cs: 'cs-CZ',
  hu: 'hu-HU',
  ro: 'ro-RO',
  tr: 'tr-TR',
  'pt-BR': 'pt-BR',
  el: 'el-GR',
  ar: 'ar', id: 'id-ID', ja: 'ja-JP', ko: 'ko-KR', ru: 'ru-RU', th: 'th-TH', vi: 'vi-VN'
};
const localeToOgLocale: Record<string, string> = {
  en: 'en_US',
  fr: 'fr_FR',
  es: 'es_ES',
  de: 'de_DE',
  pt: 'pt_PT',
  it: 'it_IT',
  nl: 'nl_NL',
  sv: 'sv_SE',
  no: 'no_NO',
  pl: 'pl_PL',
  da: 'da_DK',
  fi: 'fi_FI',
  cs: 'cs_CZ',
  hu: 'hu_HU',
  ro: 'ro_RO',
  tr: 'tr_TR',
  'pt-BR': 'pt_BR',
  el: 'el_GR',
  ar: 'ar_SA', id: 'id_ID', ja: 'ja_JP', ko: 'ko_KR', ru: 'ru_RU', th: 'th_TH', vi: 'vi_VN'
};

// Routable locales intentionally held out of indexing (see lib/seo.ts for the
// full rationale and the other 3 files this list must stay in sync with).
const PLACEHOLDER_LOCALES: string[] = [
  'az', 'cs', 'el', 'fa', 'hr', 'hu', 'id', 'it', 'ko', 'lt', 'lv', 'nl',
  'no', 'pl', 'pt', 'pt-BR', 'ro', 'ru', 'sk', 'sl', 'sv', 'th', 'tr', 'uk', 'vi'
];

// All non-placeholder routable locales pass i18n content validation, so they're
// announced as alternates — matches the locale set already declared in sitemap.xml.
const allOgLocales = Object.entries(localeToOgLocale)
  .filter(([l]) => !PLACEHOLDER_LOCALES.includes(l))
  .map(([, v]) => v);

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = getBlogPostForLocale(slug, locale);
  if (!post) notFound();

  const tb = await getTranslations('blogPage');
  const tc = await getTranslations('common');

  const pageUrl = `https://dottodotfreeprintables.com/${locale}/blog/${post!.slug}/`;
  const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(pageUrl)}&description=${encodeURIComponent(post!.title + ' — ' + post!.description)}`;
  const bylineAuthor =
    locale === 'es' && post!.author === 'Equipo de DotToDotFreePrintables'
      ? 'el equipo de DotToDotFreePrintables'
      : post!.author;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: tc('home'), item: `https://dottodotfreeprintables.com/${locale}/` },
      { '@type': 'ListItem', position: 2, name: tb('breadcrumb'), item: `https://dottodotfreeprintables.com/${locale}/blog/` },
      { '@type': 'ListItem', position: 3, name: post!.title, item: pageUrl }
    ]
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post!.title,
    description: post!.description,
    datePublished: post!.publishedAt,
    dateModified: post!.updatedAt ?? post!.publishedAt,
    // Person author for named writers (E-E-A-T); Organization only for team bylines.
    author: /team|equipo/i.test(post!.author)
      ? { '@type': 'Organization', name: post!.author }
      : {
          '@type': 'Person',
          name: post!.author,
          ...(post!.authorBio ? { description: post!.authorBio } : {}),
          // Mira's identity is anchored on the About page (#mira section).
          ...(post!.author === 'Mira' ? { url: `https://dottodotfreeprintables.com/${locale}/about/#mira` } : {})
        },
    publisher: { '@type': 'Organization', name: 'DotToDotFreePrintables', url: 'https://dottodotfreeprintables.com' },
    mainEntityOfPage: pageUrl,
    articleSection: post!.category,
    inLanguage: localeToLang[locale] ?? 'en-US'
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <main>
        <nav className="breadcrumb" aria-label={tc('breadcrumbAria')}>
          <Link href={`/${locale}/`}><Home size={14} aria-hidden="true" /> {tc('home')}</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/${locale}/blog/`}>{tb('breadcrumb')}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{post!.title}</span>
        </nav>

        <article className="blog-article">
          <header>
            <p className="eyebrow">{post!.category}</p>
            <h1>{post!.title}</h1>
            <p className="blog-standfirst">{post!.description}</p>
            <div className="blog-byline">
              <span>{tb('by')} {bylineAuthor}</span>
              <time dateTime={post!.publishedAt}>{formatBlogDate(post!.publishedAt, locale)}</time>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                <Clock size={13} aria-hidden="true" />
                {post!.readTime}
              </span>
            </div>
          </header>

          {post!.heroImage && (
            <div className="blog-hero-image">
              <ResponsiveImage
                src={post!.heroImage.src}
                alt={post!.heroImage.alt}
                width={post!.heroImage.width ?? 1401}
                height={post!.heroImage.height ?? 1123}
                sizes="(max-width: 720px) 92vw, 665px"
                style={{ width: '100%', height: 'auto', borderRadius: '12px', marginBottom: '2rem' }}
                priority
              />
            </div>
          )}

          <div className="blog-content">
            {post!.sections.map((section, i) => (
              <section key={`${section.heading}-${i}`}>
                {section.heading ? <h2>{section.heading}</h2> : null}
                {section.paragraphs.map((paragraph, pi) => (
                  <p key={pi} dangerouslySetInnerHTML={{ __html: localizeHtmlLinks(paragraph, locale) }} />
                ))}
                {section.tips ? (
                  <ul>
                    {section.tips.map((tip) => <li key={tip}>{tip}</li>)}
                  </ul>
                ) : null}
                {i === 0 && post!.articleImage && (
                  <ResponsiveImage src={post!.articleImage.src} alt={post!.articleImage.alt} width={post!.articleImage.width ?? 1401} height={post!.articleImage.height ?? 1123} sizes="(max-width: 720px) 92vw, 665px" style={{ width: '100%', height: 'auto', borderRadius: '12px', margin: '1rem 0 2rem' }} />
                )}
              </section>
            ))}
          </div>

          <div className="blog-share-row">
            <Link href={`/${locale}/blog/`} className="blog-back-link">
              <ArrowLeft size={17} aria-hidden="true" /> {tb('backToAll')}
            </Link>
            <a href={pinterestUrl} target="_blank" rel="nofollow noopener noreferrer" className="pinterest-btn" aria-label={tb('savePinterest')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
              </svg>
              {tb('savePinterest')}
            </a>
            <ShareButtons title={`${post!.title} — ${post!.description}`} pageUrl={pageUrl} compact />
          </div>

          <div className="blog-author-bio">
            <div className="blog-author-avatar" aria-hidden="true"><Users size={22} /></div>
            <div>
              <p className="blog-author-name">{post!.author}</p>
              {post!.authorBio && <p className="blog-author-desc">{post!.authorBio}</p>}
            </div>
          </div>

          {post!.relatedLinks && post!.relatedLinks.length > 0 && (
            <div className="blog-related">
              <p className="eyebrow"><BookOpen size={14} aria-hidden="true" /> {tb('relatedEyebrow')}</p>
              <p className="blog-related-heading">{tb('relatedHeading')}</p>
              <div className="blog-related-grid">
                {post!.relatedLinks.map((link) => (
                  <Link href={`/${locale}${link.href}`} key={link.href} className="blog-related-card">
                    <strong>{link.title}</strong>
                    <span>{link.description}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
    </>
  );
}
