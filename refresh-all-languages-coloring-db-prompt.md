# Task: Refresh mapping_audit DBs for every language with the new coloring schema

## Context
Repo: `dot-to-dot-page-generator`, tool folder: `generator/mapping-check/`.

There is a set of SQLite "mapping audit" databases, one per puzzle category, used to track field-by-field coverage between legacy and new content schema, per language:

```
generator/mapping-check/mapping_audit_canada.db
generator/mapping-check/mapping_audit_circus.db
generator/mapping-check/mapping_audit_cute.db
generator/mapping-check/mapping_audit_dinosaurs.db
generator/mapping-check/mapping_audit_flowers.db
generator/mapping-check/mapping_audit_garden.db
generator/mapping-check/mapping_audit_ocean.db
generator/mapping-check/mapping_audit_playgrounds.db
generator/mapping-check/mapping_audit_space.db
generator/mapping-check/mapping_audit_uae.db
generator/mapping-check/mapping_audit_usa-250.db
```

The prod content added a new "coloring guide" field per puzzle: `dotGuide.colorSchemes` (stored in the audit DB as `body.dot_guide.color_schemes[...]`). The `en` rows in all 11 DBs above have already been refreshed to include this (done — do not redo the `en` step).

**Now the same needs to happen for every OTHER language** so each language's rows in these DBs reflect the current coloring data.

## Tool to use
`generator/mapping-check/clone_en_to_language.py` — already exists, do not rewrite it. It:
1. Reads the `en` row set from each `mapping_audit_<category>.db` (the contract — never re-derived).
2. Deletes only that target language's rows in that db (never touches `en`, never touches other languages, never drops the table).
3. Fills each cloned row's value by looking up the same key path in that language's real prod content file at `dot-to-dot-web/content/<lang>/puzzles-<category>.json`. If the field doesn't exist in that language's prod file, the value is left blank — never fabricated, never machine-translated.
4. Inserts the rows for that language and verifies row-count/key parity against `en`.

It automatically backs up all `.db` files in `generator/mapping-check/` before the first write for a language (into a timestamped `mapping-check-backup-<timestamp>-<lang>/` folder next to that directory).

## What to run
From `generator/mapping-check/`, for each language below, run:

```
python clone_en_to_language.py <lang>
```

This covers all puzzle categories, `blog`, `legal`, and `home` in one run per language (see the script's `main()` — it loops `PUZZLE_CATEGORIES` plus blog/legal/home unless `--only` is passed).

### Languages to run (all locales except `en`)
Check the actual current locale list by listing directories under `dot-to-dot-web/content/` (do not hardcode from memory — verify first). As of the last check it included at least:
ar, de, es, fi, fr, it, ja, nl, pt, ru, az, cs, da, el, fa, hr, hu, id, ko, lt, lv, no, pl, pt-BR, ro, sk, sl, sv, th, tr, uk, vi

Run one invocation per language, in sequence:
```
python clone_en_to_language.py ar
python clone_en_to_language.py de
python clone_en_to_language.py es
... (repeat for every locale in the verified list, skipping en)
```

### Dry run first (recommended)
Before writing, run with `--dry-run` for at least one or two languages to sanity-check output, e.g.:
```
python clone_en_to_language.py ar --dry-run
```
It will print per-db counts (filled / blank / technical) without writing anything.

## Verification after each language
For each language, confirm the coloring rows landed and other languages weren't touched:

```python
import sqlite3
cats = ["canada","circus","cute","dinosaurs","flowers","garden","ocean","playgrounds","space","uae","usa-250"]
lang = "ar"  # change per language checked
for c in cats:
    conn = sqlite3.connect(f"mapping_audit_{c}.db")
    total = conn.execute("SELECT COUNT(*) FROM mapping_audit WHERE language=?", (lang,)).fetchone()[0]
    cs = conn.execute(
        "SELECT COUNT(*) FROM mapping_audit WHERE language=? AND new_key LIKE '%color_schemes%'", (lang,)
    ).fetchone()[0]
    print(c, "total=", total, "color_scheme_rows=", cs)
    conn.close()
```
`total` should match the `en` row count for that category (the script verifies this itself and raises an error if not — a clean run means it already passed).

## Hard rules
1. Do NOT modify `content/*` JSON files in either repo — this task only writes to the `.db` files in `generator/mapping-check/`.
2. Do NOT touch the `en` rows in any db — only `language != 'en'` rows may be deleted/rewritten, and only for the one language being processed per run.
3. Do NOT touch any `ui-app` directory if one exists in this repo.
4. Do NOT edit `dot-to-dot-web` at all — it is read-only reference/source data for this task.
5. Never fabricate or machine-translate a value that the language's real prod content doesn't have — leave it blank, exactly as the script already does. Do not "fix" blanks by hand.
6. If `clone_en_to_language.py` errors or fails its own post-run verification for a language, stop and report it — do not force past a verification failure.
