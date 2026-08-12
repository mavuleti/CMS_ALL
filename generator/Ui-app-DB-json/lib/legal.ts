import type { LegalContent } from '@/components/LocalizedLegalPages';
import { getExportDocument } from '@/lib/export-content';

export async function loadLegalContent(_locale: string): Promise<LegalContent> {
  return {
    about: getExportDocument('about').body,
    contact: getExportDocument('contact').body,
    privacy: getExportDocument('privacy-policy').body,
    terms: getExportDocument('terms').body
  } as LegalContent;
}
