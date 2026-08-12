"""
USA 250 Dot-to-Dot Activity Book — Amazon KDP Interior Generator
8.5 x 11 inches, 24 pages
"""

import fitz  # PyMuPDF
from pathlib import Path

# ── Page dimensions (8.5 × 11 in @ 72 pt/in) ──────────────────────────────
W, H = 612, 792
MARGIN = 54   # 0.75 in
INNER = 36    # inner gutter (binding side)

# ── Patriotic palette ─────────────────────────────────────────────────────
RED    = (0.698, 0.082, 0.086)   # #B21516
BLUE   = (0.071, 0.212, 0.478)   # #123679
GOLD   = (0.839, 0.647, 0.071)   # #D6A512
WHITE  = (1.0,   1.0,   1.0)
BLACK  = (0.0,   0.0,   0.0)
CREAM  = (0.996, 0.992, 0.961)   # off-white bg
LTBLUE = (0.867, 0.906, 0.973)   # light patriotic blue tint

# ── Paths ─────────────────────────────────────────────────────────────────
BASE = Path(__file__).resolve().parent.parent
DATA = BASE / "data"

PUZZLES = [
    {
        "title":      "Gas Balloon USA 250",
        "emoji":      "🎈",
        "dots":       48,
        "age":        "Ages 4–7",
        "tagline":    "Celebrate 250 Years of America!",
        "image":      DATA / "gas-balloon-usa-250" / "gas-balloon-usa-250_48_dots_easy_dot_to_dot_puzzle.png",
        "intro":      (
            "America is turning 250 years old — a quarter millennium of history, invention, and adventure! "
            "What better way to celebrate than soaring above the festivities in a magnificent gas balloon? "
            "Gas balloons were one of the very first flying machines, and Americans have loved them since "
            "the earliest days of the republic. Grab a pencil, find dot 1, and let's send this balloon "
            "up into the celebration sky!"
        ),
        "outro":      (
            "Wonderful work — your USA 250 gas balloon is ready to soar! That's 48 dots and one sky full "
            "of celebration. Colour it in red, white, and blue to mark America's amazing 250th birthday. "
            "Happy anniversary, USA!"
        ),
        "sections": [
            ("1–10",  "The Balloon Envelope",
             "The large, rounded top of the balloon envelope holds the gas that makes it fly. "
             "Gas balloons are filled with lighter-than-air gas — often helium today. The round "
             "shape spreads pressure evenly in all directions."),
            ("11–22", "The Stars and Stripes Detail",
             "The Flag Act of 1818 set the modern rule of 13 stripes, with one star for each state. "
             "Early balloonists sometimes decorated their envelopes with patriotic colours and symbols."),
            ("23–34", "The Netting and Load Ring",
             "The rope netting around gas balloons helps spread the weight of the basket across the "
             "envelope. Sharing the weight over many ropes helps the balloon stay balanced and strong."),
            ("35–42", "The Suspension Ropes and Basket",
             "Balloon baskets — called gondolas — have been made from wicker for over 200 years. "
             "Wicker is lightweight and flexible, bending gently during landing. Sometimes the old "
             "ways really are the best ways!"),
            ("43–48", "The Flag and Finishing Touches",
             "America's first balloon pilot was Jean-Pierre Blanchard, who flew from Philadelphia "
             "on 9 January 1793. President George Washington gave him a letter of safe passage — "
             "which proved very useful when he landed in a New Jersey farm field!"),
        ],
        "fun_fact": (
            "The first gas balloon flight in America took place in 1793 — George Washington himself "
            "watched it launch in Philadelphia!"
        ),
    },
    {
        "title":   "Eagle Kite Banner USA 250",
        "emoji":   "🦅",
        "dots":    80,
        "age":     "Ages 5–9",
        "tagline": "Soar with the American Eagle for USA's 250th!",
        "image":   DATA / "usa-250-anniversary-eagle-kite-banner" / "usa-250-anniversary-eagle-kite-banner_80_dots_easy_dot_to_dot_puzzle.png",
        "intro":   (
            "America is celebrating its 250th birthday, and the nation's most iconic symbol — the bald "
            "eagle — is here to lead the festivities! With a patriotic banner streaming behind it, this "
            "majestic bird soars high over the celebration. Eagles have stood for American freedom and "
            "strength since the very earliest days of the republic. Grab your pencil, find dot 1, and "
            "let's send this eagle soaring!"
        ),
        "outro":   (
            "Magnificent work — your USA 250 eagle is soaring with pride! That's 80 dots and one "
            "spectacular symbol of American freedom. Colour the eagle in brown and white, the banner "
            "in red and gold, and the stars in red, white, and blue. Happy anniversary, USA!"
        ),
        "sections": [
            ("1–16",  "The Eagle's Head and Beak",
             "Bald eagles are not actually bald — their name comes from an old English word 'balde,' "
             "meaning white. The striking white head feathers appear when the bird reaches adulthood "
             "at around five years old."),
            ("17–36", "The Outstretched Wings",
             "A bald eagle's wingspan can reach up to 2.4 metres — almost eight feet tip to tip — "
             "making it one of the largest birds of prey in North America. Eagles can soar on thermal "
             "currents for hours without a single wingbeat."),
            ("37–54", "The Tail Feathers and Talons",
             "An eagle's talons can grip with a force of around 400 pounds per square inch — many times "
             "stronger than a human hand. Special spiky soles (spicules) help grip slippery fish pulled "
             "straight from rivers and lakes."),
            ("55–68", "The Patriotic Banner",
             "On the Great Seal of the United States, the eagle holds a ribbon reading 'E Pluribus Unum' "
             "— Latin for 'Out of Many, One' — a motto that has appeared on American coins and documents "
             "since 1782."),
            ("69–80", "The Stars and Finishing Touches",
             "The 50 stars on the American flag each represent one of the 50 states. The most recent "
             "change came in 1960, when Hawaii's star was added. The current 50-star design has been "
             "the official flag for longer than any other version in American history."),
        ],
        "fun_fact": (
            "The bald eagle was adopted as part of the Great Seal of the United States in 1782 — "
            "just six years after the Declaration of Independence was signed!"
        ),
    },
    {
        "title":   "America 250 Birthday Fireworks",
        "emoji":   "🎆",
        "dots":    90,
        "age":     "Ages 6–10",
        "tagline": "Light Up the Sky for America's 250th Birthday!",
        "image":   DATA / "america-250-birthday-fireworks" / "america-250-birthday-fireworks_90_dots_easy_dot_to_dot_puzzle.png",
        "intro":   (
            "America is turning 250 years old — and what better way to mark a quarter millennium than "
            "with a sky full of dazzling fireworks? Fireworks have lit up the Fourth of July since the "
            "very earliest days of the nation, turning the night sky into a canvas of colour and light. "
            "Grab your pencil, find dot 1, and let's set off this spectacular birthday display!"
        ),
        "outro":   (
            "Brilliant work — your America 250 fireworks display is lighting up the sky! That's 90 dots "
            "and one spectacular birthday celebration. Colour the bursts in red, white, and blue to give "
            "America the most patriotic send-off possible. Happy 250th birthday, USA!"
        ),
        "sections": [
            ("1–18",  "The Night Sky",
             "On a clear night away from city lights, you can see up to 4,500 stars with the naked eye. "
             "That same sky greeted the Founding Fathers when they first celebrated independence in 1776."),
            ("19–36", "The First Firework Burst",
             "Fireworks were invented in China over 1,000 years ago. The recipe eventually reached Europe "
             "and then the Americas, where it became the signature sound and light of celebration."),
            ("37–54", "The Cascading Sparks",
             "Different colours in fireworks come from burning different metal salts: strontium = red, "
             "barium = green, copper = blue, sodium = yellow. Mixing salts lets pyrotechnicians paint "
             "the sky with almost any colour they choose."),
            ("55–72", "The Grand Finale Burst",
             "The 'grand finale' tradition came about because early pyrotechnicians wanted to end shows "
             "with maximum impact. Today's grand finales can fire hundreds of shells per minute, turning "
             "the sky almost as bright as daylight for a thrilling few seconds."),
            ("73–90", "Stars, Flag and Finishing Touches",
             "The American flag has 50 stars and 13 stripes representing the original colonies. On the "
             "Fourth of July it is flown from sunrise to sunset at homes, schools, and government "
             "buildings across the entire country."),
        ],
        "fun_fact": (
            "Fireworks have been part of American Independence Day celebrations since the very first "
            "anniversary on 4 July 1777 — just one year after the Declaration of Independence was signed!"
        ),
    },
    {
        "title":   "USA 250 Birthday Balloons and Stars",
        "emoji":   "🎉",
        "dots":    94,
        "age":     "Ages 6–10",
        "tagline": "Party Balloons for America's 250th Birthday!",
        "image":   DATA / "usa-250-birthday-balloons-stars" / "usa-250-birthday-balloons-stars_94_dots_easy_dot_to_dot_puzzle.png",
        "intro":   (
            "America is turning 250 years old, and this puzzle is ready for the party! Balloons, stars, "
            "and bright patriotic details come together in a cheerful birthday scene for the USA. Grab "
            "a pencil, find dot 1, and start connecting your way through the celebration."
        ),
        "outro":   (
            "Fantastic work — your USA 250 birthday balloons are ready for the party! Colour the balloons "
            "and stars in red, white, and blue to finish a bright patriotic celebration for America's "
            "250th birthday."
        ),
        "sections": [
            ("1–18",  "The First Balloons",
             "Modern party balloons are often made from latex, a stretchy natural material. When filled "
             "with air or helium, the balloon expands evenly in every direction, creating its familiar "
             "rounded shape."),
            ("19–38", "The Celebration Cluster",
             "Large balloon displays are popular at parades and community events because they are "
             "lightweight, colourful, and easy to arrange into arches, columns, and festive backdrops."),
            ("39–58", "The Stars",
             "Stars are one of the most familiar American symbols because each star on the United States "
             "flag represents one state in the union. The first flag had just 13 stars for 13 colonies."),
            ("59–76", "The Birthday Details",
             "The United States celebrates Independence Day on July 4 because the Declaration of "
             "Independence was adopted on July 4, 1776 — 250 years before the celebrations of 2026."),
            ("77–94", "The Final Party Lines",
             "America's 250th birthday — the Semiquincentennial — is celebrated on July 4, 2026, "
             "marking 250 years since the bold signing of the Declaration of Independence."),
        ],
        "fun_fact": (
            "Balloons became popular party decorations in the 1800s. Today red, white, and blue balloons "
            "are a cheerful way to decorate parades and community celebrations for America's birthday!"
        ),
    },
]

