# Translation Content Validator

`validate_translations.py` is a pre-build validator that checks multilingual content for translation quality issues.

## What It Checks

1. **Script Contamination** - Flags Latin characters in Arabic/Urdu locales above 20% threshold
2. **Empty/Placeholder Values** - Detects blank or placeholder strings (TODO, TBD, etc.)
3. **Key Parity** - Reports missing keys (in English but not in locale) and extra keys
4. **Identical Values** - Warns about strings identical to English source (possibly untranslated)

## Configuration

At the top of the file:

```python
LATIN_CONTAMINATION_THRESHOLD = 0.20  # Flag if >20% of alphabetic chars are Latin
PLACEHOLDER_PATTERNS = {'todo', 'tbd', '[translate]', 'xxx', '???'}
ACCEPTABLE_LATIN_TERMS = {'DotToDot', 'DotToDotFreePrintables', 'PDF', 'USA', 'OK'}
```

## Running

**From the command line:**

```bash
python TOOLS/validate_translations.py
```

**Via npm:**

```bash
npm run validate:translations
```

**As part of build:**

```bash
npm run build  # validate:translations runs automatically
```

## Output

The validator exits with status `1` if errors are found (empty values, missing keys, script contamination), or `0` if only warnings (extra keys, identical values).

Reports are grouped by:
- Locale (e.g. `ar`, `es`, `fr`)
- File (e.g. `messages.json`, `blog.json`)
- Issue type (script contamination, empty, missing keys)

Example output:

```
Locale: ar
----------------
  File: blog.json
    SCRIPT CONTAMINATION (19):
      - [0].sections[1].paragraphs[0]: Latin contamination (166/304 chars, 54.6%)
        Value: يحتاج الصغار إلى سلاسل أرقام قصيرة ...
    EMPTY/PLACEHOLDER VALUES (10):
      - [0].sections[0].heading: empty
      ...
```

## Smart Filtering

The validator automatically skips technical fields from contamination checks:

- URLs (`https://`, `/paths/`)
- Slug fields, IDs, email fields
- Content with heavy HTML tags or ICU formatting (`{count, plural, ...}`)

This prevents false positives on system fields while catching real translation issues.

## Integration with CI/Build

The `validate:translations` script is wired into the main build process and runs **after** `validate:i18n`. This provides layered validation:

1. `validate:i18n` - Checks key parity, ICU format, HTML tags, mojibake
2. `validate:translations` - Checks script contamination, empty values, identical content
3. `validate:no-hardcoded-jsx` - Checks for hardcoded English in JSX components

All three must pass before the build continues.
