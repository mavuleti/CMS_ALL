# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mobile-and-links.spec.ts >> Coming-soon puzzle pages (dummy assets) >> brachiosaurus page loads and shows coming soon button
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
    - navigation "Browse puzzle categories":
      - link "Home":
        - /url: /en/
      - link "Flowers":
        - /url: /en/flowers/
      - link "Cute Puzzles":
        - /url: /en/cute/
      - link "Playgrounds":
        - /url: /en/playgrounds/
      - link "Dinosaurs":
        - /url: /en/dinosaurs/
      - link "Ocean":
        - /url: /en/ocean/
      - link "Circus":
        - /url: /en/circus/
      - link "More categories":
        - /url: /en/#categories
    - combobox "Select language":
      - option "English" [selected]
      - option "Français"
      - option "Español"
      - option "Deutsch"
      - option "Português"
      - option "Italiano"
      - option "Nederlands"
      - option "Svenska"
      - option "Norsk"
      - option "Polski"
      - option "Dansk"
      - option "Suomi"
      - option "Čeština"
      - option "Magyar"
      - option "Română"
      - option "Türkçe"
      - option "Português (Brasil)"
      - option "Ελληνικά"
      - option "العربية"
      - option "Українська"
      - option "Hrvatski"
      - option "Slovenčina"
      - option "Lietuvių"
      - option "Latviešu"
      - option "Slovenščina"
      - option "Bahasa Indonesia"
      - option "Japanese"
      - option "Korean"
      - option "Russian"
      - option "Thai"
      - option "Vietnamese"
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
    - text: Brachiosaurus
  - img "Towering Brachiosaurus reaching treetop height in 38 printable dots"
  - paragraph: Free Dinosaurs Printable
  - heading "Brachiosaurus Dot to Dot — 38-Dot Jurassic Giant" [level=1]
  - paragraph: Connect the dots to draw the tallest, most peaceful dinosaur of the Jurassic period. Brachiosaurus had a long neck like a giraffe and front legs taller than most houses. A perfect dot to dot worksheet for kids who love big, friendly dinosaurs.
  - text: "Ages: 5-9 Dots: 1–38 100% Free"
  - paragraph: Difficulty
  - img "Difficulty 2 out of 3"
  - text: Medium
  - strong: "Fun fact:"
  - text: Brachiosaurus could weigh up to 60 tonnes — as heavy as 10 elephants!
  - strong: Downloaded
  - text: 1,000+ times You’ve made a great choice!
  - 'link "Download (Print Size: US Letter) – Download free Brachiosaurus dot-to-dot printable PDF"':
    - /url: dummy-brachiosaurus.pdf
    - text: "Download (Print Size: US Letter)"
  - 'link "Download (Print Size: A4) – Download free Brachiosaurus dot-to-dot printable PDF"':
    - /url: dummy-brachiosaurus_A4.pdf
    - text: "Download (Print Size: A4)"
  - paragraph: Free for home and classroom use.
  - group "Share":
    - text: Share
    - link "Share — WhatsApp":
      - /url: https://wa.me/?text=Brachiosaurus%20Dot-to-Dot%20Printable%20-%20Free%20PDF%20https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2Fbrachiosaurus%2F
    - link "Share — Facebook":
      - /url: https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2Fbrachiosaurus%2F
    - link "Share — Pinterest":
      - /url: https://pinterest.com/pin/create/button/?url=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2Fbrachiosaurus%2F&media=http%3A%2F%2F127.0.0.1%3A4444%2Fdummy-brachiosaurus&description=Brachiosaurus%20Dot-to-Dot%20Printable%20-%20Free%20PDF
    - link "Share — X":
      - /url: https://twitter.com/intent/tweet?url=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2Fbrachiosaurus%2F&text=Brachiosaurus%20Dot-to-Dot%20Printable%20-%20Free%20PDF
    - button "Copy link"
    - status
  - paragraph: No sign-up needed. Opens as a PDF. Print on US Letter (8.5 × 11 inch) or A4 paper. Free for home and classroom use.
  - link "Back to all Dinosaurs puzzles":
    - /url: /en/dinosaurs/
  - heading "Brachiosaurus Dot-to-Dot Puzzle Guide" [level=2]
  - paragraph: Imagine a creature whose front legs were taller than a two-storey building. That is the Brachiosaurus — one of the tallest animals that ever existed. Unlike most dinosaurs, its front legs were longer than its back legs, giving it a distinctive, giraffe-like posture perfect for reaching the very tops of ancient trees. Let's connect the dots and meet this towering gentle giant!
  - heading "1–6 — The Small Head" [level=3]
  - paragraph: Start at dot 1 and connect through to dot 6 to trace the small, boxy head perched at the very top of that extraordinary neck. Like the Brontosaurus, the Brachiosaurus had a relatively tiny head for its body size. Children practise compact, close-together dots here — a precise start to a big puzzle.
  - text: Fun fact! Brachiosaurus nostrils were positioned on top of its head, near its eyes. Scientists once thought this meant it lived underwater like a hippo, snorkelling from the depths. We now know it was entirely a land animal — those high nostrils were simply a quirk of its skull shape.
  - heading "7–18 — The Towering Neck" [level=3]
  - paragraph: Continue from dot 7 to dot 18 to sweep the long neck upward at a steep angle. This is the most dramatic section of the puzzle — the neck rises sharply, unlike the more horizontal neck of the Brontosaurus. Children learn to angle their pencil strokes boldly upward, which takes real confidence.
  - text: Fun fact! Brachiosaurus could reach up to 40 feet high — tall enough to peer into a fourth-floor window! Pumping blood all the way up that neck required an enormous heart. Scientists estimate its heart weighed around 400 pounds — about as heavy as a large motorbike engine.
  - heading "19–30 — The Body" [level=3]
  - paragraph: Trace dots 19 through 30 to fill out the large, barrel-shaped body. Notice how the back slopes downward from the tall front shoulders to the shorter hips — the opposite of most sauropods. This sloping back is one of Brachiosaurus's most distinctive features, and spotting it is a great observation exercise.
  - text: Fun fact! Brachiosaurus could weigh up to 60 tonnes — as heavy as ten African elephants. It needed to eat up to 880 pounds of vegetation every single day just to fuel that extraordinary bulk. That is roughly equivalent to eating 1,760 bags of salad. Every. Single. Day.
  - heading "31–38 — The Four Mighty Legs" [level=3]
  - paragraph: Finish by connecting dots 31 through 38 to draw all four legs. The front legs are noticeably longer and more upright than the back legs — children who look carefully will spot this slope. Eight dots is a focused, rewarding finish that builds attention to detail in the final stretch of a puzzle.
  - text: Fun fact! Each Brachiosaurus foot had five toes, with one large claw on the inner toe of each front foot. The feet were wide and round with a thick fleshy pad underneath — like an elephant's foot — designed to spread the animal's enormous weight across soft Jurassic ground.
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
    - group: How many dots does the Brachiosaurus dot to dot puzzle have?
    - group: Is the Brachiosaurus dot to dot printable free?
    - group: What age is the Brachiosaurus connect-the-dots worksheet best for?
    - group: What skills does the Brachiosaurus dot to dot puzzle teach?
    - group: What is a fun fact about the brachiosaurus?
