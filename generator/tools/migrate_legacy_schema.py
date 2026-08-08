#!/usr/bin/env python3
"""
Migrates legacy flat-schema puzzle content files (puzzles-*.json) to the
header/body schema used by the Dot-to-Dot CMS (see
generator/dot2dot-form-angular8/src/app/models/puzzle-entry.model.ts).

Key mapping mirrors PuzzleFormComponent.normalizeEntry() in
puzzle-form.component.ts exactly, so files converted here import cleanly
into the CMS form.

Legacy key          -> New location
---------------------------------------------------------------
slug                -> slug
seoTitle             -> header.title, header.og.title
seoDescription        -> header.meta_description, header.og.description,
                         header.json_ld.description
seoImageAlt           -> header.og.image_alt
name                  -> header.json_ld.name, body.name
seoH1                -> body.h1
tagline               -> body.tagline
description            -> body.description
funFact               -> body.fun_fact
dotGuide.intro        -> body.dot_guide.intro
dotGuide.sections      -> body.dot_guide.sections (keys unchanged)
dotGuide.outro        -> body.dot_guide.outro
dotGuide.colorSchemes  -> body.dot_guide.color_schemes (keys unchanged)

header.json_ld.type, .image, .educational_use, .age_range have no legacy
source field; type/educational_use get the same defaults the CMS form
uses, image is left blank, and age_range is best-effort extracted from
seoDescription (e.g. "ages 5-9") when present.

Usage:
    python migrate_legacy_schema.py <content_dir> [<content_dir> ...] [options]

Examples:
    # Convert every puzzles-*.json in content/en, writing to content/en/converted/
    python migrate_legacy_schema.py ../../content/en

    # Convert content for several languages in one go
    python migrate_legacy_schema.py ../../content/en ../../content/fr ../../content/de

    # Overwrite the source files in place
    python migrate_legacy_schema.py ../../content/en --in-place

    # Preview what would change without writing anything
    python migrate_legacy_schema.py ../../content/en --dry-run
"""

import argparse
import json
import re
import sys
from pathlib import Path

DEFAULT_JSON_LD_TYPE = "CreativeWork"
DEFAULT_EDUCATIONAL_USE = "Fine motor skills, number sequencing"

AGE_RANGE_RE = re.compile(r"\bages?\s+(\d+)\s*(?:-|–|—|to)\s*(\d+)\b", re.IGNORECASE)


def guess_age_range(seo_description: str) -> str:
    """Best-effort extraction of an age range like 'ages 5-9' from free text."""
    if not seo_description:
        return ""
    match = AGE_RANGE_RE.search(seo_description)
    if not match:
        return ""
    return f"{match.group(1)}-{match.group(2)}"


def convert_section(section: dict) -> dict:
    return {
        "range": section.get("range", ""),
        "title": section.get("title", ""),
        "learn": section.get("learn", ""),
        "fact": section.get("fact", ""),
    }


def convert_mapping(mapping: dict) -> dict:
    return {
        "range": mapping.get("range", ""),
        "part": mapping.get("part", ""),
        "color": mapping.get("color", ""),
        "hex": mapping.get("hex", ""),
        "why": mapping.get("why", ""),
    }


def convert_color_scheme(scheme: dict) -> dict:
    return {
        "name": scheme.get("name", ""),
        "note": scheme.get("note", ""),
        "mapping": [convert_mapping(m) for m in scheme.get("mapping", [])],
    }


