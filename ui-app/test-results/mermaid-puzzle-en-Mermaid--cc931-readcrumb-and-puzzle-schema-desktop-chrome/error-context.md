# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mermaid-puzzle.spec.ts >> en Mermaid puzzle functionality >> publishes canonical, social, breadcrumb, and puzzle schema
- Location: tests\mermaid-puzzle.spec.ts:75:9

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
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
      - navigation "Browse puzzle categories" [ref=e10]:
        - link "Home" [ref=e11] [cursor=pointer]:
          - /url: /en/
        - link "Flowers" [ref=e17] [cursor=pointer]:
          - /url: /en/flowers/
          - generic [ref=e18]: New
        - link "Cute Puzzles" [ref=e26] [cursor=pointer]:
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
        - link "Circus" [ref=e44] [cursor=pointer]:
          - /url: /en/circus/
          - generic [ref=e45]:
            - generic [ref=e46]: 🤡
            - generic [ref=e47]: New
        - link "More categories" [ref=e49] [cursor=pointer]:
          - /url: /en/#categories
      - generic "Language" [ref=e57]:
        - combobox "Select language" [ref=e61] [cursor=pointer]:
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
    - img [ref=e63]:
      - generic [ref=e64]: "1"
      - generic [ref=e66]: "2"
      - generic [ref=e68]: "3"
      - generic [ref=e70]: "4"
      - generic [ref=e72]: "5"
      - generic [ref=e74]: "6"
      - generic [ref=e76]: "7"
      - generic [ref=e78]: "8"
      - generic [ref=e80]: "9"
      - generic [ref=e82]: "10"
      - generic [ref=e84]: "11"
      - generic [ref=e86]: "12"
      - generic [ref=e88]: "13"
      - generic [ref=e90]: "14"
      - generic [ref=e92]: "15"
      - generic [ref=e94]: "16"
      - generic [ref=e96]: "17"
      - generic [ref=e98]: "18"
      - generic [ref=e100]: "19"
      - generic [ref=e102]: "20"
      - generic [ref=e104]: "21"
      - generic [ref=e106]: "22"
      - generic [ref=e108]: "23"
      - generic [ref=e110]: "24"
      - generic [ref=e112]: "25"
      - generic [ref=e114]: "26"
      - generic [ref=e116]: "27"
      - generic [ref=e118]: "28"
      - generic [ref=e120]: "29"
      - generic [ref=e122]: "30"
  - generic [ref=e124]:
    - link "Scan me" [ref=e125] [cursor=pointer]:
      - /url: /en/
      - img "Scan me" [ref=e126]
    - generic [ref=e127]: Scan me
  - main [ref=e128]:
    - navigation "Breadcrumb" [ref=e129]:
      - link "Home" [ref=e130] [cursor=pointer]:
        - /url: /en/
      - generic [ref=e134]: ›
      - link "Ocean" [ref=e135] [cursor=pointer]:
        - /url: /en/ocean/
      - generic [ref=e136]: ›
      - generic [ref=e137]: Mermaid
    - generic [ref=e139]:
      - img "Mermaid gliding underwater, her tail curved through 54 printable numbered dots" [ref=e142]
      - generic [ref=e143]:
        - paragraph [ref=e144]: Free Ocean Printable
        - heading "Mermaid Dot to Dot — Magical 54-Dot Free Printable" [level=1] [ref=e145]
        - paragraph [ref=e146]: Connect the dots to reveal a beautiful mermaid gliding through the ocean. This easy 54-dot puzzle is perfect for young learners practising number sequencing while enjoying a touch of underwater magic.
        - generic [ref=e147]:
          - generic [ref=e148]: "Ages: 5-8"
          - generic [ref=e149]: "Dots: 1–54"
          - generic [ref=e150]: 100% Free
        - generic [ref=e151]:
          - paragraph [ref=e152]: Difficulty
          - generic [ref=e153]:
            - img "Difficulty 1 out of 3" [ref=e154]
            - generic [ref=e158]: Easy
        - generic [ref=e159]:
          - generic [ref=e160]: "!"
          - generic [ref=e161]:
            - strong [ref=e162]: "Fun fact:"
            - text: Mermaids appear in folklore from ancient Assyria — over 3,000 years ago!
        - generic [ref=e164]:
          - generic "Downloaded 1020+ times" [ref=e165]:
            - generic [ref=e166]: ★
            - generic [ref=e168]:
              - strong [ref=e169]: Downloaded
              - generic [ref=e170]: 1,020+
              - generic [ref=e171]: times
              - generic [ref=e172]: You’ve made a great choice!
            - generic [ref=e173]: ✦
            - generic [ref=e174]: ✦
          - generic [ref=e175]:
            - 'link "Download (Print Size: US Letter) – Download free Mermaid dot-to-dot printable PDF" [ref=e176] [cursor=pointer]':
              - /url: /ocean/mermaid-dot-to-dot-printable-horizontal.pdf
              - text: "Download (Print Size: US Letter)"
            - 'link "Download (Print Size: A4) – Download free Mermaid dot-to-dot printable PDF" [ref=e180] [cursor=pointer]':
              - /url: /ocean/mermaid-dot-to-dot-printable-horizontal_A4.pdf
              - text: "Download (Print Size: A4)"
          - paragraph [ref=e184]: Free for home and classroom use.
        - group "Share" [ref=e185]:
          - link "Share — WhatsApp" [ref=e193] [cursor=pointer]:
            - /url: https://wa.me/?text=Mermaid%20Dot-to-Dot%20Printable%20-%20Free%20PDF%20https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Focean%2Fmermaid-dot-to-dot-puzzle%2F
          - link "Share — Facebook" [ref=e196] [cursor=pointer]:
            - /url: https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Focean%2Fmermaid-dot-to-dot-puzzle%2F
          - link "Share — Pinterest" [ref=e199] [cursor=pointer]:
            - /url: https://pinterest.com/pin/create/button/?url=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Focean%2Fmermaid-dot-to-dot-puzzle%2F&media=http%3A%2F%2F127.0.0.1%3A4444%2Fimages%2Fmermaid-puzzle.webp&description=Mermaid%20Dot-to-Dot%20Printable%20-%20Free%20PDF
          - link "Share — X" [ref=e202] [cursor=pointer]:
            - /url: https://twitter.com/intent/tweet?url=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Focean%2Fmermaid-dot-to-dot-puzzle%2F&text=Mermaid%20Dot-to-Dot%20Printable%20-%20Free%20PDF
          - button "Copy link" [ref=e205] [cursor=pointer]
          - status
        - paragraph [ref=e209]: No sign-up needed. Opens as a PDF. Print on US Letter (8.5 × 11 inch) or A4 paper. Free for home and classroom use.
        - link "Back to all Ocean puzzles" [ref=e210] [cursor=pointer]:
          - /url: /en/ocean/
    - generic [ref=e213]:
      - heading "Mermaid Dot-to-Dot Puzzle Guide" [level=2] [ref=e214]
      - paragraph [ref=e215]:
        - text: Mermaids have captured children's imaginations for thousands of years — from the ancient seas of Assyria to the fairy tales of Hans Christian Andersen. This beautiful 54-dot puzzle traces the graceful outline of a mermaid gliding through the deep. It is a wonderful puzzle for quiet, focused time — perfect for a rainy afternoon or a calm
        - link "classroom activity for kids" [ref=e216] [cursor=pointer]:
          - /url: /en/playgrounds/
        - text: . Find dot 1 and let the magic begin!
      - generic [ref=e217]:
        - heading "1–9 — The Face and Hair" [level=3] [ref=e218]
        - paragraph [ref=e219]: Start at dot 1 and connect through to dot 9 to trace the mermaid's face and the flowing lines of her hair. Faces involve gentle, rounded curves — a lovely warm-up that builds pencil confidence before the bigger shapes ahead. Encourage children to lift their wrist slightly and let the pencil glide.
        - generic [ref=e220]:
          - generic [ref=e221]: 💡
          - generic [ref=e222]:
            - generic [ref=e223]: Fun fact!
            - text: Mermaid legends have appeared independently in cultures all around the world — from West African water spirits to the Japanese Ningyo and the ancient Greek sea-nymph Nereids. The idea of half-human, half-fish beings seems to be something the human imagination keeps arriving at, no matter the ocean.
      - generic [ref=e224]:
        - heading "10–22 — The Arms and Upper Body" [level=3] [ref=e225]
        - paragraph [ref=e226]: Continue from dot 10 to dot 22 to draw the arms and torso. Children practise symmetry and the natural curve of a human figure here — a section that works especially well for discussing body proportions in a fun, low-pressure way. A light, flowing touch gives the most elegant result.
        - generic [ref=e227]:
          - generic [ref=e228]: 💡
          - generic [ref=e229]:
            - generic [ref=e230]: Fun fact!
            - text: "The most famous mermaid story in English-speaking culture — The Little Mermaid — was written by Hans Christian Andersen in 1837. The original tale is quite different from the animated film: far more bittersweet, and intended to reflect on sacrifice, longing, and what it means to have a soul."
      - generic [ref=e231]:
        - heading "23–36 — The Waist and Scales" [level=3] [ref=e232]
        - paragraph [ref=e233]: Trace dots 23 through 36 for the midsection where the human form transitions into the fish tail — the most distinctively mermaid part of the whole drawing. Children learn to follow a shape that narrows and then sweeps outward again. This middle section rewards patience and careful dot-finding.
        - generic [ref=e234]:
          - generic [ref=e235]: 💡
          - generic [ref=e236]:
            - generic [ref=e237]: Fun fact!
            - text: Scientists believe the mermaid myth may have partly originated from sailors spotting manatees or dugongs at sea. At a distance, a manatee surfacing to breathe — with its rounded body and paddle-like tail — can look surprisingly humanoid. It is a generous interpretation, but loneliness and distance do remarkable things to the imagination.
      - generic [ref=e238]:
        - heading "37–46 — The Fish Tail" [level=3] [ref=e239]
        - paragraph [ref=e240]: Connect dots 37 to 46 to sweep the long, graceful fish tail downward. This is the most satisfying section of the puzzle — children feel the mermaid taking her final, recognisable shape. Long, flowing strokes work beautifully here. Encourage children to draw from the shoulder rather than just the wrist.
        - generic [ref=e241]:
          - generic [ref=e242]: 💡
          - generic [ref=e243]:
            - generic [ref=e244]: Fun fact!
            - text: "In most mermaid folklore, the tail is described as iridescent — shimmering with multiple colours like a soap bubble or a fish scale in sunlight. When it comes to colouring this puzzle, there is no wrong answer: silver, ocean blue, emerald green, or all three at once are all equally valid!"
      - generic [ref=e245]:
        - heading "47–54 — The Tail Fins" [level=3] [ref=e246]
        - paragraph [ref=e247]: Finish by connecting dots 47 through 54 to add the broad, sweeping tail fins that complete the mermaid's silhouette. Just eight dots to the finish line — encourage children to make each one count and end with a confident, graceful flourish. The tail fin is the mermaid's full stop!
        - generic [ref=e248]:
          - generic [ref=e249]: 💡
          - generic [ref=e250]:
            - generic [ref=e251]: Fun fact!
            - text: Fish tails move side-to-side, but whale and dolphin tails — called flukes — move up and down. If a mermaid existed in real life, scientists debate which style of tail would make more sense for a human-shaped upper body. The answer, based on the way human hips move, would likely be the up-and-down dolphin style.
    - generic [ref=e252]:
      - generic [ref=e253]:
        - paragraph [ref=e254]: More free Ocean printables
        - heading "You might also like" [level=2] [ref=e255]
      - generic [ref=e256]:
        - article [ref=e257]:
          - link [ref=e258] [cursor=pointer]:
            - /url: /en/ocean/merman-dot-to-dot-puzzle/
            - img "Merman rising from the waves along 44 easy dots on a preschool printable" [ref=e259]
          - generic [ref=e260]:
            - paragraph [ref=e261]: Ocean
            - heading "Merman" [level=3] [ref=e262]
            - generic [ref=e263]:
              - generic [ref=e264]: Ages 4-7
              - generic [ref=e265]: 1–44 dots
            - link "View & Download" [ref=e266] [cursor=pointer]:
              - /url: /en/ocean/merman-dot-to-dot-puzzle/
        - article [ref=e269]:
          - link [ref=e270] [cursor=pointer]:
            - /url: /en/ocean/seahorse-dot-to-dot-puzzle/
            - img "Little seahorse floating upright, outlined by just 35 dots on a free worksheet" [ref=e271]
          - generic [ref=e272]:
            - paragraph [ref=e273]: Ocean
            - heading "Seahorse" [level=3] [ref=e274]
            - generic [ref=e275]:
              - generic [ref=e276]: Ages 4-7
              - generic [ref=e277]: 1–35 dots
            - link "View & Download" [ref=e278] [cursor=pointer]:
              - /url: /en/ocean/seahorse-dot-to-dot-puzzle/
        - article [ref=e281]:
          - link [ref=e282] [cursor=pointer]:
            - /url: /en/ocean/whale-dot-to-dot-puzzle/
            - img "Mighty whale mid-swim, its back arched over 42 numbered printable dots" [ref=e283]
          - generic [ref=e284]:
            - paragraph [ref=e285]: Ocean
            - heading "Whale" [level=3] [ref=e286]
            - generic [ref=e287]:
              - generic [ref=e288]: Ages 4-7
              - generic [ref=e289]: 1–42 dots
            - link "View & Download" [ref=e290] [cursor=pointer]:
              - /url: /en/ocean/whale-dot-to-dot-puzzle/
    - region "Frequently asked questions" [ref=e293]:
      - generic [ref=e294]:
        - paragraph [ref=e295]: Common questions
        - heading "Frequently asked questions" [level=2] [ref=e296]
      - generic [ref=e297]:
        - group [ref=e298]:
          - generic "How many dots does the Mermaid dot to dot puzzle have?" [ref=e299] [cursor=pointer]
        - group [ref=e302]:
          - generic "Is the Mermaid dot to dot printable free?" [ref=e303] [cursor=pointer]
        - group [ref=e306]:
          - generic "What age is the Mermaid connect-the-dots worksheet best for?" [ref=e307] [cursor=pointer]
        - group [ref=e310]:
          - generic "What skills does the Mermaid dot to dot puzzle teach?" [ref=e311] [cursor=pointer]
        - group [ref=e314]:
          - generic "What is a fun fact about the mermaid?" [ref=e315] [cursor=pointer]
  - region [ref=e318]:
    - generic [ref=e319]:
      - generic [ref=e320]:
        - generic [ref=e325]:
          - paragraph [ref=e326]: Popular this week
          - heading "Most downloaded puzzles" [level=2] [ref=e327]
        - list [ref=e328]:
          - listitem [ref=e329]:
            - generic [ref=e330]: "1"
            - link "T-Rex 61-Dot Challenge" [ref=e331] [cursor=pointer]:
              - /url: /en/dinosaurs/trex-61-dot-to-dot-puzzle/
            - generic "23 or more downloads" [ref=e332]: 23+
          - listitem [ref=e336]:
            - generic [ref=e337]: "2"
            - link "Mermaid" [ref=e338] [cursor=pointer]:
              - /url: /en/ocean/mermaid-dot-to-dot-puzzle/
            - generic "20 or more downloads" [ref=e339]: 20+
          - listitem [ref=e343]:
            - generic [ref=e344]: "3"
            - link "Jellyfish" [ref=e345] [cursor=pointer]:
              - /url: /en/ocean/jellyfish-dot-to-dot-puzzle/
            - generic "10 or more downloads" [ref=e346]: 10+
          - listitem [ref=e350]:
            - generic [ref=e351]: "4"
            - link "Cute Puppy" [ref=e352] [cursor=pointer]:
              - /url: /en/cute/cute-puppy-dot-to-dot-puzzle/
            - generic "9 or more downloads" [ref=e353]: 9+
          - listitem [ref=e357]:
            - generic [ref=e358]: "5"
            - link "Spring Horse" [ref=e359] [cursor=pointer]:
              - /url: /en/playgrounds/spring-horse-playground-dot-to-dot-puzzle/
            - generic "7 or more downloads" [ref=e360]: 7+
          - listitem [ref=e364]:
            - generic [ref=e365]: "6"
            - link "Spinosaurus" [ref=e366] [cursor=pointer]:
              - /url: /en/dinosaurs/spinosaurus/
            - generic "7 or more downloads" [ref=e367]: 7+
          - listitem [ref=e371]:
            - generic [ref=e372]: "7"
            - link "Snowdrop Flower" [ref=e373] [cursor=pointer]:
              - /url: /en/flowers/snowdrop-flower-dot-to-dot-puzzle/
            - generic "7 or more downloads" [ref=e374]: 7+
          - listitem [ref=e378]:
            - generic [ref=e379]: "8"
            - link "Slide Playground" [ref=e380] [cursor=pointer]:
              - /url: /en/playgrounds/slide-playgrounds-dot-to-dot-puzzle/
            - generic "6 or more downloads" [ref=e381]: 6+
      - generic [ref=e385]:
        - generic [ref=e390]:
          - paragraph [ref=e391]: Fresh printables
          - heading "Recently added" [level=3] [ref=e392]
        - list [ref=e393]:
          - listitem [ref=e394]:
            - generic [ref=e395]: "1"
            - link "Circus Ringmaster Bear" [ref=e396] [cursor=pointer]:
              - /url: /en/circus/circus-ringmaster-bear-dot-to-dot-puzzle/
            - generic [ref=e397]: New
          - listitem [ref=e398]:
            - generic [ref=e399]: "2"
            - link "Circus Tent" [ref=e400] [cursor=pointer]:
              - /url: /en/circus/circus-tent-dot-to-dot-puzzle/
            - generic [ref=e401]: New
          - listitem [ref=e402]:
            - generic [ref=e403]: "3"
            - link "Space Rover" [ref=e404] [cursor=pointer]:
              - /url: /en/space/space-rover-dot-to-dot-puzzle/
            - generic [ref=e405]: New
          - listitem [ref=e406]:
            - generic [ref=e407]: "4"
            - link "Ringed Planet" [ref=e408] [cursor=pointer]:
              - /url: /en/space/ringed-planet-dot-to-dot-puzzle/
            - generic [ref=e409]: New
  - generic "Share me" [ref=e410]:
    - generic [ref=e411]:
      - link "Share — WhatsApp" [ref=e412] [cursor=pointer]:
        - /url: https://wa.me/?text=Mermaid%20Dot%20to%20Dot%20%E2%80%94%20Magical%2054-Dot%20Free%20Printable%20%7C%20DotToDotFreePrintables.com%20https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Focean%2Fmermaid-dot-to-dot-puzzle%2F
      - link "Share — Facebook" [ref=e415] [cursor=pointer]:
        - /url: https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Focean%2Fmermaid-dot-to-dot-puzzle%2F
      - link "Share — Pinterest" [ref=e418] [cursor=pointer]:
        - /url: https://pinterest.com/pin/create/button/?url=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Focean%2Fmermaid-dot-to-dot-puzzle%2F&description=Mermaid%20Dot%20to%20Dot%20%E2%80%94%20Magical%2054-Dot%20Free%20Printable%20%7C%20DotToDotFreePrintables.com
      - link "Share — X" [ref=e421] [cursor=pointer]:
        - /url: https://twitter.com/intent/tweet?url=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Focean%2Fmermaid-dot-to-dot-puzzle%2F&text=Mermaid%20Dot%20to%20Dot%20%E2%80%94%20Magical%2054-Dot%20Free%20Printable%20%7C%20DotToDotFreePrintables.com
      - button "Copy link" [ref=e424] [cursor=pointer]
  - contentinfo [ref=e428]:
    - generic [ref=e429]: DotToDotFreePrintables.com
    - paragraph [ref=e435]: Free dot to dot printables and connect-the-dots worksheets for kids, parents, and teachers in the US, UK, Canada, and Australia. All puzzles are free to download, print, and share.
    - navigation "Free dot to dot printables and connect-the-dots worksheets for kids, parents, and teachers in the US, UK, Canada, and Australia. All puzzles are free to download, print, and share." [ref=e436]:
      - link "Blog" [ref=e437] [cursor=pointer]:
        - /url: /en/blog/
      - link "FAQ" [ref=e438] [cursor=pointer]:
        - /url: /en/#faq
      - link "Feedback" [ref=e439] [cursor=pointer]:
        - /url: /en/#feedback
      - link "About" [ref=e440] [cursor=pointer]:
        - /url: /en/about/
      - link "Contact" [ref=e441] [cursor=pointer]:
        - /url: /en/contact/
      - link "Privacy" [ref=e442] [cursor=pointer]:
        - /url: /en/privacy-policy/
      - link "Terms" [ref=e443] [cursor=pointer]:
        - /url: /en/terms/
      - link "Dot to Dot Puzzle Pack" [ref=e444] [cursor=pointer]:
        - /url: /en/premium/
      - link "Sitemap" [ref=e445] [cursor=pointer]:
        - /url: /sitemap.xml
    - generic "Free dot to dot printables and connect-the-dots worksheets for kids, parents, and teachers in the US, UK, Canada, and Australia. All puzzles are free to download, print, and share." [ref=e446]:
      - link "YouTube" [ref=e447] [cursor=pointer]:
        - /url: https://www.youtube.com/@dottodotfreeprintables_com
      - link "Pinterest" [ref=e451] [cursor=pointer]:
        - /url: https://www.pinterest.com/hellokidsbookworld/
    - paragraph [ref=e454]: © 2026 DotToDotFreePrintables.com · Free printable activities for children - v1.0.0
  - alert [ref=e455]
