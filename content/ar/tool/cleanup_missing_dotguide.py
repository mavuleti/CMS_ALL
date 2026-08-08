#!/usr/bin/env python3
"""Remove puzzle entries that do not contain a dotGuide property."""

from __future__ import annotations

import argparse
from datetime import datetime
import json
import shutil
import sys
import tempfile
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Scan puzzles-* JSON files, remove entries without a dotGuide key, "
            "and delete files whose top-level arrays become empty."
        )
    )
    parser.add_argument(
        "content_dir",
        nargs="?",
        type=Path,
        default=Path(__file__).resolve().parent.parent,
        help="Folder containing puzzles-* files (default: tool folder's parent)",
    )
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Write the changes. Without this option, only report a dry run.",
    )
    parser.add_argument(
        "--no-backup",
        action="store_true",
        help="Do not make .bak copies of changed/deleted files.",
    )
    parser.add_argument(
        "--log-dir",
        type=Path,
        help="Folder for log and JSON analysis files (default: tool/logs).",
    )
    return parser.parse_args()


def write_json_atomic(path: Path, data: list[object]) -> None:
    with tempfile.NamedTemporaryFile(
        "w", encoding="utf-8", newline="\n", dir=path.parent, delete=False
    ) as handle:
        json.dump(data, handle, ensure_ascii=False, indent=2)
        handle.write("\n")
        temporary_path = Path(handle.name)
    temporary_path.replace(path)


def main() -> int:
    args = parse_args()
    content_dir = args.content_dir.resolve()
    files = sorted(content_dir.glob("puzzles-*.json"))
    timestamp = datetime.now().astimezone()
    run_id = timestamp.strftime("%Y%m%d_%H%M%S_%f")
    log_dir = (args.log_dir or Path(__file__).resolve().parent / "logs").resolve()
    messages: list[str] = []
    file_analysis: list[dict[str, object]] = []

    def report(message: str, *, error: bool = False) -> None:
        print(message, file=sys.stderr if error else sys.stdout)
        messages.append(message)

    def save_reports(status: str, exit_code: int) -> None:
        log_dir.mkdir(parents=True, exist_ok=True)
        mode = "apply" if args.apply else "dry-run"
        totals = {
            "files_scanned": len(file_analysis),
            "entries_scanned": sum(int(item["entries_before"]) for item in file_analysis),
            "entries_removed": sum(int(item["entries_removed"]) for item in file_analysis),
            "entries_remaining": sum(int(item["entries_after"]) for item in file_analysis),
            "files_changed": sum(bool(item["would_change"]) for item in file_analysis),
            "files_deleted": sum(item["action"] == "delete" for item in file_analysis),
        }
        analysis = {
            "run_id": run_id,
            "timestamp": timestamp.isoformat(),
            "status": status,
            "exit_code": exit_code,
            "mode": mode,
            "content_directory": str(content_dir),
            "file_pattern": "puzzles-*.json",
            "backup_enabled": not args.no_backup,
            "totals": totals,
            "files": file_analysis,
        }
        log_path = log_dir / f"cleanup_{run_id}.log"
        json_path = log_dir / f"cleanup_{run_id}.json"
        log_header = [
            f"Run: {run_id}",
            f"Time: {timestamp.isoformat()}",
            f"Mode: {mode}",
            f"Folder: {content_dir}",
            f"Status: {status}",
            "",
        ]
        log_path.write_text("\n".join(log_header + messages) + "\n", encoding="utf-8")
        json_path.write_text(
            json.dumps(analysis, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
        print(f"Log saved: {log_path}")
        print(f"Analysis saved: {json_path}")

    if not content_dir.is_dir():
        report(f"ERROR: folder does not exist: {content_dir}", error=True)
        save_reports("error", 2)
        return 2
    if not files:
        report(f"No puzzles-*.json files found in {content_dir}")
        save_reports("success", 0)
        return 0

    removed_total = 0
    changed_files = 0
    deleted_files = 0

    for path in files:
        if not path.is_file():
            continue
        try:
            data = json.loads(path.read_text(encoding="utf-8-sig"))
        except (OSError, json.JSONDecodeError) as exc:
            report(f"ERROR: cannot read {path.name}: {exc}", error=True)
            save_reports("error", 1)
            return 1

        if not isinstance(data, list):
            report(
                f"ERROR: {path.name} does not contain a top-level array",
                error=True,
            )
            save_reports("error", 1)
            return 1

        kept = [entry for entry in data if isinstance(entry, dict) and "dotGuide" in entry]
        removed = len(data) - len(kept)
        action = (
            "delete"
            if not kept
            else ("unchanged" if removed == 0 else "update")
        )
        file_analysis.append(
            {
                "file": path.name,
                "entries_before": len(data),
                "entries_removed": removed,
                "entries_after": len(kept),
                "would_change": action != "unchanged",
                "action": action,
            }
        )
        if action == "unchanged":
            report(f"UNCHANGED {path.name}: {len(data)} entries")
            continue

        removed_total += removed
        changed_files += 1
        action_label = "DELETE" if not kept else "UPDATE"
        mode = "" if args.apply else "WOULD "
        report(
            f"{mode}{action_label} {path.name}: remove {removed}, keep {len(kept)}"
        )

        if not args.apply:
            continue

        if not args.no_backup:
            shutil.copy2(path, path.with_suffix(path.suffix + ".bak"))
        if kept:
            write_json_atomic(path, kept)
        else:
            path.unlink()
            deleted_files += 1

    label = "Applied" if args.apply else "Dry run"
    report(
        f"{label}: removed {removed_total} entries from {changed_files} files; "
        f"deleted {deleted_files if args.apply else 'pending'} empty files."
    )
    save_reports("success", 0)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
