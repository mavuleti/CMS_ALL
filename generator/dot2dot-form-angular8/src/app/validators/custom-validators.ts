import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Lowercase letters, numbers, and hyphens only — matches a URL slug. */
export function slugFormatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const valid = /^[a-z0-9]+(-[a-z0-9]+)*$/.test(control.value);
    return valid ? null : { slugFormat: true };
  };
}

/** Hex color like #FFAACC */
export function hexColorValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const valid = /^#([0-9A-Fa-f]{6})$/.test(control.value);
    return valid ? null : { hexColor: true };
  };
}

/** Dot range like "1–15" or "1-15" */
export function dotRangeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const valid = /^\d+[\u2013-]\d+$/.test(control.value);
    return valid ? null : { dotRange: true };
  };
}

// ---------------------------------------------------------------------
// Added per Kishor's request: language/script, image URL, slug
// uniqueness, and a static (non-AI) child-friendliness blocklist.
// ---------------------------------------------------------------------

const ARABIC_CHAR_RE = /\p{Script=Arabic}/u;
const LATIN_CHAR_RE = /\p{Script=Latin}/u;
const URL_RE_GLOBAL = /\bhttps?:\/\/[^\s]+/gi;
const EMAIL_RE_GLOBAL = /\b[\w.+-]+@[\w-]+\.[\w.-]+\b/gi;

function stripExemptTokens(text: string): string {
  return text.normalize('NFC').replace(URL_RE_GLOBAL, ' ').replace(EMAIL_RE_GLOBAL, ' ');
}

/**
 * Validates text against the selected content language's script.
 * URLs and email addresses are always exempt in either language.
 * `getLang` is a callback so the validator can read a live form value
 * (e.g. a sibling "language" dropdown control) at validation time.
 */
export function languageScriptValidator(getLang: () => 'en' | 'ar'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const stripped = stripExemptTokens(control.value);
    if (!stripped.trim()) {
      return null;
    }
    const lang = getLang();
    if (lang === 'ar' && LATIN_CHAR_RE.test(stripped)) {
      return { languageScript: 'Arabic content selected — remove English text (URLs/emails are fine).' };
    }
    if (lang === 'en' && ARABIC_CHAR_RE.test(stripped)) {
      return { languageScript: 'English content selected — remove Arabic text.' };
    }
    return null;
  };
}

/** Full image URL ending in a common image extension. */
export function imageUrlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const valid = /^https?:\/\/[^\s]+\.(jpg|jpeg|png|webp|gif|svg)(\?[^\s]*)?$/i.test(control.value);
    return valid ? null : { imageUrl: true };
  };
}

/**
 * Slug must not already exist. `getExistingSlugs` should return the
 * current known-slugs list (published puzzles + anything already
 * generated this session) at validation time.
 */
export function slugUniqueValidator(getExistingSlugs: () => Set<string>): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    return getExistingSlugs().has(control.value) ? { slugTaken: true } : null;
  };
}

// Deliberately conservative starter list — catches obvious offenders only.
// This is a static word-list, NOT an AI/context-aware check — see docs.
export const CHILD_SAFETY_BLOCKLIST = [
  'kill', 'murder', 'die', 'death', 'blood', 'gun', 'weapon', 'knife', 'stab', 'suicide',
  'hate', 'stupid', 'idiot', 'damn', 'hell', 'sexy', 'sex', 'nude', 'naked', 'drunk', 'drug',
  'attack', 'violence', 'scary', 'terror', 'curse', 'swear'
];

/** Static (non-AI) child-friendliness check against CHILD_SAFETY_BLOCKLIST. */
export function blocklistValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const lower = (control.value as string).toLowerCase();
    const hits = CHILD_SAFETY_BLOCKLIST.filter(w => new RegExp(`\\b${w}\\b`, 'i').test(lower));
    return hits.length ? { blocklist: hits } : null;
  };
}

/** Range-overlap/gap check across a full array of "N-M" range strings. Call directly (not per-control). */
export function checkRangeConsistency(ranges: string[]): { overlaps: string[]; gaps: string[] } {
  const parsed = ranges
    .map(r => {
      const m = /^(\d+)[\u2013-](\d+)$/.exec((r || '').trim());
      return m ? [parseInt(m[1], 10), parseInt(m[2], 10)] as [number, number] : null;
    })
    .filter((x): x is [number, number] => !!x)
    .sort((a, b) => a[0] - b[0]);

  const overlaps: string[] = [];
  const gaps: string[] = [];
  for (let i = 1; i < parsed.length; i++) {
    const [prevStart, prevEnd] = parsed[i - 1];
    const [curStart, curEnd] = parsed[i];
    if (curStart <= prevEnd) {
      overlaps.push(`${prevStart}\u2013${prevEnd} overlaps ${curStart}\u2013${curEnd}`);
    } else if (curStart > prevEnd + 1) {
      gaps.push(`gap between ${prevEnd} and ${curStart}`);
    }
  }
  return { overlaps, gaps };
}
