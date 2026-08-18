import fs from 'node:fs';
import path from 'node:path';

export type BlogSection = { heading: string; paragraphs: string[]; tips?: string[] };
export type RelatedLink = { title: string; href: string; description: string };
export type BlogPost = {
  slug: string; title: string; description: string; category: string; readTime: string;
  author: string; authorBio?: string; publishedAt: string; updatedAt?: string;
  heroImage?: { src: string; alt: string; width?: number; height?: number };
  articleImage?: { src: string; alt: string; width?: number; height?: number };
  sections: BlogSection[]; relatedLinks?: RelatedLink[]; header?: any;
};

const BLOG_DIR = path.resolve(process.cwd(), '../mapping-check/export');

// Hero image src/width/height per post (the DB's body.hero_image row only ever
// carries the translated `alt` — see the mapping_audit_blog_all.db note on that
// field: "src/width/height come from the lib/blog-data.ts shell, NOT this
// content field"). Images aren't translated, so this map is locale-independent;
// alt text still comes from the DB per locale.
const BLOG_HERO_IMAGES: Record<string, { src: string; width: number; height: number }> = {
  'benefits-of-dot-to-dot-puzzles-for-kids': { src: '/images/girl-solving-dot-to-dot-dinosaur-printable.webp', width: 1672, height: 941 },
  'screen-free-dot-to-dot-puzzles-for-kids-at-home': { src: '/images/kids-dot-to-dot-worksheets-screen-free-family-time.webp', width: 1672, height: 941 },
  'how-dot-to-dot-puzzles-help-children-learn': { src: '/images/dot-to-dot-learning-progress.webp', width: 1672, height: 941 },
  'choose-the-right-dot-to-dot-for-your-child': { src: '/images/choose-dot-to-dot-difficulty.webp', width: 1672, height: 941 },
  'dot-to-dot-activities-for-the-classroom': { src: '/images/teacher-dot-to-dot-activity.webp', width: 1672, height: 941 },
  'dot-to-dot-puzzles-for-color-blind-kids-and-adults': { src: '/images/color-blind-dot-to-dot-hero.webp', width: 1401, height: 1123 },
  'quiet-hour-dot-to-dot-summer-routine': { src: '/images/family-dot-to-dot-activity-at-the-table-hero.webp', width: 1600, height: 900 },
  'best-free-dot-to-dot-printables-by-age': { src: '/images/dot-to-dot-by-age.webp', width: 1672, height: 941 }
};

function loadBlog(locale: string): BlogPost[] {
  const localizedFile = path.join(BLOG_DIR, locale, 'blog.json');
  const fallbackFile = path.join(BLOG_DIR, 'en', 'blog.json');
  const blogFile = fs.existsSync(localizedFile) ? localizedFile : fallbackFile;
  const documents = JSON.parse(fs.readFileSync(blogFile, 'utf8')) as any[];
  return documents.map((document) => {
    const body = document.body ?? {};
    const hero = body.hero_image;
    const heroAlt = hero && typeof hero === 'object' ? hero.alt : typeof hero === 'string' ? undefined : undefined;
    const heroAsset = BLOG_HERO_IMAGES[document.slug];
    return {
      slug: document.slug,
      title: body.h1 ?? document.header?.title ?? document.slug,
      description: body.description ?? document.header?.meta_description ?? '',
      category: body.category ?? '',
      readTime: body.read_time ?? '',
      author: body.author ?? '',
      authorBio: body.author_bio,
      publishedAt: document.header?.json_ld?.date_published ?? '',
      updatedAt: document.header?.json_ld?.date_modified,
      heroImage: heroAsset ? { ...heroAsset, alt: heroAlt ?? body.h1 ?? '' } : undefined,
      sections: Array.isArray(body.sections) ? body.sections : [],
      relatedLinks: Array.isArray(body.related_links) ? body.related_links : [],
      header: document.header
    };
  });
}

export function getAllBlogPostsForLocale(locale: string) { return loadBlog(locale); }
export function getBlogPostForLocale(slug: string, locale: string) { return getAllBlogPostsForLocale(locale).find((post) => post.slug === slug); }
export function calcReadTime(post: BlogPost) { return post.readTime; }
export function formatBlogDate(date: string, locale = 'en') { return date ? new Intl.DateTimeFormat(locale, { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`)) : ''; }
