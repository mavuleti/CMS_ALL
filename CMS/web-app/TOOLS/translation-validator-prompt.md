# Prompt: Multilingual Content Pre-Build Validator

Write a Python script called `validate_translations.py` that acts as a pre-build content validator for a multilingual JSON content folder.

## Folder Structure

The folder structure is `content/`, then one subfolder per locale (e.g. `en`, `es`, `ar`, `ur`), each containing files like `messages.json`, `blog.json`, and category-split puzzle JSON files — all flat or nested key-value pairs where values are strings.

## Source of Truth

Treat English (`en`) as the source of truth locale. Every other locale is validated against it.

## Script Contamination Check

For every non-English locale folder, recursively walk each JSON file, extract every key and its string value, and determine the expected Unicode script for that locale:
- **Arabic script** for `ar` and `ur` (Urdu and Arabic share the Arabic Unicode block)
- **Latin script** for locales like `es`, `fr`, `pt`, `de`, etc.

For each value, count characters belonging to Latin script versus the expected script, ignoring digits, punctuation, whitespace, and common symbols. Flag a value as possible untranslated/contaminated if:
- It contains Latin characters above a configurable threshold (default: more than 20% of its alphabetic characters), OR
- It's identical to the English source value for that same key

Allow a whitelist of acceptable Latin terms (brand names, product names like "DotToDot") that should not trigger a flag.

## Empty / Placeholder Value Check

Separately flag keys where the value exists but is blank, whitespace-only, or a placeholder like "TODO" or "TBD". Report these as a distinct issue category from script contamination.

## Key Parity Check

For each locale's JSON file, compare its full set of keys against the corresponding English file of the same file name. Report:
- Keys missing from the locale (present in English, absent in the locale)
- Extra keys in the locale that don't exist in English

## Output & Behavior

- Output a clear report grouped by locale and file, listing the offending key, the file path, and the suspicious value (or the specific issue: contamination, empty/placeholder, missing key, extra key).
- Exit with a nonzero status code if any issues are found, so it can be wired into a pre-build or CI step.
- Include comments explaining the Unicode range choices.
- Make the threshold and whitelist easily configurable at the top of the file.