```

# Test source

```ts
  1  | import { expect, test } from '@playwright/test';
  2  | 
  3  | const locales = ['en', 'ar'] as const;
  4  | const slug = 'mermaid-dot-to-dot-puzzle';
  5  | 
  6  | for (const locale of locales) {
  7  |   test.describe(`${locale} Mermaid puzzle functionality`, () => {
  8  |     const puzzleUrl = `/${locale}/ocean/${slug}/`;
  9  | 
  10 |     test.beforeEach(async ({ page }) => {
  11 |       await page.goto(puzzleUrl, { waitUntil: 'domcontentloaded' });
  12 |     });
  13 | 
  14 |     test('renders the printable, puzzle details, and localized direction', async ({ page }) => {
  15 |       await expect(page.locator('html')).toHaveAttribute('lang', locale);
  16 |       await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
  17 |       await expect(page.getByRole('heading', { level: 1 })).toContainText(/mermaid|حورية/i);
  18 |       await expect(page.locator('.puzzle-preview-card img')).toHaveAttribute('src', /mermaid-puzzle/);
  19 |       await expect(page.locator('.meta-chips')).toContainText(/54/);
  20 |       await expect(page.locator('.fun-fact-box')).toBeVisible();
  21 |     });
  22 | 
  23 |     test('opens the printable PDF from the primary download button', async ({ page, request, baseURL }) => {
  24 |       const download = page.locator('a.download-btn').first();
  25 |       const expectedHref = locale === 'ar'
  26 |         ? '/ocean/mermaid-dot-to-dot-printable-horizontal_A4.pdf'
  27 |         : '/ocean/mermaid-dot-to-dot-printable-horizontal.pdf';
  28 |       await expect(download).toHaveAttribute('href', expectedHref);
  29 |       const href = await download.getAttribute('href');
  30 |       const response = await request.get(new URL(href!, baseURL ?? 'http://127.0.0.1:4444').toString());
  31 |       expect(response.status()).toBe(200);
  32 |       expect(response.headers()['content-type']).toContain('application/pdf');
  33 | 
  34 |       // The link carries both target="_blank" and a `download` attribute;
  35 |       // Chromium honors `download` and saves the file directly rather than
  36 |       // opening a new tab, so the click surfaces as a `download` event, not
  37 |       // a new page.
  38 |       const downloadPromise = page.waitForEvent('download');
  39 |       await download.click();
  40 |       const pdfDownload = await downloadPromise;
  41 |       expect(pdfDownload.url()).toContain(expectedHref);
  42 |     });
  43 | 
  44 |     test('offers responsive sharing controls', async ({ page }) => {
  45 |       if ((page.viewportSize()?.width ?? 1280) <= 980) {
  46 |         await expect(page.locator('.mobile-share-toggle .desktop-social-link--share')).toBeVisible();
  47 |       } else {
  48 |         await expect(page.locator('.floating-share .floating-share-link').first()).toBeVisible();
  49 |         await expect(page.locator('.floating-share button.floating-share-link')).toBeVisible();
  50 |       }
  51 |     });
  52 | 
  53 |     test('breadcrumb navigates back to the Ocean collection', async ({ page }) => {
  54 |       await page.locator('nav.breadcrumb').getByRole('link').nth(1).click();
  55 |       await expect(page).toHaveURL(new RegExp(`/${locale}/ocean/$`));
  56 |       await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  57 |     });
  58 | 
  59 |     test('a related puzzle card opens another ocean puzzle', async ({ page }) => {
  60 |       const related = page.locator('section').filter({ has: page.locator('.puzzle-grid') }).first();
  61 |       const firstRelated = related.locator('article.puzzle-card').first();
  62 |       const href = await firstRelated.locator('a.puzzle-image').getAttribute('href');
  63 |       expect(href).toMatch(new RegExp(`^/${locale}/ocean/(?!${slug})`));
  64 |       await firstRelated.locator('a.puzzle-image').click();
  65 |       await expect(page).toHaveURL(new RegExp(`/${locale}/ocean/(?!${slug})[^/]+/$`));
  66 |     });
  67 | 
  68 |     test('FAQ expands when its question is clicked', async ({ page }) => {
  69 |       const faq = page.locator('details').first();
  70 |       await faq.locator('summary').click();
  71 |       await expect(faq).toHaveAttribute('open', '');
  72 |       await expect(faq.locator('p')).toBeVisible();
  73 |     });
  74 | 
  75 |     test('publishes canonical, social, breadcrumb, and puzzle schema', async ({ page }) => {
  76 |       await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
  77 |         'href', `https://dottodotfreeprintables.com${puzzleUrl}`
  78 |       );
  79 |       await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /mermaid-puzzle/);
  80 |       const schemas = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) =>
  81 |         scripts.map((script) => JSON.parse(script.textContent || '{}'))
  82 |       );
  83 |       expect(schemas.some((schema) => schema['@type'] === 'BreadcrumbList')).toBe(true);
  84 |       expect(schemas.some((schema) => {
  85 |         const types = Array.isArray(schema['@type']) ? schema['@type'] : [schema['@type']];
  86 |         return types.includes('CreativeWork') && /mermaid|حورية/i.test(schema.name);
> 87 |       })).toBe(true);
     |           ^ Error: expect(received).toBe(expected) // Object.is equality
  88 |     });
  89 | 
  90 |     test('has no horizontal overflow at the active device size', async ({ page }) => {
  91 |       const dimensions = await page.evaluate(() => ({
  92 |         pageWidth: document.documentElement.scrollWidth,
  93 |         viewportWidth: document.documentElement.clientWidth
  94 |       }));
  95 |       expect(dimensions.pageWidth).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
  96 |     });
  97 |   });
  98 | }
  99 | 
```