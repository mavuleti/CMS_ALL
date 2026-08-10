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
      - navigation "تصفح فئات الألغاز" [ref=e10]:
        - link "الرئيسية" [ref=e11] [cursor=pointer]:
          - /url: /ar/
        - link "الزهور" [ref=e17] [cursor=pointer]:
          - /url: /ar/flowers/
          - generic [ref=e18]: جديد
        - link "ألغاز لطيفة" [ref=e26] [cursor=pointer]:
          - /url: /ar/cute/
          - generic [ref=e27]:
            - generic [ref=e28]: 🐶
            - generic [ref=e29]: جديد
        - link "الملاعب" [ref=e31] [cursor=pointer]:
          - /url: /ar/playgrounds/
          - generic [ref=e32]: 🛝
        - link "الديناصورات" [ref=e35] [cursor=pointer]:
          - /url: /ar/dinosaurs/
          - generic [ref=e36]: 🦖
        - link "المحيط" [ref=e39] [cursor=pointer]:
          - /url: /ar/ocean/
        - link "السيرك" [ref=e44] [cursor=pointer]:
          - /url: /ar/circus/
          - generic [ref=e45]:
            - generic [ref=e46]: 🤡
            - generic [ref=e47]: جديد
        - link "المزيد" [ref=e49] [cursor=pointer]:
          - /url: /ar/#categories
      - generic "اللغة" [ref=e57]:
        - combobox "اختر اللغة" [ref=e61] [cursor=pointer]:
          - option "English"
          - option "العربية" [selected]
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
    - link "امسحني" [ref=e125] [cursor=pointer]:
      - /url: /ar/
      - img "امسحني" [ref=e126]
    - generic [ref=e127]: امسحني
  - main [ref=e128]:
    - navigation "مسار التنقل" [ref=e129]:
      - link "الرئيسية" [ref=e130] [cursor=pointer]:
        - /url: /ar/
      - generic [ref=e134]: ›
      - link "Ocean" [ref=e135] [cursor=pointer]:
        - /url: /ar/ocean/
      - generic [ref=e136]: ›
      - generic [ref=e137]: حورية البحر
    - generic [ref=e139]:
      - img "حورية بحر تنزلق تحت الماء وذيلها منحنٍ عبر 54 نقطة قابلة للطباعة" [ref=e142]
      - generic [ref=e143]:
        - paragraph [ref=e144]: Free Ocean Printable
        - heading "حورية البحر Dot-to-Dot Printable" [level=1] [ref=e145]
        - paragraph [ref=e146]: صل النقاط لتكشف عن حورية بحر جميلة تنساب عبر المحيط. هذه اللعبة السهلة المكونة من 54 نقطة مثالية للمتعلمين الصغار لممارسة ترتيب الأرقام مع الاستمتاع بلمسة من السحر تحت الماء.
        - generic [ref=e147]:
          - generic [ref=e148]: "الأعمار: 5-8"
          - generic [ref=e149]: "النقاط: 1–54"
          - generic [ref=e150]: مجاني 100%
        - generic [ref=e151]:
          - paragraph [ref=e152]: الصعوبة
          - generic [ref=e153]:
            - img "الصعوبة 1 من 3" [ref=e154]
            - generic [ref=e158]: سهل
        - generic [ref=e159]:
          - generic [ref=e160]: "!"
          - generic [ref=e161]:
            - strong [ref=e162]: "معلومة ممتعة:"
            - text: ظهرت حوريات البحر في الفولكلور منذ عصر أشور القديمة — قبل أكثر من 3000 عام!
        - generic [ref=e164]:
          - generic "تم التنزيل 1020+ مرة" [ref=e165]:
            - generic [ref=e166]: ★
            - generic [ref=e168]:
              - strong [ref=e169]: تم التنزيل
              - generic [ref=e170]: 1,020+
              - generic [ref=e171]: مرة
              - generic [ref=e172]: لقد اخترت اختيارًا رائعًا!
            - generic [ref=e173]: ✦
            - generic [ref=e174]: ✦
          - link "تنزيل مجاني لورقة توصيل النقاط حورية البحر بصيغة PDF" [ref=e175] [cursor=pointer]:
            - /url: /ocean/mermaid-dot-to-dot-printable-horizontal_A4.pdf
            - text: تحميل ملف PDF مجاني للطباعة
          - paragraph [ref=e179]: مجاني للاستخدام المنزلي والصفي. مناسب لورق A4.
          - link "تفضل مقاس حجم ورقة الولايات المتحدة؟ حمّل هذه النسخة" [ref=e180] [cursor=pointer]:
            - /url: /ocean/mermaid-dot-to-dot-printable-horizontal.pdf
        - group "مشاركة" [ref=e184]:
          - link "مشاركة — WhatsApp" [ref=e192] [cursor=pointer]:
            - /url: https://wa.me/?text=%D8%AD%D9%88%D8%B1%D9%8A%D8%A9%20%D8%A7%D9%84%D8%A8%D8%AD%D8%B1%20%D9%88%D8%B1%D9%82%D8%A9%20%D8%AA%D9%88%D8%B5%D9%8A%D9%84%20%D9%86%D9%82%D8%A7%D8%B7%20-%20PDF%20%D9%85%D8%AC%D8%A7%D9%86%D9%8A%20https%3A%2F%2Fdottodotfreeprintables.com%2Far%2Focean%2Fmermaid-dot-to-dot-puzzle%2F
          - link "مشاركة — Facebook" [ref=e195] [cursor=pointer]:
            - /url: https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdottodotfreeprintables.com%2Far%2Focean%2Fmermaid-dot-to-dot-puzzle%2F
          - link "مشاركة — Pinterest" [ref=e198] [cursor=pointer]:
            - /url: https://pinterest.com/pin/create/button/?url=https%3A%2F%2Fdottodotfreeprintables.com%2Far%2Focean%2Fmermaid-dot-to-dot-puzzle%2F&media=http%3A%2F%2F127.0.0.1%3A4444%2Fimages%2Fmermaid-puzzle.webp&description=%D8%AD%D9%88%D8%B1%D9%8A%D8%A9%20%D8%A7%D9%84%D8%A8%D8%AD%D8%B1%20%D9%88%D8%B1%D9%82%D8%A9%20%D8%AA%D9%88%D8%B5%D9%8A%D9%84%20%D9%86%D9%82%D8%A7%D8%B7%20-%20PDF%20%D9%85%D8%AC%D8%A7%D9%86%D9%8A
          - link "مشاركة — X" [ref=e201] [cursor=pointer]:
            - /url: https://twitter.com/intent/tweet?url=https%3A%2F%2Fdottodotfreeprintables.com%2Far%2Focean%2Fmermaid-dot-to-dot-puzzle%2F&text=%D8%AD%D9%88%D8%B1%D9%8A%D8%A9%20%D8%A7%D9%84%D8%A8%D8%AD%D8%B1%20%D9%88%D8%B1%D9%82%D8%A9%20%D8%AA%D9%88%D8%B5%D9%8A%D9%84%20%D9%86%D9%82%D8%A7%D8%B7%20-%20PDF%20%D9%85%D8%AC%D8%A7%D9%86%D9%8A
          - button "نسخ الرابط" [ref=e204] [cursor=pointer]
          - status
        - paragraph [ref=e208]: بلا حاجة للتسجيل. يُفتح كملف PDF. اطبع على ورق A4 أو US Letter (8.5 × 11 بوصة). مجاني للاستخدام المنزلي والصفي.
        - link "Back to all Ocean puzzles" [ref=e209] [cursor=pointer]:
          - /url: /ar/ocean/
    - generic [ref=e212]:
      - heading "حورية البحر Dot-to-Dot Puzzle Guide" [level=2] [ref=e213]
      - paragraph [ref=e214]:
        - text: أسرت حوريات البحر خيال الأطفال لآلاف السنين — من بحار أشور القديمة إلى حكايات هانس كريستيان أندرسن الخيالية. تتبع هذه اللعبة الجميلة المكونة من 54 نقطة الخطوط الرشيقة لحورية بحر تنساب في الأعماق. إنها لعبة رائعة لوقت هادئ ومركّز — مثالية لبعد ظهيرة ممطر أو
        - link "نشاط صفي هادئ للأطفال" [ref=e215] [cursor=pointer]:
          - /url: /ar/playgrounds/
        - text: . ابحث عن النقطة رقم 1، ولتبدأ الحكاية السحرية!
      - generic [ref=e216]:
        - heading "1–9 — الوجه والشعر" [level=3] [ref=e217]
        - paragraph [ref=e218]: ابدأ من النقطة 1 وصل حتى النقطة 9 لرسم وجه حورية البحر وخصلات شعرها المتدفقة. يتضمن الوجه منحنيات ناعمة ومستديرة — بداية لطيفة تبني ثقة القلم قبل الأشكال الأكبر القادمة. شجّع الأطفال على رفع معصمهم قليلاً وترك القلم ينساب بحرية.
        - generic [ref=e219]:
          - generic [ref=e220]: 💡
          - generic [ref=e221]:
            - generic [ref=e222]: معلومة ممتعة!
            - text: ظهرت أساطير حوريات البحر بشكل مستقل في ثقافات حول العالم — من أرواح الماء في غرب أفريقيا إلى النينغيو الياباني وحوريات البحر الإغريقية القديمة النيريدات. يبدو أن فكرة الكائنات نصف البشرية ونصف السمكية هي شيء يصل إليه الخيال البشري دائمًا، أيًا كان المحيط.
      - generic [ref=e223]:
        - heading "10–22 — الذراعان والجزء العلوي من الجسم" [level=3] [ref=e224]
        - paragraph [ref=e225]: تابع من النقطة 10 إلى النقطة 22 لرسم الذراعين والجذع. يتدرب الأطفال هنا على التناظر والانحناء الطبيعي لشكل جسم الإنسان — قسم يصلح بشكل خاص للحديث عن تناسب الجسم بطريقة ممتعة وخالية من الضغط. اللمسة الخفيفة المتدفقة تعطي النتيجة الأكثر أناقة.
        - generic [ref=e226]:
          - generic [ref=e227]: 💡
          - generic [ref=e228]:
            - generic [ref=e229]: معلومة ممتعة!
            - text: "كُتبت أشهر قصة لحورية بحر في الثقافة الناطقة بالإنجليزية — حورية البحر الصغيرة — بواسطة هانس كريستيان أندرسن عام 1837. تختلف القصة الأصلية كثيرًا عن الفيلم المتحرك: فهي أكثر حزنًا وحلاوة، وتهدف إلى التأمل في التضحية والشوق ومعنى امتلاك الروح."
      - generic [ref=e230]:
        - heading "23–36 — الخصر والحراشف" [level=3] [ref=e231]
        - paragraph [ref=e232]: تتبع النقاط من 23 إلى 36 لرسم الجزء الأوسط حيث يتحول شكل الإنسان إلى ذيل السمكة — الجزء الأكثر تميزًا في حورية البحر من الرسمة بأكملها. يتعلم الأطفال هنا تتبع شكل يضيق ثم يتسع مرة أخرى. يكافئ هذا الجزء الأوسط الصبر والبحث الدقيق عن النقاط.
        - generic [ref=e233]:
          - generic [ref=e234]: 💡
          - generic [ref=e235]:
            - generic [ref=e236]: معلومة ممتعة!
            - text: يعتقد العلماء أن أسطورة حورية البحر ربما نشأت جزئيًا من مشاهدة البحارة لأبقار البحر (الأطوم) في عرض البحر. من مسافة بعيدة، يمكن لبقرة البحر التي تطفو للتنفس — بجسمها المستدير وذيلها الشبيه بالمجداف — أن تبدو شبيهة بالإنسان بشكل مدهش. إنه تفسير متسامح، لكن الوحدة والمسافة تفعلان أشياء رائعة بالخيال.
      - generic [ref=e237]:
        - heading "37–46 — ذيل السمكة" [level=3] [ref=e238]
        - paragraph [ref=e239]: صل النقاط من 37 إلى 46 لرسم ذيل السمكة الطويل الرشيق وهو ينساب إلى الأسفل. هذا هو الجزء الأكثر إمتاعًا في اللعبة — يشعر الأطفال بأن حورية البحر تأخذ شكلها النهائي المميز. تعمل الضربات الطويلة المتدفقة بشكل رائع هنا. شجّع الأطفال على الرسم من الكتف وليس فقط من المعصم.
        - generic [ref=e240]:
          - generic [ref=e241]: 💡
          - generic [ref=e242]:
            - generic [ref=e243]: معلومة ممتعة!
            - text: "في معظم فولكلور حوريات البحر، يوصف الذيل بأنه متلألئ — يلمع بألوان متعددة مثل فقاعة الصابون أو حرشفة السمكة تحت أشعة الشمس. عند تلوين هذه اللعبة، لا توجد إجابة خاطئة: الفضي أو الأزرق المحيطي أو الأخضر الزمردي أو الثلاثة معًا، كلها خيارات صحيحة بنفس القدر!"
      - generic [ref=e244]:
        - heading "47–54 — زعانف الذيل" [level=3] [ref=e245]
        - paragraph [ref=e246]: أنهِ اللعبة بتوصيل النقاط من 47 إلى 54 لإضافة زعانف الذيل الواسعة المتدفقة التي تكمل صورة حورية البحر. ثماني نقاط فقط حتى خط النهاية — شجّع الأطفال على أن تكون كل نقطة مهمة وأن ينهوا الرسم بلمسة واثقة ورشيقة. زعنفة الذيل هي نقطة النهاية لحورية البحر!
        - generic [ref=e247]:
          - generic [ref=e248]: 💡
          - generic [ref=e249]:
            - generic [ref=e250]: معلومة ممتعة!
            - text: تتحرك ذيول الأسماك من جانب إلى آخر، لكن ذيول الحيتان والدلافين — التي تسمى الزعانف الذيلية — تتحرك من أعلى إلى أسفل. لو كانت حورية البحر موجودة فعلاً، يتجادل العلماء حول أي نوع من الذيل سيكون أنسب لجسم علوي بشري الشكل. الإجابة، بناءً على طريقة حركة الوركين البشريين، ستكون على الأرجح النمط الرأسي كذيل الدلفين.
    - generic [ref=e251]:
      - generic [ref=e252]:
        - paragraph [ref=e253]: More free Ocean printables
        - heading "قد يعجبك أيضًا" [level=2] [ref=e254]
      - generic [ref=e255]:
        - article [ref=e256]:
          - link [ref=e257] [cursor=pointer]:
            - /url: /ar/ocean/merman-dot-to-dot-puzzle/
            - img "رجل بحر يخرج من الأمواج عبر 44 نقطة سهلة في ورقة لمرحلة الروضة" [ref=e258]
          - generic [ref=e259]:
            - paragraph [ref=e260]: Ocean
            - heading "رجل البحر" [level=3] [ref=e261]
            - generic [ref=e262]:
              - generic [ref=e263]: الأعمار 4-7
              - generic [ref=e264]: 1–44 نقطة
            - link "عرض وتحميل" [ref=e265] [cursor=pointer]:
              - /url: /ar/ocean/merman-dot-to-dot-puzzle/
        - article [ref=e268]:
          - link [ref=e269] [cursor=pointer]:
            - /url: /ar/ocean/seahorse-dot-to-dot-puzzle/
            - img "فرس بحر صغير يطفو منتصبًا محددًا بـ 35 نقطة فقط على ورقة مجانية" [ref=e270]
          - generic [ref=e271]:
            - paragraph [ref=e272]: Ocean
            - heading "فرس البحر" [level=3] [ref=e273]
            - generic [ref=e274]:
              - generic [ref=e275]: الأعمار 4-7
              - generic [ref=e276]: 1–35 نقطة
            - link "عرض وتحميل" [ref=e277] [cursor=pointer]:
              - /url: /ar/ocean/seahorse-dot-to-dot-puzzle/
        - article [ref=e280]:
          - link [ref=e281] [cursor=pointer]:
            - /url: /ar/ocean/whale-dot-to-dot-puzzle/
            - img "حوت ضخم في منتصف السباحة وظهره منحنٍ عبر 42 نقطة مرقّمة للطباعة" [ref=e282]
          - generic [ref=e283]:
            - paragraph [ref=e284]: Ocean
            - heading "الحوت" [level=3] [ref=e285]
            - generic [ref=e286]:
              - generic [ref=e287]: الأعمار 4-7
              - generic [ref=e288]: 1–42 نقطة
            - link "عرض وتحميل" [ref=e289] [cursor=pointer]:
              - /url: /ar/ocean/whale-dot-to-dot-puzzle/
    - region "الأسئلة المتكررة" [ref=e292]:
      - generic [ref=e293]:
        - paragraph [ref=e294]: الأسئلة الشائعة
        - heading "الأسئلة المتكررة" [level=2] [ref=e295]
      - generic [ref=e296]:
        - group [ref=e297]:
          - generic "كم عدد النقاط في لغز توصيل النقاط «حورية البحر»؟" [ref=e298] [cursor=pointer]
        - group [ref=e301]:
          - generic "هل ورقة «حورية البحر» لتوصيل النقاط مجانية؟" [ref=e302] [cursor=pointer]
        - group [ref=e305]:
          - generic "ما العمر المناسب لورقة «حورية البحر»؟" [ref=e306] [cursor=pointer]
        - group [ref=e309]:
          - generic "ما المهارات التي ينمّيها لغز «حورية البحر»؟" [ref=e310] [cursor=pointer]
        - group [ref=e313]:
          - generic "ما المعلومة الممتعة في هذا اللغز؟" [ref=e314] [cursor=pointer]
  - region [ref=e317]:
    - generic [ref=e318]:
      - generic [ref=e319]:
        - generic [ref=e324]:
          - paragraph [ref=e325]: الأكثر رواجًا هذا الأسبوع
          - heading "الألغاز الأكثر تنزيلًا" [level=2] [ref=e326]
        - list [ref=e327]:
          - listitem [ref=e328]:
            - generic [ref=e329]: "1"
            - link "تحدي تي ركس 61 نقطة" [ref=e330] [cursor=pointer]:
              - /url: /ar/dinosaurs/trex-61-dot-to-dot-puzzle/
            - generic "23 عملية تنزيل أو أكثر" [ref=e331]: 23+
          - listitem [ref=e335]:
            - generic [ref=e336]: "2"
            - link "حورية البحر" [ref=e337] [cursor=pointer]:
              - /url: /ar/ocean/mermaid-dot-to-dot-puzzle/
            - generic "20 عملية تنزيل أو أكثر" [ref=e338]: 20+
          - listitem [ref=e342]:
            - generic [ref=e343]: "3"
            - link "Jellyfish" [ref=e344] [cursor=pointer]:
              - /url: /ar/ocean/jellyfish-dot-to-dot-puzzle/
            - generic "10 عملية تنزيل أو أكثر" [ref=e345]: 10+
          - listitem [ref=e349]:
            - generic [ref=e350]: "4"
            - link "Cute Puppy" [ref=e351] [cursor=pointer]:
              - /url: /ar/cute/cute-puppy-dot-to-dot-puzzle/
            - generic "9 عملية تنزيل أو أكثر" [ref=e352]: 9+
          - listitem [ref=e356]:
            - generic [ref=e357]: "5"
            - link "Spring Horse" [ref=e358] [cursor=pointer]:
              - /url: /ar/playgrounds/spring-horse-playground-dot-to-dot-puzzle/
            - generic "7 عملية تنزيل أو أكثر" [ref=e359]: 7+
          - listitem [ref=e363]:
            - generic [ref=e364]: "6"
            - link "Spinosaurus" [ref=e365] [cursor=pointer]:
              - /url: /ar/dinosaurs/spinosaurus/
            - generic "7 عملية تنزيل أو أكثر" [ref=e366]: 7+
          - listitem [ref=e370]:
            - generic [ref=e371]: "7"
            - link "Snowdrop Flower" [ref=e372] [cursor=pointer]:
              - /url: /ar/flowers/snowdrop-flower-dot-to-dot-puzzle/
            - generic "7 عملية تنزيل أو أكثر" [ref=e373]: 7+
          - listitem [ref=e377]:
            - generic [ref=e378]: "8"
            - link "زحليقة الملعب" [ref=e379] [cursor=pointer]:
              - /url: /ar/playgrounds/slide-playgrounds-dot-to-dot-puzzle/
            - generic "6 عملية تنزيل أو أكثر" [ref=e380]: 6+
      - generic [ref=e384]:
        - generic [ref=e389]:
          - paragraph [ref=e390]: مطبوعات جديدة
          - heading "المضاف حديثًا" [level=3] [ref=e391]
        - list [ref=e392]:
          - listitem [ref=e393]:
            - generic [ref=e394]: "1"
            - link "Circus Ringmaster Bear" [ref=e395] [cursor=pointer]:
              - /url: /ar/circus/circus-ringmaster-bear-dot-to-dot-puzzle/
            - generic [ref=e396]: جديد
          - listitem [ref=e397]:
            - generic [ref=e398]: "2"
            - link "Circus Tent" [ref=e399] [cursor=pointer]:
              - /url: /ar/circus/circus-tent-dot-to-dot-puzzle/
            - generic [ref=e400]: جديد
          - listitem [ref=e401]:
            - generic [ref=e402]: "3"
            - link "Space Rover" [ref=e403] [cursor=pointer]:
              - /url: /ar/space/space-rover-dot-to-dot-puzzle/
            - generic [ref=e404]: جديد
          - listitem [ref=e405]:
            - generic [ref=e406]: "4"
            - link "Ringed Planet" [ref=e407] [cursor=pointer]:
              - /url: /ar/space/ringed-planet-dot-to-dot-puzzle/
            - generic [ref=e408]: جديد
  - generic "شاركني" [ref=e409]:
    - generic [ref=e410]:
      - link "مشاركة — WhatsApp" [ref=e411] [cursor=pointer]:
        - /url: https://wa.me/?text=%D8%AD%D9%88%D8%B1%D9%8A%D8%A9%20%D8%A7%D9%84%D8%A8%D8%AD%D8%B1%3A%20%D9%88%D8%B1%D9%82%D8%A9%20%D8%B3%D8%AD%D8%B1%D9%8A%D8%A9%20%D9%84%D8%AA%D9%88%D8%B5%D9%8A%D9%84%2054%20%D9%86%D9%82%D8%B7%D8%A9%20%D9%85%D8%AC%D8%A7%D9%86%D9%8B%D8%A7%20%7C%20DotToDotFreePrintables.com%20https%3A%2F%2Fdottodotfreeprintables.com%2Far%2Focean%2Fmermaid-dot-to-dot-puzzle%2F
      - link "مشاركة — Facebook" [ref=e414] [cursor=pointer]:
        - /url: https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdottodotfreeprintables.com%2Far%2Focean%2Fmermaid-dot-to-dot-puzzle%2F
      - link "مشاركة — Pinterest" [ref=e417] [cursor=pointer]:
        - /url: https://pinterest.com/pin/create/button/?url=https%3A%2F%2Fdottodotfreeprintables.com%2Far%2Focean%2Fmermaid-dot-to-dot-puzzle%2F&description=%D8%AD%D9%88%D8%B1%D9%8A%D8%A9%20%D8%A7%D9%84%D8%A8%D8%AD%D8%B1%3A%20%D9%88%D8%B1%D9%82%D8%A9%20%D8%B3%D8%AD%D8%B1%D9%8A%D8%A9%20%D9%84%D8%AA%D9%88%D8%B5%D9%8A%D9%84%2054%20%D9%86%D9%82%D8%B7%D8%A9%20%D9%85%D8%AC%D8%A7%D9%86%D9%8B%D8%A7%20%7C%20DotToDotFreePrintables.com
      - link "مشاركة — X" [ref=e420] [cursor=pointer]:
        - /url: https://twitter.com/intent/tweet?url=https%3A%2F%2Fdottodotfreeprintables.com%2Far%2Focean%2Fmermaid-dot-to-dot-puzzle%2F&text=%D8%AD%D9%88%D8%B1%D9%8A%D8%A9%20%D8%A7%D9%84%D8%A8%D8%AD%D8%B1%3A%20%D9%88%D8%B1%D9%82%D8%A9%20%D8%B3%D8%AD%D8%B1%D9%8A%D8%A9%20%D9%84%D8%AA%D9%88%D8%B5%D9%8A%D9%84%2054%20%D9%86%D9%82%D8%B7%D8%A9%20%D9%85%D8%AC%D8%A7%D9%86%D9%8B%D8%A7%20%7C%20DotToDotFreePrintables.com
      - button "نسخ الرابط" [ref=e423] [cursor=pointer]
  - contentinfo [ref=e427]:
    - generic [ref=e428]: DotToDotFreePrintables.com
    - paragraph [ref=e434]: أوراق توصيل نقاط مجانية للأطفال وأولياء الأمور والمعلمين. جميع الألغاز مجانية للتحميل والطباعة والمشاركة.
    - navigation "أوراق توصيل نقاط مجانية للأطفال وأولياء الأمور والمعلمين. جميع الألغاز مجانية للتحميل والطباعة والمشاركة." [ref=e435]:
      - link "المدونة" [ref=e436] [cursor=pointer]:
        - /url: /ar/blog/
      - link "الأسئلة الشائعة" [ref=e437] [cursor=pointer]:
        - /url: /ar/#faq
      - link "الملاحظات" [ref=e438] [cursor=pointer]:
        - /url: /ar/#feedback
      - link "من نحن" [ref=e439] [cursor=pointer]:
        - /url: /ar/about/
      - link "اتصل بنا" [ref=e440] [cursor=pointer]:
        - /url: /ar/contact/
      - link "سياسة الخصوصية" [ref=e441] [cursor=pointer]:
        - /url: /ar/privacy-policy/
      - link "شروط الاستخدام" [ref=e442] [cursor=pointer]:
        - /url: /ar/terms/
      - link "حزمة ألغاز توصيل النقاط" [ref=e443] [cursor=pointer]:
        - /url: /ar/premium/
      - link "خريطة الموقع" [ref=e444] [cursor=pointer]:
        - /url: /sitemap.xml
    - generic "أوراق توصيل نقاط مجانية للأطفال وأولياء الأمور والمعلمين. جميع الألغاز مجانية للتحميل والطباعة والمشاركة." [ref=e445]:
      - link "YouTube" [ref=e446] [cursor=pointer]:
        - /url: https://www.youtube.com/@dottodotfreeprintables_com
      - link "Pinterest" [ref=e450] [cursor=pointer]:
        - /url: https://www.pinterest.com/hellokidsbookworld/
    - paragraph [ref=e453]: © 2026 DotToDotFreePrintables.com · أنشطة مجانية للطباعة للأطفال - v1.0.0
  - alert [ref=e454]
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