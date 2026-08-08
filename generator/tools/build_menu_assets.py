#!/usr/bin/env python3
"""
Build-prep step for the CMS sidebar menu.

Copies each language's puzzles-*.json content files into the Angular
app's assets/ folder (so they can be fetched at runtime), and generates
a manifest.json that the sidebar uses to build its category/puzzle tree
without having to fetch every category file up front.

Menu labels are ALWAYS English: the manifest resolves every puzzle's
display name from the English ("en") content, even when listing that
puzzle under another language, per the sidebar spec (the language only
changes which JSON gets loaded on click, never the menu text).

The category list for a given language is derived from whichever
puzzles-*.json files actually exist for that language — languages don't
have to have matching category sets (e.g. if "ar" has no
puzzles-space.json, "space" simply won't appear in the tree when Arabic
is selected).

Usage:
    python build_menu_assets.py <content_root> <angular_assets_dir>

Example:
    python build_menu_assets.py ../../content ../dot2dot-form-angular8/src/assets/content
"""

import argparse
import json
import shutil
import sys
from pathlib import Path

CATEGORY_PREFIX = "puzzles-"
LABEL_LANG = "en"
LANGUAGE_NAMES = {
    "en": "English", "fr": "Français", "es": "Español", "de": "Deutsch",
    "pt": "Português", "it": "Italiano", "nl": "Nederlands", "sv": "Svenska",
    "no": "Norsk", "pl": "Polski", "da": "Dansk", "fi": "Suomi",
    "cs": "Čeština", "hu": "Magyar", "ro": "Română", "tr": "Türkçe",
    "pt-BR": "Português (Brasil)", "el": "Ελληνικά", "ar": "العربية",
    "uk": "Українська", "hr": "Hrvatski", "sk": "Slovenčina",
    "lt": "Lietuvių", "lv": "Latviešu", "sl": "Slovenščina",
    "id": "Bahasa Indonesia", "ja": "日本語", "ko": "한국어",
    "ru": "Русский", "th": "ไทย", "vi": "Tiếng Việt",
    "az": "Azərbaycanca", "fa": "فارسی",
}
ENABLED_LOCALES = [
    "en", "fr", "es", "de", "pt", "it", "nl", "sv", "no", "pl",
    "da", "fi", "cs", "hu", "ro", "tr", "pt-BR", "el", "ar", "uk",
    "hr", "sk", "lt", "lv", "sl", "id", "ja", "ko", "ru", "th", "vi",
]


def category_key(path: Path) -> str:
    return path.stem[len(CATEGORY_PREFIX):]


def find_language_dirs(content_root: Path):
    for lang in ENABLED_LOCALES:
        entry = content_root / lang
        if entry.is_dir() and any(entry.glob(f"{CATEGORY_PREFIX}*.json")):
            yield entry


def load_entries(path: Path):
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f)
    return data if isinstance(data, list) else [data]


def build_english_names(content_root: Path) -> dict:
    """slug -> English display name, sourced from content/en/puzzles-*.json."""
    names = {}
    en_dir = content_root / LABEL_LANG
    if not en_dir.is_dir():
        return names
    for path in sorted(en_dir.glob(f"{CATEGORY_PREFIX}*.json")):
        for entry in load_entries(path):
            slug = entry.get("slug")
            if slug:
                names[slug] = entry.get("name", slug)
    return names


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("content_root", type=Path, help="Directory containing one subfolder per language (e.g. content/)")
    parser.add_argument("assets_dir", type=Path, help="Target assets/content directory inside the Angular app (e.g. src/assets/content)")
    args = parser.parse_args()

    if not args.content_root.is_dir():
        print(f"{args.content_root} is not a directory", file=sys.stderr)
        return 1

    english_names = build_english_names(args.content_root)

    content = {}
    if args.assets_dir.exists():
        shutil.rmtree(args.assets_dir)
    args.assets_dir.mkdir(parents=True, exist_ok=True)

    for lang_dir in find_language_dirs(args.content_root):
        lang = lang_dir.name
        content[lang] = {}
        out_lang_dir = args.assets_dir / lang
        out_lang_dir.mkdir(parents=True, exist_ok=True)

        for path in sorted(lang_dir.glob(f"{CATEGORY_PREFIX}*.json")):
            cat = category_key(path)
            entries = load_entries(path)

            content[lang][cat] = [
                {
                    "slug": entry.get("slug", ""),
                    "name": english_names.get(entry.get("slug", ""), entry.get("name", entry.get("slug", ""))),
                }
                for entry in entries
                if entry.get("slug")
            ]

            shutil.copyfile(path, out_lang_dir / path.name)

        print(f"{lang}: {len(content[lang])} categories, {sum(len(v) for v in content[lang].values())} puzzles")

    manifest = {
        "languages": [
            {"code": code, "label": LANGUAGE_NAMES.get(code, code)}
            for code in content
        ],
        "content": content,
    }

    manifest_path = args.assets_dir / "manifest.json"
    with manifest_path.open("w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"\nWrote {manifest_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
