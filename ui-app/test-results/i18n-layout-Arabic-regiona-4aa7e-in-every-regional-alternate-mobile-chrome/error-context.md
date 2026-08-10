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
  - alert [ref=f1e2]
  - link "Skip to main content" [ref=f1e3] [cursor=pointer]:
    - /url: "#main-content"
  - banner [ref=f1e4]:
    - navigation "Browse dot to dot puzzles by category" [ref=f1e5]:
      - link "DotToDotFreePrintables — Home" [ref=f1e6] [cursor=pointer]:
        - /url: /en/
        - text: DotToDotFreePrintables
      - link "Home" [ref=f1e11] [cursor=pointer]:
        - /url: /en/
      - button "Open categories menu" [ref=f1e15] [cursor=pointer]
    - img [ref=f1e18]:
      - generic [ref=f1e19]: "1"
      - generic [ref=f1e21]: "2"
      - generic [ref=f1e23]: "3"
      - generic [ref=f1e25]: "4"
      - generic [ref=f1e27]: "5"
      - generic [ref=f1e29]: "6"
      - generic [ref=f1e31]: "7"
  - main [active] [ref=f1e33]:
    - generic [ref=f1e34]:
      - region [ref=f1e35]:
        - heading "Find the perfect dot to dot printables" [level=1] [ref=f1e36]
        - paragraph [ref=f1e37]: Print, connect the dots, and bring amazing pictures to life. Free and ready for fun!
        - search [ref=f1e38]:
          - textbox "Search puzzles" [ref=f1e42]:
            - /placeholder: Try ocean, dinosaur, or flowers
          - button "Search" [ref=f1e43] [cursor=pointer]
        - generic "Filter puzzles" [ref=f1e47]:
          - button "Easy 1–20 Dots" [ref=f1e48] [cursor=pointer]:
            - generic [ref=f1e51]:
              - strong [ref=f1e52]: Easy
              - generic [ref=f1e53]: 1–20 Dots
          - button "Medium 21–60 Dots" [ref=f1e54] [cursor=pointer]:
            - generic [ref=f1e57]:
              - strong [ref=f1e58]: Medium
              - generic [ref=f1e59]: 21–60 Dots
          - button "Hard 61+ Dots" [ref=f1e60] [cursor=pointer]:
            - generic [ref=f1e63]:
              - strong [ref=f1e64]: Hard
              - generic [ref=f1e65]: 61+ Dots
          - button "Age 4–6" [ref=f1e66] [cursor=pointer]:
            - generic [ref=f1e70]:
              - strong [ref=f1e71]: Age
              - generic [ref=f1e72]: 4–6
          - button "Age 7–9" [ref=f1e73] [cursor=pointer]:
            - generic [ref=f1e77]:
              - strong [ref=f1e78]: Age
              - generic [ref=f1e79]: 7–9
          - button "Age 9–12" [ref=f1e80] [cursor=pointer]:
            - generic [ref=f1e84]:
              - strong [ref=f1e85]: Age
              - generic [ref=f1e86]: 9–12
      - generic [ref=f1e87]: 8 puzzles found
      - region "Featured printable puzzles" [ref=f1e93]:
        - article [ref=f1e94]:
          - button "Save T-Rex 61-Dot Challenge" [ref=f1e95] [cursor=pointer]
          - link [ref=f1e98] [cursor=pointer]:
            - /url: /en/dinosaurs/trex-61-dot-to-dot-puzzle/
            - img "T-Rex 61-Dot Challenge dot to dot printable" [ref=f1e99]
          - heading [level=2] [ref=f1e100]:
            - link "T-Rex 61-Dot Challenge" [ref=f1e101] [cursor=pointer]:
              - /url: /en/dinosaurs/trex-61-dot-to-dot-puzzle/
          - generic [ref=f1e102]:
            - generic [ref=f1e103]: Medium · 1–61 dots
            - generic [ref=f1e105]: 1.9k downloads
          - link "Download free printable" [ref=f1e109] [cursor=pointer]:
            - /url: /en/dinosaurs/trex-61-dot-to-dot-puzzle/
        - article [ref=f1e110]:
          - button "Save Mermaid" [ref=f1e111] [cursor=pointer]
          - link [ref=f1e114] [cursor=pointer]:
            - /url: /en/ocean/mermaid-dot-to-dot-puzzle/
            - img "Mermaid dot to dot printable" [ref=f1e115]
          - heading [level=2] [ref=f1e116]:
            - link "Mermaid" [ref=f1e117] [cursor=pointer]:
              - /url: /en/ocean/mermaid-dot-to-dot-puzzle/
          - generic [ref=f1e118]:
            - generic [ref=f1e119]: Easy · 1–54 dots
            - generic [ref=f1e121]: 2.2k downloads
          - link "Download free printable" [ref=f1e125] [cursor=pointer]:
            - /url: /en/ocean/mermaid-dot-to-dot-puzzle/
        - article [ref=f1e126]:
          - button "Save Jellyfish" [ref=f1e127] [cursor=pointer]
          - link [ref=f1e130] [cursor=pointer]:
            - /url: /en/ocean/jellyfish-dot-to-dot-puzzle/
            - img "Jellyfish dot to dot printable" [ref=f1e131]
          - heading [level=2] [ref=f1e132]:
            - link "Jellyfish" [ref=f1e133] [cursor=pointer]:
              - /url: /en/ocean/jellyfish-dot-to-dot-puzzle/
          - generic [ref=f1e134]:
            - generic [ref=f1e135]: Medium · 1–88 dots
            - generic [ref=f1e137]: 2.5k downloads
          - link "Download free printable" [ref=f1e141] [cursor=pointer]:
            - /url: /en/ocean/jellyfish-dot-to-dot-puzzle/
        - article [ref=f1e142]:
          - button "Save Cute Puppy" [ref=f1e143] [cursor=pointer]
          - link [ref=f1e146] [cursor=pointer]:
            - /url: /en/cute/cute-puppy-dot-to-dot-puzzle/
            - img "Cute Puppy dot to dot printable" [ref=f1e147]
          - heading [level=2] [ref=f1e148]:
            - link "Cute Puppy" [ref=f1e149] [cursor=pointer]:
              - /url: /en/cute/cute-puppy-dot-to-dot-puzzle/
          - generic [ref=f1e150]:
            - generic [ref=f1e151]: Medium · 1–70 dots
            - generic [ref=f1e153]: 2.8k downloads
          - link "Download free printable" [ref=f1e157] [cursor=pointer]:
            - /url: /en/cute/cute-puppy-dot-to-dot-puzzle/
        - article [ref=f1e158]:
          - button "Save Slide Playground" [ref=f1e159] [cursor=pointer]
          - link [ref=f1e162] [cursor=pointer]:
            - /url: /en/playgrounds/slide-playgrounds-dot-to-dot-puzzle/
            - img "Slide Playground dot to dot printable" [ref=f1e163]
          - heading [level=2] [ref=f1e164]:
            - link "Slide Playground" [ref=f1e165] [cursor=pointer]:
              - /url: /en/playgrounds/slide-playgrounds-dot-to-dot-puzzle/
          - generic [ref=f1e166]:
            - generic [ref=f1e167]: Medium · 1–102 dots
            - generic [ref=f1e169]: 3.1k downloads
          - link "Download free printable" [ref=f1e173] [cursor=pointer]:
            - /url: /en/playgrounds/slide-playgrounds-dot-to-dot-puzzle/
        - article [ref=f1e174]:
          - button "Save Snowdrop Flower" [ref=f1e175] [cursor=pointer]
          - link [ref=f1e178] [cursor=pointer]:
            - /url: /en/flowers/snowdrop-flower-dot-to-dot-puzzle/
            - img "Snowdrop Flower dot to dot printable" [ref=f1e179]
          - heading [level=2] [ref=f1e180]:
            - link "Snowdrop Flower" [ref=f1e181] [cursor=pointer]:
              - /url: /en/flowers/snowdrop-flower-dot-to-dot-puzzle/
          - generic [ref=f1e182]:
            - generic [ref=f1e183]: Hard · 1–145 dots
            - generic [ref=f1e185]: 1.9k downloads
          - link "Download free printable" [ref=f1e189] [cursor=pointer]:
            - /url: /en/flowers/snowdrop-flower-dot-to-dot-puzzle/
        - article [ref=f1e190]:
          - button "Save Dashing Car Playground" [ref=f1e191] [cursor=pointer]
          - link [ref=f1e194] [cursor=pointer]:
            - /url: /en/playgrounds/dashing-car-playground-dot-to-dot-puzzle/
            - img "Dashing Car Playground dot to dot printable" [ref=f1e195]
          - heading [level=2] [ref=f1e196]:
            - link "Dashing Car Playground" [ref=f1e197] [cursor=pointer]:
              - /url: /en/playgrounds/dashing-car-playground-dot-to-dot-puzzle/
          - generic [ref=f1e198]:
            - generic [ref=f1e199]: Easy · 1–48 dots
            - generic [ref=f1e201]: 2.2k downloads
          - link "Download free printable" [ref=f1e205] [cursor=pointer]:
            - /url: /en/playgrounds/dashing-car-playground-dot-to-dot-puzzle/
        - article [ref=f1e206]:
          - button "Save Lotus Flower" [ref=f1e207] [cursor=pointer]
          - link [ref=f1e210] [cursor=pointer]:
            - /url: /en/flowers/lotus-flower-dot-to-dot-puzzle/
            - img "Lotus Flower dot to dot printable" [ref=f1e211]
          - heading [level=2] [ref=f1e212]:
            - link "Lotus Flower" [ref=f1e213] [cursor=pointer]:
              - /url: /en/flowers/lotus-flower-dot-to-dot-puzzle/
          - generic [ref=f1e214]:
            - generic [ref=f1e215]: Easy · 1–46 dots
            - generic [ref=f1e217]: 2.5k downloads
          - link "Download free printable" [ref=f1e221] [cursor=pointer]:
            - /url: /en/flowers/lotus-flower-dot-to-dot-puzzle/
      - generic [ref=f1e222]:
        - generic [ref=f1e223]:
          - heading "Best of 2026 · 25 Dot to Dot Puzzles" [level=2] [ref=f1e224]
          - paragraph [ref=f1e225]:
            - text: Our favorite dot-to-dots in one printable PDF book.
            - deletion [ref=f1e226]: $9.00
            - text: $5.00
        - link "View book" [ref=f1e227] [cursor=pointer]:
          - /url: /en/premium/
    - generic [ref=f1e231]:
      - region [ref=f1e232]:
        - generic [ref=f1e233]:
          - paragraph [ref=f1e234]: Video
          - heading "Watch dot to dot fun in action" [level=2] [ref=f1e235]
        - generic [ref=f1e236]:
          - button "Watch dot to dot fun in action" [ref=f1e238] [cursor=pointer]:
            - img "Watch dot to dot fun in action" [ref=f1e239]
          - paragraph [ref=f1e244]:
            - generic [ref=f1e245]: "Download free printable:"
            - link "Mermaid" [ref=f1e246] [cursor=pointer]:
              - /url: /ocean/mermaid-dot-to-dot-printable.pdf
      - region [ref=f1e250]:
        - generic [ref=f1e251]:
          - generic [ref=f1e252]:
            - generic [ref=f1e257]:
              - paragraph [ref=f1e258]: Popular this week
              - heading "Most downloaded puzzles" [level=2] [ref=f1e259]
            - list [ref=f1e260]:
              - listitem [ref=f1e261]:
                - generic [ref=f1e262]: "1"
                - link "T-Rex 61-Dot Challenge" [ref=f1e263] [cursor=pointer]:
                  - /url: /en/dinosaurs/trex-61-dot-to-dot-puzzle/
                - generic "23 or more downloads" [ref=f1e264]: 23+
              - listitem [ref=f1e268]:
                - generic [ref=f1e269]: "2"
                - link "Mermaid" [ref=f1e270] [cursor=pointer]:
                  - /url: /en/ocean/mermaid-dot-to-dot-puzzle/
                - generic "20 or more downloads" [ref=f1e271]: 20+
              - listitem [ref=f1e275]:
                - generic [ref=f1e276]: "3"
                - link "Jellyfish" [ref=f1e277] [cursor=pointer]:
                  - /url: /en/ocean/jellyfish-dot-to-dot-puzzle/
                - generic "10 or more downloads" [ref=f1e278]: 10+
              - listitem [ref=f1e282]:
                - generic [ref=f1e283]: "4"
                - link "Cute Puppy" [ref=f1e284] [cursor=pointer]:
                  - /url: /en/cute/cute-puppy-dot-to-dot-puzzle/
                - generic "9 or more downloads" [ref=f1e285]: 9+
              - listitem [ref=f1e289]:
                - generic [ref=f1e290]: "5"
                - link "Spring Horse" [ref=f1e291] [cursor=pointer]:
                  - /url: /en/playgrounds/spring-horse-playground-dot-to-dot-puzzle/
                - generic "7 or more downloads" [ref=f1e292]: 7+
              - listitem [ref=f1e296]:
                - generic [ref=f1e297]: "6"
                - link "Spinosaurus" [ref=f1e298] [cursor=pointer]:
                  - /url: /en/dinosaurs/spinosaurus/
                - generic "7 or more downloads" [ref=f1e299]: 7+
              - listitem [ref=f1e303]:
                - generic [ref=f1e304]: "7"
                - link "Snowdrop Flower" [ref=f1e305] [cursor=pointer]:
                  - /url: /en/flowers/snowdrop-flower-dot-to-dot-puzzle/
                - generic "7 or more downloads" [ref=f1e306]: 7+
              - listitem [ref=f1e310]:
                - generic [ref=f1e311]: "8"
                - link "Slide Playground" [ref=f1e312] [cursor=pointer]:
                  - /url: /en/playgrounds/slide-playgrounds-dot-to-dot-puzzle/
                - generic "6 or more downloads" [ref=f1e313]: 6+
          - generic [ref=f1e317]:
            - generic [ref=f1e322]:
              - paragraph [ref=f1e323]: Fresh printables
              - heading "Recently added" [level=3] [ref=f1e324]
            - list [ref=f1e325]:
              - listitem [ref=f1e326]:
                - generic [ref=f1e327]: "1"
                - link "Circus Ringmaster Bear" [ref=f1e328] [cursor=pointer]:
                  - /url: /en/circus/circus-ringmaster-bear-dot-to-dot-puzzle/
                - generic [ref=f1e329]: New
              - listitem [ref=f1e330]:
                - generic [ref=f1e331]: "2"
                - link "Circus Tent" [ref=f1e332] [cursor=pointer]:
                  - /url: /en/circus/circus-tent-dot-to-dot-puzzle/
                - generic [ref=f1e333]: New
              - listitem [ref=f1e334]:
                - generic [ref=f1e335]: "3"
                - link "Space Rover" [ref=f1e336] [cursor=pointer]:
                  - /url: /en/space/space-rover-dot-to-dot-puzzle/
                - generic [ref=f1e337]: New
              - listitem [ref=f1e338]:
                - generic [ref=f1e339]: "4"
                - link "Ringed Planet" [ref=f1e340] [cursor=pointer]:
                  - /url: /en/space/ringed-planet-dot-to-dot-puzzle/
                - generic [ref=f1e341]: New
      - generic [ref=f1e342]:
        - generic [ref=f1e343]:
          - paragraph [ref=f1e344]: Organized by theme and skill level
          - heading "Browse dot to dot puzzles by category" [level=2] [ref=f1e345]
          - paragraph [ref=f1e346]: From simple 38-dot shapes for beginners to 130+ dot challenges for older kids — sorted by category so you find the right free printable in seconds.
        - generic [ref=f1e347]:
          - link "New! America 250 Years Celebrate America's 250th birthday with patriotic dot to dot puzzles honoring American history." [ref=f1e348] [cursor=pointer]:
            - /url: /en/usa-250/
            - generic [ref=f1e349]: New!
            - generic [ref=f1e350]:
              - heading "America 250 Years" [level=3] [ref=f1e353]
              - paragraph [ref=f1e354]: Celebrate America's 250th birthday with patriotic dot to dot puzzles honoring American history.
          - link "New! Canada Explore Canada with a polar bear, raccoon, moose, and maple leaf to connect and colour." [ref=f1e355] [cursor=pointer]:
            - /url: /en/canada/
            - generic [ref=f1e356]: New!
            - generic [ref=f1e357]:
              - heading "Canada" [level=3] [ref=f1e361]
              - paragraph [ref=f1e362]: Explore Canada with a polar bear, raccoon, moose, and maple leaf to connect and colour.
          - link "Available now! UAE Explore the United Arab Emirates! Iconic landmarks like the Burj Al Arab, ready to connect and colour." [ref=f1e363] [cursor=pointer]:
            - /url: /en/uae/
            - generic [ref=f1e364]: Available now!
            - generic [ref=f1e365]:
              - heading "UAE" [level=3] [ref=f1e368]
              - paragraph [ref=f1e369]: Explore the United Arab Emirates! Iconic landmarks like the Burj Al Arab, ready to connect and colour.
          - link "Available now! Garden Gloves, trowels, and tools for little garden helpers." [ref=f1e370] [cursor=pointer]:
            - /url: /en/garden/
            - generic [ref=f1e371]: Available now!
            - generic [ref=f1e372]:
              - heading "Garden" [level=3] [ref=f1e377]
              - paragraph [ref=f1e378]: Gloves, trowels, and tools for little garden helpers.
          - link "New! Space Planets, astronauts, and rocket adventures." [ref=f1e379] [cursor=pointer]:
            - /url: /en/space/
            - generic [ref=f1e380]: New!
            - generic [ref=f1e381]:
              - heading "Space" [level=3] [ref=f1e387]
              - paragraph [ref=f1e388]: Planets, astronauts, and rocket adventures.
          - link "New! Circus Ringmasters, big tops, and showtime fun for young learners." [ref=f1e389] [cursor=pointer]:
            - /url: /en/circus/
            - generic [ref=f1e390]: New!
            - generic [ref=f1e391]:
              - heading "Circus" [level=3] [ref=f1e398]
              - paragraph [ref=f1e399]: Ringmasters, big tops, and showtime fun for young learners.
          - link [ref=f1e400] [cursor=pointer]:
            - /url: /en/blog/
            - generic [ref=f1e401]:
              - heading "Blog" [level=3] [ref=f1e405]
              - paragraph [ref=f1e406]: Learning tips for home and classroom
      - region "Why dot to dot worksheets are great for child development" [ref=f1e407]:
        - generic [ref=f1e408]:
          - paragraph [ref=f1e409]: Backed by early childhood educators
          - heading "Why dot to dot worksheets are great for child development" [level=2] [ref=f1e410]
          - paragraph [ref=f1e411]: Connect-the-dots printables are more than just fun — they support early learning in preschool (nursery/reception), kindergarten/prep, and UK EYFS classrooms across the US, UK, Canada, and Australia.
        - generic [ref=f1e412]:
          - generic [ref=f1e419]:
            - heading "Builds fine motor skills" [level=3] [ref=f1e420]
            - paragraph [ref=f1e421]: Drawing dot to dot lines develops pencil grip, hand-eye coordination, and the muscle control children need for handwriting.
          - generic [ref=f1e433]:
            - heading "Reinforces number recognition" [level=3] [ref=f1e434]
            - paragraph [ref=f1e435]: Following dots 1 → 2 → 3 in sequence teaches counting order, number recognition, and early math concepts naturally through play.
          - generic [ref=f1e440]:
            - heading "Improves focus and concentration" [level=3] [ref=f1e441]
            - paragraph [ref=f1e442]: Completing a connect-the-dots puzzle requires sustained attention — a calm, screen-free way to practice focus for preschool to grade 3.
          - generic [ref=f1e447]:
            - heading "Instant reward and confidence" [level=3] [ref=f1e448]
            - paragraph [ref=f1e449]: When the hidden picture appears, kids feel an immediate sense of achievement. That small win builds a love of learning and a growth mindset.
      - region "How to download and print your free dot to dot worksheets" [ref=f1e450]:
        - generic [ref=f1e451]:
          - paragraph [ref=f1e452]: Ready in under 60 seconds
          - heading "How to download and print your free dot to dot worksheets" [level=2] [ref=f1e453]
        - list [ref=f1e454]:
          - listitem [ref=f1e455]:
            - generic [ref=f1e456]:
              - generic [ref=f1e457]: "1"
              - heading "Choose your puzzle" [level=3] [ref=f1e458]
            - paragraph [ref=f1e459]: Pick a theme (animals, dinosaurs, vehicles, holiday) and a dot range that matches your child's age and skill level.
          - listitem [ref=f1e460]:
            - generic [ref=f1e461]:
              - generic [ref=f1e462]: "2"
              - heading "Download the free PDF" [level=3] [ref=f1e463]
            - paragraph [ref=f1e464]: Click "Download free printable" — no account, no email, no paywall. Your browser downloads the PDF instantly.
          - listitem [ref=f1e465]:
            - generic [ref=f1e466]:
              - generic [ref=f1e467]: "3"
              - heading "Print and enjoy" [level=3] [ref=f1e468]
            - paragraph [ref=f1e469]: Print on standard US Letter (8.5" × 11") or A4 paper. Black and white works perfectly. After connecting the dots, children can use the finished picture as a coloring (colouring) page.
      - region "Free, safe, and ridiculously easy to use." [ref=f1e470]:
        - generic [ref=f1e471]:
          - paragraph [ref=f1e472]: Why parents and teachers choose us
          - heading "Free, safe, and ridiculously easy to use." [level=2] [ref=f1e473]
        - generic [ref=f1e474]:
          - generic [ref=f1e479]:
            - heading "No account required" [level=3] [ref=f1e480]
            - paragraph [ref=f1e481]: Every dot to dot printable downloads immediately — no sign-up, no email, no paywall. Just click and print.
          - generic [ref=f1e486]:
            - heading "Classroom safe" [level=3] [ref=f1e487]
            - paragraph [ref=f1e488]: Clean, ad-free puzzle pages designed for school printers. Works for morning work, homework, or quiet time.
          - generic [ref=f1e493]:
            - heading "Fast by design" [level=3] [ref=f1e494]
            - paragraph [ref=f1e495]: Static pages, optimized images, and local fonts mean puzzles load fast on any device — phone, tablet, or laptop.
      - region "Frequently asked questions" [ref=f1e496]:
        - generic [ref=f1e497]:
          - paragraph [ref=f1e498]: Common questions
          - heading "Frequently asked questions" [level=2] [ref=f1e499]
        - generic [ref=f1e500]:
          - group [ref=f1e501]:
            - generic "Are all dot to dot printables on DotToDotFreePrintables.com free?" [ref=f1e502] [cursor=pointer]
          - group [ref=f1e505]:
            - generic "What is a dot to dot puzzle?" [ref=f1e506] [cursor=pointer]
          - group [ref=f1e509]:
            - generic "What ages are dot to dot worksheets suitable for?" [ref=f1e510] [cursor=pointer]
          - group [ref=f1e513]:
            - generic "What format do the puzzles download in?" [ref=f1e514] [cursor=pointer]
          - group [ref=f1e517]:
            - generic "Do I need to create an account to download puzzles?" [ref=f1e518] [cursor=pointer]
          - group [ref=f1e521]:
            - generic "Can teachers use these worksheets in the classroom?" [ref=f1e522] [cursor=pointer]
          - group [ref=f1e525]:
            - generic "Do dot to dot puzzles help children learn?" [ref=f1e526] [cursor=pointer]
          - group [ref=f1e529]:
            - generic "Are dot to dot puzzles good for fine motor skills?" [ref=f1e530] [cursor=pointer]
          - group [ref=f1e533]:
            - generic "What puzzle categories does the site offer?" [ref=f1e534] [cursor=pointer]
          - group [ref=f1e537]:
            - generic "How do I print a dot to dot worksheet?" [ref=f1e538] [cursor=pointer]
          - group [ref=f1e541]:
            - generic "Are the puzzles available in other languages?" [ref=f1e542] [cursor=pointer]
          - group [ref=f1e545]:
            - generic "Are these puzzles a good screen-free activity?" [ref=f1e546] [cursor=pointer]
          - group [ref=f1e549]:
            - generic "Are dot to dot puzzles suitable for color blind kids and adults?" [ref=f1e550] [cursor=pointer]
          - group [ref=f1e553]:
            - generic "Can I use the printables for commercial purposes?" [ref=f1e554] [cursor=pointer]
          - group [ref=f1e557]:
            - generic "How do I choose the right dot count for my child?" [ref=f1e558] [cursor=pointer]
          - group [ref=f1e561]:
            - generic "Do the puzzles include fun facts?" [ref=f1e562] [cursor=pointer]
          - group [ref=f1e565]:
            - generic "Can I print the same puzzle more than once?" [ref=f1e566] [cursor=pointer]
          - group [ref=f1e569]:
            - generic "What paper should I print dot to dot puzzles on?" [ref=f1e570] [cursor=pointer]
          - group [ref=f1e573]:
            - generic "What is new on the site in 2026?" [ref=f1e574] [cursor=pointer]
      - region [ref=f1e577]:
        - generic [ref=f1e578]:
          - generic [ref=f1e579]:
            - paragraph [ref=f1e580]: Ideas for grown-ups
            - heading "Learning tips for home and classroom" [level=2] [ref=f1e581]
          - link "View all articles" [ref=f1e582] [cursor=pointer]:
            - /url: /en/blog/
        - generic [ref=f1e583]:
          - article [ref=f1e584]:
            - generic [ref=f1e585]:
              - generic [ref=f1e586]: Guides
              - generic [ref=f1e587]: 7 min read
            - heading [level=3] [ref=f1e588]:
              - 'link "Best Free Dot to Dot Printables by Age: Top Picks for 2–12 Year Olds" [ref=f1e589] [cursor=pointer]':
                - /url: /en/blog/best-free-dot-to-dot-printables-by-age/
            - paragraph [ref=f1e590]: "The best free dot to dot printables for every age, chosen by dot count: easy 24–40 dot puzzles for preschoolers, 40–70 dots for ages 5–8, and 100+ dot challenges for older kids."
            - generic [ref=f1e591]:
              - time [ref=f1e592]: July 19, 2026
              - 'link "Read Best Free Dot to Dot Printables by Age: Top Picks for 2–12 Year Olds" [ref=f1e593] [cursor=pointer]':
                - /url: /en/blog/best-free-dot-to-dot-printables-by-age/
                - text: Read
          - article [ref=f1e596]:
            - generic [ref=f1e597]:
              - generic [ref=f1e598]: Learning
              - generic [ref=f1e599]: 6 min read
            - heading [level=3] [ref=f1e600]:
              - 'link "Dot to Dot vs. Mazes vs. Tracing Worksheets: Which Is Best for Your Child in 2026?" [ref=f1e601] [cursor=pointer]':
                - /url: /en/blog/dot-to-dot-vs-mazes-vs-tracing-worksheets/
            - paragraph [ref=f1e602]: Dot to dot puzzles teach counting plus pencil control, mazes build planning and problem-solving, and tracing directly rehearses letter shapes. Here is how the three compare and when to use each.
            - generic [ref=f1e603]:
              - time [ref=f1e604]: July 19, 2026
              - 'link "Read Dot to Dot vs. Mazes vs. Tracing Worksheets: Which Is Best for Your Child in 2026?" [ref=f1e605] [cursor=pointer]':
                - /url: /en/blog/dot-to-dot-vs-mazes-vs-tracing-worksheets/
                - text: Read
          - article [ref=f1e608]:
            - generic [ref=f1e609]:
              - generic [ref=f1e610]: Learning
              - generic [ref=f1e611]: 6 min read
            - heading [level=3] [ref=f1e612]:
              - 'link "Dot to Dot Puzzles: Facts, Benefits and Statistics Parents and Teachers Should Know in 2026" [ref=f1e613] [cursor=pointer]':
                - /url: /en/blog/dot-to-dot-puzzle-facts-and-statistics/
            - paragraph [ref=f1e614]: "Key facts about dot to dot puzzles: they train 3 skills per dot, suit ages 2–12 by dot count, support the roughly 1 in 12 boys with color blindness, and date back to 19th-century drawing exercises."
            - generic [ref=f1e615]:
              - time [ref=f1e616]: July 19, 2026
              - 'link "Read Dot to Dot Puzzles: Facts, Benefits and Statistics Parents and Teachers Should Know in 2026" [ref=f1e617] [cursor=pointer]':
                - /url: /en/blog/dot-to-dot-puzzle-facts-and-statistics/
                - text: Read
      - region "Send feedback" [ref=f1e620]:
        - generic [ref=f1e621]:
          - paragraph [ref=f1e622]: We'd love to hear from you
          - heading "Send feedback" [level=2] [ref=f1e623]
          - paragraph [ref=f1e624]: Have a puzzle idea, spotted a broken link, or just want to say hi? Drop us a note below.
        - alert [ref=f1e626]: This feedback form is not connected yet.
      - region "For kids, For parents, For teachers" [ref=f1e627]:
        - article [ref=f1e628]:
          - heading "For kids" [level=2] [ref=f1e631]
          - paragraph [ref=f1e632]: Friendly animal, dinosaur, and vehicle themes with clear numbered dots. Easy wins that build real confidence.
        - article [ref=f1e633]:
          - heading "For parents" [level=2] [ref=f1e639]
          - paragraph [ref=f1e640]: Screen-free quiet-time activities for home, travel, and restaurants. Print from any device in under a minute.
        - article [ref=f1e641]:
          - heading "For teachers" [level=2] [ref=f1e645]
          - paragraph [ref=f1e646]: Low-prep connect-the-dots for morning work, early finishers, subs, and classroom stations — no prep required.
  - contentinfo [ref=f1e647]:
    - generic [ref=f1e648]: DotToDotFreePrintables.com
    - paragraph [ref=f1e654]: Free dot to dot printables and connect-the-dots worksheets for kids, parents, and teachers in the US, UK, Canada, and Australia. All puzzles are free to download, print, and share.
    - navigation "Free dot to dot printables and connect-the-dots worksheets for kids, parents, and teachers in the US, UK, Canada, and Australia. All puzzles are free to download, print, and share." [ref=f1e655]:
      - link "Blog" [ref=f1e656] [cursor=pointer]:
        - /url: /en/blog/
      - link "FAQ" [ref=f1e657] [cursor=pointer]:
        - /url: /en/#faq
      - link "Feedback" [ref=f1e658] [cursor=pointer]:
        - /url: /en/#feedback
      - link "About" [ref=f1e659] [cursor=pointer]:
        - /url: /en/about/
      - link "Contact" [ref=f1e660] [cursor=pointer]:
        - /url: /en/contact/
      - link "Privacy" [ref=f1e661] [cursor=pointer]:
        - /url: /en/privacy-policy/
      - link "Terms" [ref=f1e662] [cursor=pointer]:
        - /url: /en/terms/
      - link "Dot to Dot Puzzle Pack" [ref=f1e663] [cursor=pointer]:
        - /url: /en/premium/
      - link "Sitemap" [ref=f1e664] [cursor=pointer]:
        - /url: /sitemap.xml
    - generic "Free dot to dot printables and connect-the-dots worksheets for kids, parents, and teachers in the US, UK, Canada, and Australia. All puzzles are free to download, print, and share." [ref=f1e665]:
      - link "YouTube" [ref=f1e666] [cursor=pointer]:
        - /url: https://www.youtube.com/@dottodotfreeprintables_com
      - link "Pinterest" [ref=f1e670] [cursor=pointer]:
        - /url: https://www.pinterest.com/hellokidsbookworld/
    - paragraph [ref=f1e673]: © 2026 DotToDotFreePrintables.com · Free printable activities for children - v1.0.0
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