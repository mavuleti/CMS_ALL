# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: search-index.spec.ts >> es homepage loads its search index lazily and keeps locale links correct
- Location: tests\search-index.spec.ts:19:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 1
Received: 0

Call Log:
- Timeout 5000ms exceeded while waiting on the predicate
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - alert [ref=e2]: Free Dot-to-Dot Printables for Kids
  - link "Skip to content" [ref=e3] [cursor=pointer]:
    - /url: "#main-content"
  - banner [ref=e4]:
    - navigation "categories.heading" [ref=e5]:
      - link "DotToDotFreePrintables — Home" [ref=e6] [cursor=pointer]:
        - /url: /en/
        - text: DotToDotFreePrintables
      - navigation "Browse categories" [ref=e11]:
        - link "Home" [ref=e12] [cursor=pointer]:
          - /url: /en/
        - link "Flowers" [ref=e18] [cursor=pointer]:
          - /url: /en/flowers/
          - generic [ref=e19]: New
        - link "Cute" [ref=e27] [cursor=pointer]:
          - /url: /en/cute/
          - generic [ref=e28]:
            - generic [ref=e29]: 🐶
            - generic [ref=e30]: New
        - link "Playgrounds" [ref=e32] [cursor=pointer]:
          - /url: /en/playgrounds/
          - generic [ref=e33]: 🛝
        - link "Dinosaurs" [ref=e36] [cursor=pointer]:
          - /url: /en/dinosaurs/
          - generic [ref=e37]: 🦖
        - link "Ocean" [ref=e40] [cursor=pointer]:
          - /url: /en/ocean/
        - link "Circus" [ref=e47] [cursor=pointer]:
          - /url: /en/circus/
          - generic [ref=e48]:
            - generic [ref=e49]: 🤡
            - generic [ref=e50]: New
        - link "More" [ref=e52] [cursor=pointer]:
          - /url: /en/#categories
    - img [ref=e61]:
      - generic [ref=e62]: "1"
      - generic [ref=e64]: "2"
      - generic [ref=e66]: "3"
      - generic [ref=e68]: "4"
      - generic [ref=e70]: "5"
      - generic [ref=e72]: "6"
      - generic [ref=e74]: "7"
      - generic [ref=e76]: "8"
      - generic [ref=e78]: "9"
      - generic [ref=e80]: "10"
      - generic [ref=e82]: "11"
      - generic [ref=e84]: "12"
      - generic [ref=e86]: "13"
      - generic [ref=e88]: "14"
      - generic [ref=e90]: "15"
      - generic [ref=e92]: "16"
      - generic [ref=e94]: "17"
      - generic [ref=e96]: "18"
      - generic [ref=e98]: "19"
      - generic [ref=e100]: "20"
      - generic [ref=e102]: "21"
      - generic [ref=e104]: "22"
      - generic [ref=e106]: "23"
      - generic [ref=e108]: "24"
      - generic [ref=e110]: "25"
      - generic [ref=e112]: "26"
      - generic [ref=e114]: "27"
      - generic [ref=e116]: "28"
      - generic [ref=e118]: "29"
      - generic [ref=e120]: "30"
  - main [ref=e122]:
    - generic [ref=e123]:
      - region [ref=e124]:
        - heading "Free Dot-to-Dot Printables for Kids" [level=1] [ref=e125]
        - paragraph [ref=e126]: Choose a printable puzzle and start connecting the dots.
        - search [ref=e127]:
          - textbox "Search puzzles" [active] [ref=e131]
          - button "Search" [ref=e132] [cursor=pointer]
        - generic "Filter puzzles" [ref=e136]:
          - button "Easy 1–20 Dots" [ref=e137] [cursor=pointer]:
            - generic [ref=e140]:
              - strong [ref=e141]: Easy
              - generic [ref=e142]: 1–20 Dots
          - button "Medium 21–60 Dots" [ref=e143] [cursor=pointer]:
            - generic [ref=e146]:
              - strong [ref=e147]: Medium
              - generic [ref=e148]: 21–60 Dots
          - button "Hard 61+ Dots" [ref=e149] [cursor=pointer]:
            - generic [ref=e152]:
              - strong [ref=e153]: Hard
              - generic [ref=e154]: 61+ Dots
          - button "Age 4–6" [ref=e156] [cursor=pointer]:
            - generic [ref=e160]:
              - strong [ref=e161]: Age
              - generic [ref=e162]: 4–6
          - button "Age 7–9" [ref=e163] [cursor=pointer]:
            - generic [ref=e167]:
              - strong [ref=e168]: Age
              - generic [ref=e169]: 7–9
          - button "Age 9–12" [ref=e170] [cursor=pointer]:
            - generic [ref=e174]:
              - strong [ref=e175]: Age
              - generic [ref=e176]: 9–12
      - generic [ref=e177]: 8 results found
      - region "Featured puzzles" [ref=e183]:
        - article [ref=e184]:
          - button "Save puzzle T-Rex 61-Dot Challenge" [ref=e185] [cursor=pointer]
          - link [ref=e188] [cursor=pointer]:
            - /url: /en/dinosaurs/trex-61-dot-to-dot-puzzle/
            - img "T-Rex 61-Dot Challenge dot-to-dot printable" [ref=e189]
          - heading [level=2] [ref=e190]:
            - link "T-Rex 61-Dot Challenge" [ref=e191] [cursor=pointer]:
              - /url: /en/dinosaurs/trex-61-dot-to-dot-puzzle/
          - generic [ref=e192]:
            - generic [ref=e193]: Medium · 61 dots
            - generic [ref=e195]: 1.9k downloads
          - link "Download free" [ref=e199] [cursor=pointer]:
            - /url: /en/dinosaurs/trex-61-dot-to-dot-puzzle/
        - article [ref=e200]:
          - button "Save puzzle Mermaid" [ref=e201] [cursor=pointer]
          - link [ref=e204] [cursor=pointer]:
            - /url: /en/ocean/mermaid-dot-to-dot-puzzle/
            - img "Mermaid dot-to-dot printable" [ref=e205]
          - heading [level=2] [ref=e206]:
            - link "Mermaid" [ref=e207] [cursor=pointer]:
              - /url: /en/ocean/mermaid-dot-to-dot-puzzle/
          - generic [ref=e208]:
            - generic [ref=e209]: Easy · 54 dots
            - generic [ref=e211]: 2.2k downloads
          - link "Download free" [ref=e215] [cursor=pointer]:
            - /url: /en/ocean/mermaid-dot-to-dot-puzzle/
        - article [ref=e216]:
          - button "Save puzzle Jellyfish" [ref=e217] [cursor=pointer]
          - link [ref=e220] [cursor=pointer]:
            - /url: /en/ocean/jellyfish-dot-to-dot-puzzle/
            - img "Jellyfish dot-to-dot printable" [ref=e221]
          - heading [level=2] [ref=e222]:
            - link "Jellyfish" [ref=e223] [cursor=pointer]:
              - /url: /en/ocean/jellyfish-dot-to-dot-puzzle/
          - generic [ref=e224]:
            - generic [ref=e225]: Medium · 88 dots
            - generic [ref=e227]: 2.5k downloads
          - link "Download free" [ref=e231] [cursor=pointer]:
            - /url: /en/ocean/jellyfish-dot-to-dot-puzzle/
        - article [ref=e232]:
          - button "Save puzzle Cute Puppy" [ref=e233] [cursor=pointer]
          - link [ref=e236] [cursor=pointer]:
            - /url: /en/cute/cute-puppy-dot-to-dot-puzzle/
            - img "Cute Puppy dot-to-dot printable" [ref=e237]
          - heading [level=2] [ref=e238]:
            - link "Cute Puppy" [ref=e239] [cursor=pointer]:
              - /url: /en/cute/cute-puppy-dot-to-dot-puzzle/
          - generic [ref=e240]:
            - generic [ref=e241]: Medium · 70 dots
            - generic [ref=e243]: 2.8k downloads
          - link "Download free" [ref=e247] [cursor=pointer]:
            - /url: /en/cute/cute-puppy-dot-to-dot-puzzle/
        - article [ref=e248]:
          - button "Save puzzle Slide Playground" [ref=e249] [cursor=pointer]
          - link [ref=e252] [cursor=pointer]:
            - /url: /en/playgrounds/slide-playgrounds-dot-to-dot-puzzle/
            - img "Slide Playground dot-to-dot printable" [ref=e253]
          - heading [level=2] [ref=e254]:
            - link "Slide Playground" [ref=e255] [cursor=pointer]:
              - /url: /en/playgrounds/slide-playgrounds-dot-to-dot-puzzle/
          - generic [ref=e256]:
            - generic [ref=e257]: Medium · 102 dots
            - generic [ref=e259]: 3.1k downloads
          - link "Download free" [ref=e263] [cursor=pointer]:
            - /url: /en/playgrounds/slide-playgrounds-dot-to-dot-puzzle/
        - article [ref=e264]:
          - button "Save puzzle Snowdrop Flower" [ref=e265] [cursor=pointer]
          - link [ref=e268] [cursor=pointer]:
            - /url: /en/flowers/snowdrop-flower-dot-to-dot-puzzle/
            - img "Snowdrop Flower dot-to-dot printable" [ref=e269]
          - heading [level=2] [ref=e270]:
            - link "Snowdrop Flower" [ref=e271] [cursor=pointer]:
              - /url: /en/flowers/snowdrop-flower-dot-to-dot-puzzle/
          - generic [ref=e272]:
            - generic [ref=e273]: Hard · 145 dots
            - generic [ref=e275]: 1.9k downloads
          - link "Download free" [ref=e279] [cursor=pointer]:
            - /url: /en/flowers/snowdrop-flower-dot-to-dot-puzzle/
        - article [ref=e280]:
          - button "Save puzzle Dashing Car Playground" [ref=e281] [cursor=pointer]
          - link [ref=e284] [cursor=pointer]:
            - /url: /en/playgrounds/dashing-car-playground-dot-to-dot-puzzle/
            - img "Dashing Car Playground dot-to-dot printable" [ref=e285]
          - heading [level=2] [ref=e286]:
            - link "Dashing Car Playground" [ref=e287] [cursor=pointer]:
              - /url: /en/playgrounds/dashing-car-playground-dot-to-dot-puzzle/
          - generic [ref=e288]:
            - generic [ref=e289]: Easy · 0 dots
            - generic [ref=e291]: 2.2k downloads
          - link "Download free" [ref=e295] [cursor=pointer]:
            - /url: /en/playgrounds/dashing-car-playground-dot-to-dot-puzzle/
        - article [ref=e296]:
          - button "Save puzzle Lotus Flower" [ref=e297] [cursor=pointer]
          - link [ref=e300] [cursor=pointer]:
            - /url: /en/flowers/lotus-flower-dot-to-dot-puzzle/
            - img "Lotus Flower dot-to-dot printable" [ref=e301]
          - heading [level=2] [ref=e302]:
            - link "Lotus Flower" [ref=e303] [cursor=pointer]:
              - /url: /en/flowers/lotus-flower-dot-to-dot-puzzle/
          - generic [ref=e304]:
            - generic [ref=e305]: Easy · 46 dots
            - generic [ref=e307]: 2.5k downloads
          - link "Download free" [ref=e311] [cursor=pointer]:
            - /url: /en/flowers/lotus-flower-dot-to-dot-puzzle/
      - generic [ref=e312]:
        - generic [ref=e313]: 📖 ⭐ 🎨 🖍️
        - generic [ref=e314]:
          - heading "100+ printable puzzles" [level=2] [ref=e315]
          - paragraph [ref=e316]:
            - text: Get the complete printable puzzle book.
            - deletion [ref=e317]: $9.00
            - text: $5.00
        - link "View book" [ref=e318] [cursor=pointer]:
          - /url: /en/premium/
    - generic [ref=e322]:
      - region [ref=e323]:
        - generic [ref=e324]:
          - paragraph [ref=e325]: Learn and play
          - heading "See how dot-to-dot puzzles work" [level=2] [ref=e326]
        - generic [ref=e327]:
          - button "See how dot-to-dot puzzles work" [ref=e329] [cursor=pointer]:
            - img "See how dot-to-dot puzzles work" [ref=e330]
          - paragraph [ref=e335]:
            - generic [ref=e336]: "Download free:"
            - link "puzzleSection.items.mermaid-dot-to-dot-puzzle.name" [ref=e337] [cursor=pointer]:
              - /url: /ocean/mermaid-dot-to-dot-printable.pdf
      - generic [ref=e341]:
        - generic [ref=e342]:
          - paragraph [ref=e343]: categories.eyebrow
          - heading "categories.heading" [level=2] [ref=e344]
          - paragraph [ref=e345]: categories.description
        - generic [ref=e346]:
          - link [ref=e347] [cursor=pointer]:
            - /url: /en/usa-250/
            - generic [ref=e348]:
              - heading "America 250 Years" [level=3] [ref=e353]
              - paragraph [ref=e354]: Mark America's 250th anniversary in 2026 through Liberty Bells, eagles, fireworks, astronauts, and birthday scenes. Download free patriotic dot to dot PDFs for home or classroom activities.
          - link [ref=e355] [cursor=pointer]:
            - /url: /en/canada/
            - generic [ref=e356]:
              - heading "Canada" [level=3] [ref=e361]
              - paragraph [ref=e362]: Paddle a Canadian canoe, trace the maple leaf, then meet a polar bear, moose, and raccoon. This free printable collection turns Canadian symbols and wildlife into hands-on number practice.
          - link [ref=e363] [cursor=pointer]:
            - /url: /en/uae/
            - generic [ref=e364]:
              - heading "UAE" [level=3] [ref=e369]
              - paragraph [ref=e370]: Travel from the Burj Khalifa to the desert without leaving the table. These free dot to dot pages introduce UAE landmarks, a falcon, a camel, and a traditional dallah through printable PDF activities.
          - link [ref=e371] [cursor=pointer]:
            - /url: /en/garden/
            - generic [ref=e372]:
              - heading "Garden" [level=3] [ref=e377]
              - paragraph [ref=e378]: Put on the garden gloves, find the next number, and uncover a trowel or wheelbarrow. Each free connect-the-dots PDF gives preschoolers focused pencil practice.
          - link [ref=e379] [cursor=pointer]:
            - /url: /en/circus/
            - generic [ref=e380]:
              - heading "Circus" [level=3] [ref=e385]
              - paragraph [ref=e386]: Step right up for free circus dot to dot printables featuring a friendly ringmaster bear and a striped big-top tent. Download and print both PDF worksheets for counting and pencil practice.
          - link [ref=e387] [cursor=pointer]:
            - /url: /en/space/
            - generic [ref=e388]:
              - heading "Space" [level=3] [ref=e393]
              - paragraph [ref=e394]: Blast off with free space connect-the-dots worksheets. Print a friendly rover puzzle today, with more rockets, planets, and cosmic adventures coming soon.
          - link [ref=e395] [cursor=pointer]:
            - /url: /en/blog/
            - generic [ref=e396]:
              - heading "Blog" [level=3] [ref=e399]
              - paragraph [ref=e400]: Learning guides and activity ideas.
          - link [ref=e401] [cursor=pointer]:
            - /url: /en/blog/
            - generic [ref=e402]:
              - heading "Blog" [level=3] [ref=e406]
              - paragraph [ref=e407]: Ideas for learning through play
      - region "benefits.heading" [ref=e408]:
        - generic [ref=e409]:
          - paragraph [ref=e410]: benefits.eyebrow
          - heading "benefits.heading" [level=2] [ref=e411]
          - paragraph [ref=e412]: benefits.description
        - generic [ref=e413]:
          - generic [ref=e420]:
            - heading "benefits.fineMotorTitle" [level=3] [ref=e421]
            - paragraph [ref=e422]: benefits.fineMotorText
          - generic [ref=e434]:
            - heading "benefits.numberTitle" [level=3] [ref=e435]
            - paragraph [ref=e436]: benefits.numberText
          - generic [ref=e441]:
            - heading "benefits.focusTitle" [level=3] [ref=e442]
            - paragraph [ref=e443]: benefits.focusText
          - generic [ref=e448]:
            - heading "benefits.confidenceTitle" [level=3] [ref=e449]
            - paragraph [ref=e450]: benefits.confidenceText
      - region "howTo.heading" [ref=e451]:
        - generic [ref=e452]:
          - paragraph [ref=e453]: howTo.eyebrow
          - heading "howTo.heading" [level=2] [ref=e454]
        - list [ref=e455]:
          - listitem [ref=e456]:
            - generic [ref=e457]:
              - generic [ref=e458]: "1"
              - heading "howTo.step1Title" [level=3] [ref=e459]
            - paragraph [ref=e460]: howTo.step1Text
          - listitem [ref=e461]:
            - generic [ref=e462]:
              - generic [ref=e463]: "2"
              - heading "howTo.step2Title" [level=3] [ref=e464]
            - paragraph [ref=e465]: howTo.step2Text
          - listitem [ref=e466]:
            - generic [ref=e467]:
              - generic [ref=e468]: "3"
              - heading "howTo.step3Title" [level=3] [ref=e469]
            - paragraph [ref=e470]: howTo.step3Text
      - region "trust.heading" [ref=e471]:
        - generic [ref=e472]:
          - paragraph [ref=e473]: trust.eyebrow
          - heading "trust.heading" [level=2] [ref=e474]
        - generic [ref=e475]:
          - generic [ref=e480]:
            - heading "trust.noAccountTitle" [level=3] [ref=e481]
            - paragraph [ref=e482]: trust.noAccountText
          - generic [ref=e487]:
            - heading "trust.safeTitle" [level=3] [ref=e488]
            - paragraph [ref=e489]: trust.safeText
          - generic [ref=e494]:
            - heading "trust.fastTitle" [level=3] [ref=e495]
            - paragraph [ref=e496]: trust.fastText
      - region "faq.heading" [ref=e497]:
        - generic [ref=e498]:
          - paragraph [ref=e499]: faq.eyebrow
          - heading "faq.heading" [level=2] [ref=e500]
        - generic [ref=e501]:
          - group [ref=e502]:
            - generic "faq.q1" [ref=e503] [cursor=pointer]
          - group [ref=e506]:
            - generic "faq.q2" [ref=e507] [cursor=pointer]
          - group [ref=e510]:
            - generic "faq.q3" [ref=e511] [cursor=pointer]
          - group [ref=e514]:
            - generic "faq.q4" [ref=e515] [cursor=pointer]
          - group [ref=e518]:
            - generic "faq.q5" [ref=e519] [cursor=pointer]
          - group [ref=e522]:
            - generic "faq.q6" [ref=e523] [cursor=pointer]
          - group [ref=e526]:
            - generic "faq.q7" [ref=e527] [cursor=pointer]
          - group [ref=e530]:
            - generic "faq.q8" [ref=e531] [cursor=pointer]
      - region [ref=e534]:
        - generic [ref=e535]:
          - generic [ref=e536]:
            - paragraph [ref=e537]: From the blog
            - heading "Ideas for learning through play" [level=2] [ref=e538]
          - link "View all" [ref=e539] [cursor=pointer]:
            - /url: /en/blog/
        - generic [ref=e540]:
          - article [ref=e541]:
            - generic [ref=e542]:
              - generic [ref=e543]: Learning
              - generic [ref=e544]: 6 min read
            - heading [level=3] [ref=e545]:
              - link "Why Dot to Dot Puzzles Are One of the Best Things You Can Give a Young Child" [ref=e546] [cursor=pointer]:
                - /url: /en/blog/benefits-of-dot-to-dot-puzzles-for-kids/
            - paragraph [ref=e547]: How connect-the-dots builds pencil control, number sense, and quiet confidence — one line at a time.
            - generic [ref=e548]:
              - time
              - link "Read Why Dot to Dot Puzzles Are One of the Best Things You Can Give a Young Child" [ref=e549] [cursor=pointer]:
                - /url: /en/blog/benefits-of-dot-to-dot-puzzles-for-kids/
                - text: Read
          - article [ref=e552]:
            - generic [ref=e553]:
              - generic [ref=e554]: Parent Story
              - generic [ref=e555]: 5 min read
            - heading [level=3] [ref=e556]:
              - link "How Dot to Dot Printables Became My Go-To Screen-Free Activity for Kids" [ref=e557] [cursor=pointer]:
                - /url: /en/blog/screen-free-dot-to-dot-puzzles-for-kids-at-home/
            - paragraph [ref=e558]: A Columbus mom of three on the rainy Saturday that changed her afternoons — and why printable connect-the-dots are the one screen-free activity her kids actually ask for.
            - generic [ref=e559]:
              - time
              - link "Read How Dot to Dot Printables Became My Go-To Screen-Free Activity for Kids" [ref=e560] [cursor=pointer]:
                - /url: /en/blog/screen-free-dot-to-dot-puzzles-for-kids-at-home/
                - text: Read
          - article [ref=e563]:
            - generic [ref=e564]:
              - generic [ref=e565]: Learning
              - generic [ref=e566]: 5 min read
            - heading [level=3] [ref=e567]:
              - link "How Dot to Dot Puzzles Help Children Learn" [ref=e568] [cursor=pointer]:
                - /url: /en/blog/how-dot-to-dot-puzzles-help-children-learn/
            - paragraph [ref=e569]: "What actually happens when a child connects the dots: number recognition, pencil control, focus, and the quiet confidence of finishing something."
            - generic [ref=e570]:
              - time
              - link "Read How Dot to Dot Puzzles Help Children Learn" [ref=e571] [cursor=pointer]:
                - /url: /en/blog/how-dot-to-dot-puzzles-help-children-learn/
                - text: Read
      - region "feedback.heading" [ref=e574]:
        - generic [ref=e575]:
          - paragraph [ref=e576]: feedback.eyebrow
          - heading "feedback.heading" [level=2] [ref=e577]
          - paragraph [ref=e578]: feedback.description
        - alert [ref=e580]: feedbackForm.notConnected
      - region "audience.kidsTitle, audience.parentsTitle, audience.teachersTitle" [ref=e581]:
        - article [ref=e582]:
          - heading "audience.kidsTitle" [level=2] [ref=e585]
          - paragraph [ref=e586]: audience.kidsText
        - article [ref=e587]:
          - heading "audience.parentsTitle" [level=2] [ref=e593]
          - paragraph [ref=e594]: audience.parentsText
        - article [ref=e595]:
          - heading "audience.teachersTitle" [level=2] [ref=e599]
          - paragraph [ref=e600]: audience.teachersText
  - generic "Share this page" [ref=e601]:
    - generic [ref=e602]:
      - link "Share — WhatsApp" [ref=e603] [cursor=pointer]:
        - /url: https://wa.me/?text=Free%20Dot-to-Dot%20Printables%20for%20Kids%20https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2F
      - link "Share — Facebook" [ref=e606] [cursor=pointer]:
        - /url: https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2F
      - link "Share — Pinterest" [ref=e609] [cursor=pointer]:
        - /url: https://pinterest.com/pin/create/button/?url=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2F&description=Free%20Dot-to-Dot%20Printables%20for%20Kids
      - link "Share — X" [ref=e612] [cursor=pointer]:
        - /url: https://twitter.com/intent/tweet?url=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2F&text=Free%20Dot-to-Dot%20Printables%20for%20Kids
      - button "Copy link" [ref=e615] [cursor=pointer]
  - contentinfo [ref=e619]:
    - generic [ref=e620]: DotToDotFreePrintables.com
    - paragraph [ref=e626]: Free printable dot-to-dot puzzles for kids.
    - navigation "Free printable dot-to-dot puzzles for kids." [ref=e627]:
      - link "Blog" [ref=e628] [cursor=pointer]:
        - /url: /en/blog/
      - link "FAQ" [ref=e629] [cursor=pointer]:
        - /url: /en/#faq
      - link "Feedback" [ref=e630] [cursor=pointer]:
        - /url: /en/#feedback
      - link "About" [ref=e631] [cursor=pointer]:
        - /url: /en/about/
      - link "Contact" [ref=e632] [cursor=pointer]:
        - /url: /en/contact/
      - link "Privacy" [ref=e633] [cursor=pointer]:
        - /url: /en/privacy-policy/
      - link "Terms" [ref=e634] [cursor=pointer]:
        - /url: /en/terms/
      - link "Printable puzzle pack" [ref=e635] [cursor=pointer]:
        - /url: /en/premium/
      - link "Sitemap" [ref=e636] [cursor=pointer]:
        - /url: /sitemap.xml
    - generic "Free printable dot-to-dot puzzles for kids." [ref=e637]:
      - link "YouTube" [ref=e638] [cursor=pointer]:
        - /url: https://www.youtube.com/@dottodotfreeprintables_com
      - link "Pinterest" [ref=e642] [cursor=pointer]:
        - /url: https://www.pinterest.com/hellokidsbookworld/
    - paragraph [ref=e645]: Copyright 2026 - v1.0.0
