import type { DotGuide } from './dinosaurs-data';
import { loadConvertedPuzzleContent } from './converted-content';
import { mergeLocalizedPuzzles } from './puzzle-i18n';
import { isSectionAvailable, ARABIC_REGIONAL_ALIASES } from './section-locales';
export type { DotGuide };

export type FlowerPuzzleShell = {
  slug: string;
  emoji: string;
  age: string;
  dots: number;
  difficulty: 1 | 2 | 3;
  image: string;
  pdf: string;
  isNew?: boolean;
};

export type FlowerPuzzleContent = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  /**
   * Hand-written, unique per-puzzle SEO title (varied structure/tail across puzzles,
   * not one fixed template with just the name swapped in). Optional — falls back to
   * the templated localizedPuzzleTitle() when absent.
   */
  seoTitle?: string;
  seoH1?: string;
  /**
   * Hand-written, keyword-rich meta title/description copy for this specific puzzle
   * (used for <meta name="description"> and og:description). Optional and only
   * present for locales where unique per-puzzle SEO copy has been written — falls
   * back to the templated localizedPuzzleDescription() when absent. Deliberately
   * NOT template-generated: writing one shared sentence structure for every puzzle
   * in a locale reads as thin/duplicate content to search engines, so each entry
   * here should be worded differently, not just have {name}/{dots}/{age} swapped in.
   */
  seoDescription?: string;
  /**
   * Hand-written alt text describing what's actually pictured (not just "{name} +
   * fixed phrase"). Optional — falls back to localizedPuzzlePreviewAlt/
   * localizedPuzzleCardAlt via puzzleImageAlt() when absent.
   */
  seoImageAlt?: string;
  /**
   * If this puzzle ever gets a second/third/etc. image (extra color-scheme preview,
   * gallery shot), add seoImageAlt2, seoImageAlt3, ... here — each its own unique,
   * keyword-rich sentence describing that specific image, never the same text reused
   * with a number tacked on. Looked up automatically by puzzleImageAlt(locale, puzzle,
   * context, imageIndex) in lib/localized-seo.ts.
   */
  [seoImageAltN: `seoImageAlt${number}`]: string | undefined;
  funFact: string;
  dotGuide?: DotGuide;
};

type FlowerPuzzleTranslation = Pick<FlowerPuzzleContent, 'slug'> &
  Partial<Omit<FlowerPuzzleContent, 'slug'>>;

export type FlowerPuzzle = FlowerPuzzleShell & Omit<FlowerPuzzleContent, 'slug'>;

// Whether `locale` gets a Flowers section at all — derived from
// content/{locale}/puzzles-flowers.json, not a hand-maintained list (see
// lib/section-locales.ts). Every locale that fails this gets no Flowers
// section rather than a silent English-fallback page.
export function isFlowersAvailable(locale: string): boolean {
  return isSectionAvailable(locale, 'flowers/');
}

export type FlowerPageCopy = {
  eyebrow: (count: number) => string;
  h1: string;
  description: string;
  breadcrumb: string;
  category: string;
  slugEyebrow: string;
  slugH1Suffix: string;
  backToList: string;
  relatedEyebrow: string;
  whyH2: string;
  whyP: string;
  backToCategories: string;
  guideH2Suffix: string;
  colorH2: string;
};

