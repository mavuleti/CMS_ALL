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

// Require a letter as well as the script. Arabic-Indic digits and shared
// punctuation must not be mistaken for Arabic prose.
const ARABIC_CHAR_RE = /(?=\p{L})\p{Script=Arabic}/u;
const LATIN_CHAR_RE = /(?=\p{L})\p{Script=Latin}/u;
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
export function languageScriptValidator(getLang: () => string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const stripped = stripExemptTokens(control.value);
    if (!stripped.trim()) {
      return null;
    }
    const lang = getLang();
    if (['ar', 'fa', 'ur'].includes(lang) && LATIN_CHAR_RE.test(stripped)) {
      return { languageScript: 'Arabic-script content selected — remove Latin-script text (URLs/emails are fine).' };
    }
    if (lang === 'en' && ARABIC_CHAR_RE.test(stripped)) {
      return { languageScript: 'English content selected — remove Arabic text.' };
    }
    return null;
  };
}

/** Root-relative asset path with no host, query, fragment, backslash, or traversal. */
export function imagePathValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const valid = /^\/(?:[A-Za-z0-9._~-]+\/)*[A-Za-z0-9._~-]+\.(jpg|jpeg|png|webp|gif|svg)$/i.test(control.value);
    return valid ? null : { imagePath: true };
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
export function blocklistValidator(getLang: () => string = () => 'en'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || getLang() !== 'en') {
      return null;
    }
    const lower = (control.value as string).toLowerCase();
    const hits = CHILD_SAFETY_BLOCKLIST.filter(w => new RegExp(`\\b${w}\\b`, 'i').test(lower));
    return hits.length ? { blocklist: hits } : null;
  };
}

export interface RangeConsistencyIssue {
  message: string;
  index: number;
  relatedIndex: number;
}

/** Range-overlap/gap check across a full array of "N-M" range strings. Call directly (not per-control). */
export function checkRangeConsistency(ranges: string[]): { overlaps: RangeConsistencyIssue[]; gaps: RangeConsistencyIssue[] } {
  const parsed = ranges
    .map((r, index) => {
      const m = /^(\d+)[\u2013-](\d+)$/.exec((r || '').trim());
      return m ? { start: parseInt(m[1], 10), end: parseInt(m[2], 10), index } : null;
    })
    .filter((x): x is { start: number; end: number; index: number } => !!x)
    .sort((a, b) => a.start - b.start);

  const overlaps: RangeConsistencyIssue[] = [];
  const gaps: RangeConsistencyIssue[] = [];
  for (let i = 1; i < parsed.length; i++) {
    const previous = parsed[i - 1];
    const current = parsed[i];
    if (current.start <= previous.end) {
      overlaps.push({
        message: `${previous.start}\u2013${previous.end} overlaps ${current.start}\u2013${current.end}`,
        index: current.index,
        relatedIndex: previous.index
      });
    } else if (current.start > previous.end + 1) {
      gaps.push({
        message: `gap between ${previous.end} and ${current.start}`,
        index: current.index,
        relatedIndex: previous.index
      });
    }
  }
  return { overlaps, gaps };
}