# ── Helpers ────────────────────────────────────────────────────────────────

def star_points(cx, cy, r_outer, r_inner, n=5):
    """Return list of (x,y) for a star polygon."""
    import math
    pts = []
    for i in range(n * 2):
        r = r_outer if i % 2 == 0 else r_inner
        angle = math.pi / n * i - math.pi / 2
        pts.append((cx + r * math.cos(angle), cy + r * math.sin(angle)))
    return pts


def draw_star(page, cx, cy, r_outer=8, r_inner=3.5, fill=GOLD, color=GOLD):
    pts = star_points(cx, cy, r_outer, r_inner)
    quad = fitz.Quad(*[fitz.Point(p) for p in pts[:4]])
    # Draw as filled polygon via clip path workaround
    shape = page.new_shape()
    shape.draw_polyline([fitz.Point(p) for p in pts] + [fitz.Point(pts[0])])
    shape.finish(color=color, fill=fill, width=0.5)
    shape.commit()


def border_stars(page, count=12, r=6, color=GOLD, fill=GOLD):
    """Draw small stars along top and bottom margins."""
    step = W / (count + 1)
    for i in range(1, count + 1):
        x = step * i
        draw_star(page, x, 22, r, r * 0.42, fill=fill, color=color)
        draw_star(page, x, H - 22, r, r * 0.42, fill=fill, color=color)


def draw_stripe_bg(page, stripe_h=18):
    """Subtle red/white stripes behind header area (top 90pt)."""
    colors = [RED, WHITE] * 5
    for i, c in enumerate(colors[:4]):
        y0 = i * stripe_h
        page.draw_rect(fitz.Rect(0, y0, W, y0 + stripe_h), color=None, fill=c)


def header_bar(page, y=0, height=72):
    """Blue header bar."""
    page.draw_rect(fitz.Rect(0, y, W, y + height), color=None, fill=BLUE)


def footer_bar(page, height=28):
    page.draw_rect(fitz.Rect(0, H - height, W, H), color=None, fill=BLUE)


def cream_bg(page):
    page.draw_rect(fitz.Rect(0, 0, W, H), color=None, fill=CREAM)


def insert_text_wrapped(page, text, rect, fontsize=11, color=BLACK,
                        fontname="helv", lineheight=None, bold=False):
    """Insert wrapped text using fitz textbox."""
    fname = "hebo" if bold else fontname
    page.insert_textbox(
        rect, text,
        fontsize=fontsize,
        fontname=fname,
        color=color,
        align=fitz.TEXT_ALIGN_LEFT,
        lineheight=lineheight,
    )


