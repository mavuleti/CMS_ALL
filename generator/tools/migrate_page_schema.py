"""Migrate localized blog and standalone page content to header/body documents.

Blog posts stay together in one blog.json array. The legacy legal.json bundle is
split into one JSON document per routable page: contact, terms,
privacy-policy, and about.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any

import sys
sys.path.insert(0, str(Path(__file__).resolve().parent))
from migration_safety import check_count, compact, require_clean_git_tree, verify_transfer  # noqa: E402


PAGE_FILES = {
    "contact": "contact.json",
    "terms": "terms.json",
    "privacy": "privacy-policy.json",
    "about": "about.json",
}


def limit(value: Any, maximum: int) -> str:
    text = compact(value)
    if len(text) <= maximum:
        return text
    return text[: maximum - 1].rstrip(" ,.;:-") + "…"


def description_for(value: dict[str, Any]) -> str:
    for key in ("description", "intro", "subtitle", "text", "body"):
        if compact(value.get(key)):
            return compact(value[key])
    for item in value.values():
        if isinstance(item, str) and len(compact(item)) >= 40:
            return compact(item)
    return compact(value.get("title"))


def page_header(title: str, description: str, schema_type: str, name: str | None = None) -> dict[str, Any]:
    seo_title = limit(title, 60)
    seo_description = limit(description, 158)
    return {
        "title": seo_title,
        "meta_description": seo_description,
        "og": {"title": seo_title, "description": seo_description},
        "json_ld": {
            "type": schema_type,
            "name": compact(name or title),
            "description": seo_description,
        },
    }


def migrate_blog_entry(raw: dict[str, Any]) -> dict[str, Any]:
    if isinstance(raw.get("header"), dict) and isinstance(raw.get("body"), dict):
        return raw
    title = compact(raw.get("title"))
    description = compact(raw.get("description"))
    body = {
        "h1": title,
        "description": description,
        "category": raw.get("category", ""),
        "read_time": raw.get("readTime", raw.get("read_time", "")),
        "author": raw.get("author", ""),
        "author_bio": raw.get("authorBio", raw.get("author_bio", "")),
        "sections": raw.get("sections", []),
        "related_links": raw.get("relatedLinks", raw.get("related_links", [])),
    }
    if raw.get("heroImage") is not None or raw.get("hero_image") is not None:
        body["hero_image"] = raw.get("heroImage", raw.get("hero_image"))
    known = {"slug", "title", "description", "category", "readTime", "read_time", "author", "authorBio", "author_bio", "sections", "relatedLinks", "related_links", "heroImage", "hero_image"}
    for key, value in raw.items():
        if key not in known:
            body[key] = value
    return {
        "slug": raw.get("slug", ""),
        "header": page_header(title, description, "BlogPosting", title),
        "body": body,
    }


def migrate_page(slug: str, raw: dict[str, Any]) -> dict[str, Any]:
    if isinstance(raw.get("header"), dict) and isinstance(raw.get("body"), dict):
        return raw
    title = compact(raw.get("title")) or slug.replace("-", " ").title()
    description = description_for(raw)
    body = {"h1": title}
    body.update(raw)
    return {
        "slug": slug,
        "header": page_header(title, description, "WebPage", title),
        "body": body,
    }


def write_json(path: Path, value: Any, dry_run: bool) -> None:
    if dry_run:
        print(f"WOULD WRITE {path}")
        return
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"WROTE {path}")


def migrate_locale(locale_dir: Path, dry_run: bool, keep_bundle: bool) -> int:
    changed = 0
    blog_path = locale_dir / "blog.json"
    if blog_path.exists():
        blogs = json.loads(blog_path.read_text(encoding="utf-8-sig"))
        if not isinstance(blogs, list):
            raise ValueError(f"{blog_path} must contain an array")
        migrated = [migrate_blog_entry(item) for item in blogs]
        check_count(len(blogs), len(migrated), str(blog_path))
        for raw_item, migrated_item in zip(blogs, migrated):
            if migrated_item is not raw_item:
                verify_transfer(raw_item, migrated_item, f"{blog_path} [{raw_item.get('slug', '?')}]")
        if migrated != blogs:
            write_json(blog_path, migrated, dry_run)
            changed += 1

    legal_path = locale_dir / "legal.json"
    if legal_path.exists():
        legal = json.loads(legal_path.read_text(encoding="utf-8-sig"))
        migrated_keys = 0
        for key, filename in PAGE_FILES.items():
            if isinstance(legal.get(key), dict):
                page = migrate_page(filename[:-5], legal[key])
                if page is not legal[key]:
                    verify_transfer(legal[key], page, f"{legal_path} [{key}]")
                write_json(locale_dir / filename, page, dry_run)
                migrated_keys += 1
        changed += migrated_keys
        if migrated_keys < len(PAGE_FILES):
            missing = [key for key in PAGE_FILES if not isinstance(legal.get(key), dict)]
            print(f"SKIPPING REMOVAL of {legal_path}: missing/invalid keys {missing}")
        elif not keep_bundle:
            if dry_run:
                print(f"WOULD REMOVE {legal_path}")
            else:
                legal_path.unlink()
                print(f"REMOVED {legal_path}")
            changed += 1
    return changed


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("content_dir", type=Path)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--keep-legal-bundle", action="store_true")
    parser.add_argument("--force", action="store_true", help="skip the clean-git-tree safety check")
    args = parser.parse_args()
    if not args.dry_run:
        require_clean_git_tree([args.content_dir], force=args.force)
    locale_dirs = sorted(path for path in args.content_dir.iterdir() if path.is_dir() and not path.name.startswith("."))
    changed = sum(migrate_locale(path, args.dry_run, args.keep_legal_bundle) for path in locale_dirs)
    print(f"{changed} file operations across {len(locale_dirs)} locale directories.")


if __name__ == "__main__":
    main()
