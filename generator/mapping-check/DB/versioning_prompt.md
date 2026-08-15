# Prompt: Add Version History Tracking Across All Tables (SQLite)

I have a SQLite database with multiple tables that are structurally similar (e.g. mapping_audit, and others with a comparable shape). I need a repeatable, generic pattern to add automatic version history tracking to EACH table independently -- not one shared/generic history table for everything.

## Naming convention

For any given table named X, create a corresponding history table named X_history.

Example: mapping_audit -> mapping_audit_history.

## Example table (apply this pattern to every table in the database)

CREATE TABLE mapping_audit (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    puzzle_slug TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'en',
    where_used_in_page TEXT NOT NULL,
    legacy_key TEXT NOT NULL,
    Legacy_value_by_key TEXT,
    new_key TEXT NOT NULL,
    new_value TEXT,
    status TEXT NOT NULL,
    relevant TEXT NOT NULL,
    usage_relevant TEXT NOT NULL DEFAULT 'UNVERIFIED',
    notes TEXT,
    created_at TEXT NOT NULL,
    i18nRequired INTEGER
);

## Composite key (logical entity) for mapping_audit

The combination of puzzle_slug, language, and new_key uniquely identifies one logical entity. The plain id column is just an autoincrement surrogate and should NOT be used as the versioning key. (For other tables, identify the equivalent natural composite key rather than using their surrogate id.)

## What I need, per table

1. Add an updated_at column to the main table (TEXT, timestamp). Do NOT add a version column to the main table -- versions only live in the history table.

2. Create a dedicated X_history table for each main table X, containing:
   - All the same columns as the main table X
   - Plus a version column (INTEGER)
   - Plus a history_created_at column (TEXT, timestamp of when this history row was written)

   Keep each history table separate and dedicated to its own main table -- do not merge multiple tables' history into one shared/generic table.

3. Create a BEFORE UPDATE trigger on each main table X that:
   - Fires before any UPDATE on a row
   - Copies the OLD row values into X_history
   - Automatically calculates the next version number by counting existing history rows (or taking MAX(version) + 1) filtered on that table's composite key columns -- starting at version 1 for the first change
   - Sets history_created_at to the current timestamp

4. Also update updated_at on the main table row automatically whenever an UPDATE happens (via trigger or as part of the same trigger logic).

5. Provide sample queries to:
   - Fetch full version history for a given composite key on any table
   - Fetch the latest version number for that composite key

## Constraints

- SQLite only (no extensions, keep it portable)
- Application code should NOT need to manually manage versions -- it should just run normal UPDATE X SET ... WHERE id = ? statements and have history captured automatically
- Keep each main table lean -- no version tracking clutter in it, only updated_at
- The pattern must be repeatable/generic so it can be applied to every table in the database, each getting its own X_history table and trigger

Please provide:
1. The complete SQL for mapping_audit / mapping_audit_history as the worked example (ALTER TABLE, CREATE TABLE for history, CREATE TRIGGER, plus the two sample queries)
2. A short generic template/checklist for applying the same pattern to any other table X, given its columns and composite key