def page_number(page, num, total=24):
    txt = f"— {num} —"
    page.insert_text(
        fitz.Point(W / 2 - 16, H - 10),
        txt, fontsize=9, color=WHITE, fontname="helv",
    )


# ══════════════════════════════════════════════════════════════════════════════
# PAGE BUILDERS
# ══════════════════════════════════════════════════════════════════════════════

def build_title_page(doc, pg_num):
    page = doc.new_page(width=W, height=H)

    # Background: gradient-like with blue top band and cream body
    page.draw_rect(fitz.Rect(0, 0, W, H), color=None, fill=CREAM)
    page.draw_rect(fitz.Rect(0, 0, W, 200), color=None, fill=BLUE)
    page.draw_rect(fitz.Rect(0, H - 100, W, H), color=None, fill=RED)

    # Gold accent lines
    page.draw_line(fitz.Point(0, 200), fitz.Point(W, 200), color=GOLD, width=4)
    page.draw_line(fitz.Point(0, H - 100), fitz.Point(W, H - 100), color=GOLD, width=4)

    # Stars in header
    border_stars(page, count=14, r=7)

    # Title
    page.insert_text(fitz.Point(36, 80),
        "USA 250", fontsize=52, color=GOLD, fontname="hebo")
    page.insert_text(fitz.Point(36, 128),
        "Dot-to-Dot Activity Book", fontsize=22, color=WHITE, fontname="hebo")
    page.insert_text(fitz.Point(36, 155),
        "Celebrate America's 250th Birthday!", fontsize=14, color=LTBLUE, fontname="helv")

    # Centre graphic placeholder — large star
    draw_star(page, W / 2, 380, r_outer=90, r_inner=38, fill=GOLD, color=GOLD)

    # Puzzle count badges
    page.insert_textbox(
        fitz.Rect(MARGIN, 290, W - MARGIN, 340),
        "4 Fun Dot-to-Dot Puzzles  ·  48 to 94 Dots  ·  Ages 4–10",
        fontsize=13, fontname="hebo", color=BLUE, align=fitz.TEXT_ALIGN_CENTER,
    )

    # Tagline band
    page.insert_textbox(
        fitz.Rect(MARGIN, 460, W - MARGIN, 510),
        "Connect the dots · Learn American history · Colour your creations!",
        fontsize=11, fontname="helv", color=BLACK, align=fitz.TEXT_ALIGN_CENTER,
    )

    # Stars section
    page.insert_textbox(
        fitz.Rect(MARGIN, 520, W - MARGIN, 600),
        "⭐  Gas Balloon  ·  Eagle Kite  ·  Fireworks  ·  Party Balloons  ⭐",
        fontsize=12, fontname="hebo", color=RED, align=fitz.TEXT_ALIGN_CENTER,
    )

    # Bottom band
    page.insert_textbox(
        fitz.Rect(MARGIN, H - 88, W - MARGIN, H - 10),
        "July 4, 1776 – July 4, 2026  ·  250 Years of Freedom!",
        fontsize=12, fontname="hebo", color=WHITE, align=fitz.TEXT_ALIGN_CENTER,
    )
    page_number(page, pg_num)


def build_copyright_page(doc, pg_num):
    page = doc.new_page(width=W, height=H)
    cream_bg(page)
    header_bar(page, height=50)
    footer_bar(page)
    border_stars(page, count=10, r=5)

    page.insert_text(fitz.Point(MARGIN, 38), "USA 250 Dot-to-Dot Activity Book",
                     fontsize=13, color=WHITE, fontname="hebo")

    body_rect = fitz.Rect(MARGIN, 80, W - MARGIN, H - 60)

    text = (
        "USA 250 Dot-to-Dot Activity Book\n"
        "Celebrate America's 250th Birthday!\n\n"
        "First Edition — 2026\n\n"
        "All puzzle designs and text in this book are original creations.\n\n"
        "This book is dedicated to every child who has ever connected a dot, "
        "followed a number, and revealed something wonderful on the other side.\n\n"
        "── ★ ── ★ ── ★ ──\n\n"
        "HOW TO USE THIS BOOK\n\n"
        "Each puzzle in this book comes with:\n\n"
        "  • An introduction that sets the scene\n"
        "  • The dot-to-dot puzzle itself\n"
        "  • Fun facts and guided sections to help you learn\n\n"
        "Start at dot 1. Draw a line to dot 2. Continue in order until you reach "
        "the last dot. Then — the magic! — a picture appears. Use coloured pencils, "
        "markers, or crayons to bring it to life.\n\n"
        "── ★ ── ★ ── ★ ──\n\n"
        "FOR PARENTS AND TEACHERS\n\n"
        "Dot-to-dot puzzles build number recognition, pencil control, hand-eye "
        "coordination, and sequential thinking. The themed content in this book "
        "connects each activity to American history, making every puzzle a mini "
        "lesson in the story of the United States.\n\n"
        "Puzzles are graded by dot count:\n"
        "  • 48 dots  — Beginner (Ages 4–7)\n"
        "  • 80 dots  — Easy (Ages 5–9)\n"
        "  • 90 dots  — Easy-Medium (Ages 6–10)\n"
        "  • 94 dots  — Easy-Medium (Ages 6–10)\n"
    )
    page.insert_textbox(body_rect, text, fontsize=10, fontname="helv",
                        color=BLACK, lineheight=1.6)
    page_number(page, pg_num)


