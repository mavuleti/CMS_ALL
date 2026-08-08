import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class EnglishReviewService {
  private reference: any = null;

  setReference(reference: any): void {
    this.reference = reference;
  }

  valueAt(path: Array<string | number>): any {
    return path.reduce((value, segment) => value == null ? undefined : value[segment], this.reference);
  }

  untranslatedPaths(local: any): string[] {
    if (!this.reference) { return []; }
    const paths: string[] = [];
    const visit = (value: any, english: any, path: string): void => {
      if (Array.isArray(value)) {
        value.forEach((child, index) => visit(child, english && english[index], `${path}[${index}]`));
        return;
      }
      if (value && typeof value === 'object') {
        Object.keys(value).forEach(key => visit(value[key], english && english[key], path ? `${path}.${key}` : key));
        return;
      }
      if (!this.isTranslatablePath(path) || value == null || String(value).trim() === '') { return; }
      if (english != null && String(value).trim() === String(english).trim()) { paths.push(path); }
    };
    visit(local, this.reference, '');
    return paths;
  }

  isTranslatablePath(path: string): boolean {
    return path !== 'slug' &&
      !path.endsWith('.range') && !path.endsWith('.hex') &&
      !['header.json_ld.type', 'header.json_ld.image', 'header.json_ld.age_range'].includes(path);
  }
}
