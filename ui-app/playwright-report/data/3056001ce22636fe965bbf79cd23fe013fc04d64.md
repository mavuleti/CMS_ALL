# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mobile-and-links.spec.ts >> Navigation flow >> Home -> /dinosaurs in 1 click
- Location: tests\mobile-and-links.spec.ts:335:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /dinosaur dot to dot printables/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: /dinosaur dot to dot printables/i })

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
    - text: Dinosaurs
  - paragraph: 11 free printable puzzles
  - heading "Dinosaur Dot-to-Dot Printables for Kids" [level=1]
  - paragraph: Connect prehistoric giants from the first dot to the final reveal.
  - article:
    - link "Mighty Tyrannosaurus Rex stomping out of 61 numbered dots, free dinosaur sheet New":
      - /url: /en/dinosaurs/trex-61-dot-to-dot-puzzle/
      - img "Mighty Tyrannosaurus Rex stomping out of 61 numbered dots, free dinosaur sheet"
      - text: New
    - paragraph: Dinosaurs
    - heading "T-Rex 61-Dot Challenge" [level=2]
    - paragraph: A Bigger Tyrant Lizard Challenge
    - text: Ages 6-9 1–61 dots
    - img "Difficulty 2 out of 3"
    - link "View & Download - T-Rex 61-Dot Challenge":
      - /url: /en/dinosaurs/trex-61-dot-to-dot-puzzle/
      - text: View & Download
  - article:
    - link "Sprinting ostrich, neck outstretched, caught in 55 printable dots New":
      - /url: /en/dinosaurs/ostriches-dinosaur-dot-to-dot-puzzle/
      - img "Sprinting ostrich, neck outstretched, caught in 55 printable dots"
      - text: New
    - paragraph: Dinosaurs
    - heading "Ostrich" [level=2]
    - paragraph: The World's Biggest Bird
    - text: Ages 5-8 1–55 dots
    - img "Difficulty 1 out of 3"
    - link "View & Download - Ostrich":
      - /url: /en/dinosaurs/ostriches-dinosaur-dot-to-dot-puzzle/
      - text: View & Download
  - article:
    - link "Long-necked Brontosaurus stretching across 50 dots on a preschool printable New":
      - /url: /en/dinosaurs/brontosaurus-dot-to-dot-puzzle/
      - img "Long-necked Brontosaurus stretching across 50 dots on a preschool printable"
      - text: New
    - paragraph: Dinosaurs
    - heading "Brontosaurus" [level=2]
    - paragraph: The Friendly Thunder Lizard
    - text: Ages 4-7 1–50 dots
    - img "Difficulty 1 out of 3"
    - link "View & Download - Brontosaurus":
      - /url: /en/dinosaurs/brontosaurus-dot-to-dot-puzzle/
      - text: View & Download
  - article:
    - link "Three-horned Triceratops and its bony frill emerging from 70 printable dots New":
      - /url: /en/dinosaurs/triceratops-dot-to-dot-puzzle/
      - img "Three-horned Triceratops and its bony frill emerging from 70 printable dots"
      - text: New
    - paragraph: Dinosaurs
    - heading "Triceratops" [level=2]
    - paragraph: Three Horns, One Amazing Puzzle
    - text: Ages 6-9 1–70 dots
    - img "Difficulty 2 out of 3"
    - link "View & Download - Triceratops":
      - /url: /en/dinosaurs/triceratops-dot-to-dot-puzzle/
      - text: View & Download
  - article:
    - link "Feathered Velociraptor poised to sprint, sketched in 54 printable dots New":
      - /url: /en/dinosaurs/velociraptor-dot-to-dot-puzzle/
      - img "Feathered Velociraptor poised to sprint, sketched in 54 printable dots"
      - text: New
    - paragraph: Dinosaurs
    - heading "Velociraptor" [level=2]
    - paragraph: Fast, Smart, and Ready to Pounce
    - text: Ages 6-9 1–54 dots
    - img "Difficulty 2 out of 3"
    - link "View & Download - Velociraptor":
      - /url: /en/dinosaurs/velociraptor-dot-to-dot-puzzle/
      - text: View & Download
  - article:
    - link "Stegosaurus with its double row of back plates built from 52 printable dots New":
      - /url: /en/dinosaurs/stegosaurus-dot-to-dot-puzzle/
      - img "Stegosaurus with its double row of back plates built from 52 printable dots"
      - text: New
    - paragraph: Dinosaurs
    - heading "Stegosaurus" [level=2]
    - paragraph: Spiky Plates, Big Fun
    - text: Ages 4-7 1–52 dots
    - img "Difficulty 1 out of 3"
    - link "View & Download - Stegosaurus":
      - /url: /en/dinosaurs/stegosaurus-dot-to-dot-puzzle/
      - text: View & Download
  - article:
    - link "Sail-backed Spinosaurus surfacing through 74 dots on a free dinosaur printable New":
      - /url: /en/dinosaurs/spinosaurus/
      - img "Sail-backed Spinosaurus surfacing through 74 dots on a free dinosaur printable"
      - text: New
    - paragraph: Dinosaurs
    - heading "Spinosaurus" [level=2]
    - paragraph: Bigger Than T-Rex
    - text: Ages 6-10 1–74 dots
    - img "Difficulty 2 out of 3"
    - link "View & Download - Spinosaurus":
      - /url: /en/dinosaurs/spinosaurus/
      - text: View & Download
  - article:
    - link "Towering Brachiosaurus reaching treetop height in 38 printable dots":
      - /url: /en/dinosaurs/brachiosaurus/
      - img "Towering Brachiosaurus reaching treetop height in 38 printable dots"
    - paragraph: Dinosaurs
    - heading "Brachiosaurus" [level=2]
    - paragraph: The Gentle Giant of the Jurassic
    - text: Ages 5-9 1–38 dots
    - img "Difficulty 2 out of 3"
    - link "View & Download - Brachiosaurus":
      - /url: /en/dinosaurs/brachiosaurus/
      - text: View & Download
  - article:
    - link "Armoured Ankylosaurus and its tail club plated together from 32 dots":
      - /url: /en/dinosaurs/ankylosaurus/
      - img "Armoured Ankylosaurus and its tail club plated together from 32 dots"
    - paragraph: Dinosaurs
    - heading "Ankylosaurus" [level=2]
    - paragraph: The Armoured Tank of the Dino World
    - text: Ages 5-8 1–32 dots
    - img "Difficulty 2 out of 3"
    - link "View & Download - Ankylosaurus":
      - /url: /en/dinosaurs/ankylosaurus/
      - text: View & Download
  - article:
    - link "Pterodactyl soaring on wide wings, held aloft by 67 printable dots New":
      - /url: /en/dinosaurs/pterodactyl-dot-to-dot-puzzle/
      - img "Pterodactyl soaring on wide wings, held aloft by 67 printable dots"
      - text: New
    - paragraph: Dinosaurs
    - heading "Pterodactyl" [level=2]
    - paragraph: The Flying Dinosaur Kids Love
    - text: Ages 6-9 1–67 dots
    - img "Difficulty 2 out of 3"
    - link "View & Download - Pterodactyl":
      - /url: /en/dinosaurs/pterodactyl-dot-to-dot-puzzle/
      - text: View & Download
  - article:
    - link "Fierce Allosaurus baring strong jaws, assembled from 42 printable dots":
      - /url: /en/dinosaurs/allosaurus/
      - img "Fierce Allosaurus baring strong jaws, assembled from 42 printable dots"
    - paragraph: Dinosaurs
    - heading "Allosaurus" [level=2]
    - paragraph: The Lion of the Jurassic
    - text: Ages 6-10 1–42 dots
    - img "Difficulty 3 out of 3"
    - link "View & Download - Allosaurus":
      - /url: /en/dinosaurs/allosaurus/
      - text: View & Download
  - heading "Roar Through Number Practice" [level=2]
  - paragraph: Dinosaur puzzles build number confidence, concentration, and pencil control.
  - link "← Back to all categories":
    - /url: /en/
  - region "Frequently asked questions":
    - paragraph: Common questions
    - heading "Frequently asked questions" [level=2]
    - group: How many free dinosaurs dot to dot printables are there?
    - group: Are the dinosaurs dot to dot puzzles free to print?
    - group: What ages are the dinosaurs puzzles for?
    - group: Which dinosaur dot to dot puzzles are available?
    - group: What is the easiest dinosaur dot to dot for young kids?
    - group: Do dinosaur dot to dot puzzles teach real dinosaur facts?
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
  - /url: https://wa.me/?text=Dinosaur%20Dot-to-Dot%20Printables%20for%20Kids%20%E2%80%94%20Free%20PDF%20Worksheets%20%7C%20DotToDotFreePrintables.com%20https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2F
- link "Share — Facebook":
  - /url: https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2F
- link "Share — Pinterest":
  - /url: https://pinterest.com/pin/create/button/?url=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2F&description=Dinosaur%20Dot-to-Dot%20Printables%20for%20Kids%20%E2%80%94%20Free%20PDF%20Worksheets%20%7C%20DotToDotFreePrintables.com
- link "Share — X":
  - /url: https://twitter.com/intent/tweet?url=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2F&text=Dinosaur%20Dot-to-Dot%20Printables%20for%20Kids%20%E2%80%94%20Free%20PDF%20Worksheets%20%7C%20DotToDotFreePrintables.com
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
- alert: Dinosaur Dot-to-Dot Printables for Kids — Free PDF Worksheets | DotToDotFreePrintables.com
```

# Test source

```ts
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
> 344 |     await expect(page.getByRole('heading', { name: /dinosaur dot to dot printables/i })).toBeVisible();
      |                                                                                          ^ Error: expect(locator).toBeVisible() failed
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
  427 | });
  428 | 
  429 | 
```