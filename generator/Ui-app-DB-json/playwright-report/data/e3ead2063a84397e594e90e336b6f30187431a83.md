# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mobile-and-links.spec.ts >> Dinosaurs page — content >> Brontosaurus card uses the new 50-dot puzzle
- Location: tests\mobile-and-links.spec.ts:181:7

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('article.puzzle-card').filter({ hasText: 'Brontosaurus' })
Expected substring: "1–50 dots"
Received string:    "DinosaursBrontosaurusThe Friendly Thunder LizardAges 4-750 dots View & download"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('article.puzzle-card').filter({ hasText: 'Brontosaurus' })
    14 × locator resolved to <article class="puzzle-card dino-card">…</article>
       - unexpected value "DinosaursBrontosaurusThe Friendly Thunder LizardAges 4-750 dots View & download"

```

```yaml
- article:
  - link "Long-necked Brontosaurus stretching across 50 dots on a preschool printable":
    - /url: /en/dinosaurs/brontosaurus-dot-to-dot-puzzle/
    - img "Long-necked Brontosaurus stretching across 50 dots on a preschool printable"
  - paragraph: Dinosaurs
  - heading "Brontosaurus" [level=2]
  - paragraph: The Friendly Thunder Lizard
  - text: Ages 4-7 50 dots
  - 'img "Difficulty: 1"'
  - link "View & download - Brontosaurus":
    - /url: /en/dinosaurs/brontosaurus-dot-to-dot-puzzle/
    - text: View & download
```

# Test source

```ts
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
> 188 |     await expect(card).toContainText('1–50 dots');
      |                        ^ Error: expect(locator).toContainText(expected) failed
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
```