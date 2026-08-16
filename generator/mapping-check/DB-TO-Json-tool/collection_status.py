"""Shared per-(collection, locale) active-flag loader.

Every collection is active in every locale by default. To exclude a
collection from a specific locale (e.g. a US-specific collection that
doesn't apply to `ar`), add an override in
generator/mapping-check/collection_locale_overrides.json rather than
hand-deleting/emptying content files - export_locale_content.py and
validate_headers.py both honor this flag.
"""

from __future__ import annotations

import json
from pathlib import Path

_OVERRIDES_PATH = Path(__file__).resolve().parent.parent / "collection_locale_overrides.json"


def _load() -> dict[str, dict[str, bool]]:
    if not _OVERRIDES_PATH.exists():
        return {}
    with open(_OVERRIDES_PATH, encoding="utf-8") as f:
        data = json.load(f)
    return {k: v for k, v in data.items() if not k.startswith("_")}


_OVERRIDES = _load()


def is_active(collection: str, locale: str) -> bool:
    """True unless explicitly overridden to false for this (collection, locale)."""
    return _OVERRIDES.get(collection, {}).get(locale, True)
