# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mobile-and-links.spec.ts >> Dinosaurs page — content >> shows all 10 dinosaur cards
- Location: tests\mobile-and-links.spec.ts:153:7

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('article.puzzle-card')
Expected: 8
Received: 11
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" with timeout 5000ms
  - waiting for locator('article.puzzle-card')
    13 × locator resolved to 11 elements
       - unexpected value "11"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Skip to main content" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - banner [ref=e3]:
    - navigation "Browse dot to dot puzzles by category" [ref=e4]:
      - link "DotToDotFreePrintables — Home" [ref=e5] [cursor=pointer]:
        - /url: /en/
        - text: DotToDotFreePrintables
      - link "Home" [ref=e10] [cursor=pointer]:
        - /url: /en/
      - button "Open categories menu" [ref=e14] [cursor=pointer]
      - generic "Language" [ref=e16]:
        - combobox "Select language" [ref=e20] [cursor=pointer]:
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
    - img [ref=e22]:
      - generic [ref=e23]: "1"
      - generic [ref=e25]: "2"
      - generic [ref=e27]: "3"
      - generic [ref=e29]: "4"
      - generic [ref=e31]: "5"
      - generic [ref=e33]: "6"
      - generic [ref=e35]: "7"
  - button "Share" [ref=e38] [cursor=pointer]
  - main [ref=e45]:
    - navigation "Breadcrumb" [ref=e46]:
      - link "Home" [ref=e47] [cursor=pointer]:
        - /url: /en/
      - generic [ref=e51]: ›
      - generic [ref=e52]: Dinosaurs
    - generic [ref=e53]:
      - paragraph [ref=e54]: 11 free printable puzzles
      - heading "Dinosaur Dot-to-Dot Printables for Kids" [level=1] [ref=e55]
      - paragraph [ref=e56]: Connect prehistoric giants from the first dot to the final reveal.
    - generic [ref=e59]:
      - article [ref=e60]:
        - link "Mighty Tyrannosaurus Rex stomping out of 61 numbered dots, free dinosaur sheet New" [ref=e61] [cursor=pointer]:
          - /url: /en/dinosaurs/trex-61-dot-to-dot-puzzle/
          - img "Mighty Tyrannosaurus Rex stomping out of 61 numbered dots, free dinosaur sheet" [ref=e62]
          - generic [ref=e63]: New
        - generic [ref=e64]:
          - paragraph [ref=e65]: Dinosaurs
          - heading "T-Rex 61-Dot Challenge" [level=2] [ref=e66]
          - paragraph [ref=e67]: A Bigger Tyrant Lizard Challenge
          - generic [ref=e68]:
            - generic [ref=e69]: Ages 6-9
            - generic [ref=e70]: 1–61 dots
          - img "Difficulty 2 out of 3" [ref=e71]
          - link "View & Download - T-Rex 61-Dot Challenge" [ref=e75] [cursor=pointer]:
            - /url: /en/dinosaurs/trex-61-dot-to-dot-puzzle/
            - text: View & Download
      - article [ref=e79]:
        - link "Sprinting ostrich, neck outstretched, caught in 55 printable dots New" [ref=e80] [cursor=pointer]:
          - /url: /en/dinosaurs/ostriches-dinosaur-dot-to-dot-puzzle/
          - img "Sprinting ostrich, neck outstretched, caught in 55 printable dots" [ref=e81]
          - generic [ref=e82]: New
        - generic [ref=e83]:
          - paragraph [ref=e84]: Dinosaurs
          - heading "Ostrich" [level=2] [ref=e85]
          - paragraph [ref=e86]: The World's Biggest Bird
          - generic [ref=e87]:
            - generic [ref=e88]: Ages 5-8
            - generic [ref=e89]: 1–55 dots
          - img "Difficulty 1 out of 3" [ref=e90]
          - link "View & Download - Ostrich" [ref=e94] [cursor=pointer]:
            - /url: /en/dinosaurs/ostriches-dinosaur-dot-to-dot-puzzle/
            - text: View & Download
      - article [ref=e98]:
        - link "Long-necked Brontosaurus stretching across 50 dots on a preschool printable New" [ref=e99] [cursor=pointer]:
          - /url: /en/dinosaurs/brontosaurus-dot-to-dot-puzzle/
          - img "Long-necked Brontosaurus stretching across 50 dots on a preschool printable" [ref=e100]
          - generic [ref=e101]: New
        - generic [ref=e102]:
          - paragraph [ref=e103]: Dinosaurs
          - heading "Brontosaurus" [level=2] [ref=e104]
          - paragraph [ref=e105]: The Friendly Thunder Lizard
          - generic [ref=e106]:
            - generic [ref=e107]: Ages 4-7
            - generic [ref=e108]: 1–50 dots
          - img "Difficulty 1 out of 3" [ref=e109]
          - link "View & Download - Brontosaurus" [ref=e113] [cursor=pointer]:
            - /url: /en/dinosaurs/brontosaurus-dot-to-dot-puzzle/
            - text: View & Download
      - article [ref=e117]:
        - link "Three-horned Triceratops and its bony frill emerging from 70 printable dots New" [ref=e118] [cursor=pointer]:
          - /url: /en/dinosaurs/triceratops-dot-to-dot-puzzle/
          - img "Three-horned Triceratops and its bony frill emerging from 70 printable dots" [ref=e119]
          - generic [ref=e120]: New
        - generic [ref=e121]:
          - paragraph [ref=e122]: Dinosaurs
          - heading "Triceratops" [level=2] [ref=e123]
          - paragraph [ref=e124]: Three Horns, One Amazing Puzzle
          - generic [ref=e125]:
            - generic [ref=e126]: Ages 6-9
            - generic [ref=e127]: 1–70 dots
          - img "Difficulty 2 out of 3" [ref=e128]
          - link "View & Download - Triceratops" [ref=e132] [cursor=pointer]:
            - /url: /en/dinosaurs/triceratops-dot-to-dot-puzzle/
            - text: View & Download
      - article [ref=e136]:
        - link "Feathered Velociraptor poised to sprint, sketched in 54 printable dots New" [ref=e137] [cursor=pointer]:
          - /url: /en/dinosaurs/velociraptor-dot-to-dot-puzzle/
          - img "Feathered Velociraptor poised to sprint, sketched in 54 printable dots" [ref=e138]
          - generic [ref=e139]: New
        - generic [ref=e140]:
          - paragraph [ref=e141]: Dinosaurs
          - heading "Velociraptor" [level=2] [ref=e142]
          - paragraph [ref=e143]: Fast, Smart, and Ready to Pounce
          - generic [ref=e144]:
            - generic [ref=e145]: Ages 6-9
            - generic [ref=e146]: 1–54 dots
          - img "Difficulty 2 out of 3" [ref=e147]
          - link "View & Download - Velociraptor" [ref=e151] [cursor=pointer]:
            - /url: /en/dinosaurs/velociraptor-dot-to-dot-puzzle/
            - text: View & Download
      - article [ref=e155]:
        - link "Stegosaurus with its double row of back plates built from 52 printable dots New" [ref=e156] [cursor=pointer]:
          - /url: /en/dinosaurs/stegosaurus-dot-to-dot-puzzle/
          - img "Stegosaurus with its double row of back plates built from 52 printable dots" [ref=e157]
          - generic [ref=e158]: New
        - generic [ref=e159]:
          - paragraph [ref=e160]: Dinosaurs
          - heading "Stegosaurus" [level=2] [ref=e161]
          - paragraph [ref=e162]: Spiky Plates, Big Fun
          - generic [ref=e163]:
            - generic [ref=e164]: Ages 4-7
            - generic [ref=e165]: 1–52 dots
          - img "Difficulty 1 out of 3" [ref=e166]
          - link "View & Download - Stegosaurus" [ref=e170] [cursor=pointer]:
            - /url: /en/dinosaurs/stegosaurus-dot-to-dot-puzzle/
            - text: View & Download
      - article [ref=e174]:
        - link "Sail-backed Spinosaurus surfacing through 74 dots on a free dinosaur printable New" [ref=e175] [cursor=pointer]:
          - /url: /en/dinosaurs/spinosaurus/
          - img "Sail-backed Spinosaurus surfacing through 74 dots on a free dinosaur printable" [ref=e176]
          - generic [ref=e177]: New
        - generic [ref=e178]:
          - paragraph [ref=e179]: Dinosaurs
          - heading "Spinosaurus" [level=2] [ref=e180]
          - paragraph [ref=e181]: Bigger Than T-Rex
          - generic [ref=e182]:
            - generic [ref=e183]: Ages 6-10
            - generic [ref=e184]: 1–74 dots
          - img "Difficulty 2 out of 3" [ref=e185]
          - link "View & Download - Spinosaurus" [ref=e189] [cursor=pointer]:
            - /url: /en/dinosaurs/spinosaurus/
            - text: View & Download
      - article [ref=e193]:
        - link [ref=e194] [cursor=pointer]:
          - /url: /en/dinosaurs/brachiosaurus/
          - img "Towering Brachiosaurus reaching treetop height in 38 printable dots" [ref=e195]
        - generic [ref=e196]:
          - paragraph [ref=e197]: Dinosaurs
          - heading "Brachiosaurus" [level=2] [ref=e198]
          - paragraph [ref=e199]: The Gentle Giant of the Jurassic
          - generic [ref=e200]:
            - generic [ref=e201]: Ages 5-9
            - generic [ref=e202]: 1–38 dots
          - img "Difficulty 2 out of 3" [ref=e203]
          - link "View & Download - Brachiosaurus" [ref=e207] [cursor=pointer]:
            - /url: /en/dinosaurs/brachiosaurus/
            - text: View & Download
      - article [ref=e211]:
        - link [ref=e212] [cursor=pointer]:
          - /url: /en/dinosaurs/ankylosaurus/
          - img "Armoured Ankylosaurus and its tail club plated together from 32 dots" [ref=e213]
        - generic [ref=e214]:
          - paragraph [ref=e215]: Dinosaurs
          - heading "Ankylosaurus" [level=2] [ref=e216]
          - paragraph [ref=e217]: The Armoured Tank of the Dino World
          - generic [ref=e218]:
            - generic [ref=e219]: Ages 5-8
            - generic [ref=e220]: 1–32 dots
          - img "Difficulty 2 out of 3" [ref=e221]
          - link "View & Download - Ankylosaurus" [ref=e225] [cursor=pointer]:
            - /url: /en/dinosaurs/ankylosaurus/
            - text: View & Download
      - article [ref=e229]:
        - link "Pterodactyl soaring on wide wings, held aloft by 67 printable dots New" [ref=e230] [cursor=pointer]:
          - /url: /en/dinosaurs/pterodactyl-dot-to-dot-puzzle/
          - img "Pterodactyl soaring on wide wings, held aloft by 67 printable dots" [ref=e231]
          - generic [ref=e232]: New
        - generic [ref=e233]:
          - paragraph [ref=e234]: Dinosaurs
          - heading "Pterodactyl" [level=2] [ref=e235]
          - paragraph [ref=e236]: The Flying Dinosaur Kids Love
          - generic [ref=e237]:
            - generic [ref=e238]: Ages 6-9
            - generic [ref=e239]: 1–67 dots
          - img "Difficulty 2 out of 3" [ref=e240]
          - link "View & Download - Pterodactyl" [ref=e244] [cursor=pointer]:
            - /url: /en/dinosaurs/pterodactyl-dot-to-dot-puzzle/
            - text: View & Download
      - article [ref=e248]:
        - link [ref=e249] [cursor=pointer]:
          - /url: /en/dinosaurs/allosaurus/
          - img "Fierce Allosaurus baring strong jaws, assembled from 42 printable dots" [ref=e250]
        - generic [ref=e251]:
          - paragraph [ref=e252]: Dinosaurs
          - heading "Allosaurus" [level=2] [ref=e253]
          - paragraph [ref=e254]: The Lion of the Jurassic
          - generic [ref=e255]:
            - generic [ref=e256]: Ages 6-10
            - generic [ref=e257]: 1–42 dots
          - img "Difficulty 3 out of 3" [ref=e258]
          - link "View & Download - Allosaurus" [ref=e262] [cursor=pointer]:
            - /url: /en/dinosaurs/allosaurus/
            - text: View & Download
    - generic [ref=e266]:
      - heading "Roar Through Number Practice" [level=2] [ref=e267]
      - paragraph [ref=e268]: Dinosaur puzzles build number confidence, concentration, and pencil control.
      - link "← Back to all categories" [ref=e269] [cursor=pointer]:
        - /url: /en/
    - region "Frequently asked questions" [ref=e270]:
      - generic [ref=e271]:
        - paragraph [ref=e272]: Common questions
        - heading "Frequently asked questions" [level=2] [ref=e273]
      - generic [ref=e274]:
        - group [ref=e275]:
          - generic "How many free dinosaurs dot to dot printables are there?" [ref=e276] [cursor=pointer]
        - group [ref=e279]:
          - generic "Are the dinosaurs dot to dot puzzles free to print?" [ref=e280] [cursor=pointer]
        - group [ref=e283]:
          - generic "What ages are the dinosaurs puzzles for?" [ref=e284] [cursor=pointer]
        - group [ref=e287]:
          - generic "Which dinosaur dot to dot puzzles are available?" [ref=e288] [cursor=pointer]
        - group [ref=e291]:
          - generic "What is the easiest dinosaur dot to dot for young kids?" [ref=e292] [cursor=pointer]
        - group [ref=e295]:
          - generic "Do dinosaur dot to dot puzzles teach real dinosaur facts?" [ref=e296] [cursor=pointer]
  - contentinfo [ref=e299]:
    - generic [ref=e300]: DotToDotFreePrintables.com
    - paragraph [ref=e306]: Free dot to dot printables and connect-the-dots worksheets for kids, parents, and teachers in the US, UK, Canada, and Australia. All puzzles are free to download, print, and share.
    - navigation "Free dot to dot printables and connect-the-dots worksheets for kids, parents, and teachers in the US, UK, Canada, and Australia. All puzzles are free to download, print, and share." [ref=e307]:
      - link "Blog" [ref=e308] [cursor=pointer]:
        - /url: /en/blog/
      - link "FAQ" [ref=e309] [cursor=pointer]:
        - /url: /en/#faq
      - link "Feedback" [ref=e310] [cursor=pointer]:
        - /url: /en/#feedback
      - link "About" [ref=e311] [cursor=pointer]:
        - /url: /en/about/
      - link "Contact" [ref=e312] [cursor=pointer]:
        - /url: /en/contact/
      - link "Privacy" [ref=e313] [cursor=pointer]:
        - /url: /en/privacy-policy/
      - link "Terms" [ref=e314] [cursor=pointer]:
        - /url: /en/terms/
      - link "Dot to Dot Puzzle Pack" [ref=e315] [cursor=pointer]:
        - /url: /en/premium/
      - link "Sitemap" [ref=e316] [cursor=pointer]:
        - /url: /sitemap.xml
    - generic "Free dot to dot printables and connect-the-dots worksheets for kids, parents, and teachers in the US, UK, Canada, and Australia. All puzzles are free to download, print, and share." [ref=e317]:
      - link "YouTube" [ref=e318] [cursor=pointer]:
        - /url: https://www.youtube.com/@dottodotfreeprintables_com
      - link "Pinterest" [ref=e322] [cursor=pointer]:
        - /url: https://www.pinterest.com/hellokidsbookworld/
    - paragraph [ref=e325]: © 2026 DotToDotFreePrintables.com · Free printable activities for children - v1.0.0
  - alert [ref=e326]
```

# Test source

```ts
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
> 156 |     await expect(cards).toHaveCount(8);
      |                         ^ Error: expect(locator).toHaveCount(expected) failed
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
```