# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: search-index.spec.ts >> en homepage loads its search index lazily and keeps locale links correct
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
  - main [ref=e121]:
    - generic [ref=e122]:
      - region [ref=e123]:
        - heading "Free Dot-to-Dot Printables for Kids" [level=1] [ref=e124]
        - paragraph [ref=e125]: Choose a printable puzzle and start connecting the dots.
        - search [ref=e126]:
          - textbox "Search puzzles" [active] [ref=e130]
          - button "Search" [ref=e131] [cursor=pointer]
        - generic "Filter puzzles" [ref=e135]:
          - button "Easy 1–20 Dots" [ref=e136] [cursor=pointer]:
            - generic [ref=e139]:
              - strong [ref=e140]: Easy
              - generic [ref=e141]: 1–20 Dots
          - button "Medium 21–60 Dots" [ref=e142] [cursor=pointer]:
            - generic [ref=e145]:
              - strong [ref=e146]: Medium
              - generic [ref=e147]: 21–60 Dots
          - button "Hard 61+ Dots" [ref=e148] [cursor=pointer]:
            - generic [ref=e151]:
              - strong [ref=e152]: Hard
              - generic [ref=e153]: 61+ Dots
          - button "Age 4–6" [ref=e155] [cursor=pointer]:
            - generic [ref=e159]:
              - strong [ref=e160]: Age
              - generic [ref=e161]: 4–6
          - button "Age 7–9" [ref=e162] [cursor=pointer]:
            - generic [ref=e166]:
              - strong [ref=e167]: Age
              - generic [ref=e168]: 7–9
          - button "Age 9–12" [ref=e169] [cursor=pointer]:
            - generic [ref=e173]:
              - strong [ref=e174]: Age
              - generic [ref=e175]: 9–12
      - generic [ref=e176]: 8 results found
      - region "Featured puzzles" [ref=e182]:
        - article [ref=e183]:
          - button "Save puzzle T-Rex 61-Dot Challenge" [ref=e184] [cursor=pointer]
          - link [ref=e187] [cursor=pointer]:
            - /url: /en/dinosaurs/trex-61-dot-to-dot-puzzle/
            - img "T-Rex 61-Dot Challenge dot-to-dot printable" [ref=e188]
          - heading [level=2] [ref=e189]:
            - link "T-Rex 61-Dot Challenge" [ref=e190] [cursor=pointer]:
              - /url: /en/dinosaurs/trex-61-dot-to-dot-puzzle/
          - generic [ref=e191]:
            - generic [ref=e192]: Medium · 61 dots
            - generic [ref=e194]: 1.9k downloads
          - link "Download free" [ref=e198] [cursor=pointer]:
            - /url: /en/dinosaurs/trex-61-dot-to-dot-puzzle/
        - article [ref=e199]:
          - button "Save puzzle Mermaid" [ref=e200] [cursor=pointer]
          - link [ref=e203] [cursor=pointer]:
            - /url: /en/ocean/mermaid-dot-to-dot-puzzle/
            - img "Mermaid dot-to-dot printable" [ref=e204]
          - heading [level=2] [ref=e205]:
            - link "Mermaid" [ref=e206] [cursor=pointer]:
              - /url: /en/ocean/mermaid-dot-to-dot-puzzle/
          - generic [ref=e207]:
            - generic [ref=e208]: Easy · 54 dots
            - generic [ref=e210]: 2.2k downloads
          - link "Download free" [ref=e214] [cursor=pointer]:
            - /url: /en/ocean/mermaid-dot-to-dot-puzzle/
        - article [ref=e215]:
          - button "Save puzzle Jellyfish" [ref=e216] [cursor=pointer]
          - link [ref=e219] [cursor=pointer]:
            - /url: /en/ocean/jellyfish-dot-to-dot-puzzle/
            - img "Jellyfish dot-to-dot printable" [ref=e220]
          - heading [level=2] [ref=e221]:
            - link "Jellyfish" [ref=e222] [cursor=pointer]:
              - /url: /en/ocean/jellyfish-dot-to-dot-puzzle/
          - generic [ref=e223]:
            - generic [ref=e224]: Medium · 88 dots
            - generic [ref=e226]: 2.5k downloads
          - link "Download free" [ref=e230] [cursor=pointer]:
            - /url: /en/ocean/jellyfish-dot-to-dot-puzzle/
        - article [ref=e231]:
          - button "Save puzzle Cute Puppy" [ref=e232] [cursor=pointer]
          - link [ref=e235] [cursor=pointer]:
            - /url: /en/cute/cute-puppy-dot-to-dot-puzzle/
            - img "Cute Puppy dot-to-dot printable" [ref=e236]
          - heading [level=2] [ref=e237]:
            - link "Cute Puppy" [ref=e238] [cursor=pointer]:
              - /url: /en/cute/cute-puppy-dot-to-dot-puzzle/
          - generic [ref=e239]:
            - generic [ref=e240]: Medium · 70 dots
            - generic [ref=e242]: 2.8k downloads
          - link "Download free" [ref=e246] [cursor=pointer]:
            - /url: /en/cute/cute-puppy-dot-to-dot-puzzle/
        - article [ref=e247]:
          - button "Save puzzle Slide Playground" [ref=e248] [cursor=pointer]
          - link [ref=e251] [cursor=pointer]:
            - /url: /en/playgrounds/slide-playgrounds-dot-to-dot-puzzle/
            - img "Slide Playground dot-to-dot printable" [ref=e252]
          - heading [level=2] [ref=e253]:
            - link "Slide Playground" [ref=e254] [cursor=pointer]:
              - /url: /en/playgrounds/slide-playgrounds-dot-to-dot-puzzle/
          - generic [ref=e255]:
            - generic [ref=e256]: Medium · 102 dots
            - generic [ref=e258]: 3.1k downloads
          - link "Download free" [ref=e262] [cursor=pointer]:
            - /url: /en/playgrounds/slide-playgrounds-dot-to-dot-puzzle/
        - article [ref=e263]:
          - button "Save puzzle Snowdrop Flower" [ref=e264] [cursor=pointer]
          - link [ref=e267] [cursor=pointer]:
            - /url: /en/flowers/snowdrop-flower-dot-to-dot-puzzle/
            - img "Snowdrop Flower dot-to-dot printable" [ref=e268]
          - heading [level=2] [ref=e269]:
            - link "Snowdrop Flower" [ref=e270] [cursor=pointer]:
              - /url: /en/flowers/snowdrop-flower-dot-to-dot-puzzle/
          - generic [ref=e271]:
            - generic [ref=e272]: Hard · 145 dots
            - generic [ref=e274]: 1.9k downloads
          - link "Download free" [ref=e278] [cursor=pointer]:
            - /url: /en/flowers/snowdrop-flower-dot-to-dot-puzzle/
        - article [ref=e279]:
          - button "Save puzzle Dashing Car Playground" [ref=e280] [cursor=pointer]
          - link [ref=e283] [cursor=pointer]:
            - /url: /en/playgrounds/dashing-car-playground-dot-to-dot-puzzle/
            - img "Dashing Car Playground dot-to-dot printable" [ref=e284]
          - heading [level=2] [ref=e285]:
            - link "Dashing Car Playground" [ref=e286] [cursor=pointer]:
              - /url: /en/playgrounds/dashing-car-playground-dot-to-dot-puzzle/
          - generic [ref=e287]:
            - generic [ref=e288]: Easy · 0 dots
            - generic [ref=e290]: 2.2k downloads
          - link "Download free" [ref=e294] [cursor=pointer]:
            - /url: /en/playgrounds/dashing-car-playground-dot-to-dot-puzzle/
        - article [ref=e295]:
          - button "Save puzzle Lotus Flower" [ref=e296] [cursor=pointer]
          - link [ref=e299] [cursor=pointer]:
            - /url: /en/flowers/lotus-flower-dot-to-dot-puzzle/
            - img "Lotus Flower dot-to-dot printable" [ref=e300]
          - heading [level=2] [ref=e301]:
            - link "Lotus Flower" [ref=e302] [cursor=pointer]:
              - /url: /en/flowers/lotus-flower-dot-to-dot-puzzle/
          - generic [ref=e303]:
            - generic [ref=e304]: Easy · 46 dots
            - generic [ref=e306]: 2.5k downloads
          - link "Download free" [ref=e310] [cursor=pointer]:
            - /url: /en/flowers/lotus-flower-dot-to-dot-puzzle/
      - generic [ref=e311]:
        - generic [ref=e312]: 📖 ⭐ 🎨 🖍️
        - generic [ref=e313]:
          - heading "100+ printable puzzles" [level=2] [ref=e314]
          - paragraph [ref=e315]:
            - text: Get the complete printable puzzle book.
            - deletion [ref=e316]: $9.00
            - text: $5.00
        - link "View book" [ref=e317] [cursor=pointer]:
          - /url: /en/premium/
    - generic [ref=e321]:
      - region [ref=e322]:
        - generic [ref=e323]:
          - paragraph [ref=e324]: Learn and play
          - heading "See how dot-to-dot puzzles work" [level=2] [ref=e325]
        - generic [ref=e326]:
          - button "See how dot-to-dot puzzles work" [ref=e328] [cursor=pointer]:
            - img "See how dot-to-dot puzzles work" [ref=e329]
          - paragraph [ref=e334]:
            - generic [ref=e335]: "Download free:"
            - link "puzzleSection.items.mermaid-dot-to-dot-puzzle.name" [ref=e336] [cursor=pointer]:
              - /url: /ocean/mermaid-dot-to-dot-printable.pdf
      - generic [ref=e340]:
        - generic [ref=e341]:
          - paragraph [ref=e342]: categories.eyebrow
          - heading "categories.heading" [level=2] [ref=e343]
          - paragraph [ref=e344]: categories.description
        - generic [ref=e345]:
          - link [ref=e346] [cursor=pointer]:
            - /url: /en/usa-250/
            - generic [ref=e347]:
              - heading "America 250 Years" [level=3] [ref=e352]
              - paragraph [ref=e353]: Mark America's 250th anniversary in 2026 through Liberty Bells, eagles, fireworks, astronauts, and birthday scenes. Download free patriotic dot to dot PDFs for home or classroom activities.
          - link [ref=e354] [cursor=pointer]:
            - /url: /en/canada/
            - generic [ref=e355]:
              - heading "Canada" [level=3] [ref=e360]
              - paragraph [ref=e361]: Paddle a Canadian canoe, trace the maple leaf, then meet a polar bear, moose, and raccoon. This free printable collection turns Canadian symbols and wildlife into hands-on number practice.
          - link [ref=e362] [cursor=pointer]:
            - /url: /en/uae/
            - generic [ref=e363]:
              - heading "UAE" [level=3] [ref=e368]
              - paragraph [ref=e369]: Travel from the Burj Khalifa to the desert without leaving the table. These free dot to dot pages introduce UAE landmarks, a falcon, a camel, and a traditional dallah through printable PDF activities.
          - link [ref=e370] [cursor=pointer]:
            - /url: /en/garden/
            - generic [ref=e371]:
              - heading "Garden" [level=3] [ref=e376]
              - paragraph [ref=e377]: Put on the garden gloves, find the next number, and uncover a trowel or wheelbarrow. Each free connect-the-dots PDF gives preschoolers focused pencil practice.
          - link [ref=e378] [cursor=pointer]:
            - /url: /en/circus/
            - generic [ref=e379]:
              - heading "Circus" [level=3] [ref=e384]
              - paragraph [ref=e385]: Step right up for free circus dot to dot printables featuring a friendly ringmaster bear and a striped big-top tent. Download and print both PDF worksheets for counting and pencil practice.
          - link [ref=e386] [cursor=pointer]:
            - /url: /en/space/
            - generic [ref=e387]:
              - heading "Space" [level=3] [ref=e392]
              - paragraph [ref=e393]: Blast off with free space connect-the-dots worksheets. Print a friendly rover puzzle today, with more rockets, planets, and cosmic adventures coming soon.
          - link [ref=e394] [cursor=pointer]:
            - /url: /en/blog/
            - generic [ref=e395]:
              - heading "Blog" [level=3] [ref=e398]
              - paragraph [ref=e399]: Learning guides and activity ideas.
          - link [ref=e400] [cursor=pointer]:
            - /url: /en/blog/
            - generic [ref=e401]:
              - heading "Blog" [level=3] [ref=e405]
              - paragraph [ref=e406]: Ideas for learning through play
      - region "benefits.heading" [ref=e407]:
        - generic [ref=e408]:
          - paragraph [ref=e409]: benefits.eyebrow
          - heading "benefits.heading" [level=2] [ref=e410]
          - paragraph [ref=e411]: benefits.description
        - generic [ref=e412]:
          - generic [ref=e419]:
            - heading "benefits.fineMotorTitle" [level=3] [ref=e420]
            - paragraph [ref=e421]: benefits.fineMotorText
          - generic [ref=e433]:
            - heading "benefits.numberTitle" [level=3] [ref=e434]
            - paragraph [ref=e435]: benefits.numberText
          - generic [ref=e440]:
            - heading "benefits.focusTitle" [level=3] [ref=e441]
            - paragraph [ref=e442]: benefits.focusText
          - generic [ref=e447]:
            - heading "benefits.confidenceTitle" [level=3] [ref=e448]
            - paragraph [ref=e449]: benefits.confidenceText
      - region "howTo.heading" [ref=e450]:
        - generic [ref=e451]:
          - paragraph [ref=e452]: howTo.eyebrow
          - heading "howTo.heading" [level=2] [ref=e453]
        - list [ref=e454]:
          - listitem [ref=e455]:
            - generic [ref=e456]:
              - generic [ref=e457]: "1"
              - heading "howTo.step1Title" [level=3] [ref=e458]
            - paragraph [ref=e459]: howTo.step1Text
          - listitem [ref=e460]:
            - generic [ref=e461]:
              - generic [ref=e462]: "2"
              - heading "howTo.step2Title" [level=3] [ref=e463]
            - paragraph [ref=e464]: howTo.step2Text
          - listitem [ref=e465]:
            - generic [ref=e466]:
              - generic [ref=e467]: "3"
              - heading "howTo.step3Title" [level=3] [ref=e468]
            - paragraph [ref=e469]: howTo.step3Text
      - region "trust.heading" [ref=e470]:
        - generic [ref=e471]:
          - paragraph [ref=e472]: trust.eyebrow
          - heading "trust.heading" [level=2] [ref=e473]
        - generic [ref=e474]:
          - generic [ref=e479]:
            - heading "trust.noAccountTitle" [level=3] [ref=e480]
            - paragraph [ref=e481]: trust.noAccountText
          - generic [ref=e486]:
            - heading "trust.safeTitle" [level=3] [ref=e487]
            - paragraph [ref=e488]: trust.safeText
          - generic [ref=e493]:
            - heading "trust.fastTitle" [level=3] [ref=e494]
            - paragraph [ref=e495]: trust.fastText
      - region "faq.heading" [ref=e496]:
        - generic [ref=e497]:
          - paragraph [ref=e498]: faq.eyebrow
          - heading "faq.heading" [level=2] [ref=e499]
        - generic [ref=e500]:
          - group [ref=e501]:
            - generic "faq.q1" [ref=e502] [cursor=pointer]
          - group [ref=e505]:
            - generic "faq.q2" [ref=e506] [cursor=pointer]
          - group [ref=e509]:
            - generic "faq.q3" [ref=e510] [cursor=pointer]
          - group [ref=e513]:
            - generic "faq.q4" [ref=e514] [cursor=pointer]
          - group [ref=e517]:
            - generic "faq.q5" [ref=e518] [cursor=pointer]
          - group [ref=e521]:
            - generic "faq.q6" [ref=e522] [cursor=pointer]
          - group [ref=e525]:
            - generic "faq.q7" [ref=e526] [cursor=pointer]
          - group [ref=e529]:
            - generic "faq.q8" [ref=e530] [cursor=pointer]
      - region [ref=e533]:
        - generic [ref=e534]:
          - generic [ref=e535]:
            - paragraph [ref=e536]: From the blog
            - heading "Ideas for learning through play" [level=2] [ref=e537]
          - link "View all" [ref=e538] [cursor=pointer]:
            - /url: /en/blog/
        - generic [ref=e539]:
          - article [ref=e540]:
            - generic [ref=e541]:
              - generic [ref=e542]: Learning
              - generic [ref=e543]: 6 min read
            - heading [level=3] [ref=e544]:
              - link "Why Dot to Dot Puzzles Are One of the Best Things You Can Give a Young Child" [ref=e545] [cursor=pointer]:
                - /url: /en/blog/benefits-of-dot-to-dot-puzzles-for-kids/
            - paragraph [ref=e546]: How connect-the-dots builds pencil control, number sense, and quiet confidence — one line at a time.
            - generic [ref=e547]:
              - time
              - link "Read Why Dot to Dot Puzzles Are One of the Best Things You Can Give a Young Child" [ref=e548] [cursor=pointer]:
                - /url: /en/blog/benefits-of-dot-to-dot-puzzles-for-kids/
                - text: Read
          - article [ref=e551]:
            - generic [ref=e552]:
              - generic [ref=e553]: Parent Story
              - generic [ref=e554]: 5 min read
            - heading [level=3] [ref=e555]:
              - link "How Dot to Dot Printables Became My Go-To Screen-Free Activity for Kids" [ref=e556] [cursor=pointer]:
                - /url: /en/blog/screen-free-dot-to-dot-puzzles-for-kids-at-home/
            - paragraph [ref=e557]: A Columbus mom of three on the rainy Saturday that changed her afternoons — and why printable connect-the-dots are the one screen-free activity her kids actually ask for.
            - generic [ref=e558]:
              - time
              - link "Read How Dot to Dot Printables Became My Go-To Screen-Free Activity for Kids" [ref=e559] [cursor=pointer]:
                - /url: /en/blog/screen-free-dot-to-dot-puzzles-for-kids-at-home/
                - text: Read
          - article [ref=e562]:
            - generic [ref=e563]:
              - generic [ref=e564]: Learning
              - generic [ref=e565]: 5 min read
            - heading [level=3] [ref=e566]:
              - link "How Dot to Dot Puzzles Help Children Learn" [ref=e567] [cursor=pointer]:
                - /url: /en/blog/how-dot-to-dot-puzzles-help-children-learn/
            - paragraph [ref=e568]: "What actually happens when a child connects the dots: number recognition, pencil control, focus, and the quiet confidence of finishing something."
            - generic [ref=e569]:
              - time
              - link "Read How Dot to Dot Puzzles Help Children Learn" [ref=e570] [cursor=pointer]:
                - /url: /en/blog/how-dot-to-dot-puzzles-help-children-learn/
                - text: Read
      - region "feedback.heading" [ref=e573]:
        - generic [ref=e574]:
          - paragraph [ref=e575]: feedback.eyebrow
          - heading "feedback.heading" [level=2] [ref=e576]
          - paragraph [ref=e577]: feedback.description
        - alert [ref=e579]: feedbackForm.notConnected
      - region "audience.kidsTitle, audience.parentsTitle, audience.teachersTitle" [ref=e580]:
        - article [ref=e581]:
          - heading "audience.kidsTitle" [level=2] [ref=e584]
          - paragraph [ref=e585]: audience.kidsText
        - article [ref=e586]:
          - heading "audience.parentsTitle" [level=2] [ref=e592]
          - paragraph [ref=e593]: audience.parentsText
        - article [ref=e594]:
          - heading "audience.teachersTitle" [level=2] [ref=e598]
          - paragraph [ref=e599]: audience.teachersText
  - generic "Share this page" [ref=e600]:
    - generic [ref=e601]:
      - link "Share — WhatsApp" [ref=e602] [cursor=pointer]:
        - /url: https://wa.me/?text=Free%20Dot-to-Dot%20Printables%20for%20Kids%20https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2F
      - link "Share — Facebook" [ref=e605] [cursor=pointer]:
        - /url: https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2F
      - link "Share — Pinterest" [ref=e608] [cursor=pointer]:
        - /url: https://pinterest.com/pin/create/button/?url=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2F&description=Free%20Dot-to-Dot%20Printables%20for%20Kids
      - link "Share — X" [ref=e611] [cursor=pointer]:
        - /url: https://twitter.com/intent/tweet?url=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2F&text=Free%20Dot-to-Dot%20Printables%20for%20Kids
      - button "Copy link" [ref=e614] [cursor=pointer]
  - contentinfo [ref=e618]:
    - generic [ref=e619]: DotToDotFreePrintables.com
    - paragraph [ref=e625]: Free printable dot-to-dot puzzles for kids.
    - navigation "Free printable dot-to-dot puzzles for kids." [ref=e626]:
      - link "Blog" [ref=e627] [cursor=pointer]:
        - /url: /en/blog/
      - link "FAQ" [ref=e628] [cursor=pointer]:
        - /url: /en/#faq
      - link "Feedback" [ref=e629] [cursor=pointer]:
        - /url: /en/#feedback
      - link "About" [ref=e630] [cursor=pointer]:
        - /url: /en/about/
      - link "Contact" [ref=e631] [cursor=pointer]:
        - /url: /en/contact/
      - link "Privacy" [ref=e632] [cursor=pointer]:
        - /url: /en/privacy-policy/
      - link "Terms" [ref=e633] [cursor=pointer]:
        - /url: /en/terms/
      - link "Printable puzzle pack" [ref=e634] [cursor=pointer]:
        - /url: /en/premium/
      - link "Sitemap" [ref=e635] [cursor=pointer]:
        - /url: /sitemap.xml
    - generic "Free printable dot-to-dot puzzles for kids." [ref=e636]:
      - link "YouTube" [ref=e637] [cursor=pointer]:
        - /url: https://www.youtube.com/@dottodotfreeprintables_com
      - link "Pinterest" [ref=e641] [cursor=pointer]:
        - /url: https://www.pinterest.com/hellokidsbookworld/
    - paragraph [ref=e644]: Copyright 2026 - v1.0.0
  - alert [ref=e645]
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