#!/usr/bin/env python3
"""Wrap puzzle arrays in collection documents without inventing translations."""

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from migration_safety import check_count, require_clean_git_tree  # noqa: E402


CATEGORY_NAMES = {
    "canada": "Canada",
    "circus": "Circus",
    "cute": "Cute",
    "dinosaurs": "Dinosaur",
    "flowers": "Flower",
    "garden": "Garden",
    "ocean": "Ocean",
    "playgrounds": "Playground",
    "space": "Space",
    "uae": "UAE",
    "usa-250": "USA 250",
}

COLLECTION_NAMES = {
    "canada": "Canada",
    "circus": "Circus",
    "cute": "Cute Puzzles",
    "dinosaurs": "Dinosaurs",
    "flowers": "Flowers",
    "garden": "Garden",
    "ocean": "Ocean",
    "playgrounds": "Playgrounds",
    "space": "Space",
    "uae": "UAE",
    "usa-250": "USA 250",
}


def english_copy(slug: str) -> dict[str, str]:
    singular = CATEGORY_NAMES.get(slug, slug.replace("-", " ").title())
    plural = COLLECTION_NAMES.get(slug, singular)
    return {
        "title": f"Free {singular} Dot to Dot Puzzles to Print",
        "meta": f"Explore free printable {singular.lower()} dot to dot puzzles for kids, with engaging activities that build counting confidence and pencil control.",
        "name": plural,
        "tagline": f"Connect the dots and discover {singular.lower()} surprises.",
        "description": f"Choose a free printable {singular.lower()} dot to dot puzzle and follow the numbered path to reveal the picture. This collection offers engaging practice with counting, concentration, pencil control, and number sequencing.",
    }


def collection_for(locale: str, slug: str) -> dict:
    image = f"/images/{slug}/{slug}-dot-to-dot-collection.webp"
    if locale == "en":
        copy = english_copy(slug)
        title = copy["title"]
        meta = copy["meta"]
        name = copy["name"]
        tagline = copy["tagline"]
        description = copy["description"]
        h1 = title
        og_description = f"Browse free printable {CATEGORY_NAMES.get(slug, slug).lower()} connect-the-dot puzzles for children."
    else:
        title = meta = name = tagline = description = h1 = og_description = ""

    return {
        "header": {
            "title": title,
            "meta_description": meta,
            "og": {"title": title, "description": og_description, "image": image},
            "json_ld": {
                "type": "CollectionPage",
                "name": name,
                "description": description,
                "image": image,
                "main_entity": {"type": "ItemList", "item_source": "puzzles"},
            },
            "breadcrumb_json_ld": {
                "type": "BreadcrumbList",
                "items": [
                    {"position": 1, "name": "Home" if locale == "en" else "", "path": "/"},
                    {"position": 2, "name": name, "path": f"/{slug}/"},
                ],
            },
        },
        "body": {
            "h1": h1,
            "name": name,
            "tagline": tagline,
            "description": description,
            "hero_image": image,
            "slug": slug,
        },
    }


def wrap_file(path: Path, apply: bool) -> tuple[str, int]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(data, dict) and isinstance(data.get("puzzles"), list):
        return "unchanged", len(data["puzzles"])
    if not isinstance(data, list):
        raise ValueError("top-level JSON must be a puzzle array or collection document")

    slug = path.stem.removeprefix("puzzles-")
    document = {"collection": collection_for(path.parent.name, slug), "puzzles": data}
    check_count(len(data), len(document["puzzles"]), str(path))
    if document["puzzles"] != data:
        print(f"WARNING: {path} puzzle array was altered while wrapping (should be untouched)")
    if apply:
        temporary = path.with_suffix(path.suffix + ".tmp")
        with temporary.open("w", encoding="utf-8", newline="\n") as output:
            json.dump(document, output, ensure_ascii=False, indent=2)
            output.write("\n")
        temporary.replace(path)
    return "wrapped", len(data)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("content_root", type=Path)
    parser.add_argument("--apply", action="store_true", help="write changes; otherwise preview only")
    parser.add_argument("--force", action="store_true", help="skip the clean-git-tree safety check")
    args = parser.parse_args()
    if args.apply:
        require_clean_git_tree([args.content_root], force=args.force)
    files = sorted(args.content_root.glob("*/puzzles-*.json"))
    wrapped = unchanged = puzzles = failures = 0
    for path in files:
        try:
            action, count = wrap_file(path, args.apply)
            wrapped += action == "wrapped"
            unchanged += action == "unchanged"
            puzzles += count
        except (OSError, ValueError, json.JSONDecodeError) as error:
            failures += 1
            print(f"FAILED {path}: {error}", file=sys.stderr)
    verb = "Wrapped" if args.apply else "Would wrap"
    print(f"{verb} {wrapped} files; {unchanged} already wrapped; {puzzles} puzzles; {failures} failures")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
