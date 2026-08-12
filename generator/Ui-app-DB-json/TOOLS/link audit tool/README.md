# Static Locale Link Checker

## Purpose

The static locale link checker audits internal links after the Next.js static
export has been generated.

It scans every generated HTML page inside each locale directory and reports:

- Links whose target does not exist.
- Links that point to another locale.
- Links that do not include the current page's locale prefix.
- Links intentionally rendered as plain text because their localized target
  is unavailable.
- The pages and link targets affected by each problem.

The checker helps prevent visitors from reaching missing pages or unexpectedly
leaving their selected language.

## Tool location

The Python script and this guide are located at:

```text
TOOLS/link audit tool/check_static_locale_links.py
TOOLS/link audit tool/README.md
```

The default reports are written to:

```text
reports/static-locale-link-report.md
reports/static-locale-link-report.json
```

## Requirements

- Python 3.9 or newer.
- A completed Next.js static export in the `out` directory.
- No third-party Python packages are required.

The checker uses only the Python standard library.

## How to run

### Run through npm

From the project root:

```bash
npm run validate:locale-links
```

This is the normal validation command. It returns a nonzero exit code when it
finds broken links or locale mismatches.

### Run the Python script directly

```bash
python "TOOLS/link audit tool/check_static_locale_links.py"
```

### Generate a report without failing

Use `--no-fail` when you want to inspect the current problems without causing
the command or CI job to fail:

```bash
python "TOOLS/link audit tool/check_static_locale_links.py" --no-fail
```

This option does not hide errors. All findings are still included in the
Markdown and JSON reports.

### Check a different export directory

```bash
python "TOOLS/link audit tool/check_static_locale_links.py" --out-dir path/to/export
```

### Choose a different Markdown report path

```bash
python "TOOLS/link audit tool/check_static_locale_links.py" --report reports/my-link-report.md
```

Unless `--json-report` is also supplied, the JSON report is written beside the
Markdown report using the same filename and a `.json` extension.

### Choose a different JSON report path

```bash
python "TOOLS/link audit tool/check_static_locale_links.py" \
  --report reports/my-link-report.md \
  --json-report reports/my-link-report.json
```

On PowerShell, the same command can be written on one line:

```powershell
python "TOOLS/link audit tool/check_static_locale_links.py" --report reports/my-link-report.md --json-report reports/my-link-report.json
```

### Display command help

```bash
python "TOOLS/link audit tool/check_static_locale_links.py" --help
```

## Build integration

The checker is registered in `package.json` as:

```json
"validate:locale-links": "python \"TOOLS/link audit tool/check_static_locale_links.py\""
```

It runs at the end of the main build pipeline, after the static export and
other deployment validations:

```text
next build
  -> strip Next.js runtime
  -> validate Arabic hreflang
  -> validate deployment output
  -> validate locale links
```

Because the normal command fails when findings exist, unresolved broken links
or locale mismatches will stop `npm run build`.

Suppressed unavailable links are warnings, not build failures. They make the
locale-aware fallback behavior visible without treating its safe plain-text
output as a broken link.

## Production release integration

The full production deployment has an additional, explicit release gate:

```bash
npm run prod-deploy
```

Its relevant sequence is:

```text
production environment checks
  -> full static build
  -> build-time locale-link audit
  -> full mobile alignment tests for all locales
  -> release locale-link audit
  -> analytics build verification
  -> Firebase deployment
  -> live analytics and download-tracking verification
```

The final pre-deployment link gate is registered as:

```json
"verify:release-links": "npm run validate:locale-links"
```

and runs at the end of `predeploy:firebase`. A broken link, locale mismatch,
missing `out` directory, or missing locale output returns a nonzero status and
stops `prod-deploy` before Firebase is changed.

The release audit deliberately runs again after the full locale alignment
suite. This makes the deployment decision depend on the exact `out` directory
that is about to be uploaded and rewrites both reports with the release
candidate's results.

`prod-deploy-light` does not run this additional release recheck. It still
receives the normal build-time audit because `predeploy:firebase-light` calls
`npm run build`, but it retains its shorter English-only alignment workflow.

### Recommended regular-release command

Use the full workflow for routine public releases:

```bash
npm run prod-deploy
```

