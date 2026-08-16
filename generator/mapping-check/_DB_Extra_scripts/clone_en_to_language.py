#!/usr/bin/env python3
"""
Clone the 'en' row set in every mapping_audit_*.db into a new language,
filling values from that language's real prod content — never re-deriving
rows from scratch. See POPULATE-NEW-LANGUAGE-RULES.md in this folder for the
full rules this script exists to enforce; that file is the source of truth,
this script is just the implementation.

Usage:
    python clone_en_to_language.py <lang> [--only db1,db2,...] [--dry-run]

Example:
    python clone_en_to_language.py es
    python clone_en_to_language.py de --only home,legal

What this does, per db:
  1. Read every 'en' row (puzzle_slug, legacy_key, new_key, status, relevant,
     usage_relevant, notes, where_used_in_page) — this row SET is the
     contract. It is never regenerated from the target language's own
     content structure.
  2. DELETE FROM mapping_audit WHERE language = <lang>  (scoped by language
     only — never touches 'en' or any other language, never drops the table,
     never unlinks the db file).
  3. For each cloned row, look up Legacy_value_by_key / new_value against the
     target language's real prod source file, using the exact same
     legacy_key / new_key path. If the target language's source has no such
     field, the value is left EMPTY — never fabricated, never machine
     translated, never copied from English.
  4. INSERT the cloned+filled rows with language=<lang>.

What this deliberately does NOT do:
  - Never calls audit_home.py / audit_blog.py / audit_legal_bundle.py /
    audit_single_puzzle.py's own main()/CLI against a db that already holds
    other languages' rows — several of those scripts call db_path.unlink()
    or DELETE ... WHERE puzzle_slug = ? with no language filter, which
    destroys every language's data in that file, not just the one being
    added. This script only ever does language-scoped SQL.
  - Never invents a value for a field the target language's prod content
    doesn't have.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import sqlite3
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent / "tools"))
from migrate_legacy_schema import convert_entry
from migrate_page_schema import migrate_blog_entry, migrate_page
from i18n_technical_fields import is_i18n_required
sys.path.insert(0, str(Path(__file__).resolve().parent))
from value_repr import full_repr
from dot_guide_heading_templates import heading_for

# As of the 2026-08-14 "Reorganize mapping tools" commit, mapping_audit_*.db
# files live in a sibling DB/ folder rather than alongside this script.
DB_DIR = Path(__file__).resolve().parent.parent / "DB"

_MISSING = object()
_TOKEN_RE = re.compile(r"[^.\[\]]+|\[\d+\]")

PUZZLE_CATEGORIES = [
    "canada", "circus", "cute", "dinosaurs", "flowers", "garden",
    "ocean", "playgrounds", "space", "uae", "usa-250",
]


def find_web_root(explicit: str | None = None) -> Path:
    """Locate the production web tree without baking in a developer path."""
    candidates = [
        Path(explicit).expanduser() if explicit else None,
        Path(os.environ["DOT_TO_DOT_WEB_ROOT"]).expanduser()
        if os.environ.get("DOT_TO_DOT_WEB_ROOT") else None,
        DB_DIR.parents[2] / "dot-to-dot-web",
        DB_DIR.parent / "Ui-app-DB-json",
    ]
    for candidate in candidates:
        if candidate and (candidate / "content").is_dir():
            return candidate.resolve()
    checked = ", ".join(str(p) for p in candidates if p)
    raise FileNotFoundError(
        "Could not locate the prod web content tree. Pass --web-root or set "
        f"DOT_TO_DOT_WEB_ROOT. Checked: {checked}"
    )


def create_backup(db_dir: Path, lang: str) -> Path:
    """Back up every database before the first write, as required by rule 2."""
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    backup_dir = db_dir.parent / f"mapping-check-backup-{stamp}-{lang}"
    suffix = 1
    while backup_dir.exists():
        backup_dir = db_dir.parent / f"mapping-check-backup-{stamp}-{lang}-{suffix}"
        suffix += 1
    backup_dir.mkdir()
    for db_path in db_dir.glob("*.db"):
        shutil.copy2(db_path, backup_dir / db_path.name)
    return backup_dir


def ensure_i18n_column(conn: sqlite3.Connection) -> None:
    """Add the i18nRequired column if an older db predates it (see
    migrate_add_i18n_required.py, which backfilled every existing db)."""
    cols = [r[1] for r in conn.execute("PRAGMA table_info(mapping_audit)")]
    if "i18nRequired" not in cols:
        conn.execute("ALTER TABLE mapping_audit ADD COLUMN i18nRequired INTEGER")


def verify_language_rows(conn: sqlite3.Connection, lang: str) -> None:
    """Require the target to have the exact English contract row set."""
    columns = "puzzle_slug, legacy_key, new_key"
    en_rows = conn.execute(
        f"SELECT {columns} FROM mapping_audit WHERE language='en' ORDER BY puzzle_slug, legacy_key, new_key"
    ).fetchall()
    target_rows = conn.execute(
        f"SELECT {columns} FROM mapping_audit WHERE language=? ORDER BY puzzle_slug, legacy_key, new_key",
        (lang,),
    ).fetchall()
    if target_rows != en_rows:
        raise RuntimeError(
            f"post-run verification failed for {lang}: en={len(en_rows)} rows, "
            f"{lang}={len(target_rows)} rows or key triples differ"
        )

# lib/localized-seo.ts localizedSiteSeo() branches, as of the 2026-08 audit.
# Extend this dict ONLY after re-reading localized-seo.ts yourself and
# confirming the branch exists for the language you're adding — do not
# guess or translate. If a language has no branch here, prod falls back to
# the English literal (verified in app/[locale]/layout.tsx generateMetadata:
# `arabicSeo?.title ?? '<english literal>'`), so the clone step below leaves
# the English value in place for that language automatically — that is
# CORRECT behavior, not a gap.
LOCALIZED_HOME_SEO: dict[str, dict[str, str]] = {
    "ar": {
        "header.title": "لعبة توصيل النقاط للأطفال PDF مجانًا | أوراق توصيل الأرقام للطباعة",
        "header.og.title": "لعبة توصيل النقاط وتوصيل الأرقام — أوراق مجانية للأطفال والكبار",
        "header.meta_description": "حمّل واطبع لعبة توصيل النقاط للأطفال مجانًا بصيغة PDF: أوراق توصيل الأرقام السهلة للصغار وتحديات تفوق 100 نقطة للكبار. حيوانات وديناصورات ومركبات وموضوعات موسمية، من دون تسجيل.",
        "header.og.description": "حمّل واطبع لعبة توصيل النقاط للأطفال مجانًا بصيغة PDF: أوراق توصيل الأرقام السهلة للصغار وتحديات تفوق 100 نقطة للكبار. حيوانات وديناصورات ومركبات وموضوعات موسمية، من دون تسجيل.",
    },
    # Verbatim from lib/localized-seo.ts localizedSiteSeo().
    "de": {
        "header.title": "Von Punkt zu Punkt & Zahlen verbinden kostenlos | PDF zum Ausdrucken",
        "header.og.title": "Von Punkt zu Punkt / Zahlen verbinden – kostenlose Rätsel für Kinder & Erwachsene",
        "header.meta_description": "Von Punkt zu Punkt und Zahlen verbinden zum Ausdrucken, kostenlos als PDF: leichte Vorlagen für Kita und Grundschule bis zu Herausforderungen für Erwachsene. Tiere, Dinosaurier, Fahrzeuge und saisonale Motive. Ohne Anmeldung.",
        "header.og.description": "Von Punkt zu Punkt und Zahlen verbinden zum Ausdrucken, kostenlos als PDF: leichte Vorlagen für Kita und Grundschule bis zu Herausforderungen für Erwachsene. Tiere, Dinosaurier, Fahrzeuge und saisonale Motive. Ohne Anmeldung.",
    },
    "es": {
        "header.title": "Dibujos para unir puntos imprimibles gratis para niños | Hojas PDF",
        "header.og.title": "Dibujos y fichas de unir puntos gratis para niños",
        "header.meta_description": "Descarga e imprime fichas gratuitas de unir puntos para niños: animales, dinosaurios, vehículos y temas de temporada en PDF. Sin registro.",
        "header.og.description": "Descarga e imprime fichas gratuitas de unir puntos para niños: animales, dinosaurios, vehículos y temas de temporada en PDF. Sin registro.",
    },
    "fr": {
        "header.title": "Points à relier & relie les points gratuit | PDF à imprimer",
        "header.og.title": "Points à relier / relie les points – jeux gratuits pour enfants & adultes",
        "header.meta_description": "Points à relier et jeux de relie-les-points à imprimer, gratuits en PDF : fiches faciles pour la maternelle jusqu'à des défis pour adultes. Animaux, dinosaures, véhicules et thèmes de saison. Sans inscription.",
        "header.og.description": "Points à relier et jeux de relie-les-points à imprimer, gratuits en PDF : fiches faciles pour la maternelle jusqu'à des défis pour adultes. Animaux, dinosaures, véhicules et thèmes de saison. Sans inscription.",
    },
    "ru": {
        "header.title": "Бесплатные задания по точкам для детей | PDF для печати",
        "header.og.title": "Бесплатные рисунки по точкам и задания для детей",
        "header.meta_description": "Скачивайте и распечатывайте бесплатные задания по точкам для детей: животные, динозавры, транспорт и сезонные темы в PDF. Без регистрации.",
        "header.og.description": "Скачивайте и распечатывайте бесплатные задания по точкам для детей: животные, динозавры, транспорт и сезонные темы в PDF. Без регистрации.",
    },
    "it": {
        "header.title": "Unisci i puntini gratis | PDF da stampare per bambini",
        "header.og.title": "Unisci i puntini – puzzle gratuiti per bambini e adulti",
        "header.meta_description": "Unisci i puntini da stampare gratis in PDF: schede facili per la scuola dell'infanzia fino a sfide per adulti con oltre 100 punti. Animali, dinosauri, veicoli e temi stagionali. Senza registrazione.",
        "header.og.description": "Unisci i puntini da stampare gratis in PDF: schede facili per la scuola dell'infanzia fino a sfide per adulti con oltre 100 punti. Animali, dinosauri, veicoli e temi stagionali. Senza registrazione.",
    },
    "ja": {
        "header.title": "無料の点つなぎ（てんつなぎ）プリント | 子ども向けPDF",
        "header.og.title": "点つなぎ・数字つなぎ — 子どもから大人まで楽しめる無料プリント",
        "header.meta_description": "無料でダウンロード・印刷できるてんつなぎプリントPDF：幼児向けのやさしいプリントから、100以上の点をつなぐ大人向けの難しいプリントまで。動物、恐竜、乗り物、季節のテーマも。登録不要。",
        "header.og.description": "無料でダウンロード・印刷できるてんつなぎプリントPDF：幼児向けのやさしいプリントから、100以上の点をつなぐ大人向けの難しいプリントまで。動物、恐竜、乗り物、季節のテーマも。登録不要。",
    },
    "fi": {
        "header.title": "Pisteestä pisteeseen tulostettava lapsille — ilmaiset PDF-tehtävät",
        "header.og.title": "Pisteestä pisteeseen lapsille — ilmaisia tulostettavia tehtäviä",
        "header.meta_description": "Lataa ja tulosta ilmaisia pisteestä pisteeseen lapsille tarkoitettuja tehtäviä: eläimiä, dinosauruksia, ajoneuvoja ja vuodenaikojen teemoja PDF-muodossa. Ei rekisteröitymistä.",
        "header.og.description": "Lataa ja tulosta ilmaisia pisteestä pisteeseen lapsille tarkoitettuja tehtäviä: eläimiä, dinosauruksia, ajoneuvoja ja vuodenaikojen teemoja PDF-muodossa. Ei rekisteröitymistä.",
    },
    "nl": {
        "header.title": "Verbind de punten & van punt naar punt gratis | PDF om te printen",
        "header.og.title": "Verbind de punten / van punt naar punt – gratis puzzels voor kinderen & volwassenen",
        "header.meta_description": "Verbind de punten en van punt naar punt om te printen, gratis als PDF: makkelijke werkbladen vanaf 10 stippen voor peuters tot uitdagingen met meer dan 100 stippen voor volwassenen. Dieren, dinosaurussen, voertuigen en seizoensthema's. Geen account nodig.",
        "header.og.description": "Verbind de punten en van punt naar punt om te printen, gratis als PDF: makkelijke werkbladen vanaf 10 stippen voor peuters tot uitdagingen met meer dan 100 stippen voor volwassenen. Dieren, dinosaurussen, voertuigen en seizoensthema's. Geen account nodig.",
    },
    "pt": {
        "header.title": "Ligar os pontos grátis para crianças | Fichas PDF para imprimir",
        "header.og.title": "Ligar os pontos — fichas gratuitas para crianças e adultos",
        "header.meta_description": "Descarrega e imprime fichas grátis de ligar os pontos: animais, dinossauros, veículos e temas sazonais em PDF. Fichas fáceis para o pré-escolar e desafios com mais de 100 pontos para adultos. Sem registo.",
        "header.og.description": "Descarrega e imprime fichas grátis de ligar os pontos: animais, dinossauros, veículos e temas sazonais em PDF. Fichas fáceis para o pré-escolar e desafios com mais de 100 pontos para adultos. Sem registo.",
    },
    # way: read localizedSiteSeo(<locale>) in lib/localized-seo.ts yourself,
    # copy title/ogTitle/description verbatim, cite nothing else.
}


def compact_repr(value: Any) -> str:
    if value is _MISSING or value is None:
        return ""
    return full_repr(value)


def resolve_path(obj: Any, path: str) -> Any:
    tokens = _TOKEN_RE.findall(path)
    cur = obj
    for tok in tokens:
        if tok.startswith("["):
            idx = int(tok[1:-1])
            if not isinstance(cur, list) or idx >= len(cur):
                return _MISSING
            cur = cur[idx]
        else:
            if not isinstance(cur, dict) or tok not in cur:
                return _MISSING
            cur = cur[tok]
    return cur


def load_puzzles(path: Path) -> dict[str, dict]:
    data = json.loads(path.read_text(encoding="utf-8-sig"))
    entries = data["puzzles"] if isinstance(data, dict) and isinstance(data.get("puzzles"), list) else data
    return {e.get("slug"): e for e in entries}


def clone_db(
    db_path: Path, lang: str,
    slug_to_raw: dict[str, dict], converter, skip_legacy, dry_run: bool,
) -> None:
    if not db_path.exists():
        print(f"[{db_path.name}] SKIP - db does not exist")
        return
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    en_rows = conn.execute(
        "SELECT puzzle_slug, where_used_in_page, legacy_key, new_key, status, relevant, usage_relevant, notes, "
        "Legacy_value_by_key, new_value "
        "FROM mapping_audit WHERE language='en' ORDER BY id"
    ).fetchall()
    if not en_rows:
        print(f"[{db_path.name}] SKIP - no en rows to clone")
        conn.close()
        return

    converted_cache: dict[str, Any] = {}
    filled = blank = technical = 0
    timestamp = datetime.now(timezone.utc).isoformat()
    out_rows = []
    for r in en_rows:
        slug = r["puzzle_slug"]
        legacy_key = r["legacy_key"]
        new_key = r["new_key"]
        required = is_i18n_required(new_key)

        if not required:
            # Technical field (slug, hex code, schema.org constant, file
            # path, etc. — see i18n_technical_fields.py / rules doc §2):
            # correct value is the English value, verbatim, in every
            # language — never looked up per-language, never left blank.
            leg_val = r["Legacy_value_by_key"] or ""
            new_val = r["new_value"] or ""
            technical += 1
        else:
            leg_val = new_val = ""
            raw_entry = None if slug.endswith("-collection") else slug_to_raw.get(slug)
            if raw_entry is not None:
                if not skip_legacy(legacy_key):
                    lv = resolve_path(raw_entry, legacy_key)
                    if lv is not _MISSING:
                        leg_val = compact_repr(lv)
                if new_key != "<no mapping defined>" and not new_key.startswith(("UNUSED:", "(prod-only)")):
                    if slug not in converted_cache:
                        converted_cache[slug] = converter(raw_entry)
                    nv = resolve_path(converted_cache[slug], new_key)
                    if nv is not _MISSING:
                        new_val = compact_repr(nv)

            # body.dot_guide.heading has no legacy/prod source at all (see
            # audit_single_puzzle.py) — it's synthesized per-locale from that
            # locale's own translated name via HEADING_TEMPLATES, not cloned
            # like an ordinary field. Without this, every re-clone silently
            # blanks it out again (see POPULATE-NEW-LANGUAGE-RULES.md §3c).
            if new_key == "body.dot_guide.heading" and not new_val and raw_entry is not None:
                name_val = resolve_path(converted_cache.get(slug, {}), "body.name")
                if isinstance(name_val, str) and name_val:
                    generated = heading_for(lang, name_val)
                    if generated:
                        new_val = generated

        if leg_val or new_val:
            filled += 1
        else:
            blank += 1

        out_rows.append((
            slug, lang, r["where_used_in_page"], legacy_key, leg_val, new_key, new_val,
            r["status"], r["relevant"], r["usage_relevant"], r["notes"], timestamp,
            1 if required else 0,
        ))

    if dry_run:
        print(f"[{db_path.name}] would clone {len(en_rows)} en rows -> {lang} "
              f"({filled} filled, {blank} blank, {technical} technical/forced-to-English)")
        conn.close()
        return

    ensure_i18n_column(conn)
    conn.execute("DELETE FROM mapping_audit WHERE language=?", (lang,))
    conn.executemany(
        """INSERT INTO mapping_audit
           (puzzle_slug, language, where_used_in_page, legacy_key, Legacy_value_by_key, new_key, new_value, status, relevant, usage_relevant, notes, created_at, i18nRequired)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        out_rows,
    )
    verify_language_rows(conn, lang)
    conn.commit()
    conn.close()
    print(f"[{db_path.name}] cloned {len(en_rows)} en rows -> {lang} "
          f"({filled} filled, {blank} blank, {technical} technical/forced-to-English)")


