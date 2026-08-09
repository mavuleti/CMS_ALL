import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { LegalContent } from '@/components/LocalizedLegalPages';

export async function loadLegalContent(locale: string): Promise<LegalContent> {
  const file = path.join(process.cwd(), 'content', locale, 'legal.json');
  return JSON.parse(await readFile(file, 'utf8')) as LegalContent;
}