const flowerPageCopy: Record<'en' | 'es' | 'ar' | 'de' | 'fi' | 'it' | 'ja' | 'pt', FlowerPageCopy> = {
  en: {
    eyebrow: (count) => `${count} free printable worksheet${count === 1 ? '' : 's'}`,
    h1: 'Flower Dot-to-Dot Printables for Kids',
    description: 'Slow down with petals, patterns, and number paths. From snowdrops and lilies to orchids and roses, these free flower dot-to-dot printables combine calm pencil practice with a picture children can colour.',
    breadcrumb: 'Flowers',
    category: 'Flowers',
    slugEyebrow: 'Free Flower Printable',
    slugH1Suffix: 'Dot-to-Dot Printable',
    backToList: '← Back to all flower puzzles',
    relatedEyebrow: 'More free flower printables',
    whyH2: 'Why kids love flower dot-to-dot puzzles',
    whyP: 'Flower connect-the-dots worksheets combine calming nature themes with practice in number sequencing, fine motor skills, and pencil control.',
    backToCategories: '← Back to all categories',
    guideH2Suffix: 'Dot-to-Dot Puzzle Guide',
    colorH2: 'Coloring Guide: Realistic Color Ideas'
  },
  es: {
    eyebrow: (count) => `${count} ficha${count === 1 ? '' : 's'} imprimible${count === 1 ? '' : 's'} gratis`,
    h1: 'Flores para unir puntos e imprimir',
    description: '¡Deja florecer la creatividad! Une los puntos para descubrir rosas y flores preciosas. Todas las fichas se pueden descargar e imprimir gratis, sin crear una cuenta.',
    breadcrumb: 'Flores',
    category: 'Flores',
    slugEyebrow: 'Flor imprimible gratis',
    slugH1Suffix: 'para unir puntos',
    backToList: '← Volver a todos los dibujos de flores',
    relatedEyebrow: 'Más flores imprimibles gratis',
    whyH2: 'Por qué a los niños les encantan los dibujos de flores para unir puntos',
    whyP: 'Las fichas de flores para unir puntos combinan temas relajantes de la naturaleza con la práctica de la secuencia numérica, la motricidad fina y el control del lápiz.',
    backToCategories: '← Volver a todas las categorías',
    guideH2Suffix: 'Guía del dibujo para unir puntos',
    colorH2: 'Guía para colorear: ideas de colores realistas'
  },
  de: {
    eyebrow: (count) => count === 1 ? '1 kostenloses Arbeitsblatt zum Ausdrucken' : `${count} kostenlose Arbeitsblätter zum Ausdrucken`,
    h1: 'Blumen-Punkt-zu-Punkt-Bilder für Kinder',
    description: 'Lass die Kreativität erblühen! Verbinde die Punkte und entdecke Rosen und andere schöne Blumen. Jedes Arbeitsblatt kann kostenlos und ohne Anmeldung heruntergeladen und ausgedruckt werden.',
    breadcrumb: 'Blumen',
    category: 'Blumen',
    slugEyebrow: 'Kostenloses Blumen-Arbeitsblatt',
    slugH1Suffix: 'Punkt-zu-Punkt-Bild',
    backToList: '← Zurück zu allen Blumenrätseln',
    relatedEyebrow: 'Weitere kostenlose Blumenbilder',
    whyH2: 'Warum Kinder Blumen-Punkt-zu-Punkt-Bilder lieben',
    whyP: 'Blumenrätsel verbinden ruhige Naturmotive mit Übungen zu Zahlenfolgen, Feinmotorik und Stiftführung.',
    backToCategories: '← Zurück zu allen Kategorien',
    guideH2Suffix: 'Punkt-zu-Punkt-Anleitung',
    colorH2: 'Ausmal-Anleitung: realistische Farbideen'
  },
  ar: {
    eyebrow: (count) => `${count} ورقة عمل مجانية قابلة للطباعة`,
    h1: 'أوراق توصيل نقاط الزهور للأطفال',
    description: 'دع الإبداع يتفتح! صِل النقاط لتظهر الورود والأزهار الجميلة. جميع الأوراق مجانية للتنزيل والطباعة، ولا تحتاج إلى حساب.',
    breadcrumb: 'الزهور',
    category: 'الزهور',
    slugEyebrow: 'ورقة زهرة مجانية للطباعة',
    slugH1Suffix: 'ورقة توصيل نقاط',
    backToList: '← العودة إلى جميع ألغاز الزهور',
    relatedEyebrow: 'المزيد من أوراق الزهور المجانية',
    whyH2: 'لماذا يحب الأطفال ألغاز توصيل نقاط الزهور',
    whyP: 'تجمع أوراق توصيل نقاط الزهور بين جمال الطبيعة الهادئ والتدرب على تسلسل الأرقام والمهارات الحركية الدقيقة والتحكم بالقلم.',
    backToCategories: '← العودة إلى كل الفئات',
    guideH2Suffix: 'دليل لغز توصيل النقاط',
    colorH2: 'دليل التلوين: أفكار ألوان واقعية'
  },
  fi: {
    eyebrow: (count) => count === 1 ? '1 ilmainen tulostettava tehtävämoniste' : `${count} ilmaista tulostettavaa tehtävämonistetta`,
    h1: 'Kukkien pisteestä pisteeseen -tulostettavat lapsille',
    description: 'Anna luovuuden kukkia! Yhdistä pisteet ja paljasta ruusuja ja kauniita kukkia. Jokainen tehtävämoniste on ilmainen ladata ja tulostaa – ei tiliä tarvita.',
    breadcrumb: 'Kukat',
    category: 'Kukat',
    slugEyebrow: 'Ilmainen kukka-tulostettava',
    slugH1Suffix: 'Pisteestä pisteeseen -tulostettava',
    backToList: '← Takaisin kaikkiin kukkapulmiin',
    relatedEyebrow: 'Lisää ilmaisia kukkatulostettavia',
    whyH2: 'Miksi lapset rakastavat kukkien pisteestä pisteeseen -pulmia',
    whyP: 'Kukkien yhdistä pisteet -tehtävät yhdistävät rauhoittavat luontoaiheet numerojärjestyksen harjoitteluun, hienomotoriikkaan ja kynänhallintaan.',
    backToCategories: '← Takaisin kaikkiin kategorioihin',
    guideH2Suffix: 'Pisteestä pisteeseen -pulman opas',
    colorH2: 'Väritysopas: realistisia väri-ideoita'
  },
  it: {
    eyebrow: (count) => count === 1 ? '1 scheda gratuita da stampare' : `${count} schede gratuite da stampare`,
    h1: 'Fiori da Unire i Puntini per Bambini',
    description: 'Fai sbocciare la creatività! Unisci i puntini per scoprire rose e splendidi fiori. Ogni scheda può essere scaricata e stampata gratuitamente, senza registrazione.',
    breadcrumb: 'Fiori',
    category: 'Fiori',
    slugEyebrow: 'Scheda floreale gratuita',
    slugH1Suffix: 'da Unire i Puntini',
    backToList: '← Torna a tutti i disegni di fiori',
    relatedEyebrow: 'Altri fiori gratuiti da stampare',
    whyH2: 'Perché i bambini amano i fiori da unire i puntini',
    whyP: 'Le schede floreali da unire i puntini abbinano temi naturali rilassanti all’esercizio della sequenza numerica, della motricità fine e del controllo della matita.',
    backToCategories: '← Torna a tutte le categorie',
    guideH2Suffix: 'Guida al Disegno da Unire i Puntini',
    colorH2: 'Guida alla Colorazione: Idee di Colori Realistici'
  },
  ja: {
    eyebrow: (count) => `無料印刷用ワークシート ${count}枚`,
    h1: '子ども向け花の点つなぎ印刷プリント',
    description: '創造力を花開かせよう！点を線でつないでバラや美しい花を完成させましょう。すべてのワークシートは無料でダウンロード・印刷でき、会員登録は不要です。',
    breadcrumb: '花',
    category: '花',
    slugEyebrow: '無料の花の印刷プリント',
    slugH1Suffix: '点つなぎ印刷プリント',
    backToList: '← 花のパズル一覧に戻る',
    relatedEyebrow: 'ほかの無料の花の印刷プリント',
    whyH2: '子どもが花の点つなぎパズルを好きな理由',
    whyP: '花のてんつなぎワークシートは、心が落ち着く自然のテーマと、数字の順序、微細運動能力、鉛筆のコントロールの練習を組み合わせています。',
    backToCategories: '← カテゴリー一覧に戻る',
    guideH2Suffix: '点つなぎパズルガイド',
    colorH2: '塗り絵ガイド：リアルな色のアイデア'
  },
  pt: {
    eyebrow: (count) => count === 1 ? '1 ficha gratuita para imprimir' : `${count} fichas gratuitas para imprimir`,
    h1: 'Desenhos de Flores para Ligar os Pontos',
    description: 'Deixa a criatividade florescer! Liga os pontos para revelar rosas e flores lindas. Todas as fichas são gratuitas para descarregar e imprimir — sem necessidade de conta.',
    breadcrumb: 'Flores',
    category: 'Flores',
    slugEyebrow: 'Ficha de Flor Gratuita',
    slugH1Suffix: 'para Ligar os Pontos',
    backToList: '← Voltar a todos os puzzles de flores',
    relatedEyebrow: 'Mais fichas de flores gratuitas',
    whyH2: 'Porque é que as crianças adoram os puzzles de ligar os pontos de flores',
    whyP: 'As fichas de flores para ligar os pontos combinam temas relaxantes da natureza com a prática da sequência numérica, da motricidade fina e do controlo do lápis.',
    backToCategories: '← Voltar a todas as categorias',
    guideH2Suffix: 'Guia do Puzzle de Ligar os Pontos',
    colorH2: 'Guia de Coloração: Ideias de Cores Realistas'
  }
};

