#!/usr/bin/env python3
"""Multilingual content pre-build validator.

Validates translation content for script contamination, empty/placeholder values,
and key parity against English (source of truth).

Configurable thresholds and whitelist at the top of the file.
"""

import json
import sys
import io
import unicodedata
from collections import defaultdict
from pathlib import Path

# Ensure UTF-8 output on all platforms (especially Windows)
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Configuration: adjust these for different requirements
LATIN_CONTAMINATION_THRESHOLD = 0.20  # Flag if >20% of alphabetic chars are Latin
PLACEHOLDER_PATTERNS = {'todo', 'tbd', '[translate]', 'xxx', '???'}
# Brand names and product terms that are acceptable in any script
ACCEPTABLE_LATIN_TERMS = {'DotToDot', 'DotToDotFreePrintables', 'PDF', 'USA', 'OK'}

# Unicode script blocks (representative ranges)
# Arabic: U+0600–U+06FF (Arabic), U+0750–U+077F (Arabic Supplement), U+FB50–U+FDFF (Arabic Presentation Forms)
ARABIC_RANGES = [
    (0x0600, 0x06FF),   # Arabic
    (0x0750, 0x077F),   # Arabic Supplement
    (0xFB50, 0xFDFF),   # Arabic Presentation Forms
]

# Latin: U+0041–U+005A, U+0061–U+007A (ASCII) + accented Latin
LATIN_RANGES = [
    (0x0041, 0x005A),   # A-Z
    (0x0061, 0x007A),   # a-z
    (0x00C0, 0x00FF),   # Latin Extended-A (accented)
    (0x0100, 0x017F),   # Latin Extended-A
    (0x0180, 0x024F),   # Latin Extended-B
]

# Cyrillic: U+0400–U+04FF (Cyrillic), U+0500–U+052F (Cyrillic Supplement)
CYRILLIC_RANGES = [
    (0x0400, 0x04FF),   # Cyrillic
    (0x0500, 0x052F),   # Cyrillic Supplement
]

# Greek: U+0370–U+03FF
GREEK_RANGES = [
    (0x0370, 0x03FF),   # Greek and Coptic
]

# Thai: U+0E00–U+0E7F
THAI_RANGES = [
    (0x0E00, 0x0E7F),   # Thai
]

# Hangul (Korean): U+AC00–U+D7AF
HANGUL_RANGES = [
    (0xAC00, 0xD7AF),   # Hangul Syllables
    (0x1100, 0x11FF),   # Hangul Jamo
    (0x3130, 0x318F),   # Hangul Compatibility Jamo
]

# Hiragana/Katakana/CJK (Japanese): various ranges
JAPANESE_RANGES = [
    (0x3040, 0x309F),   # Hiragana
    (0x30A0, 0x30FF),   # Katakana
    (0x4E00, 0x9FFF),   # CJK Unified Ideographs
    (0x3400, 0x4DBF),   # CJK Extension A
]

# Script definitions per locale: strict script purity enforcement
# Only the expected script should appear in content (technical fields are skipped)
SCRIPT_EXPECTATIONS = {
    # Arabic script locales
    'ar': 'Arabic',       # Arabic
    'fa': 'Arabic',       # Persian (Farsi)
    'az': 'Arabic',       # Azerbaijani (Arabic variant) - note: also has Latin variant, but this project uses Arabic

    # Cyrillic script locales
    'ru': 'Cyrillic',     # Russian
    'uk': 'Cyrillic',     # Ukrainian

    # Greek script
    'el': 'Greek',        # Greek

    # Thai script
    'th': 'Thai',         # Thai

    # East Asian scripts
    'ko': 'Hangul',       # Korean (Hangul)
    'ja': 'Japanese',     # Japanese (Hiragana/Katakana/Kanji)

    # Latin script locales (European + others)
    # en, es, fr, de, pt, pt-BR, it, pl, nl, sv, da, no, fi, cs, sk, hr, sl, hu, ro, tr, vi, id, lt, lv
    # All others default to Latin
}


def is_in_ranges(char_code, ranges):
    """Check if a character code falls within given Unicode ranges."""
    return any(start <= char_code <= end for start, end in ranges)


def get_script_of_char(char):
    """Determine the primary script of a character."""
    code = ord(char)
    if is_in_ranges(code, ARABIC_RANGES):
        return 'Arabic'
    if is_in_ranges(code, CYRILLIC_RANGES):
        return 'Cyrillic'
    if is_in_ranges(code, GREEK_RANGES):
        return 'Greek'
    if is_in_ranges(code, THAI_RANGES):
        return 'Thai'
    if is_in_ranges(code, HANGUL_RANGES):
        return 'Hangul'
    if is_in_ranges(code, JAPANESE_RANGES):
        return 'Japanese'
    if is_in_ranges(code, LATIN_RANGES):
        return 'Latin'
    return 'Other'


