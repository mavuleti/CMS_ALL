"""Populate shared UI and the audited prose fixes for every non-English locale."""

from __future__ import annotations

import json
import sqlite3
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
HOME_DB = HERE / "mapping_audit_home.db"
EN_COMMON = HERE.parent / "Ui-app-DB-json" / "content" / "en" / "common.json"
SKIP = {"en", "ja"}  # Japanese has reviewed, hand-authored values.
TARGETED = {
    "mapping_audit_blog_all.db": [99439, 99449, 99458, 99482, 99492, 99496,
        99523, 99529, 99538, 99545, 99565, 99590, 99612, 99615, 99622, 99653, 99709, 99725],
    "mapping_audit_garden.db": [53755],
    "mapping_audit_playgrounds.db": [199467],
}
CATEGORY_KEYS = {
    "canadaPage.category": "Canada", "circusPage.category": "Circus",
    "cutePage.category": "Cute", "dinosaursPage.category": "Dinosaurs",
    "flowersPage.category": "Flowers", "gardenPage.category": "Garden",
    "oceanPage.category": "Ocean", "playgroundsPage.category": "Playgrounds",
    "spacePage.category": "Space", "uaePage.category": "United Arab Emirates",
    "usa250Page.category": "USA 250th Anniversary",
}


def flatten(value, prefix=""):
    out = {}
    for key, item in value.items():
        path = f"{prefix}.{key}" if prefix else key
        if isinstance(item, dict): out.update(flatten(item, path))
        elif isinstance(item, str): out[path] = item
    return out


def translate(text: str, language: str) -> str:
    if not text.strip(): return text
    query = urllib.parse.urlencode({"client": "gtx", "sl": "en", "tl": language,
                                    "dt": "t", "format": "html", "q": text})
    for attempt in range(4):
        try:
            with urllib.request.urlopen("https://translate.googleapis.com/translate_a/single?" + query, timeout=30) as response:
                data = json.loads(response.read())
            return "".join(part[0] for part in data[0] if part[0])
        except Exception:
            if attempt == 3: raise
            time.sleep(1.5 * (attempt + 1))


def upsert_shared(conn, language, key, value):
    db_key = "body." + key
    row = conn.execute("SELECT id FROM mapping_audit WHERE language=? AND puzzle_slug='home' AND new_key=?",
                       (language, db_key)).fetchone()
    if row:
        conn.execute("UPDATE mapping_audit SET new_value=?,status='OK',notes=? WHERE id=?",
                     (value, "shared UI localized for all languages", row[0]))
    else:
        conn.execute("""INSERT INTO mapping_audit
          (puzzle_slug,language,where_used_in_page,legacy_key,Legacy_value_by_key,new_key,new_value,
           status,relevant,usage_relevant,notes,created_at,i18nRequired)
          VALUES ('home',?,'shared localized UI','NEW_FIELD',NULL,?,?,'OK','YES','YES',?,?,1)""",
          (language, db_key, value, "shared UI localized for all languages", datetime.now(timezone.utc).isoformat()))


def main():
    common = json.loads(EN_COMMON.read_text(encoding="utf-8"))
    namespaces = {k: common[k] for k in ("puzzleDetail", "downloadButton", "downloadBadge", "shareButtons", "blogPage")}
    shared = flatten(namespaces)
    shared.update(CATEGORY_KEYS)
    home = sqlite3.connect(HOME_DB)
    languages = [r[0] for r in home.execute("SELECT DISTINCT language FROM mapping_audit ORDER BY language") if r[0] not in SKIP]
    for language in languages:
        for key, source in shared.items():
            upsert_shared(home, language, key, translate(source, language))
        home.commit()
        print(f"{language}: {len(shared)} shared values")
    home.close()

    # Mirror the exact prose fields found by the Japanese rendered-page audit.
    # Existing genuine translations are preserved; only English-identical or blank rows change.
    for db_name, english_ids in TARGETED.items():
        conn = sqlite3.connect(HERE / db_name)
        for english_id in english_ids:
            key_row = conn.execute("SELECT puzzle_slug,new_key FROM mapping_audit WHERE id=?", (english_id,)).fetchone()
            if not key_row: continue
            source_row = conn.execute(
                "SELECT puzzle_slug,new_key,new_value FROM mapping_audit WHERE language='en' AND puzzle_slug=? AND new_key=? ORDER BY id DESC LIMIT 1",
                key_row,
            ).fetchone()
            if not source_row: continue
            slug, key, source = source_row
            for language in languages:
                row = conn.execute("SELECT id,new_value FROM mapping_audit WHERE language=? AND puzzle_slug=? AND new_key=?",
                                   (language, slug, key)).fetchone()
                if row and (not (row[1] or "").strip() or row[1] == source):
                    conn.execute("UPDATE mapping_audit SET new_value=?,status='OK',notes=? WHERE id=?",
                                 (translate(source, language), "translated after cross-locale rendered audit", row[0]))
        conn.commit()
        conn.close()
        print(f"{db_name}: audited targeted prose")


if __name__ == "__main__": main()
