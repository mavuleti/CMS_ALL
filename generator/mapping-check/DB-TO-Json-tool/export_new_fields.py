#!/usr/bin/env python3
"""
Export NEW_FIELD rows (new_key / new_value) from the mapping_audit_*.db files
in this folder into JSON files shaped exactly like their reference file in
ui-app/content/en — so an editor can review/fill just the fields that don't
exist in the legacy schema, without touching the real content files.

Read-only against ui-app/content: this script never writes there, it only
reads each reference file to (a) reproduce the reference's own outer shape —
a {"collection": ..., "puzzles": [...]} object for puzzles-*.json, or a bare
array for blog.json — and (b) skip any new_key that is already present with
a non-empty value in the reference, so the export only ever contains
genuinely new key/value pairs — never a key that doesn't already exist in
the DB's own new_key list (NEW_FIELD rows), and never a key that's already
filled in on the real page.

en only, by design (mapping-check DBs were audited against EN content).

Usage:
    python export_new_fields.py                  # export every known db
    python export_new_fields.py cute dinosaurs    # export just these
    python export_new_fields.py --out-dir DIR     # default: ./export/en
"""

from __future__ import annotations

import argparse
import copy
import json
import re
import sqlite3
import sys
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parent))
from validate_headers import validate_db  # noqa: E402

HERE = Path(__file__).resolve().parent
CONTENT_EN = HERE.parent.parent / "ui-app" / "content" / "en"

# mapping-check db stem -> reference file under ui-app/content/en. Multiple
# db stems may point at the same reference file (e.g. the single-slug
# "cute-puppy" db and the full "cute" category db both audit entries that
# live in puzzles-cute.json) — their rows are merged into one export, not
# overwritten, see main().
DB_TO_REFERENCE = {
    "canada": "puzzles-canada.json",
    "circus": "puzzles-circus.json",
    "cute": "puzzles-cute.json",
    "cute-puppy-dot-to-dot-puzzle": "puzzles-cute.json",
    "dinosaurs": "puzzles-dinosaurs.json",
    "flowers": "puzzles-flowers.json",
    "garden": "puzzles-garden.json",
    "ocean": "puzzles-ocean.json",
    "playgrounds": "puzzles-playgrounds.json",
    "space": "puzzles-space.json",
    "uae": "puzzles-uae.json",
    "usa-250": "puzzles-usa-250.json",
    "blog_all": "blog.json",
}

# The "legal" db is a single db covering four unrelated single-document
# reference files (about.json/contact.json/privacy-policy.json/terms.json —
# each one a bare {slug, header, body} document, not an array of entries),
# one per slug produced by audit_legal_bundle.py. Handled separately from
# DB_TO_REFERENCE in main() since it's a one-db-to-many-files relationship,
# the opposite of the "cute" + "cute-puppy" many-dbs-to-one-file case above.
LEGAL_SLUG_TO_REFERENCE = {
    "about": "about.json",
    "contact": "contact.json",
    "privacy-policy": "privacy-policy.json",
    "terms": "terms.json",
}

_INDEX_RE = re.compile(r"^([^\[]+)\[(\d+)\]$")


def parse_key_path(key: str) -> list[tuple[str, int | None]]:
    """'body.dot_guide.sections[0].range' -> [('body', None), ('dot_guide', None), ('sections', 0), ('range', None)]"""
    parts = []
    for part in key.split("."):
        m = _INDEX_RE.match(part)
        parts.append((m.group(1), int(m.group(2))) if m else (part, None))
    return parts


def get_path(obj: Any, key: str) -> Any:
    current = obj
    for name, index in parse_key_path(key):
        if not isinstance(current, dict) or name not in current:
            return None
        current = current[name]
        if index is not None:
            if not isinstance(current, list) or index >= len(current):
                return None
            current = current[index]
    return current


def set_path(root: dict, key: str, value: Any) -> None:
    """Writes `value` at dotted/bracket `key` inside `root`, creating dicts and
    growing lists as needed so the result nests exactly like the reference
    file's own shape for that key."""
    current = root
    parts = parse_key_path(key)
    for i, (name, index) in enumerate(parts):
        last = i == len(parts) - 1
        if index is None:
            if last:
                current[name] = value
            else:
                current = current.setdefault(name, {})
        else:
            lst = current.setdefault(name, [])
            while len(lst) <= index:
                lst.append({})
            if last:
                lst[index] = value
            else:
                current = lst[index]


