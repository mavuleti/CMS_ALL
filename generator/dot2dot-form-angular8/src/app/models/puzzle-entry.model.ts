// ---------------------------------------------------------------------------
// Data model for a single dot-to-dot puzzle page.
// Mirrors the generated JSON 1:1 — field names here === field names in JSON.
// ---------------------------------------------------------------------------

export interface OpenGraphData {
  title: string;
  description: string;
  image_alt: string;
}

export interface JsonLdData {
  type: string;              // e.g. "CreativeWork"
  name: string;
  description: string;
  image: string;              // URL
  educational_use: string;    // e.g. "Fine motor skills, number sequencing"
  age_range: string;          // e.g. "4-8"
}

export interface HeaderData {
  title: string;               // <title> tag / SEO title
  meta_description: string;    // <meta name="description">
  og: OpenGraphData;
  json_ld: JsonLdData;
}

export interface DotGuideSection {
  range: string;    // e.g. "1–15"
  title: string;
  learn: string;
  fact: string;
}

export interface ColorMapping {
  range: string;
  part: string;
  color: string;
  hex: string;
  why: string;
}

export interface ColorScheme {
  name: string;
  note: string;
  mapping: ColorMapping[];
}

export interface DotGuideData {
  intro: string;
  sections: DotGuideSection[];
  outro: string;
  color_schemes: ColorScheme[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface BodyData {
  h1: string;
  name: string;
  tagline: string;
  description: string;
  fun_fact: string;
  faqs: FaqItem[];
  dot_guide: DotGuideData;
}

export interface PuzzleEntry {
  slug: string;
  header: HeaderData;
  body: BodyData;
}

export interface CollectionData {
  header: {
    title: string;
    meta_description: string;
    og: { title: string; description: string; image: string };
    json_ld: {
      type: 'CollectionPage';
      name: string;
      description: string;
      image: string;
      main_entity: { type: 'ItemList'; item_source: 'puzzles' };
    };
    breadcrumb_json_ld: {
      type: 'BreadcrumbList';
      items: Array<{ position: number; name: string; path: string }>;
    };
  };
  body: {
    h1: string;
    name: string;
    tagline: string;
    description: string;
    hero_image: string;
    slug: string;
    faqs: FaqItem[];
  };
}

export interface CollectionDocument {
  collection: CollectionData;
  puzzles: PuzzleEntry[];
}
