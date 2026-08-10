# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mobile-and-links.spec.ts >> T-Rex 61-dot puzzle page — content >> back link goes to /dinosaurs
- Location: tests\mobile-and-links.spec.ts:297:7

# Error details

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator: getByRole('link', { name: /back to all dinosaur puzzles/i })
Expected: "/en/dinosaurs/"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveAttribute" with timeout 5000ms
  - waiting for getByRole('link', { name: /back to all dinosaur puzzles/i })

```

```yaml
- link "Skip to main content":
  - /url: "#main-content"
- banner:
  - navigation "Browse dot to dot puzzles by category":
    - link "DotToDotFreePrintables — Home":
      - /url: /en/
      - text: DotToDotFreePrintables
    - link "Home":
      - /url: /en/
    - button "Open categories menu"
    - combobox "Select language":
      - option "EN" [selected]
      - option "FR"
      - option "ES"
      - option "DE"
      - option "PT"
      - option "IT"
      - option "NL"
      - option "SV"
      - option "NO"
      - option "PL"
      - option "DA"
      - option "FI"
      - option "CS"
      - option "HU"
      - option "RO"
      - option "TR"
      - option "BR"
      - option "EL"
      - option "AR"
      - option "UK"
      - option "HR"
      - option "SK"
      - option "LT"
      - option "LV"
      - option "SL"
      - option "ID"
      - option "JA"
      - option "KO"
      - option "RU"
      - option "TH"
      - option "VI"
