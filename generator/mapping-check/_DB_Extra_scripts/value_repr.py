"""Shared full-fidelity value serializer for mapping_audit DB rows.

Never truncates. The DB's `new_value` / `mapped_value` / `legacy_value` columns
are not just audit-report display text - they are the canonical content that
export_locale_content.py reads verbatim and writes into the site's
content/{locale}/*.json files. Truncating here silently corrupts production
content while looking complete (see 2026-08 postmortem: every audit_*.py /
clone_en_to_language.py script had its own local `compact_repr(value, limit=500)`
that clipped long strings to 500 chars + an ellipsis before storing them, which
shipped mid-<a>-tag cutoffs and mis-serialized nested objects to every locale).

Use full_repr() for anything written into a DB row. If a script also prints a
human-readable preview to the console/log, truncate that print statement's
argument locally - never the value that gets stored.
"""

from __future__ import annotations

import json
from typing import Any


def full_repr(value: Any, missing: Any = None, missing_text: str = "<absent>") -> str:
    """Full-fidelity string form of `value` for storage. No length limit, ever."""
    if missing is not None and value is missing:
        return missing_text
    text = json.dumps(value, ensure_ascii=False) if not isinstance(value, str) else value
    return " ".join(str(text).split())
