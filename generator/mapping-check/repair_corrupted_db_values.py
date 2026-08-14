"""Restore encoding-corrupted mapping_audit values from locale exports.

Only rows containing replacement question marks are considered. A row is
updated only when the corresponding exported JSON value exists and does not
contain the same corruption pattern.
"""

from __future__ import annotations

import json
import re
import sqlite3
from pathlib import Path


HERE = Path(__file__).resolve().parent
EXPORT = HERE / "export"
URL_RE = re.compile(r"https?://[^\s\"'<>]+")
TAG_RE = re.compile(r"<[^>]+>")
PATH_PART_RE = re.compile(r"([^.\[\]]+)|\[(\d+)\]")

CANADA_COLLECTION = {
    "az": {"body.description": "Kanada simvolları və vəhşi təbiəti haqqında çap edilə bilən nöqtə-birləşdirmə tapmacaları."},
    "cs": {"body.description": "Tisknutelné spojovačky s kanadskými symboly a divokou přírodou."},
    "de": {"body.description": "Druckbare Punkt-zu-Punkt-Rätsel mit kanadischen Symbolen und Wildtieren."},
    "es": {"body.description": "Puzzles imprimibles de unir puntos con símbolos y fauna de Canadá."},
    "fi": {"body.description": "Tulostettavia yhdistä pisteet -tehtäviä Kanadan symboleista ja villieläimistä."},
    "hr": {"body.description": "Ispisive zagonetke spoji točke s kanadskim simbolima i divljim životinjama."},
    "hu": {"body.description": "Nyomtatható pontösszekötő feladatok Kanada jelképeivel és élővilágával."},
    "lt": {"body.description": "Spausdinami taškų sujungimo galvosūkiai su Kanados simboliais ir laukine gamta."},
    "lv": {"body.name": "Kanāda", "body.description": "Drukājamas punktu savienošanas mīklas par Kanādas simboliem un savvaļas dabu."},
    "pl": {"body.description": "Łamigłówki połącz kropki do druku z symbolami i przyrodą Kanady."},
    "pt": {"body.description": "Puzzles liga os pontos para imprimir com símbolos e vida selvagem do Canadá."},
    "pt-BR": {"body.description": "Quebra-cabeças ligue os pontos para imprimir com símbolos e animais do Canadá."},
    "ro": {"body.description": "Puzzle unește punctele de printat cu simboluri și animale sălbatice din Canada."},
    "sk": {"body.description": "Tlačiteľné spájanie bodiek s kanadskými symbolmi a divokou prírodou."},
    "sl": {"body.description": "Uganke poveži pike za tisk s kanadskimi simboli in divjimi živalmi."},
    "tr": {"body.description": "Kanada simgeleri ve vahşi yaşamını içeren yazdırılabilir noktaları birleştirme bulmacaları."},
    "vi": {"body.description": "Câu đố nối điểm có thể in với các biểu tượng và động vật hoang dã Canada."},
}


def corrupted(value: object) -> bool:
    if not isinstance(value, str):
        return False
    prose = TAG_RE.sub("", URL_RE.sub("", value))
    return "??" in prose or bool(re.search(r"[^\W\d_]\?[^\W\d_]", prose, re.UNICODE))


def get_path(root: object, dotted: str) -> object | None:
    current = root
    for match in PATH_PART_RE.finditer(dotted):
        key, index = match.groups()
        try:
            current = current[int(index)] if index is not None else current[key]
        except (KeyError, IndexError, TypeError):
            return None
    return current


def export_name(db_stem: str, slug: str) -> str | None:
    suffix = db_stem.removeprefix("mapping_audit_")
    if suffix == "home":
        return "home.json"
    if suffix == "blog_all":
        return "blog.json"
    if suffix == "legal":
        return {"about": "about.json", "contact": "contact.json",
                "privacy-policy": "privacy-policy.json", "terms": "terms.json"}.get(slug)
    if suffix in {"other_pages", "other_pages_fields", "validation"}:
        return None
    return f"puzzles-{suffix}.json"


def source_value(language: str, db_stem: str, slug: str, key: str) -> object | None:
    if db_stem == "mapping_audit_canada" and slug == "canada-collection":
        fallback = CANADA_COLLECTION.get(language, {}).get(key)
        if fallback:
            return fallback
    name = export_name(db_stem, slug)
    if not name:
        return None
    path = EXPORT / language / name
    if not path.exists():
        return None
    document = json.loads(path.read_text(encoding="utf-8"))
    suffix = db_stem.removeprefix("mapping_audit_")
    if suffix == "home":
        return get_path(document, key)
    if suffix == "blog_all":
        posts = document.get("posts", document if isinstance(document, list) else [])
        item = next((x for x in posts if x.get("slug") == slug), None)
        return get_path(item, key) if item else None
    if suffix == "legal":
        return get_path(document, key)
    if slug.endswith("-collection"):
        return get_path(document.get("collection", {}), key)
    item = next((x for x in document.get("puzzles", []) if x.get("slug") == slug), None)
    return get_path(item, key) if item else None


def main() -> None:
    repaired = 0
    for db_path in sorted(HERE.glob("mapping_audit_*.db")):
        connection = sqlite3.connect(db_path)
        columns = {row[1] for row in connection.execute("PRAGMA table_info(mapping_audit)")}
        if not {"language", "puzzle_slug", "new_key", "new_value"} <= columns:
            connection.close()
            continue
        rows = connection.execute(
            "SELECT id, language, puzzle_slug, new_key, new_value FROM mapping_audit"
        ).fetchall()
        updates = []
        for row_id, language, slug, key, current in rows:
            if not corrupted(current):
                continue
            replacement = source_value(language, db_path.stem, slug, key)
            if isinstance(replacement, str) and replacement and not corrupted(replacement):
                updates.append((replacement, "repaired from verified locale export", row_id))
        if updates:
            if "notes" in columns:
                connection.executemany(
                    "UPDATE mapping_audit SET new_value=?, notes=? WHERE id=?", updates
                )
            else:
                connection.executemany(
                    "UPDATE mapping_audit SET new_value=? WHERE id=?",
                    [(value, row_id) for value, _notes, row_id in updates],
                )
            connection.commit()
            print(f"{db_path.name}: repaired {len(updates)}")
            repaired += len(updates)
        connection.close()
    print(f"Total repaired: {repaired}")


if __name__ == "__main__":
    main()
