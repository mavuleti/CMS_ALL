export type BlogSection = {
  heading: string;
  paragraphs: string[];
  tips?: string[];
};

export type RelatedLink = {
  title: string;
  href: string;
  description: string;
};

export type BlogPostShell = {
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  heroImage?: { src: string; width?: number; height?: number };
  articleImage?: { src: string; alt: string; width?: number; height?: number };
};

export type BlogPostContent = {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  author: string;
  authorBio?: string;
  heroImage?: { alt: string };
  sections: BlogSection[];
  relatedLinks?: RelatedLink[];
};

export type BlogPost = BlogPostShell & Omit<BlogPostContent, 'slug'>;

export const blogPostShells: BlogPostShell[] = [
  { slug: 'best-free-dot-to-dot-printables-by-age', publishedAt: '2026-07-19' },
  { slug: 'dot-to-dot-vs-mazes-vs-tracing-worksheets', publishedAt: '2026-07-19' },
  { slug: 'dot-to-dot-puzzle-facts-and-statistics', publishedAt: '2026-07-19' },
  { slug: 'dot-to-dot-glossary', publishedAt: '2026-07-19' },
  { slug: 'benefits-of-dot-to-dot-puzzles-for-kids', publishedAt: '2026-06-09', heroImage: { src: '/images/girl-solving-dot-to-dot-dinosaur-printable.webp' }, articleImage: { src: '/images/dot-to-dot-fine-motor-skills.webp', alt: 'Child practicing fine motor skills with a dot-to-dot puzzle' } },
  { slug: 'screen-free-dot-to-dot-puzzles-for-kids-at-home', publishedAt: '2026-06-09', heroImage: { src: '/images/kids-dot-to-dot-worksheets-screen-free-family-time.webp' }, articleImage: { src: '/images/kids-dot-to-dot-activity-worksheets-colored-pencils.webp', alt: 'Kids completing dot-to-dot activity worksheets with colored pencils' } },
  { slug: 'how-dot-to-dot-puzzles-help-children-learn', publishedAt: '2026-06-08', heroImage: { src: '/images/dot-to-dot-learning-progress.webp' }, articleImage: { src: '/images/before-after-dot-to-dot-coloring.webp', alt: 'Before and after completing and coloring a dot-to-dot puzzle' } },
  { slug: 'choose-the-right-dot-to-dot-for-your-child', publishedAt: '2026-06-08', updatedAt: '2026-07-11', heroImage: { src: '/images/choose-dot-to-dot-difficulty.webp' }, articleImage: { src: '/images/dot-to-dot-by-age.webp', alt: 'Dot-to-dot puzzle recommendations organized by age' } },
  { slug: 'dot-to-dot-activities-for-the-classroom', publishedAt: '2026-06-08', heroImage: { src: '/images/teacher-dot-to-dot-activity.webp' }, articleImage: { src: '/images/dot-to-dot-classroom-display.webp', alt: 'Dot-to-dot classroom display showing student activities' } },
  {
    slug: 'dot-to-dot-puzzles-for-color-blind-kids-and-adults',
    publishedAt: '2026-06-26',
    heroImage: { src: '/images/color-blind-dot-to-dot-hero.webp' }
  },
  {
    slug: 'quiet-hour-dot-to-dot-summer-routine',
    publishedAt: '2026-07-04',
    heroImage: { src: '/images/family-dot-to-dot-activity-at-the-table-hero.webp', width: 1600, height: 900 }
  },
  {
    slug: 'family-dot-to-dot-activity-at-the-table',
    publishedAt: '2026-07-05',
    heroImage: { src: '/images/family-dot-to-dot-activity-at-the-table-hero.webp', width: 1600, height: 900 }
  }
];

function loadBlogContent(locale: string): BlogPostContent[] {
  const en = require('../content/en/blog.json') as BlogPostContent[];
  if (locale === 'en') return en;

  const contentLocale = ['ar-AE', 'ar-SA', 'ar-QA'].includes(locale) ? 'ar' : locale;
  const localeContent = require(`../content/${contentLocale}/blog.json`) as BlogPostContent[];
  const bySlug = new Map(localeContent.map((post) => [post.slug, post]));
  return en.map((base) => ({ ...base, ...(bySlug.get(base.slug) ?? {}) }));
}

export function getAllBlogPostsForLocale(locale: string): BlogPost[] {
  const content = loadBlogContent(locale);
  const contentBySlug = new Map(content.map((c) => [c.slug, c]));

  return blogPostShells
    .map((shell): BlogPost | undefined => {
      const c = contentBySlug.get(shell.slug);
      if (!c) return undefined;
      return {
        ...shell,
        title: c.title,
        description: c.description,
        category: c.category,
        readTime: c.readTime,
        author: c.author,
        authorBio: c.authorBio,
        heroImage: shell.heroImage ? { ...shell.heroImage, alt: c.heroImage?.alt ?? '' } : undefined,
        articleImage: shell.articleImage,
        sections: c.sections,
        relatedLinks: c.relatedLinks
      };
    })
    .filter((post): post is BlogPost => Boolean(post));
}

export function getBlogPostForLocale(slug: string, locale: string): BlogPost | undefined {
  return getAllBlogPostsForLocale(locale).find((post) => post.slug === slug);
}

export function calcReadTime(post: BlogPost): string {
  const text = post.sections
    .flatMap((s) => [...s.paragraphs, ...(s.tips ?? [])])
    .join(' ')
    .replace(/<[^>]+>/g, '');
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

const localeToDateLocale: Record<string, string> = {
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
  ar: 'ar-SA'
};

export function formatBlogDate(date: string, locale = 'en') {
  return new Intl.DateTimeFormat(localeToDateLocale[locale] ?? 'en-US', {
    numberingSystem: 'latn',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(`${date}T00:00:00Z`));
}
