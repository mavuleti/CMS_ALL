#!/usr/bin/env python3
"""Audit internal links in a locale-prefixed Next.js static export."""

from __future__ import annotations

import argparse
import html
import json
import posixpath
import re
import sys
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import unquote, urlsplit


INTERNAL_HOSTS = {"dottodotfreeprintables.com", "www.dottodotfreeprintables.com"}
IGNORED_SCHEMES = {"mailto", "tel", "javascript", "data", "blob"}
SHARED_FILE_EXTENSIONS = {".pdf", ".xml"}
LOCALE_NAME = re.compile(r"^[a-z]{2}(?:-[A-Z]{2})?$")
ANCHOR_TAG = re.compile(r"<a\b[^>]*>", re.IGNORECASE)
HREF_ATTRIBUTE = re.compile(
    r"""\bhref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))""",
    re.IGNORECASE,
)
SUPPRESSED_TAG = re.compile(
    r"<span\b[^>]*\bdata-link-audit-suppressed\s*=\s*"
    r'''(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))[^>]*>''',
    re.IGNORECASE,
)


def extract_anchor_hrefs(document: str) -> list[str]:
    hrefs: list[str] = []
    for anchor_match in ANCHOR_TAG.finditer(document):
        href_match = HREF_ATTRIBUTE.search(anchor_match.group(0))
        if href_match:
            value = next(value for value in href_match.groups() if value is not None)
            if value:
                hrefs.append(html.unescape(value).strip())
    return hrefs


def extract_suppressed_hrefs(document: str) -> list[str]:
    hrefs: list[str] = []
    for match in SUPPRESSED_TAG.finditer(document):
        value = next(value for value in match.groups() if value is not None)
        if value:
            hrefs.append(unquote(html.unescape(value).strip()))
    return hrefs


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Check that static-export links remain inside their source locale."
    )
    parser.add_argument("--out-dir", default="out", help="Next.js export directory")
    parser.add_argument(
        "--report",
        default="reports/static-locale-link-report.md",
        help="Markdown report path",
    )
    parser.add_argument("--json-report", help="Optional JSON report path")
    parser.add_argument(
        "--no-fail",
        action="store_true",
        help="Exit successfully even when broken or mismatched links are found",
    )
    return parser.parse_args()


def discover_locales(out_dir: Path) -> list[str]:
    locales = [
        child.name
        for child in out_dir.iterdir()
        if child.is_dir()
        and LOCALE_NAME.fullmatch(child.name)
        and any(child.rglob("*.html"))
    ]
    return sorted(locales, key=str.casefold)


def page_url(out_dir: Path, html_file: Path) -> str:
    relative = html_file.relative_to(out_dir).as_posix()
    if relative == "index.html":
        return "/"
    if relative.endswith("/index.html"):
        return "/" + relative[: -len("index.html")]
    return "/" + relative[: -len(".html")]


def target_exists(exported_files: set[str], url_path: str) -> bool:
    decoded = unquote(url_path).lstrip("/")
    candidates = {decoded}
    if url_path.endswith("/") or posixpath.splitext(decoded)[1] == "":
        candidates.add(f"{decoded.rstrip('/')}/index.html")
        candidates.add(f"{decoded.rstrip('/')}.html")
    return any(candidate in exported_files for candidate in candidates)