export function getFlowerPageCopy(locale: string): FlowerPageCopy {
  const normalized = ARABIC_REGIONAL_ALIASES.includes(locale) ? 'ar' : locale;
  return flowerPageCopy[normalized as keyof typeof flowerPageCopy] ?? flowerPageCopy.en;
}

export const flowerPuzzleShells: FlowerPuzzleShell[] = [
  {
    slug: 'flax-flower-dot-to-dot-puzzle',
    emoji: '🌼',
    age: 'Ages 6–10',
    dots: 90,
    difficulty: 2,
    image: '/images/flower-flax-flower-puzzle.webp',
    pdf: '/flowers/flower-flax-flower-dot-to-dot-printable-horizontal.pdf',
    isNew: true
  },
  {
    slug: 'nasturtium-flower-dot-to-dot-puzzle',
    emoji: '🌺',
    age: 'Ages 6–10',
    dots: 96,
    difficulty: 2,
    image: '/images/flower-nasturtium-puzzle.webp',
    pdf: '/flowers/flower-nasturtium-dot-to-dot-printable-horizontal.pdf',
    isNew: true
  },
  {
    slug: 'snowdrop-flower-dot-to-dot-puzzle',
    emoji: '🌱',
    age: 'Ages 8–12',
    dots: 145,
    difficulty: 3,
    image: '/images/flower-snowdrop-puzzle.webp',
    pdf: '/flowers/flower-snowdrop-dot-to-dot-printable-horizontal.pdf',
    isNew: true
  },
  {
    slug: 'buttercup-flower-dot-to-dot-puzzle',
    emoji: '🌼',
    age: 'Ages 5–9',
    dots: 62,
    difficulty: 2,
    image: '/images/flower-buttercup-puzzle.webp',
    pdf: '/flowers/flower-buttercup-dot-to-dot-printable-horizontal.pdf',
    isNew: true
  },
  {
    slug: 'camellia-flower-dot-to-dot-puzzle',
    emoji: '🌺',
    age: 'Ages 4–8',
    dots: 45,
    difficulty: 1,
    image: '/images/flower-camellia-puzzle.webp',
    pdf: '/flowers/flower-camellia-dot-to-dot-printable-horizontal.pdf',
    isNew: true
  },
  {
    slug: 'forget-me-not-flower-dot-to-dot-puzzle',
    emoji: '🪻',
    age: 'Ages 6–10',
    dots: 107,
    difficulty: 2,
    image: '/images/flower-forget-me-not-puzzle.webp',
    pdf: '/flowers/flower-forget-me-not-dot-to-dot-printable.pdf',
    isNew: true
  },
  {
    slug: 'geranium-flower-dot-to-dot-puzzle',
    emoji: '🌺',
    age: 'Ages 6–10',
    dots: 92,
    difficulty: 2,
    image: '/images/flower-geranium-puzzle.webp',
    pdf: '/flowers/flower-geranium-dot-to-dot-printable.pdf',
    isNew: true
  },
  {
    slug: 'jasmine-flower-dot-to-dot-puzzle',
    emoji: '🌼',
    age: 'Ages 6–10',
    dots: 97,
    difficulty: 2,
    image: '/images/flower-jasmine-puzzle.webp',
    pdf: '/flowers/flower-jasmine-dot-to-dot-printable.pdf',
    isNew: true
  },
  {
    slug: 'periwinkle-flower-dot-to-dot-puzzle',
    emoji: '🌸',
    age: 'Ages 5–9',
    dots: 72,
    difficulty: 2,
    image: '/images/flower-periwinkle-puzzle.webp',
    pdf: '/flowers/flower-periwinkle-dot-to-dot-printable.pdf',
    isNew: true
  },
  {
    slug: 'petunia-flower-dot-to-dot-puzzle',
    emoji: '🌺',
    age: 'Ages 4–8',
    dots: 53,
    difficulty: 1,
    image: '/images/flower-petunia-puzzle.webp',
    pdf: '/flowers/flower-petunia-dot-to-dot-printable.pdf',
    isNew: true
  },
  {
    slug: 'plumeria-flower-dot-to-dot-puzzle',
    emoji: '🌸',
    age: 'Ages 6–10',
    dots: 95,
    difficulty: 2,
    image: '/images/flower-plumeria-puzzle.webp',
    pdf: '/flowers/flower-plumeria-dot-to-dot-printable.pdf',
    isNew: true
  },
  {
    slug: 'carnation-flower-dot-to-dot-puzzle',
    emoji: '🌸',
    age: 'Ages 4–8',
    dots: 53,
    difficulty: 1,
    image: '/images/flower-carnation-puzzle.webp',
    pdf: '/flowers/flower-carnation-dot-to-dot-printable.pdf',
    isNew: true
  },
  {
    slug: 'six-petal-lily-dot-to-dot-puzzle',
    emoji: '🌼',
    age: 'Ages 5–9',
    dots: 62,
    difficulty: 2,
    image: '/images/flower-six-petal-lily-puzzle.webp',
    pdf: '/flowers/flower-six-petal-lily-dot-to-dot-printable.pdf',
    isNew: true
  },
  {
    slug: 'peony-flower-dot-to-dot-puzzle',
    emoji: '🌺',
    age: 'Ages 4–8',
    dots: 46,
    difficulty: 1,
    image: '/images/flower-peony-puzzle.webp',
    pdf: '/flowers/flower-peony-dot-to-dot-printable.pdf',
    isNew: true
  },
  {
    slug: 'orchid-flower-dot-to-dot-puzzle',
    emoji: '🌸',
    age: 'Ages 6–10',
    dots: 76,
    difficulty: 2,
    image: '/images/flower-orchid-puzzle.webp',
    pdf: '/flowers/flower-orchid-dot-to-dot-printable.pdf',
    isNew: true
  },
  {
    slug: 'lotus-flower-dot-to-dot-puzzle',
    emoji: '🪷',
    age: 'Ages 4–8',
    dots: 46,
    difficulty: 1,
    image: '/images/flower-lotus-puzzle.webp',
    pdf: '/flowers/flower-lotus-dot-to-dot-printable.pdf',
    isNew: true
  },
  {
    slug: 'kawaii-sunflower-dot-to-dot-puzzle',
    emoji: '🌻',
    age: 'Ages 4–8',
    dots: 58,
    difficulty: 1,
    image: '/images/flower-kawaii-sunflower-puzzle.webp',
    pdf: '/flowers/flower-kawaii-sunflower-dot-to-dot-printable-horizontal.pdf',
    isNew: true
  },
  {
    slug: 'poppy-flower-dot-to-dot-puzzle',
    emoji: '🌺',
    age: 'Ages 6–10',
    dots: 106,
    difficulty: 2,
    image: '/images/flower-poppy-puzzle.webp',
    pdf: '/flowers/flower-poppy-dot-to-dot-printable-horizontal.pdf',
    isNew: true
  },
  {
    slug: 'tulip-flower-dot-to-dot-puzzle',
    emoji: '🌷',
    age: 'Ages 5–9',
    dots: 88,
    difficulty: 2,
    image: '/images/flower-tulip-puzzle.webp',
    pdf: '/flowers/flower-tulip-dot-to-dot-printable-horizontal.pdf',
    isNew: true
  },
  {
    slug: 'rose-flower-dot-to-dot-puzzle',
    emoji: '🌹',
    age: 'Ages 5–9',
    dots: 66,
    difficulty: 2,
    image: '/images/flower-rose-puzzle.webp',
    pdf: '/flowers/flower-rose-dot-to-dot-printable-horizontal.pdf',
    isNew: true
  }
];

function loadFlowerContent(locale: string): FlowerPuzzleContent[] {
  const en = loadConvertedPuzzleContent('flowers') as FlowerPuzzleContent[];
  if (locale === 'en') return en;
  if (!isFlowersAvailable(locale)) return [];
  const contentLocale = ARABIC_REGIONAL_ALIASES.includes(locale) ? 'ar' : locale;

  const localeContent = require(`../content/${contentLocale}/puzzles-flowers.json`) as FlowerPuzzleTranslation[];
  return mergeLocalizedPuzzles(en, localeContent);
}

export function getFlowerPuzzlesForLocale(locale: string): FlowerPuzzle[] {
  const contentBySlug = new Map(loadFlowerContent(locale).map((item) => [item.slug, item]));
  return flowerPuzzleShells
    .map((shell): FlowerPuzzle | undefined => {
      const content = contentBySlug.get(shell.slug);
      return content ? { ...shell, ...content } : undefined;
    })
    .filter((puzzle): puzzle is FlowerPuzzle => Boolean(puzzle));
}

export function getFlowerPuzzleBySlug(slug: string, locale: string): FlowerPuzzle | undefined {
  return getFlowerPuzzlesForLocale(locale).find((puzzle) => puzzle.slug === slug);
}
