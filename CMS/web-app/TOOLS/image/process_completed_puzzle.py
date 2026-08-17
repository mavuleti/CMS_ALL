"""Rotate, resize, and optimize completed-puzzle photos for the website."""

from __future__ import annotations

import argparse
from html import escape
from pathlib import Path

from PIL import Image, ImageOps


ROTATION_DEGREES = {
    "none": 0,
    "clockwise": -90,
    "counterclockwise": 90,
    "180": 180,
}


def clean_xmp(website_name: str, title: str) -> bytes:
    """Create minimal XMP containing no camera, GPS, device, or editing data."""
    website = escape(website_name, quote=True)
    image_title = escape(title, quote=True)
    return f"""<?xpacket begin='\ufeff' id='W5M0MpCehiHzreSzNTczkc9d'?>
<x:xmpmeta xmlns:x='adobe:ns:meta/'>
  <rdf:RDF xmlns:rdf='http://www.w3.org/1999/02/22-rdf-syntax-ns#'>
    <rdf:Description rdf:about=''
      xmlns:dc='http://purl.org/dc/elements/1.1/'
      xmlns:xmpRights='http://ns.adobe.com/xap/1.0/rights/'>
      <dc:title><rdf:Alt><rdf:li xml:lang='x-default'>{image_title}</rdf:li></rdf:Alt></dc:title>
      <dc:creator><rdf:Seq><rdf:li>{website}</rdf:li></rdf:Seq></dc:creator>
      <xmpRights:Owner><rdf:Bag><rdf:li>{website}</rdf:li></rdf:Bag></xmpRights:Owner>
    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end='w'?>""".encode("utf-8")


def process_image(
    source: Path,
    destination: Path,
    rotation: str,
    max_width: int,
    quality: int,
    website_name: str,
    title: str,
) -> None:
    """Write a compact WebP stripped of source metadata, with minimal clean XMP."""
    with Image.open(source) as opened:
        image = ImageOps.exif_transpose(opened)
        degrees = ROTATION_DEGREES[rotation]
        if degrees:
            image = image.rotate(degrees, expand=True)

        if image.width > max_width:
            height = round(image.height * max_width / image.width)
            image = image.resize((max_width, height), Image.Resampling.LANCZOS)

        destination.parent.mkdir(parents=True, exist_ok=True)
        image.convert("RGB").save(
            destination,
            format="WEBP",
            quality=quality,
            method=6,
            exif=b"",
            icc_profile=None,
            xmp=clean_xmp(website_name, title),
        )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Prepare a completed-puzzle photo as a web-optimized WebP."
    )
    parser.add_argument("source", type=Path, help="Source JPEG, PNG, or WebP file")
    parser.add_argument("destination", type=Path, help="Destination .webp file")
    parser.add_argument(
        "--rotate",
        choices=ROTATION_DEGREES,
        default="none",
        help="Optional rotation after correcting the camera's EXIF orientation",
    )
    parser.add_argument("--max-width", type=int, default=1200)
    parser.add_argument("--quality", type=int, choices=range(1, 101), default=82)
    parser.add_argument("--website-name", default="DotToDotFreePrintables.com")
    parser.add_argument("--title", required=True, help="Clean title stored in XMP")
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    if args.destination.suffix.lower() != ".webp":
        raise SystemExit("Destination filename must end in .webp")
    process_image(
        args.source,
        args.destination,
        args.rotate,
        args.max_width,
        args.quality,
        args.website_name,
        args.title,
    )


if __name__ == "__main__":
    main()