Do not run `firebase deploy --only hosting` directly. Besides being guarded by
the project, a direct deployment would bypass the production build flags,
full locale tests, explicit release link audit, and live post-deploy checks.

Before starting a release, uncommitted changes are allowed technically, but a
clean, reviewed commit is recommended so the deployed source can be identified
and reproduced.

## How locales are discovered

Locales are discovered from the generated output rather than from a hard-coded
list.

A directory is treated as a locale when:

1. It is a direct child of the export directory.
2. Its name looks like a locale code, such as `en`, `ar`, or `pt-BR`.
3. It contains at least one `.html` file.

This automatically includes generated regional aliases such as:

```text
ar-AE
ar-QA
ar-SA
```

At the time this guide was written, the export contained 34 locale
directories.

## Links that are checked

The checker extracts `href` values from HTML `<a>` elements.

It checks:

- Root-relative links, such as `/en/blog/`.
- Relative links, such as `../contact/`.
- Absolute links using the production hostname.
- Links containing query strings or fragments.
- Links to HTML pages and downloadable files.

Root-level `.pdf` and `.xml` files are treated as shared resources. They do
not require a locale prefix, but the checker still verifies that each target
exists in the static export.

The following are ignored:

- Fragment-only links such as `#categories`.
- External websites.
- `mailto:` links.
- `tel:` links.
- `javascript:`, `data:`, and `blob:` URLs.
- URLs using unsupported schemes.

The internal production hostnames are:

```text
dottodotfreeprintables.com
www.dottodotfreeprintables.com
```

## Finding categories

### Broken link

A link is broken when it uses the current locale prefix but no matching
exported target exists.

Example:

```text
Source: /de/
Link:   /de/canada/canada-canoe-dot-to-dot-puzzle/
```

If the export does not contain one of the expected target forms, the link is
reported as broken:

```text
out/de/canada/canada-canoe-dot-to-dot-puzzle/index.html
out/de/canada/canada-canoe-dot-to-dot-puzzle.html
```

### Locale mismatch

A locale mismatch occurs when the destination does not begin with the current
page's locale.

Example—missing locale prefix:

```text
Source locale: en
Link:          /ocean/mermaid-dot-to-dot-puzzle/
Expected:      /en/ocean/mermaid-dot-to-dot-puzzle/
```

Example—different locale:

```text
Source locale: en
Link:          /fr/blog/
```

Shared root `.pdf` and `.xml` resources referenced by `<a>` elements are
allowed without a locale prefix. Examples include:

```text
/sitemap.xml
/ocean/example-printable.pdf
```

If one of these shared targets does not exist, it is reported as a broken link
rather than a locale mismatch.

### Suppressed unavailable link

When translated content mentions a puzzle or article that has no generated
page for the active locale, `localizeHtmlLinks()` preserves the translated
label but replaces the anchor with marked plain text. The generated HTML uses
this audit marker:

```html
<span data-link-audit-suppressed="%2Fplaygrounds%2Fmonkey-bar...%2F">
  Translated puzzle name
</span>
```

The checker decodes and reports the original intended target under
`suppressed_unavailable_links` and `suppressed`. These findings:

- Do not count as broken links.
- Do not count as locale mismatches.
- Do not make the checker or deployment fail.
- Are listed by locale and source page for editorial follow-up.

A growing count usually means translations or localized puzzle pages should
be added. It can also represent an intentional, safe content fallback.

## Target resolution

Next.js is configured with `trailingSlash: true`, so a URL such as:

```text
/en/contact/
```

normally resolves to:

```text
out/en/contact/index.html
```

The checker also supports:

- Direct files such as `/en/file.pdf`.
- Extensionless `.html` exports.
- Relative URLs resolved from the source page.
- Percent-encoded URL paths.
- Query strings and fragments, which are removed before checking the file.

## Markdown report

The Markdown report is intended for people. It contains:

1. The generation timestamp and export directory.
2. A summary table for every locale.
3. Total pages, links, broken links, and locale mismatches.
4. Detailed findings grouped by locale.
5. Each affected source URL and its problematic destinations.

Open the current report here:

```text
reports/static-locale-link-report.md
```

## JSON report

The JSON report contains the same information in a machine-readable format.
It can be consumed by CI jobs, dashboards, or other scripts.

Top-level structure:

