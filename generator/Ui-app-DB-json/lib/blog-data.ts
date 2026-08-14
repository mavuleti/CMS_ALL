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

function loadBlog(locale: string): BlogPost[] {
  const localizedFile = path.join(BLOG_DIR, locale, 'blog.json');
  const fallbackFile = path.join(BLOG_DIR, 'en', 'blog.json');
  const blogFile = fs.existsSync(localizedFile) ? localizedFile : fallbackFile;
  const documents = JSON.parse(fs.readFileSync(blogFile, 'utf8')) as any[];
  return documents.map((document) => {
    const body = document.body ?? {};
    const hero = body.hero_image;
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
      heroImage: hero && typeof hero === 'object' && hero.src ? hero : typeof hero === 'string' && hero.trim() ? { src: hero, alt: body.h1 ?? '' } : undefined,
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