- button "Share"
- main:
  - navigation "Breadcrumb":
    - link "Home":
      - /url: /en/
    - link "Dinosaurs":
      - /url: /en/dinosaurs/
    - text: T-Rex 61-Dot Challenge
  - img "Mighty Tyrannosaurus Rex stomping out of 61 numbered dots, free dinosaur sheet"
  - paragraph: Free Dinosaurs Printable
  - heading "T-Rex Dot to Dot — 61 Dots of Prehistoric Fun" [level=1]
  - paragraph: Connect 61 dots to reveal a mighty Tyrannosaurus Rex. This printable dinosaur worksheet gives confident young counters a longer number-sequencing challenge while building pencil control, focus, and fine motor skills.
  - text: "Ages: 6-9 Dots: 1–61 100% Free"
  - paragraph: Difficulty
  - img "Difficulty 2 out of 3"
  - text: Medium
  - strong: "Fun fact:"
  - text: T-Rex could replace its teeth throughout its life, growing new ones when older teeth broke or fell out!
  - strong: Downloaded
  - text: 1,023+ times You’ve made a great choice!
  - 'link "Download (Print Size: US Letter) – Download free T-Rex 61-Dot Challenge dot-to-dot printable PDF"':
    - /url: /dinosaurs/trex-61-dot-to-dot-printable-horizontal.pdf
    - text: "Download (Print Size: US Letter)"
  - 'link "Download (Print Size: A4) – Download free T-Rex 61-Dot Challenge dot-to-dot printable PDF"':
    - /url: /dinosaurs/trex-61-dot-to-dot-printable-horizontal_A4.pdf
    - text: "Download (Print Size: A4)"
  - paragraph: Free for home and classroom use.
  - 'complementary "Advertisement: Best of 2026 dot to dot activity book"':
    - link "Best of 2026 - 25 Dot to Dot Puzzles book cover PDF BOOK Best of 2026 25 Dot to Dot Puzzles Special sale $9.00 $5.00 View book":
      - /url: /en/premium/
      - img "Best of 2026 - 25 Dot to Dot Puzzles book cover"
      - text: PDF BOOK
      - strong: Best of 2026
      - text: 25 Dot to Dot Puzzles Special sale
      - deletion: $9.00
      - text: $5.00 View book
  - group "Share":
    - text: Share
    - link "Share — WhatsApp":
      - /url: https://wa.me/?text=T-Rex%2061-Dot%20Challenge%20Dot-to-Dot%20Printable%20-%20Free%20PDF%20https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2Ftrex-61-dot-to-dot-puzzle%2F
    - link "Share — Facebook":
      - /url: https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2Ftrex-61-dot-to-dot-puzzle%2F
    - link "Share — Pinterest":
      - /url: https://pinterest.com/pin/create/button/?url=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2Ftrex-61-dot-to-dot-puzzle%2F&media=http%3A%2F%2F127.0.0.1%3A4444%2Fimages%2Ftrex-61-puzzle.webp&description=T-Rex%2061-Dot%20Challenge%20Dot-to-Dot%20Printable%20-%20Free%20PDF
    - link "Share — X":
      - /url: https://twitter.com/intent/tweet?url=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2Ftrex-61-dot-to-dot-puzzle%2F&text=T-Rex%2061-Dot%20Challenge%20Dot-to-Dot%20Printable%20-%20Free%20PDF
    - button "Copy link"
    - status
  - paragraph: No sign-up needed. Opens as a PDF. Print on US Letter (8.5 × 11 inch) or A4 paper. Free for home and classroom use.
  - link "Back to all Dinosaurs puzzles":
    - /url: /en/dinosaurs/
  - heading "T-Rex 61-Dot Challenge Dot-to-Dot Puzzle Guide" [level=2]
  - paragraph:
    - text: Sixty-one dots. That's a real challenge — and a fitting one, because Tyrannosaurus Rex was a real giant. This puzzle takes longer than most of our
    - link "free dot to dot printables":
      - /url: /en/
    - text: ", so it suits children who have already mastered counting past 50 and want something meatier. Find dot 1 right at the tip of the jaw, take a breath, and let's wake up the king of the dinosaurs."
  - heading "1–11 — The Massive Head and Snout" [level=3]
  - paragraph: Start at dot 1 on the tip of that toothy jaw and work up and over the head to dot 11 at the base of the neck. The strokes here are short and curved, which makes this a gentle warm-up before the long lines to come. Ask your child what they notice about the head — it's enormous compared to everything else, and that's no accident.
  - text: Fun fact! A full-grown T-Rex skull was about five feet long — taller than most eight-year-olds. Scientists believe its bite was the strongest of any land animal that has ever lived, powerful enough to crush bone.
  - heading "12–26 — Along the Back to the Tail Tip" [level=3]
  - paragraph: From dot 12, the line sweeps along the back and all the way down the tail to dot 26 at the very tip. This is the longest, smoothest stretch of the puzzle. Encourage one flowing motion rather than lots of stops and starts — it's excellent practice for the sustained pencil control children need when they begin joined-up writing.
  - text: Fun fact! The tail made up almost half of a T-Rex's total length and held more than 40 bones. It worked like a tightrope walker's pole, balancing that huge head so the dinosaur didn't tip forward onto its face.
  - heading "27–35 — Under the Tail to the Hip" [level=3]
  - paragraph: Now double back. Dots 27 to 35 run underneath the tail toward the hip, tracing the thick underside of that mighty balancing beam. Children have to count carefully here because the dots sit close together — a good moment to slow down and check each number before drawing.
  - text: Fun fact! Standing at the hip, a T-Rex was around 12 feet tall. Its whole body could stretch to 40 feet from nose to tail tip — about the length of a school bus.
  - heading "36–48 — The Powerful Legs and Feet" [level=3]
  - paragraph: Dots 36 to 48 build the back legs and both clawed feet. These were the engine of the whole animal, and the section rewards bold, confident strokes. There's a bit of zig-zagging between the toes, so it also sneaks in some fine motor practice right when children think they're just drawing dinosaur feet.
  - text: Fun fact! One T-Rex footprint could be over three feet long. For years people argued about how fast it could move — current research suggests a walking pace of about 3 mph and short bursts closer to 12 mph. Fast enough.
  - heading "49–58 — The Belly and Those Tiny Arms" [level=3]
  - paragraph: Connect dots 49 through 58 to draw the belly, chest, and the famously small arms. Every child laughs at these arms, which is exactly why this section is fun to draw. The lines change direction often, so it's the trickiest part of the puzzle — perfect for the confident counters this 61-dot page was made for.
  - text: Fun fact! Those little arms were only about three feet long, yet each one could lift roughly 400 pounds. Small, yes — but nobody would call them weak.
  - heading "59–61 — Closing the Jaw" [level=3]
  - paragraph: Just three dots left. Connect 59, 60, and 61 to finish the lower jaw and complete the mighty outline. The final line lands right back near dot 1 — a satisfying full circle that shows children the whole picture was one continuous journey.
  - text: Fun fact! T-Rex never ran out of teeth. When one broke or wore down, a new one simply grew in its place — a lifetime supply of dagger-sharp replacements, some up to 12 inches long including the root.
  - paragraph: More free Dinosaurs printables
  - heading "You might also like" [level=2]
  - article:
    - link "Sprinting ostrich, neck outstretched, caught in 55 printable dots":
      - /url: /en/dinosaurs/ostriches-dinosaur-dot-to-dot-puzzle/
      - img "Sprinting ostrich, neck outstretched, caught in 55 printable dots"
    - paragraph: Dinosaurs
    - heading "Ostrich" [level=3]
    - text: Ages 5-8 1–55 dots
    - link "View & Download":
      - /url: /en/dinosaurs/ostriches-dinosaur-dot-to-dot-puzzle/
  - article:
    - link "Long-necked Brontosaurus stretching across 50 dots on a preschool printable":
      - /url: /en/dinosaurs/brontosaurus-dot-to-dot-puzzle/
      - img "Long-necked Brontosaurus stretching across 50 dots on a preschool printable"
    - paragraph: Dinosaurs
    - heading "Brontosaurus" [level=3]
    - text: Ages 4-7 1–50 dots
    - link "View & Download":
      - /url: /en/dinosaurs/brontosaurus-dot-to-dot-puzzle/
  - article:
    - link "Three-horned Triceratops and its bony frill emerging from 70 printable dots":
      - /url: /en/dinosaurs/triceratops-dot-to-dot-puzzle/
      - img "Three-horned Triceratops and its bony frill emerging from 70 printable dots"
    - paragraph: Dinosaurs
    - heading "Triceratops" [level=3]
    - text: Ages 6-9 1–70 dots
    - link "View & Download":
      - /url: /en/dinosaurs/triceratops-dot-to-dot-puzzle/
  - region "Frequently asked questions":
    - paragraph: Common questions
    - heading "Frequently asked questions" [level=2]
    - group: How many dots does the T-Rex 61-Dot Challenge dot to dot puzzle have?
    - group: Is the T-Rex 61-Dot Challenge dot to dot printable free?
    - group: What age is the T-Rex 61-Dot Challenge connect-the-dots worksheet best for?
    - group: What skills does the T-Rex 61-Dot Challenge dot to dot puzzle teach?
    - group: What is a fun fact about the t-rex 61-dot challenge?