def build_about_america_page(doc, pg_num):
    page = doc.new_page(width=W, height=H)
    cream_bg(page)
    header_bar(page, height=60)
    footer_bar(page)
    border_stars(page, count=12, r=6)

    page.insert_text(fitz.Point(MARGIN, 44),
        "About America's 250th Birthday", fontsize=18, color=GOLD, fontname="hebo")

    # Gold divider
    page.draw_line(fitz.Point(MARGIN, 68), fitz.Point(W - MARGIN, 68), color=GOLD, width=2)

    body_rect = fitz.Rect(MARGIN, 80, W - MARGIN, H - 50)
    text = (
        "On July 4, 2026, the United States of America celebrates its 250th birthday "
        "— a milestone known as the Semiquincentennial.\n\n"
        "It all began on July 4, 1776, when the Continental Congress adopted the "
        "Declaration of Independence, proclaiming to the world that thirteen American "
        "colonies were now free and independent states. That bold act changed history "
        "forever.\n\n"
        "★  KEY MOMENTS IN 250 YEARS  ★\n\n"
        "1776  The Declaration of Independence is signed in Philadelphia.\n\n"
        "1787  The U.S. Constitution is written — still the world's longest-surviving "
        "written national constitution.\n\n"
        "1793  The first gas balloon flight in America launches from Philadelphia, "
        "watched by President George Washington.\n\n"
        "1800  The capital moves to Washington, D.C., the city built specifically "
        "to be the seat of American government.\n\n"
        "1865  The Civil War ends. The 13th Amendment abolishes slavery, fulfilling "
        "the promise of freedom for all Americans.\n\n"
        "1903  The Wright Brothers make the first powered aeroplane flight at "
        "Kitty Hawk, North Carolina.\n\n"
        "1969  Astronaut Neil Armstrong becomes the first human to walk on the Moon, "
        "planting an American flag on the lunar surface.\n\n"
        "1976  The United States celebrates its Bicentennial — 200 years of "
        "independence — with fireworks and festivities nationwide.\n\n"
        "2026  America's 250th birthday! The Semiquincentennial is celebrated with "
        "parades, fireworks, art, music, and activities like this book.\n\n"
        "From those first 13 colonies to 50 states spanning a continent, America's "
        "story is one of courage, discovery, and the enduring belief that all people "
        "are created equal. Happy 250th birthday, USA! 🎉"
    )
    page.insert_textbox(body_rect, text, fontsize=10, fontname="helv",
                        color=BLACK, lineheight=1.55)
    page_number(page, pg_num)


def build_puzzle_intro_page(doc, pg_num, puzzle, puzzle_num):
    page = doc.new_page(width=W, height=H)
    cream_bg(page)
    header_bar(page, height=66)
    footer_bar(page)
    border_stars(page, count=12, r=6)

    # Puzzle number badge
    page.draw_circle(fitz.Point(MARGIN + 20, 33), 18, color=GOLD, fill=GOLD)
    page.insert_text(fitz.Point(MARGIN + 13, 39),
        str(puzzle_num), fontsize=16, color=BLUE, fontname="hebo")

    # Title
    page.insert_text(fitz.Point(MARGIN + 50, 30),
        puzzle["title"], fontsize=18, color=GOLD, fontname="hebo")
    page.insert_text(fitz.Point(MARGIN + 50, 52),
        f"{puzzle['dots']} Dots  ·  {puzzle['age']}", fontsize=11, color=WHITE, fontname="helv")

    # Gold divider
    page.draw_line(fitz.Point(MARGIN, 74), fitz.Point(W - MARGIN, 74), color=GOLD, width=2)

    y = 88
    # Tagline
    page.insert_textbox(
        fitz.Rect(MARGIN, y, W - MARGIN, y + 28),
        puzzle["tagline"],
        fontsize=13, fontname="hebo", color=RED, align=fitz.TEXT_ALIGN_CENTER,
    )
    y += 36

    # Intro paragraph
    page.insert_textbox(
        fitz.Rect(MARGIN, y, W - MARGIN, y + 90),
        puzzle["intro"],
        fontsize=10.5, fontname="helv", color=BLACK, lineheight=1.55,
    )
    y += 98

    # Section guide header
    page.draw_rect(fitz.Rect(MARGIN, y, W - MARGIN, y + 20), color=None, fill=BLUE)
    page.insert_text(fitz.Point(MARGIN + 8, y + 14),
        "DRAWING GUIDE — WHAT YOU ARE DRAWING AND WHY", fontsize=9, color=WHITE, fontname="hebo")
    y += 26

    for rng, title, fact in puzzle["sections"]:
        if y > H - 130:
            break
        # Section header strip
        page.draw_rect(fitz.Rect(MARGIN, y, W - MARGIN, y + 17), color=None, fill=LTBLUE)
        page.insert_text(fitz.Point(MARGIN + 6, y + 12),
            f"Dots {rng}  ·  {title}", fontsize=9.5, color=BLUE, fontname="hebo")
        y += 20
        # Fact text
        tb_rect = fitz.Rect(MARGIN + 4, y, W - MARGIN, y + 44)
        page.insert_textbox(tb_rect, fact, fontsize=9, fontname="helv",
                            color=BLACK, lineheight=1.45)
        y += 50

    # Fun fact callout box
    y = max(y, H - 150)
    if y < H - 90:
        page.draw_rect(fitz.Rect(MARGIN, y, W - MARGIN, y + 65),
                       color=GOLD, fill=(1.0, 0.98, 0.88), width=1.5)
        page.insert_text(fitz.Point(MARGIN + 8, y + 16),
            "★  DID YOU KNOW?", fontsize=10, color=RED, fontname="hebo")
        page.insert_textbox(
            fitz.Rect(MARGIN + 8, y + 20, W - MARGIN - 6, y + 62),
            puzzle["fun_fact"],
            fontsize=9, fontname="helv", color=BLACK, lineheight=1.45,
        )

    page_number(page, pg_num)


def build_puzzle_page(doc, pg_num, puzzle, puzzle_num):
    page = doc.new_page(width=W, height=H)
    # White background for the puzzle page — clean look
    page.draw_rect(fitz.Rect(0, 0, W, H), color=None, fill=WHITE)

    # Thin blue border
    page.draw_rect(fitz.Rect(18, 18, W - 18, H - 18), color=BLUE, width=2)
    page.draw_rect(fitz.Rect(22, 22, W - 22, H - 22), color=GOLD, width=1)

    # Header strip
    page.draw_rect(fitz.Rect(18, 18, W - 18, 54), color=None, fill=BLUE)
    page.insert_text(fitz.Point(30, 42),
        f"Puzzle {puzzle_num}: {puzzle['title']}  ·  {puzzle['dots']} Dots  ·  {puzzle['age']}",
        fontsize=11, color=WHITE, fontname="hebo")

    # Star decoration in header
    for sx in [W - 80, W - 60, W - 40]:
        draw_star(page, sx, 36, r_outer=7, r_inner=3, fill=GOLD, color=GOLD)

    # Instructions line
    page.insert_textbox(
        fitz.Rect(30, 58, W - 30, 76),
        "Start at dot 1 ➔ connect in order ➔ reveal the picture ➔ colour it in!",
        fontsize=9, fontname="helv", color=BLUE, align=fitz.TEXT_ALIGN_CENTER,
    )

    # Insert puzzle image
    img_path = puzzle["image"]
    if img_path.exists():
        img_rect = fitz.Rect(30, 78, W - 30, H - 60)
        page.insert_image(img_rect, filename=str(img_path), keep_proportion=True)
    else:
        page.insert_textbox(
            fitz.Rect(100, 300, W - 100, 400),
            f"[Puzzle image: {img_path.name}]",
            fontsize=14, fontname="helv", color=RED, align=fitz.TEXT_ALIGN_CENTER,
        )

    # Outro / completion message
    page.insert_textbox(
        fitz.Rect(30, H - 54, W - 30, H - 28),
        puzzle["outro"],
        fontsize=8, fontname="helv", color=BLUE, align=fitz.TEXT_ALIGN_CENTER,
    )

    # Footer dots
    for dx in range(8):
        page.draw_circle(fitz.Point(40 + dx * 68, H - 14), 3,
                         color=None, fill=RED if dx % 2 == 0 else BLUE)

    page_number(page, pg_num)


