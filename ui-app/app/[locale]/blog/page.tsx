import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Home } from 'lucide-react';
import { setRequestLocale, getTranslations } from 'next-intl/server';

import { getAllBlogPostsForLocale, formatBlogDate } from '@/lib/blog-data';
import { DEFAULT_OG_IMAGE } from '@/lib/seo';
import { localizedSocialImageAlt, localizedStaticSeo } from '@/lib/json-seo';
import { buildCommonHeaderMetadata } from '@/components/templates/CommonHeaderTemplate';

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const arabicSeo = localizedStaticSeo(locale, 'blog');
  const title = arabicSeo?.title ?? 'Dot-to-Dot Learning Blog for Parents and Teachers';
  const description = arabicSeo?.description ?? 'Practical dot-to-dot activity ideas, learning guides, printable tips, and classroom resources for parents and teachers.';
  const ogTitle = arabicSeo?.title ?? 'Dot-to-Dot Learning Blog';
  const ogDescription = arabicSeo?.description ?? 'Activity ideas and practical learning guides for parents and teachers.';
  return buildCommonHeaderMetadata({
    locale,
    path: '/blog',
    title,
    description,
    type: 'website',
    ogTitle,
    ogDescription,
    image: DEFAULT_OG_IMAGE.url,
    imageAlt: localizedSocialImageAlt(locale, 'Dot-to-dot learning blog for parents and teachers')
  });
}

export default async function BlogPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('blogPage');
  const tc = await getTranslations('common');

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `https://dottodotfreeprintables.com/${locale}/` },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `https://dottodotfreeprintables.com/${locale}/blog/` }
    ]
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <main>
        <nav className="breadcrumb" aria-label={tc('breadcrumbAria')}>
          <Link href={`/${locale}/`}><Home size={14} aria-hidden="true" /> {tc('home')}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{t('breadcrumb')}</span>
        </nav>

        <header className="blog-hero">
          <p className="eyebrow"><BookOpen size={18} aria-hidden="true" /> {t('eyebrow')}</p>
          <h1>{t('h1')}</h1>
          <p className="hero-text">{t('description')}</p>
        </header>

        <section className="section" aria-labelledby="all-articles">
          <div className="section-heading">
            <p className="eyebrow">{t('latestEyebrow')}</p>
            <h2 id="all-articles">{t('latestH2')}</h2>
          </div>
          <div className="blog-grid">
            {getAllBlogPostsForLocale(locale).map((post) => {
              return (
                <article className="blog-card" key={post.slug}>
                  <div className="blog-card-top">
                    <span className="blog-category">{post.category}</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2><Link href={`/${locale}/blog/${post.slug}/`}>{post.title}</Link></h2>
                  <p>{post.description}</p>
                  <div className="blog-card-footer">
                    <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt, locale)}</time>
                    <Link href={`/${locale}/blog/${post.slug}/`} aria-label={`${t('readArticle')} ${post.title}`}>
                      {t('readArticle')} <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