def classify_href(
    href: str,
    source_url: str,
    locale: str,
    locale_set: set[str],
    exported_files: set[str],
) -> tuple[str, str] | None:
    if not href or href.startswith("#"):
        return None

    scheme_match = re.match(r"^([a-zA-Z][a-zA-Z0-9+.-]*):", href)
    scheme = scheme_match.group(1).lower() if scheme_match else ""
    if scheme in IGNORED_SCHEMES:
        return None
    if scheme and scheme not in {"http", "https"}:
        return None

    if scheme or href.startswith("//"):
        parsed = urlsplit(href)
        if (parsed.hostname or "").lower() not in INTERNAL_HOSTS:
            return None
        raw_path = parsed.path or "/"
    else:
        raw_path = href.split("#", 1)[0].split("?", 1)[0]
        if not raw_path:
            raw_path = source_url
        elif not raw_path.startswith("/"):
            raw_path = posixpath.normpath(
                posixpath.join(posixpath.dirname(source_url), raw_path)
            )
            if not raw_path.startswith("/"):
                raw_path = "/" + raw_path
    path = unquote(raw_path)
    extension = posixpath.splitext(path)[1].lower()

    # PDFs and XML documents are intentionally published once at the export
    # root and shared by every locale. They do not need a locale prefix, but
    # their exported target must still exist.
    if extension in SHARED_FILE_EXTENSIONS:
        if target_exists(exported_files, path):
            return "ok", path
        return "broken", path

    first_segment = path.lstrip("/").split("/", 1)[0]

    if first_segment != locale:
        if first_segment in locale_set:
            reason = f"points to locale '{first_segment}'"
        else:
            reason = "missing current locale prefix"
        return "locale_mismatch", f"{path} ({reason})"

    if not target_exists(exported_files, path):
        return "broken", path
    return "ok", path


def audit(out_dir: Path, locales: list[str]) -> dict:
    locale_set = set(locales)
    exported_files = {
        path.relative_to(out_dir).as_posix()
        for path in out_dir.rglob("*")
        if path.is_file()
    }
    def audit_locale(locale: str) -> tuple[str, dict]:
        html_files = sorted((out_dir / locale).rglob("*.html"))
        broken: dict[str, set[str]] = defaultdict(set)
        mismatches: dict[str, set[str]] = defaultdict(set)
        suppressed: dict[str, set[str]] = defaultdict(set)
        links_checked = 0
        absolute_link_cache: dict[str, tuple[str, str] | None] = {}

        for html_file in html_files:
            source_url = page_url(out_dir, html_file)
            try:
                document = html_file.read_text(encoding="utf-8")
                hrefs = extract_anchor_hrefs(document)
                suppressed_hrefs = extract_suppressed_hrefs(document)
            except (OSError, UnicodeError) as exc:
                broken[source_url].add(f"[could not parse HTML: {exc}]")
                continue

            for href in suppressed_hrefs:
                suppressed[source_url].add(href)

            for href in hrefs:
                cacheable = href.startswith("/") or bool(
                    re.match(r"^https?://", href, re.IGNORECASE)
                )
                if cacheable and href in absolute_link_cache:
                    outcome = absolute_link_cache[href]
                else:
                    outcome = classify_href(
                        href, source_url, locale, locale_set, exported_files
                    )
                    if cacheable:
                        absolute_link_cache[href] = outcome
                if outcome is None:
                    continue
                links_checked += 1
                category, target = outcome
                if category == "ok":
                    continue
                bucket = broken if category == "broken" else mismatches
                bucket[source_url].add(f"{href} -> {target}")

        result = {
            "pages_checked": len(html_files),
            "internal_links_checked": links_checked,
            "broken_links": sum(len(items) for items in broken.values()),
            "locale_mismatches": sum(len(items) for items in mismatches.values()),
            "suppressed_unavailable_links": sum(
                len(items) for items in suppressed.values()
            ),
            "broken": {key: sorted(value) for key, value in sorted(broken.items())},
            "mismatches": {
                key: sorted(value) for key, value in sorted(mismatches.items())
            },
            "suppressed": {
                key: sorted(value) for key, value in sorted(suppressed.items())
            },
        }
        return locale, result

    # Reading and scanning hundreds of megabytes benefits substantially from a
    # small worker pool, while keeping memory use predictable on CI machines.
    with ThreadPoolExecutor(max_workers=min(4, len(locales))) as executor:
        results = dict(executor.map(audit_locale, locales))
    results = dict(sorted(results.items(), key=lambda item: item[0].casefold()))

    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "out_dir": str(out_dir),
        "locale_count": len(locales),
        "locales": results,
        "totals": {
            "pages_checked": sum(r["pages_checked"] for r in results.values()),
            "internal_links_checked": sum(
                r["internal_links_checked"] for r in results.values()
            ),
            "broken_links": sum(r["broken_links"] for r in results.values()),
            "locale_mismatches": sum(
                r["locale_mismatches"] for r in results.values()
            ),
            "suppressed_unavailable_links": sum(
                r["suppressed_unavailable_links"] for r in results.values()
            ),
        },
    }