def build_coloring_tips_page(doc, pg_num):
    page = doc.new_page(width=W, height=H)
    cream_bg(page)
    header_bar(page, height=60)
    footer_bar(page)
    border_stars(page, count=12, r=6)

    page.insert_text(fitz.Point(MARGIN, 42),
        "Colouring Tips & Tricks", fontsize=20, color=GOLD, fontname="hebo")
    page.draw_line(fitz.Point(MARGIN, 68), fitz.Point(W - MARGIN, 68), color=GOLD, width=2)

    body_rect = fitz.Rect(MARGIN, 80, W - MARGIN, H - 50)
    text = (
        "Now that you've completed your dot-to-dot puzzles, it's time to bring them "
        "to life with colour! Here are some tips to make your pictures look fantastic.\n\n"
        "── ★ PATRIOTIC COLOUR PALETTE ★ ──\n\n"
        "For all your USA 250 puzzles, the classic colours are:\n"
        "  🔴  RED   — for balloons, firework bursts, and flag stripes\n"
        "  🔵  BLUE  — for the sky, flag canton, and banner backgrounds\n"
        "  ⚪  WHITE — for the eagle's head, stars on the flag, and highlights\n"
        "  🟡  GOLD  — for banner borders, eagle talons, and star accents\n"
        "  🟤  BROWN — for the eagle's body feathers and wicker baskets\n\n"
        "── ★ COLOURING TECHNIQUES ★ ──\n\n"
        "PENCIL CONTROL\n"
        "Colour in small, circular motions rather than back-and-forth strokes. "
        "This gives a smoother, more even colour with no white streaks.\n\n"
        "LAYERING\n"
        "Apply a light layer first, then add more pressure for darker areas. "
        "Layering two colours — for example, red over orange — creates beautiful depth.\n\n"
        "SHADING\n"
        "Colour the edges of a shape darker than the middle to make it look rounded "
        "and three-dimensional. Try this on the balloon envelope!\n\n"
        "LEAVING HIGHLIGHTS\n"
        "Leave a small white area near the top of round shapes (like balloons) "
        "uncoloured. This looks like light reflecting off a shiny surface.\n\n"
        "── ★ CHOOSING YOUR TOOLS ★ ──\n\n"
        "Coloured pencils   — Best for fine details and gentle shading.\n"
        "Felt-tip markers   — Great for bold, bright fills on larger areas.\n"
        "Watercolour paints — Beautiful for skies and backgrounds; let dry fully.\n"
        "Crayons            — Fun and easy for younger artists.\n\n"
        "── ★ TOP TIP ★ ──\n\n"
        "Always test your colours on a spare piece of paper first to make sure "
        "they look the way you want before colouring your finished puzzle. "
        "Take your time — the slower and more carefully you colour, the better "
        "the result will be. Every masterpiece is worth the patience!"
    )
    page.insert_textbox(body_rect, text, fontsize=9.5, fontname="helv",
                        color=BLACK, lineheight=1.55)
    page_number(page, pg_num)


def build_usa_facts_page(doc, pg_num):
    page = doc.new_page(width=W, height=H)
    cream_bg(page)
    header_bar(page, height=60)
    footer_bar(page)
    border_stars(page, count=12, r=6)

    page.insert_text(fitz.Point(MARGIN, 42),
        "Amazing USA Facts!", fontsize=20, color=GOLD, fontname="hebo")
    page.draw_line(fitz.Point(MARGIN, 68), fitz.Point(W - MARGIN, 68), color=GOLD, width=2)

    body_rect = fitz.Rect(MARGIN, 80, W - MARGIN, H - 50)
    text = (
        "Learn these fun facts to impress your friends and family while you celebrate "
        "America's 250th birthday!\n\n"
        "🇺🇸  THE UNITED STATES IN NUMBERS\n\n"
        "50  — the number of states in the Union\n"
        "13  — the number of original colonies that became states\n"
        "250 — years America celebrates in 2026\n"
        "4   — the date in July when America celebrates Independence Day\n"
        "1776 — the year the Declaration of Independence was signed\n"
        "538 — the number of electoral votes in a U.S. presidential election\n\n"
        "🦅  THE BALD EAGLE\n\n"
        "The bald eagle became the national bird of the United States in 1782. "
        "It was chosen because it represents freedom, strength, and long life. "
        "By the 1960s, bald eagles were nearly extinct due to hunting and pesticides. "
        "Thanks to conservation efforts, over 300,000 bald eagles soar across "
        "North America today!\n\n"
        "🎆  FOURTH OF JULY FIREWORKS\n\n"
        "Americans spend over one billion dollars on fireworks every year for the "
        "Fourth of July! The largest fireworks display in the United States is held "
        "in New York City over the East River each year.\n\n"
        "🎈  GAS BALLOONS IN AMERICA\n\n"
        "The first person to cross the English Channel in a gas balloon was Jean-Pierre "
        "Blanchard — the same man who made the first balloon flight in America in 1793. "
        "Today, the Albuquerque International Balloon Fiesta in New Mexico is the "
        "largest hot-air balloon festival in the world, drawing nearly 100,000 visitors.\n\n"
        "⭐  THE AMERICAN FLAG\n\n"
        "The current 50-star flag was designed by Robert G. Heft in 1958, when he was "
        "just 17 years old — as a school project! His teacher initially gave him a B-minus "
        "for the design. When President Eisenhower chose it as the official flag in 1960, "
        "Heft's teacher changed the grade to an A!\n\n"
        "📜  THE DECLARATION OF INDEPENDENCE\n\n"
        "The Declaration of Independence has 1,320 words and was signed by 56 delegates. "
        "The original document is kept at the National Archives in Washington, D.C., "
        "where millions of people visit it every year."
    )
    page.insert_textbox(body_rect, text, fontsize=9.5, fontname="helv",
                        color=BLACK, lineheight=1.55)
    page_number(page, pg_num)


