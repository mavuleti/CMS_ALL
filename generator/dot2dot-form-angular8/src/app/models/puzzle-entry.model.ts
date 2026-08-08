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

export interface BodyData {
  h1: string;
  name: string;
  tagline: string;
  description: string;
  fun_fact: string;
  dot_guide: DotGuideData;
}

export interface PuzzleEntry {
  slug: string;
  header: HeaderData;
  body: BodyData;
}
