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
      - generic [ref=e135]: Dinosaurs
    - generic [ref=e136]:
      - paragraph [ref=e137]: 11 free printable puzzles
      - heading "Dinosaur Dot-to-Dot Printables for Kids" [level=1] [ref=e138]
      - paragraph [ref=e139]: Connect prehistoric giants from the first dot to the final reveal.
    - generic [ref=e142]:
      - article [ref=e143]:
        - link "Mighty Tyrannosaurus Rex stomping out of 61 numbered dots, free dinosaur sheet New" [ref=e144] [cursor=pointer]:
          - /url: /en/dinosaurs/trex-61-dot-to-dot-puzzle/
          - img "Mighty Tyrannosaurus Rex stomping out of 61 numbered dots, free dinosaur sheet" [ref=e145]
          - generic [ref=e146]: New
        - generic [ref=e147]:
          - paragraph [ref=e148]: Dinosaurs
          - heading "T-Rex 61-Dot Challenge" [level=2] [ref=e149]
          - paragraph [ref=e150]: A Bigger Tyrant Lizard Challenge
          - generic [ref=e151]:
            - generic [ref=e152]: Ages 6-9
            - generic [ref=e153]: 1–61 dots
          - img "Difficulty 2 out of 3" [ref=e154]
          - link "View & Download - T-Rex 61-Dot Challenge" [ref=e158] [cursor=pointer]:
            - /url: /en/dinosaurs/trex-61-dot-to-dot-puzzle/
            - text: View & Download
      - article [ref=e162]:
        - link "Sprinting ostrich, neck outstretched, caught in 55 printable dots New" [ref=e163] [cursor=pointer]:
          - /url: /en/dinosaurs/ostriches-dinosaur-dot-to-dot-puzzle/
          - img "Sprinting ostrich, neck outstretched, caught in 55 printable dots" [ref=e164]
          - generic [ref=e165]: New
        - generic [ref=e166]:
          - paragraph [ref=e167]: Dinosaurs
          - heading "Ostrich" [level=2] [ref=e168]
          - paragraph [ref=e169]: The World's Biggest Bird
          - generic [ref=e170]:
            - generic [ref=e171]: Ages 5-8
            - generic [ref=e172]: 1–55 dots
          - img "Difficulty 1 out of 3" [ref=e173]
          - link "View & Download - Ostrich" [ref=e177] [cursor=pointer]:
            - /url: /en/dinosaurs/ostriches-dinosaur-dot-to-dot-puzzle/
            - text: View & Download
      - article [ref=e181]:
        - link "Long-necked Brontosaurus stretching across 50 dots on a preschool printable New" [ref=e182] [cursor=pointer]:
          - /url: /en/dinosaurs/brontosaurus-dot-to-dot-puzzle/
          - img "Long-necked Brontosaurus stretching across 50 dots on a preschool printable" [ref=e183]
          - generic [ref=e184]: New
        - generic [ref=e185]:
          - paragraph [ref=e186]: Dinosaurs
          - heading "Brontosaurus" [level=2] [ref=e187]
          - paragraph [ref=e188]: The Friendly Thunder Lizard
          - generic [ref=e189]:
            - generic [ref=e190]: Ages 4-7
            - generic [ref=e191]: 1–50 dots
          - img "Difficulty 1 out of 3" [ref=e192]
          - link "View & Download - Brontosaurus" [ref=e196] [cursor=pointer]:
            - /url: /en/dinosaurs/brontosaurus-dot-to-dot-puzzle/
            - text: View & Download
      - article [ref=e200]:
        - link "Three-horned Triceratops and its bony frill emerging from 70 printable dots New" [ref=e201] [cursor=pointer]:
          - /url: /en/dinosaurs/triceratops-dot-to-dot-puzzle/
          - img "Three-horned Triceratops and its bony frill emerging from 70 printable dots" [ref=e202]
          - generic [ref=e203]: New
        - generic [ref=e204]:
          - paragraph [ref=e205]: Dinosaurs
          - heading "Triceratops" [level=2] [ref=e206]
          - paragraph [ref=e207]: Three Horns, One Amazing Puzzle
          - generic [ref=e208]:
            - generic [ref=e209]: Ages 6-9
            - generic [ref=e210]: 1–70 dots
          - img "Difficulty 2 out of 3" [ref=e211]
          - link "View & Download - Triceratops" [ref=e215] [cursor=pointer]:
            - /url: /en/dinosaurs/triceratops-dot-to-dot-puzzle/
            - text: View & Download
      - article [ref=e219]:
        - link "Feathered Velociraptor poised to sprint, sketched in 54 printable dots New" [ref=e220] [cursor=pointer]:
          - /url: /en/dinosaurs/velociraptor-dot-to-dot-puzzle/
          - img "Feathered Velociraptor poised to sprint, sketched in 54 printable dots" [ref=e221]
          - generic [ref=e222]: New
        - generic [ref=e223]:
          - paragraph [ref=e224]: Dinosaurs
          - heading "Velociraptor" [level=2] [ref=e225]
          - paragraph [ref=e226]: Fast, Smart, and Ready to Pounce
          - generic [ref=e227]:
            - generic [ref=e228]: Ages 6-9
            - generic [ref=e229]: 1–54 dots
          - img "Difficulty 2 out of 3" [ref=e230]
          - link "View & Download - Velociraptor" [ref=e234] [cursor=pointer]:
            - /url: /en/dinosaurs/velociraptor-dot-to-dot-puzzle/
            - text: View & Download
      - article [ref=e238]:
        - link "Stegosaurus with its double row of back plates built from 52 printable dots New" [ref=e239] [cursor=pointer]:
          - /url: /en/dinosaurs/stegosaurus-dot-to-dot-puzzle/
          - img "Stegosaurus with its double row of back plates built from 52 printable dots" [ref=e240]
          - generic [ref=e241]: New
        - generic [ref=e242]:
          - paragraph [ref=e243]: Dinosaurs
          - heading "Stegosaurus" [level=2] [ref=e244]
          - paragraph [ref=e245]: Spiky Plates, Big Fun
          - generic [ref=e246]:
            - generic [ref=e247]: Ages 4-7
            - generic [ref=e248]: 1–52 dots
          - img "Difficulty 1 out of 3" [ref=e249]
          - link "View & Download - Stegosaurus" [ref=e253] [cursor=pointer]:
            - /url: /en/dinosaurs/stegosaurus-dot-to-dot-puzzle/
            - text: View & Download
      - article [ref=e257]:
        - link "Sail-backed Spinosaurus surfacing through 74 dots on a free dinosaur printable New" [ref=e258] [cursor=pointer]:
          - /url: /en/dinosaurs/spinosaurus/
          - img "Sail-backed Spinosaurus surfacing through 74 dots on a free dinosaur printable" [ref=e259]
          - generic [ref=e260]: New
        - generic [ref=e261]:
          - paragraph [ref=e262]: Dinosaurs
          - heading "Spinosaurus" [level=2] [ref=e263]
          - paragraph [ref=e264]: Bigger Than T-Rex
          - generic [ref=e265]:
            - generic [ref=e266]: Ages 6-10
            - generic [ref=e267]: 1–74 dots
          - img "Difficulty 2 out of 3" [ref=e268]
          - link "View & Download - Spinosaurus" [ref=e272] [cursor=pointer]:
            - /url: /en/dinosaurs/spinosaurus/
            - text: View & Download
      - article [ref=e276]:
        - link [ref=e277] [cursor=pointer]:
          - /url: /en/dinosaurs/brachiosaurus/
          - img "Towering Brachiosaurus reaching treetop height in 38 printable dots" [ref=e278]
        - generic [ref=e279]:
          - paragraph [ref=e280]: Dinosaurs
          - heading "Brachiosaurus" [level=2] [ref=e281]
          - paragraph [ref=e282]: The Gentle Giant of the Jurassic
          - generic [ref=e283]:
            - generic [ref=e284]: Ages 5-9
            - generic [ref=e285]: 1–38 dots
          - img "Difficulty 2 out of 3" [ref=e286]
          - link "View & Download - Brachiosaurus" [ref=e290] [cursor=pointer]:
            - /url: /en/dinosaurs/brachiosaurus/
            - text: View & Download
      - article [ref=e294]:
        - link [ref=e295] [cursor=pointer]:
          - /url: /en/dinosaurs/ankylosaurus/
          - img "Armoured Ankylosaurus and its tail club plated together from 32 dots" [ref=e296]
        - generic [ref=e297]:
          - paragraph [ref=e298]: Dinosaurs
          - heading "Ankylosaurus" [level=2] [ref=e299]
          - paragraph [ref=e300]: The Armoured Tank of the Dino World
          - generic [ref=e301]:
            - generic [ref=e302]: Ages 5-8
            - generic [ref=e303]: 1–32 dots
          - img "Difficulty 2 out of 3" [ref=e304]
          - link "View & Download - Ankylosaurus" [ref=e308] [cursor=pointer]:
            - /url: /en/dinosaurs/ankylosaurus/
            - text: View & Download
      - article [ref=e312]:
        - link "Pterodactyl soaring on wide wings, held aloft by 67 printable dots New" [ref=e313] [cursor=pointer]:
          - /url: /en/dinosaurs/pterodactyl-dot-to-dot-puzzle/
          - img "Pterodactyl soaring on wide wings, held aloft by 67 printable dots" [ref=e314]
          - generic [ref=e315]: New
        - generic [ref=e316]:
          - paragraph [ref=e317]: Dinosaurs
          - heading "Pterodactyl" [level=2] [ref=e318]
          - paragraph [ref=e319]: The Flying Dinosaur Kids Love
          - generic [ref=e320]:
            - generic [ref=e321]: Ages 6-9
            - generic [ref=e322]: 1–67 dots
          - img "Difficulty 2 out of 3" [ref=e323]
          - link "View & Download - Pterodactyl" [ref=e327] [cursor=pointer]:
            - /url: /en/dinosaurs/pterodactyl-dot-to-dot-puzzle/
            - text: View & Download
      - article [ref=e331]:
        - link [ref=e332] [cursor=pointer]:
          - /url: /en/dinosaurs/allosaurus/
          - img "Fierce Allosaurus baring strong jaws, assembled from 42 printable dots" [ref=e333]
        - generic [ref=e334]:
          - paragraph [ref=e335]: Dinosaurs
          - heading "Allosaurus" [level=2] [ref=e336]
          - paragraph [ref=e337]: The Lion of the Jurassic
          - generic [ref=e338]:
            - generic [ref=e339]: Ages 6-10
            - generic [ref=e340]: 1–42 dots
          - img "Difficulty 3 out of 3" [ref=e341]
          - link "View & Download - Allosaurus" [ref=e345] [cursor=pointer]:
            - /url: /en/dinosaurs/allosaurus/
            - text: View & Download
    - generic [ref=e349]:
      - heading "Roar Through Number Practice" [level=2] [ref=e350]
      - paragraph [ref=e351]: Dinosaur puzzles build number confidence, concentration, and pencil control.
      - link "← Back to all categories" [ref=e352] [cursor=pointer]:
        - /url: /en/
    - region "Frequently asked questions" [ref=e353]:
      - generic [ref=e354]:
        - paragraph [ref=e355]: Common questions
        - heading "Frequently asked questions" [level=2] [ref=e356]
      - generic [ref=e357]:
        - group [ref=e358]:
          - generic "How many free dinosaurs dot to dot printables are there?" [ref=e359] [cursor=pointer]
        - group [ref=e362]:
          - generic "Are the dinosaurs dot to dot puzzles free to print?" [ref=e363] [cursor=pointer]
        - group [ref=e366]:
          - generic "What ages are the dinosaurs puzzles for?" [ref=e367] [cursor=pointer]
        - group [ref=e370]:
          - generic "Which dinosaur dot to dot puzzles are available?" [ref=e371] [cursor=pointer]
        - group [ref=e374]:
          - generic "What is the easiest dinosaur dot to dot for young kids?" [ref=e375] [cursor=pointer]
        - group [ref=e378]:
          - generic "Do dinosaur dot to dot puzzles teach real dinosaur facts?" [ref=e379] [cursor=pointer]
  - region [ref=e382]:
    - generic [ref=e383]:
      - generic [ref=e384]:
        - generic [ref=e389]:
          - paragraph [ref=e390]: Popular this week
          - heading "Most downloaded puzzles" [level=2] [ref=e391]
        - list [ref=e392]:
          - listitem [ref=e393]:
            - generic [ref=e394]: "1"
            - link "T-Rex 61-Dot Challenge" [ref=e395] [cursor=pointer]:
              - /url: /en/dinosaurs/trex-61-dot-to-dot-puzzle/
            - generic "23 or more downloads" [ref=e396]: 23+
          - listitem [ref=e400]:
            - generic [ref=e401]: "2"
            - link "Mermaid" [ref=e402] [cursor=pointer]:
              - /url: /en/ocean/mermaid-dot-to-dot-puzzle/
            - generic "20 or more downloads" [ref=e403]: 20+
          - listitem [ref=e407]:
            - generic [ref=e408]: "3"
            - link "Jellyfish" [ref=e409] [cursor=pointer]:
              - /url: /en/ocean/jellyfish-dot-to-dot-puzzle/
            - generic "10 or more downloads" [ref=e410]: 10+
          - listitem [ref=e414]:
            - generic [ref=e415]: "4"
            - link "Cute Puppy" [ref=e416] [cursor=pointer]:
              - /url: /en/cute/cute-puppy-dot-to-dot-puzzle/
            - generic "9 or more downloads" [ref=e417]: 9+
          - listitem [ref=e421]:
            - generic [ref=e422]: "5"
            - link "Spring Horse" [ref=e423] [cursor=pointer]:
              - /url: /en/playgrounds/spring-horse-playground-dot-to-dot-puzzle/
            - generic "7 or more downloads" [ref=e424]: 7+
          - listitem [ref=e428]:
            - generic [ref=e429]: "6"
            - link "Spinosaurus" [ref=e430] [cursor=pointer]:
              - /url: /en/dinosaurs/spinosaurus/
            - generic "7 or more downloads" [ref=e431]: 7+
          - listitem [ref=e435]:
            - generic [ref=e436]: "7"
            - link "Snowdrop Flower" [ref=e437] [cursor=pointer]:
              - /url: /en/flowers/snowdrop-flower-dot-to-dot-puzzle/
            - generic "7 or more downloads" [ref=e438]: 7+
          - listitem [ref=e442]:
            - generic [ref=e443]: "8"
            - link "Slide Playground" [ref=e444] [cursor=pointer]:
              - /url: /en/playgrounds/slide-playgrounds-dot-to-dot-puzzle/
            - generic "6 or more downloads" [ref=e445]: 6+
      - generic [ref=e449]:
        - generic [ref=e454]:
          - paragraph [ref=e455]: Fresh printables
          - heading "Recently added" [level=3] [ref=e456]
        - list [ref=e457]:
          - listitem [ref=e458]:
            - generic [ref=e459]: "1"
            - link "Circus Ringmaster Bear" [ref=e460] [cursor=pointer]:
              - /url: /en/circus/circus-ringmaster-bear-dot-to-dot-puzzle/
            - generic [ref=e461]: New
          - listitem [ref=e462]:
            - generic [ref=e463]: "2"
            - link "Circus Tent" [ref=e464] [cursor=pointer]:
              - /url: /en/circus/circus-tent-dot-to-dot-puzzle/
            - generic [ref=e465]: New
          - listitem [ref=e466]:
            - generic [ref=e467]: "3"
            - link "Space Rover" [ref=e468] [cursor=pointer]:
              - /url: /en/space/space-rover-dot-to-dot-puzzle/
            - generic [ref=e469]: New
          - listitem [ref=e470]:
            - generic [ref=e471]: "4"
            - link "Ringed Planet" [ref=e472] [cursor=pointer]:
              - /url: /en/space/ringed-planet-dot-to-dot-puzzle/
            - generic [ref=e473]: New
  - generic "Share me" [ref=e474]:
    - generic [ref=e475]:
      - link "Share — WhatsApp" [ref=e476] [cursor=pointer]:
        - /url: https://wa.me/?text=Dinosaur%20Dot-to-Dot%20Printables%20for%20Kids%20%E2%80%94%20Free%20PDF%20Worksheets%20%7C%20DotToDotFreePrintables.com%20https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2F
      - link "Share — Facebook" [ref=e479] [cursor=pointer]:
        - /url: https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2F
      - link "Share — Pinterest" [ref=e482] [cursor=pointer]:
        - /url: https://pinterest.com/pin/create/button/?url=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2F&description=Dinosaur%20Dot-to-Dot%20Printables%20for%20Kids%20%E2%80%94%20Free%20PDF%20Worksheets%20%7C%20DotToDotFreePrintables.com
      - link "Share — X" [ref=e485] [cursor=pointer]:
        - /url: https://twitter.com/intent/tweet?url=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2F&text=Dinosaur%20Dot-to-Dot%20Printables%20for%20Kids%20%E2%80%94%20Free%20PDF%20Worksheets%20%7C%20DotToDotFreePrintables.com
      - button "Copy link" [ref=e488] [cursor=pointer]
  - contentinfo [ref=e492]:
    - generic [ref=e493]: DotToDotFreePrintables.com
    - paragraph [ref=e499]: Free dot to dot printables and connect-the-dots worksheets for kids, parents, and teachers in the US, UK, Canada, and Australia. All puzzles are free to download, print, and share.
    - navigation "Free dot to dot printables and connect-the-dots worksheets for kids, parents, and teachers in the US, UK, Canada, and Australia. All puzzles are free to download, print, and share." [ref=e500]:
      - link "Blog" [ref=e501] [cursor=pointer]:
        - /url: /en/blog/
      - link "FAQ" [ref=e502] [cursor=pointer]:
        - /url: /en/#faq
      - link "Feedback" [ref=e503] [cursor=pointer]:
        - /url: /en/#feedback
      - link "About" [ref=e504] [cursor=pointer]:
        - /url: /en/about/
      - link "Contact" [ref=e505] [cursor=pointer]:
        - /url: /en/contact/
      - link "Privacy" [ref=e506] [cursor=pointer]:
        - /url: /en/privacy-policy/
      - link "Terms" [ref=e507] [cursor=pointer]:
        - /url: /en/terms/
      - link "Dot to Dot Puzzle Pack" [ref=e508] [cursor=pointer]:
        - /url: /en/premium/
      - link "Sitemap" [ref=e509] [cursor=pointer]:
        - /url: /sitemap.xml
    - generic "Free dot to dot printables and connect-the-dots worksheets for kids, parents, and teachers in the US, UK, Canada, and Australia. All puzzles are free to download, print, and share." [ref=e510]:
      - link "YouTube" [ref=e511] [cursor=pointer]:
        - /url: https://www.youtube.com/@dottodotfreeprintables_com
      - link "Pinterest" [ref=e515] [cursor=pointer]:
        - /url: https://www.pinterest.com/hellokidsbookworld/
    - paragraph [ref=e518]: © 2026 DotToDotFreePrintables.com · Free printable activities for children - v1.0.0
  - alert [ref=e519]
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