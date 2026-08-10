# Legacy → New Schema Migration Audit — Prompt Spec

## 1. Purpose

Before running a bulk conversion of legacy puzzle JSON into the new
namespaced schema (see `puzzle-json-schema.md`), build a **single-puzzle
verification tool** that proves the key mapping is correct. This is a
verification/audit step, not the production migration script — it exists
purely to catch mismapped or dropped keys before they happen at scale.

Start with **one puzzle only**. Once the mapping is confirmed correct for
that puzzle, the same mapping logic gets reused for the real batch
conversion (see §6).

## 2. Input

- One legacy-format puzzle JSON file (flat structure — old keys like
  `seoTitle`, `seoDescription`, `seoH1`, `name`, `tagline`, `description`,
  `funFact`, `dotGuide`, `slug`, etc.)
- The target new-format schema (`puzzle-json-schema.md` — namespaced under
  `header` / `body`)
- The known old→new key mapping table already defined in
  `puzzle-json-schema.md` §2

## 3. Output: SQLite Audit Table (built by a Python script)

A Python script generates a **SQLite database file** containing one audit
table, so the results can be opened and scrolled through manually in any
SQLite browser (DB Browser for SQLite, etc.) — not a markdown file.

Table: `mapping_audit`

| Column | Type | Content |
|---|---|---|
| `id` | INTEGER PRIMARY KEY | Row id (autoincrement) |
| `puzzle_slug` | TEXT | Which puzzle this audit run is for |
| `legacy_key` | TEXT | Old flat key name (e.g. `seoTitle`) |
| `legacy_value` | TEXT | Literal value from the source legacy JSON |
| `new_key` | TEXT | Target key path under the new schema (e.g. `header.title`), pulled from the defined mapping table, not guessed |
| `mapped_value` | TEXT | The value actually found at that new key path after running the conversion — read from the converted output, not assumed to match |
| `status` | TEXT | One of `OK`, `DROPPED`, `MISMATCH`, `UNMAPPED`, `NEW_FIELD` (see §4) |
| `notes` | TEXT | Optional free-text detail, e.g. what kind of mismatch |
| `created_at` | TEXT | Timestamp of the audit run |

The script:
1. Loads the legacy JSON and the converted new-schema JSON for one puzzle.
2. Walks the defined old→new mapping table (from `puzzle-json-schema.md`
   §2), plus any nested fields per §5 below.
3. Writes one row per field into `mapping_audit`.
4. Creates the SQLite file (e.g. `mapping_audit_<slug>.db`) fresh each run,
   or appends with a distinct `puzzle_slug` if reused across puzzles later
   (see §6).

This is a manual-verification aid — Kishor opens the `.db` file directly to
scroll and check rows, rather than reading a generated report.

## 4. Automated Checks (on top of the visual table)

For each row, flag automatically rather than relying on the eyeball check
alone:

- **Missing mapping** — a legacy key exists but has no defined target in the
  mapping table → flag as `UNMAPPED`.
- **Missing in output** — a legacy key has a defined target, but that key
  path doesn't exist at all in the converted JSON → flag as `DROPPED`.
- **Value mismatch** — the new key path exists, but its value doesn't match
  the legacy value (after accounting for expected transforms, e.g.
  `dotGuide` → `dot_guide` restructuring into sections/color_schemes) →
  flag as `MISMATCH`.
- **New-schema-only keys** — fields that exist in the new schema but have no
  legacy source (e.g. `header.og.*`, `header.json_ld.*`) → flag as
  `NEW_FIELD — needs manual fill-in`, not an error, just a heads-up so it
  isn't mistaken for a silent drop.
- **Match** — value round-trips correctly → flag as `OK`.

Summarize counts at the top: total legacy keys, mapped OK, dropped,
mismatched, unmapped, new fields needing fill-in.

## 5. Scope for v1

- Runs against **exactly one puzzle** at a time, chosen by file path or
  slug.
- Read-only / non-destructive — this tool never writes back into the real
  puzzle data, it only produces the audit table for review.
- Operates on the two JSON files directly (legacy in, converted out) and
  writes the results into the SQLite audit table described in §3 — this
  SQLite table is for manual verification only, not the production data
  store (see §6 for how it differs from the eventual puzzle-storage
  database).
- Nested structures (like `dotGuide` → `dot_guide.sections[]` /
  `color_schemes[]`) should be flattened row-by-row in the table too (e.g.
  one row per section, one row per color mapping entry), not collapsed into
  a single "dotGuide matches" row — that's exactly where silent mismatches
  are most likely to hide.

## 6. Path to scale (not built yet, just the intended next step)

Once this is verified clean on one puzzle:

1. The same mapping + comparison logic gets wrapped in a loop to run across
   all legacy puzzles.
2. Instead of one audit table per run, output becomes one row per
   *puzzle* in a summary table (counts of OK/DROPPED/MISMATCH per puzzle),
   with the detailed field-level table available per-puzzle on demand for
   any puzzle that isn't fully clean.
3. This is explicitly **verification tooling** — separate from whatever
   later stores the converted result (SQLite table, per-file JSON, etc.,
   per the earlier discussion on history tracking). The audit table's job
   ends at "confirm the mapping is trustworthy."

## 7. Out of scope for this prompt

- The production puzzle-storage database (SQLite `puzzles` /
  `puzzle_revisions` tables from the earlier storage discussion) — the
  `mapping_audit` table here is a separate, throwaway verification database,
  not that one.
- Git commit-per-save logic.
- Fixing/auto-correcting mismatches — this tool only detects and reports;
  a human decides how to fix any flagged row.
