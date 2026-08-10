# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mobile-and-links.spec.ts >> Coming-soon puzzle pages (dummy assets) >> ankylosaurus page loads and shows coming soon button
- Location: tests\mobile-and-links.spec.ts:323:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/coming soon/i).first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText(/coming soon/i).first()

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
    - text: Ankylosaurus
  - img "Armoured Ankylosaurus and its tail club plated together from 32 dots"
  - paragraph: Free Dinosaurs Printable
  - heading "Ankylosaurus Dot to Dot — 32-Dot Armoured Tail" [level=1]
  - paragraph: Connect the dots to reveal Ankylosaurus — the armoured superstar of the dinosaur world! Its entire body was covered in bony plates, and its tail ended in a massive, heavy club. This worksheet is great for kindergarten and 1st grade.
  - text: "Ages: 5-8 Dots: 1–32 100% Free"
  - paragraph: Difficulty
  - img "Difficulty 2 out of 3"
  - text: Medium
  - strong: "Fun fact:"
  - text: Even Ankylosaurus's eyelids had bony armour plates!
  - strong: Downloaded
  - text: 1,000+ times You’ve made a great choice!
  - 'link "Download (Print Size: US Letter) – Download free Ankylosaurus dot-to-dot printable PDF"':
    - /url: dummy-ankylosaurus.pdf
    - text: "Download (Print Size: US Letter)"
  - 'link "Download (Print Size: A4) – Download free Ankylosaurus dot-to-dot printable PDF"':
    - /url: dummy-ankylosaurus_A4.pdf
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
      - /url: https://wa.me/?text=Ankylosaurus%20Dot-to-Dot%20Printable%20-%20Free%20PDF%20https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2Fankylosaurus%2F
    - link "Share — Facebook":
      - /url: https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2Fankylosaurus%2F
    - link "Share — Pinterest":
      - /url: https://pinterest.com/pin/create/button/?url=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2Fankylosaurus%2F&media=http%3A%2F%2F127.0.0.1%3A4444%2Fdummy-ankylosaurus&description=Ankylosaurus%20Dot-to-Dot%20Printable%20-%20Free%20PDF
    - link "Share — X":
      - /url: https://twitter.com/intent/tweet?url=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2Fankylosaurus%2F&text=Ankylosaurus%20Dot-to-Dot%20Printable%20-%20Free%20PDF
    - button "Copy link"
    - status
  - paragraph: No sign-up needed. Opens as a PDF. Print on US Letter (8.5 × 11 inch) or A4 paper. Free for home and classroom use.
  - link "Back to all Dinosaurs puzzles":
    - /url: /en/dinosaurs/
  - heading "Ankylosaurus Dot-to-Dot Puzzle Guide" [level=2]
  - paragraph: What happens when nature decides a dinosaur needs a full suit of armour? You get the Ankylosaurus — covered from nose to tail in bony plates, with a massive club on the end of its tail for balance and protection. This 32-dot puzzle is wonderfully satisfying to complete, and the result is one of the most impressive-looking dinosaurs in the collection!
  - heading "1–7 — The Armoured Head" [level=3]
  - paragraph: Start at dot 1 and connect through to dot 7 to trace the broad, heavily armoured skull. The head is wide and flat, with a very different shape from the pointed snouts of predatory dinosaurs. Children learn to draw a wide, low shape here — a great contrast to the tall, narrow skulls they may have drawn before.
  - text: Fun fact! Even the Ankylosaurus eyelids had bony armour plates — perhaps the best example of evolution going slightly overboard with a good idea. The skull was so heavily fused that it appears almost featureless, like a bony helmet completely encasing the brain.
  - heading "8–18 — The Armoured Back" [level=3]
  - paragraph: Continue from dot 8 to dot 18 to draw the broad, rounded back covered in rows of bony plates, spikes, and knobs called osteoderms. This is the most detailed section visually, and children begin to appreciate just how well protected this animal was. A great opportunity to discuss why armour evolved in nature.
  - text: Fun fact! The armour covering Ankylosaurus was made of bone embedded directly in the skin — called osteoderms — arranged in rows from head to tail. This type of armour is called osteodermal armour, and it is the same kind you find in modern crocodiles and armadillos.
  - heading "19–26 — The Short, Sturdy Legs" [level=3]
  - paragraph: Trace dots 19 through 26 for the four short, powerful legs. Ankylosaurus was built low to the ground intentionally — a low centre of gravity made it very difficult for predators to flip over. Children often make the connection to a tortoise, which opens a lovely discussion about convergent evolution.
  - text: Fun fact! Ankylosaurus was about 20 feet long but stood only around 5 feet tall at the hip — less than the height of most adults. Its legs were so sturdy and its body so dense that even a T-Rex would have had enormous difficulty trying to attack it from above.
  - heading "27–32 — The Amazing Club Tail" [level=3]
  - paragraph: Finish by connecting dots 27 through 32 to draw the tail and its distinctive club at the end. This is the most satisfying finish of any puzzle in the collection — that club is what makes Ankylosaurus so unique. Just six dots, but each one counts toward one of nature's most extraordinary features.
  - text: Fun fact! The tail club was formed from fused vertebrae and could weigh up to 100 pounds — heavier than most grown-up dogs! Scientists think Ankylosaurus swung its tail to keep other dinosaurs at a safe distance. A brilliant built-in shield for a gentle plant-eater!
  - paragraph: More free Dinosaurs printables
  - heading "You might also like" [level=2]
  - article:
    - link "Mighty Tyrannosaurus Rex stomping out of 61 numbered dots, free dinosaur sheet":
      - /url: /en/dinosaurs/trex-61-dot-to-dot-puzzle/
      - img "Mighty Tyrannosaurus Rex stomping out of 61 numbered dots, free dinosaur sheet"
    - paragraph: Dinosaurs
    - heading "T-Rex 61-Dot Challenge" [level=3]
    - text: Ages 6-9 1–61 dots
    - link "View & Download":
      - /url: /en/dinosaurs/trex-61-dot-to-dot-puzzle/
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
  - region "Frequently asked questions":
    - paragraph: Common questions
    - heading "Frequently asked questions" [level=2]
    - group: How many dots does the Ankylosaurus dot to dot puzzle have?
    - group: Is the Ankylosaurus dot to dot printable free?
    - group: What age is the Ankylosaurus connect-the-dots worksheet best for?
    - group: What skills does the Ankylosaurus dot to dot puzzle teach?
    - group: What is a fun fact about the ankylosaurus?
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
> 326 |       await expect(page.getByText(/coming soon/i).first()).toBeVisible();
      |                                                            ^ Error: expect(locator).toBeVisible() failed
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
  400 | /* ═══════════════════════════════════════════════════════════════════════════
  401 |    SEO — meta tags
  402 | ═══════════════════════════════════════════════════════════════════════════ */
  403 | test.describe('SEO meta tags', () => {
  404 |   test('home page has correct title', async ({ page }) => {
  405 |     await page.goto('/');
  406 |     await expect(page).toHaveTitle(/free dot to dot printables for kids/i);
  407 |   });
  408 | 
  409 |   test('home page has meta description', async ({ page }) => {
  410 |     await page.goto('/');
  411 |     const desc = await page.locator('meta[name="description"]').getAttribute('content');
  412 |     expect(desc).toBeTruthy();
  413 |     expect(desc!.length).toBeGreaterThan(50);
  414 |   });
  415 | 
  416 |   test('/dinosaurs page has unique title', async ({ page }) => {
  417 |     await page.goto('/dinosaurs');
  418 |     const title = await page.title();
  419 |     expect(title).toContain('Dinosaur');
  420 |   });
  421 | 
  422 |   test('puzzle page has dinosaur name in title', async ({ page }) => {
  423 |     await page.goto('/dinosaurs/trex-61-dot-to-dot-puzzle');
  424 |     const title = await page.title();
  425 |     expect(title).toContain('T-Rex Dot to Dot');
  426 |   });
```