def load_reference(reference_path: Path) -> Any:
    if not reference_path.exists():
        return None
    return json.loads(reference_path.read_text(encoding="utf-8-sig"))


def reference_entry_for_slug(reference: Any, slug: str) -> dict | None:
    """Reference files are either a bare array of entries, an object with a
    "puzzles" array plus a "collection" object, or (about.json/contact.json/
    privacy-policy.json/terms.json) a single bare {slug, header, body}
    document that IS the entry. `slug` may also be the synthetic
    "<category>-collection" slug used by audit_single_puzzle.py for
    collection-level rows."""
    if slug.endswith("-collection") and isinstance(reference, dict):
        return reference.get("collection")
    if isinstance(reference, dict) and "puzzles" not in reference and reference.get("slug") == slug:
        return reference
    entries = reference.get("puzzles") if isinstance(reference, dict) else reference
    if not isinstance(entries, list):
        return None
    return next((e for e in entries if isinstance(e, dict) and e.get("slug") == slug), None)


def read_new_field_rows(db_path: Path) -> list[sqlite3.Row]:
    """Pulls the new_key/new_value columns for every row, regardless of
    status (OK/DROPPED/MISMATCH/UNMAPPED/NEW_FIELD) — the caller's own
    filtering (skip if the reference already has a non-empty value at that
    key, skip if new_value is empty/<absent>) is what actually decides
    what's a genuine gap, not the audit's status label."""
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    try:
        columns = {row[1] for row in conn.execute("PRAGMA table_info(mapping_audit)")}
        if not columns:
            print(f"SKIP {db_path.name}: no mapping_audit table")
            return []
        where = "WHERE language = 'en'" if "language" in columns else ""
        return conn.execute(f"SELECT puzzle_slug, new_key, new_value FROM mapping_audit {where}").fetchall()
    finally:
        conn.close()


def apply_rows(
    rows: list[sqlite3.Row], source_name: str, reference: Any,
    puzzles: dict[str, dict], collection: dict, seen: dict[tuple[str, str], tuple[str, str]],
) -> int:
    """Merges NEW_FIELD rows into the shared `puzzles` (keyed by slug) and
    `collection` accumulators for one reference file — shared across every db
    that audits entries belonging to that same reference, so two source dbs
    covering the same slug (e.g. the single-slug "cute-puppy" db and the
    full "cute" category db) merge into one entry instead of the second
    call's output replacing the first's.

    `seen` tracks (slug, new_key) -> (new_value, source_name) across every db
    processed for this reference so a second db repeating a key is counted
    once if the value agrees, and reported (not silently overwritten) if it
    disagrees — the first value written always wins.
    """
    written = 0
    for row in rows:
        slug, new_key, new_value = row["puzzle_slug"], row["new_key"], row["new_value"]
        ref_entry = reference_entry_for_slug(reference, slug)
        existing = get_path(ref_entry, new_key) if ref_entry is not None else None
        if existing not in (None, ""):
            continue  # already filled in on the real page — not a gap to export
        if new_value in (None, "", "<absent>"):
            continue  # nothing to hand the editor yet

        seen_key = (slug, new_key)
        prior = seen.get(seen_key)
        if prior is not None:
            prior_value, prior_source = prior
            if prior_value != new_value:
                print(
                    f"CONFLICT {slug}::{new_key}: {prior_source}={prior_value!r} vs "
                    f"{source_name}={new_value!r} — keeping {prior_source}'s value"
                )
            continue  # already applied (duplicate or conflicting) — don't double-count or overwrite
        seen[seen_key] = (new_value, source_name)

        if slug.endswith("-collection"):
            if not collection:
                base = copy.deepcopy(ref_entry) if isinstance(ref_entry, dict) else {}
                collection.update(base)
            set_path(collection, new_key, new_value)
        else:
            if slug not in puzzles:
                # Seed with the full existing reference entry (every header/body
                # key already on the real page), not just an empty {"slug": ...}
                # shell — so the exported file reads as a complete entry with the
                # new field(s) merged in, same as the reference's own shape,
                # instead of an isolated fragment with no surrounding context.
                base = copy.deepcopy(ref_entry) if isinstance(ref_entry, dict) else {}
                base["slug"] = slug
                puzzles[slug] = base
            set_path(puzzles[slug], new_key, new_value)
        written += 1
    return written