- contentinfo:
  - text: DotToDotFreePrintables.com
  - paragraph: Free dot to dot printables and connect-the-dots worksheets for kids, parents, and teachers in the US, UK, Canada, and Australia. All puzzles are free to download, print, and share.
  - navigation "Free dot to dot printables and connect-the-dots worksheets for kids, parents, and teachers in the US, UK, Canada, and Australia. All puzzles are free to download, print, and share.":
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
    - link "Dot to Dot Puzzle Pack":
      - /url: /en/premium/
    - link "Sitemap":
      - /url: /sitemap.xml
  - link "YouTube":
    - /url: https://www.youtube.com/@dottodotfreeprintables_com
  - link "Pinterest":
    - /url: https://www.pinterest.com/hellokidsbookworld/
  - paragraph: © 2026 DotToDotFreePrintables.com · Free printable activities for children - v1.0.0
- alert
```

# Test source

```ts
  199 |       page.getByRole('heading', { level: 1, name: /brontosaurus dot to dot/i })
  200 |     ).toBeVisible();
  201 |     await expect(page.getByText(/dots:\s*1.*50/i)).toBeVisible();
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
> 299 |     await expect(page.getByRole('link', { name: /back to all dinosaur puzzles/i })).toHaveAttribute('href', '/en/dinosaurs/');
      |                                                                                     ^ Error: expect(locator).toHaveAttribute(expected) failed
  300 |   });
  301 | 
  302 |   test('JSON-LD CreativeWork schema is present', async ({ page }) => {
  303 |     await page.goto(en('/dinosaurs/trex-61-dot-to-dot-puzzle/'));
  304 |     const content = await jsonLdByType(page, 'CreativeWork');
  305 |     expect(content).toContain('T-Rex 61-Dot Challenge');
  306 |   });
  307 | 
  308 |   test('no horizontal overflow on mobile', async ({ page }) => {
  309 |     await page.setViewportSize({ width: 390, height: 844 });
  310 |     await page.goto(en('/dinosaurs/trex-61-dot-to-dot-puzzle/'));
  311 |     const overflow = await page.evaluate(() => ({
  312 |       scrollWidth: document.documentElement.scrollWidth,
  313 |       clientWidth: document.documentElement.clientWidth
  314 |     }));
  315 |     expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
  316 |   });
  317 | });
  318 | 
  319 | test.describe('Coming-soon puzzle pages (dummy assets)', () => {
  320 |   const dummySlugs = ['brachiosaurus', 'ankylosaurus', 'allosaurus'];
  321 | 
  322 |   for (const slug of dummySlugs) {
  323 |     test(`${slug} page loads and shows coming soon button`, async ({ page }) => {
  324 |       await page.goto(en(`/dinosaurs/${slug}/`));
  325 |       await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  326 |       await expect(page.getByText(/coming soon/i).first()).toBeVisible();
  327 |     });
  328 |   }
  329 | });
  330 | 
  331 | /* ═══════════════════════════════════════════════════════════════════════════
  332 |    NAVIGATION FLOW
  333 | ═══════════════════════════════════════════════════════════════════════════ */
  334 | test.describe('Navigation flow', () => {
  335 |   test('Home -> /dinosaurs in 1 click', async ({ page }) => {
  336 |     await page.goto('/');
  337 |     const menuButton = page.getByRole('button', { name: /open categories menu/i });
  338 |     if (await menuButton.isVisible()) await menuButton.click();
  339 |     const navigation = await page.getByRole('dialog').isVisible().catch(() => false)
  340 |       ? page.getByRole('dialog')
  341 |       : page.locator('.category-menu-bar');
  342 |     await navigation.getByRole('link', { name: /^dinosaurs$/i }).click();
  343 |     await expect(page).toHaveURL(/\/en\/dinosaurs\/?$/);
  344 |     await expect(page.getByRole('heading', { name: /dinosaur dot to dot printables/i })).toBeVisible();
  345 |   });
  346 | 
  347 |   test('/dinosaurs -> puzzle page in 1 click', async ({ page }) => {
  348 |     await page.goto(en('/dinosaurs/'));
  349 |     await page.getByRole('link', { name: /view & download - t-rex 61-dot challenge/i }).click();
  350 |     await expect(page).toHaveURL(/\/en\/dinosaurs\/trex-61-dot-to-dot-puzzle\/?$/);
  351 |     await expect(
  352 |       page.getByRole('heading', { level: 1, name: /t-rex dot to dot/i })
  353 |     ).toBeVisible();
  354 |   });
  355 | 
  356 |   test('puzzle page breadcrumb navigates back to /dinosaurs', async ({ page }) => {
  357 |     await page.goto(en('/dinosaurs/trex-61-dot-to-dot-puzzle/'));
  358 |     await page.getByRole('link', { name: /dinosaurs/i }).first().click();
  359 |     await expect(page).toHaveURL(/\/en\/dinosaurs\/?$/);
  360 |   });
  361 | 
  362 |   test('navbar brand link returns to home', async ({ page }) => {
  363 |     await page.goto(en('/dinosaurs/'));
  364 |     await page.getByRole('link', { name: /dottodotfreeprintables.*home/i }).click();
  365 |     await expect(page).toHaveURL(/\/en\/?$/);
  366 |   });
  367 | });
  368 | 
  369 | /* ═══════════════════════════════════════════════════════════════════════════
  370 |    LINKS — no broken links across all key pages
  371 | ═══════════════════════════════════════════════════════════════════════════ */
  372 | test.describe('No broken links', () => {
  373 |   const pagesToCheck = ['/', '/dinosaurs', '/dinosaurs/trex-61-dot-to-dot-puzzle', '/dinosaurs/triceratops'];
  374 | 
  375 |   for (const path of pagesToCheck) {
  376 |     test(`all same-origin links on ${path} resolve (< 400)`, async ({ page, request, baseURL }) => {
  377 |       await page.goto(path);
  378 |       const hrefs = await page.$$eval('a[href]', (anchors) =>
  379 |         anchors
  380 |           .map((a) => a.getAttribute('href'))
  381 |           .filter((h): h is string => typeof h === 'string' && h !== '' && !h.startsWith('#') && !h.startsWith('mailto'))
  382 |       );
  383 | 
  384 |       const base = new URL(baseURL ?? 'http://localhost:4444');
  385 |       const urls = Array.from(new Set(
  386 |         hrefs
  387 |           .map((h) => new URL(h, base))
  388 |           .filter((u) => u.origin === base.origin)
  389 |           .map((u) => { u.hash = ''; return u.toString(); })
  390 |       ));
  391 | 
  392 |       for (const url of urls) {
  393 |         const res = await request.get(url);
  394 |         expect(res.status(), `${url} should not be broken`).toBeLessThan(400);
  395 |       }
  396 |     });
  397 |   }
  398 | });
  399 | 
```