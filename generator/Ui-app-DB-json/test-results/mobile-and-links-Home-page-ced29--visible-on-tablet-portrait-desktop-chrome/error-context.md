# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mobile-and-links.spec.ts >> Home page — mobile layout >> discovery heading visible on tablet portrait
- Location: tests\mobile-and-links.spec.ts:119:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /find the perfect dot to dot printables/i, level: 1 })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: /find the perfect dot to dot printables/i, level: 1 })

```

```yaml
- link "Skip to content":
  - /url: "#main-content"
- banner:
  - navigation "categories.heading":
    - link "DotToDotFreePrintables — Home":
      - /url: /en/
      - text: DotToDotFreePrintables
    - link "Home":
      - /url: /en/
    - button "Open categories"
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
  22  |   });
  23  | }
  24  | 
  25  | /* ═══════════════════════════════════════════════════════════════════════════
  26  |    HOME PAGE
  27  | ═══════════════════════════════════════════════════════════════════════════ */
  28  | test.describe('Home page — content', () => {
  29  |   test('discovery heading, search, and featured puzzles are visible', async ({ page }) => {
  30  |     await page.goto('/');
  31  |     await expect(page.getByRole('heading', { level: 1, name: /find the perfect dot to dot printables/i })).toBeVisible();
  32  |     await expect(page.getByRole('textbox', { name: /search puzzles/i })).toBeVisible();
  33  |     await expect(page.locator('.discovery-card')).toHaveCount(8);
  34  |   });
  35  | 
  36  |   test('Mermaid is a featured printable', async ({ page }) => {
  37  |     await page.goto('/');
  38  |     await expect(page.locator('.discovery-card').filter({ hasText: 'Mermaid' })).toBeVisible();
  39  |   });
  40  | 
  41  |   test('homepage navigation exposes Dinosaurs and Ocean', async ({ page }) => {
  42  |     await page.goto('/');
  43  |     const menuButton = page.getByRole('button', { name: /open categories menu/i });
  44  |     if (await menuButton.isVisible()) await menuButton.click();
  45  |     const navigation = await page.getByRole('dialog').isVisible().catch(() => false)
  46  |       ? page.getByRole('dialog')
  47  |       : page.locator('.category-menu-bar');
  48  |     const dinoLink = navigation.getByRole('link', { name: /^dinosaurs$/i });
  49  |     await expect(dinoLink).toBeVisible();
  50  |     await expect(dinoLink).toHaveAttribute('href', '/en/dinosaurs/');
  51  |     const oceanLink = navigation.getByRole('link', { name: /^ocean$/i });
  52  |     await expect(oceanLink).toBeVisible();
  53  |   });
  54  | 
  55  |   test('benefits section is present', async ({ page }) => {
  56  |     await page.goto('/');
  57  |     await expect(page.getByRole('heading', { name: /why dot to dot worksheets are great/i })).toBeVisible();
  58  |     await expect(page.getByText(/fine motor skills/i).first()).toBeVisible();
  59  |   });
  60  | 
  61  |   test('FAQ section is present with questions', async ({ page }) => {
  62  |     await page.goto('/');
  63  |     await expect(page.getByRole('heading', { name: /frequently asked questions/i })).toBeVisible();
  64  |     await expect(page.getByText(/are all dot to dot printables/i)).toBeVisible();
  65  |   });
  66  | 
  67  |   test('FAQ accordion opens on click', async ({ page }) => {
  68  |     await page.goto('/');
  69  |     const firstQuestion = page.locator('details').first();
  70  |     await firstQuestion.click();
  71  |     const answer = firstQuestion.locator('p');
  72  |     await expect(answer).toBeVisible();
  73  |   });
  74  | 
  75  |   test('feedback section is present', async ({ page }) => {
  76  |     await page.goto('/');
  77  |     await expect(page.locator('#feedback')).toBeVisible();
  78  |   });
  79  | 
  80  |   test('JSON-LD structured data is present', async ({ page }) => {
  81  |     await page.goto('/');
  82  |     expect(await jsonLdByType(page, 'WebSite')).toBeTruthy();
  83  |   });
  84  | 
  85  |   test('AdSense placeholders are hidden until ads are enabled', async ({ page }) => {
  86  |     await page.goto('/');
  87  |     await expect(page.locator('#ad-home-banner')).toHaveCount(0);
  88  |     await expect(page.locator('#ad-home-leaderboard')).toHaveCount(0);
  89  |   });
  90  | 
  91  |   test('no horizontal overflow on home page', async ({ page }) => {
  92  |     await page.goto('/');
  93  |     const overflow = await page.evaluate(() => ({
  94  |       scrollWidth: document.documentElement.scrollWidth,
  95  |       clientWidth: document.documentElement.clientWidth
  96  |     }));
  97  |     expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
  98  |   });
  99  | 
  100 |   test('no encoding errors in page text', async ({ page }) => {
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
> 122 |       await expect(page.getByRole('heading', { level: 1, name: /find the perfect dot to dot printables/i })).toBeVisible();
      |                                                                                                              ^ Error: expect(locator).toBeVisible() failed
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
```