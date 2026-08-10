#!/usr/bin/env python3
"""Find user-visible English text hardcoded in JavaScript/TypeScript JSX.

This intentionally reports candidates instead of attempting edits: replacing prose
with translation calls requires choosing the correct namespace and message catalog.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable, Iterator

try:
    from tree_sitter import Language, Parser
    import tree_sitter_javascript
    import tree_sitter_typescript
except ImportError:  # Give a more useful error than a Python traceback.
    print(
        "i18n-lint: parser dependencies are missing; run "
        "'python -m pip install -r TOOLS/requirements.txt'.",
        file=sys.stderr,
    )
    raise SystemExit(2)


DEFAULTS: dict[str, Any] = {
    "sourcePath": "src",
    "extensions": [".js", ".jsx", ".ts", ".tsx"],
    "translationFunctions": ["t", "i18n.t", "formatMessage"],
    "ignoredPatterns": [],
    "minimumWords": 2,
}
VISIBLE_ATTRIBUTES = {"label", "placeholder", "title", "aria-label", "alt"}
URL_RE = re.compile(r"^(?:https?://|mailto:|tel:|/|#|data:)", re.IGNORECASE)
NUMBER_RE = re.compile(r"^[\s\d.,:+\-–—/%()]+$")
WORD_RE = re.compile(r"[A-Za-z]+(?:['’\-][A-Za-z]+)?")
ANY_WORD_RE = re.compile(r"[^\W\d_]+(?:['’\-][^\W\d_]+)?", re.UNICODE)
WHITESPACE_RE = re.compile(r"\s+")


@dataclass(frozen=True)
class Violation:
    path: Path
    line: int
    column: int
    text: str
    context: str


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Detect hardcoded user-facing English text in JSX/TSX files."
    )
    parser.add_argument(
        "files",
        nargs="*",
        help="Optional files supplied by pre-commit; otherwise the source tree is scanned.",
    )
    parser.add_argument("--path", help="Source directory or file (overrides config).")
    parser.add_argument(
        "--config", default=".i18n-lint.json", help="JSON config path (default: .i18n-lint.json)."
    )
    parser.add_argument(
        "--translation-function",
        action="append",
        dest="translation_functions",
        help="Translation function to ignore; repeat to specify several (overrides config).",
    )
    parser.add_argument("--min-words", type=int, help="Minimum word count (default: 2).")
    parser.add_argument(
        "--fix-suggest", action="store_true", help="Print a suggested key without changing files."
    )
    return parser.parse_args()


def load_config(path: Path) -> dict[str, Any]:
    config = dict(DEFAULTS)
    if path.exists():
        try:
            loaded = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            raise ValueError(f"cannot read {path}: {exc}") from exc
        if not isinstance(loaded, dict):
            raise ValueError(f"{path} must contain a JSON object")
        unknown = sorted(set(loaded) - set(DEFAULTS))
        if unknown:
            raise ValueError(f"unknown config option(s): {', '.join(unknown)}")
        config.update(loaded)

    if not isinstance(config["sourcePath"], str):
        raise ValueError("sourcePath must be a string")
    for key in ("extensions", "translationFunctions", "ignoredPatterns"):
        if not isinstance(config[key], list) or not all(isinstance(v, str) for v in config[key]):
            raise ValueError(f"{key} must be an array of strings")
    if not isinstance(config["minimumWords"], int) or config["minimumWords"] < 1:
        raise ValueError("minimumWords must be a positive integer")
    return config


def collect_files(targets: Iterable[Path], extensions: set[str]) -> list[Path]:
    found: set[Path] = set()
    for target in targets:
        if target.is_file() and target.suffix.lower() in extensions:
            found.add(target.resolve())
        elif target.is_dir():
            for path in target.rglob("*"):
                if path.is_file() and path.suffix.lower() in extensions:
                    found.add(path.resolve())
    return sorted(found, key=lambda p: str(p).lower())


def parser_for(path: Path) -> Parser:
    capsule = (
        tree_sitter_typescript.language_tsx()
        if path.suffix.lower() in {".ts", ".tsx"}
        else tree_sitter_javascript.language()
    )
    language = Language(capsule)
    try:
        return Parser(language)
    except TypeError:  # Compatibility with older Tree-sitter Python releases.
        parser = Parser()
        parser.language = language
        return parser


def walk(node: Any) -> Iterator[Any]:
    yield node
    for child in node.children:
        yield from walk(child)


def source_text(node: Any, source: bytes) -> str:
    return source[node.start_byte : node.end_byte].decode("utf-8", errors="replace")


def unquote(raw: str) -> str:
    if len(raw) >= 2 and raw[0] == raw[-1] and raw[0] in {'"', "'", "`"}:
        raw = raw[1:-1]
    # Decode only common presentation escapes; unicode_escape corrupts non-ASCII prose.
    return raw.replace(r"\n", " ").replace(r"\t", " ").replace(r"\'", "'").replace(r'\"', '"')


def attribute_name(node: Any, source: bytes) -> str:
    name = node.child_by_field_name("name")
    if name is not None:
        return source_text(name, source)
    return source_text(node.children[0], source) if node.children else ""


def call_name(node: Any, source: bytes) -> str:
    function = node.child_by_field_name("function")
    return source_text(function, source).strip() if function is not None else ""


def inside_translation_call(node: Any, source: bytes, functions: set[str]) -> bool:
    current = node.parent
    while current is not None:
        if current.type == "call_expression" and call_name(current, source) in functions:
            return True
        current = current.parent
    return False


def literal_from_expression(node: Any, source: bytes) -> tuple[str, Any] | None:
    """Return a static string from a JSX expression such as {"Save changes"}."""
    named = node.named_children
    if len(named) != 1:
        return None
    literal = named[0]
    if literal.type not in {"string", "string_fragment", "template_string"}:
        return None
    raw = source_text(literal, source)
    if literal.type == "template_string" and "${" in raw:
        return None
    return unquote(raw), literal


def candidates(root: Any, source: bytes, functions: set[str]) -> Iterator[tuple[str, Any]]:
    for node in walk(root):
        if node.type == "jsx_text":
            yield source_text(node, source), node
            continue
        if node.type == "jsx_attribute":
            if attribute_name(node, source).lower() not in VISIBLE_ATTRIBUTES:
                continue
            value = node.child_by_field_name("value")
            # Current JS/TS grammars do not assign a field name to the value.
            if value is None and len(node.named_children) >= 2:
                value = node.named_children[1]
            if value is None or inside_translation_call(value, source, functions):
                continue
            if value.type in {"string", "string_fragment"}:
                yield unquote(source_text(value, source)), value
            elif value.type == "jsx_expression":
                literal = literal_from_expression(value, source)
                if literal:
                    yield literal
            continue
        if node.type == "jsx_expression" and node.parent and node.parent.type == "jsx_element":
            if inside_translation_call(node, source, functions):
                continue
            literal = literal_from_expression(node, source)
            if literal:
                yield literal


def normalize(text: str) -> str:
    return WHITESPACE_RE.sub(" ", text).strip()


def should_ignore(text: str, min_words: int, patterns: list[re.Pattern[str]]) -> bool:
    if not text or len(text) == 1 or URL_RE.match(text) or NUMBER_RE.fullmatch(text):
        return True
    if any(pattern.search(text) for pattern in patterns):
        return True
    words = WORD_RE.findall(text)
    if len(words) < min_words:
        return True
    all_words = ANY_WORD_RE.findall(text)
    if all_words and len(words) / len(all_words) < 0.6:
        return True
    # Require normal language characters and reject variable/template-only content.
    if not any(char.isalpha() for char in text) or re.fullmatch(r"[${}\w.\[\]-]+", text):
        return True
    return False


def context_for(lines: list[str], line: int) -> str:
    start, end = max(0, line - 2), min(len(lines), line + 1)
    return "\n".join(f"    {number + 1:>4} | {lines[number].rstrip()}" for number in range(start, end))


def inspect_file(
    path: Path, min_words: int, patterns: list[re.Pattern[str]], functions: set[str]
) -> tuple[list[Violation], bool]:
    source = path.read_bytes()
    tree = parser_for(path).parse(source)
    lines = source.decode("utf-8", errors="replace").splitlines()
    violations: list[Violation] = []
    seen: set[tuple[int, str]] = set()
    for raw, node in candidates(tree.root_node, source, functions):
        text = normalize(raw)
        marker = (node.start_byte, text)
        if marker in seen or should_ignore(text, min_words, patterns):
            continue
        seen.add(marker)
        line, column = node.start_point[0] + 1, node.start_point[1] + 1
        violations.append(Violation(path, line, column, text, context_for(lines, line)))
    return violations, tree.root_node.has_error


def suggested_key(path: Path, text: str, base: Path) -> str:
    try:
        relative = path.relative_to(base.resolve())
    except ValueError:
        relative = Path(path.name)
    path_parts = [re.sub(r"[^a-z0-9]+", "_", part.lower()).strip("_") for part in relative.with_suffix("").parts]
    slug = re.sub(r"[^a-z0-9]+", "_", text.lower()).strip("_")
    parts = [part for part in path_parts + [slug[:60].rstrip("_")] if part]
    return ".".join(parts)


def display_path(path: Path, cwd: Path) -> str:
    try:
        return str(path.relative_to(cwd))
    except ValueError:
        return str(path)


def configure_console() -> None:
    """Avoid Windows legacy-codepage crashes when source contains other scripts."""
    for stream in (sys.stdout, sys.stderr):
        reconfigure = getattr(stream, "reconfigure", None)
        if reconfigure:
            try:
                reconfigure(encoding="utf-8", errors="backslashreplace")
            except (OSError, ValueError):
                pass


def main() -> int:
    configure_console()
    args = parse_args()
    cwd = Path.cwd().resolve()
    config_path = Path(args.config)
    try:
        config = load_config(config_path)
        patterns = [re.compile(value) for value in config["ignoredPatterns"]]
    except (ValueError, re.error) as exc:
        print(f"i18n-lint: configuration error: {exc}", file=sys.stderr)
        return 2

    extensions = {ext.lower() if ext.startswith(".") else f".{ext.lower()}" for ext in config["extensions"]}
    functions = set(args.translation_functions or config["translationFunctions"])
    min_words = args.min_words if args.min_words is not None else config["minimumWords"]
    if min_words < 1:
        print("i18n-lint: --min-words must be positive", file=sys.stderr)
        return 2

    if args.files:
        targets = [Path(item) for item in args.files]
        key_base = cwd
    else:
        target = Path(args.path or config["sourcePath"])
        targets = [target]
        key_base = target if target.is_dir() else target.parent
        if not target.exists():
            print(f"i18n-lint: source path does not exist: {target}", file=sys.stderr)
            return 2

    files = collect_files(targets, extensions)
    violations: list[Violation] = []
    parse_errors: list[Path] = []
    for path in files:
        try:
            found, has_error = inspect_file(path, min_words, patterns, functions)
            violations.extend(found)
            if has_error:
                parse_errors.append(path)
        except OSError as exc:
            print(f"i18n-lint: cannot read {path}: {exc}", file=sys.stderr)
            return 2

    for item in violations:
        print(f"{display_path(item.path, cwd)}:{item.line}:{item.column}: hardcoded text: {item.text!r}")
        print(item.context)
        if args.fix_suggest:
            print(f"         suggestion: {suggested_key(item.path, item.text, key_base)}")
        print()

    if parse_errors:
        print("Warning: the parser recovered from syntax errors in:", file=sys.stderr)
        for path in parse_errors:
            print(f"  {display_path(path, cwd)}", file=sys.stderr)
    if violations:
        print(f"Found {len(violations)} hardcoded i18n string(s) in {len(files)} file(s).")
        return 1
    print(f"No hardcoded i18n strings found in {len(files)} file(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
