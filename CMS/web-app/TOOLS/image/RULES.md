# Image Tool Rules

These rules apply to every completed dot-to-dot puzzle photo prepared for the
website with the tools in this folder.

## Privacy and metadata

1. Remove all metadata copied from the source photo.
2. Never retain EXIF, GPS coordinates, camera or phone model, lens details,
   capture date, author account, editing history, thumbnails, or color profile.
3. Add only this clean metadata to the final WebP:
   - Website/creator/owner: `DotToDotFreePrintables.com`
   - Title: the exact human-readable image title used on the webpage.
4. Verify the final file before publishing. Its metadata may contain XMP with
   only the approved website name and title. It must not contain EXIF or ICC data.

## File format and optimization

1. Save completed-puzzle photos as WebP.
2. Use a maximum width of 1200 pixels unless a page has a documented need for a
   different size.
3. Use quality 82 by default and WebP method 6.
4. Do not enlarge a source image that is smaller than the requested maximum.
5. Correct phone/camera orientation and visually confirm that the puzzle is upright.
6. Use RGB output for predictable website rendering.

## Naming and webpage text

1. Use a descriptive lowercase filename with words separated by hyphens.
2. Preferred filename pattern:
   `completed-{puzzle-name}-dot-to-dot-printable.webp`
3. Store completed photos in `public/images/completed/`.
4. The embedded metadata title, HTML `alt`, and HTML `title` must use the same
   human-readable wording.
5. Preferred title pattern:
   `Completed {Puzzle Name} Dot to Dot Printable`
6. Alt text must describe the image accurately and must not include keyword stuffing.

## Reusable webpage component

1. Display completed photos with `components/ExampleCompletedPuzzle.tsx`.
2. Place the component below the puzzle guide and before related puzzles.
3. Supply the image file, puzzle name, caption, and matching image title.
4. Do not duplicate the component code on individual puzzle pages.
5. Add one puzzle as a pilot before enabling a large batch.

## Required processing command

Run the reusable Python tool from the repository root:

```powershell
python TOOLS\image\process_completed_puzzle.py `
  "C:\path\to\source-photo.jpeg" `
  "public\images\completed\completed-puzzle-name-dot-to-dot-printable.webp" `
  --rotate clockwise `
  --title "Completed Puzzle Name Dot to Dot Printable"
```

Use `--rotate none`, `counterclockwise`, or `180` when appropriate.

## Final checks

Before adding or publishing an image, confirm:

- The puzzle is upright.
- The output is WebP and reasonably sized.
- No private or camera metadata remains.
- The only custom metadata is the approved website name and image title.
- Filename, metadata title, HTML alt, and HTML title match.
- The caption is short, friendly, and accurate.
- The page remains responsive on desktop and mobile.