def build_word_scramble_page(doc, pg_num):
    page = doc.new_page(width=W, height=H)
    cream_bg(page)
    header_bar(page, height=60)
    footer_bar(page)
    border_stars(page, count=12, r=6)

    page.insert_text(fitz.Point(MARGIN, 42),
        "USA 250 Word Scramble!", fontsize=20, color=GOLD, fontname="hebo")
    page.draw_line(fitz.Point(MARGIN, 68), fitz.Point(W - MARGIN, 68), color=GOLD, width=2)

    page.insert_textbox(
        fitz.Rect(MARGIN, 76, W - MARGIN, 106),
        "Unscramble each word below — they are all connected to America's 250th birthday!",
        fontsize=10.5, fontname="helv", color=BLACK, lineheight=1.4,
    )

    scrambles = [
        ("NDECENDEEPIN",   "_ _ _ _ _ _ _ _ _ _ _ _",  "(Declaration of _____)"),
        ("MRECAIA",         "_ _ _ _ _ _ _",             "(name of the country)"),
        ("DELIPALHAPHI",    "_ _ _ _ _ _ _ _ _ _ _ _",  "(city where it began)"),
        ("ERDIGEFISW",      "_ _ _ _ _ _ _ _ _ _",      "(fireworks go off with a ___)"),
        ("ELLDBA GEALE",    "_ _ _ _ _   _ _ _ _ _",    "(national bird)"),
        ("SYRTIFEODMN",     "_ _ _ _ _ _ _ _ _ _ _",    "(the 4th of July is _ Day)"),
        ("LLNOBOA",         "_ _ _ _ _ _ _",             "(floats in the air)"),
        ("RLGSEATNSP",      "_ _ _ _ _ _ _ _ _ _",      "(stars and _____ on the flag)"),
        ("TOTCDIO",         "_ _ _ _ _ _ _",             "(connect the ___)"),
        ("MSENIQNIUTLECNA", "_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _",  "(250th anniversary word)"),
    ]

    y = 114
    for i, (scrambled, blanks, hint) in enumerate(scrambles):
        # Alternating row backgrounds
        if i % 2 == 0:
            page.draw_rect(fitz.Rect(MARGIN, y - 2, W - MARGIN, y + 46),
                           color=None, fill=LTBLUE)

        # Number
        page.insert_text(fitz.Point(MARGIN + 4, y + 14),
            f"{i+1:2d}.", fontsize=10, color=BLUE, fontname="hebo")

        # Scrambled word in red
        page.insert_text(fitz.Point(MARGIN + 30, y + 14),
            scrambled, fontsize=11, color=RED, fontname="hebo")

        # Hint
        page.insert_text(fitz.Point(MARGIN + 30, y + 28),
            hint, fontsize=9, color=BLACK, fontname="helv")

        # Answer blanks
        page.insert_text(fitz.Point(MARGIN + 30, y + 42),
            f"Answer: {blanks}", fontsize=9, color=(0.5, 0.5, 0.5), fontname="helv")

        y += 52

    # Answers section (upside down would be ideal but we put it at bottom in small text)
    page.draw_rect(fitz.Rect(MARGIN, H - 90, W - MARGIN, H - 40),
                   color=GOLD, fill=(1.0, 0.98, 0.88), width=1)
    page.insert_text(fitz.Point(MARGIN + 6, H - 74),
        "ANSWERS (read upside-down!):", fontsize=8, color=BLUE, fontname="hebo")
    answers = ("INDEPENDENCE · AMERICA · PHILADELPHIA · FIREWORKS · BALD EAGLE · "
               "FREEDOM · BALLOON · STARSTRIPES → STRIPES · DOT-TO-DOT · SEMIQUINCENTENNIAL")
    page.insert_textbox(
        fitz.Rect(MARGIN + 6, H - 68, W - MARGIN - 6, H - 44),
        answers, fontsize=7.5, fontname="helv", color=BLACK,
    )
    page_number(page, pg_num)


def build_quiz_page(doc, pg_num):
    page = doc.new_page(width=W, height=H)
    cream_bg(page)
    header_bar(page, height=60)
    footer_bar(page)
    border_stars(page, count=12, r=6)

    page.insert_text(fitz.Point(MARGIN, 42),
        "USA 250 Quiz — Test Your Knowledge!", fontsize=18, color=GOLD, fontname="hebo")
    page.draw_line(fitz.Point(MARGIN, 68), fitz.Point(W - MARGIN, 68), color=GOLD, width=2)

    page.insert_textbox(
        fitz.Rect(MARGIN, 76, W - MARGIN, 98),
        "Circle the correct answer for each question. Answers are at the bottom of the page!",
        fontsize=10, fontname="helv", color=BLACK,
    )

    questions = [
        ("In what year was the Declaration of Independence signed?",
         ["A) 1620", "B) 1776", "C) 1812", "D) 1865"], "B"),
        ("What is the national bird of the United States?",
         ["A) Turkey", "B) Robin", "C) Bald Eagle", "D) Blue Jay"], "C"),
        ("How many stars are on the current American flag?",
         ["A) 13", "B) 48", "C) 50", "D) 52"], "C"),
        ("What is America's 250th birthday celebration called?",
         ["A) Bicentennial", "B) Tricentennial", "C) Sesquicentennial", "D) Semiquincentennial"], "D"),
        ("Who watched the first gas balloon flight in America in 1793?",
         ["A) Abraham Lincoln", "B) George Washington", "C) Thomas Jefferson", "D) Benjamin Franklin"], "B"),
        ("How many original colonies became the first states?",
         ["A) 13", "B) 15", "C) 26", "D) 50"], "A"),
        ("What date is Independence Day celebrated in the United States?",
         ["A) June 14", "B) July 1", "C) July 4", "D) August 15"], "C"),
        ("What does 'E Pluribus Unum' mean?",
         ["A) Land of the Free", "B) Out of Many, One", "C) In God We Trust", "D) We the People"], "B"),
    ]

    y = 104
    for i, (q, opts, ans) in enumerate(questions):
        if y > H - 130:
            break
        bg = LTBLUE if i % 2 == 0 else CREAM
        page.draw_rect(fitz.Rect(MARGIN, y, W - MARGIN, y + 56), color=None, fill=bg)

        # Question
        page.insert_text(fitz.Point(MARGIN + 6, y + 14),
            f"Q{i+1}.  {q}", fontsize=9.5, color=BLUE, fontname="hebo")

        # Options in two columns
        col1_x, col2_x = MARGIN + 12, W // 2 + 10
        page.insert_text(fitz.Point(col1_x, y + 30), opts[0], fontsize=9, color=BLACK, fontname="helv")
        page.insert_text(fitz.Point(col2_x, y + 30), opts[1], fontsize=9, color=BLACK, fontname="helv")
        page.insert_text(fitz.Point(col1_x, y + 44), opts[2], fontsize=9, color=BLACK, fontname="helv")
        page.insert_text(fitz.Point(col2_x, y + 44), opts[3], fontsize=9, color=BLACK, fontname="helv")

        y += 62

    # Answers box
    page.draw_rect(fitz.Rect(MARGIN, H - 86, W - MARGIN, H - 40),
                   color=GOLD, fill=(1.0, 0.98, 0.88), width=1.5)
    page.insert_text(fitz.Point(MARGIN + 8, H - 70),
        "ANSWERS:", fontsize=9, color=RED, fontname="hebo")
    ans_text = "Q1: B  ·  Q2: C  ·  Q3: C  ·  Q4: D  ·  Q5: B  ·  Q6: A  ·  Q7: C  ·  Q8: B"
    page.insert_text(fitz.Point(MARGIN + 8, H - 54), ans_text, fontsize=9, color=BLACK, fontname="helv")
    score_text = "Score: 8/8 = Patriot Expert!  ·  6-7 = Star-Spangled Scholar  ·  4-5 = History Explorer"
    page.insert_text(fitz.Point(MARGIN + 8, H - 44), score_text, fontsize=8, color=BLUE, fontname="helv")
    page_number(page, pg_num)


