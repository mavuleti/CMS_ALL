# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mobile-and-links.spec.ts >> Dinosaurs page — content >> Brontosaurus detail page uses the replacement PDF
- Location: tests\mobile-and-links.spec.ts:195:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/dots:\s*1.*50/i)
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText(/dots:\s*1.*50/i)

```

```yaml
- link "Skip to content":
  - /url: "#main-content"
- banner:
  - navigation "categories.heading":
    - link "DotToDotFreePrintables — Home":
      - /url: /en/
      - text: DotToDotFreePrintables
    - navigation "Browse categories":
      - link "Home":
        - /url: /en/
      - link "Flowers":
        - /url: /en/flowers/
      - link "Cute":
        - /url: /en/cute/
      - link "Playgrounds":
        - /url: /en/playgrounds/
      - link "Dinosaurs":
        - /url: /en/dinosaurs/
      - link "Ocean":
        - /url: /en/ocean/
      - link "Circus":
        - /url: /en/circus/
      - link "More":
        - /url: /en/#categories
- link "Scan me":
  - /url: /en/
  - img "Scan me"
- text: Scan me
- main:
  - navigation "Breadcrumb":
    - link "Home":
      - /url: /en/
    - link "Dinosaurs":
      - /url: /en/dinosaurs/
    - text: Brontosaurus
  - img "Long-necked Brontosaurus stretching across 50 dots on a preschool printable"
  - paragraph: Free Dinosaurs Printable
  - heading "Brontosaurus Dot to Dot — Thunder Lizard in 50 Dots" [level=1]
  - paragraph: Connect 50 easy dots to reveal a cheerful Brontosaurus with a long neck and sweeping tail. This printable worksheet helps preschool and early elementary children practise number sequencing, pencil control, and concentration.
  - text: Ages 4-7 Dots 1–50 Free
  - paragraph: Difficulty
  - 'img "Difficulty: 1"'
  - text: Easy
  - strong: "Fun fact:"
  - text: "\"Brontosaurus\" means thunder lizard, a name inspired by its enormous size!"
  - strong: Downloaded
  - text: 1,004+ times Great choice!
  - link "Download US Letter – Download Brontosaurus":
    - /url: /dinosaurs/brontosaurus-dot-to-dot-printable-horizontal.pdf
    - text: Download US Letter
  - link "Download A4 – Download Brontosaurus":
    - /url: /dinosaurs/brontosaurus-dot-to-dot-printable-horizontal_A4.pdf
    - text: Download A4
  - paragraph: For personal and classroom use.
  - group "Share":
    - text: Share
    - link "Share — WhatsApp":
      - /url: https://wa.me/?text=Share%20Brontosaurus%20https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2Fbrontosaurus-dot-to-dot-puzzle%2F
    - link "Share — Facebook":
      - /url: https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2Fbrontosaurus-dot-to-dot-puzzle%2F
    - link "Share — Pinterest":
      - /url: https://pinterest.com/pin/create/button/?url=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2Fbrontosaurus-dot-to-dot-puzzle%2F&media=http%3A%2F%2F127.0.0.1%3A4444%2Fimages%2Fbrontosaurus-puzzle.webp&description=Share%20Brontosaurus
    - link "Share — X":
      - /url: https://twitter.com/intent/tweet?url=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2Fbrontosaurus-dot-to-dot-puzzle%2F&text=Share%20Brontosaurus
    - button "Copy link"
    - status
  - paragraph: No sign-up required.
  - link "Back to all Dinosaurs puzzles":
    - /url: /en/dinosaurs/
  - heading "Brontosaurus Dot-to-Dot Puzzle Guide" [level=2]
  - paragraph: Welcome to one of the most loveable dinosaur puzzles in the whole collection! The Brontosaurus — whose name means "thunder lizard" — was one of the biggest creatures ever to walk our planet. Grab a pencil, find dot number one, and let's bring this gentle giant back to life, one line at a time!
  - heading "1–8 — The Head" [level=3]
  - paragraph: Start at dot 1 and connect through to dot 8 to trace the Brontosaurus's surprisingly small, wedge-shaped head. Children practise short, careful pencil strokes and gentle curved lines here — a lovely way to build early pencil control before tackling bigger shapes.
  - text: Fun fact Brontosaurus had peg-like teeth designed only for stripping leaves off branches, not for chewing. It swallowed plants whole and let its massive stomach do the hard work — a pretty clever system, really!
  - heading "9–18 — The Long Neck" [level=3]
  - paragraph: Now here comes the showstopper. Connect dots 9 through 18 to draw that famously long, sweeping neck that curves gracefully upward. This is a brilliant section for practising smooth, flowing lines — children discover that longer curves need more patience and a steadier hand.
  - text: Fun fact The Brontosaurus's neck stretched up to 20 feet long — roughly the height of a two-storey house! Scientists now believe it grazed mainly at low to mid-level plants rather than craning up into treetops the way a giraffe does.
  - heading "19–32 — The Body" [level=3]
  - paragraph: Continue from dot 19 all the way to dot 32 to fill out the Brontosaurus's massive, barrel-shaped torso. This longest section of the puzzle is great for building concentration and stamina — children learn to keep going even when the task feels big. Sound familiar?
  - text: Fun fact Brontosaurus weighed somewhere between 15 and 17 tonnes — heavier than three African elephants standing together. Despite that extraordinary size, it was entirely a plant-eater, completely harmless, and probably just wanted a quiet life among the ferns.
  - heading "33–42 — The Legs" [level=3]
  - paragraph: Trace dots 33 to 42 to form the four thick, column-like legs. Children begin to notice symmetry and how an animal's body is balanced from side to side. Drawing parallel shapes is a real skill, and this section gives little hands plenty of practice.
  - text: Fun fact Brontosaurus walked on its toes — a bit like a ballerina on four feet! Beneath each foot was a thick, fleshy pad that acted like a natural cushion, softening every thunderous step across the Jurassic landscape.
  - heading "43–50 — The Tail" [level=3]
  - paragraph: Finish the puzzle by connecting dots 43 through 50 to draw the long, tapering tail sweeping out behind the dinosaur. The tail balanced the heavy neck and gave the Brontosaurus its graceful, almost boat-like silhouette. Children practise gradually narrowing their line — a satisfying way to end.
  - text: Fun fact Palaeontologists believe Brontosaurus could crack its tail like a whip, creating a sound as loud as a thunderclap! Not bad for a gentle giant that spent most of its day munching on plants.
  - paragraph: More free Dinosaurs printables
  - heading "You might also like" [level=2]
  - article:
    - link "Mighty Tyrannosaurus Rex stomping out of 61 numbered dots, free dinosaur sheet":
      - /url: /en/dinosaurs/trex-61-dot-to-dot-puzzle/
      - img "Mighty Tyrannosaurus Rex stomping out of 61 numbered dots, free dinosaur sheet"
    - paragraph: Dinosaurs
    - heading "T-Rex 61-Dot Challenge" [level=3]
    - text: Ages 6-9 61 dots
    - link "View & download":
      - /url: /en/dinosaurs/trex-61-dot-to-dot-puzzle/
  - article:
    - link "Sprinting ostrich, neck outstretched, caught in 55 printable dots":
      - /url: /en/dinosaurs/ostriches-dinosaur-dot-to-dot-puzzle/
      - img "Sprinting ostrich, neck outstretched, caught in 55 printable dots"
    - paragraph: Dinosaurs
    - heading "Ostrich" [level=3]
    - text: Ages 5-8 55 dots
    - link "View & download":
      - /url: /en/dinosaurs/ostriches-dinosaur-dot-to-dot-puzzle/
  - article:
    - link "Three-horned Triceratops and its bony frill emerging from 70 printable dots":
      - /url: /en/dinosaurs/triceratops-dot-to-dot-puzzle/
      - img "Three-horned Triceratops and its bony frill emerging from 70 printable dots"
    - paragraph: Dinosaurs
    - heading "Triceratops" [level=3]
    - text: Ages 6-9 0 dots
    - link "View & download":
      - /url: /en/dinosaurs/triceratops-dot-to-dot-puzzle/
  - paragraph:
    - text: Well done — you've just drawn a real Brontosaurus! That's 50 dots, five body parts, and one whole lot of prehistoric fun. Now grab the crayons and give your thunder lizard a colour scheme all of its own. Want more? Browse all our
    - link "dot to dot printables":
      - /url: /en/
    - text: .
  - region "Frequently Asked Questions":
    - heading "Frequently Asked Questions" [level=2]
    - group: How many dots does the Brontosaurus dot to dot puzzle have?
    - group: Is the Brontosaurus dot to dot printable free?
    - group: What age is the Brontosaurus connect-the-dots worksheet best for?
    - group: What skills does the Brontosaurus dot to dot puzzle teach?
    - group: What is a fun fact about the brontosaurus?