def clone_puzzle_category(category: str, lang: str, dry_run: bool) -> None:
    src = WEB / "content" / lang / f"puzzles-{category}.json"
    db_path = DB_DIR / f"mapping_audit_{category}.db"
    if not src.exists():
        print(f"[{category}] SKIP - no prod source at {src} for language '{lang}'")
        return
    slug_to_raw = load_puzzles(src)

    def skip_legacy(legacy_key: str) -> bool:
        return legacy_key in ("<none>",) or "<no mapping defined>" in legacy_key

    clone_db(db_path, lang, slug_to_raw, convert_entry, skip_legacy, dry_run)


def clone_blog(lang: str, dry_run: bool) -> None:
    src = WEB / "content" / lang / "blog.json"
    if not src.exists():
        print(f"[blog] SKIP - no prod source at {src} for language '{lang}'")
        return
    data = json.loads(src.read_text(encoding="utf-8-sig"))
    posts = data["posts"] if isinstance(data, dict) and isinstance(data.get("posts"), list) else data
    slug_to_raw = {p.get("slug"): p for p in posts}

    def skip_legacy(legacy_key: str) -> bool:
        return legacy_key in ("<none>", "<out of scope>")

    clone_db(DB_DIR / "mapping_audit_blog_all.db", lang, slug_to_raw, migrate_blog_entry, skip_legacy, dry_run)


