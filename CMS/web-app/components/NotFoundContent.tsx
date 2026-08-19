import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { categories } from '@/lib/category-registry';

const FEATURED_CATEGORY_SLUGS = ['dinosaurs', 'ocean', 'space', 'cute'];

// Callers must have already called setRequestLocale(locale) before rendering this.
export default async function NotFoundContent({ locale }: { locale: string }) {
  const tNotFound = await getTranslations('notFound');
  const tCommon = await getTranslations('common');
  const tNav = await getTranslations('nav');
  const tCategories = await getTranslations('categories');

  const featuredCategories = FEATURED_CATEGORY_SLUGS
    .map((slug) => categories[slug])
    .filter((category) => category?.isAvailable(locale));

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px', textAlign: 'center' }}>
      <p className="eyebrow">404</p>
      <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}>{tNotFound('heading')}</h1>
      <p style={{ color: 'var(--muted)', lineHeight: 1.7, margin: '16px 0 32px' }}>{tNotFound('message')}</p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 40, flexWrap: 'wrap' }}>
        <Link href={`/${locale}/#search`} className="button" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Search size={17} aria-hidden="true" /> {tNav('search')}
        </Link>
        <Link href={`/${locale}/`} className="button secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Home size={17} aria-hidden="true" /> {tCommon('home')}
        </Link>
      </div>

      {featuredCategories.length > 0 && (
        <section>
          <h2 style={{ fontSize: '1.2rem', marginBottom: 16 }}>{tNotFound('categoriesHeading')}</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
            {featuredCategories.map((category) => {
              const categoryId = category.slug === 'usa-250' ? 'usa250' : category.slug;
              const name = tCategories.has(`items.${categoryId}.name`) ? tCategories(`items.${categoryId}.name`) : category.name;
              return (
                <Link key={category.slug} href={`/${locale}/${category.slug}/`} className="button secondary">
                  {name}
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
