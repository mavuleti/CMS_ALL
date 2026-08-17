import type { Metadata } from 'next';
import { buildAlternates, SITE_NAME } from '@/lib/seo';

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
};

/** Shared document metadata for every collection and puzzle route. */
export function buildCommonHeaderMetadata({
  locale,
  path,
  title,
  description,
  type,
  ogTitle,
  ogDescription,
  image,
  imageAlt
}: CommonHeaderTemplateOptions): Metadata {
  const socialTitle = ogTitle ?? title;
  const socialDescription = ogDescription ?? description;
  const imageMetadata = image ? [{ url: image, ...(imageAlt ? { alt: imageAlt } : {}) }] : undefined;

  return {
    title,
    description,
    alternates: buildAlternates(locale, path),
    openGraph: {
      title: socialTitle,
      description: socialDescription,
      url: `/${locale}${path}/`,
      siteName: SITE_NAME,
      type,
      ...(imageMetadata ? { images: imageMetadata } : {})
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: socialTitle,
      description: socialDescription,
      ...(imageMetadata ? { images: imageMetadata.map((entry) => entry.url) } : {})
    }
  };
}
