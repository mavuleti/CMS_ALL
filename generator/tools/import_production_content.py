#!/usr/bin/env python3
"""Read production content and write converted collection documents locally."""

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

from migrate_legacy_schema import convert_entry


PUZZLE_FACT_RE = re.compile(
    r"slug:\s*['\"](?P<slug>[^'\"]+)['\"][\s\S]{0,300}?"
    r"age:\s*['\"](?P<age>[^'\"]+)['\"][\s\S]{0,100}?dots:\s*(?P<dots>\d+)"
)


def load_puzzle_facts(source_root: Path) -> dict[str, dict]:
    """Read the same age/dot facts used by production puzzle page fallbacks."""
    facts = {}
    for source in (source_root / "lib").glob("*-data.ts"):
        for match in PUZZLE_FACT_RE.finditer(source.read_text(encoding="utf-8")):
            facts[match.group("slug")] = {"age": match.group("age"), "dots": int(match.group("dots"))}
    return facts


def interpolate(template: str, values: dict) -> str:
    result = template
    for key, value in values.items():
        result = result.replace("{" + key + "}", str(value))
    return result


def localized_age(messages: dict, raw_age: str) -> str:
    match = re.search(r"(\d+)\s*[-–]\s*(\d+)", raw_age or "")
    if not match:
        return raw_age
    template = messages.get("common", {}).get("ageRange", "{min}-{max}")
    return interpolate(template, {"min": match.group(1), "max": match.group(2)})


def effective_collection_faqs(faq_data: dict, messages: dict, slug: str) -> list[dict]:
    rich = faq_data.get("categories", {}).get(slug, {}).get("faqs")
    if rich:
        return rich
    fallback = messages["faq"]
    return [{"q": fallback[f"q{i}"], "a": fallback[f"a{i}"]} for i in (1, 2, 3, 5)]


def effective_puzzle_faqs(
    faq_data: dict, messages: dict, category: str, raw_puzzle: dict, puzzle_facts: dict
) -> list[dict]:
    slug = raw_puzzle.get("slug", "")
    rich = faq_data.get("puzzles", {}).get(f"{category}/{slug}", {}).get("faqs")
    if rich:
        return rich
    facts = puzzle_facts.get(slug)
    if not facts:
        raise ValueError(f"missing production age/dot facts for FAQ fallback: {category}/{slug}")
    values = {
        "name": raw_puzzle.get("name", ""),
        "age": localized_age(messages, facts["age"]),
        "dots": facts["dots"],
    }
    detail = messages["puzzleDetail"]
    return [
        {"q": interpolate(detail[f"faqQ{i}"], values), "a": interpolate(detail[f"faqA{i}"], values)}
        for i in (1, 2, 3)
    ]


def validate_faqs(faqs: list[dict], context: str) -> None:
    if not faqs:
        raise ValueError(f"{context} has no FAQs")
    if any(not isinstance(item, dict) or not str(item.get("q", "")).strip() or not str(item.get("a", "")).strip() for item in faqs):
        raise ValueError(f"{context} has an invalid FAQ question/answer")


