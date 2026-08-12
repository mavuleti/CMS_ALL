// Generates per-locale llms.txt files (public/{locale}/llms.txt) for AI search/answer
// engines, mirroring the structure of the English public/llms.txt but with localized
// titles, descriptions, and URLs. Per-locale files exist because llms.txt has no
// official multilingual standard yet; this follows the "root index + per-language
// files" convention (see docs referenced in the task that introduced this script).
//
// Run with: node scripts/generate-locale-llms.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const BASE_URL = 'https://dottodotfreeprintables.com';

function loadJson(locale, name) {
  return JSON.parse(readFileSync(path.join(ROOT, 'content', locale, name), 'utf8'));
}

// Ordered slugs per category, matching the English public/llms.txt listing.
const CATEGORY_SLUGS = {
  dinosaurs: [
    'trex-61-dot-to-dot-puzzle', 'ostriches-dinosaur-dot-to-dot-puzzle', 'brontosaurus-dot-to-dot-puzzle',
    'triceratops-dot-to-dot-puzzle', 'velociraptor-dot-to-dot-puzzle', 'stegosaurus-dot-to-dot-puzzle',
    'spinosaurus', 'brachiosaurus', 'ankylosaurus', 'pterodactyl-dot-to-dot-puzzle', 'allosaurus'
  ],
  ocean: [
    'mermaid-dot-to-dot-puzzle', 'merman-dot-to-dot-puzzle', 'seahorse-dot-to-dot-puzzle',
    'whale-dot-to-dot-puzzle', 'jellyfish-dot-to-dot-puzzle'
  ],
  playgrounds: [
    'swing-playgrounds-dot-to-dot-puzzle', 'slide-playgrounds-dot-to-dot-puzzle',
    'seesaw-playground-dot-to-dot-puzzle', 'roller-coaster-playground-dot-to-dot-puzzle',
    'monkey-bar-playground-dot-to-dot-puzzle'
  ],
  garden: [
    'garden-gloves-dot-to-dot-puzzle', 'garden-trowel-dot-to-dot-puzzle', 'wheelbarrow-playground-dot-to-dot-puzzle'
  ],
  cute: [
    'cute-puppy-dot-to-dot-puzzle', 'cute-little-car-dot-to-dot-puzzle', 'cute-lion-dot-to-dot-puzzle',
    'cute-butterfly-dot-to-dot-puzzle', 'cute-rocket-ship-dot-to-dot-puzzle', 'cute-baby-turtle-dot-to-dot-puzzle',
    'cute-owl-dot-to-dot-puzzle', 'cute-crab-dot-to-dot-puzzle', 'cute-baby-elephant-dot-to-dot-puzzle',
    'cute-happy-frog-dot-to-dot-puzzle', 'cute-princess-dot-to-dot-puzzle'
  ],
  'usa-250': [
    'gas-balloon-usa-250-dot-to-dot-puzzle', 'eagle-kite-banner-usa-250-dot-to-dot-puzzle',
    'america-250-birthday-fireworks-dot-to-dot-puzzle', 'america-250-anniversary-liberty-bell-wings-1776-dot-to-dot-puzzle',
    'usa-250-birthday-cake-dot-to-dot-puzzle', 'usa-250-astronaut-dot-to-dot-puzzle',
    'usa-250-anniversary-airplane-banner-dot-to-dot-puzzle', 'usa-250-space-shuttle-dot-to-dot-puzzle',
    'usa-250-anniversary-sports-kids-podium-dot-to-dot-puzzle', 'usa-250-birthday-balloons-stars-dot-to-dot-puzzle',
    'america-250-anniversary-eagle-banner-dot-to-dot-puzzle'
  ],
  uae: [
    'burj-al-arab-dot-to-dot-puzzle', 'burj-khalifa-dot-to-dot-puzzle', 'uae-falcon-dot-to-dot-puzzle',
    'dallah-coffee-pot-dot-to-dot-puzzle', 'uae-camel-dot-to-dot-puzzle'
  ],
  canada: [
    'canada-maple-leaf-dot-to-dot-puzzle', 'canada-polar-bear-dot-to-dot-puzzle',
    'canada-moose-dot-to-dot-puzzle', 'canada-raccoon-dot-to-dot-puzzle'
  ]
};