def write_export(reference: Any, puzzles: dict[str, dict], collection: dict, out_path: Path) -> None:
    """Reproduces the reference file's own top-level shape exactly:
    - a dict with "collection" and "puzzles" (the latter always present, the
      former always present too — even as {} when there's nothing new —
      whenever the reference itself has both) for puzzles-*.json;
    - a bare array for blog.json;
    - a single bare {slug, header, body} document (not wrapped in a list or
      object) for about.json/contact.json/privacy-policy.json/terms.json,
      where the reference itself already is a single document.
    Never flattens a collection/puzzles reference down to a plain list, and
    never drops a top-level key the reference has just because this run
    found nothing new for it."""
    puzzles_list = list(puzzles.values())
    if isinstance(reference, dict) and "puzzles" in reference:
        output: Any = {"puzzles": puzzles_list}
        if "collection" in reference:
            output = {"collection": collection, "puzzles": puzzles_list}
    elif isinstance(reference, dict) and "puzzles" not in reference and "slug" in reference:
        # Single-document reference: there's exactly one accumulated entry
        # (keyed by the reference's own slug) — that entry IS the output.
        output = next(iter(puzzles.values()), copy.deepcopy(reference))
    else:
        output = puzzles_list

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(output, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def run_validation(db_names: list[str], min_headers: int) -> list[dict]:
    """Runs validate_headers.validate_db against each db about to feed an
    export, right before writing anything — so the export always reflects a
    checked state of the exact data going out, not a separate/stale
    validation pass someone might forget to re-run. Returns only the failed
    page results for 'en' (empty list if everything passed) — most puzzle
    dbs carry both 'en' and 'ar' rows per slug, but export_new_fields.py only
    ever reads 'en' data (see read_new_field_rows), so an 'ar'-only failure
    must never block or get reported against an 'en' export."""
    failures: list[dict] = []
    for name in db_names:
        db_path = HERE / f"mapping_audit_{name}.db"
        if not db_path.exists():
            continue
        failures.extend(r for r in validate_db(db_path, min_headers) if not r["passed"] and r["language"] == "en")
    return failures


def print_validation_failures(failures: list[dict]) -> None:
    for f in failures:
        print(f"  VALIDATION FAIL [{f['source_db']}] {f['puzzle_slug']}: "
              f"headers={f['header_count']} h1={f['h1_count']} — {f['notes']}")


def export_legal_bundle(out_dir: Path, min_headers: int, strict: bool) -> int:
    """mapping_audit_legal.db (built by audit_legal_bundle.py) covers four
    slugs, each its own single-document reference file — handled here rather
    than through the DB_TO_REFERENCE loop since that loop assumes one
    reference file maps to a fixed, shared list of db stems, which doesn't
    fit a single db feeding four independent reference files."""
    db_path = HERE / "mapping_audit_legal.db"
    if not db_path.exists():
        print("SKIP legal: mapping_audit_legal.db not found (run audit_legal_bundle.py first)")
        return 0

    failures = run_validation(["legal"], min_headers)
    failing_slugs = {f["puzzle_slug"] for f in failures}
    if failures:
        print("legal.db validation:")
        print_validation_failures(failures)

    rows_by_slug: dict[str, list[sqlite3.Row]] = {}
    for row in read_new_field_rows(db_path):
        rows_by_slug.setdefault(row["puzzle_slug"], []).append(row)

    total = 0
    for slug, reference_file in LEGAL_SLUG_TO_REFERENCE.items():
        if strict and slug in failing_slugs:
            print(f"SKIP legal.db [{slug}]: --strict and validation failed")
            continue
        rows = rows_by_slug.get(slug, [])
        reference = load_reference(CONTENT_EN / reference_file)
        if reference is None:
            print(f"SKIP {reference_file}: reference file not found at {CONTENT_EN / reference_file}")
            continue

        puzzles: dict[str, dict] = {}
        seen: dict[tuple[str, str], tuple[str, str]] = {}
        written = apply_rows(rows, "legal.db", reference, puzzles, {}, seen)

        out_path = out_dir / reference_file
        write_export(reference, puzzles, {}, out_path)
        print(f"legal.db [{slug}]: {written} new key/value pairs -> {out_path}")
        total += written
    return total


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("names", nargs="*", help="db stems to export (default: all known)")
    parser.add_argument("--out-dir", type=Path, default=HERE / "export" / "en")
    parser.add_argument("--min-headers", type=int, default=7, help="validate_headers.py threshold (default: 7)")
    parser.add_argument("--strict", action="store_true", help="skip exporting any page that fails header validation, instead of exporting it anyway with a warning")
    args = parser.parse_args()

    requested = args.names or list(DB_TO_REFERENCE) + ["legal"]

    total = 0
    if "legal" in requested:
        total += export_legal_bundle(args.out_dir, args.min_headers, args.strict)

    # Every db stem that shares a reference file with a requested name (known
    # in the whole DB_TO_REFERENCE table), not just the requested ones — a
    # filtered run like `export_new_fields.py cute` must still pull in
    # cute-puppy-dot-to-dot-puzzle.db, or its rows would be silently missing
    # from the merged puzzles-cute.json this run writes.
    all_by_reference: dict[str, list[str]] = {}
    for name, reference_file in DB_TO_REFERENCE.items():
        all_by_reference.setdefault(reference_file, []).append(name)

    requested_references: set[str] = set()
    for name in requested:
        if name == "legal":
            continue  # handled separately above, not a DB_TO_REFERENCE entry
        reference_file = DB_TO_REFERENCE.get(name)
        if reference_file is None:
            print(f"SKIP {name}: no known reference mapping (known: {', '.join(DB_TO_REFERENCE)}, legal)")
            continue
        requested_references.add(reference_file)

    for reference_file in requested_references:
        db_names = [n for n in all_by_reference[reference_file] if (HERE / f"mapping_audit_{n}.db").exists()]
        missing = [n for n in all_by_reference[reference_file] if n not in db_names]
        if missing:
            print(f"NOTE {reference_file}: {', '.join(m + '.db' for m in missing)} not found on disk, exporting from the rest")
        auto_added = [n for n in db_names if n not in requested]
        if auto_added:
            print(f"NOTE {reference_file}: auto-including {', '.join(a + '.db' for a in auto_added)} (shares this reference file)")
        if not db_names:
            print(f"SKIP {reference_file}: no source db found")
            continue

        failures = run_validation(db_names, args.min_headers)
        failing_slugs = {f["puzzle_slug"] for f in failures}
        if failures:
            print(f"{reference_file} validation:")
            print_validation_failures(failures)

        reference = load_reference(CONTENT_EN / reference_file)
        if reference is None:
            print(f"SKIP {', '.join(db_names)}: reference file not found at {CONTENT_EN / reference_file}")
            continue

        puzzles: dict[str, dict] = {}
        # Seed with the full existing reference collection block (same as
        # each puzzle entry below) so the export shows the real, already-live
        # collection-page values, not an empty {} — collection-level NEW_FIELD
        # rows have no legacy source but their values are already written
        # into the real page, so there's rarely a genuine gap to merge on top.
        collection: dict = copy.deepcopy(reference["collection"]) if isinstance(reference, dict) and isinstance(reference.get("collection"), dict) else {}
        seen: dict[tuple[str, str], tuple[str, str]] = {}
        written = 0
        for name in db_names:
            rows = read_new_field_rows(HERE / f"mapping_audit_{name}.db")
            written += apply_rows(rows, f"{name}.db", reference, puzzles, collection, seen)

        if args.strict and failing_slugs:
            for slug in failing_slugs & puzzles.keys():
                print(f"SKIP {reference_file} [{slug}]: --strict and validation failed")
                del puzzles[slug]

        out_path = args.out_dir / reference_file
        write_export(reference, puzzles, collection, out_path)
        slot_count = len(puzzles) + (1 if collection else 0)
        print(f"{', '.join(n + '.db' for n in db_names)}: {written} new key/value pairs across {slot_count} slot(s) -> {out_path}")
        total += written

    print(f"\nTotal new key/value pairs exported: {total}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