def convert_entry(raw: dict) -> dict:
    if not isinstance(raw, dict):
        raise ValueError("each puzzle entry must be a JSON object")

    # Already in the new schema (has header + body) — pass through unchanged.
    if "header" in raw and "body" in raw:
        return raw

    dot_guide = raw.get("dotGuide", {})
    seo_description = raw.get("seoDescription", "")
    seo_title = raw.get("seoTitle", "")

    return {
        "slug": raw.get("slug", ""),
        "header": {
            "title": seo_title,
            "meta_description": seo_description,
            "og": {
                "title": seo_title,
                "description": seo_description,
                "image_alt": raw.get("seoImageAlt", ""),
            },
            "json_ld": {
                "type": DEFAULT_JSON_LD_TYPE,
                "name": raw.get("name", ""),
                "description": seo_description,
                "image": "",
                "educational_use": DEFAULT_EDUCATIONAL_USE,
                "age_range": guess_age_range(seo_description),
            },
        },
        "body": {
            "h1": raw.get("seoH1", ""),
            "name": raw.get("name", ""),
            "tagline": raw.get("tagline", ""),
            "description": raw.get("description", ""),
            "fun_fact": raw.get("funFact", ""),
            "dot_guide": {
                "intro": dot_guide.get("intro", ""),
                "sections": [convert_section(s) for s in dot_guide.get("sections", [])],
                "outro": dot_guide.get("outro", ""),
                "color_schemes": [
                    convert_color_scheme(cs) for cs in dot_guide.get("colorSchemes", [])
                ],
            },
        },
    }


def convert_file(src: Path, dest: Path, dry_run: bool) -> int:
    with src.open("r", encoding="utf-8") as f:
        data = json.load(f)

    if not isinstance(data, (list, dict)):
        raise ValueError("top-level JSON must be an object or array")
    entries = data if isinstance(data, list) else [data]
    converted = [convert_entry(entry) for entry in entries]
    output = converted if isinstance(data, list) else converted[0]

    if dry_run:
        return len(entries)

    dest.parent.mkdir(parents=True, exist_ok=True)
    temporary = dest.with_suffix(dest.suffix + ".tmp")
    with temporary.open("w", encoding="utf-8", newline="\n") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
        f.write("\n")
    temporary.replace(dest)

    return len(entries)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("content_dirs", nargs="+", type=Path, help="One or more content directories (e.g. content/en, content/fr) to convert")
    parser.add_argument("--pattern", default="puzzles-*.json", help="Filename glob to match within each content dir (default: puzzles-*.json)")
    parser.add_argument("--out", type=Path, default=None, help="Output directory. Default: <content_dir>/converted/. Ignored if --in-place is set.")
    parser.add_argument("--in-place", action="store_true", help="Overwrite the source files instead of writing to a separate output directory")
    parser.add_argument("--dry-run", action="store_true", help="Report what would be converted without writing any files")
    args = parser.parse_args()

    content_dirs = []
    for candidate in args.content_dirs:
        if candidate.is_dir() and not any(candidate.glob(args.pattern)):
            language_dirs = sorted(
                child for child in candidate.iterdir()
                if child.is_dir() and any(child.glob(args.pattern))
            )
            content_dirs.extend(language_dirs or [candidate])
        else:
            content_dirs.append(candidate)

    total_files = 0
    total_entries = 0
    failures = 0

    for content_dir in content_dirs:
        if not content_dir.is_dir():
            print(f"Skipping {content_dir} — not a directory", file=sys.stderr)
            failures += 1
            continue

        files = sorted(content_dir.glob(args.pattern))
        if not files:
            print(f"No files matching '{args.pattern}' in {content_dir}")
            continue

        out_dir = content_dir if args.in_place else (args.out or (content_dir / "converted"))

        for src in files:
            dest = src if args.in_place else (out_dir / src.name)
            try:
                count = convert_file(src, dest, args.dry_run)
            except (json.JSONDecodeError, OSError, TypeError, ValueError) as exc:
                print(f"FAILED {src}: {exc}", file=sys.stderr)
                failures += 1
                continue

            action = "Would convert" if args.dry_run else "Converted"
            print(f"{action} {src} -> {dest} ({count} entr{'y' if count == 1 else 'ies'})")
            total_files += 1
            total_entries += count

    print(f"\nDone. {total_files} file(s), {total_entries} entr{'y' if total_entries == 1 else 'ies'} processed.")
    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
