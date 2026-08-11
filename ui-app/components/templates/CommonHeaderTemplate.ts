import type { Metadata } from 'next';
import { buildAlternates, DEFAULT_OG_IMAGE, ogAlternateLocalesFor, ogLocaleFor, SITE_NAME } from '@/lib/seo';

type CommonHeaderTemplateOptions = {
  locale: string;
  path: string;
  title: string;
  description: string;
  type: 'article' | 'website';
  ogTitle?: string;
  ogDescription?: string;
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  /** Article-only OpenGraph fields (blog posts). */
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
};

/** Shared document metadata for every page: home, static (about/contact/terms/privacy), blog, collection, and puzzle routes. */
export function buildCommonHeaderMetadata({
  locale,
  path,
  title,
  description,
  type,
  ogTitle,
  ogDescription,
  image,
  imageAlt,
  imageWidth,
  imageHeight,
  publishedTime,
  modifiedTime,
  authors
}: CommonHeaderTemplateOptions): Metadata {
  const socialTitle = ogTitle ?? title;
  const socialDescription = ogDescription ?? description;
  const imageMetadata = image
    ? [{ url: image, ...(imageWidth ? { width: imageWidth } : {}), ...(imageHeight ? { height: imageHeight } : {}), ...(imageAlt ? { alt: imageAlt } : {}) }]
    : [{ ...DEFAULT_OG_IMAGE, alt: imageAlt ?? DEFAULT_OG_IMAGE.alt }];
  const openGraphCommon = {
    title: socialTitle,
    description: socialDescription,
    url: `/${locale}${path}/`,
    siteName: SITE_NAME,
    locale: ogLocaleFor(locale),
    alternateLocale: ogAlternateLocalesFor(locale),
    images: imageMetadata
  };

  return {
    title,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: type === 'article'
      ? { ...openGraphCommon, type: 'article', publishedTime, modifiedTime, authors }
      : { ...openGraphCommon, type: 'website' },
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description: socialDescription,
      images: imageMetadata.map((entry) => entry.url)
    }
  };
}
