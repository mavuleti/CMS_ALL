import type { LegalContent } from '@/components/LocalizedLegalPages';
import { getExportDocument } from '@/lib/export-content';

export async function loadLegalContent(locale: string): Promise<LegalContent> {
  return {
    about: getExportDocument('about', locale).body,
    contact: getExportDocument('contact', locale).body,
    privacy: getExportDocument('privacy-policy', locale).body,
    terms: getExportDocument('terms', locale).body
  } as LegalContent;
}
