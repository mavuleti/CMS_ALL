# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mobile-and-links.spec.ts >> Dinosaurs page — content >> JSON-LD ItemList schema is present
- Location: tests\mobile-and-links.spec.ts:232:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Matcher error: received value must not be null nor undefined

Received has value: undefined
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Skip to content" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - banner [ref=e3]:
    - navigation "categories.heading" [ref=e4]:
      - link "DotToDotFreePrintables — Home" [ref=e5] [cursor=pointer]:
        - /url: /en/
        - text: DotToDotFreePrintables
      - navigation "Browse categories" [ref=e10]:
        - link "Home" [ref=e11] [cursor=pointer]:
          - /url: /en/
        - link "Flowers" [ref=e17] [cursor=pointer]:
          - /url: /en/flowers/
          - generic [ref=e18]: New
        - link "Cute" [ref=e26] [cursor=pointer]:
          - /url: /en/cute/
          - generic [ref=e27]:
            - generic [ref=e28]: 🐶
            - generic [ref=e29]: New
        - link "Playgrounds" [ref=e31] [cursor=pointer]:
          - /url: /en/playgrounds/
          - generic [ref=e32]: 🛝
        - link "Dinosaurs" [ref=e35] [cursor=pointer]:
          - /url: /en/dinosaurs/
          - generic [ref=e36]: 🦖
        - link "Ocean" [ref=e39] [cursor=pointer]:
          - /url: /en/ocean/
        - link "Circus" [ref=e46] [cursor=pointer]:
          - /url: /en/circus/
          - generic [ref=e47]:
            - generic [ref=e48]: 🤡
            - generic [ref=e49]: New
        - link "More" [ref=e51] [cursor=pointer]:
          - /url: /en/#categories
    - img [ref=e60]:
      - generic [ref=e61]: "1"
      - generic [ref=e63]: "2"
      - generic [ref=e65]: "3"
      - generic [ref=e67]: "4"
      - generic [ref=e69]: "5"
      - generic [ref=e71]: "6"
      - generic [ref=e73]: "7"
      - generic [ref=e75]: "8"
      - generic [ref=e77]: "9"
      - generic [ref=e79]: "10"
      - generic [ref=e81]: "11"
      - generic [ref=e83]: "12"
      - generic [ref=e85]: "13"
      - generic [ref=e87]: "14"
      - generic [ref=e89]: "15"
      - generic [ref=e91]: "16"
      - generic [ref=e93]: "17"
      - generic [ref=e95]: "18"
      - generic [ref=e97]: "19"
      - generic [ref=e99]: "20"
      - generic [ref=e101]: "21"
      - generic [ref=e103]: "22"
      - generic [ref=e105]: "23"
      - generic [ref=e107]: "24"
      - generic [ref=e109]: "25"
      - generic [ref=e111]: "26"
      - generic [ref=e113]: "27"
      - generic [ref=e115]: "28"
      - generic [ref=e117]: "29"
      - generic [ref=e119]: "30"
  - generic [ref=e121]:
    - link "Scan me" [ref=e122] [cursor=pointer]:
      - /url: /en/
      - img "Scan me" [ref=e123]
    - generic [ref=e124]: Scan me
  - main [ref=e125]:
    - navigation "Breadcrumb" [ref=e126]:
      - link "Home" [ref=e127] [cursor=pointer]:
        - /url: /en/
      - generic [ref=e131]: ›
      - generic [ref=e132]: Dinosaurs
    - generic [ref=e133]:
      - paragraph [ref=e134]: 8 free printable puzzles
      - heading "Dinosaur Dot to Dot Printables for Kids" [level=1] [ref=e135]
      - paragraph [ref=e136]: From T-Rex's powerful jaws to Stegosaurus's plated back, these dot to dot printables turn counting practice into prehistoric reveals for ages 4–10 — from 38-dot starter pages to 70+ dot challenges. Download free PDFs for home or classroom use in 2026.
    - img "Dinosaurs" [ref=e138]
    - generic [ref=e141]:
      - article [ref=e142]:
        - link [ref=e143] [cursor=pointer]:
          - /url: /en/dinosaurs/trex-61-dot-to-dot-puzzle/
          - img "Mighty Tyrannosaurus Rex stomping out of 61 numbered dots, free dinosaur sheet" [ref=e144]
        - generic [ref=e145]:
          - paragraph [ref=e146]: Dinosaurs
          - heading "T-Rex 61-Dot Challenge" [level=2] [ref=e147]
          - paragraph [ref=e148]: A Bigger Tyrant Lizard Challenge
          - generic [ref=e149]:
            - generic [ref=e150]: Ages 6-9
            - generic [ref=e151]: 61 dots
          - 'img "Difficulty: 2" [ref=e152]'
          - link "View & download - T-Rex 61-Dot Challenge" [ref=e156] [cursor=pointer]:
            - /url: /en/dinosaurs/trex-61-dot-to-dot-puzzle/
            - text: View & download
      - article [ref=e160]:
        - link [ref=e161] [cursor=pointer]:
          - /url: /en/dinosaurs/ostriches-dinosaur-dot-to-dot-puzzle/
          - img "Sprinting ostrich, neck outstretched, caught in 55 printable dots" [ref=e162]
        - generic [ref=e163]:
          - paragraph [ref=e164]: Dinosaurs
          - heading "Ostrich" [level=2] [ref=e165]
          - paragraph [ref=e166]: The World's Biggest Bird
          - generic [ref=e167]:
            - generic [ref=e168]: Ages 5-8
            - generic [ref=e169]: 55 dots
          - 'img "Difficulty: 1" [ref=e170]'
          - link "View & download - Ostrich" [ref=e174] [cursor=pointer]:
            - /url: /en/dinosaurs/ostriches-dinosaur-dot-to-dot-puzzle/
            - text: View & download
      - article [ref=e178]:
        - link [ref=e179] [cursor=pointer]:
          - /url: /en/dinosaurs/brontosaurus-dot-to-dot-puzzle/
          - img "Long-necked Brontosaurus stretching across 50 dots on a preschool printable" [ref=e180]
        - generic [ref=e181]:
          - paragraph [ref=e182]: Dinosaurs
          - heading "Brontosaurus" [level=2] [ref=e183]
          - paragraph [ref=e184]: The Friendly Thunder Lizard
          - generic [ref=e185]:
            - generic [ref=e186]: Ages 4-7
            - generic [ref=e187]: 50 dots
          - 'img "Difficulty: 1" [ref=e188]'
          - link "View & download - Brontosaurus" [ref=e192] [cursor=pointer]:
            - /url: /en/dinosaurs/brontosaurus-dot-to-dot-puzzle/
            - text: View & download
      - article [ref=e196]:
        - link [ref=e197] [cursor=pointer]:
          - /url: /en/dinosaurs/triceratops-dot-to-dot-puzzle/
          - img "Three-horned Triceratops and its bony frill emerging from 70 printable dots" [ref=e198]
        - generic [ref=e199]:
          - paragraph [ref=e200]: Dinosaurs
          - heading "Triceratops" [level=2] [ref=e201]
          - paragraph [ref=e202]: Three Horns, One Amazing Puzzle
          - generic [ref=e203]:
            - generic [ref=e204]: Ages 6-9
            - generic [ref=e205]: 0 dots
          - 'img "Difficulty: 1" [ref=e206]'
          - link "View & download - Triceratops" [ref=e210] [cursor=pointer]:
            - /url: /en/dinosaurs/triceratops-dot-to-dot-puzzle/
            - text: View & download
      - article [ref=e214]:
        - link [ref=e215] [cursor=pointer]:
          - /url: /en/dinosaurs/velociraptor-dot-to-dot-puzzle/
          - img "Feathered Velociraptor poised to sprint, sketched in 54 printable dots" [ref=e216]
        - generic [ref=e217]:
          - paragraph [ref=e218]: Dinosaurs
          - heading "Velociraptor" [level=2] [ref=e219]
          - paragraph [ref=e220]: Fast, Smart, and Ready to Pounce
          - generic [ref=e221]:
            - generic [ref=e222]: Ages 5-8
            - generic [ref=e223]: 0 dots
          - 'img "Difficulty: 1" [ref=e224]'
          - link "View & download - Velociraptor" [ref=e228] [cursor=pointer]:
            - /url: /en/dinosaurs/velociraptor-dot-to-dot-puzzle/
            - text: View & download
      - article [ref=e232]:
        - link [ref=e233] [cursor=pointer]:
          - /url: /en/dinosaurs/stegosaurus-dot-to-dot-puzzle/
          - img "Stegosaurus with its double row of back plates built from 52 printable dots" [ref=e234]
        - generic [ref=e235]:
          - paragraph [ref=e236]: Dinosaurs
          - heading "Stegosaurus" [level=2] [ref=e237]
          - paragraph [ref=e238]: Spiky Plates, Big Fun
          - generic [ref=e239]:
            - generic [ref=e240]: Ages 4-7
            - generic [ref=e241]: 52 dots
          - 'img "Difficulty: 1" [ref=e242]'
          - link "View & download - Stegosaurus" [ref=e246] [cursor=pointer]:
            - /url: /en/dinosaurs/stegosaurus-dot-to-dot-puzzle/
            - text: View & download
      - article [ref=e250]:
        - link [ref=e251] [cursor=pointer]:
          - /url: /en/dinosaurs/spinosaurus/
          - img "Sail-backed Spinosaurus surfacing through 74 dots on a free dinosaur printable" [ref=e252]
        - generic [ref=e253]:
          - paragraph [ref=e254]: Dinosaurs
          - heading "Spinosaurus" [level=2] [ref=e255]
          - paragraph [ref=e256]: Bigger Than T-Rex
          - generic [ref=e257]:
            - generic [ref=e258]: Ages 6-10
            - generic [ref=e259]: 74 dots
          - 'img "Difficulty: 2" [ref=e260]'
          - link "View & download - Spinosaurus" [ref=e264] [cursor=pointer]:
            - /url: /en/dinosaurs/spinosaurus/
            - text: View & download
      - article [ref=e268]:
        - link [ref=e269] [cursor=pointer]:
          - /url: /en/dinosaurs/pterodactyl-dot-to-dot-puzzle/
          - img "Pterodactyl soaring on wide wings, held aloft by 67 printable dots" [ref=e270]
        - generic [ref=e271]:
          - paragraph [ref=e272]: Dinosaurs
          - heading "Pterodactyl" [level=2] [ref=e273]
          - paragraph [ref=e274]: The Flying Dinosaur Kids Love
          - generic [ref=e275]:
            - generic [ref=e276]: Ages 6-9
            - generic [ref=e277]: 67 dots
          - 'img "Difficulty: 2" [ref=e278]'
          - link "View & download - Pterodactyl" [ref=e282] [cursor=pointer]:
            - /url: /en/dinosaurs/pterodactyl-dot-to-dot-puzzle/
            - text: View & download
    - generic [ref=e286]:
      - heading "Why kids love dinosaur dot to dot puzzles" [level=2] [ref=e287]
      - paragraph [ref=e288]: From T-Rex's powerful jaws to Stegosaurus's plated back, these dot to dot printables turn counting practice into prehistoric reveals for ages 4–10 — from 38-dot starter pages to 70+ dot challenges. Download free PDFs for home or classroom use in 2026.
      - link "← Back to all categories" [ref=e289] [cursor=pointer]:
        - /url: /en/
    - region [ref=e290]:
      - heading "Frequently Asked Questions" [level=2] [ref=e291]
      - group [ref=e292]:
        - generic "How many free dinosaurs dot to dot printables are there?" [ref=e293]
      - group [ref=e294]:
        - generic "Are the dinosaurs dot to dot puzzles free to print?" [ref=e295]
      - group [ref=e296]:
        - generic "What ages are the dinosaurs puzzles for?" [ref=e297]
      - group [ref=e298]:
        - generic "Which dinosaur dot to dot puzzles are available?" [ref=e299]
      - group [ref=e300]:
        - generic "What is the easiest dinosaur dot to dot for young kids?" [ref=e301]
      - group [ref=e302]:
        - generic "Do dinosaur dot to dot puzzles teach real dinosaur facts?" [ref=e303]
  - generic "Share this page" [ref=e304]:
    - generic [ref=e305]:
      - link "Share — WhatsApp" [ref=e306] [cursor=pointer]:
        - /url: https://wa.me/?text=Dinosaur%20Dot%20to%20Dot%20Printables%20%E2%80%94%20Free%20PDF%20Worksheets%20for%20Kids%20%7C%20DotToDotFreePrintables.com%20https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2F
      - link "Share — Facebook" [ref=e309] [cursor=pointer]:
        - /url: https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2F
      - link "Share — Pinterest" [ref=e312] [cursor=pointer]:
        - /url: https://pinterest.com/pin/create/button/?url=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2F&description=Dinosaur%20Dot%20to%20Dot%20Printables%20%E2%80%94%20Free%20PDF%20Worksheets%20for%20Kids%20%7C%20DotToDotFreePrintables.com
      - link "Share — X" [ref=e315] [cursor=pointer]:
        - /url: https://twitter.com/intent/tweet?url=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2F&text=Dinosaur%20Dot%20to%20Dot%20Printables%20%E2%80%94%20Free%20PDF%20Worksheets%20for%20Kids%20%7C%20DotToDotFreePrintables.com
      - button "Copy link" [ref=e318] [cursor=pointer]
  - contentinfo [ref=e322]:
    - generic [ref=e323]: DotToDotFreePrintables.com
    - paragraph [ref=e329]: Free printable dot-to-dot puzzles for kids.
    - navigation "Free printable dot-to-dot puzzles for kids." [ref=e330]:
      - link "Blog" [ref=e331] [cursor=pointer]:
        - /url: /en/blog/
      - link "FAQ" [ref=e332] [cursor=pointer]:
        - /url: /en/#faq
      - link "Feedback" [ref=e333] [cursor=pointer]:
        - /url: /en/#feedback
      - link "About" [ref=e334] [cursor=pointer]:
        - /url: /en/about/
      - link "Contact" [ref=e335] [cursor=pointer]:
        - /url: /en/contact/
      - link "Privacy" [ref=e336] [cursor=pointer]:
        - /url: /en/privacy-policy/
      - link "Terms" [ref=e337] [cursor=pointer]:
        - /url: /en/terms/
      - link "Printable puzzle pack" [ref=e338] [cursor=pointer]:
        - /url: /en/premium/
      - link "Sitemap" [ref=e339] [cursor=pointer]:
        - /url: /sitemap.xml
    - generic "Free printable dot-to-dot puzzles for kids." [ref=e340]:
      - link "YouTube" [ref=e341] [cursor=pointer]:
        - /url: https://www.youtube.com/@dottodotfreeprintables_com
      - link "Pinterest" [ref=e345] [cursor=pointer]:
        - /url: https://www.pinterest.com/hellokidsbookworld/
    - paragraph [ref=e348]: Copyright 2026 - v1.0.0
  - alert [ref=e349]
```

# Test source

```ts
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
> 235 |     expect(content).toContain('trex-61-dot-to-dot-puzzle');
      |                     ^ Error: expect(received).toContain(expected) // indexOf
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
```