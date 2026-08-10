# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mobile-and-links.spec.ts >> T-Rex 61-dot puzzle page — content >> JSON-LD CreativeWork schema is present
- Location: tests\mobile-and-links.spec.ts:302:7

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
      - link "Dinosaurs" [ref=e135] [cursor=pointer]:
        - /url: /en/dinosaurs/
      - generic [ref=e136]: ›
      - generic [ref=e137]: T-Rex 61-Dot Challenge
    - generic [ref=e139]:
      - img "Mighty Tyrannosaurus Rex stomping out of 61 numbered dots, free dinosaur sheet" [ref=e142]
      - generic [ref=e143]:
        - paragraph [ref=e144]: Free Dinosaurs Printable
        - heading "T-Rex Dot to Dot — 61 Dots of Prehistoric Fun" [level=1] [ref=e145]
        - paragraph [ref=e146]: Connect 61 dots to reveal a mighty Tyrannosaurus Rex. This printable dinosaur worksheet gives confident young counters a longer number-sequencing challenge while building pencil control, focus, and fine motor skills.
        - generic [ref=e147]:
          - generic [ref=e148]: "Ages: 6-9"
          - generic [ref=e149]: "Dots: 1–61"
          - generic [ref=e150]: 100% Free
        - generic [ref=e151]:
          - paragraph [ref=e152]: Difficulty
          - generic [ref=e153]:
            - img "Difficulty 2 out of 3" [ref=e154]
            - generic [ref=e158]: Medium
        - generic [ref=e159]:
          - generic [ref=e160]: "!"
          - generic [ref=e161]:
            - strong [ref=e162]: "Fun fact:"
            - text: T-Rex could replace its teeth throughout its life, growing new ones when older teeth broke or fell out!
        - generic [ref=e164]:
          - generic "Downloaded 1023+ times" [ref=e165]:
            - generic [ref=e166]: ★
            - generic [ref=e168]:
              - strong [ref=e169]: Downloaded
              - generic [ref=e170]: 1,023+
              - generic [ref=e171]: times
              - generic [ref=e172]: You’ve made a great choice!
            - generic [ref=e173]: ✦
            - generic [ref=e174]: ✦
          - generic [ref=e175]:
            - 'link "Download (Print Size: US Letter) – Download free T-Rex 61-Dot Challenge dot-to-dot printable PDF" [ref=e176] [cursor=pointer]':
              - /url: /dinosaurs/trex-61-dot-to-dot-printable-horizontal.pdf
              - text: "Download (Print Size: US Letter)"
            - 'link "Download (Print Size: A4) – Download free T-Rex 61-Dot Challenge dot-to-dot printable PDF" [ref=e180] [cursor=pointer]':
              - /url: /dinosaurs/trex-61-dot-to-dot-printable-horizontal_A4.pdf
              - text: "Download (Print Size: A4)"
          - paragraph [ref=e184]: Free for home and classroom use.
        - group "Share" [ref=e185]:
          - link "Share — WhatsApp" [ref=e193] [cursor=pointer]:
            - /url: https://wa.me/?text=T-Rex%2061-Dot%20Challenge%20Dot-to-Dot%20Printable%20-%20Free%20PDF%20https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2Ftrex-61-dot-to-dot-puzzle%2F
          - link "Share — Facebook" [ref=e196] [cursor=pointer]:
            - /url: https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2Ftrex-61-dot-to-dot-puzzle%2F
          - link "Share — Pinterest" [ref=e199] [cursor=pointer]:
            - /url: https://pinterest.com/pin/create/button/?url=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2Ftrex-61-dot-to-dot-puzzle%2F&media=http%3A%2F%2F127.0.0.1%3A4444%2Fimages%2Ftrex-61-puzzle.webp&description=T-Rex%2061-Dot%20Challenge%20Dot-to-Dot%20Printable%20-%20Free%20PDF
          - link "Share — X" [ref=e202] [cursor=pointer]:
            - /url: https://twitter.com/intent/tweet?url=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2Ftrex-61-dot-to-dot-puzzle%2F&text=T-Rex%2061-Dot%20Challenge%20Dot-to-Dot%20Printable%20-%20Free%20PDF
          - button "Copy link" [ref=e205] [cursor=pointer]
          - status
        - paragraph [ref=e209]: No sign-up needed. Opens as a PDF. Print on US Letter (8.5 × 11 inch) or A4 paper. Free for home and classroom use.
        - link "Back to all Dinosaurs puzzles" [ref=e210] [cursor=pointer]:
          - /url: /en/dinosaurs/
    - generic [ref=e213]:
      - heading "T-Rex 61-Dot Challenge Dot-to-Dot Puzzle Guide" [level=2] [ref=e214]
      - paragraph [ref=e215]:
        - text: Sixty-one dots. That's a real challenge — and a fitting one, because Tyrannosaurus Rex was a real giant. This puzzle takes longer than most of our
        - link "free dot to dot printables" [ref=e216] [cursor=pointer]:
          - /url: /en/
        - text: ", so it suits children who have already mastered counting past 50 and want something meatier. Find dot 1 right at the tip of the jaw, take a breath, and let's wake up the king of the dinosaurs."
      - generic [ref=e217]:
        - heading "1–11 — The Massive Head and Snout" [level=3] [ref=e218]
        - paragraph [ref=e219]: Start at dot 1 on the tip of that toothy jaw and work up and over the head to dot 11 at the base of the neck. The strokes here are short and curved, which makes this a gentle warm-up before the long lines to come. Ask your child what they notice about the head — it's enormous compared to everything else, and that's no accident.
        - generic [ref=e220]:
          - generic [ref=e221]: 💡
          - generic [ref=e222]:
            - generic [ref=e223]: Fun fact!
            - text: A full-grown T-Rex skull was about five feet long — taller than most eight-year-olds. Scientists believe its bite was the strongest of any land animal that has ever lived, powerful enough to crush bone.
      - generic [ref=e224]:
        - heading "12–26 — Along the Back to the Tail Tip" [level=3] [ref=e225]
        - paragraph [ref=e226]: From dot 12, the line sweeps along the back and all the way down the tail to dot 26 at the very tip. This is the longest, smoothest stretch of the puzzle. Encourage one flowing motion rather than lots of stops and starts — it's excellent practice for the sustained pencil control children need when they begin joined-up writing.
        - generic [ref=e227]:
          - generic [ref=e228]: 💡
          - generic [ref=e229]:
            - generic [ref=e230]: Fun fact!
            - text: The tail made up almost half of a T-Rex's total length and held more than 40 bones. It worked like a tightrope walker's pole, balancing that huge head so the dinosaur didn't tip forward onto its face.
      - generic [ref=e231]:
        - heading "27–35 — Under the Tail to the Hip" [level=3] [ref=e232]
        - paragraph [ref=e233]: Now double back. Dots 27 to 35 run underneath the tail toward the hip, tracing the thick underside of that mighty balancing beam. Children have to count carefully here because the dots sit close together — a good moment to slow down and check each number before drawing.
        - generic [ref=e234]:
          - generic [ref=e235]: 💡
          - generic [ref=e236]:
            - generic [ref=e237]: Fun fact!
            - text: Standing at the hip, a T-Rex was around 12 feet tall. Its whole body could stretch to 40 feet from nose to tail tip — about the length of a school bus.
      - generic [ref=e238]:
        - heading "36–48 — The Powerful Legs and Feet" [level=3] [ref=e239]
        - paragraph [ref=e240]: Dots 36 to 48 build the back legs and both clawed feet. These were the engine of the whole animal, and the section rewards bold, confident strokes. There's a bit of zig-zagging between the toes, so it also sneaks in some fine motor practice right when children think they're just drawing dinosaur feet.
        - generic [ref=e241]:
          - generic [ref=e242]: 💡
          - generic [ref=e243]:
            - generic [ref=e244]: Fun fact!
            - text: One T-Rex footprint could be over three feet long. For years people argued about how fast it could move — current research suggests a walking pace of about 3 mph and short bursts closer to 12 mph. Fast enough.
      - generic [ref=e245]:
        - heading "49–58 — The Belly and Those Tiny Arms" [level=3] [ref=e246]
        - paragraph [ref=e247]: Connect dots 49 through 58 to draw the belly, chest, and the famously small arms. Every child laughs at these arms, which is exactly why this section is fun to draw. The lines change direction often, so it's the trickiest part of the puzzle — perfect for the confident counters this 61-dot page was made for.
        - generic [ref=e248]:
          - generic [ref=e249]: 💡
          - generic [ref=e250]:
            - generic [ref=e251]: Fun fact!
            - text: Those little arms were only about three feet long, yet each one could lift roughly 400 pounds. Small, yes — but nobody would call them weak.
      - generic [ref=e252]:
        - heading "59–61 — Closing the Jaw" [level=3] [ref=e253]
        - paragraph [ref=e254]: Just three dots left. Connect 59, 60, and 61 to finish the lower jaw and complete the mighty outline. The final line lands right back near dot 1 — a satisfying full circle that shows children the whole picture was one continuous journey.
        - generic [ref=e255]:
          - generic [ref=e256]: 💡
          - generic [ref=e257]:
            - generic [ref=e258]: Fun fact!
            - text: T-Rex never ran out of teeth. When one broke or wore down, a new one simply grew in its place — a lifetime supply of dagger-sharp replacements, some up to 12 inches long including the root.
    - generic [ref=e259]:
      - generic [ref=e260]:
        - paragraph [ref=e261]: More free Dinosaurs printables
        - heading "You might also like" [level=2] [ref=e262]
      - generic [ref=e263]:
        - article [ref=e264]:
          - link [ref=e265] [cursor=pointer]:
            - /url: /en/dinosaurs/ostriches-dinosaur-dot-to-dot-puzzle/
            - img "Sprinting ostrich, neck outstretched, caught in 55 printable dots" [ref=e266]
          - generic [ref=e267]:
            - paragraph [ref=e268]: Dinosaurs
            - heading "Ostrich" [level=3] [ref=e269]
            - generic [ref=e270]:
              - generic [ref=e271]: Ages 5-8
              - generic [ref=e272]: 1–55 dots
            - link "View & Download" [ref=e273] [cursor=pointer]:
              - /url: /en/dinosaurs/ostriches-dinosaur-dot-to-dot-puzzle/
        - article [ref=e276]:
          - link [ref=e277] [cursor=pointer]:
            - /url: /en/dinosaurs/brontosaurus-dot-to-dot-puzzle/
            - img "Long-necked Brontosaurus stretching across 50 dots on a preschool printable" [ref=e278]
          - generic [ref=e279]:
            - paragraph [ref=e280]: Dinosaurs
            - heading "Brontosaurus" [level=3] [ref=e281]
            - generic [ref=e282]:
              - generic [ref=e283]: Ages 4-7
              - generic [ref=e284]: 1–50 dots
            - link "View & Download" [ref=e285] [cursor=pointer]:
              - /url: /en/dinosaurs/brontosaurus-dot-to-dot-puzzle/
        - article [ref=e288]:
          - link [ref=e289] [cursor=pointer]:
            - /url: /en/dinosaurs/triceratops-dot-to-dot-puzzle/
            - img "Three-horned Triceratops and its bony frill emerging from 70 printable dots" [ref=e290]
          - generic [ref=e291]:
            - paragraph [ref=e292]: Dinosaurs
            - heading "Triceratops" [level=3] [ref=e293]
            - generic [ref=e294]:
              - generic [ref=e295]: Ages 6-9
              - generic [ref=e296]: 1–70 dots
            - link "View & Download" [ref=e297] [cursor=pointer]:
              - /url: /en/dinosaurs/triceratops-dot-to-dot-puzzle/
    - region "Frequently asked questions" [ref=e300]:
      - generic [ref=e301]:
        - paragraph [ref=e302]: Common questions
        - heading "Frequently asked questions" [level=2] [ref=e303]
      - generic [ref=e304]:
        - group [ref=e305]:
          - generic "How many dots does the T-Rex 61-Dot Challenge dot to dot puzzle have?" [ref=e306] [cursor=pointer]
        - group [ref=e309]:
          - generic "Is the T-Rex 61-Dot Challenge dot to dot printable free?" [ref=e310] [cursor=pointer]
        - group [ref=e313]:
          - generic "What age is the T-Rex 61-Dot Challenge connect-the-dots worksheet best for?" [ref=e314] [cursor=pointer]
        - group [ref=e317]:
          - generic "What skills does the T-Rex 61-Dot Challenge dot to dot puzzle teach?" [ref=e318] [cursor=pointer]
        - group [ref=e321]:
          - generic "What is a fun fact about the t-rex 61-dot challenge?" [ref=e322] [cursor=pointer]
  - region [ref=e325]:
    - generic [ref=e326]:
      - generic [ref=e327]:
        - generic [ref=e332]:
          - paragraph [ref=e333]: Popular this week
          - heading "Most downloaded puzzles" [level=2] [ref=e334]
        - list [ref=e335]:
          - listitem [ref=e336]:
            - generic [ref=e337]: "1"
            - link "T-Rex 61-Dot Challenge" [ref=e338] [cursor=pointer]:
              - /url: /en/dinosaurs/trex-61-dot-to-dot-puzzle/
            - generic "23 or more downloads" [ref=e339]: 23+
          - listitem [ref=e343]:
            - generic [ref=e344]: "2"
            - link "Mermaid" [ref=e345] [cursor=pointer]:
              - /url: /en/ocean/mermaid-dot-to-dot-puzzle/
            - generic "20 or more downloads" [ref=e346]: 20+
          - listitem [ref=e350]:
            - generic [ref=e351]: "3"
            - link "Jellyfish" [ref=e352] [cursor=pointer]:
              - /url: /en/ocean/jellyfish-dot-to-dot-puzzle/
            - generic "10 or more downloads" [ref=e353]: 10+
          - listitem [ref=e357]:
            - generic [ref=e358]: "4"
            - link "Cute Puppy" [ref=e359] [cursor=pointer]:
              - /url: /en/cute/cute-puppy-dot-to-dot-puzzle/
            - generic "9 or more downloads" [ref=e360]: 9+
          - listitem [ref=e364]:
            - generic [ref=e365]: "5"
            - link "Spring Horse" [ref=e366] [cursor=pointer]:
              - /url: /en/playgrounds/spring-horse-playground-dot-to-dot-puzzle/
            - generic "7 or more downloads" [ref=e367]: 7+
          - listitem [ref=e371]:
            - generic [ref=e372]: "6"
            - link "Spinosaurus" [ref=e373] [cursor=pointer]:
              - /url: /en/dinosaurs/spinosaurus/
            - generic "7 or more downloads" [ref=e374]: 7+
          - listitem [ref=e378]:
            - generic [ref=e379]: "7"
            - link "Snowdrop Flower" [ref=e380] [cursor=pointer]:
              - /url: /en/flowers/snowdrop-flower-dot-to-dot-puzzle/
            - generic "7 or more downloads" [ref=e381]: 7+
          - listitem [ref=e385]:
            - generic [ref=e386]: "8"
            - link "Slide Playground" [ref=e387] [cursor=pointer]:
              - /url: /en/playgrounds/slide-playgrounds-dot-to-dot-puzzle/
            - generic "6 or more downloads" [ref=e388]: 6+
      - generic [ref=e392]:
        - generic [ref=e397]:
          - paragraph [ref=e398]: Fresh printables
          - heading "Recently added" [level=3] [ref=e399]
        - list [ref=e400]:
          - listitem [ref=e401]:
            - generic [ref=e402]: "1"
            - link "Circus Ringmaster Bear" [ref=e403] [cursor=pointer]:
              - /url: /en/circus/circus-ringmaster-bear-dot-to-dot-puzzle/
            - generic [ref=e404]: New
          - listitem [ref=e405]:
            - generic [ref=e406]: "2"
            - link "Circus Tent" [ref=e407] [cursor=pointer]:
              - /url: /en/circus/circus-tent-dot-to-dot-puzzle/
            - generic [ref=e408]: New
          - listitem [ref=e409]:
            - generic [ref=e410]: "3"
            - link "Space Rover" [ref=e411] [cursor=pointer]:
              - /url: /en/space/space-rover-dot-to-dot-puzzle/
            - generic [ref=e412]: New
          - listitem [ref=e413]:
            - generic [ref=e414]: "4"
            - link "Ringed Planet" [ref=e415] [cursor=pointer]:
              - /url: /en/space/ringed-planet-dot-to-dot-puzzle/
            - generic [ref=e416]: New
  - generic "Share me" [ref=e417]:
    - generic [ref=e418]:
      - link "Share — WhatsApp" [ref=e419] [cursor=pointer]:
        - /url: https://wa.me/?text=T-Rex%20Dot%20to%20Dot%20%E2%80%94%2061%20Dots%20of%20Prehistoric%20Fun%20%7C%20DotToDotFreePrintables.com%20https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2Ftrex-61-dot-to-dot-puzzle%2F
      - link "Share — Facebook" [ref=e422] [cursor=pointer]:
        - /url: https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2Ftrex-61-dot-to-dot-puzzle%2F
      - link "Share — Pinterest" [ref=e425] [cursor=pointer]:
        - /url: https://pinterest.com/pin/create/button/?url=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2Ftrex-61-dot-to-dot-puzzle%2F&description=T-Rex%20Dot%20to%20Dot%20%E2%80%94%2061%20Dots%20of%20Prehistoric%20Fun%20%7C%20DotToDotFreePrintables.com
      - link "Share — X" [ref=e428] [cursor=pointer]:
        - /url: https://twitter.com/intent/tweet?url=https%3A%2F%2Fdottodotfreeprintables.com%2Fen%2Fdinosaurs%2Ftrex-61-dot-to-dot-puzzle%2F&text=T-Rex%20Dot%20to%20Dot%20%E2%80%94%2061%20Dots%20of%20Prehistoric%20Fun%20%7C%20DotToDotFreePrintables.com
      - button "Copy link" [ref=e431] [cursor=pointer]
  - contentinfo [ref=e435]:
    - generic [ref=e436]: DotToDotFreePrintables.com
    - paragraph [ref=e442]: Free dot to dot printables and connect-the-dots worksheets for kids, parents, and teachers in the US, UK, Canada, and Australia. All puzzles are free to download, print, and share.
    - navigation "Free dot to dot printables and connect-the-dots worksheets for kids, parents, and teachers in the US, UK, Canada, and Australia. All puzzles are free to download, print, and share." [ref=e443]:
      - link "Blog" [ref=e444] [cursor=pointer]:
        - /url: /en/blog/
      - link "FAQ" [ref=e445] [cursor=pointer]:
        - /url: /en/#faq
      - link "Feedback" [ref=e446] [cursor=pointer]:
        - /url: /en/#feedback
      - link "About" [ref=e447] [cursor=pointer]:
        - /url: /en/about/
      - link "Contact" [ref=e448] [cursor=pointer]:
        - /url: /en/contact/
      - link "Privacy" [ref=e449] [cursor=pointer]:
        - /url: /en/privacy-policy/
      - link "Terms" [ref=e450] [cursor=pointer]:
        - /url: /en/terms/
      - link "Dot to Dot Puzzle Pack" [ref=e451] [cursor=pointer]:
        - /url: /en/premium/
      - link "Sitemap" [ref=e452] [cursor=pointer]:
        - /url: /sitemap.xml
    - generic "Free dot to dot printables and connect-the-dots worksheets for kids, parents, and teachers in the US, UK, Canada, and Australia. All puzzles are free to download, print, and share." [ref=e453]:
      - link "YouTube" [ref=e454] [cursor=pointer]:
        - /url: https://www.youtube.com/@dottodotfreeprintables_com
      - link "Pinterest" [ref=e458] [cursor=pointer]:
        - /url: https://www.pinterest.com/hellokidsbookworld/
    - paragraph [ref=e461]: © 2026 DotToDotFreePrintables.com · Free printable activities for children - v1.0.0
  - alert [ref=e462]
