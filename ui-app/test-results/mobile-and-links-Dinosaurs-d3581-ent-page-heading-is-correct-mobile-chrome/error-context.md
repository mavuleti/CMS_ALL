# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mobile-and-links.spec.ts >> Dinosaurs page — content >> page heading is correct
- Location: tests\mobile-and-links.spec.ts:142:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: /dinosaur dot to dot printables for kids/i })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: /dinosaur dot to dot printables for kids/i })

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
> 144 |     await expect(page.getByRole('heading', { name: /dinosaur dot to dot printables for kids/i })).toBeVisible();
      |                                                                                                   ^ Error: expect(locator).toBeVisible() failed
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
```