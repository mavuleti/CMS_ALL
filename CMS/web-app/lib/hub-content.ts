// Age/skill hub pages cut across the theme-based category taxonomy (Dinosaurs,
// Ocean, ...) to answer "dot to dot for a 5 year old" / "easy dot to dot
// printables" style searches directly. English-only for now — see
// TODO-seo.md — so this copy is hardcoded rather than routed through the
// content/<locale> translation pipeline; add real per-locale entries there
// (and only then add locales to generateStaticParams) once translated.

export type AgeHub = { range: string; min: number; max: number; h1: string; intro: string; seoTitle: string; seoDescription: string };
export type DifficultyHub = { tier: 'easy' | 'medium' | 'hard'; slug: string; min: number; max: number; h1: string; intro: string; seoTitle: string; seoDescription: string };

export const AGE_HUBS: AgeHub[] = [
  {
    range: '4-6',
    min: 4,
    max: 6,
    h1: 'Dot to Dot Printables for Ages 4-6',
    intro: 'Preschool and kindergarten dot-to-dot puzzles use bigger dots and shorter counting sequences, so early learners can finish a picture without getting lost partway through. Every puzzle here keeps the dot count low enough for a 4, 5, or 6 year old to complete independently while still practicing number recognition and pencil control.',
    seoTitle: 'Dot to Dot Printables for Ages 4-6 | Free Preschool & Kindergarten Puzzles',
    seoDescription: 'Free printable dot-to-dot puzzles sized for ages 4-6, with low dot counts perfect for preschool and kindergarten number practice.'
  },
  {
    range: '7-9',
    min: 7,
    max: 9,
    h1: 'Dot to Dot Printables for Ages 7-9',
    intro: 'Early elementary kids are ready for longer counting sequences and more detailed pictures. These dot-to-dot puzzles step up the dot count from the preschool set, giving 7 to 9 year olds a bit more of a challenge while still finishing in one sitting.',
    seoTitle: 'Dot to Dot Printables for Ages 7-9 | Free Elementary Puzzles',
    seoDescription: 'Free printable dot-to-dot puzzles for ages 7-9, with medium dot counts that build counting skills and focus for early elementary kids.'
  },
  {
    range: '9-12',
    min: 9,
    max: 12,
    h1: 'Dot to Dot Printables for Ages 9-12',
    intro: 'Older kids get more out of a dot-to-dot when the picture takes real concentration to reveal. This set skews toward higher dot counts and more intricate finished pictures, giving 9 to 12 year olds a puzzle that still feels like an accomplishment.',
    seoTitle: 'Dot to Dot Printables for Ages 9-12 | Free Puzzles for Older Kids',
    seoDescription: 'Free printable dot-to-dot puzzles for ages 9-12, with higher dot counts and detailed pictures for older kids who want more of a challenge.'
  }
];

export const DIFFICULTY_HUBS: DifficultyHub[] = [
  {
    tier: 'easy',
    slug: 'easy-1-20-dots',
    min: 1,
    max: 20,
    h1: 'Easy Dot to Dot Printables (1-20 Dots)',
    intro: 'These are the simplest puzzles on the site: 20 dots or fewer, with a picture that reveals itself in just a few connections. They\'re the right starting point for a first-time dot-to-dot puzzler, or for any child who wants a quick win before moving on to something harder.',
    seoTitle: 'Easy Dot to Dot Printables (1-20 Dots) | Free Simple Puzzles',
    seoDescription: 'Free easy dot-to-dot printables with 1-20 dots, perfect for beginners and young kids who want a quick, simple puzzle to complete.'
  },
  {
    tier: 'medium',
    slug: 'medium-21-60-dots',
    min: 21,
    max: 60,
    h1: 'Medium Dot to Dot Printables (21-60 Dots)',
    intro: 'This is the sweet spot for most kids: enough dots to make counting to the finish feel like real progress, without the picture taking forever to reveal itself. If a puzzle from the easy set felt too quick, this is the next step up.',
    seoTitle: 'Medium Dot to Dot Printables (21-60 Dots) | Free Puzzles',
    seoDescription: 'Free medium-difficulty dot-to-dot printables with 21-60 dots, striking a balance between quick and challenging for most kids.'
  },
  {
    tier: 'hard',
    slug: 'hard-61-plus-dots',
    min: 61,
    max: Infinity,
    h1: 'Hard Dot to Dot Printables (61+ Dots)',
    intro: 'These puzzles pack in 61 dots or more, so the picture stays hidden until well into the count. They\'re built for kids who\'ve outgrown the easier sets and want a dot-to-dot that takes real patience and focus to finish.',
    seoTitle: 'Hard Dot to Dot Printables (61+ Dots) | Free Challenging Puzzles',
    seoDescription: 'Free hard dot-to-dot printables with 61 or more dots, for kids who want a longer, more challenging puzzle to complete.'
  }
];
