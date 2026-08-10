"""Build the CMS keyword-research asset and pool local English searches into en."""
from __future__ import annotations

import json
import shutil
import sys
from pathlib import Path


def phrases(value):
    if isinstance(value, str):
        yield value
    elif isinstance(value, list):
        for item in value:
            yield from phrases(item)
    elif isinstance(value, dict):
        if isinstance(value.get("phrase"), str):
            yield value["phrase"]
        else:
            for item in value.values():
                yield from phrases(item)


def english_fields(value):
    if not isinstance(value, dict):
        return
    for key, item in value.items():
        normalized = key.lower()
        if ("english_phrase" in normalized or "english_search" in normalized) and "note" not in normalized:
            yield from phrases(item)
        elif isinstance(item, (dict, list)):
            yield from english_fields(item)


def main():
    source = Path(sys.argv[1])
    targets = [Path(item) for item in sys.argv[2:]]
    if source.is_dir():
        files = sorted(source.glob("*.json"))
        for target in targets:
            target.mkdir(parents=True, exist_ok=True)
            for item in files:
                shutil.copyfile(item, target / item.name)
            (target / "manifest.json").write_text(
                json.dumps({"locales": [item.stem for item in files]}, ensure_ascii=False, indent=2) + "\n",
                encoding="utf-8",
            )
            print(f"Built {target} with {len(files)} locale research files.")
        return
    data = json.loads(source.read_text(encoding="utf-8-sig"))
    pooled = []
    seen = set()
    for locale, research in data.items():
        if locale.startswith("_") or locale == "en":
            continue
        for phrase in english_fields(research):
            clean = " ".join(phrase.split())
            key = clean.casefold()
            if clean and key not in seen:
                seen.add(key)
                pooled.append({"phrase": clean, "source_locale": locale})
    english = data.setdefault("en", {}).setdefault("answer", {})
    native_english = {p.casefold() for p in phrases(english)}
    english["pooled_english_phrases"] = [item for item in pooled if item["phrase"].casefold() not in native_english]
    output = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    for target in targets:
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(output, encoding="utf-8")
        print(f"Built {target} with {len(english['pooled_english_phrases'])} pooled English phrases.")


if __name__ == "__main__":
    main()
