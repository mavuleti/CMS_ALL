# Prompt: Color Name Dropdown with Auto-Populated Hex (Crayola Standard List)

## Goal
Replace the current free-text "Color name" + free-text "Hex" field pair with a single
DROPDOWN of color names. Selecting a name automatically populates the Hex field with the
correct, authoritative hex code. This removes the possibility of a name/hex mismatch
entirely, rather than catching it after the fact with a warning.

## Data source
A new file, crayola-color-lookup.json, containing the 120 standard Crayola crayon colors
(the set found in the standard 120-count box, which covers the large majority of colors kids
recognize from real crayons). Each entry has a "color" name and its official "hex" code.
This is the single source of truth for the dropdown.

## UI behavior
1. The "Color name" field becomes a select, populated from crayola-color-lookup.json,
   sorted alphabetically. Include a disabled placeholder option like "Select a color...".
2. On selecting a name, the Hex field is auto-filled with the matching hex code from the
   lookup table and becomes read-only (grey background, not editable by hand), since it is
   now a derived value, not independently entered data.
3. Remove the existing soft "hex looks valid but doesn't match name" warning validator
   entirely, it's no longer needed once mismatches are structurally impossible.
4. If legacy JSON is imported that has a hex code NOT in the lookup table (e.g. a custom
   color from before this change), fall back gracefully: show the raw hex in a small
   read-only text next to the dropdown, set the dropdown to "Custom / Other", and flag it
   with a soft informational note ("Custom color, not in standard list") rather than
   blocking the form.
5. Keep the existing child-friendliness/blocklist validator on the name as-is, run against
   the selected dropdown value (still useful as a safety net).

## Data file format (see attached crayola-color-lookup.json)
{
  "colors": [
    { "color": "Almond", "hex": "#EFDECD" },
    { "color": "Antique Brass", "hex": "#CD9575" }
  ]
}
Full file contains all 120 standard Crayola names and hex codes.

## Where to implement
- puzzle-form-preview.html: replace the two free-text inputs with the dropdown plus
  read-only hex pattern described above; load crayola-color-lookup.json on page init.
- Angular project (puzzle-form.component.ts and template): same pattern, using a
  FormControl bound to the dropdown, and reactively patching the hex FormControl
  (disabled) on valueChanges.
- Update puzzle-json-schema.md: note that color.name should match a value from the
  lookup table when possible, and color.hex is derived and read-only in the form, though
  the schema itself keeps both fields since custom colors are still allowed as a fallback.

## Explicitly out of scope for this change
- Do not touch the collection JSON schema work or template generator work.
- Do not remove the ability to store a custom, non-standard color in the underlying JSON
  data, only the FORM entry method changes to dropdown-first. The schema still just
  stores name and hex as strings.