def build_certificate_page(doc, pg_num):
    page = doc.new_page(width=W, height=H)
    page.draw_rect(fitz.Rect(0, 0, W, H), color=None, fill=CREAM)

    # Ornate border — double rectangle
    page.draw_rect(fitz.Rect(18, 18, W - 18, H - 18), color=BLUE, width=3)
    page.draw_rect(fitz.Rect(26, 26, W - 26, H - 26), color=GOLD, width=1.5)
    page.draw_rect(fitz.Rect(30, 30, W - 30, H - 30), color=RED,  width=0.75)

    # Corner stars
    for cx, cy in [(50, 50), (W - 50, 50), (50, H - 50), (W - 50, H - 50)]:
        draw_star(page, cx, cy, r_outer=16, r_inner=7, fill=GOLD, color=GOLD)

    # Centre content
    page.insert_textbox(
        fitz.Rect(60, 60, W - 60, 120),
        "★  CERTIFICATE OF ACHIEVEMENT  ★",
        fontsize=18, fontname="hebo", color=BLUE, align=fitz.TEXT_ALIGN_CENTER,
    )

    page.draw_line(fitz.Point(80, 126), fitz.Point(W - 80, 126), color=GOLD, width=2)

    page.insert_textbox(
        fitz.Rect(60, 138, W - 60, 186),
        "USA 250 Dot-to-Dot Activity Book",
        fontsize=14, fontname="hebo", color=RED, align=fitz.TEXT_ALIGN_CENTER,
    )

    page.insert_textbox(
        fitz.Rect(60, 190, W - 60, 230),
        "This certifies that",
        fontsize=13, fontname="helv", color=BLACK, align=fitz.TEXT_ALIGN_CENTER,
    )

    # Name line
    page.draw_line(fitz.Point(130, 262), fitz.Point(W - 130, 262), color=BLUE, width=1.5)
    page.insert_textbox(
        fitz.Rect(130, 264, W - 130, 280),
        "(write your name here)",
        fontsize=9, fontname="helv", color=(0.5, 0.5, 0.5), align=fitz.TEXT_ALIGN_CENTER,
    )

    page.insert_textbox(
        fitz.Rect(60, 282, W - 60, 360),
        (
            "has successfully completed all four USA 250 Dot-to-Dot puzzles\n"
            "and celebrated America's 250th birthday with creativity, patience,\n"
            "and patriotic spirit!"
        ),
        fontsize=12, fontname="helv", color=BLACK, align=fitz.TEXT_ALIGN_CENTER,
        lineheight=1.7,
    )

    # Big star
    draw_star(page, W / 2, 450, r_outer=50, r_inner=22, fill=GOLD, color=GOLD)
    page.insert_textbox(
        fitz.Rect(W/2 - 30, 432, W/2 + 30, 470),
        "250",
        fontsize=18, fontname="hebo", color=BLUE, align=fitz.TEXT_ALIGN_CENTER,
    )

    page.insert_textbox(
        fitz.Rect(60, 510, W - 60, 560),
        "July 4, 1776  —  July 4, 2026",
        fontsize=13, fontname="hebo", color=RED, align=fitz.TEXT_ALIGN_CENTER,
    )
    page.insert_textbox(
        fitz.Rect(60, 558, W - 60, 590),
        "250 Years of Freedom, Courage, and Discovery!",
        fontsize=11, fontname="helv", color=BLUE, align=fitz.TEXT_ALIGN_CENTER,
    )

    # Signature lines
    for lx, label in [(80, "Parent / Teacher"), (W / 2 + 20, "Date")]:
        page.draw_line(fitz.Point(lx, 650), fitz.Point(lx + 180, 650), color=BLACK, width=0.75)
        page.insert_text(fitz.Point(lx, 665), label, fontsize=8, color=BLACK, fontname="helv")

    # Row of stars at bottom
    for i in range(9):
        draw_star(page, 80 + i * 56, 700, r_outer=10, r_inner=4, fill=GOLD, color=GOLD)

    page.insert_textbox(
        fitz.Rect(60, 718, W - 60, 745),
        "Happy Birthday, USA!  🎉🎆🦅🎈",
        fontsize=14, fontname="hebo", color=RED, align=fitz.TEXT_ALIGN_CENTER,
    )
    page_number(page, pg_num)