def count_script_chars(value):
    """Count alphabetic characters by script, excluding digits/punctuation."""
    scripts = {
        'Arabic': 0,
        'Latin': 0,
        'Cyrillic': 0,
        'Greek': 0,
        'Thai': 0,
        'Hangul': 0,
        'Japanese': 0,
        'Other': 0,
    }

    for char in value:
        if not char.isalpha():
            continue  # Skip non-alphabetic

        script = get_script_of_char(char)
        if script in scripts:
            scripts[script] += 1
        else:
            scripts['Other'] += 1

    scripts['Total'] = sum(v for k, v in scripts.items() if k != 'Total')
    return scripts


def normalize_text(text):
    """Normalize text for comparison (lowercase, strip whitespace)."""
    return str(text).strip().lower()


def is_placeholder(value):
    """Check if value is a placeholder (empty, TODO, etc.)."""
    normalized = normalize_text(value)
    if not normalized:
        return True, 'empty'
    if normalized in PLACEHOLDER_PATTERNS:
        return True, 'placeholder'
    return False, None


def has_acceptable_latin_term(value):
    """Check if value contains an acceptable Latin term that should not trigger contamination flag."""
    for term in ACCEPTABLE_LATIN_TERMS:
        if term in value:
            return True
    return False


def should_skip_contamination_check(key, value):
    """
    Determine if a field should be skipped from script contamination checks.

    URLs, slugs, IDs, and other technical fields are inherently Latin.
    Also skip content that is heavily dependent on ICU formatting, placeholders, or HTML.
    """
    # Skip URLs
    if value.startswith('http://') or value.startswith('https://') or value.startswith('/'):
        return True

    # Skip common technical field names
    technical_keys = {'slug', 'href', 'url', 'id', 'email', 'key', 'identifier', 'path'}
    key_lower = key.lower()
    if any(tech in key_lower for tech in technical_keys):
        return True

    # Skip if value is primarily ICU message format, HTML tags, or placeholders
    brace_count = value.count('{') + value.count('}')
    tag_count = value.count('<') + value.count('>')
    number_count = sum(1 for c in value if c.isdigit())
    technical_char_count = brace_count + tag_count + number_count
    if len(value) > 0 and technical_char_count / len(value) > 0.20:
        return True

    return False


def check_script_contamination(value, expected_script, locale, key=''):
    """
    Check if value contains ONLY the expected script characters (script purity).

    Ensures each locale uses only its designated script:
    - Arabic locales: ONLY Arabic characters
    - Cyrillic locales: ONLY Cyrillic characters
    - Greek locales: ONLY Greek characters
    - Thai locales: ONLY Thai characters
    - Hangul locales: ONLY Hangul characters
    - Japanese locales: ONLY Japanese characters
    - Latin locales: ONLY Latin characters

    Returns (is_contaminated, reason) tuple.
    """
    # Skip technical fields that are inherently allowed to mix scripts (URLs, slugs, etc.)
    if should_skip_contamination_check(key, value):
        return False, None

    # Count characters by script
    counts = count_script_chars(value)
    if counts['Total'] == 0:
        # No alphabetic characters - no script to validate
        return False, None

    # All scripts that shouldn't be in this value
    all_scripts = ['Arabic', 'Latin', 'Cyrillic', 'Greek', 'Thai', 'Hangul', 'Japanese']
    contaminating_scripts = []

    for script in all_scripts:
        if script == expected_script:
            continue  # Expected script is OK
        if counts.get(script, 0) > 0:
            contaminating_scripts.append(f"{script}({counts[script]})")

    if contaminating_scripts:
        # Special case: allow acceptable Latin terms in Arabic
        if expected_script == 'Arabic' and len(contaminating_scripts) == 1 and contaminating_scripts[0].startswith('Latin'):
            if has_acceptable_latin_term(value):
                return False, None

        return True, f"Script purity violation - expected {expected_script} only, found: {', '.join(contaminating_scripts)}"

    return False, None


def flatten_json(obj, prefix=''):
    """Flatten nested JSON to dot-notation keys and their string values."""
    result = {}

    if isinstance(obj, dict):
        for key, value in obj.items():
            new_prefix = f"{prefix}.{key}" if prefix else key
            if isinstance(value, (dict, list)):
                result.update(flatten_json(value, new_prefix))
            elif isinstance(value, str):
                result[new_prefix] = value

    elif isinstance(obj, list):
        for index, item in enumerate(obj):
            new_prefix = f"{prefix}[{index}]"
            if isinstance(item, (dict, list)):
                result.update(flatten_json(item, new_prefix))
            elif isinstance(item, str):
                result[new_prefix] = item

    return result


