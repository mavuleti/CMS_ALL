"""Round-2 anti-stuffing audit/fix for one or more locales, applied to the
mapping_audit_*.db files produced by enhance_keywords_all_locales.py.

Policy (mirrors the English KeywordEnhance.MD pass):
  1. blog.json and legal (privacy/terms) content are out of scope -- revert
     any round-1 mechanical edits there.
  2. Within a single puzzle_slug, the same phrase must not be duplicated
     across multiple fields (e.g. header.title AND body.description both
     getting the identical suffix reads as stuffing). Keep the strongest
     placement (header.meta_description > header.title > body.description)
     and revert the rest.
  3. Reverting reconstructs the pre-enhancement value by stripping the exact
     " -- {phrase}" (title-style) or " -- {phrase}." (description-style)
     suffix that enhance_keywords_all_locales.py deterministically appended.
"""
from __future__ import annotations

import argparse
import json
import sqlite3
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPORT_PATH = HERE / "keyword-enhancement-report.json"

OUT_OF_SCOPE_DBS = {"mapping_audit_blog_all.db", "mapping_audit_legal.db"}
FIELD_PRIORITY = {"header.meta_description": 0, "header.title": 1, "body.description": 2}


def revert_value(current: str, phrase: str, key: str) -> str:
    desc_suffix = f" — {phrase}."
    plain_suffix = f" — {phrase}"
    if "description" in key:
        if current.endswith(desc_suffix):
            return current[: -len(desc_suffix)].rstrip() + "."
        if current.endswith(plain_suffix):
            return current[: -len(plain_suffix)]
        return current
    if current.endswith(plain_suffix):
        return current[: -len(plain_suffix)]
    return current


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--locales", nargs="+", required=True)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    report = json.loads(REPORT_PATH.read_text(encoding="utf-8"))
    changes = [c for c in report["changes"] if c["locale"] in args.locales]

    reverted_out_of_scope = 0
    reverted_dupe = 0
    kept = 0

    by_db: dict[str, list[dict]] = {}
    for c in changes:
        by_db.setdefault(c["database"], []).append(c)

    for db_name, rows in by_db.items():
        db_path = HERE / db_name
        conn = sqlite3.connect(db_path)

        out_of_scope = db_name in OUT_OF_SCOPE_DBS
        # group remaining rows by (locale, slug) to find same-phrase dupes across fields
        by_slug: dict[tuple[str, str], list[dict]] = {}
        for r in rows:
            by_slug.setdefault((r["locale"], r["slug"]), []).append(r)

        to_revert_ids: set[int] = set()

        if out_of_scope:
            to_revert_ids.update(r["id"] for r in rows)
        else:
            for (_locale, _slug), group in by_slug.items():
                by_phrase: dict[str, list[dict]] = {}
                for r in group:
                    by_phrase.setdefault(r["phrase"], []).append(r)
                for _phrase, dupes in by_phrase.items():
                    if len(dupes) <= 1:
                        continue
                    dupes_sorted = sorted(dupes, key=lambda r: FIELD_PRIORITY.get(r["key"], 99))
                    for loser in dupes_sorted[1:]:
                        to_revert_ids.add(loser["id"])

        for r in rows:
            cur = conn.execute(
                "SELECT new_value FROM mapping_audit WHERE id=?", (r["id"],)
            ).fetchone()
            if cur is None:
                continue
            current_value = cur[0]
            if r["id"] in to_revert_ids:
                restored = revert_value(current_value, r["phrase"], r["key"])
                if restored != current_value:
                    if not args.dry_run:
                        conn.execute(
                            "UPDATE mapping_audit SET new_value=? WHERE id=?",
                            (restored, r["id"]),
                        )
                    if db_name in OUT_OF_SCOPE_DBS:
                        reverted_out_of_scope += 1
                    else:
                        reverted_dupe += 1
            else:
                kept += 1

        if args.dry_run:
            conn.rollback()
        else:
            conn.commit()
        conn.close()

    print(json.dumps({
        "locales": args.locales,
        "dry_run": args.dry_run,
        "reverted_out_of_scope": reverted_out_of_scope,
        "reverted_dupe": reverted_dupe,
        "kept": kept,
    }, indent=2))


if __name__ == "__main__":
    main()
