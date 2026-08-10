# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: i18n-layout.spec.ts >> Arabic regional alias hreflang cluster >> nested pages preserve the same Arabic path in every regional alternate
- Location: tests\i18n-layout.spec.ts:317:7

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: "/ar-AE/blog/benefits-of-dot-to-dot-puzzles-for-kids/"
Received: "/en/"
```

# Page snapshot

```yaml
- generic [ref=f1e1]:
  - alert [ref=f1e2]: Free Dot to Dot Printables for Kids | Connect the Dots Worksheets PDF
  - link "Skip to main content" [ref=f1e3] [cursor=pointer]:
    - /url: "#main-content"
  - banner [ref=f1e4]:
    - navigation "Browse dot to dot puzzles by category" [ref=f1e5]:
      - link "DotToDotFreePrintables — Home" [ref=f1e6] [cursor=pointer]:
        - /url: /en/
        - text: DotToDotFreePrintables
      - navigation "Browse puzzle categories" [ref=f1e11]:
        - link "Home" [ref=f1e12] [cursor=pointer]:
          - /url: /en/
        - link "Flowers" [ref=f1e18] [cursor=pointer]:
          - /url: /en/flowers/
          - generic [ref=f1e19]: New
        - link "Cute Puzzles" [ref=f1e27] [cursor=pointer]:
          - /url: /en/cute/
          - generic [ref=f1e28]:
            - generic [ref=f1e29]: 🐶
            - generic [ref=f1e30]: New
        - link "Playgrounds" [ref=f1e32] [cursor=pointer]:
          - /url: /en/playgrounds/
          - generic [ref=f1e33]: 🛝
        - link "Dinosaurs" [ref=f1e36] [cursor=pointer]:
          - /url: /en/dinosaurs/
          - generic [ref=f1e37]: 🦖
        - link "Ocean" [ref=f1e40] [cursor=pointer]:
          - /url: /en/ocean/
        - link "Circus" [ref=f1e45] [cursor=pointer]:
          - /url: /en/circus/
          - generic [ref=f1e46]:
            - generic [ref=f1e47]: 🤡
            - generic [ref=f1e48]: New
        - link "More categories" [ref=f1e50] [cursor=pointer]:
          - /url: /en/#categories
      - generic "Language" [ref=f1e58]:
        - combobox "Select language" [ref=f1e62] [cursor=pointer]:
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
    - img [ref=f1e64]:
      - generic [ref=f1e65]: "1"
      - generic [ref=f1e67]: "2"
      - generic [ref=f1e69]: "3"
      - generic [ref=f1e71]: "4"
      - generic [ref=f1e73]: "5"
      - generic [ref=f1e75]: "6"
      - generic [ref=f1e77]: "7"
      - generic [ref=f1e79]: "8"
      - generic [ref=f1e81]: "9"
      - generic [ref=f1e83]: "10"
      - generic [ref=f1e85]: "11"
      - generic [ref=f1e87]: "12"
      - generic [ref=f1e89]: "13"
      - generic [ref=f1e91]: "14"
      - generic [ref=f1e93]: "15"
      - generic [ref=f1e95]: "16"
      - generic [ref=f1e97]: "17"
      - generic [ref=f1e99]: "18"
      - generic [ref=f1e101]: "19"
      - generic [ref=f1e103]: "20"
      - generic [ref=f1e105]: "21"
      - generic [ref=f1e107]: "22"
      - generic [ref=f1e109]: "23"
      - generic [ref=f1e111]: "24"
      - generic [ref=f1e113]: "25"
      - generic [ref=f1e115]: "26"
      - generic [ref=f1e117]: "27"
      - generic [ref=f1e119]: "28"
      - generic [ref=f1e121]: "29"
      - generic [ref=f1e123]: "30"
  - main [active] [ref=f1e125]:
    - generic [ref=f1e126]:
      - region [ref=f1e127]:
        - heading "Find the perfect dot to dot printables" [level=1] [ref=f1e128]
        - paragraph [ref=f1e129]: Print, connect the dots, and bring amazing pictures to life. Free and ready for fun!
        - search [ref=f1e130]:
          - textbox "Search puzzles" [ref=f1e134]:
            - /placeholder: Try ocean, dinosaur, or flowers
          - button "Search" [ref=f1e135] [cursor=pointer]
        - generic "Filter puzzles" [ref=f1e139]:
          - button "Easy 1–20 Dots" [ref=f1e140] [cursor=pointer]:
            - generic [ref=f1e143]:
              - strong [ref=f1e144]: Easy
              - generic [ref=f1e145]: 1–20 Dots
          - button "Medium 21–60 Dots" [ref=f1e146] [cursor=pointer]:
            - generic [ref=f1e149]:
              - strong [ref=f1e150]: Medium
              - generic [ref=f1e151]: 21–60 Dots
          - button "Hard 61+ Dots" [ref=f1e152] [cursor=pointer]:
            - generic [ref=f1e155]:
              - strong [ref=f1e156]: Hard
              - generic [ref=f1e157]: 61+ Dots
          - button "Age 4–6" [ref=f1e159] [cursor=pointer]:
            - generic [ref=f1e163]:
              - strong [ref=f1e164]: Age
              - generic [ref=f1e165]: 4–6
          - button "Age 7–9" [ref=f1e166] [cursor=pointer]:
            - generic [ref=f1e170]:
              - strong [ref=f1e171]: Age
              - generic [ref=f1e172]: 7–9
          - button "Age 9–12" [ref=f1e173] [cursor=pointer]:
            - generic [ref=f1e177]:
              - strong [ref=f1e178]: Age
              - generic [ref=f1e179]: 9–12
      - generic [ref=f1e180]: 8 puzzles found
      - region "Featured printable puzzles" [ref=f1e186]:
        - article [ref=f1e187]:
          - button "Save T-Rex 61-Dot Challenge" [ref=f1e188] [cursor=pointer]
          - link [ref=f1e191] [cursor=pointer]:
            - /url: /en/dinosaurs/trex-61-dot-to-dot-puzzle/
            - img "T-Rex 61-Dot Challenge dot to dot printable" [ref=f1e192]
          - heading [level=2] [ref=f1e193]:
            - link "T-Rex 61-Dot Challenge" [ref=f1e194] [cursor=pointer]:
              - /url: /en/dinosaurs/trex-61-dot-to-dot-puzzle/
          - generic [ref=f1e195]:
            - generic [ref=f1e196]: Medium · 1–61 dots
            - generic [ref=f1e198]: 1.9k downloads
          - link "Download free printable" [ref=f1e202] [cursor=pointer]:
            - /url: /en/dinosaurs/trex-61-dot-to-dot-puzzle/
        - article [ref=f1e203]:
          - button "Save Mermaid" [ref=f1e204] [cursor=pointer]
          - link [ref=f1e207] [cursor=pointer]:
            - /url: /en/ocean/mermaid-dot-to-dot-puzzle/
            - img "Mermaid dot to dot printable" [ref=f1e208]
          - heading [level=2] [ref=f1e209]:
            - link "Mermaid" [ref=f1e210] [cursor=pointer]:
              - /url: /en/ocean/mermaid-dot-to-dot-puzzle/
          - generic [ref=f1e211]:
            - generic [ref=f1e212]: Easy · 1–54 dots
            - generic [ref=f1e214]: 2.2k downloads
          - link "Download free printable" [ref=f1e218] [cursor=pointer]:
            - /url: /en/ocean/mermaid-dot-to-dot-puzzle/
        - article [ref=f1e219]:
          - button "Save Jellyfish" [ref=f1e220] [cursor=pointer]
          - link [ref=f1e223] [cursor=pointer]:
            - /url: /en/ocean/jellyfish-dot-to-dot-puzzle/
            - img "Jellyfish dot to dot printable" [ref=f1e224]
          - heading [level=2] [ref=f1e225]:
            - link "Jellyfish" [ref=f1e226] [cursor=pointer]:
              - /url: /en/ocean/jellyfish-dot-to-dot-puzzle/
          - generic [ref=f1e227]:
            - generic [ref=f1e228]: Medium · 1–88 dots
            - generic [ref=f1e230]: 2.5k downloads
          - link "Download free printable" [ref=f1e234] [cursor=pointer]:
            - /url: /en/ocean/jellyfish-dot-to-dot-puzzle/
        - article [ref=f1e235]:
          - button "Save Cute Puppy" [ref=f1e236] [cursor=pointer]
          - link [ref=f1e239] [cursor=pointer]:
            - /url: /en/cute/cute-puppy-dot-to-dot-puzzle/
            - img "Cute Puppy dot to dot printable" [ref=f1e240]
          - heading [level=2] [ref=f1e241]:
            - link "Cute Puppy" [ref=f1e242] [cursor=pointer]:
              - /url: /en/cute/cute-puppy-dot-to-dot-puzzle/
          - generic [ref=f1e243]:
            - generic [ref=f1e244]: Medium · 1–70 dots
            - generic [ref=f1e246]: 2.8k downloads
          - link "Download free printable" [ref=f1e250] [cursor=pointer]:
            - /url: /en/cute/cute-puppy-dot-to-dot-puzzle/
        - article [ref=f1e251]:
          - button "Save Slide Playground" [ref=f1e252] [cursor=pointer]
          - link [ref=f1e255] [cursor=pointer]:
            - /url: /en/playgrounds/slide-playgrounds-dot-to-dot-puzzle/
            - img "Slide Playground dot to dot printable" [ref=f1e256]
          - heading [level=2] [ref=f1e257]:
            - link "Slide Playground" [ref=f1e258] [cursor=pointer]:
              - /url: /en/playgrounds/slide-playgrounds-dot-to-dot-puzzle/
          - generic [ref=f1e259]:
            - generic [ref=f1e260]: Medium · 1–102 dots
            - generic [ref=f1e262]: 3.1k downloads
          - link "Download free printable" [ref=f1e266] [cursor=pointer]:
            - /url: /en/playgrounds/slide-playgrounds-dot-to-dot-puzzle/
        - article [ref=f1e267]:
          - button "Save Snowdrop Flower" [ref=f1e268] [cursor=pointer]
          - link [ref=f1e271] [cursor=pointer]:
            - /url: /en/flowers/snowdrop-flower-dot-to-dot-puzzle/
            - img "Snowdrop Flower dot to dot printable" [ref=f1e272]
          - heading [level=2] [ref=f1e273]:
            - link "Snowdrop Flower" [ref=f1e274] [cursor=pointer]:
              - /url: /en/flowers/snowdrop-flower-dot-to-dot-puzzle/
          - generic [ref=f1e275]:
            - generic [ref=f1e276]: Hard · 1–145 dots
            - generic [ref=f1e278]: 1.9k downloads
          - link "Download free printable" [ref=f1e282] [cursor=pointer]:
            - /url: /en/flowers/snowdrop-flower-dot-to-dot-puzzle/
        - article [ref=f1e283]:
          - button "Save Dashing Car Playground" [ref=f1e284] [cursor=pointer]
          - link [ref=f1e287] [cursor=pointer]:
            - /url: /en/playgrounds/dashing-car-playground-dot-to-dot-puzzle/
            - img "Dashing Car Playground dot to dot printable" [ref=f1e288]
          - heading [level=2] [ref=f1e289]:
            - link "Dashing Car Playground" [ref=f1e290] [cursor=pointer]:
              - /url: /en/playgrounds/dashing-car-playground-dot-to-dot-puzzle/
          - generic [ref=f1e291]:
            - generic [ref=f1e292]: Easy · 1–48 dots
            - generic [ref=f1e294]: 2.2k downloads
          - link "Download free printable" [ref=f1e298] [cursor=pointer]:
            - /url: /en/playgrounds/dashing-car-playground-dot-to-dot-puzzle/
        - article [ref=f1e299]:
          - button "Save Lotus Flower" [ref=f1e300] [cursor=pointer]
          - link [ref=f1e303] [cursor=pointer]:
            - /url: /en/flowers/lotus-flower-dot-to-dot-puzzle/
            - img "Lotus Flower dot to dot printable" [ref=f1e304]
          - heading [level=2] [ref=f1e305]:
            - link "Lotus Flower" [ref=f1e306] [cursor=pointer]:
              - /url: /en/flowers/lotus-flower-dot-to-dot-puzzle/
          - generic [ref=f1e307]:
            - generic [ref=f1e308]: Easy · 1–46 dots
            - generic [ref=f1e310]: 2.5k downloads
          - link "Download free printable" [ref=f1e314] [cursor=pointer]:
            - /url: /en/flowers/lotus-flower-dot-to-dot-puzzle/
      - generic [ref=f1e315]:
        - generic [ref=f1e316]: 📖 ⭐ 🎨 🖍️
        - generic [ref=f1e317]:
          - heading "Best of 2026 · 25 Dot to Dot Puzzles" [level=2] [ref=f1e318]
          - paragraph [ref=f1e319]:
            - text: Our favorite dot-to-dots in one printable PDF book.
            - deletion [ref=f1e320]: $9.00
            - text: $5.00
        - link "View book" [ref=f1e321] [cursor=pointer]:
          - /url: /en/premium/
    - generic [ref=f1e325]:
      - region [ref=f1e326]:
        - generic [ref=f1e327]:
          - paragraph [ref=f1e328]: Video
          - heading "Watch dot to dot fun in action" [level=2] [ref=f1e329]
        - generic [ref=f1e330]:
          - button "Watch dot to dot fun in action" [ref=f1e332] [cursor=pointer]:
            - img "Watch dot to dot fun in action" [ref=f1e333]
          - paragraph [ref=f1e338]:
            - generic [ref=f1e339]: "Download free printable:"
            - link "Mermaid" [ref=f1e340] [cursor=pointer]:
              - /url: /ocean/mermaid-dot-to-dot-printable.pdf
      - region [ref=f1e344]:
        - generic [ref=f1e345]:
          - generic [ref=f1e346]:
            - generic [ref=f1e351]:
              - paragraph [ref=f1e352]: Popular this week
              - heading "Most downloaded puzzles" [level=2] [ref=f1e353]
            - list [ref=f1e354]:
              - listitem [ref=f1e355]:
                - generic [ref=f1e356]: "1"
                - link "T-Rex 61-Dot Challenge" [ref=f1e357] [cursor=pointer]:
                  - /url: /en/dinosaurs/trex-61-dot-to-dot-puzzle/
                - generic "23 or more downloads" [ref=f1e358]: 23+
              - listitem [ref=f1e362]:
                - generic [ref=f1e363]: "2"
                - link "Mermaid" [ref=f1e364] [cursor=pointer]:
                  - /url: /en/ocean/mermaid-dot-to-dot-puzzle/
                - generic "20 or more downloads" [ref=f1e365]: 20+
              - listitem [ref=f1e369]:
                - generic [ref=f1e370]: "3"
                - link "Jellyfish" [ref=f1e371] [cursor=pointer]:
                  - /url: /en/ocean/jellyfish-dot-to-dot-puzzle/
                - generic "10 or more downloads" [ref=f1e372]: 10+
              - listitem [ref=f1e376]:
                - generic [ref=f1e377]: "4"
                - link "Cute Puppy" [ref=f1e378] [cursor=pointer]:
                  - /url: /en/cute/cute-puppy-dot-to-dot-puzzle/
                - generic "9 or more downloads" [ref=f1e379]: 9+
              - listitem [ref=f1e383]:
                - generic [ref=f1e384]: "5"
                - link "Spring Horse" [ref=f1e385] [cursor=pointer]:
                  - /url: /en/playgrounds/spring-horse-playground-dot-to-dot-puzzle/
                - generic "7 or more downloads" [ref=f1e386]: 7+
              - listitem [ref=f1e390]:
                - generic [ref=f1e391]: "6"
                - link "Spinosaurus" [ref=f1e392] [cursor=pointer]:
                  - /url: /en/dinosaurs/spinosaurus/
                - generic "7 or more downloads" [ref=f1e393]: 7+
              - listitem [ref=f1e397]:
                - generic [ref=f1e398]: "7"
                - link "Snowdrop Flower" [ref=f1e399] [cursor=pointer]:
                  - /url: /en/flowers/snowdrop-flower-dot-to-dot-puzzle/
                - generic "7 or more downloads" [ref=f1e400]: 7+
              - listitem [ref=f1e404]:
                - generic [ref=f1e405]: "8"
                - link "Slide Playground" [ref=f1e406] [cursor=pointer]:
                  - /url: /en/playgrounds/slide-playgrounds-dot-to-dot-puzzle/
                - generic "6 or more downloads" [ref=f1e407]: 6+
          - generic [ref=f1e411]:
            - generic [ref=f1e416]:
              - paragraph [ref=f1e417]: Fresh printables
              - heading "Recently added" [level=3] [ref=f1e418]
            - list [ref=f1e419]:
              - listitem [ref=f1e420]:
                - generic [ref=f1e421]: "1"
                - link "Circus Ringmaster Bear" [ref=f1e422] [cursor=pointer]:
                  - /url: /en/circus/circus-ringmaster-bear-dot-to-dot-puzzle/
                - generic [ref=f1e423]: New
              - listitem [ref=f1e424]:
                - generic [ref=f1e425]: "2"
                - link "Circus Tent" [ref=f1e426] [cursor=pointer]:
                  - /url: /en/circus/circus-tent-dot-to-dot-puzzle/
                - generic [ref=f1e427]: New
              - listitem [ref=f1e428]:
                - generic [ref=f1e429]: "3"
                - link "Space Rover" [ref=f1e430] [cursor=pointer]:
                  - /url: /en/space/space-rover-dot-to-dot-puzzle/
                - generic [ref=f1e431]: New
              - listitem [ref=f1e432]:
                - generic [ref=f1e433]: "4"
                - link "Ringed Planet" [ref=f1e434] [cursor=pointer]:
                  - /url: /en/space/ringed-planet-dot-to-dot-puzzle/
                - generic [ref=f1e435]: New
      - generic [ref=f1e436]:
        - generic [ref=f1e437]:
          - paragraph [ref=f1e438]: Organized by theme and skill level
          - heading "Browse dot to dot puzzles by category" [level=2] [ref=f1e439]
          - paragraph [ref=f1e440]: From simple 38-dot shapes for beginners to 130+ dot challenges for older kids — sorted by category so you find the right free printable in seconds.
        - generic [ref=f1e441]:
          - link "New! America 250 Years Celebrate America's 250th birthday with patriotic dot to dot puzzles honoring American history." [ref=f1e442] [cursor=pointer]:
            - /url: /en/usa-250/
            - generic [ref=f1e443]: New!
            - generic [ref=f1e444]:
              - heading "America 250 Years" [level=3] [ref=f1e447]
              - paragraph [ref=f1e448]: Celebrate America's 250th birthday with patriotic dot to dot puzzles honoring American history.
          - link "New! Canada Explore Canada with a polar bear, raccoon, moose, and maple leaf to connect and colour." [ref=f1e449] [cursor=pointer]:
            - /url: /en/canada/
            - generic [ref=f1e450]: New!
            - generic [ref=f1e451]:
              - heading "Canada" [level=3] [ref=f1e455]
              - paragraph [ref=f1e456]: Explore Canada with a polar bear, raccoon, moose, and maple leaf to connect and colour.
          - link "Available now! UAE Explore the United Arab Emirates! Iconic landmarks like the Burj Al Arab, ready to connect and colour." [ref=f1e457] [cursor=pointer]:
            - /url: /en/uae/
            - generic [ref=f1e458]: Available now!
            - generic [ref=f1e459]:
              - heading "UAE" [level=3] [ref=f1e462]
              - paragraph [ref=f1e463]: Explore the United Arab Emirates! Iconic landmarks like the Burj Al Arab, ready to connect and colour.
          - link "Available now! Garden Gloves, trowels, and tools for little garden helpers." [ref=f1e464] [cursor=pointer]:
            - /url: /en/garden/
            - generic [ref=f1e465]: Available now!
            - generic [ref=f1e466]:
              - heading "Garden" [level=3] [ref=f1e471]
              - paragraph [ref=f1e472]: Gloves, trowels, and tools for little garden helpers.
          - link "New! Space Planets, astronauts, and rocket adventures." [ref=f1e473] [cursor=pointer]:
            - /url: /en/space/
            - generic [ref=f1e474]: New!
            - generic [ref=f1e475]:
              - heading "Space" [level=3] [ref=f1e481]
              - paragraph [ref=f1e482]: Planets, astronauts, and rocket adventures.
          - link "New! Circus Ringmasters, big tops, and showtime fun for young learners." [ref=f1e483] [cursor=pointer]:
            - /url: /en/circus/
            - generic [ref=f1e484]: New!
            - generic [ref=f1e485]:
              - heading "Circus" [level=3] [ref=f1e492]
              - paragraph [ref=f1e493]: Ringmasters, big tops, and showtime fun for young learners.
          - link [ref=f1e494] [cursor=pointer]:
            - /url: /en/blog/
            - generic [ref=f1e495]:
              - heading "Blog" [level=3] [ref=f1e499]
              - paragraph [ref=f1e500]: Learning tips for home and classroom
      - region "Why dot to dot worksheets are great for child development" [ref=f1e501]:
        - generic [ref=f1e502]:
          - paragraph [ref=f1e503]: Backed by early childhood educators
          - heading "Why dot to dot worksheets are great for child development" [level=2] [ref=f1e504]
          - paragraph [ref=f1e505]: Connect-the-dots printables are more than just fun — they support early learning in preschool (nursery/reception), kindergarten/prep, and UK EYFS classrooms across the US, UK, Canada, and Australia.
        - generic [ref=f1e506]:
          - generic [ref=f1e513]:
            - heading "Builds fine motor skills" [level=3] [ref=f1e514]
            - paragraph [ref=f1e515]: Drawing dot to dot lines develops pencil grip, hand-eye coordination, and the muscle control children need for handwriting.
          - generic [ref=f1e527]:
            - heading "Reinforces number recognition" [level=3] [ref=f1e528]
            - paragraph [ref=f1e529]: Following dots 1 → 2 → 3 in sequence teaches counting order, number recognition, and early math concepts naturally through play.
          - generic [ref=f1e534]:
            - heading "Improves focus and concentration" [level=3] [ref=f1e535]
            - paragraph [ref=f1e536]: Completing a connect-the-dots puzzle requires sustained attention — a calm, screen-free way to practice focus for preschool to grade 3.
          - generic [ref=f1e541]:
            - heading "Instant reward and confidence" [level=3] [ref=f1e542]
            - paragraph [ref=f1e543]: When the hidden picture appears, kids feel an immediate sense of achievement. That small win builds a love of learning and a growth mindset.
      - region "How to download and print your free dot to dot worksheets" [ref=f1e544]:
        - generic [ref=f1e545]:
          - paragraph [ref=f1e546]: Ready in under 60 seconds
          - heading "How to download and print your free dot to dot worksheets" [level=2] [ref=f1e547]
        - list [ref=f1e548]:
          - listitem [ref=f1e549]:
            - generic [ref=f1e550]:
              - generic [ref=f1e551]: "1"
              - heading "Choose your puzzle" [level=3] [ref=f1e552]
            - paragraph [ref=f1e553]: Pick a theme (animals, dinosaurs, vehicles, holiday) and a dot range that matches your child's age and skill level.
          - listitem [ref=f1e554]:
            - generic [ref=f1e555]:
              - generic [ref=f1e556]: "2"
              - heading "Download the free PDF" [level=3] [ref=f1e557]
            - paragraph [ref=f1e558]: Click "Download free printable" — no account, no email, no paywall. Your browser downloads the PDF instantly.
          - listitem [ref=f1e559]:
            - generic [ref=f1e560]:
              - generic [ref=f1e561]: "3"
              - heading "Print and enjoy" [level=3] [ref=f1e562]
            - paragraph [ref=f1e563]: Print on standard US Letter (8.5" × 11") or A4 paper. Black and white works perfectly. After connecting the dots, children can use the finished picture as a coloring (colouring) page.
      - region "Free, safe, and ridiculously easy to use." [ref=f1e564]:
        - generic [ref=f1e565]:
          - paragraph [ref=f1e566]: Why parents and teachers choose us
          - heading "Free, safe, and ridiculously easy to use." [level=2] [ref=f1e567]
        - generic [ref=f1e568]:
          - generic [ref=f1e573]:
            - heading "No account required" [level=3] [ref=f1e574]
            - paragraph [ref=f1e575]: Every dot to dot printable downloads immediately — no sign-up, no email, no paywall. Just click and print.
          - generic [ref=f1e580]:
            - heading "Classroom safe" [level=3] [ref=f1e581]
            - paragraph [ref=f1e582]: Clean, ad-free puzzle pages designed for school printers. Works for morning work, homework, or quiet time.
          - generic [ref=f1e587]:
            - heading "Fast by design" [level=3] [ref=f1e588]
            - paragraph [ref=f1e589]: Static pages, optimized images, and local fonts mean puzzles load fast on any device — phone, tablet, or laptop.
      - region "Frequently asked questions" [ref=f1e590]:
        - generic [ref=f1e591]:
          - paragraph [ref=f1e592]: Common questions
          - heading "Frequently asked questions" [level=2] [ref=f1e593]
        - generic [ref=f1e594]:
          - group [ref=f1e595]:
            - generic "Are all dot to dot printables on DotToDotFreePrintables.com free?" [ref=f1e596] [cursor=pointer]
          - group [ref=f1e599]:
            - generic "What is a dot to dot puzzle?" [ref=f1e600] [cursor=pointer]
          - group [ref=f1e603]:
            - generic "What ages are dot to dot worksheets suitable for?" [ref=f1e604] [cursor=pointer]
          - group [ref=f1e607]:
            - generic "What format do the puzzles download in?" [ref=f1e608] [cursor=pointer]
          - group [ref=f1e611]:
            - generic "Do I need to create an account to download puzzles?" [ref=f1e612] [cursor=pointer]
          - group [ref=f1e615]:
            - generic "Can teachers use these worksheets in the classroom?" [ref=f1e616] [cursor=pointer]
          - group [ref=f1e619]:
            - generic "Do dot to dot puzzles help children learn?" [ref=f1e620] [cursor=pointer]
          - group [ref=f1e623]:
            - generic "Are dot to dot puzzles good for fine motor skills?" [ref=f1e624] [cursor=pointer]
          - group [ref=f1e627]:
            - generic "What puzzle categories does the site offer?" [ref=f1e628] [cursor=pointer]
          - group [ref=f1e631]:
            - generic "How do I print a dot to dot worksheet?" [ref=f1e632] [cursor=pointer]
          - group [ref=f1e635]:
            - generic "Are the puzzles available in other languages?" [ref=f1e636] [cursor=pointer]
          - group [ref=f1e639]:
            - generic "Are these puzzles a good screen-free activity?" [ref=f1e640] [cursor=pointer]
          - group [ref=f1e643]:
            - generic "Are dot to dot puzzles suitable for color blind kids and adults?" [ref=f1e644] [cursor=pointer]
          - group [ref=f1e647]:
            - generic "Can I use the printables for commercial purposes?" [ref=f1e648] [cursor=pointer]
          - group [ref=f1e651]:
            - generic "How do I choose the right dot count for my child?" [ref=f1e652] [cursor=pointer]
          - group [ref=f1e655]:
            - generic "Do the puzzles include fun facts?" [ref=f1e656] [cursor=pointer]
          - group [ref=f1e659]:
            - generic "Can I print the same puzzle more than once?" [ref=f1e660] [cursor=pointer]
          - group [ref=f1e663]:
            - generic "What paper should I print dot to dot puzzles on?" [ref=f1e664] [cursor=pointer]
          - group [ref=f1e667]:
            - generic "What is new on the site in 2026?" [ref=f1e668] [cursor=pointer]
      - region [ref=f1e671]:
        - generic [ref=f1e672]:
          - generic [ref=f1e673]:
            - paragraph [ref=f1e674]: Ideas for grown-ups
            - heading "Learning tips for home and classroom" [level=2] [ref=f1e675]
          - link "View all articles" [ref=f1e676] [cursor=pointer]:
            - /url: /en/blog/
        - generic [ref=f1e677]:
          - article [ref=f1e678]:
            - generic [ref=f1e679]:
              - generic [ref=f1e680]: Guides
              - generic [ref=f1e681]: 7 min read
            - heading [level=3] [ref=f1e682]:
              - 'link "Best Free Dot to Dot Printables by Age: Top Picks for 2–12 Year Olds" [ref=f1e683] [cursor=pointer]':
                - /url: /en/blog/best-free-dot-to-dot-printables-by-age/
            - paragraph [ref=f1e684]: "The best free dot to dot printables for every age, chosen by dot count: easy 24–40 dot puzzles for preschoolers, 40–70 dots for ages 5–8, and 100+ dot challenges for older kids."
            - generic [ref=f1e685]:
              - time [ref=f1e686]: July 19, 2026
              - 'link "Read Best Free Dot to Dot Printables by Age: Top Picks for 2–12 Year Olds" [ref=f1e687] [cursor=pointer]':
                - /url: /en/blog/best-free-dot-to-dot-printables-by-age/
                - text: Read
          - article [ref=f1e690]:
            - generic [ref=f1e691]:
              - generic [ref=f1e692]: Learning
              - generic [ref=f1e693]: 6 min read
            - heading [level=3] [ref=f1e694]:
              - 'link "Dot to Dot vs. Mazes vs. Tracing Worksheets: Which Is Best for Your Child in 2026?" [ref=f1e695] [cursor=pointer]':
                - /url: /en/blog/dot-to-dot-vs-mazes-vs-tracing-worksheets/
            - paragraph [ref=f1e696]: Dot to dot puzzles teach counting plus pencil control, mazes build planning and problem-solving, and tracing directly rehearses letter shapes. Here is how the three compare and when to use each.
            - generic [ref=f1e697]:
              - time [ref=f1e698]: July 19, 2026
              - 'link "Read Dot to Dot vs. Mazes vs. Tracing Worksheets: Which Is Best for Your Child in 2026?" [ref=f1e699] [cursor=pointer]':
                - /url: /en/blog/dot-to-dot-vs-mazes-vs-tracing-worksheets/
                - text: Read
          - article [ref=f1e702]:
            - generic [ref=f1e703]:
              - generic [ref=f1e704]: Learning
              - generic [ref=f1e705]: 6 min read
            - heading [level=3] [ref=f1e706]:
              - 'link "Dot to Dot Puzzles: Facts, Benefits and Statistics Parents and Teachers Should Know in 2026" [ref=f1e707] [cursor=pointer]':
                - /url: /en/blog/dot-to-dot-puzzle-facts-and-statistics/
            - paragraph [ref=f1e708]: "Key facts about dot to dot puzzles: they train 3 skills per dot, suit ages 2–12 by dot count, support the roughly 1 in 12 boys with color blindness, and date back to 19th-century drawing exercises."
            - generic [ref=f1e709]:
              - time [ref=f1e710]: July 19, 2026
              - 'link "Read Dot to Dot Puzzles: Facts, Benefits and Statistics Parents and Teachers Should Know in 2026" [ref=f1e711] [cursor=pointer]':
                - /url: /en/blog/dot-to-dot-puzzle-facts-and-statistics/
                - text: Read
      - region "Send feedback" [ref=f1e714]:
        - generic [ref=f1e715]:
          - paragraph [ref=f1e716]: We'd love to hear from you
          - heading "Send feedback" [level=2] [ref=f1e717]
          - paragraph [ref=f1e718]: Have a puzzle idea, spotted a broken link, or just want to say hi? Drop us a note below.
        - alert [ref=f1e720]: This feedback form is not connected yet.
      - region "For kids, For parents, For teachers" [ref=f1e721]:
        - article [ref=f1e722]:
          - heading "For kids" [level=2] [ref=f1e725]
          - paragraph [ref=f1e726]: Friendly animal, dinosaur, and vehicle themes with clear numbered dots. Easy wins that build real confidence.
        - article [ref=f1e727]:
          - heading "For parents" [level=2] [ref=f1e733]
          - paragraph [ref=f1e734]: Screen-free quiet-time activities for home, travel, and restaurants. Print from any device in under a minute.
        - article [ref=f1e735]:
          - heading "For teachers" [level=2] [ref=f1e739]
          - paragraph [ref=f1e740]: Low-prep connect-the-dots for morning work, early finishers, subs, and classroom stations — no prep required.
  - generic "Share me" [ref=f1e741]:
    - generic [ref=f1e742]:
      - link "Share — WhatsApp" [ref=f1e743] [cursor=pointer]:
        - /url: https://wa.me/?text=Free%20Dot%20to%20Dot%20Printables%20for%20Kids%20%7C%20Connect%20the%20Dots%20Worksheets%20PDF%20https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2F
      - link "Share — Facebook" [ref=f1e746] [cursor=pointer]:
        - /url: https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2F
      - link "Share — Pinterest" [ref=f1e749] [cursor=pointer]:
        - /url: https://pinterest.com/pin/create/button/?url=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2F&description=Free%20Dot%20to%20Dot%20Printables%20for%20Kids%20%7C%20Connect%20the%20Dots%20Worksheets%20PDF
      - link "Share — X" [ref=f1e752] [cursor=pointer]:
        - /url: https://twitter.com/intent/tweet?url=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2F&text=Free%20Dot%20to%20Dot%20Printables%20for%20Kids%20%7C%20Connect%20the%20Dots%20Worksheets%20PDF
      - button "Copy link" [ref=f1e755] [cursor=pointer]
  - contentinfo [ref=f1e759]:
    - generic [ref=f1e760]: DotToDotFreePrintables.com
    - paragraph [ref=f1e766]: Free dot to dot printables and connect-the-dots worksheets for kids, parents, and teachers in the US, UK, Canada, and Australia. All puzzles are free to download, print, and share.
    - navigation "Free dot to dot printables and connect-the-dots worksheets for kids, parents, and teachers in the US, UK, Canada, and Australia. All puzzles are free to download, print, and share." [ref=f1e767]:
      - link "Blog" [ref=f1e768] [cursor=pointer]:
        - /url: /en/blog/
      - link "FAQ" [ref=f1e769] [cursor=pointer]:
        - /url: /en/#faq
      - link "Feedback" [ref=f1e770] [cursor=pointer]:
        - /url: /en/#feedback
      - link "About" [ref=f1e771] [cursor=pointer]:
        - /url: /en/about/
      - link "Contact" [ref=f1e772] [cursor=pointer]:
        - /url: /en/contact/
      - link "Privacy" [ref=f1e773] [cursor=pointer]:
        - /url: /en/privacy-policy/
      - link "Terms" [ref=f1e774] [cursor=pointer]:
        - /url: /en/terms/
      - link "Dot to Dot Puzzle Pack" [ref=f1e775] [cursor=pointer]:
        - /url: /en/premium/
      - link "Sitemap" [ref=f1e776] [cursor=pointer]:
        - /url: /sitemap.xml
    - generic "Free dot to dot printables and connect-the-dots worksheets for kids, parents, and teachers in the US, UK, Canada, and Australia. All puzzles are free to download, print, and share." [ref=f1e777]:
      - link "YouTube" [ref=f1e778] [cursor=pointer]:
        - /url: https://www.youtube.com/@dottodotfreeprintables_com
      - link "Pinterest" [ref=f1e782] [cursor=pointer]:
        - /url: https://www.pinterest.com/hellokidsbookworld/
    - paragraph [ref=f1e785]: © 2026 DotToDotFreePrintables.com · Free printable activities for children - v1.0.0