```

# Test source

```ts
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
> 305 |     expect(content).toContain('T-Rex 61-Dot Challenge');
      |                     ^ Error: expect(received).toContain(expected) // indexOf
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
  336 |     await page.goto('/');
  337 |     const menuButton = page.getByRole('button', { name: /open categories menu/i });
  338 |     if (await menuButton.isVisible()) await menuButton.click();
  339 |     const navigation = await page.getByRole('dialog').isVisible().catch(() => false)
  340 |       ? page.getByRole('dialog')
  341 |       : page.locator('.category-menu-bar');
  342 |     await navigation.getByRole('link', { name: /^dinosaurs$/i }).click();
  343 |     await expect(page).toHaveURL(/\/en\/dinosaurs\/?$/);
  344 |     await expect(page.getByRole('heading', { name: /dinosaur dot to dot printables/i })).toBeVisible();
  345 |   });
  346 | 
  347 |   test('/dinosaurs -> puzzle page in 1 click', async ({ page }) => {
  348 |     await page.goto(en('/dinosaurs/'));
  349 |     await page.getByRole('link', { name: /view & download - t-rex 61-dot challenge/i }).click();
  350 |     await expect(page).toHaveURL(/\/en\/dinosaurs\/trex-61-dot-to-dot-puzzle\/?$/);
  351 |     await expect(
  352 |       page.getByRole('heading', { level: 1, name: /t-rex dot to dot/i })
  353 |     ).toBeVisible();
  354 |   });
  355 | 
  356 |   test('puzzle page breadcrumb navigates back to /dinosaurs', async ({ page }) => {
  357 |     await page.goto(en('/dinosaurs/trex-61-dot-to-dot-puzzle/'));
  358 |     await page.getByRole('link', { name: /dinosaurs/i }).first().click();
  359 |     await expect(page).toHaveURL(/\/en\/dinosaurs\/?$/);
  360 |   });
  361 | 
  362 |   test('navbar brand link returns to home', async ({ page }) => {
  363 |     await page.goto(en('/dinosaurs/'));
  364 |     await page.getByRole('link', { name: /dottodotfreeprintables.*home/i }).click();
  365 |     await expect(page).toHaveURL(/\/en\/?$/);
  366 |   });
  367 | });
  368 | 
  369 | /* ═══════════════════════════════════════════════════════════════════════════
  370 |    LINKS — no broken links across all key pages
  371 | ═══════════════════════════════════════════════════════════════════════════ */
  372 | test.describe('No broken links', () => {
  373 |   const pagesToCheck = ['/', '/dinosaurs', '/dinosaurs/trex-61-dot-to-dot-puzzle', '/dinosaurs/triceratops'];
  374 | 
  375 |   for (const path of pagesToCheck) {
  376 |     test(`all same-origin links on ${path} resolve (< 400)`, async ({ page, request, baseURL }) => {
  377 |       await page.goto(path);
  378 |       const hrefs = await page.$$eval('a[href]', (anchors) =>
  379 |         anchors
  380 |           .map((a) => a.getAttribute('href'))
  381 |           .filter((h): h is string => typeof h === 'string' && h !== '' && !h.startsWith('#') && !h.startsWith('mailto'))
  382 |       );
  383 | 
  384 |       const base = new URL(baseURL ?? 'http://localhost:4444');
  385 |       const urls = Array.from(new Set(
  386 |         hrefs
  387 |           .map((h) => new URL(h, base))
  388 |           .filter((u) => u.origin === base.origin)
  389 |           .map((u) => { u.hash = ''; return u.toString(); })
  390 |       ));
  391 | 
  392 |       for (const url of urls) {
  393 |         const res = await request.get(url);
  394 |         expect(res.status(), `${url} should not be broken`).toBeLessThan(400);
  395 |       }
  396 |     });
  397 |   }
  398 | });
  399 | 
  400 | /* ═══════════════════════════════════════════════════════════════════════════
  401 |    SEO — meta tags
  402 | ═══════════════════════════════════════════════════════════════════════════ */
  403 | test.describe('SEO meta tags', () => {
  404 |   test('home page has correct title', async ({ page }) => {
  405 |     await page.goto('/');
```