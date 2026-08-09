#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(process.argv[2]);
const contentRoot = path.join(root, 'content');
const typescript = require(path.join(root, 'node_modules', 'typescript'));
const categories = ['canada', 'circus', 'cute', 'dinosaurs', 'flowers', 'garden', 'ocean', 'playgrounds', 'space', 'uae', 'usa-250'];
const pageKeys = {
  circus: 'circusPage', cute: 'cutePage', dinosaurs: 'dinosaursPage', garden: 'gardenPage',
  ocean: 'oceanPage', playgrounds: 'playgroundsPage', space: 'spacePage', uae: 'uaePage', 'usa-250': 'usa250Page'
};
const fallbackSeo = {
  canada: ['Canada Dot to Dot Printables for Kids — Free PDF', 'Free Canada-themed dot to dot printables for kids ages 5-10: canoe, maple leaf, polar bear, moose, and raccoon. Print-ready PDF worksheets popular with Canadian classrooms and homeschool families in the USA and UK too.', '5 Free Canada Dot to Dot Printables', 'Canoe, maple leaf, polar bear, moose, and raccoon — free dot to dot printables ready to print today.', '/images/canada-maple-leaf-puzzle.webp'],
  circus: ['Circus Dot to Dot Printables — Free PDF for Kids', 'Free circus dot to dot printables for kids ages 4-9: a ringmaster bear and striped big-top tent. Two print-ready PDF worksheets with no sign-up.', '2 Free Circus Dot to Dot Printables', 'A ringmaster bear and striped big-top tent — two free circus dot to dot printables for kids.', '/images/circus-ringmaster-bear-puzzle.webp'],
  cute: ['Cute Dot to Dot Printables for Kids — Free PDF Worksheets', 'Free cute dot to dot printables for kids ages 4-10: puppies, lion cubs, butterflies, rocket ships, frogs, and more adorable characters. Print-ready PDF worksheets popular with families across the USA, UK, and Canada in 2026.', '11 Free Cute Dot to Dot Printables', 'Puppies, lion cubs, butterflies, and more adorable dot to dot printables ready to print in a minute.', '/images/cute-puppy-puzzle.webp'],
  dinosaurs: ['Dinosaur Dot to Dot Printables — Free PDF Worksheets for Kids', 'Free dinosaur dot to dot printables for kids ages 4-10: T-Rex, Triceratops, Velociraptor, Stegosaurus, Spinosaurus, and more prehistoric favorites. Print-ready PDF worksheets popular with parents and teachers across the USA, UK, and Canada. No sign-up needed.', '11 Free Dinosaur Dot to Dot Printables', 'T-Rex, Triceratops, Velociraptor, and 8 more prehistoric dot to dot printables, ready to download and print today.', '/images/trex-61-puzzle.webp'],
  flowers: ['Flower Dot to Dot Printables for Kids — Free PDF Worksheets', 'Free flower dot to dot printables for kids ages 4-12: roses, tulips, orchids, sunflowers, peonies, and 15 more blooms. Print-ready PDF worksheets loved by families in the USA, UK, and Canada — no sign-up needed.', '20 Free Flower Dot to Dot Printables', 'Roses, tulips, orchids, and more dot to dot printables — free PDF worksheets ready to download and print today.', '/images/flower-rose-puzzle.webp'],
  garden: ['Garden Dot to Dot Printables for Kids — Free PDF Worksheets', 'Free garden-themed dot to dot printables for kids ages 4-9: gloves, trowel, and wheelbarrow. Print-ready PDF worksheets for spring gardening units in the USA, UK, and Canada — no sign-up needed.', '3 Free Garden Dot to Dot Printables', 'Garden gloves, trowel, and wheelbarrow — free dot to dot printables, ready to print in seconds.', '/images/garden-gloves-puzzle.webp'],
  ocean: ['Ocean Dot to Dot Printables for Kids — Free PDF Worksheets', 'Free ocean dot to dot printables for kids ages 4-9: mermaids, mermen, seahorses, whales, and jellyfish. Downloadable PDF worksheets loved by families in the USA, UK, and Canada. No account needed — print and start connecting.', '5 Free Ocean Dot to Dot Printables', 'Mermaids, mermen, seahorses, whales, and jellyfish — free dot to dot printables ready to print in a minute.', '/images/mermaid-puzzle.webp'],
  playgrounds: ['Playground Dot to Dot Printables — Free PDF for Kids', 'Free playground dot to dot printables for kids ages 4-12: spring horse, carousel, slide, seesaw, monkey bars, and an extreme 133-dot roller coaster. Print-ready PDF worksheets for the USA, UK, and Canada. No sign-up needed.', '9 Free Playground Dot to Dot Printables', 'Swings, slides, seesaws, and an extreme 133-dot roller coaster — free dot to dot printables to print today.', '/images/swing-playgrounds-puzzle.webp'],
  space: ['Free Space Dot-to-Dot Printables for Kids', 'Download free space dot-to-dot worksheets for kids, including UFOs, rockets, planets, and more.', 'Free Space Dot-to-Dot Printables for Kids', 'Download free space dot-to-dot worksheets for kids, including UFOs, rockets, planets, and more.', '/images/space-rover-puzzle.webp'],
  uae: ['UAE Dot to Dot Printables for Kids — Free PDF Worksheets', 'Free UAE-themed dot to dot printables for kids ages 5-10: Burj Khalifa, Burj Al Arab, the national falcon, a traditional dallah coffee pot, and a desert camel. Print-ready PDF worksheets — no sign-up needed.', '5 Free UAE Dot to Dot Printables', 'Burj Khalifa, Burj Al Arab, falcon, camel, and dallah — free dot to dot printables to print today.', '/images/burj-al-arab-puzzle.webp'],
  'usa-250': ['America 250 Dot to Dot Printables — Free PDF for Kids', "Celebrate America's 250th anniversary in 2026 with free patriotic dot to dot printables for kids ages 4-10: fireworks, Liberty Bell, bald eagle, astronaut, and Space Shuttle. Print-ready PDF worksheets for classrooms across the USA.", '11 Free America 250 Dot to Dot Printables', "Fireworks, Liberty Bell, bald eagle, astronaut, and more patriotic dot to dot printables for America's 250th.", '/images/gas-balloon-usa-250-puzzle.webp']
};
const ukrainianTitles = {
  dinosaurs: 'Безкоштовні головоломки з динозаврами для дітей — 10 завдань «з’єднай крапки»',
  garden: 'Безкоштовні садові головоломки для дітей',
  ocean: 'Безкоштовні морські головоломки для дітей — з’єднай крапки з морськими тваринами',
  playgrounds: 'Безкоштовні головоломки з дитячим майданчиком для дітей',
  uae: 'Безкоштовні головоломки ОАЕ для дітей'
};