- link "Share — WhatsApp":
  - /url: https://wa.me/?text=Brontosaurus%20Dot%20to%20Dot%20%E2%80%94%20Thunder%20Lizard%20in%2050%20Dots%20%7C%20DotToDotFreePrintables.com%20https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2Fbrontosaurus-dot-to-dot-puzzle%2F
- link "Share — Facebook":
  - /url: https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2Fbrontosaurus-dot-to-dot-puzzle%2F
- link "Share — Pinterest":
  - /url: https://pinterest.com/pin/create/button/?url=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2Fbrontosaurus-dot-to-dot-puzzle%2F&description=Brontosaurus%20Dot%20to%20Dot%20%E2%80%94%20Thunder%20Lizard%20in%2050%20Dots%20%7C%20DotToDotFreePrintables.com
- link "Share — X":
  - /url: https://twitter.com/intent/tweet?url=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2Fbrontosaurus-dot-to-dot-puzzle%2F&text=Brontosaurus%20Dot%20to%20Dot%20%E2%80%94%20Thunder%20Lizard%20in%2050%20Dots%20%7C%20DotToDotFreePrintables.com
- button "Copy link"
- contentinfo:
  - text: DotToDotFreePrintables.com
  - paragraph: Free printable dot-to-dot puzzles for kids.
  - navigation "Free printable dot-to-dot puzzles for kids.":
    - link "Blog":
      - /url: /en/blog/
    - link "FAQ":
      - /url: /en/#faq
    - link "Feedback":
      - /url: /en/#feedback
    - link "About":
      - /url: /en/about/
    - link "Contact":
      - /url: /en/contact/
    - link "Privacy":
      - /url: /en/privacy-policy/
    - link "Terms":
      - /url: /en/terms/
    - link "Printable puzzle pack":
      - /url: /en/premium/
    - link "Sitemap":
      - /url: /sitemap.xml
  - link "YouTube":
    - /url: https://www.youtube.com/@dottodotfreeprintables_com
  - link "Pinterest":
    - /url: https://www.pinterest.com/hellokidsbookworld/
  - paragraph: Copyright 2026 - v1.0.0