def build_back_matter_page(doc, pg_num):
    page = doc.new_page(width=W, height=H)
    cream_bg(page)
    header_bar(page, height=60)
    footer_bar(page)
    border_stars(page, count=12, r=6)

    page.insert_text(fitz.Point(MARGIN, 42),
        "About Dot-to-Dot Puzzles", fontsize=20, color=GOLD, fontname="hebo")
    page.draw_line(fitz.Point(MARGIN, 68), fitz.Point(W - MARGIN, 68), color=GOLD, width=2)

    body_rect = fitz.Rect(MARGIN, 80, W - MARGIN, H - 50)
    text = (
        "WHY DOT-TO-DOT?\n\n"
        "Dot-to-dot puzzles have been a favourite children's activity for over a century. "
        "They were first published in newspapers and magazines in the early 1900s, delighting "
        "children and adults alike with the magic of a hidden picture that only reveals itself "
        "when every dot is connected.\n\n"
        "── ★ SKILLS YOU PRACTISE ★ ──\n\n"
        "NUMBER RECOGNITION\n"
        "Following dots in the right order means reading and recognising numbers quickly. "
        "This skill is foundational for mathematics and logical thinking.\n\n"
        "PENCIL CONTROL\n"
        "Drawing a line from dot to dot with precision builds the fine motor skills "
        "children need for handwriting, drawing, and many everyday tasks.\n\n"
        "SEQUENTIAL THINKING\n"
        "Every dot-to-dot puzzle teaches children that order matters — that following "
        "a sequence step-by-step leads to a satisfying result. This is a fundamental "
        "problem-solving skill used in coding, cooking, music, and more.\n\n"
        "PATIENCE AND FOCUS\n"
        "Larger puzzles (like the 94-dot Birthday Balloons!) require sustained concentration. "
        "Completing a long puzzle builds the 'sticking with it' habit that helps in school "
        "and in life.\n\n"
        "CREATIVITY\n"
        "Once the puzzle is done, colouring it in is a free creative exercise. There are "
        "no rules about which colours to choose — the finished picture belongs entirely "
        "to the artist!\n\n"
        "── ★ TIPS FOR PARENTS AND TEACHERS ★ ──\n\n"
        "• Work through the first puzzle together with your child to build confidence.\n"
        "• Let children choose their own colour palette — even purple eagles are wonderful!\n"
        "• Read the 'Did You Know?' facts aloud for a mini history lesson.\n"
        "• Display finished colouring pages as art — a pride boost that encourages more!\n"
        "• Use the quiz and word scramble for classroom group activities.\n\n"
        "── ★ ── ★ ── ★ ──\n\n"
        "Thank you for celebrating America's 250th birthday with us! We hope these "
        "puzzles brought joy, learning, and a little patriotic pride to your home "
        "or classroom. Happy 250th birthday, USA! 🎉"
    )
    page.insert_textbox(body_rect, text, fontsize=9.5, fontname="helv",
                        color=BLACK, lineheight=1.55)
    page_number(page, pg_num)


# ══════════════════════════════════════════════════════════════════════════════
# MAIN BUILD
# ══════════════════════════════════════════════════════════════════════════════

def build_book():
    doc = fitz.open()
    pg = 1

    # 1. Title page
    build_title_page(doc, pg); pg += 1

    # 2. Copyright / how to use
    build_copyright_page(doc, pg); pg += 1

    # 3. About America 250
    build_about_america_page(doc, pg); pg += 1

    # 4–15: 4 puzzles × 3 pages each (intro, puzzle, fun facts reuse intro page)
    for i, puzzle in enumerate(PUZZLES, start=1):
        build_puzzle_intro_page(doc, pg, puzzle, i); pg += 1
        build_puzzle_page(doc, pg, puzzle, i);       pg += 1
        # Third page: extended fun facts / outro as a "well done" page
        # We reuse intro builder with variation
        p = doc.new_page(width=W, height=H)
        cream_bg(p)
        header_bar(p, height=60)
        footer_bar(p)
        border_stars(p, count=12, r=6)

        p.insert_text(fitz.Point(MARGIN, 42),
            f"Well Done! — {puzzle['title']}", fontsize=16, color=GOLD, fontname="hebo")
        p.draw_line(fitz.Point(MARGIN, 68), fitz.Point(W - MARGIN, 68), color=GOLD, width=2)

        # Outro
        p.insert_textbox(
            fitz.Rect(MARGIN, 78, W - MARGIN, 138),
            puzzle["outro"],
            fontsize=11, fontname="hebo", color=RED, lineheight=1.5,
        )

        # Fun facts recap
        p.draw_rect(fitz.Rect(MARGIN, 144, W - MARGIN, 166), color=None, fill=BLUE)
        p.insert_text(fitz.Point(MARGIN + 8, 160),
            "WHAT DID YOU LEARN? — SECTION FACTS RECAP", fontsize=9, color=WHITE, fontname="hebo")

        y2 = 172
        for rng, title, fact in puzzle["sections"]:
            if y2 > H - 80:
                break
            p.draw_rect(fitz.Rect(MARGIN, y2, W - MARGIN, y2 + 15), color=None, fill=LTBLUE)
            p.insert_text(fitz.Point(MARGIN + 4, y2 + 11),
                f"★ Dots {rng}  ·  {title}", fontsize=8.5, color=BLUE, fontname="hebo")
            y2 += 18
            p.insert_textbox(
                fitz.Rect(MARGIN + 4, y2, W - MARGIN, y2 + 36),
                fact, fontsize=8.5, fontname="helv", color=BLACK, lineheight=1.4,
            )
            y2 += 42

        # Fun fact callout
        if y2 < H - 90:
            p.draw_rect(fitz.Rect(MARGIN, H - 88, W - MARGIN, H - 40),
                        color=GOLD, fill=(1.0, 0.98, 0.88), width=1.5)
            p.insert_text(fitz.Point(MARGIN + 8, H - 72),
                "★  DID YOU KNOW?", fontsize=10, color=RED, fontname="hebo")
            p.insert_textbox(
                fitz.Rect(MARGIN + 8, H - 68, W - MARGIN - 8, H - 44),
                puzzle["fun_fact"], fontsize=9, fontname="helv", color=BLACK, lineheight=1.4,
            )

        page_number(p, pg)
        pg += 1

    # 16. Colouring tips
    build_coloring_tips_page(doc, pg); pg += 1

    # 17. Amazing USA facts
    build_usa_facts_page(doc, pg); pg += 1

    # 18. Word scramble
    build_word_scramble_page(doc, pg); pg += 1

    # 19. Quiz
    build_quiz_page(doc, pg); pg += 1

    # 20. Certificate
    build_certificate_page(doc, pg); pg += 1

    # 21. About / back matter
    build_back_matter_page(doc, pg); pg += 1

    # Pad to 24 pages if needed with blank pages
    while doc.page_count < 24:
        p = doc.new_page(width=W, height=H)
        cream_bg(p)
        footer_bar(p)
        page_number(p, pg)
        pg += 1

    total = doc.page_count
    print(f"Book built: {total} pages")

    out_path = BASE / "public" / "usa-250-kdp-activity-book-interior.pdf"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    doc.save(str(out_path), garbage=4, deflate=True)
    doc.close()
    print(f"Saved: {out_path}")
    return out_path


if __name__ == "__main__":
    out = build_book()
    print(f"\nKDP interior PDF ready:\n   {out}")
