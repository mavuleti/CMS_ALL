# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mermaid-puzzle.spec.ts >> ar Mermaid puzzle functionality >> publishes canonical, social, breadcrumb, and puzzle schema
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
  - link "الانتقال إلى المحتوى الرئيسي" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - banner [ref=e3]:
    - navigation "تصفح ألغاز توصيل النقاط حسب الفئة" [ref=e4]:
      - link "DotToDotFreePrintables — الرئيسية" [ref=e5] [cursor=pointer]:
        - /url: /ar/
        - text: DotToDotFreePrintables
      - link "الرئيسية" [ref=e10] [cursor=pointer]:
        - /url: /ar/
      - button "فتح قائمة الفئات" [ref=e14] [cursor=pointer]
      - generic "اللغة" [ref=e16]:
        - combobox "اختر اللغة" [ref=e20] [cursor=pointer]:
          - option "EN"
          - option "AR" [selected]
    - img [ref=e22]:
      - generic [ref=e23]: "1"
      - generic [ref=e25]: "2"
      - generic [ref=e27]: "3"
      - generic [ref=e29]: "4"
      - generic [ref=e31]: "5"
      - generic [ref=e33]: "6"
      - generic [ref=e35]: "7"
  - button "مشاركة" [ref=e38] [cursor=pointer]
  - main [ref=e45]:
    - navigation "مسار التنقل" [ref=e46]:
      - link "الرئيسية" [ref=e47] [cursor=pointer]:
        - /url: /ar/
      - generic [ref=e51]: ›
      - link "Ocean" [ref=e52] [cursor=pointer]:
        - /url: /ar/ocean/
      - generic [ref=e53]: ›
      - generic [ref=e54]: حورية البحر
    - generic [ref=e56]:
      - img "حورية بحر تنزلق تحت الماء وذيلها منحنٍ عبر 54 نقطة قابلة للطباعة" [ref=e59]
      - generic [ref=e60]:
        - paragraph [ref=e61]: Free Ocean Printable
        - heading "حورية البحر Dot-to-Dot Printable" [level=1] [ref=e62]
        - paragraph [ref=e63]: صل النقاط لتكشف عن حورية بحر جميلة تنساب عبر المحيط. هذه اللعبة السهلة المكونة من 54 نقطة مثالية للمتعلمين الصغار لممارسة ترتيب الأرقام مع الاستمتاع بلمسة من السحر تحت الماء.
        - generic [ref=e64]:
          - generic [ref=e65]: "الأعمار: 5-8"
          - generic [ref=e66]: "النقاط: 1–54"
          - generic [ref=e67]: مجاني 100%
        - generic [ref=e68]:
          - paragraph [ref=e69]: الصعوبة
          - generic [ref=e70]:
            - img "الصعوبة 1 من 3" [ref=e71]
            - generic [ref=e75]: سهل
        - generic [ref=e76]:
          - generic [ref=e77]: "!"
          - generic [ref=e78]:
            - strong [ref=e79]: "معلومة ممتعة:"
            - text: ظهرت حوريات البحر في الفولكلور منذ عصر أشور القديمة — قبل أكثر من 3000 عام!
        - generic [ref=e81]:
          - generic "تم التنزيل 1020+ مرة" [ref=e82]:
            - generic [ref=e83]: ★
            - generic [ref=e85]:
              - strong [ref=e86]: تم التنزيل
              - generic [ref=e87]: 1,020+
              - generic [ref=e88]: مرة
              - generic [ref=e89]: لقد اخترت اختيارًا رائعًا!
            - generic [ref=e90]: ✦
            - generic [ref=e91]: ✦
          - link "تنزيل مجاني لورقة توصيل النقاط حورية البحر بصيغة PDF" [ref=e92] [cursor=pointer]:
            - /url: /ocean/mermaid-dot-to-dot-printable-horizontal_A4.pdf
            - text: تحميل ملف PDF مجاني للطباعة
          - paragraph [ref=e96]: مجاني للاستخدام المنزلي والصفي. مناسب لورق A4.
          - link "تفضل مقاس حجم ورقة الولايات المتحدة؟ حمّل هذه النسخة" [ref=e97] [cursor=pointer]:
            - /url: /ocean/mermaid-dot-to-dot-printable-horizontal.pdf
        - 'complementary "إعلان: كتاب أنشطة توصيل النقاط أفضل ألغاز 2026" [ref=e101]':
          - link "غلاف كتاب أفضل ألغاز 2026 الذي يضم 25 لغز توصيل نقاط كتاب PDF أفضل ألغاز 2026 25 لغز توصيل نقاط عرض خاص $9.00 $5.00 عرض الكتاب" [ref=e102] [cursor=pointer]:
            - /url: /ar/premium/
            - img "غلاف كتاب أفضل ألغاز 2026 الذي يضم 25 لغز توصيل نقاط" [ref=e103]
            - generic [ref=e104]: كتاب PDF
            - strong [ref=e105]: أفضل ألغاز 2026
            - generic [ref=e106]: 25 لغز توصيل نقاط
            - generic [ref=e107]: عرض خاص
            - generic [ref=e108]:
              - deletion [ref=e109]: $9.00
              - text: $5.00
            - generic [ref=e110]: عرض الكتاب
        - group "مشاركة" [ref=e111]:
          - link "مشاركة — WhatsApp" [ref=e119] [cursor=pointer]:
            - /url: https://wa.me/?text=%D8%AD%D9%88%D8%B1%D9%8A%D8%A9%20%D8%A7%D9%84%D8%A8%D8%AD%D8%B1%20%D9%88%D8%B1%D9%82%D8%A9%20%D8%AA%D9%88%D8%B5%D9%8A%D9%84%20%D9%86%D9%82%D8%A7%D8%B7%20-%20PDF%20%D9%85%D8%AC%D8%A7%D9%86%D9%8A%20https%3A%2F%2Fdottodotfreeprintables.com%2Far%2Focean%2Fmermaid-dot-to-dot-puzzle%2F
          - link "مشاركة — Facebook" [ref=e122] [cursor=pointer]:
            - /url: https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdottodotfreeprintables.com%2Far%2Focean%2Fmermaid-dot-to-dot-puzzle%2F
          - link "مشاركة — Pinterest" [ref=e125] [cursor=pointer]:
            - /url: https://pinterest.com/pin/create/button/?url=https%3A%2F%2Fdottodotfreeprintables.com%2Far%2Focean%2Fmermaid-dot-to-dot-puzzle%2F&media=http%3A%2F%2F127.0.0.1%3A4444%2Fimages%2Fmermaid-puzzle.webp&description=%D8%AD%D9%88%D8%B1%D9%8A%D8%A9%20%D8%A7%D9%84%D8%A8%D8%AD%D8%B1%20%D9%88%D8%B1%D9%82%D8%A9%20%D8%AA%D9%88%D8%B5%D9%8A%D9%84%20%D9%86%D9%82%D8%A7%D8%B7%20-%20PDF%20%D9%85%D8%AC%D8%A7%D9%86%D9%8A
          - link "مشاركة — X" [ref=e128] [cursor=pointer]:
            - /url: https://twitter.com/intent/tweet?url=https%3A%2F%2Fdottodotfreeprintables.com%2Far%2Focean%2Fmermaid-dot-to-dot-puzzle%2F&text=%D8%AD%D9%88%D8%B1%D9%8A%D8%A9%20%D8%A7%D9%84%D8%A8%D8%AD%D8%B1%20%D9%88%D8%B1%D9%82%D8%A9%20%D8%AA%D9%88%D8%B5%D9%8A%D9%84%20%D9%86%D9%82%D8%A7%D8%B7%20-%20PDF%20%D9%85%D8%AC%D8%A7%D9%86%D9%8A
          - button "نسخ الرابط" [ref=e131] [cursor=pointer]
          - status
        - paragraph [ref=e135]: بلا حاجة للتسجيل. يُفتح كملف PDF. اطبع على ورق A4 أو US Letter (8.5 × 11 بوصة). مجاني للاستخدام المنزلي والصفي.
        - link "Back to all Ocean puzzles" [ref=e136] [cursor=pointer]:
          - /url: /ar/ocean/
    - generic [ref=e139]:
      - heading "حورية البحر Dot-to-Dot Puzzle Guide" [level=2] [ref=e140]
      - paragraph [ref=e141]:
        - text: أسرت حوريات البحر خيال الأطفال لآلاف السنين — من بحار أشور القديمة إلى حكايات هانس كريستيان أندرسن الخيالية. تتبع هذه اللعبة الجميلة المكونة من 54 نقطة الخطوط الرشيقة لحورية بحر تنساب في الأعماق. إنها لعبة رائعة لوقت هادئ ومركّز — مثالية لبعد ظهيرة ممطر أو
        - link "نشاط صفي هادئ للأطفال" [ref=e142] [cursor=pointer]:
          - /url: /ar/playgrounds/
        - text: . ابحث عن النقطة رقم 1، ولتبدأ الحكاية السحرية!
      - generic [ref=e143]:
        - heading "1–9 — الوجه والشعر" [level=3] [ref=e144]
        - paragraph [ref=e145]: ابدأ من النقطة 1 وصل حتى النقطة 9 لرسم وجه حورية البحر وخصلات شعرها المتدفقة. يتضمن الوجه منحنيات ناعمة ومستديرة — بداية لطيفة تبني ثقة القلم قبل الأشكال الأكبر القادمة. شجّع الأطفال على رفع معصمهم قليلاً وترك القلم ينساب بحرية.
        - generic [ref=e146]:
          - generic [ref=e147]: 💡
          - generic [ref=e148]:
            - generic [ref=e149]: معلومة ممتعة!
            - text: ظهرت أساطير حوريات البحر بشكل مستقل في ثقافات حول العالم — من أرواح الماء في غرب أفريقيا إلى النينغيو الياباني وحوريات البحر الإغريقية القديمة النيريدات. يبدو أن فكرة الكائنات نصف البشرية ونصف السمكية هي شيء يصل إليه الخيال البشري دائمًا، أيًا كان المحيط.
      - generic [ref=e150]:
        - heading "10–22 — الذراعان والجزء العلوي من الجسم" [level=3] [ref=e151]
        - paragraph [ref=e152]: تابع من النقطة 10 إلى النقطة 22 لرسم الذراعين والجذع. يتدرب الأطفال هنا على التناظر والانحناء الطبيعي لشكل جسم الإنسان — قسم يصلح بشكل خاص للحديث عن تناسب الجسم بطريقة ممتعة وخالية من الضغط. اللمسة الخفيفة المتدفقة تعطي النتيجة الأكثر أناقة.
        - generic [ref=e153]:
          - generic [ref=e154]: 💡
          - generic [ref=e155]:
            - generic [ref=e156]: معلومة ممتعة!
            - text: "كُتبت أشهر قصة لحورية بحر في الثقافة الناطقة بالإنجليزية — حورية البحر الصغيرة — بواسطة هانس كريستيان أندرسن عام 1837. تختلف القصة الأصلية كثيرًا عن الفيلم المتحرك: فهي أكثر حزنًا وحلاوة، وتهدف إلى التأمل في التضحية والشوق ومعنى امتلاك الروح."
      - generic [ref=e157]:
        - heading "23–36 — الخصر والحراشف" [level=3] [ref=e158]
        - paragraph [ref=e159]: تتبع النقاط من 23 إلى 36 لرسم الجزء الأوسط حيث يتحول شكل الإنسان إلى ذيل السمكة — الجزء الأكثر تميزًا في حورية البحر من الرسمة بأكملها. يتعلم الأطفال هنا تتبع شكل يضيق ثم يتسع مرة أخرى. يكافئ هذا الجزء الأوسط الصبر والبحث الدقيق عن النقاط.
        - generic [ref=e160]:
          - generic [ref=e161]: 💡
          - generic [ref=e162]:
            - generic [ref=e163]: معلومة ممتعة!
            - text: يعتقد العلماء أن أسطورة حورية البحر ربما نشأت جزئيًا من مشاهدة البحارة لأبقار البحر (الأطوم) في عرض البحر. من مسافة بعيدة، يمكن لبقرة البحر التي تطفو للتنفس — بجسمها المستدير وذيلها الشبيه بالمجداف — أن تبدو شبيهة بالإنسان بشكل مدهش. إنه تفسير متسامح، لكن الوحدة والمسافة تفعلان أشياء رائعة بالخيال.
      - generic [ref=e164]:
        - heading "37–46 — ذيل السمكة" [level=3] [ref=e165]
        - paragraph [ref=e166]: صل النقاط من 37 إلى 46 لرسم ذيل السمكة الطويل الرشيق وهو ينساب إلى الأسفل. هذا هو الجزء الأكثر إمتاعًا في اللعبة — يشعر الأطفال بأن حورية البحر تأخذ شكلها النهائي المميز. تعمل الضربات الطويلة المتدفقة بشكل رائع هنا. شجّع الأطفال على الرسم من الكتف وليس فقط من المعصم.
        - generic [ref=e167]:
          - generic [ref=e168]: 💡
          - generic [ref=e169]:
            - generic [ref=e170]: معلومة ممتعة!
            - text: "في معظم فولكلور حوريات البحر، يوصف الذيل بأنه متلألئ — يلمع بألوان متعددة مثل فقاعة الصابون أو حرشفة السمكة تحت أشعة الشمس. عند تلوين هذه اللعبة، لا توجد إجابة خاطئة: الفضي أو الأزرق المحيطي أو الأخضر الزمردي أو الثلاثة معًا، كلها خيارات صحيحة بنفس القدر!"
      - generic [ref=e171]:
        - heading "47–54 — زعانف الذيل" [level=3] [ref=e172]
        - paragraph [ref=e173]: أنهِ اللعبة بتوصيل النقاط من 47 إلى 54 لإضافة زعانف الذيل الواسعة المتدفقة التي تكمل صورة حورية البحر. ثماني نقاط فقط حتى خط النهاية — شجّع الأطفال على أن تكون كل نقطة مهمة وأن ينهوا الرسم بلمسة واثقة ورشيقة. زعنفة الذيل هي نقطة النهاية لحورية البحر!
        - generic [ref=e174]:
          - generic [ref=e175]: 💡
          - generic [ref=e176]:
            - generic [ref=e177]: معلومة ممتعة!
            - text: تتحرك ذيول الأسماك من جانب إلى آخر، لكن ذيول الحيتان والدلافين — التي تسمى الزعانف الذيلية — تتحرك من أعلى إلى أسفل. لو كانت حورية البحر موجودة فعلاً، يتجادل العلماء حول أي نوع من الذيل سيكون أنسب لجسم علوي بشري الشكل. الإجابة، بناءً على طريقة حركة الوركين البشريين، ستكون على الأرجح النمط الرأسي كذيل الدلفين.
    - generic [ref=e178]:
      - generic [ref=e179]:
        - paragraph [ref=e180]: More free Ocean printables
        - heading "قد يعجبك أيضًا" [level=2] [ref=e181]
      - generic [ref=e182]:
        - article [ref=e183]:
          - link [ref=e184] [cursor=pointer]:
            - /url: /ar/ocean/merman-dot-to-dot-puzzle/
            - img "رجل بحر يخرج من الأمواج عبر 44 نقطة سهلة في ورقة لمرحلة الروضة" [ref=e185]
          - generic [ref=e186]:
            - paragraph [ref=e187]: Ocean
            - heading "رجل البحر" [level=3] [ref=e188]
            - generic [ref=e189]:
              - generic [ref=e190]: الأعمار 4-7
              - generic [ref=e191]: 1–44 نقطة
            - link "عرض وتحميل" [ref=e192] [cursor=pointer]:
              - /url: /ar/ocean/merman-dot-to-dot-puzzle/
        - article [ref=e195]:
          - link [ref=e196] [cursor=pointer]:
            - /url: /ar/ocean/seahorse-dot-to-dot-puzzle/
            - img "فرس بحر صغير يطفو منتصبًا محددًا بـ 35 نقطة فقط على ورقة مجانية" [ref=e197]
          - generic [ref=e198]:
            - paragraph [ref=e199]: Ocean
            - heading "فرس البحر" [level=3] [ref=e200]
            - generic [ref=e201]:
              - generic [ref=e202]: الأعمار 4-7
              - generic [ref=e203]: 1–35 نقطة
            - link "عرض وتحميل" [ref=e204] [cursor=pointer]:
              - /url: /ar/ocean/seahorse-dot-to-dot-puzzle/
        - article [ref=e207]:
          - link [ref=e208] [cursor=pointer]:
            - /url: /ar/ocean/whale-dot-to-dot-puzzle/
            - img "حوت ضخم في منتصف السباحة وظهره منحنٍ عبر 42 نقطة مرقّمة للطباعة" [ref=e209]
          - generic [ref=e210]:
            - paragraph [ref=e211]: Ocean
            - heading "الحوت" [level=3] [ref=e212]
            - generic [ref=e213]:
              - generic [ref=e214]: الأعمار 4-7
              - generic [ref=e215]: 1–42 نقطة
            - link "عرض وتحميل" [ref=e216] [cursor=pointer]:
              - /url: /ar/ocean/whale-dot-to-dot-puzzle/
    - region "الأسئلة المتكررة" [ref=e219]:
      - generic [ref=e220]:
        - paragraph [ref=e221]: الأسئلة الشائعة
        - heading "الأسئلة المتكررة" [level=2] [ref=e222]
      - generic [ref=e223]:
        - group [ref=e224]:
          - generic "كم عدد النقاط في لغز توصيل النقاط «حورية البحر»؟" [ref=e225] [cursor=pointer]
        - group [ref=e228]:
          - generic "هل ورقة «حورية البحر» لتوصيل النقاط مجانية؟" [ref=e229] [cursor=pointer]
        - group [ref=e232]:
          - generic "ما العمر المناسب لورقة «حورية البحر»؟" [ref=e233] [cursor=pointer]
        - group [ref=e236]:
          - generic "ما المهارات التي ينمّيها لغز «حورية البحر»؟" [ref=e237] [cursor=pointer]
        - group [ref=e240]:
          - generic "ما المعلومة الممتعة في هذا اللغز؟" [ref=e241] [cursor=pointer]
  - contentinfo [ref=e244]:
    - generic [ref=e245]: DotToDotFreePrintables.com
    - paragraph [ref=e251]: أوراق توصيل نقاط مجانية للأطفال وأولياء الأمور والمعلمين. جميع الألغاز مجانية للتحميل والطباعة والمشاركة.
    - navigation "أوراق توصيل نقاط مجانية للأطفال وأولياء الأمور والمعلمين. جميع الألغاز مجانية للتحميل والطباعة والمشاركة." [ref=e252]:
      - link "المدونة" [ref=e253] [cursor=pointer]:
        - /url: /ar/blog/
      - link "الأسئلة الشائعة" [ref=e254] [cursor=pointer]:
        - /url: /ar/#faq
      - link "الملاحظات" [ref=e255] [cursor=pointer]:
        - /url: /ar/#feedback
      - link "من نحن" [ref=e256] [cursor=pointer]:
        - /url: /ar/about/
      - link "اتصل بنا" [ref=e257] [cursor=pointer]:
        - /url: /ar/contact/
      - link "سياسة الخصوصية" [ref=e258] [cursor=pointer]:
        - /url: /ar/privacy-policy/
      - link "شروط الاستخدام" [ref=e259] [cursor=pointer]:
        - /url: /ar/terms/
      - link "حزمة ألغاز توصيل النقاط" [ref=e260] [cursor=pointer]:
        - /url: /ar/premium/
      - link "خريطة الموقع" [ref=e261] [cursor=pointer]:
        - /url: /sitemap.xml
    - generic "أوراق توصيل نقاط مجانية للأطفال وأولياء الأمور والمعلمين. جميع الألغاز مجانية للتحميل والطباعة والمشاركة." [ref=e262]:
      - link "YouTube" [ref=e263] [cursor=pointer]:
        - /url: https://www.youtube.com/@dottodotfreeprintables_com
      - link "Pinterest" [ref=e267] [cursor=pointer]:
        - /url: https://www.pinterest.com/hellokidsbookworld/
    - paragraph [ref=e270]: © 2026 DotToDotFreePrintables.com · أنشطة مجانية للطباعة للأطفال - v1.0.0
  - alert [ref=e271]
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