- region "Most downloaded puzzles":
  - paragraph: Popular this week
  - heading "Most downloaded puzzles" [level=2]
  - list:
    - listitem:
      - link "T-Rex 61-Dot Challenge":
        - /url: /en/dinosaurs/trex-61-dot-to-dot-puzzle/
      - text: 23+
    - listitem:
      - link "Mermaid":
        - /url: /en/ocean/mermaid-dot-to-dot-puzzle/
      - text: 20+
    - listitem:
      - link "Jellyfish":
        - /url: /en/ocean/jellyfish-dot-to-dot-puzzle/
      - text: 10+
    - listitem:
      - link "Cute Puppy":
        - /url: /en/cute/cute-puppy-dot-to-dot-puzzle/
      - text: 9+
    - listitem:
      - link "Spring Horse":
        - /url: /en/playgrounds/spring-horse-playground-dot-to-dot-puzzle/
      - text: 7+
    - listitem:
      - link "Spinosaurus":
        - /url: /en/dinosaurs/spinosaurus/
      - text: 7+
    - listitem:
      - link "Snowdrop Flower":
        - /url: /en/flowers/snowdrop-flower-dot-to-dot-puzzle/
      - text: 7+
    - listitem:
      - link "Slide Playground":
        - /url: /en/playgrounds/slide-playgrounds-dot-to-dot-puzzle/
      - text: 6+
  - paragraph: Fresh printables
  - heading "Recently added" [level=3]
  - list:
    - listitem:
      - link "Circus Ringmaster Bear":
        - /url: /en/circus/circus-ringmaster-bear-dot-to-dot-puzzle/
      - text: New
    - listitem:
      - link "Circus Tent":
        - /url: /en/circus/circus-tent-dot-to-dot-puzzle/
      - text: New
    - listitem:
      - link "Space Rover":
        - /url: /en/space/space-rover-dot-to-dot-puzzle/
      - text: New
    - listitem:
      - link "Ringed Planet":
        - /url: /en/space/ringed-planet-dot-to-dot-puzzle/
      - text: New
- link "Share — WhatsApp":
  - /url: https://wa.me/?text=Brachiosaurus%20Dot%20to%20Dot%3A%2038%20Towering%20Free%20Dots%20%7C%20DotToDotFreePrintables.com%20https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2Fbrachiosaurus%2F
- link "Share — Facebook":
  - /url: https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2Fbrachiosaurus%2F
- link "Share — Pinterest":
  - /url: https://pinterest.com/pin/create/button/?url=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2Fbrachiosaurus%2F&description=Brachiosaurus%20Dot%20to%20Dot%3A%2038%20Towering%20Free%20Dots%20%7C%20DotToDotFreePrintables.com
- link "Share — X":
  - /url: https://twitter.com/intent/tweet?url=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2Fbrachiosaurus%2F&text=Brachiosaurus%20Dot%20to%20Dot%3A%2038%20Towering%20Free%20Dots%20%7C%20DotToDotFreePrintables.com
- button "Copy link"
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