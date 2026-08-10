# JSX i18n hardcoded-string linter

`i18n_lint.py` scans JavaScript and TypeScript JSX syntax and reports user-visible
English text that should probably be moved into a translation catalog. It uses a
real Tree-sitter AST, reports source context, and exits with status `1` when it
finds violations. `--fix-suggest` prints possible keys but never edits source.

## Install and run

From the repository root, create a virtual environment and install the parser:

```powershell
python -m venv .venv-i18n-lint
.\.venv-i18n-lint\Scripts\python -m pip install -r TOOLS\requirements.txt
.\.venv-i18n-lint\Scripts\python TOOLS\i18n_lint.py --path src --config TOOLS\.i18n-lint.json
```

On macOS/Linux, use `.venv-i18n-lint/bin/python` in place of the Windows path.
This repository currently keeps many components outside `src`, so examples include:

```powershell
python TOOLS\i18n_lint.py --path components --config TOOLS\.i18n-lint.json --fix-suggest
python TOOLS\i18n_lint.py --path app --config TOOLS\.i18n-lint.json
```

Command-line `--path`, `--min-words`, and repeated `--translation-function`
arguments override their config values. Optional positional filenames let
pre-commit scan only changed files.

## Configuration

Copy `TOOLS/.i18n-lint.json` to the repository root if you want the default
command (`python TOOLS/i18n_lint.py`) to find it automatically, or always pass
`--config TOOLS/.i18n-lint.json`. Settings are:

- `sourcePath`: directory scanned when no positional files or `--path` are given.
- `extensions`: eligible source file extensions.
- `translationFunctions`: exact AST call names treated as translated.
- `ignoredPatterns`: regular expressions matched against normalized text.
- `minimumWords`: minimum number of English-like words required for a report.

The linter checks JSX text (including button children), static JSX expressions,
and the attributes `label`, `placeholder`, `title`, `aria-label`, and `alt`. It
ignores translation calls, URLs, numbers, one-character values, dynamic-only
expressions, and text shorter than `minimumWords`.

The included project config ignores values that consist only of an email address
or the exact `DotToDotFreePrintables` site name. Phrases containing the site name
remain reportable because their surrounding user-facing language may need translation.

## pre-commit

Add this local hook to the repository's `.pre-commit-config.yaml`. It passes only
staged JS/TS files, making the hook fast:

```yaml
repos:
  - repo: local
    hooks:
      - id: jsx-i18n-hardcoded-strings
        name: Check JSX for hardcoded English
        entry: python TOOLS/i18n_lint.py --config TOOLS/.i18n-lint.json
        language: python
        additional_dependencies:
          - tree-sitter==0.25.2
          - tree-sitter-javascript==0.23.1
          - tree-sitter-typescript==0.23.2
        types_or: [javascript, jsx, ts, tsx]
```

Install and test it with:

```powershell
python -m pip install pre-commit
pre-commit install
pre-commit run jsx-i18n-hardcoded-strings --all-files
```

## Husky-style hook

After installing the requirements in your normal Python environment, add this
line to `.husky/pre-commit`:

```sh
python TOOLS/i18n_lint.py --path src --config TOOLS/.i18n-lint.json
```

The hook blocks the commit on findings (`1`) or setup/configuration errors (`2`).

## Test the tool

Run the included regression suite from the repository root:

```powershell
python -m unittest discover -s TOOLS -p "test_*.py" -v
```