def collection_document(metadata: dict, slug: str, puzzles: list[dict], faqs: list[dict]) -> dict:
    image = metadata["image"]
    name = metadata["name"]
    description = metadata["description"]
    return {
        "collection": {
            "header": {
                "title": metadata["title"],
                "meta_description": metadata["meta_description"],
                "og": {"title": metadata["og_title"], "description": metadata["og_description"], "image": image},
                "json_ld": {
                    "type": "CollectionPage", "name": name, "description": description, "image": image,
                    "main_entity": {"type": "ItemList", "item_source": "puzzles"},
                },
                "breadcrumb_json_ld": {
                    "type": "BreadcrumbList",
                    "items": [
                        {"position": 1, "name": "Home", "path": "/"},
                        {"position": 2, "name": metadata["breadcrumb_name"], "path": f"/{slug}/"},
                    ],
                },
            },
            "body": {
                "h1": metadata["h1"], "name": name, "tagline": metadata["tagline"],
                "description": description, "hero_image": image, "slug": slug,
                "faqs": faqs,
            },
        },
        "puzzles": puzzles,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source_root", type=Path, help="read-only production repository root")
    parser.add_argument("destination_content", type=Path, help="local content directory to update")
    parser.add_argument("--apply", action="store_true", help="write local files; otherwise preview")
    args = parser.parse_args()
    source_content = args.source_root / "content"
    extractor = Path(__file__).with_name("extract_production_collections.cjs")
    result = subprocess.run(
        ["node", str(extractor), str(args.source_root)], check=True, capture_output=True, text=True, encoding="utf-8"
    )
    metadata = json.loads(result.stdout)
    puzzle_facts = load_puzzle_facts(args.source_root)
    converted_files = converted_puzzles = failures = 0
    imported_destinations = set()
    for source in sorted(source_content.glob("*/puzzles-*.json")):
        locale = source.parent.name
        slug = source.stem.removeprefix("puzzles-")
        try:
            raw = json.loads(source.read_text(encoding="utf-8"))
            if not isinstance(raw, list):
                raise ValueError("production puzzle file must contain an array")
            faq_data = json.loads((source.parent / "faqs.json").read_text(encoding="utf-8"))
            messages = json.loads((source.parent / "messages.json").read_text(encoding="utf-8"))
            puzzles = []
            for entry in raw:
                converted = convert_entry(entry)
                puzzle_faqs = effective_puzzle_faqs(faq_data, messages, slug, entry, puzzle_facts)
                validate_faqs(puzzle_faqs, f"{locale}/{slug}/{entry.get('slug', '')}")
                converted["body"]["faqs"] = puzzle_faqs
                puzzles.append(converted)
            collection_faqs = effective_collection_faqs(faq_data, messages, slug)
            validate_faqs(collection_faqs, f"{locale}/{slug} collection")
            document = collection_document(metadata[locale][slug], slug, puzzles, collection_faqs)
            destination = args.destination_content / locale / source.name
            imported_destinations.add(destination.resolve())
            if args.apply:
                destination.parent.mkdir(parents=True, exist_ok=True)
                temporary = destination.with_suffix(destination.suffix + ".tmp")
                with temporary.open("w", encoding="utf-8", newline="\n") as output:
                    json.dump(document, output, ensure_ascii=False, indent=2)
                    output.write("\n")
                temporary.replace(destination)
            converted_files += 1
            converted_puzzles += len(puzzles)
        except (KeyError, OSError, TypeError, ValueError, json.JSONDecodeError) as error:
            failures += 1
            print(f"FAILED {source}: {error}", file=sys.stderr)

    # Preserve and enrich destination-only collection files. This matters when a
    # production puzzle file is temporarily absent/deleted but its locale FAQ
    # and message sources still exist; importing must not silently drop FAQs or
    # delete previously imported puzzles.
    for destination in sorted(args.destination_content.glob("*/puzzles-*.json")):
        if destination.resolve() in imported_destinations:
            continue
        locale = destination.parent.name
        slug = destination.stem.removeprefix("puzzles-")
        try:
            document = json.loads(destination.read_text(encoding="utf-8"))
            if not isinstance(document, dict) or not isinstance(document.get("puzzles"), list):
                continue
            source_locale = source_content / locale
            faq_data = json.loads((source_locale / "faqs.json").read_text(encoding="utf-8"))
            messages = json.loads((source_locale / "messages.json").read_text(encoding="utf-8"))
            collection_faqs = effective_collection_faqs(faq_data, messages, slug)
            validate_faqs(collection_faqs, f"{locale}/{slug} collection")
            document["collection"]["body"]["faqs"] = collection_faqs
            for puzzle in document["puzzles"]:
                raw_puzzle = {"slug": puzzle.get("slug", ""), "name": puzzle.get("body", {}).get("name", "")}
                faqs = effective_puzzle_faqs(faq_data, messages, slug, raw_puzzle, puzzle_facts)
                validate_faqs(faqs, f"{locale}/{slug}/{raw_puzzle['slug']}")
                puzzle.setdefault("body", {})["faqs"] = faqs
            if args.apply:
                temporary = destination.with_suffix(destination.suffix + ".tmp")
                with temporary.open("w", encoding="utf-8", newline="\n") as output:
                    json.dump(document, output, ensure_ascii=False, indent=2)
                    output.write("\n")
                temporary.replace(destination)
            converted_files += 1
            converted_puzzles += len(document["puzzles"])
        except (KeyError, OSError, TypeError, ValueError, json.JSONDecodeError) as error:
            failures += 1
            print(f"FAILED destination-only {destination}: {error}", file=sys.stderr)
    action = "Imported" if args.apply else "Would import"
    print(f"{action} {converted_files} files and {converted_puzzles} puzzles; {failures} failures")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