```

# Test source

```ts
  1  | import { expect, test } from '@playwright/test';
  2  | 
  3  | const cases = [
  4  |   {
  5  |     locale: 'en',
  6  |     name: 'English Search Test Puzzle',
  7  |     category: 'Dinosaurs',
  8  |     href: '/en/dinosaurs/english-search-test-puzzle/'
  9  |   },
  10 |   {
  11 |     locale: 'es',
  12 |     name: 'Rompecabezas de prueba español',
  13 |     category: 'Dinosaurios',
  14 |     href: '/es/dinosaurs/rompecabezas-prueba/'
  15 |   }
  16 | ] as const;
  17 | 
  18 | for (const localeCase of cases) {
  19 |   test(`${localeCase.locale} homepage loads its search index lazily and keeps locale links correct`, async ({ page }) => {
  20 |     let indexRequests = 0;
  21 | 
  22 |     await page.route(`**/search-index/${localeCase.locale}.json`, async (route) => {
  23 |       indexRequests += 1;
  24 |       await route.fulfill({
  25 |         contentType: 'application/json',
  26 |         body: JSON.stringify([{
  27 |           id: `${localeCase.locale}-search-test`,
  28 |           slug: `${localeCase.locale}-search-test`,
  29 |           name: localeCase.name,
  30 |           category: localeCase.category,
  31 |           categoryKey: 'dinosaurs',
  32 |           href: localeCase.href,
  33 |           image: '/images/trex-61-puzzle.webp',
  34 |           difficulty: 2,
  35 |           dots: 61,
  36 |           age: 'Ages 6-9',
  37 |           isNew: false
  38 |         }])
  39 |       });
  40 |     });
  41 | 
  42 |     await page.goto(`/${localeCase.locale}/`, { waitUntil: 'networkidle' });
  43 |     expect(indexRequests).toBe(0);
  44 | 
  45 |     const searchInput = page.locator('.discovery-search input');
  46 |     await searchInput.focus();
> 47 |     await expect.poll(() => indexRequests).toBe(1);
     |                                            ^ Error: expect(received).toBe(expected) // Object.is equality
  48 | 
  49 |     await searchInput.fill(localeCase.name);
  50 |     const resultLink = page.locator('.discovery-card h2 a', { hasText: localeCase.name });
  51 |     await expect(resultLink).toBeVisible();
  52 |     await expect(resultLink).toHaveAttribute('href', localeCase.href);
  53 |     expect(await resultLink.getAttribute('href')).not.toContain(`/${localeCase.locale}/${localeCase.locale}/`);
  54 | 
  55 |     await page.locator('.discovery-filters .filter-medium').click();
  56 |     expect(indexRequests).toBe(1);
  57 |   });
  58 | }
  59 | 
```