def clone_legal(lang: str, dry_run: bool) -> None:
    src = WEB / "content" / lang / "legal.json"
    if not src.exists():
        print(f"[legal] SKIP - no prod source at {src} for language '{lang}'")
        return
    legal = json.loads(src.read_text(encoding="utf-8-sig"))
    # db puzzle_slug is "privacy-policy"; the legal.json key is "privacy".
    slug_to_raw = {
        "about": legal.get("about"),
        "contact": legal.get("contact"),
        "terms": legal.get("terms"),
        "privacy-policy": legal.get("privacy"),
    }
    slug_to_raw = {k: v for k, v in slug_to_raw.items() if v is not None}

    def skip_legacy(legacy_key: str) -> bool:
        return legacy_key.startswith("<none>")

    def converter(raw_page: dict) -> dict:
        return migrate_page(raw_page.get("slug") or "page", raw_page)

    clone_db(DB_DIR / "mapping_audit_legal.db", lang, slug_to_raw, converter, skip_legacy, dry_run)


def clone_home(lang: str, dry_run: bool) -> None:
    src = WEB / "content" / lang / "messages.json"
    db_path = DB_DIR / "mapping_audit_home.db"
    if not src.exists():
        print(f"[home] SKIP - no prod source at {src} for language '{lang}'")
        return
    if not db_path.exists():
        print("[home] SKIP - db does not exist")
        return
    messages = json.loads(src.read_text(encoding="utf-8-sig"))
    header_overrides = LOCALIZED_HOME_SEO.get(lang, {})

    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    en_rows = conn.execute(
        "SELECT puzzle_slug, where_used_in_page, legacy_key, new_key, status, relevant, usage_relevant, notes, "
        "Legacy_value_by_key, new_value "
        "FROM mapping_audit WHERE language='en' ORDER BY id"
    ).fetchall()
    if not en_rows:
        print("[home] SKIP - no en rows to clone")
        conn.close()
        return

    timestamp = datetime.now(timezone.utc).isoformat()
    out_rows = []
    filled = blank = technical = 0
    for r in en_rows:
        legacy_key = r["legacy_key"]
        new_key = r["new_key"]
        required = is_i18n_required(new_key)
        leg_val = new_val = ""

        if not required:
            # Technical field per i18n_technical_fields.py (e.g. header.canonical,
            # header.og.site_name, header.json_ld.*.type) -- always the English
            # value, verbatim, regardless of per-locale SEO overrides below.
            leg_val, new_val = r["Legacy_value_by_key"] or "", r["new_value"] or ""
            technical += 1
        elif new_key in header_overrides:
            leg_val = new_val = header_overrides[new_key]
        elif legacy_key.startswith(("HARDCODED:", "COMPUTED:")) or legacy_key == "N/A":
            # language-independent per code inspection (no per-locale branch
            # exists for this field) -- prod uses the English literal for
            # every locale that has no LOCALIZED_HOME_SEO entry, so cloning
            # the en value unchanged is CORRECT, not a shortcut.
            leg_val, new_val = r["Legacy_value_by_key"] or "", r["new_value"] or ""
        elif legacy_key.startswith("messages.json:"):
            path = legacy_key.split(":", 1)[1]
            v = resolve_path(messages, path)
            if v is not _MISSING:
                leg_val = new_val = compact_repr(v)
        # "metadata.json:..." rows: no seo/metadata.json source exists for
        # any non-en locale in this repo; leave blank (these rows are
        # themselves informational/NOT-READ-BY-PROD cross-checks in en too).

        if leg_val or new_val:
            filled += 1
        else:
            blank += 1

        out_rows.append((
            "home", lang, r["where_used_in_page"], legacy_key, leg_val, new_key, new_val,
            r["status"], r["relevant"], r["usage_relevant"], r["notes"], timestamp,
            1 if required else 0,
        ))

    if dry_run:
        print(f"[home] would clone {len(en_rows)} en rows -> {lang} "
              f"({filled} filled, {blank} blank, {technical} technical/forced-to-English)")
        conn.close()
        return

    ensure_i18n_column(conn)
    conn.execute("DELETE FROM mapping_audit WHERE language=?", (lang,))
    conn.executemany(
        """INSERT INTO mapping_audit
           (puzzle_slug, language, where_used_in_page, legacy_key, Legacy_value_by_key, new_key, new_value, status, relevant, usage_relevant, notes, created_at, i18nRequired)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        out_rows,
    )
    verify_language_rows(conn, lang)
    conn.commit()
    conn.close()
    print(f"[home] cloned {len(en_rows)} en rows -> {lang} "
          f"({filled} filled, {blank} blank, {technical} technical/forced-to-English)")
    if lang not in LOCALIZED_HOME_SEO:
        print(f"[home] NOTE: no LOCALIZED_HOME_SEO entry for '{lang}' -- header.title/og.title/"
              f"meta_description/og.description were cloned from English UNCHANGED. Verify against "
              f"lib/localized-seo.ts localizedSiteSeo('{lang}') before treating that as final: if a "
              f"branch exists there, add it to LOCALIZED_HOME_SEO and re-run.")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("language", help="Target language code, e.g. es, de, fr")
    parser.add_argument("--only", help="Comma-separated subset: puzzle category names, 'blog', 'legal', 'home'")
    parser.add_argument("--dry-run", action="store_true", help="Print counts without writing anything")
    parser.add_argument("--web-root", help="Prod web root containing content/<language> (or set DOT_TO_DOT_WEB_ROOT)")
    args = parser.parse_args()

    if args.language == "en":
        parser.error("target language must not be 'en'")
    valid = set(PUZZLE_CATEGORIES) | {"blog", "legal", "home"}
    only = {item.strip() for item in args.only.split(",") if item.strip()} if args.only else None
    unknown = (only or set()) - valid
    if unknown:
        parser.error(f"unknown --only value(s): {', '.join(sorted(unknown))}")

    global WEB
    try:
        WEB = find_web_root(args.web_root)
    except FileNotFoundError as exc:
        parser.error(str(exc))
    print(f"[source] {WEB}")
    if not args.dry_run:
        backup_dir = create_backup(DB_DIR, args.language)
        print(f"[backup] {backup_dir}")

    for category in PUZZLE_CATEGORIES:
        if only is None or category in only:
            clone_puzzle_category(category, args.language, args.dry_run)
    if only is None or "blog" in only:
        clone_blog(args.language, args.dry_run)
    if only is None or "legal" in only:
        clone_legal(args.language, args.dry_run)
    if only is None or "home" in only:
        clone_home(args.language, args.dry_run)

    return 0


if __name__ == "__main__":
    sys.exit(main())
