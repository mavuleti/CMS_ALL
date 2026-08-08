# Missing `dotGuide` cleanup tool

This tool scans only `puzzles-*.json` files in the chosen content folder.
Backup files and all other content files are ignored.

For each top-level JSON array it:

1. removes entries that do not contain a `dotGuide` property;
2. rewrites the file when entries remain; and
3. deletes the file when its array becomes empty or is already empty.

Changed and deleted files are backed up beside the originals with a
`.json.bak` suffix by default.

Every run also creates two timestamped files in `tool\logs`:

- `cleanup_*.log` — a readable execution log;
- `cleanup_*.json` — structured analysis with per-file counts and totals.

## Preview changes

From the `ar` folder:

```powershell
python .\tool\cleanup_missing_dotguide.py
```

## Apply changes

```powershell
python .\tool\cleanup_missing_dotguide.py --apply
```

To run it against another folder:

```powershell
python .\tool\cleanup_missing_dotguide.py C:\path\to\content --apply
```

Use `--no-backup` only when backup files are not wanted.

Use `--log-dir C:\path\to\logs` to save reports in another folder.