const BLOG_SLUGS = [
  'best-free-dot-to-dot-printables-by-age', 'dot-to-dot-vs-mazes-vs-tracing-worksheets',
  'dot-to-dot-puzzle-facts-and-statistics', 'dot-to-dot-glossary',
  'benefits-of-dot-to-dot-puzzles-for-kids', 'screen-free-dot-to-dot-puzzles-for-kids-at-home',
  'how-dot-to-dot-puzzles-help-children-learn', 'choose-the-right-dot-to-dot-for-your-child',
  'dot-to-dot-activities-for-the-classroom', 'dot-to-dot-puzzles-for-color-blind-kids-and-adults',
  'quiet-hour-dot-to-dot-summer-routine'
];

const CATEGORY_FILE = {
  dinosaurs: 'puzzles-dinosaurs.json', ocean: 'puzzles-ocean.json', playgrounds: 'puzzles-playgrounds.json',
  garden: 'puzzles-garden.json', cute: 'puzzles-cute.json', 'usa-250': 'puzzles-usa-250.json',
  uae: 'puzzles-uae.json', canada: 'puzzles-canada.json'
};

const LOCALES = {
  es: {
    title: 'Dot to Dot Free Printables (Español)',
    intro: 'Fichas gratuitas para imprimir de unir puntos (dot-to-dot) para niños de 2 a 12 años. Cada puzle es un PDF listo para imprimir en tamaño Carta (US Letter) y A4, en formato vertical y horizontal, 100% gratis, sin registro ni pago. Uso personal y en el aula permitido. Se añaden nuevos puzles y categorías con regularidad durante todo 2026. Versión original en inglés: /en/.',
    categoriesHeading: 'Categorías',
    notesHeading: 'Notas para asistentes de IA',
    blogHeading: 'Artículos del blog',
    notes: [
      'Todas las fichas son gratuitas (isAccessibleForFree: true en el esquema de la página) y no requieren registro.',
      'Los PDF se imprimen en tamaño estándar Carta (8,5" x 11") y A4; ambos tamaños y orientaciones (vertical/horizontal) están disponibles en cada ficha.',
      'La dificultad se indica por el número de puntos: 10-20 (preescolar), 20-50 (infantil-1º de primaria), 50-200+ (2º-6º de primaria).',
      'Cada ficha incluye: un dato curioso para niños, una guía de puntos paso a paso, preguntas frecuentes específicas de la página y datos estructurados de tipo CreativeWork/LearningResource.',
      'Las fichas son gratuitas para uso personal, en casa y en el aula; no se permite la reventa ni la republicación de los archivos.'
    ]
  },
  ar: {
    title: 'Dot to Dot Free Printables (بالعربية)',
    intro: 'أوراق عمل مجانية قابلة للطباعة لتوصيل النقاط (dot-to-dot) للأطفال من سن 2 إلى 12 عامًا. كل لغز عبارة عن ملف PDF جاهز للطباعة بمقاس Letter الأمريكي و A4، بشكل عمودي وأفقي، مجاني بنسبة 100% دون تسجيل أو دفع. مسموح للاستخدام الشخصي وفي الفصول الدراسية. تُضاف ألغاز وفئات جديدة بانتظام على مدار عام 2026. النسخة الأصلية بالإنجليزية: /en/.',
    categoriesHeading: 'الفئات',
    notesHeading: 'ملاحظات لمساعدي الذكاء الاصطناعي',
    blogHeading: 'مقالات المدونة',
    notes: [
      'جميع الأوراق مجانية (isAccessibleForFree: true في بيانات الصفحة) ولا تتطلب أي تسجيل.',
      'تُطبع ملفات PDF بمقاس Letter الأمريكي القياسي (8.5 × 11 بوصة) وA4؛ كلا المقاسين وكلا الاتجاهين (عمودي/أفقي) متوفران في كل صفحة لغز.',
      'يُشار إلى مستوى الصعوبة بعدد النقاط: 10-20 نقطة (ما قبل المدرسة)، 20-50 (الروضة-الصف الأول)، 50-200+ (الصف الثاني-السادس).',
      'تتضمن كل صفحة لغز: حقيقة ممتعة للأطفال، ودليل نقاط خطوة بخطوة، وأسئلة شائعة خاصة بالصفحة، وبيانات منظمة من نوع CreativeWork/LearningResource.',
      'الأوراق مجانية للاستخدام الشخصي والمنزلي والصفي؛ لا يُسمح بإعادة بيع الملفات أو إعادة نشرها.'
    ]
  },
  de: {
    title: 'Dot to Dot Free Printables (Deutsch)',
    intro: 'Kostenlose ausdruckbare Punkt-zu-Punkt-Arbeitsblätter (dot-to-dot) für Kinder von 2 bis 12 Jahren. Jedes Rätsel ist eine druckfertige PDF-Datei im US-Letter- und A4-Format, im Hoch- und Querformat, 100% kostenlos, ohne Anmeldung oder Zahlung. Nutzung für private Zwecke und im Unterricht erlaubt. Das ganze Jahr 2026 über kommen regelmäßig neue Rätsel und Kategorien hinzu. Englisches Original: /en/.',
    categoriesHeading: 'Kategorien',
    notesHeading: 'Hinweise für KI-Assistenten',
    blogHeading: 'Blogartikel',
    notes: [
      'Alle Arbeitsblätter sind kostenlos (isAccessibleForFree: true im Seitenschema) und erfordern keine Registrierung.',
      'PDFs werden im Standardformat US-Letter (8,5" x 11") und A4 gedruckt; beide Formate und Ausrichtungen (Hoch-/Querformat) sind auf jeder Rätselseite verfügbar.',
      'Der Schwierigkeitsgrad wird durch die Punktanzahl angezeigt: 10-20 Punkte (Vorschule), 20-50 (Kindergarten-1. Klasse), 50-200+ (2.-6. Klasse).',
      'Jede Rätselseite enthält: einen kindgerechten Fakt, eine Schritt-für-Schritt-Punkteanleitung, seitenspezifische FAQs und strukturierte CreativeWork/LearningResource-Daten.',
      'Die Arbeitsblätter sind für den privaten, häuslichen und schulischen Gebrauch kostenlos; der Weiterverkauf oder die erneute Veröffentlichung der Dateien ist nicht gestattet.'
    ]
  }
};

