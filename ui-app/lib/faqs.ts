import fs from 'fs';
import path from 'path';

// Rich AEO/GEO FAQ packs (content/<locale>/faqs.json). Generated per locale —
// currently en, es, ar, de, fr. Locales without a pack gracefully fall back to
// the templated FAQ messages, so nothing renders in the wrong language.
// See FAQ-AEO-GEO-MASTER.md for the full editorial source + guidelines.

export type FaqItem = { q: string; a: string };

type FaqEntry = { url: string; faqs: FaqItem[] };
type FaqPack = {
  site: FaqEntry;
  categories: Record<string, FaqEntry>;
  puzzles: Record<string, FaqEntry>;
  blog: Record<string, FaqEntry>;
};

const cache = new Map<string, FaqPack | null>();

function getFaqPack(locale: string): FaqPack | null {
  if (cache.has(locale)) return cache.get(locale) ?? null;
  let pack: FaqPack | null = null;
  try {
    const file = path.join(process.cwd(), 'content', locale, 'faqs.json');
    if (fs.existsSync(file)) pack = JSON.parse(fs.readFileSync(file, 'utf8')) as FaqPack;
  } catch {
    pack = null;
  }
  cache.set(locale, pack);
  return pack;
}

export function siteFaqs(locale: string): FaqItem[] | null {
  return getFaqPack(locale)?.site?.faqs ?? null;
}

export function categoryFaqs(locale: string, categoryKey: string): FaqItem[] | null {
  return getFaqPack(locale)?.categories?.[categoryKey]?.faqs ?? null;
}

export function puzzleFaqs(locale: string, categoryKey: string, slug: string): FaqItem[] | null {
  return getFaqPack(locale)?.puzzles?.[`${categoryKey}/${slug}`]?.faqs ?? null;
}

export function blogFaqs(locale: string, slug: string): FaqItem[] | null {
  return getFaqPack(locale)?.blog?.[slug]?.faqs ?? null;
}