- alert
```

# Test source

```ts
  101 |     await page.goto('/');
  102 |     const bodyText = await page.evaluate(() => document.body.innerText);
  103 |     expect(bodyText).not.toContain('�');
  104 |   });
  105 | });
  106 | 
  107 | test.describe('Home page — mobile layout', () => {
  108 |   for (const viewport of mobileViewports) {
  109 |     test(`no horizontal overflow on ${viewport.name}`, async ({ page }) => {
  110 |       await page.setViewportSize({ width: viewport.width, height: viewport.height });
  111 |       await page.goto('/');
  112 |       const overflow = await page.evaluate(() => ({
  113 |         scrollWidth: document.documentElement.scrollWidth,
  114 |         clientWidth: document.documentElement.clientWidth
  115 |       }));
  116 |       expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
  117 |     });
  118 | 
  119 |     test(`discovery heading visible on ${viewport.name}`, async ({ page }) => {
  120 |       await page.setViewportSize({ width: viewport.width, height: viewport.height });
  121 |       await page.goto('/');
  122 |       await expect(page.getByRole('heading', { level: 1, name: /find the perfect dot to dot printables/i })).toBeVisible();
  123 |     });
  124 |   }
  125 | 
  126 |   test('mobile category menu opens and bookmark FAB is hidden', async ({ page }) => {
  127 |     await page.setViewportSize({ width: 390, height: 844 });
  128 |     await page.goto('/');
  129 | 
  130 |     await expect(page.locator('.floating-bookmark-wrap.mobile-bookmark-fab')).toBeHidden();
  131 | 
  132 |     await page.getByRole('button', { name: /open.*menu|categories/i }).first().click();
  133 |     await expect(page.getByRole('dialog')).toBeVisible();
  134 |     await expect(page.getByRole('dialog').getByRole('link', { name: /more/i })).toBeVisible();
  135 |   });
  136 | });
  137 | 
  138 | /* ═══════════════════════════════════════════════════════════════════════════
  139 |    DINOSAURS SUB-HOME (/dinosaurs)
  140 | ═══════════════════════════════════════════════════════════════════════════ */
  141 | test.describe('Dinosaurs page — content', () => {
  142 |   test('page heading is correct', async ({ page }) => {
  143 |     await page.goto(en('/dinosaurs/'));
  144 |     await expect(page.getByRole('heading', { name: /dinosaur dot to dot printables for kids/i })).toBeVisible();
  145 |   });
  146 | 
  147 |   test('breadcrumb shows Home > Dinosaurs', async ({ page }) => {
  148 |     await page.goto(en('/dinosaurs/'));
  149 |     await expect(page.getByRole('link', { name: /home/i }).first()).toBeVisible();
  150 |     await expect(page.locator('nav.breadcrumb')).toContainText('Dinosaurs');
  151 |   });
  152 | 
  153 |   test('shows all 10 dinosaur cards', async ({ page }) => {
  154 |     await page.goto(en('/dinosaurs/'));
  155 |     const cards = page.locator('article.puzzle-card');
  156 |     await expect(cards).toHaveCount(8);
  157 |   });
  158 | 
  159 |   test('all 8 dinosaur names are visible', async ({ page }) => {
  160 |     await page.goto(en('/dinosaurs/'));
  161 |     const names = [
  162 |       'T-Rex 61-Dot Challenge', 'Ostrich', 'Triceratops', 'Velociraptor', 'Stegosaurus',
  163 |       'Spinosaurus', 'Pterodactyl', 'Brontosaurus'
  164 |     ];
  165 |     for (const name of names) {
  166 |       await expect(page.getByText(name).first()).toBeVisible();
  167 |     }
  168 |   });
  169 | 
  170 |   test('puzzle cards use a small fallback image with responsive candidates', async ({ page }) => {
  171 |     await page.goto(en('/dinosaurs/'));
  172 |     const image = page.locator('article.puzzle-card').filter({ hasText: 'Triceratops' }).locator('img').first();
  173 | 
  174 |     await expect(image).toHaveAttribute('src', '/images/triceratops-puzzle-400.webp');
  175 |     await expect(image).toHaveAttribute(
  176 |       'srcset',
  177 |       '/images/triceratops-puzzle-400.webp 400w, /images/triceratops-puzzle-600.webp 600w, /images/triceratops-puzzle-700.webp 700w, /images/triceratops-puzzle.webp 420w'
  178 |     );
  179 |   });
  180 | 
  181 |   test('Brontosaurus card uses the new 50-dot puzzle', async ({ page }) => {
  182 |     await page.goto(en('/dinosaurs/'));
  183 |     const cards = page.locator('article.puzzle-card');
  184 |     const card = page.locator('article.puzzle-card').filter({ hasText: 'Brontosaurus' });
  185 | 
  186 |     await expect(cards.nth(0)).toContainText('T-Rex 61-Dot Challenge');
  187 |     await expect(cards.nth(2)).toContainText('Brontosaurus');
  188 |     await expect(card).toContainText('1–50 dots');
  189 |     await expect(card.getByRole('link', { name: /view & download - brontosaurus/i })).toHaveAttribute(
  190 |       'href',
  191 |       '/en/dinosaurs/brontosaurus-dot-to-dot-puzzle/'
  192 |     );
  193 |   });
  194 | 
  195 |   test('Brontosaurus detail page uses the replacement PDF', async ({ page }) => {
  196 |     await page.goto(en('/dinosaurs/brontosaurus-dot-to-dot-puzzle/'));
  197 | 
  198 |     await expect(
  199 |       page.getByRole('heading', { level: 1, name: /brontosaurus dot to dot/i })
  200 |     ).toBeVisible();
> 201 |     await expect(page.getByText(/dots:\s*1.*50/i)).toBeVisible();
      |                                                    ^ Error: expect(locator).toBeVisible() failed
  202 |     await expect(
  203 |       page.getByRole('link', { name: /us letter.*download free brontosaurus dot-to-dot printable pdf/i })
  204 |     ).toHaveAttribute(
  205 |       'href',
  206 |       '/dinosaurs/brontosaurus-dot-to-dot-puzzle-printable-horizontal.pdf'
  207 |     );
  208 |   });
  209 | 
  210 |   test('ad slot placeholders are present', async ({ page }) => {
  211 |     await page.goto(en('/dinosaurs/'));
  212 |     await expect(page.locator('#ad-dino-top')).toHaveCount(0);
  213 |     await expect(page.locator('#ad-dino-mid')).toHaveCount(0);
  214 |   });
  215 | 
  216 |   test('T-Rex 61-dot card links to correct puzzle page', async ({ page }) => {
  217 |     await page.goto(en('/dinosaurs/'));
  218 |     const trexLink = page.getByRole('link', { name: /view & download - t-rex 61-dot challenge/i });
  219 |     await expect(trexLink).toHaveAttribute('href', '/en/dinosaurs/trex-61-dot-to-dot-puzzle/');
  220 |   });
  221 | 
  222 |   test('no horizontal overflow on mobile', async ({ page }) => {
  223 |     await page.setViewportSize({ width: 390, height: 844 });
  224 |     await page.goto(en('/dinosaurs/'));
  225 |     const overflow = await page.evaluate(() => ({
  226 |       scrollWidth: document.documentElement.scrollWidth,
  227 |       clientWidth: document.documentElement.clientWidth
  228 |     }));
  229 |     expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
  230 |   });
  231 | 
  232 |   test('JSON-LD ItemList schema is present', async ({ page }) => {
  233 |     await page.goto(en('/dinosaurs/'));
  234 |     const content = await jsonLdByType(page, 'ItemList');
  235 |     expect(content).toContain('trex-61-dot-to-dot-puzzle');
  236 |   });
  237 | });
  238 | 
  239 | /* ═══════════════════════════════════════════════════════════════════════════
  240 |    INDIVIDUAL PUZZLE PAGES (/dinosaurs/[slug])
  241 | ═══════════════════════════════════════════════════════════════════════════ */
  242 | test.describe('T-Rex 61-dot puzzle page — content', () => {
  243 |   test('page heading contains dinosaur name', async ({ page }) => {
  244 |     await page.goto(en('/dinosaurs/trex-61-dot-to-dot-puzzle/'));
  245 |     await expect(page.getByRole('heading', { name: /t-rex dot to dot/i })).toBeVisible();
  246 |   });
  247 | 
  248 |   test('breadcrumb shows Home > Dinosaurs > T-Rex', async ({ page }) => {
  249 |     await page.goto(en('/dinosaurs/trex-61-dot-to-dot-puzzle/'));
  250 |     await expect(page.getByRole('link', { name: /home/i }).first()).toBeVisible();
  251 |     await expect(page.getByRole('link', { name: /dinosaurs/i }).first()).toBeVisible();
  252 |     await expect(page.getByText('T-Rex 61-Dot Challenge').first()).toBeVisible();
  253 |   });
  254 | 
  255 |   test('meta chips show age, dots, and free label', async ({ page }) => {
  256 |     await page.goto(en('/dinosaurs/trex-61-dot-to-dot-puzzle/'));
  257 |     const metaChips = page.locator('.meta-chips');
  258 |     await expect(metaChips.getByText(/ages.*6.9/i)).toBeVisible();
  259 |     await expect(metaChips.getByText(/dots.*1.*61/i)).toBeVisible();
  260 |     await expect(metaChips.getByText(/100% free/i)).toBeVisible();
  261 |   });
  262 | 
  263 |   test('fun fact box is visible', async ({ page }) => {
  264 |     await page.goto(en('/dinosaurs/trex-61-dot-to-dot-puzzle/'));
  265 |     await expect(page.getByText(/fun fact/i).first()).toBeVisible();
  266 |   });
  267 | 
  268 |   test('download button links directly to the printable PDF', async ({ page }) => {
  269 |     await page.goto(en('/dinosaurs/trex-61-dot-to-dot-puzzle/'));
  270 |     const downloadLink = page.getByRole('link', {
  271 |       name: /us letter.*download free t-rex 61-dot challenge dot-to-dot printable pdf/i,
  272 |     });
  273 | 
  274 |     await expect(downloadLink).toBeVisible();
  275 |     await expect(downloadLink).toHaveAttribute(
  276 |       'href',
  277 |       '/dinosaurs/trex-61-dot-to-dot-printable-horizontal.pdf'
  278 |     );
  279 |   });
  280 | 
  281 |   test('ad slots are present including pre-download slot', async ({ page }) => {
  282 |     await page.goto(en('/dinosaurs/trex-61-dot-to-dot-puzzle/'));
  283 |     await expect(page.locator('#ad-puzzle-top-trex-61-dot-to-dot-puzzle')).toHaveCount(0);
  284 |     await expect(page.locator('#ad-puzzle-predownload-trex-61-dot-to-dot-puzzle')).toHaveCount(0);
  285 |   });
  286 | 
  287 |   test('related puzzles section shows 3 other dinosaurs', async ({ page }) => {
  288 |     await page.goto(en('/dinosaurs/trex-61-dot-to-dot-puzzle/'));
  289 |     await expect(page.getByRole('heading', { name: /you might also like/i })).toBeVisible();
  290 |     const relatedSection = page.locator('section', {
  291 |       has: page.getByRole('heading', { name: /you might also like/i })
  292 |     });
  293 |     const relatedCards = relatedSection.locator('article.puzzle-card');
  294 |     await expect(relatedCards).toHaveCount(3);
  295 |   });
  296 | 
  297 |   test('back link goes to /dinosaurs', async ({ page }) => {
  298 |     await page.goto(en('/dinosaurs/trex-61-dot-to-dot-puzzle/'));
  299 |     await expect(page.getByRole('link', { name: /back to all dinosaur puzzles/i })).toHaveAttribute('href', '/en/dinosaurs/');
  300 |   });
  301 | 
```