```json
{
  "generated_at": "ISO-8601 timestamp",
  "out_dir": "absolute export path",
  "locale_count": 34,
  "locales": {
    "en": {
      "pages_checked": 110,
      "internal_links_checked": 3417,
      "broken_links": 0,
      "locale_mismatches": 274,
      "suppressed_unavailable_links": 5,
      "broken": {},
      "mismatches": {},
      "suppressed": {}
    }
  },
  "totals": {
    "pages_checked": 2913,
    "internal_links_checked": 88508,
    "broken_links": 275,
    "locale_mismatches": 6928,
    "suppressed_unavailable_links": 5
  }
}
```

The numbers above are an example from the July 2026 export and will change as
the site changes.

## Exit codes

| Exit code | Meaning |
|---:|---|
| `0` | No findings, or findings were allowed with `--no-fail`. |
| `1` | Broken links or locale mismatches were found. |
| `2` | The export directory is missing or contains no locale directories. |

## Recommended workflow

For routine development:

```bash
npm run build
```

If the build stops at locale-link validation:

1. Open `reports/static-locale-link-report.md`.
2. Find the affected locale.
3. Review the broken-link and locale-mismatch sections.
4. Correct the link in the application or content source.
5. Rebuild the static export.
6. Run the checker again.

For auditing an existing export without blocking:

```bash
python "TOOLS/link audit tool/check_static_locale_links.py" --no-fail
```

## Fixing common findings

### Missing locale prefix

Avoid hard-coded links such as:

```tsx
<a href="/ocean/mermaid-dot-to-dot-puzzle/">Mermaid</a>
```

Generate the URL using the active locale:

```tsx
<a href={`/${locale}/ocean/mermaid-dot-to-dot-puzzle/`}>Mermaid</a>
```

Prefer the project's locale-aware navigation helpers where they are available.

### Link points to a page unavailable in one locale

Either:

- Generate that page for the locale.
- Hide the link when the section or item is unavailable.
- Point the link to an existing locale-appropriate alternative.

Do not silently send the visitor to another language unless that behavior is
intentional and documented.

### Shared PDF or XML resource is reported as broken

Confirm that the referenced file exists in the static export. Shared `.pdf`
and `.xml` files do not require locale prefixes, but missing files are still
errors.

## Performance

The current export contains approximately:

- 2,900 HTML pages.
- 620 MB of generated HTML.
- 88,000 internal anchor occurrences.

On the current development machine, a complete audit takes approximately four
minutes. The script uses a small thread pool and caches repeated absolute link
checks to reduce runtime while keeping memory use predictable.

Runtime will vary based on:

- Export size.
- Storage performance.
- Antivirus scanning.
- Number of unique links.
- Available CPU resources.

## Troubleshooting

### `static export directory does not exist`

Run the static build first:

```bash
npm run build
```

Or pass the correct export directory:

```bash
python "TOOLS/link audit tool/check_static_locale_links.py" --out-dir path/to/export
```

### `no locale directories found`

Confirm that the export contains directories such as:

```text
out/en/
out/fr/
out/ar/
```

Each locale directory must contain at least one HTML file.

### The command reports errors but no report appears

Confirm that the process has write access to the selected report directory.
The default `reports` directory is created automatically when needed.

### The build fails because existing findings are still being fixed

Run the checker separately with:

```bash
python "TOOLS/link audit tool/check_static_locale_links.py" --no-fail
```

Do not add `--no-fail` to the production build command unless link findings are
intentionally allowed, because doing so removes the deployment guard.

## Current audit snapshot

The full audit run on July 31, 2026 reported:

| Metric | Result |
|---|---:|
| Locales | 34 |
| Pages checked | 2,913 |
| Internal links checked | 88,345 |
| Broken links | 0 |
| Locale mismatches | 0 |
| Suppressed unavailable links | 29 |

This clean snapshot includes the generated Arabic regional aliases. The
29 warning-only suppressions are links whose exact localized target is absent:
27 locale pages mention the unavailable Monkey Bars puzzle (including
Portuguese), and Portuguese contains two additional Roller Coaster references. The counts will
change as pages and links are added; a successful historical snapshot must
never replace running the checker on the current export.

The live reports should always be treated as the authoritative current result:

```text
reports/static-locale-link-report.md
reports/static-locale-link-report.json
```