def read_json_file(file_path):
    """Safely read a JSON file, returning None on error."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError) as e:
        return None


def validate_locale_against_source(locale, file_name, content_dir, source_locale='en'):
    """
    Validate a single locale's file against the English source.

    Returns dict with 'script_contamination', 'empty_values', 'missing_keys', 'extra_keys' lists.
    """
    issues = {
        'script_contamination': [],
        'empty_values': [],
        'missing_keys': [],
        'extra_keys': [],
        'identical_values': [],
    }

    source_path = content_dir / source_locale / file_name
    locale_path = content_dir / locale / file_name

    if not locale_path.exists():
        # File doesn't exist in this locale (might be intentional)
        return issues

    source_data = read_json_file(source_path)
    locale_data = read_json_file(locale_path)

    if source_data is None or locale_data is None:
        return issues

    source_flat = flatten_json(source_data)
    locale_flat = flatten_json(locale_data)

    expected_script = SCRIPT_EXPECTATIONS.get(locale, 'Latin')

    # Check each key in the locale file
    for key, value in locale_flat.items():
        # Check for empty/placeholder
        is_empty, reason = is_placeholder(value)
        if is_empty:
            issues['empty_values'].append((key, value, reason))

        # Check for script contamination
        is_contaminated, reason = check_script_contamination(value, expected_script, locale, key)
        if is_contaminated:
            issues['script_contamination'].append((key, value, reason))

        # Check if value is identical to source (possible untranslated)
        if key in source_flat and source_flat[key] == value:
            issues['identical_values'].append((key, value))

    # Check for missing keys (in source but not in locale)
    for key in source_flat:
        if key not in locale_flat:
            issues['missing_keys'].append(key)

    # Check for extra keys (in locale but not in source)
    for key in locale_flat:
        if key not in source_flat:
            issues['extra_keys'].append(key)

    return issues


def main():
    """Main validator entry point."""
    content_dir = Path('content')

    if not content_dir.exists():
        print(f"Error: {content_dir} directory not found", file=sys.stderr)
        sys.exit(2)

    source_locale = 'en'
    source_dir = content_dir / source_locale

    if not source_dir.exists():
        print(f"Error: {source_dir} (source locale) not found", file=sys.stderr)
        sys.exit(2)

    # Get all JSON files from source locale
    source_files = sorted([f.name for f in source_dir.glob('*.json')])

    if not source_files:
        print(f"Error: no JSON files found in {source_dir}", file=sys.stderr)
        sys.exit(2)

    # Get all locales (directories other than source)
    all_locales = sorted([
        d.name for d in content_dir.iterdir()
        if d.is_dir() and d.name != source_locale
    ])

    # Validate all locales
    has_errors = False
    all_issues = defaultdict(lambda: defaultdict(dict))

    for locale in all_locales:
        for file_name in source_files:
            issues = validate_locale_against_source(locale, file_name, content_dir, source_locale)
            if any(issues.values()):
                all_issues[locale][file_name] = issues
                if issues['script_contamination'] or issues['empty_values'] or issues['missing_keys']:
                    has_errors = True

    # Print report
    if all_issues:
        print("Translation Validation Report")
        print("=" * 80)
        print()

        for locale in sorted(all_issues.keys()):
            print(f"Locale: {locale}")
            print("-" * 80)

            for file_name in sorted(all_issues[locale].keys()):
                issues = all_issues[locale][file_name]
                print(f"  File: {file_name}")

                if issues['script_contamination']:
                    print(f"    SCRIPT CONTAMINATION ({len(issues['script_contamination'])}):")
                    for key, value, reason in issues['script_contamination'][:10]:
                        print(f"      - {key}: {reason}")
                        print(f"        Value: {value[:60]}{'...' if len(value) > 60 else ''}")
                    if len(issues['script_contamination']) > 10:
                        print(f"      ... and {len(issues['script_contamination']) - 10} more")

                if issues['empty_values']:
                    print(f"    EMPTY/PLACEHOLDER VALUES ({len(issues['empty_values'])}):")
                    for key, value, reason in issues['empty_values'][:10]:
                        print(f"      - {key}: {reason}")
                    if len(issues['empty_values']) > 10:
                        print(f"      ... and {len(issues['empty_values']) - 10} more")

                if issues['missing_keys']:
                    print(f"    MISSING KEYS ({len(issues['missing_keys'])}):")
                    for key in issues['missing_keys'][:10]:
                        print(f"      - {key}")
                    if len(issues['missing_keys']) > 10:
                        print(f"      ... and {len(issues['missing_keys']) - 10} more")

                if issues['extra_keys']:
                    print(f"    EXTRA KEYS (warning only, {len(issues['extra_keys'])}):")
                    for key in issues['extra_keys'][:5]:
                        print(f"      - {key}")
                    if len(issues['extra_keys']) > 5:
                        print(f"      ... and {len(issues['extra_keys']) - 5} more")

                if issues['identical_values']:
                    print(f"    IDENTICAL TO SOURCE (possible untranslated, {len(issues['identical_values'])}):")
                    for key, value in issues['identical_values'][:5]:
                        print(f"      - {key}")
                    if len(issues['identical_values']) > 5:
                        print(f"      ... and {len(issues['identical_values']) - 5} more")

                print()

            print()
    else:
        print("Translation Validation Report")
        print("=" * 80)
        print("✓ No validation issues found")
        print()

    if has_errors:
        print("FAILED: Translation validation errors found")
        sys.exit(1)

    print("PASSED: All translations validated successfully")
    sys.exit(0)


if __name__ == '__main__':
    main()