def markdown_report(report: dict) -> str:
    totals = report["totals"]
    lines = [
        "# Static locale link audit",
        "",
        f"Generated: `{report['generated_at']}`  ",
        f"Export directory: `{report['out_dir']}`  ",
        f"Locales checked: **{report['locale_count']}**",
        "",
        "## Summary",
        "",
        "| Locale | Pages | Internal links | Broken | Locale mismatches | Suppressed unavailable |",
        "|---|---:|---:|---:|---:|---:|",
    ]
    for locale, result in report["locales"].items():
        lines.append(
            f"| {locale} | {result['pages_checked']} | "
            f"{result['internal_links_checked']} | {result['broken_links']} | "
            f"{result['locale_mismatches']} | "
            f"{result['suppressed_unavailable_links']} |"
        )
    lines.extend(
        [
            f"| **Total** | **{totals['pages_checked']}** | "
            f"**{totals['internal_links_checked']}** | "
            f"**{totals['broken_links']}** | "
            f"**{totals['locale_mismatches']}** | "
            f"**{totals['suppressed_unavailable_links']}** |",
            "",
            "## Details by locale",
            "",
        ]
    )

    for locale, result in report["locales"].items():
        lines.extend(
            [
                f"### {locale}",
                "",
                f"- Pages checked: {result['pages_checked']}",
                f"- Internal links checked: {result['internal_links_checked']}",
                f"- Broken links: {result['broken_links']}",
                f"- Locale mismatches: {result['locale_mismatches']}",
                f"- Suppressed unavailable links: {result['suppressed_unavailable_links']}",
                "",
            ]
        )
        for heading, key in (
            ("Broken links", "broken"),
            ("Locale mismatches", "mismatches"),
            ("Suppressed unavailable links (warning only)", "suppressed"),
        ):
            lines.extend([f"#### {heading}", ""])
            affected = result[key]
            if not affected:
                lines.extend(["None.", ""])
                continue
            for source, targets in affected.items():
                lines.append(f"- `{source}`")
                for target in targets:
                    lines.append(f"  - `{target}`")
            lines.append("")
    return "\n".join(lines) + "\n"


def main() -> int:
    args = parse_args()
    out_dir = Path(args.out_dir).resolve()
    if not out_dir.is_dir():
        print(f"ERROR: static export directory does not exist: {out_dir}", file=sys.stderr)
        return 2

    locales = discover_locales(out_dir)
    if not locales:
        print(f"ERROR: no locale directories found in {out_dir}", file=sys.stderr)
        return 2

    report = audit(out_dir, locales)
    report_path = Path(args.report)
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(markdown_report(report), encoding="utf-8")

    json_path = Path(args.json_report) if args.json_report else report_path.with_suffix(".json")
    json_path.parent.mkdir(parents=True, exist_ok=True)
    json_path.write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )

    totals = report["totals"]
    print(
        f"Checked {totals['pages_checked']} pages across {report['locale_count']} locales: "
        f"{totals['broken_links']} broken link(s), "
        f"{totals['locale_mismatches']} locale mismatch(es), "
        f"{totals['suppressed_unavailable_links']} suppressed unavailable link(s)."
    )
    print(f"Reports: {report_path} and {json_path}")
    has_errors = totals["broken_links"] or totals["locale_mismatches"]
    return 1 if has_errors and not args.no_fail else 0


if __name__ == "__main__":
    raise SystemExit(main())
