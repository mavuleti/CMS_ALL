import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { routing } from '../i18n/routing.ts';

const home = {
  title: 'Free Dot to Dot Printables for Kids | Connect the Dots Worksheets PDF',
  ogTitle: 'Free dot-to-dot worksheets for kids',
  description: 'Download free dot-to-dot printables for kids - animals, dinosaurs, vehicles, holiday themes and more. Print-ready PDF connect-the-dots worksheets for preschool, kindergarten and grades 1-6. No sign-up needed.'
};
const staticPages = {
  about: { title: 'About Us - Who Makes These Free Dot-to-Dot Printables', description: 'DotToDotFreePrintables.com creates free printable connect-the-dots worksheets for kids. Learn who makes the puzzles, how each page is tested, and why everything is free.' },
  contact: { title: 'Contact Us', description: 'Contact DotToDotFreePrintables with puzzle requests, corrections, licensing questions, or feedback about our free printable dot-to-dot worksheets.' },
  search: { title: 'Search Free Dot-to-Dot Printables', description: 'Search free printable dot-to-dot worksheets by theme, puzzle name, or number of dots.' },
  terms: { title: 'Terms of Use', description: 'Terms of use for DotToDotFreePrintables.com: free personal and classroom printing, what requires permission, intellectual property, and disclaimers.' },
  privacy: { title: 'Privacy Policy', description: 'Privacy policy for DotToDotFreePrintables.com: what data we collect, how it is used, children’s privacy, advertising, and your rights.' },
  blog: { title: 'Dot-to-Dot Learning Blog for Parents and Teachers', description: 'Practical dot-to-dot activity ideas, learning guides, printable tips, and classroom resources for parents and teachers.' }
};

for (const locale of routing.locales) {
  const contentLocale = ['ar-AE', 'ar-SA', 'ar-QA'].includes(locale) ? 'ar' : locale;
  const filename = join('content', contentLocale, 'seo', 'metadata.json');
  const metadata = JSON.parse(readFileSync(filename, 'utf8'));
  metadata.homepage ??= home;
  for (const [page, values] of Object.entries(staticPages)) metadata.staticPages[page] ??= values;
  writeFileSync(filename, `${JSON.stringify(metadata, null, 2)}\n`);
}
