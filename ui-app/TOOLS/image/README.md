# Image tools

Keep reusable Python image-processing code in this folder.
Follow [RULES.md](RULES.md) for every image prepared with these tools.

## Completed puzzle photos

Install Pillow once:

```powershell
python -m pip install -r TOOLS\image\requirements.txt
```

Rotate a phone photo clockwise, resize it to a maximum width of 1200 pixels,
and save it as an optimized WebP:

```powershell
python TOOLS\image\process_completed_puzzle.py `
  "C:\path\to\photo.jpeg" `
  "public\images\completed\puzzle-name-completed.webp" `
  --rotate clockwise `
  --title "Completed Cute Car Dot to Dot Printable"
```

Use `--rotate none` when the photo already appears upright. The defaults are
1200 pixels wide and WebP quality 82; override them with `--max-width` and
`--quality` when needed. The output removes the source EXIF, GPS, camera, and
color-profile data. It stores only minimal XMP containing the website name and
the title supplied with `--title`.