function loadTsModule(file) {
  const source = fs.readFileSync(file, 'utf8');
  const js = typescript.transpileModule(source, {
    compilerOptions: { module: typescript.ModuleKind.CommonJS, target: typescript.ScriptTarget.ES2022 }
  }).outputText;
  const module = { exports: {} };
  new Function('exports', 'module', 'require', '__filename', '__dirname', js)(module.exports, module, require, file, path.dirname(file));
  return module.exports;
}

function extractObject(file, declaration) {
  const source = fs.readFileSync(file, 'utf8');
  const start = source.indexOf(declaration);
  if (start < 0) throw new Error(`Missing ${declaration} in ${file}`);
  const open = source.indexOf('{', start);
  let depth = 0, quote = '', escaped = false, end = -1;
  for (let index = open; index < source.length; index++) {
    const char = source[index];
    if (escaped) { escaped = false; continue; }
    if (quote) {
      if (char === '\\') escaped = true;
      else if (char === quote) quote = '';
      continue;
    }
    if (char === '"' || char === "'" || char === '`') { quote = char; continue; }
    if (char === '{') depth++;
    if (char === '}' && --depth === 0) { end = index + 1; break; }
  }
  if (end < 0) throw new Error(`Unclosed ${declaration} in ${file}`);
  const synthetic = `const value = ${source.slice(open, end)}; module.exports = value;`;
  const js = typescript.transpileModule(synthetic, {
    compilerOptions: { module: typescript.ModuleKind.CommonJS, target: typescript.ScriptTarget.ES2022 }
  }).outputText;
  const module = { exports: {} };
  new Function('module', 'exports', js)(module, module.exports);
  return module.exports;
}

