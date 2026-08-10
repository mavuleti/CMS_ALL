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
import filecmp
import json
import shutil
import sys
from pathlib import Path

CATEGORY_PREFIX = "puzzles-"
PAGE_FILES = ("about.json", "contact.json", "privacy-policy.json", "terms.json")
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
    "az", "fa",
]


def category_key(path: Path) -> str:
    return path.stem[len(CATEGORY_PREFIX):]


def find_language_dirs(content_root: Path):
    for lang in ENABLED_LOCALES:
        entry = content_root / lang
        if entry.is_dir() and any(entry.glob(f"{CATEGORY_PREFIX}*.json")):
            yield entry


def load_category(path: Path):
    with path.open("r", encoding="utf-8") as f:
        data = json.load(f)
    if isinstance(data, list):
        return None, data
    if isinstance(data, dict) and isinstance(data.get("puzzles"), list):
        collection = data.get("collection")
        if collection is not None and not isinstance(collection, dict):
            raise ValueError(f"{path}: collection must be an object")
        return collection, data["puzzles"]
    if isinstance(data, dict):
        return None, [data]
    raise ValueError(f"{path}: expected an array, puzzle object, or collection document")


def load_entries(path: Path):
    """Compatibility helper returning only puzzle entries."""
    return load_category(path)[1]


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
                body = entry.get("body") if isinstance(entry.get("body"), dict) else {}
                names[slug] = body.get("name") or entry.get("name") or slug
    return names


def check_sync(content_root: Path, assets_dir: Path) -> int:
    """Fail loudly (no writes) if the CMS's assets/content copy has drifted from
    content/ — this is the copy PuzzleMenuComponent actually fetches at runtime,
    so drift here silently shows up in the CMS as "missing" data even though the
    source content/ files are perfectly fine."""
    mismatches: list[str] = []
    source_files: set[Path] = set()
    for lang_dir in find_language_dirs(content_root):
        lang = lang_dir.name
        candidates = list(lang_dir.glob(f"{CATEGORY_PREFIX}*.json"))
        candidates += [lang_dir / name for name in PAGE_FILES if (lang_dir / name).exists()]
        blog_path = lang_dir / "blog.json"
        if blog_path.exists():
            candidates.append(blog_path)
        for src in candidates:
            rel = Path(lang) / src.name
            source_files.add(rel)
            dest = assets_dir / rel
            if not dest.exists():
                mismatches.append(f"MISSING in assets: {rel}")
            elif not filecmp.cmp(src, dest, shallow=False):
                mismatches.append(f"STALE in assets (differs from content/): {rel}")

    if assets_dir.is_dir():
        for existing in assets_dir.glob("*/*.json"):
            rel = existing.relative_to(assets_dir)
            if rel not in source_files:
                mismatches.append(f"ORPHAN in assets (no matching content/ file): {rel}")

    if mismatches:
        print(f"OUT OF SYNC: {len(mismatches)} issue(s) between {content_root} and {assets_dir}:")
        for line in mismatches:
            print(f"    - {line}")
        print("\nRun `npm run assets:menu` (or this script without --check) to resync.")
        return 1
    print(f"OK: {assets_dir} is in sync with {content_root}.")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("content_root", type=Path, help="Directory containing one subfolder per language (e.g. content/)")
    parser.add_argument("assets_dir", type=Path, help="Target assets/content directory inside the Angular app (e.g. src/assets/content)")
    parser.add_argument("--check", action="store_true", help="Verify assets_dir matches content_root without writing anything; exits non-zero on drift.")
    args = parser.parse_args()

    if not args.content_root.is_dir():
        print(f"{args.content_root} is not a directory", file=sys.stderr)
        return 1

    if args.check:
        return check_sync(args.content_root, args.assets_dir)

    english_names = build_english_names(args.content_root)

    content = {}
    collections = {}
    pages = {}
    if args.assets_dir.exists():
        shutil.rmtree(args.assets_dir)
    args.assets_dir.mkdir(parents=True, exist_ok=True)

    for lang_dir in find_language_dirs(args.content_root):
        lang = lang_dir.name
        content[lang] = {}
        collections[lang] = {}
        pages[lang] = {"pages": [], "blog": []}
        out_lang_dir = args.assets_dir / lang
        out_lang_dir.mkdir(parents=True, exist_ok=True)

        for path in sorted(lang_dir.glob(f"{CATEGORY_PREFIX}*.json")):
            cat = category_key(path)
            collection, entries = load_category(path)

            if collection is not None:
                collections[lang][cat] = collection

            content[lang][cat] = [
                {
                    "slug": entry.get("slug", ""),
                    "name": english_names.get(
                        entry.get("slug", ""),
                        (entry.get("body") or {}).get("name") or entry.get("name", entry.get("slug", "")),
                    ),
                }
                for entry in entries
                if entry.get("slug")
            ]

            shutil.copyfile(path, out_lang_dir / path.name)

        for filename in PAGE_FILES:
            path = lang_dir / filename
            if not path.exists():
                continue
            document = json.loads(path.read_text(encoding="utf-8-sig"))
            pages[lang]["pages"].append({
                "slug": document.get("slug", path.stem),
                "name": (document.get("body") or {}).get("h1") or (document.get("header") or {}).get("title") or path.stem,
                "file": filename,
            })
            shutil.copyfile(path, out_lang_dir / filename)

        blog_path = lang_dir / "blog.json"
        if blog_path.exists():
            posts = json.loads(blog_path.read_text(encoding="utf-8-sig"))
            pages[lang]["blog"] = [
                {"slug": post.get("slug", ""), "name": (post.get("body") or {}).get("h1") or (post.get("header") or {}).get("title") or post.get("slug", ""), "file": "blog.json"}
                for post in posts if post.get("slug")
            ]
            shutil.copyfile(blog_path, out_lang_dir / "blog.json")

        print(f"{lang}: {len(content[lang])} categories, {sum(len(v) for v in content[lang].values())} puzzles")

    manifest = {
        "languages": [
            {"code": code, "label": LANGUAGE_NAMES.get(code, code)}
            for code in content
        ],
        "content": content,
        "collections": collections,
        "pages": pages,
    }

    manifest_path = args.assets_dir / "manifest.json"
    with manifest_path.open("w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"\nWrote {manifest_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
