# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mobile-and-links.spec.ts >> SEO meta tags >> home page has correct title
- Location: tests\mobile-and-links.spec.ts:404:7

# Error details

```
Error: expect(page).toHaveTitle(expected) failed

Expected pattern: /free dot to dot printables for kids/i
Received string:  "Free Dot-to-Dot Printables for Kids"
Timeout: 5000ms

Call log:
  - Expect "toHaveTitle" with timeout 5000ms
    - locator resolved to <html lang="en">…</html>
    12 × unexpected value "Free Dot-to-Dot Printables for Kids"
       - locator resolved to <html lang="en" dir="ltr">…</html>
    - unexpected value "Free Dot-to-Dot Printables for Kids"

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
- main:
  - region "Free Dot-to-Dot Printables for Kids":
    - heading "Free Dot-to-Dot Printables for Kids" [level=1]
    - paragraph: Choose a printable puzzle and start connecting the dots.
    - search:
      - textbox "Search puzzles"
      - button "Search"
    - button "Easy 1–20 Dots":
      - strong: Easy
      - text: 1–20 Dots
    - button "Medium 21–60 Dots":
      - strong: Medium
      - text: 21–60 Dots
    - button "Hard 61+ Dots":
      - strong: Hard
      - text: 61+ Dots
    - button "Age 4–6":
      - strong: Age
      - text: 4–6
    - button "Age 7–9":
      - strong: Age
      - text: 7–9
    - button "Age 9–12":
      - strong: Age
      - text: 9–12
  - region "Featured puzzles":
    - article:
      - button "Save puzzle T-Rex 61-Dot Challenge":
        - img
      - link "T-Rex 61-Dot Challenge dot-to-dot printable":
        - /url: /en/dinosaurs/trex-61-dot-to-dot-puzzle/
        - img "T-Rex 61-Dot Challenge dot-to-dot printable"
      - heading "T-Rex 61-Dot Challenge" [level=2]:
        - link "T-Rex 61-Dot Challenge":
          - /url: /en/dinosaurs/trex-61-dot-to-dot-puzzle/
      - text: Medium · 61 dots 1.9k downloads
      - link "Download free":
        - /url: /en/dinosaurs/trex-61-dot-to-dot-puzzle/
    - article:
      - button "Save puzzle Mermaid":
        - img
      - link "Mermaid dot-to-dot printable":
        - /url: /en/ocean/mermaid-dot-to-dot-puzzle/
        - img "Mermaid dot-to-dot printable"
      - heading "Mermaid" [level=2]:
        - link "Mermaid":
          - /url: /en/ocean/mermaid-dot-to-dot-puzzle/
      - text: Easy · 54 dots 2.2k downloads
      - link "Download free":
        - /url: /en/ocean/mermaid-dot-to-dot-puzzle/
    - article:
      - button "Save puzzle Jellyfish":
        - img
      - link "Jellyfish dot-to-dot printable":
        - /url: /en/ocean/jellyfish-dot-to-dot-puzzle/
        - img "Jellyfish dot-to-dot printable"
      - heading "Jellyfish" [level=2]:
        - link "Jellyfish":
          - /url: /en/ocean/jellyfish-dot-to-dot-puzzle/
      - text: Medium · 88 dots 2.5k downloads
      - link "Download free":
        - /url: /en/ocean/jellyfish-dot-to-dot-puzzle/
    - article:
      - button "Save puzzle Cute Puppy":
        - img
      - link "Cute Puppy dot-to-dot printable":
        - /url: /en/cute/cute-puppy-dot-to-dot-puzzle/
        - img "Cute Puppy dot-to-dot printable"
      - heading "Cute Puppy" [level=2]:
        - link "Cute Puppy":
          - /url: /en/cute/cute-puppy-dot-to-dot-puzzle/
      - text: Medium · 70 dots 2.8k downloads
      - link "Download free":
        - /url: /en/cute/cute-puppy-dot-to-dot-puzzle/
    - article:
      - button "Save puzzle Slide Playground":
        - img
      - link "Slide Playground dot-to-dot printable":
        - /url: /en/playgrounds/slide-playgrounds-dot-to-dot-puzzle/
        - img "Slide Playground dot-to-dot printable"
      - heading "Slide Playground" [level=2]:
        - link "Slide Playground":
          - /url: /en/playgrounds/slide-playgrounds-dot-to-dot-puzzle/
      - text: Medium · 102 dots 3.1k downloads
      - link "Download free":
        - /url: /en/playgrounds/slide-playgrounds-dot-to-dot-puzzle/
    - article:
      - button "Save puzzle Snowdrop Flower":
        - img
      - link "Snowdrop Flower dot-to-dot printable":
        - /url: /en/flowers/snowdrop-flower-dot-to-dot-puzzle/
        - img "Snowdrop Flower dot-to-dot printable"
      - heading "Snowdrop Flower" [level=2]:
        - link "Snowdrop Flower":
          - /url: /en/flowers/snowdrop-flower-dot-to-dot-puzzle/
      - text: Hard · 145 dots 1.9k downloads
      - link "Download free":
        - /url: /en/flowers/snowdrop-flower-dot-to-dot-puzzle/
    - article:
      - button "Save puzzle Dashing Car Playground":
        - img
      - link "Dashing Car Playground dot-to-dot printable":
        - /url: /en/playgrounds/dashing-car-playground-dot-to-dot-puzzle/
        - img "Dashing Car Playground dot-to-dot printable"
      - heading "Dashing Car Playground" [level=2]:
        - link "Dashing Car Playground":
          - /url: /en/playgrounds/dashing-car-playground-dot-to-dot-puzzle/
      - text: Easy · 0 dots 2.2k downloads
      - link "Download free":
        - /url: /en/playgrounds/dashing-car-playground-dot-to-dot-puzzle/
    - article:
      - button "Save puzzle Lotus Flower":
        - img
      - link "Lotus Flower dot-to-dot printable":
        - /url: /en/flowers/lotus-flower-dot-to-dot-puzzle/
        - img "Lotus Flower dot-to-dot printable"
      - heading "Lotus Flower" [level=2]:
        - link "Lotus Flower":
          - /url: /en/flowers/lotus-flower-dot-to-dot-puzzle/
      - text: Easy · 46 dots 2.5k downloads
      - link "Download free":
        - /url: /en/flowers/lotus-flower-dot-to-dot-puzzle/
  - heading "100+ printable puzzles" [level=2]
  - paragraph:
    - text: Get the complete printable puzzle book.
    - deletion: $9.00
    - text: $5.00
  - link "View book":
    - /url: /en/premium/
  - region "See how dot-to-dot puzzles work":
    - paragraph: Learn and play
    - heading "See how dot-to-dot puzzles work" [level=2]
    - button "See how dot-to-dot puzzles work":
      - img "See how dot-to-dot puzzles work"
      - text: See how dot-to-dot puzzles work
    - paragraph:
      - text: "Download free:"
      - link "puzzleSection.items.mermaid-dot-to-dot-puzzle.name":
        - /url: /ocean/mermaid-dot-to-dot-printable.pdf
  - paragraph: categories.eyebrow
  - heading "categories.heading" [level=2]
  - paragraph: categories.description
  - link "America 250 Years Mark America's 250th anniversary in 2026 through Liberty Bells, eagles, fireworks, astronauts, and birthday scenes. Download free patriotic dot to dot PDFs for home or classroom activities.":
    - /url: /en/usa-250/
    - heading "America 250 Years" [level=3]
    - paragraph: Mark America's 250th anniversary in 2026 through Liberty Bells, eagles, fireworks, astronauts, and birthday scenes. Download free patriotic dot to dot PDFs for home or classroom activities.
  - link "Canada Paddle a Canadian canoe, trace the maple leaf, then meet a polar bear, moose, and raccoon. This free printable collection turns Canadian symbols and wildlife into hands-on number practice.":
    - /url: /en/canada/
    - heading "Canada" [level=3]
    - paragraph: Paddle a Canadian canoe, trace the maple leaf, then meet a polar bear, moose, and raccoon. This free printable collection turns Canadian symbols and wildlife into hands-on number practice.
  - link "UAE Travel from the Burj Khalifa to the desert without leaving the table. These free dot to dot pages introduce UAE landmarks, a falcon, a camel, and a traditional dallah through printable PDF activities.":
    - /url: /en/uae/
    - heading "UAE" [level=3]
    - paragraph: Travel from the Burj Khalifa to the desert without leaving the table. These free dot to dot pages introduce UAE landmarks, a falcon, a camel, and a traditional dallah through printable PDF activities.
  - link "Garden Put on the garden gloves, find the next number, and uncover a trowel or wheelbarrow. Each free connect-the-dots PDF gives preschoolers focused pencil practice.":
    - /url: /en/garden/
    - heading "Garden" [level=3]
    - paragraph: Put on the garden gloves, find the next number, and uncover a trowel or wheelbarrow. Each free connect-the-dots PDF gives preschoolers focused pencil practice.
  - link "Circus Step right up for free circus dot to dot printables featuring a friendly ringmaster bear and a striped big-top tent. Download and print both PDF worksheets for counting and pencil practice.":
    - /url: /en/circus/
    - heading "Circus" [level=3]
    - paragraph: Step right up for free circus dot to dot printables featuring a friendly ringmaster bear and a striped big-top tent. Download and print both PDF worksheets for counting and pencil practice.
  - link "Space Blast off with free space connect-the-dots worksheets. Print a friendly rover puzzle today, with more rockets, planets, and cosmic adventures coming soon.":
    - /url: /en/space/
    - heading "Space" [level=3]
    - paragraph: Blast off with free space connect-the-dots worksheets. Print a friendly rover puzzle today, with more rockets, planets, and cosmic adventures coming soon.
  - link "Blog Learning guides and activity ideas.":
    - /url: /en/blog/
    - heading "Blog" [level=3]
    - paragraph: Learning guides and activity ideas.
  - link "Blog Ideas for learning through play":
    - /url: /en/blog/
    - heading "Blog" [level=3]
    - paragraph: Ideas for learning through play
  - region "benefits.heading":
    - paragraph: benefits.eyebrow
    - heading "benefits.heading" [level=2]
    - paragraph: benefits.description
    - heading "benefits.fineMotorTitle" [level=3]
    - paragraph: benefits.fineMotorText
    - heading "benefits.numberTitle" [level=3]
    - paragraph: benefits.numberText
    - heading "benefits.focusTitle" [level=3]
    - paragraph: benefits.focusText
    - heading "benefits.confidenceTitle" [level=3]
    - paragraph: benefits.confidenceText
  - region "howTo.heading":
    - paragraph: howTo.eyebrow
    - heading "howTo.heading" [level=2]
    - list:
      - listitem:
        - text: "1"
        - heading "howTo.step1Title" [level=3]
        - paragraph: howTo.step1Text
      - listitem:
        - text: "2"
        - heading "howTo.step2Title" [level=3]
        - paragraph: howTo.step2Text
      - listitem:
        - text: "3"
        - heading "howTo.step3Title" [level=3]
        - paragraph: howTo.step3Text
  - region "trust.heading":
    - paragraph: trust.eyebrow
    - heading "trust.heading" [level=2]
    - heading "trust.noAccountTitle" [level=3]
    - paragraph: trust.noAccountText
    - heading "trust.safeTitle" [level=3]
    - paragraph: trust.safeText
    - heading "trust.fastTitle" [level=3]
    - paragraph: trust.fastText
  - region "faq.heading":
    - paragraph: faq.eyebrow
    - heading "faq.heading" [level=2]
    - group: faq.q1
    - group: faq.q2
    - group: faq.q3
    - group: faq.q4
    - group: faq.q5
    - group: faq.q6
    - group: faq.q7
    - group: faq.q8
  - region "Ideas for learning through play":
    - paragraph: From the blog
    - heading "Ideas for learning through play" [level=2]
    - link "View all":
      - /url: /en/blog/
    - article:
      - text: Learning 6 min read
      - heading "Why Dot to Dot Puzzles Are One of the Best Things You Can Give a Young Child" [level=3]:
        - link "Why Dot to Dot Puzzles Are One of the Best Things You Can Give a Young Child":
          - /url: /en/blog/benefits-of-dot-to-dot-puzzles-for-kids/
      - paragraph: How connect-the-dots builds pencil control, number sense, and quiet confidence — one line at a time.
      - time
      - link "Read Why Dot to Dot Puzzles Are One of the Best Things You Can Give a Young Child":
        - /url: /en/blog/benefits-of-dot-to-dot-puzzles-for-kids/
        - text: Read
    - article:
      - text: Parent Story 5 min read
      - heading "How Dot to Dot Printables Became My Go-To Screen-Free Activity for Kids" [level=3]:
        - link "How Dot to Dot Printables Became My Go-To Screen-Free Activity for Kids":
          - /url: /en/blog/screen-free-dot-to-dot-puzzles-for-kids-at-home/
      - paragraph: A Columbus mom of three on the rainy Saturday that changed her afternoons — and why printable connect-the-dots are the one screen-free activity her kids actually ask for.
      - time
      - link "Read How Dot to Dot Printables Became My Go-To Screen-Free Activity for Kids":
        - /url: /en/blog/screen-free-dot-to-dot-puzzles-for-kids-at-home/
        - text: Read
    - article:
      - text: Learning 5 min read
      - heading "How Dot to Dot Puzzles Help Children Learn" [level=3]:
        - link "How Dot to Dot Puzzles Help Children Learn":
          - /url: /en/blog/how-dot-to-dot-puzzles-help-children-learn/
      - paragraph: "What actually happens when a child connects the dots: number recognition, pencil control, focus, and the quiet confidence of finishing something."
      - time
      - link "Read How Dot to Dot Puzzles Help Children Learn":
        - /url: /en/blog/how-dot-to-dot-puzzles-help-children-learn/
        - text: Read
  - region "feedback.heading":
    - paragraph: feedback.eyebrow
    - heading "feedback.heading" [level=2]
    - paragraph: feedback.description
    - alert: feedbackForm.notConnected
  - region "audience.kidsTitle, audience.parentsTitle, audience.teachersTitle":
    - article:
      - heading "audience.kidsTitle" [level=2]
      - paragraph: audience.kidsText
    - article:
      - heading "audience.parentsTitle" [level=2]
      - paragraph: audience.parentsText
    - article:
      - heading "audience.teachersTitle" [level=2]
      - paragraph: audience.teachersText
- link "Share — WhatsApp":
  - /url: https://wa.me/?text=Free%20Dot-to-Dot%20Printables%20for%20Kids%20https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2F
- link "Share — Facebook":
  - /url: https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2F
- link "Share — Pinterest":
  - /url: https://pinterest.com/pin/create/button/?url=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2F&description=Free%20Dot-to-Dot%20Printables%20for%20Kids
- link "Share — X":
  - /url: https://twitter.com/intent/tweet?url=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2F&text=Free%20Dot-to-Dot%20Printables%20for%20Kids
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
  400 | /* ═══════════════════════════════════════════════════════════════════════════
  401 |    SEO — meta tags
  402 | ═══════════════════════════════════════════════════════════════════════════ */
  403 | test.describe('SEO meta tags', () => {
  404 |   test('home page has correct title', async ({ page }) => {
  405 |     await page.goto('/');
> 406 |     await expect(page).toHaveTitle(/free dot to dot printables for kids/i);
      |                        ^ Error: expect(page).toHaveTitle(expected) failed
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