function pageDefaults(category) {
  const file = path.join(root, 'app', '[locale]', category, 'page.tsx');
  const source = fs.readFileSync(file, 'utf8');
  const pick = (expression, fallback = '') => source.match(expression)?.[1] ?? fallback;
  const fallback = fallbackSeo[category];
  return { title: fallback[0], description: fallback[1], ogTitle: fallback[2], ogDescription: fallback[3], image: pick(/absoluteUrl\('([^']+)'\)/, fallback[4]) };
}

const seoModule = loadTsModule(path.join(root, 'lib', 'localized-seo.ts'));
const flowerCopy = extractObject(path.join(root, 'lib', 'flowers-data.ts'), 'const flowerPageCopy');
const locales = fs.readdirSync(contentRoot).filter(name => fs.existsSync(path.join(contentRoot, name, 'messages.json')));
const output = {};

for (const locale of locales) {
  const messages = JSON.parse(fs.readFileSync(path.join(contentRoot, locale, 'messages.json'), 'utf8'));
  output[locale] = {};
  for (const category of categories) {
    const puzzleFile = path.join(contentRoot, locale, `puzzles-${category}.json`);
    if (!fs.existsSync(puzzleFile)) continue;
    const defaults = pageDefaults(category);
    const localizedSeo = seoModule.localizedCollectionSeo(locale, category);
    let body;
    if (category === 'flowers') {
      const normalized = locale.startsWith('ar-') ? 'ar' : locale;
      body = flowerCopy[normalized] || flowerCopy.en;
    } else if (category === 'canada') {
      body = locale === 'es'
        ? { breadcrumb: 'Canadá', category: 'Canadá', h1: 'Puzles de unir puntos de Canadá', description: 'Descubre Canadá con fichas gratuitas de animales canadienses y la emblemática hoja de arce.', whyH2: 'Descubre Canadá punto por punto' }
        : locale === 'de'
          ? { breadcrumb: 'Kanada', category: 'Kanada', h1: 'Kanada-Punkt-zu-Punkt-Rätsel', description: 'Entdecke Kanada mit kostenlosen Arbeitsblättern zu kanadischen Tieren und dem berühmten Ahornblatt.', whyH2: 'Entdecke Kanada Punkt für Punkt' }
          : { breadcrumb: 'Canada', category: 'Canada', h1: 'Free Canada Dot-to-Dot Printables for Kids', description: 'Paddle a Canadian canoe, trace the maple leaf, then meet a polar bear, moose, and raccoon. This free printable collection turns Canadian symbols and wildlife into hands-on number practice.', whyH2: 'Discover Canada One Dot at a Time' };
    } else {
      body = messages[pageKeys[category]] || {};
    }
    output[locale][category] = {
      title: localizedSeo?.title || (locale === 'uk' ? ukrainianTitles[category] : null) || defaults.title,
      meta_description: localizedSeo?.description || defaults.description,
      og_title: localizedSeo?.ogTitle || defaults.ogTitle,
      og_description: localizedSeo?.ogDescription || defaults.ogDescription,
      image: defaults.image,
      h1: body.h1 || '',
      name: body.category || body.breadcrumb || '',
      tagline: body.whyH2 || body.eyebrow || '',
      description: body.description || '',
      breadcrumb_name: body.breadcrumb || body.category || ''
    };
  }
}
process.stdout.write(JSON.stringify(output));