```

# Test source

```ts
  225 |           expect(href, `hreflang ${hreflang} missing on ${url}`).not.toBeNull();
  226 |           expect(new URL(href!, page.url()).pathname).toBe(expectedPath);
  227 |         }
  228 | 
  229 |         const defaultHref = await page.locator('link[rel="alternate"][hreflang="x-default"]').getAttribute('href');
  230 |         expect(defaultHref, `x-default hreflang missing on ${url}`).not.toBeNull();
  231 |         expect(new URL(defaultHref!, page.url()).pathname).toBe(
  232 |           withTrailingSlash(normalizedPath === '/' ? `/${sourceLocale}/` : `/${sourceLocale}${normalizedPath}`)
  233 |         );
  234 |       });
  235 | 
  236 |       test(`${name}: matches visual baseline`, async ({ page }) => {
  237 |         test.skip(!runVisualBaselines, 'Set I18N_VISUAL_BASELINE=1 to run screenshot baseline checks.');
  238 |         await page.addInitScript(() => {
  239 |           const originalSetInterval = window.setInterval;
  240 |           window.setInterval = ((handler: TimerHandler, timeout?: number, ...args: unknown[]) => {
  241 |             if (timeout === 4000) return 0;
  242 |             return originalSetInterval(handler, timeout, ...args);
  243 |           }) as typeof window.setInterval;
  244 |         });
  245 |         await page.goto(url);
  246 |         await page.waitForLoadState('networkidle');
  247 |         await page.waitForTimeout(500);
  248 |         await expect(page).toHaveScreenshot(`${name}-${locale}.png`, {
  249 |           fullPage: true,
  250 |           mask: [
  251 |             page.locator('[aria-label="Featured USA 250 printable preview"]')
  252 |           ],
  253 |           timeout: 15_000
  254 |         });
  255 |       });
  256 |     }
  257 |   });
  258 | 
  259 |   if (locale !== sourceLocale && translatedLocales.includes(locale)) {
  260 |     test.describe(`${locale} — English leakage`, () => {
  261 |       for (const { name, path: pagePath } of keyPages) {
  262 |         test(`${name}: no untranslated English marker strings visible`, async ({ page }) => {
  263 |           await page.goto(`/${locale}${pagePath}/`);
  264 |           const bodyText = await page.evaluate(() => document.body.innerText);
  265 | 
  266 |           for (const marker of englishMarkers) {
  267 |             expect(bodyText, `found English string "${marker}" on /${locale}${pagePath}/`).not.toContain(marker);
  268 |           }
  269 |         });
  270 |       }
  271 |     });
  272 |   }
  273 | }
  274 | 
  275 | test.describe('Arabic regional alias hreflang cluster', () => {
  276 |   const pages = [
  277 |     { locale: 'ar', url: '/ar/' },
  278 |     { locale: 'ar-AE', url: '/ar-AE/' },
  279 |     { locale: 'ar-SA', url: '/ar-SA/' },
  280 |     { locale: 'ar-QA', url: '/ar-QA/' }
  281 |   ];
  282 | 
  283 |   const expectedArabicAlternates = {
  284 |     ar: '/ar/',
  285 |     'ar-AE': '/ar-AE/',
  286 |     'ar-SA': '/ar-SA/',
  287 |     'ar-QA': '/ar-QA/'
  288 |   };
  289 | 
  290 |   test('home pages are self-canonical, RTL, and share identical alternates', async ({ page }) => {
  291 |     let baseline: Record<string, string> | null = null;
  292 | 
  293 |     for (const { locale, url } of pages) {
  294 |       await page.goto(url, { waitUntil: 'domcontentloaded' });
  295 | 
  296 |       await expect(page.locator('html'), `${url} html lang`).toHaveAttribute('lang', locale);
  297 |       await expect(page.locator('html'), `${url} html dir`).toHaveAttribute('dir', 'rtl');
  298 | 
  299 |       const canonicalHref = await page.locator('link[rel="canonical"]').getAttribute('href');
  300 |       expect(canonicalHref, `${url} canonical link missing`).not.toBeNull();
  301 |       expect(new URL(canonicalHref!, page.url()).pathname).toBe(url);
  302 | 
  303 |       const alternates = await alternateMap(page);
  304 | 
  305 |       for (const [hreflang, expectedPath] of Object.entries(expectedArabicAlternates)) {
  306 |         expect(alternates[hreflang], `${url} ${hreflang} alternate`).toBe(expectedPath);
  307 |       }
  308 | 
  309 |       if (!baseline) {
  310 |         baseline = alternates;
  311 |       } else {
  312 |         expect(alternates, `${url} hreflang cluster differs from /ar/`).toEqual(baseline);
  313 |       }
  314 |     }
  315 |   });
  316 | 
  317 |   test('nested pages preserve the same Arabic path in every regional alternate', async ({ page }) => {
  318 |     const suffix = 'blog/benefits-of-dot-to-dot-puzzles-for-kids/';
  319 | 
  320 |     for (const { locale, url } of pages) {
  321 |       await page.goto(`${url}${suffix}`, { waitUntil: 'domcontentloaded' });
  322 | 
  323 |       const canonicalHref = await page.locator('link[rel="canonical"]').getAttribute('href');
  324 |       expect(canonicalHref, `${locale} nested canonical link missing`).not.toBeNull();
> 325 |       expect(new URL(canonicalHref!, page.url()).pathname).toBe(`/${locale}/${suffix}`);
      |                                                            ^ Error: expect(received).toBe(expected) // Object.is equality
  326 | 
  327 |       const alternates = await alternateMap(page);
  328 | 
  329 |       for (const hreflang of arabicLocales) {
  330 |         expect(alternates[hreflang], `${locale} nested ${hreflang} alternate`).toBe(`/${hreflang}/${suffix}`);
  331 |       }
  332 |     }
  333 |   });
  334 | });
  335 | 
  336 | for (const locale of allPagesAlignmentLocales) {
  337 |   test.describe(`${locale} all pages alignment`, () => {
  338 |     for (const route of allPagesAlignmentRoutes[locale]) {
  339 |       test(`${route}: no overflow or clipped primary UI`, async ({ page }) => {
  340 |         await page.goto(route);
  341 | 
  342 |         await expect(page.locator('header.site-header nav.nav-shell')).toBeVisible();
  343 |         await expect(page.locator('main')).toBeVisible();
  344 |         await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  345 |         await expect(page.locator('html')).toHaveAttribute('lang', htmlLangByLocale[locale] ?? locale);
  346 | 
  347 |         const layout = await page.evaluate(() => {
  348 |           const viewportWidth = document.documentElement.clientWidth;
  349 |           const documentOverflow = document.documentElement.scrollWidth - viewportWidth;
  350 |           const visibleElements = Array.from(document.body.querySelectorAll<HTMLElement>('*'))
  351 |             .filter((element) => {
  352 |               const style = window.getComputedStyle(element);
  353 |               const rect = element.getBoundingClientRect();
  354 |               return (
  355 |                 style.visibility !== 'hidden' &&
  356 |                 style.display !== 'none' &&
  357 |                 rect.width > 0 &&
  358 |                 rect.height > 0 &&
  359 |                 !element.closest('.hero-slider-track') &&
  360 |                 !element.closest('.form-honeypot') &&
  361 |                 !element.closest('.category-menu-bar') &&
  362 |                 !element.closest('.lang-switcher')
  363 |               );
  364 |             });
  365 | 
  366 |           const horizontalOverflows = visibleElements
  367 |             .map((element) => {
  368 |               const rect = element.getBoundingClientRect();
  369 |               return {
  370 |                 tag: element.tagName.toLowerCase(),
  371 |                 className: String(element.className || ''),
  372 |                 text: (element.innerText || element.getAttribute('aria-label') || '').trim().slice(0, 80),
  373 |                 left: Math.round(rect.left),
  374 |                 right: Math.round(rect.right),
  375 |                 width: Math.round(rect.width)
  376 |               };
  377 |             })
  378 |             .filter((item) => item.left < -1 || item.right > viewportWidth + 1);
  379 | 
  380 |           const clippedControls = visibleElements
  381 |             .filter((element) => {
  382 |               const tagName = element.tagName.toLowerCase();
  383 |               const role = element.getAttribute('role');
  384 |               const className = String(element.className || '');
  385 |               return (
  386 |                 (tagName === 'button' || role === 'button' || element.classList.contains('btn') || className.includes('button')) &&
  387 |                 !element.classList.contains('icon-tooltip') &&
  388 |                 !element.closest('.category-card')
  389 |               );
  390 |             })
  391 |             .filter((element) => element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1)
  392 |             .map((element) => ({
  393 |               tag: element.tagName.toLowerCase(),
  394 |               className: String(element.className || ''),
  395 |               text: (element.innerText || element.getAttribute('aria-label') || '').trim().slice(0, 80),
  396 |               scrollWidth: element.scrollWidth,
  397 |               clientWidth: element.clientWidth,
  398 |               scrollHeight: element.scrollHeight,
  399 |               clientHeight: element.clientHeight
  400 |             }));
  401 | 
  402 |           return { documentOverflow, horizontalOverflows, clippedControls };
  403 |         });
  404 | 
  405 |         expect(layout.documentOverflow, `${route} document should not overflow horizontally`).toBeLessThanOrEqual(1);
  406 |         expect(layout.horizontalOverflows, `${route} elements outside viewport`).toEqual([]);
  407 |         expect(layout.clippedControls, `${route} clipped links/buttons`).toEqual([]);
  408 |       });
  409 |     }
  410 |   });
  411 | }
  412 | 
```