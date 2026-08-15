"""Round-1 keyword insertion for a locale, applied directly to mapping_audit_*.db.

Design goals (matching the manual English pass in Ui-app-DB-json/KeywordEnhance.MD):
  - blog.json and legal (privacy/terms) content are out of scope.
  - At most ONE phrase insertion per puzzle_slug (not one per field) to avoid
    the same fixed phrase reading as stuffed across a whole page.
  - Only touch header.meta_description (the field an SEO phrase fits most
    naturally without rewriting factual copy) -- skip if it already contains
    any pool phrase.
  - Rotate across several phrases from the locale's keyword bank so the same
    exact string isn't repeated on every single page (balances the site
    instead of over-using one phrase).
"""
from __future__ import annotations

import argparse
import json
import sqlite3
from pathlib import Path

HERE = Path(__file__).resolve().parent
KEYWORD_DIR = HERE.parent / "Ui-app-DB-json" / "keyword-list"
OUT_OF_SCOPE_DBS = {"mapping_audit_blog_all.db", "mapping_audit_legal.db"}
TARGET_KEY = "header.meta_description"


# Some keyword-list files have leftover research-instruction placeholders
# instead of an actual phrase (e.g. "Find free printable versions", "Choose
# whether the Thai target audience is..."). These are never real search
# phrases and must never be inserted into content.
INSTRUCTION_PREFIXES = (
    "find ", "choose ", "recommend ", "provide ", "translate ", "give ",
)


def _looks_like_instruction(phrase: str) -> bool:
    lower = phrase.strip().lower()
    return lower.startswith(INSTRUCTION_PREFIXES)


def load_phrase_pool(locale: str) -> list[str]:
    payload = json.loads((KEYWORD_DIR / f"{locale}.json").read_text(encoding="utf-8"))
    summary = payload["opportunity_summary"]
    pool = []
    for k in ("recommended_local_phrase", "primary_term", "print_modifier", "free_modifier", "children_modifier"):
        v = (summary.get(k) or "").strip()
        # Skip single-word fragments (e.g. a bare "toddler") -- they read as
        # a stray tag rather than a natural search phrase when appended.
        if v and v not in pool and len(v.split()) >= 2 and not _looks_like_instruction(v):
            pool.append(v)
    for item in payload["data"].get("native_phrases", [])[:6]:
        p = item.get("phrase", "").strip()
        if p and p not in pool and 2 <= len(p.split()) <= 8 and not _looks_like_instruction(p):
            pool.append(p)
    return pool


def enhance_description(value: str, phrase: str) -> str:
    value = value.rstrip()
    return value.rstrip(" .。!！?？،") + f" — {phrase}."


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--locales", nargs="+", required=True)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    all_changes = []
    for locale in args.locales:
        pool = load_phrase_pool(locale)
        if not pool:
            continue
        rotation_idx = 0
        for db_path in sorted(HERE.glob("mapping_audit_*.db")):
            if db_path.name in OUT_OF_SCOPE_DBS:
                continue
            conn = sqlite3.connect(db_path)
            columns = {row[1] for row in conn.execute("PRAGMA table_info(mapping_audit)")}
            if "language" not in columns:
                conn.close()
                continue
            rows = conn.execute(
                "SELECT id, puzzle_slug, new_value FROM mapping_audit "
                "WHERE language=? AND new_key=? AND COALESCE(new_value,'')<>''",
                (locale, TARGET_KEY),
            ).fetchall()
            for row_id, slug, old_value in rows:
                already = any(p.casefold() in old_value.casefold() for p in pool)
                if already:
                    continue
                phrase = pool[rotation_idx % len(pool)]
                rotation_idx += 1
                new_value = enhance_description(old_value, phrase)
                all_changes.append({
                    "database": db_path.name, "id": row_id, "locale": locale,
                    "slug": slug, "key": TARGET_KEY, "phrase": phrase,
                })
                if not args.dry_run:
                    conn.execute("UPDATE mapping_audit SET new_value=? WHERE id=?", (new_value, row_id))
            if args.dry_run:
                conn.rollback()
            else:
                conn.commit()
            conn.close()

    by_locale = {}
    for c in all_changes:
        by_locale[c["locale"]] = by_locale.get(c["locale"], 0) + 1
    print(json.dumps({"dry_run": args.dry_run, "total": len(all_changes), "by_locale": by_locale}, indent=2))

    if not args.dry_run:
        out_path = HERE / "round1_locale_changes.json"
        existing = []
        if out_path.exists():
            existing = json.loads(out_path.read_text(encoding="utf-8"))
        existing.extend(all_changes)
        out_path.write_text(json.dumps(existing, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