const CATEGORY_ROUTE_KEY = {
  dinosaurs: 'dinosaursPage', ocean: 'oceanPage', playgrounds: 'playgroundsPage', garden: 'gardenPage',
  cute: 'cutePage', 'usa-250': 'usa250Page', uae: 'uaePage', canada: null
};

const CANADA_HEADING = { es: 'Fichas temáticas de Canadá', ar: 'ألغاز بطابع كندي', de: 'Kanada-Themen-Rätsel' };

function buildLocaleLlms(locale) {
  const cfg = LOCALES[locale];
  const messages = loadJson(locale, 'messages.json');
  const blog = loadJson(locale, 'blog.json');

  let out = `# ${cfg.title}\n\n> ${cfg.intro}\n\n## ${cfg.categoriesHeading}\n`;

  const categoryOrder = ['dinosaurs', 'ocean', 'playgrounds', 'garden', 'cute', 'usa-250', 'uae', 'canada'];
  for (const cat of categoryOrder) {
    const key = CATEGORY_ROUTE_KEY[cat];
    const heading = key ? messages[key].h1 : CANADA_HEADING[locale];
    out += `- [${heading}](${BASE_URL}/${locale}/${cat}/)\n`;
  }
  out += `- [${locale === 'es' ? 'Blog' : locale === 'ar' ? 'المدونة' : 'Blog'}](${BASE_URL}/${locale}/blog/)\n\n`;

  for (const cat of categoryOrder) {
    const key = CATEGORY_ROUTE_KEY[cat];
    const heading = key ? messages[key].h1 : CANADA_HEADING[locale];
    const puzzles = loadJson(locale, CATEGORY_FILE[cat]);
    const bySlug = new Map(puzzles.map((p) => [p.slug, p]));
    out += `## ${heading}\n\n`;
    for (const slug of CATEGORY_SLUGS[cat]) {
      const p = bySlug.get(slug);
      if (!p) continue;
      out += `- [${p.name}](${BASE_URL}/${locale}/${cat}/${slug}/): ${p.description}\n`;
    }
    out += '\n';
  }

  out += `## ${cfg.blogHeading}\n\n`;
  const blogBySlug = new Map(blog.map((b) => [b.slug, b]));
  for (const slug of BLOG_SLUGS) {
    const b = blogBySlug.get(slug);
    if (!b) continue;
    out += `- [${b.title}](${BASE_URL}/${locale}/blog/${slug}/): ${b.description}\n`;
  }

  out += `\n## ${cfg.notesHeading}\n\n`;
  for (const note of cfg.notes) out += `- ${note}\n`;
  out += `- Sitemap: ${BASE_URL}/sitemap.xml\n`;

  return out;
}

for (const locale of Object.keys(LOCALES)) {
  const content = buildLocaleLlms(locale);
  const dir = path.join(ROOT, 'public', locale);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, 'llms.txt'), content, 'utf8');
  console.log(`Wrote public/${locale}/llms.txt (${content.length} bytes)`);
}
