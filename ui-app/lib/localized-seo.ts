/** Localized SEO copy for locales whose route metadata has been completed. */
export function isArabic(locale: string) {
  return locale === 'ar' || locale.startsWith('ar-');
}

export function isSpanish(locale: string) {
  return locale === 'es' || locale.startsWith('es-');
}

export function isGerman(locale: string) {
  return locale === 'de' || locale.startsWith('de-');
}

export function isRussian(locale: string) {
  return locale === 'ru' || locale.startsWith('ru-');
}

export function isFinnish(locale: string) {
  return locale === 'fi' || locale.startsWith('fi-');
}

export function isDutch(locale: string) {
  return locale === 'nl' || locale.startsWith('nl-');
}

export function isFrench(locale: string) {
  return locale === 'fr' || locale.startsWith('fr-');
}

export function isItalian(locale: string) {
  return locale === 'it' || locale.startsWith('it-');
}

export function isJapanese(locale: string) {
  return locale === 'ja' || locale.startsWith('ja-');
}

/** European Portuguese only — pt-BR (Brazilian) is handled separately and must not match here. */
export function isPortuguese(locale: string) {
  return locale === 'pt';
}

const russianPuzzleNames: Record<string, string> = {
  'Maple Leaf': 'Кленовый лист',
  'Polar Bear': 'Белый медведь',
  Moose: 'Лось',
  Raccoon: 'Енот',
  'Cute Happy Frog': 'Милая весёлая лягушка',
  'Cute Princess': 'Милая принцесса',
  Triceratops: 'Трицератопс',
  Velociraptor: 'Велоцираптор',
};

function localizedPuzzleName(locale: string, name: string) {
  return isRussian(locale) ? russianPuzzleNames[name] ?? name : name;
}

const puzzleTitleSuffixes: Record<string, string> = {
  ar: 'لعبة توصيل النقاط قابلة للطباعة - ورقة عمل PDF مجانية للأطفال',
  az: 'Nöqtələri birləşdirmə çap materialı - Uşaqlar üçün pulsuz PDF iş vərəqi',
  cs: 'Spojovačka k vytisknutí - Bezplatný pracovní list PDF pro děti',
  da: 'Prik-til-prik til udskrivning - Gratis PDF-opgaveark til børn',
  de: 'Zahlenbild zum Ausdrucken (Punkte verbinden) - Kostenloses PDF-Arbeitsblatt für Kinder',
  el: 'Εκτυπώσιμο παιχνίδι ένωσης τελειών - Δωρεάν φύλλο εργασίας PDF για παιδιά',
  en: 'Dot-to-Dot Printable - Free PDF Worksheet for Kids',
  es: 'Dibujo de unir puntos para imprimir - Ficha PDF gratis para niños',
  fa: 'پازل نقطه‌به‌نقطه قابل چاپ - کاربرگ PDF رایگان برای کودکان',
  fi: 'Tulostettava pisteestä pisteeseen - Ilmainen PDF-tehtävä lapsille',
  fr: 'Jeu de points à relier à imprimer - Fiche PDF gratuite pour enfants',
  hr: 'Spoji točke za ispis - Besplatni PDF radni list za djecu',
  hu: 'Nyomtatható pontról pontra feladat - Ingyenes PDF munkalap gyerekeknek',
  id: 'Lembar menghubungkan titik untuk dicetak - Lembar kerja PDF gratis untuk anak-anak',
  it: 'Unisci i puntini da stampare - Scheda PDF gratuita per bambini',
  ja: '印刷できる点つなぎ（てんつなぎ）- 子ども向け無料プリントPDF',
  ko: '인쇄용 점 잇기 - 어린이용 무료 PDF 학습지',
  lt: 'Taškų sujungimo užduotis spausdinimui - Nemokamas PDF užduočių lapas vaikams',
  lv: 'Drukājama punktu savienošanas spēle - Bezmaksas PDF darba lapa bērniem',
  nl: 'Van punt naar punt om te printen - Gratis PDF-werkblad voor kinderen',
  no: 'Punkt-til-punkt til utskrift - Gratis PDF-oppgaveark for barn',
  pl: 'Połącz kropki do druku - Bezpłatna karta pracy PDF dla dzieci',
  pt: 'Desenho de ligar os pontos para imprimir - Ficha PDF grátis para crianças',
  'pt-BR': 'Desenho de ligar os pontos para imprimir - Folha de atividades PDF grátis para crianças',
  ro: 'Unește punctele de imprimat - Fișă de lucru PDF gratuită pentru copii',
  ru: 'Соедини точки для печати - бесплатный PDF-лист для детей',
  sk: 'Spájanie bodiek na vytlačenie - Bezplatný pracovný list PDF pre deti',
  sl: 'Poveži pike za tiskanje - Brezplačen delovni list PDF za otroke',
  sv: 'Prick-till-prick att skriva ut - Gratis PDF-arbetsblad för barn',
  th: 'แบบลากเส้นต่อจุดสำหรับพิมพ์ - ใบงาน PDF ฟรีสำหรับเด็ก',
  tr: 'Yazdırılabilir noktaları birleştirme - Çocuklar için ücretsiz PDF çalışma sayfası',
  uk: 'З’єднай крапки для друку - безкоштовний PDF-зошит для дітей',
  vi: 'Tranh nối các chấm để in - Phiếu bài tập PDF miễn phí cho trẻ em'
};

export function localizedPuzzleTitle(locale: string, name: string) {
  const language = locale in puzzleTitleSuffixes ? locale : locale.split('-')[0];
  const suffix = puzzleTitleSuffixes[language] ?? puzzleTitleSuffixes.en;
  return `${localizedPuzzleName(locale, name)} ${suffix}`;
}

const puzzleDescriptionTemplates: Record<string, string> = {
  ar: 'حمّل ورقة توصيل النقاط المجانية {name} للأطفال من عمر {min} إلى {max} سنوات. صِل النقاط من 1 إلى {dots} لتكشف الصورة. ملف PDF جاهز للطباعة، دون تسجيل.',
  az: '{min}–{max} yaşlı uşaqlar üçün pulsuz {name} nöqtələri birləşdirmə vərəqini endirin. Şəkli üzə çıxarmaq üçün 1-dən {dots}-dək nöqtələri birləşdirin. Çapa hazır PDF, qeydiyyat tələb olunmur.',
  cs: 'Stáhněte si zdarma spojovačku {name} pro děti ve věku {min}–{max} let. Spojte body od 1 do {dots} a odhalte obrázek. PDF je připravené k tisku, bez registrace.',
  da: 'Download den gratis {name} prik-til-prik-opgave til børn på {min}–{max} år. Forbind prikkerne fra 1 til {dots} for at afsløre billedet. Printklar PDF, ingen tilmelding.',
  de: 'Laden Sie das kostenlose Zahlenbild „{name}“ (Von Punkt zu Punkt) für Kinder von {min} bis {max} Jahren herunter. Verbinden Sie die Punkte von 1 bis {dots} und entdecken Sie das Bild. Druckfertiges PDF, keine Anmeldung.',
  el: 'Κατεβάστε δωρεάν το παιχνίδι ένωσης τελειών {name} για παιδιά {min}–{max} ετών. Ενώστε τις τελείες από το 1 έως το {dots} για να αποκαλύψετε την εικόνα. PDF έτοιμο για εκτύπωση, χωρίς εγγραφή.',
  en: 'Download the free {name} dot-to-dot printable for kids ages {min}–{max}. Connect dots 1–{dots} to reveal the picture. Print-ready PDF, no sign-up required.',
  es: 'Descarga gratis la ficha de {name} para unir puntos, para niños de {min} a {max} años. Une los puntos del 1 al {dots} para descubrir el dibujo. PDF listo para imprimir, sin registro.',
  fa: 'کاربرگ رایگان نقطه‌به‌نقطه {name} را برای کودکان {min} تا {max} سال دانلود کنید. نقطه‌های 1 تا {dots} را به هم وصل کنید تا تصویر آشکار شود. فایل PDF آماده چاپ، بدون نیاز به ثبت‌نام.',
  fi: 'Lataa ilmainen {name}-pisteestä pisteeseen -tehtävä {min}–{max}-vuotiaille lapsille. Yhdistä pisteet 1–{dots} ja paljasta kuva. Tulostusvalmis PDF, ei rekisteröitymistä.',
  fr: 'Téléchargez gratuitement le jeu de points à relier {name} pour les enfants de {min} à {max} ans. Reliez les points de 1 à {dots} pour révéler l’image. PDF prêt à imprimer, sans inscription.',
  hr: 'Preuzmite besplatnu spoj-točke aktivnost {name} za djecu od {min} do {max} godina. Spojite točke od 1 do {dots} i otkrijte sliku. PDF spreman za ispis, bez registracije.',
  hu: 'Töltse le az ingyenes {name} pontról pontra feladatot {min}–{max} éves gyerekeknek. Kösse össze az 1-től {dots}-ig számozott pontokat a kép felfedéséhez. Nyomtatásra kész PDF, regisztráció nélkül.',
  id: 'Unduh lembar menghubungkan titik {name} gratis untuk anak usia {min}–{max} tahun. Hubungkan titik 1 sampai {dots} untuk menampilkan gambarnya. PDF siap cetak, tanpa perlu mendaftar.',
  it: 'Scarica gratis la scheda unisci i puntini di {name} per bambini da {min} a {max} anni. Unisci i punti da 1 a {dots} per scoprire l’immagine. PDF pronto da stampare, senza registrazione.',
  ja: '{min}～{max}歳のお子さま向けの無料の{name}点つなぎプリントをダウンロード。1から{dots}までの点をつないで絵を完成させましょう。印刷用PDF、登録不要です。',
  ko: '{min}~{max}세 어린이를 위한 무료 {name} 점 잇기 학습지를 다운로드하세요. 1부터 {dots}까지 점을 이어 그림을 완성하세요. 인쇄용 PDF이며 가입이 필요 없습니다.',
  lt: 'Atsisiųskite nemokamą {name} taškų sujungimo užduotį {min}–{max} metų vaikams. Sujunkite taškus nuo 1 iki {dots} ir atskleiskite paveikslėlį. Spausdinimui paruoštas PDF, registruotis nereikia.',
  lv: 'Lejupielādējiet bezmaksas {name} punktu savienošanas uzdevumu {min}–{max} gadus veciem bērniem. Savienojiet punktus no 1 līdz {dots}, lai atklātu attēlu. Drukāšanai gatavs PDF, reģistrācija nav vajadzīga.',
  nl: 'Download de gratis {name} van-punt-naar-punt-puzzel voor kinderen van {min} tot {max} jaar. Verbind de punten van 1 tot {dots} en ontdek de afbeelding. Printklare PDF, geen account nodig.',
  no: 'Last ned den gratis {name} punkt-til-punkt-oppgaven for barn fra {min} til {max} år. Koble sammen punktene fra 1 til {dots} for å avsløre bildet. Utskriftsklar PDF, ingen registrering.',
  pl: 'Pobierz bezpłatną układankę {name} „połącz kropki” dla dzieci w wieku {min}–{max} lat. Połącz punkty od 1 do {dots}, aby odkryć obrazek. PDF gotowy do druku, bez rejestracji.',
  pt: 'Descarregue grátis a ficha de ligar os pontos {name} para crianças dos {min} aos {max} anos. Ligue os pontos de 1 a {dots} para revelar a imagem. PDF pronto a imprimir, sem registo.',
  'pt-BR': 'Baixe grátis a atividade de ligar os pontos {name} para crianças de {min} a {max} anos. Ligue os pontos de 1 a {dots} para revelar a imagem. PDF pronto para imprimir, sem cadastro.',
  ro: 'Descarcă gratuit fișa unește punctele {name} pentru copii de {min}–{max} ani. Unește punctele de la 1 la {dots} pentru a descoperi imaginea. PDF gata de imprimat, fără înregistrare.',
  ru: 'Скачайте бесплатное задание «{name}» по точкам для детей {min}–{max} лет. Соедините точки от 1 до {dots}, чтобы открыть рисунок. PDF готов к печати, регистрация не нужна.',
  sk: 'Stiahnite si zadarmo spájanie bodiek {name} pre deti vo veku {min}–{max} rokov. Spojte body od 1 do {dots} a odhaľte obrázok. PDF pripravené na tlač, bez registrácie.',
  sl: 'Prenesite brezplačno povezovalnico pik {name} za otroke, stare od {min} do {max} let. Povežite pike od 1 do {dots} in odkrijte sliko. PDF je pripravljen za tiskanje, brez registracije.',
  sv: 'Ladda ner den kostnadsfria {name} prick-till-prick-uppgiften för barn {min}–{max} år. Förbind punkterna från 1 till {dots} för att avslöja bilden. Utskriftsklar PDF, ingen registrering.',
  th: 'ดาวน์โหลดใบงานลากเส้นต่อจุด {name} ฟรีสำหรับเด็กอายุ {min}–{max} ปี ลากเส้นเชื่อมจุดจาก 1 ถึง {dots} เพื่อเผยภาพ ไฟล์ PDF พร้อมพิมพ์ ไม่ต้องสมัครสมาชิก',
  tr: '{min}–{max} yaş arası çocuklar için ücretsiz {name} noktaları birleştirme etkinliğini indirin. Resmi ortaya çıkarmak için 1’den {dots}’e kadar noktaları birleştirin. Yazdırmaya hazır PDF, üyelik gerekmez.',
  uk: 'Завантажте безкоштовне завдання «{name}» зі з’єднання крапок для дітей {min}–{max} років. З’єднайте крапки від 1 до {dots}, щоб відкрити малюнок. PDF готовий до друку, реєстрація не потрібна.',
  vi: 'Tải miễn phí bài tập nối các chấm {name} dành cho trẻ từ {min}–{max} tuổi. Nối các điểm từ 1 đến {dots} để khám phá bức tranh. PDF sẵn sàng để in, không cần đăng ký.'
};

export function localizedPuzzleDescription(
  locale: string,
  puzzle: { name: string; age?: string; dots?: number }
) {
  const language = locale in puzzleDescriptionTemplates ? locale : locale.split('-')[0];
  const template = puzzleDescriptionTemplates[language] ?? puzzleDescriptionTemplates.en;
  const ageRange = puzzle.age?.match(/(\d+)\D+(\d+)/);
  return template
    .replaceAll('{name}', localizedPuzzleName(locale, puzzle.name))
    .replaceAll('{min}', ageRange?.[1] ?? '')
    .replaceAll('{max}', ageRange?.[2] ?? '')
    .replaceAll('{dots}', String(puzzle.dots ?? ''));
}

/**
 * Preferred alt-text entry point for puzzle images. If the puzzle content carries a
 * hand-written `seoImageAlt` (unique per puzzle, describing what's actually pictured —
 * not just "{name} + fixed phrase"), use that. Otherwise fall back to the templated
 * localizedPuzzlePreviewAlt/localizedPuzzleCardAlt below, which repeat one sentence
 * structure per locale with only the name swapped in.
 *
 * Multi-image puzzles: every puzzle today has exactly one image, so `seoImageAlt`
 * alone covers it. If a puzzle ever gains more than one image (e.g. separate preview
 * shots per color scheme, a gallery), add `seoImageAlt2`, `seoImageAlt3`, ... to that
 * puzzle's content entry — each MUST be its own keyword-rich, unique sentence
 * describing that specific image, not the same alt text repeated with a number
 * appended. Pass the 1-based `imageIndex` of the image being rendered (defaults to 1)
 * and this function will look up the matching `seoImageAlt{N}` field, falling back to
 * the plain `seoImageAlt` / templated alt if that specific index isn't set.
 */
export function puzzleImageAlt(
  locale: string,
  puzzle: { name: string; dots?: number; seoImageAlt?: string; [key: `seoImageAlt${number}`]: string | undefined },
  context: 'preview' | 'card',
  imageIndex: number = 1
): string {
  const indexed = imageIndex > 1 ? puzzle[`seoImageAlt${imageIndex}`] : undefined;
  if (indexed) return indexed;
  if (puzzle.seoImageAlt) return puzzle.seoImageAlt;
  return context === 'preview'
    ? localizedPuzzlePreviewAlt(locale, puzzle.name, puzzle.dots)
    : localizedPuzzleCardAlt(locale, puzzle.name);
}

export function localizedPuzzlePreviewAlt(locale: string, name: string, dots?: number) {
  const localizedName = localizedPuzzleName(locale, name);
  if (isArabic(locale)) {
    const instruction = dots ? ` — صِل النقاط من 1 إلى ${dots}` : '';
    return `معاينة لغز توصيل النقاط ${localizedName} القابل للطباعة${instruction}`;
  }
  if (isSpanish(locale)) return `Vista previa del dibujo de unir puntos ${localizedName} para imprimir${dots ? ` — une los puntos del 1 al ${dots}` : ''}`;
  if (isGerman(locale)) return `Vorschau der druckbaren Punkt-zu-Punkt-Vorlage ${localizedName}${dots ? ` — verbinde die Punkte von 1 bis ${dots}` : ''}`;
  if (isRussian(locale)) return `Предпросмотр задания по точкам «${localizedName}» для печати${dots ? ` — соедините точки от 1 до ${dots}` : ''}`;
  if (isFinnish(locale)) return `${localizedName} pisteestä pisteeseen tulostettava esikatselu${dots ? ` — yhdistä pisteet 1–${dots}` : ''}`;
  if (isDutch(locale)) return `Voorbeeld van de printbare punt-tot-punt puzzel ${localizedName}${dots ? ` — verbind de punten van 1 tot ${dots}` : ''}`;
  if (isFrench(locale)) return `Aperçu du jeu de points à relier ${localizedName} à imprimer${dots ? ` — relie les points de 1 à ${dots}` : ''}`;
  if (isItalian(locale)) return `Anteprima della scheda unisci i puntini ${localizedName} da stampare${dots ? ` — unisci i punti da 1 a ${dots}` : ''}`;
  if (isJapanese(locale)) return `印刷用点つなぎ「${localizedName}」のプレビュー${dots ? ` — 1から${dots}までの点をつなごう` : ''}`;
  if (isPortuguese(locale)) return `Pré-visualização da ficha de ligar os pontos ${localizedName} para imprimir${dots ? ` — liga os pontos de 1 a ${dots}` : ''}`;
  return `${localizedName} dot-to-dot printable puzzle preview${dots ? ` - connect 1 to ${dots} dots` : ''}`;
}

export function localizedPuzzleCardAlt(locale: string, name: string) {
  const localizedName = localizedPuzzleName(locale, name);
  if (isArabic(locale)) return `ورقة توصيل النقاط ${localizedName} المجانية القابلة للطباعة`;
  if (isSpanish(locale)) return `Ficha gratuita de ${localizedName} para unir puntos e imprimir`;
  if (isGerman(locale)) return `Kostenlose druckbare Punkt-zu-Punkt-Vorlage ${localizedName}`;
  if (isRussian(locale)) return `Бесплатное задание по точкам «${localizedName}» для печати`;
  if (isFinnish(locale)) return `${localizedName} ilmainen pisteestä pisteeseen tulostettava tehtävämoniste`;
  if (isDutch(locale)) return `Gratis printbare punt-tot-punt puzzel ${localizedName}`;
  if (isFrench(locale)) return `Fiche gratuite de ${localizedName} à imprimer, points à relier`;
  if (isItalian(locale)) return `Scheda gratuita da stampare di ${localizedName}, unisci i puntini`;
  if (isJapanese(locale)) return `無料で印刷できるてんつなぎプリント「${localizedName}」`;
  if (isPortuguese(locale)) return `Ficha grátis de ${localizedName} para imprimir, ligar os pontos`;
  return `${localizedName} free dot-to-dot printable worksheet`;
}

export function localizedSocialImageAlt(locale: string, fallback: string) {
  if (isGerman(locale)) return 'Kostenlose druckbare Punkt-zu-Punkt-Vorlage für Kinder';
  if (isRussian(locale)) return 'Бесплатное задание по точкам для детей для печати';
  if (isSpanish(locale)) return 'Ficha gratuita de unir puntos lista para imprimir para niños';
  if (isArabic(locale)) return 'ورقة توصيل نقاط مجانية قابلة للطباعة للأطفال';
  if (isFinnish(locale)) return 'Ilmainen pisteestä pisteeseen tulostettava lapsille';
  if (isDutch(locale)) return 'Gratis printbare punt-tot-punt puzzel voor kinderen';
  return fallback;
}

export function localizedSiteSeo(locale: string) {
  if (isGerman(locale)) return {
    title: 'Von Punkt zu Punkt & Zahlen verbinden kostenlos | PDF zum Ausdrucken',
    ogTitle: 'Von Punkt zu Punkt / Zahlen verbinden – kostenlose Rätsel für Kinder & Erwachsene',
    description: 'Von Punkt zu Punkt und Zahlen verbinden zum Ausdrucken, kostenlos als PDF: leichte Vorlagen für Kita und Grundschule bis zu Herausforderungen für Erwachsene. Tiere, Dinosaurier, Fahrzeuge und saisonale Motive. Ohne Anmeldung.'
  };
  if (isRussian(locale)) return {
    title: 'Бесплатные задания по точкам для детей | PDF для печати',
    ogTitle: 'Бесплатные рисунки по точкам и задания для детей',
    description: 'Скачивайте и распечатывайте бесплатные задания по точкам для детей: животные, динозавры, транспорт и сезонные темы в PDF. Без регистрации.'
  };
  if (isSpanish(locale)) return {
    title: 'Dibujos para unir puntos imprimibles gratis para niños | Hojas PDF',
    ogTitle: 'Dibujos y fichas de unir puntos gratis para niños',
    description: 'Descarga e imprime fichas gratuitas de unir puntos para niños: animales, dinosaurios, vehículos y temas de temporada en PDF. Sin registro.'
  };
  if (isFinnish(locale)) return {
    title: 'Pisteestä pisteeseen tulostettava lapsille — ilmaiset PDF-tehtävät',
    ogTitle: 'Pisteestä pisteeseen lapsille — ilmaisia tulostettavia tehtäviä',
    description: 'Lataa ja tulosta ilmaisia pisteestä pisteeseen lapsille tarkoitettuja tehtäviä: eläimiä, dinosauruksia, ajoneuvoja ja vuodenaikojen teemoja PDF-muodossa. Ei rekisteröitymistä.'
  };
  if (isDutch(locale)) return {
    title: 'Verbind de punten & van punt naar punt gratis | PDF om te printen',
    ogTitle: 'Verbind de punten / van punt naar punt – gratis puzzels voor kinderen & volwassenen',
    description: 'Verbind de punten en van punt naar punt om te printen, gratis als PDF: makkelijke werkbladen vanaf 10 stippen voor peuters tot uitdagingen met meer dan 100 stippen voor volwassenen. Dieren, dinosaurussen, voertuigen en seizoensthema\'s. Geen account nodig.'
  };
  if (isFrench(locale)) return {
    title: 'Points à relier & relie les points gratuit | PDF à imprimer',
    ogTitle: 'Points à relier / relie les points – jeux gratuits pour enfants & adultes',
    description: 'Points à relier et jeux de relie-les-points à imprimer, gratuits en PDF : fiches faciles pour la maternelle jusqu\'à des défis pour adultes. Animaux, dinosaures, véhicules et thèmes de saison. Sans inscription.'
  };
  if (isItalian(locale)) return {
    title: 'Unisci i puntini gratis | PDF da stampare per bambini',
    ogTitle: 'Unisci i puntini – puzzle gratuiti per bambini e adulti',
    description: 'Unisci i puntini da stampare gratis in PDF: schede facili per la scuola dell\'infanzia fino a sfide per adulti con oltre 100 punti. Animali, dinosauri, veicoli e temi stagionali. Senza registrazione.'
  };
  if (isJapanese(locale)) return {
    title: '無料の点つなぎ（てんつなぎ）プリント | 子ども向けPDF',
    ogTitle: '点つなぎ・数字つなぎ — 子どもから大人まで楽しめる無料プリント',
    description: '無料でダウンロード・印刷できるてんつなぎプリントPDF：幼児向けのやさしいプリントから、100以上の点をつなぐ大人向けの難しいプリントまで。動物、恐竜、乗り物、季節のテーマも。登録不要。'
  };
  if (isPortuguese(locale)) return {
    title: 'Ligar os pontos grátis para crianças | Fichas PDF para imprimir',
    ogTitle: 'Ligar os pontos — fichas gratuitas para crianças e adultos',
    description: 'Descarrega e imprime fichas grátis de ligar os pontos: animais, dinossauros, veículos e temas sazonais em PDF. Fichas fáceis para o pré-escolar e desafios com mais de 100 pontos para adultos. Sem registo.'
  };
  if (!isArabic(locale)) return null;
  return {
    title: 'لعبة توصيل النقاط للأطفال PDF مجانًا | أوراق توصيل الأرقام للطباعة',
    ogTitle: 'لعبة توصيل النقاط وتوصيل الأرقام — أوراق مجانية للأطفال والكبار',
    description: 'حمّل واطبع لعبة توصيل النقاط للأطفال مجانًا بصيغة PDF: أوراق توصيل الأرقام السهلة للصغار وتحديات تفوق 100 نقطة للكبار. حيوانات وديناصورات ومركبات وموضوعات موسمية، من دون تسجيل.'
  };
}

export function localizedPuzzleSeo(locale: string, puzzle: { name: string; age?: string; dots?: number }) {
  if (isGerman(locale)) {
    const dots = puzzle.dots ? `von 1 bis ${puzzle.dots}` : 'in der richtigen Reihenfolge';
    const dotsLabel = puzzle.dots ? ` bis ${puzzle.dots} Punkte` : '';
    const ageRange = puzzle.age?.match(/(\d+)\D+(\d+)/);
    const age = ageRange ? ` Empfohlen für Kinder von ${ageRange[1]} bis ${ageRange[2]} Jahren.` : '';
    return {
      title: `${puzzle.name} – Zahlen verbinden${dotsLabel} zum Ausdrucken, kostenloses PDF`,
      ogTitle: `${puzzle.name} – Von Punkt zu Punkt / Zahlen verbinden für Kinder`,
      description: `Laden Sie die kostenlose Vorlage „${puzzle.name}“ zum Ausdrucken herunter: von Punkt zu Punkt bzw. Zahlen verbinden ${dots}.${age} Druckfertiges PDF ohne Anmeldung.`,
      ogDescription: `Verbinde die Punkte ${dots} und entdecke ${puzzle.name}. Kostenlose druckbare Vorlage für Kinder.${age}`,
      imageAlt: `${puzzle.name}, kostenlose druckbare Punkt-zu-Punkt-Vorlage für Kinder`
    };
  }
  if (isRussian(locale)) {
    const dots = puzzle.dots ? `от 1 до ${puzzle.dots}` : 'по порядку';
    const ageRange = puzzle.age?.match(/(\d+)\D+(\d+)/);
    const age = ageRange ? ` Рекомендуется детям от ${ageRange[1]} до ${ageRange[2]} лет.` : '';
    return {
      title: `${puzzle.name} — бесплатное задание по точкам в PDF`,
      ogTitle: `${puzzle.name} — бесплатный рисунок по точкам для детей`,
      description: `Скачайте бесплатное задание «${puzzle.name}».${age} Соедините точки ${dots} и откройте рисунок. PDF готов к печати, регистрация не нужна.`,
      ogDescription: `Соедините точки ${dots}, чтобы открыть ${puzzle.name}. Бесплатное задание для детей, готовое к печати.${age}`,
      imageAlt: `${puzzle.name}, бесплатное задание по точкам для детей для печати`
    };
  }
  if (isSpanish(locale)) {
    const dots = puzzle.dots ? `del 1 al ${puzzle.dots}` : 'numerados';
    const ageRange = puzzle.age?.match(/(\d+)\D+(\d+)/);
    const localizedAge = ageRange
      ? `niños de ${ageRange[1]} a ${ageRange[2]} años`
      : puzzle.age?.replace(/^Ages?\s*/i, '').trim();
    const age = localizedAge ? ` Recomendada para ${localizedAge}.` : '';
    return {
      title: `${puzzle.name} — Ficha de unir puntos gratis en PDF`,
      ogTitle: `${puzzle.name} — Dibujo de unir puntos gratis para niños`,
      description: `Descarga gratis la ficha de ${puzzle.name}.${age} Une los puntos ${dots} y descubre el dibujo. PDF listo para imprimir, sin registro.`,
      ogDescription: `Une los puntos ${dots} para descubrir ${puzzle.name}. Ficha gratuita y lista para imprimir para niños.${age}`,
      imageAlt: `${puzzle.name}, ficha imprimible gratuita de unir puntos para niños`
    };
  }
  if (isFinnish(locale)) {
    const dots = puzzle.dots ? `1–${puzzle.dots}` : 'järjestyksessä';
    const ageRange = puzzle.age?.match(/(\d+)\D+(\d+)/);
    const age = ageRange ? ` Suositellaan ${ageRange[1]}–${ageRange[2]}-vuotiaille.` : '';
    return {
      title: `${puzzle.name} — ilmainen pisteestä pisteeseen tulostettava PDF`,
      ogTitle: `${puzzle.name} — ilmainen pisteestä pisteeseen tulostettava lapsille`,
      description: `Lataa ilmainen ${puzzle.name}-pisteestä pisteeseen tulostettava.${age} Yhdistä pisteet ${dots} ja paljasta kuva. Tulostusvalmis PDF, ei rekisteröitymistä.`,
      ogDescription: `Yhdistä pisteet ${dots} ja paljasta ${puzzle.name}. Ilmainen pisteestä pisteeseen tulostettava lapsille.${age}`,
      imageAlt: `${puzzle.name}, ilmainen pisteestä pisteeseen tulostettava lapsille`
    };
  }
  if (isDutch(locale)) {
    const dots = puzzle.dots ? `van 1 tot ${puzzle.dots}` : 'in de juiste volgorde';
    const dotsLabel = puzzle.dots ? ` tot ${puzzle.dots} stippen` : '';
    const ageRange = puzzle.age?.match(/(\d+)\D+(\d+)/);
    const age = ageRange ? ` Geschikt voor kinderen van ${ageRange[1]} tot ${ageRange[2]} jaar.` : '';
    return {
      title: `${puzzle.name} – verbind de punten${dotsLabel} om te printen, gratis PDF`,
      ogTitle: `${puzzle.name} – van punt naar punt / verbind de punten voor kinderen`,
      description: `Download het gratis werkblad "${puzzle.name}" om te printen: verbind de punten ${dots}.${age} Printklare PDF, geen account nodig.`,
      ogDescription: `Verbind de punten ${dots} en ontdek ${puzzle.name}. Gratis printbare puzzel voor kinderen.${age}`,
      imageAlt: `${puzzle.name}, gratis printbare punt-tot-punt puzzel voor kinderen`
    };
  }
  if (isFrench(locale)) {
    const dots = puzzle.dots ? `de 1 à ${puzzle.dots}` : 'dans l\'ordre';
    const dotsLabel = puzzle.dots ? ` (${puzzle.dots} points)` : '';
    const ageRange = puzzle.age?.match(/(\d+)\D+(\d+)/);
    const age = ageRange ? ` Recommandé pour les enfants de ${ageRange[1]} à ${ageRange[2]} ans.` : '';
    return {
      title: `${puzzle.name} – Points à relier${dotsLabel} à imprimer, PDF gratuit`,
      ogTitle: `${puzzle.name} – Points à relier pour enfants`,
      description: `Téléchargez gratuitement la fiche "${puzzle.name}" à imprimer : reliez les points ${dots}.${age} PDF prêt à imprimer, sans inscription.`,
      ogDescription: `Reliez les points ${dots} pour révéler ${puzzle.name}. Fiche gratuite prête à imprimer pour enfants.${age}`,
      imageAlt: `${puzzle.name}, fiche gratuite de points à relier à imprimer pour enfants`
    };
  }
  if (isItalian(locale)) {
    const dots = puzzle.dots ? `da 1 a ${puzzle.dots}` : 'in ordine';
    const dotsLabel = puzzle.dots ? ` (${puzzle.dots} puntini)` : '';
    const ageRange = puzzle.age?.match(/(\d+)\D+(\d+)/);
    const age = ageRange ? ` Consigliata per bambini da ${ageRange[1]} a ${ageRange[2]} anni.` : '';
    return {
      title: `${puzzle.name} – Unisci i puntini${dotsLabel} da stampare, PDF gratis`,
      ogTitle: `${puzzle.name} – Unisci i puntini per bambini`,
      description: `Scarica gratis la scheda "${puzzle.name}" da stampare: unisci i puntini ${dots}.${age} PDF pronto da stampare, senza registrazione.`,
      ogDescription: `Unisci i puntini ${dots} per scoprire ${puzzle.name}. Scheda gratuita pronta da stampare per bambini.${age}`,
      imageAlt: `${puzzle.name}, scheda gratuita da stampare per unire i puntini per bambini`
    };
  }
  if (isJapanese(locale)) {
    const dots = puzzle.dots ? `1から${puzzle.dots}まで` : '順番に';
    const ageRange = puzzle.age?.match(/(\d+)\D+(\d+)/);
    const age = ageRange ? `${ageRange[1]}〜${ageRange[2]}歳のお子さまにおすすめです。` : '';
    return {
      title: `${puzzle.name}｜無料の点つなぎプリントPDF`,
      ogTitle: `${puzzle.name} — 子ども向け無料点つなぎプリント`,
      description: `無料の「${puzzle.name}」点つなぎプリントをダウンロード。${dots}の点をつないで絵を完成させましょう。${age}印刷用PDF、登録不要です。`,
      ogDescription: `${dots}の点をつないで${puzzle.name}を完成させましょう。すぐに印刷できる無料プリントです。${age}`,
      imageAlt: `${puzzle.name}、子ども向け無料印刷てんつなぎプリント`
    };
  }
  if (isPortuguese(locale)) {
    const dots = puzzle.dots ? `de 1 a ${puzzle.dots}` : 'pela ordem';
    const ageRange = puzzle.age?.match(/(\d+)\D+(\d+)/);
    const localizedAge = ageRange
      ? `crianças dos ${ageRange[1]} aos ${ageRange[2]} anos`
      : puzzle.age?.replace(/^Ages?\s*/i, '').trim();
    const age = localizedAge ? ` Recomendada para ${localizedAge}.` : '';
    return {
      title: `${puzzle.name} — Ficha de ligar os pontos grátis em PDF`,
      ogTitle: `${puzzle.name} — Ficha de ligar os pontos para crianças`,
      description: `Descarrega grátis a ficha de ${puzzle.name}.${age} Liga os pontos ${dots} para revelar a imagem. PDF pronto a imprimir, sem registo.`,
      ogDescription: `Liga os pontos ${dots} para revelar ${puzzle.name}. Ficha grátis pronta a imprimir para crianças.${age}`,
      imageAlt: `${puzzle.name}, ficha grátis para imprimir de ligar os pontos para crianças`
    };
  }
  if (!isArabic(locale)) return null;
  const dots = puzzle.dots ? `من 1 إلى ${puzzle.dots} نقطة` : 'بتوصيل النقاط';
  const ageRange = puzzle.age?.match(/(\d+)\s*[–-]\s*(\d+)/);
  const localizedAge = ageRange
    ? `من ${ageRange[1]} إلى ${ageRange[2]} سنوات`
    : puzzle.age?.replace(/^Ages?\s*/i, '').trim();
  const age = localizedAge ? ` مناسبة للأعمار ${localizedAge}.` : '';
  return {
    title: `${puzzle.name} — لعبة توصيل النقاط للأطفال PDF مجانًا للطباعة`,
    ogTitle: `${puzzle.name} — لعبة توصيل النقاط والأرقام للأطفال`,
    description: `حمّل ورقة ${puzzle.name} المجانية للأطفال: لعبة توصيل النقاط والأرقام.${age} صِل ${dots} واكتشف الرسم. ملف PDF جاهز للطباعة، بلا تسجيل.`,
    ogDescription: `صِل ${dots} لتكتشف ${puzzle.name}. ورقة عمل مجانية جاهزة للطباعة للأطفال.${age}`,
    imageAlt: `ورقة توصيل نقاط ${puzzle.name} المجانية للأطفال`
  };
}

const collections: Record<string, { title: string; description: string; ogTitle: string; ogDescription: string }> = {
  dinosaurs: {
    title: 'ألغاز توصيل نقاط الديناصورات المجانية للأطفال',
    description: 'حمّل ألغاز توصيل نقاط الديناصورات المجانية للأطفال، بما فيها تي ريكس وترايسيراتوبس والمزيد. ملفات PDF جاهزة للطباعة بلا تسجيل.',
    ogTitle: 'ألغاز توصيل نقاط الديناصورات المجانية للأطفال',
    ogDescription: 'أوراق ديناصورات مجانية قابلة للطباعة للأطفال.'
  },
  ocean: {
    title: 'ألغاز توصيل نقاط المحيط المجانية للأطفال',
    description: 'استكشف حيوانات المحيط مع ألغاز توصيل النقاط المجانية القابلة للطباعة للأطفال.',
    ogTitle: 'ألغاز توصيل نقاط المحيط المجانية للأطفال',
    ogDescription: 'أوراق حيوانات بحرية مجانية قابلة للطباعة للأطفال.'
  },
  playgrounds: {
    title: 'ألغاز توصيل نقاط الملاعب المجانية للأطفال',
    description: 'حمّل أوراق توصيل نقاط الملاعب المجانية للأطفال، جاهزة للطباعة بصيغة PDF — تشمل تحديات تفوق 100 نقطة تناسب الكبار أيضًا.',
    ogTitle: 'ألغاز توصيل نقاط الملاعب المجانية للأطفال',
    ogDescription: 'أوراق ملاعب مجانية قابلة للطباعة للأطفال.'
  },
  garden: {
    title: 'ألغاز توصيل نقاط الحديقة المجانية للأطفال',
    description: 'حمّل أوراق توصيل نقاط الحديقة المجانية للأطفال، جاهزة للطباعة بصيغة PDF.',
    ogTitle: 'ألغاز توصيل نقاط الحديقة المجانية للأطفال',
    ogDescription: 'أوراق حديقة مجانية قابلة للطباعة للأطفال.'
  },
  uae: {
    title: 'ألغاز توصيل نقاط الإمارات المجانية للأطفال',
    description: 'اكتشف معالم وتراث الإمارات مع ألغاز توصيل النقاط المجانية للأطفال القابلة للطباعة.',
    ogTitle: 'ألغاز توصيل نقاط الإمارات المجانية للأطفال',
    ogDescription: 'أوراق الإمارات المجانية القابلة للطباعة للأطفال.'
  },
  cute: {
    title: 'ألغاز توصيل نقاط لطيفة ومجانية للأطفال',
    description: 'حمّل ألغاز توصيل نقاط لطيفة ومجانية للأطفال مع حيوانات ومركبات محببة، بصيغة PDF جاهزة للطباعة.',
    ogTitle: 'ألغاز توصيل نقاط لطيفة ومجانية للأطفال',
    ogDescription: 'أوراق توصيل نقاط لطيفة مجانية وقابلة للطباعة للأطفال.'
  },
  canada: {
    title: 'ألغاز توصيل نقاط كندية مجانية للأطفال',
    description: 'اكتشف كندا مع ألغاز توصيل النقاط المجانية التي تضم حيوانات كندية وورقة القيقب، جاهزة للطباعة للأطفال.',
    ogTitle: 'ألغاز توصيل نقاط كندية مجانية للأطفال',
    ogDescription: 'أوراق كندية مجانية قابلة للطباعة للأطفال.'
  },
  'usa-250': {
    title: 'ألغاز توصيل نقاط الذكرى 250 لأمريكا للأطفال',
    description: 'احتفل بالذكرى 250 لأمريكا مع ألغاز توصيل نقاط وطنية مجانية وجاهزة للطباعة للأطفال.',
    ogTitle: 'ألغاز الذكرى 250 لأمريكا المجانية للأطفال',
    ogDescription: 'أوراق توصيل نقاط وطنية مجانية بمناسبة الذكرى 250 لأمريكا.'
  }
};

const spanishCollections: typeof collections = {
  dinosaurs: {
    title: 'Dibujos de dinosaurios para unir puntos gratis para niños',
    description: 'Descarga dibujos de dinosaurios para unir puntos gratis, con T-Rex, Triceratops y más. Fichas PDF listas para imprimir, sin registro.',
    ogTitle: 'Dibujos de dinosaurios para unir puntos gratis para niños',
    ogDescription: 'Fichas imprimibles gratuitas de dinosaurios para unir puntos.'
  },
  ocean: {
    title: 'Dibujos del océano para unir puntos gratis para niños',
    description: 'Descubre sirenas y animales marinos con fichas gratuitas del océano para unir puntos. Descarga los PDF listos para imprimir.',
    ogTitle: 'Dibujos del océano para unir puntos gratis para niños',
    ogDescription: 'Fichas imprimibles gratuitas de animales marinos para unir puntos.'
  },
  playgrounds: {
    title: 'Dibujos de parques infantiles para unir puntos gratis',
    description: 'Descarga fichas gratuitas de parques infantiles para unir puntos, con columpios, toboganes y más. PDF listo para imprimir.',
    ogTitle: 'Dibujos de parques infantiles para unir puntos gratis',
    ogDescription: 'Fichas imprimibles gratuitas de parques infantiles para niños.'
  },
  garden: {
    title: 'Dibujos del jardín para unir puntos gratis para niños',
    description: 'Descarga fichas gratuitas del jardín para unir puntos, con guantes, paletas y herramientas. PDF listo para imprimir.',
    ogTitle: 'Dibujos del jardín para unir puntos gratis para niños',
    ogDescription: 'Fichas imprimibles gratuitas del jardín para niños.'
  },
  uae: {
    title: 'Dibujos de los Emiratos Árabes Unidos para unir puntos',
    description: 'Descubre monumentos y cultura de los Emiratos Árabes Unidos con fichas gratuitas para unir puntos, listas para imprimir.',
    ogTitle: 'Dibujos de los Emiratos Árabes Unidos para unir puntos',
    ogDescription: 'Fichas gratuitas de los Emiratos listas para imprimir para niños.'
  },
  cute: {
    title: 'Dibujos adorables para unir puntos gratis para niños',
    description: 'Descarga adorables fichas gratuitas para unir puntos con cachorritos, cochecitos y más. PDF listo para imprimir.',
    ogTitle: 'Dibujos adorables para unir puntos gratis para niños',
    ogDescription: 'Adorables fichas de unir puntos gratuitas y listas para imprimir.'
  },
  canada: {
    title: 'Dibujos de Canadá para unir puntos gratis para niños',
    description: 'Descubre Canadá con fichas gratuitas para unir puntos de animales canadienses, hojas de arce y más, listas para imprimir.',
    ogTitle: 'Dibujos de Canadá para unir puntos gratis para niños',
    ogDescription: 'Fichas imprimibles gratuitas de Canadá para niños.'
  },
  'usa-250': {
    title: 'Dibujos de los 250 años de Estados Unidos para unir puntos',
    description: 'Celebra el 250 aniversario de Estados Unidos con fichas patrióticas gratuitas para unir puntos, listas para imprimir.',
    ogTitle: 'Dibujos de Estados Unidos 250 para unir puntos gratis',
    ogDescription: 'Fichas patrióticas gratuitas para celebrar los 250 años de Estados Unidos.'
  }
};

const germanCollections: typeof collections = {
  dinosaurs: {
    title: 'Kostenlose Dinosaurier-Punkt-zu-Punkt-Bilder für Kinder',
    description: 'Kostenlose Dinosaurier-Rätsel zum Zahlen verbinden mit T-Rex, Triceratops und weiteren Motiven – als druckfertige PDFs zum Ausdrucken herunterladen.',
    ogTitle: 'Kostenlose Dinosaurier-Punkt-zu-Punkt-Rätsel für Kinder',
    ogDescription: 'Kostenlose druckbare Dinosaurier-Punkt-zu-Punkt-Vorlagen für Kinder.'
  },
  ocean: {
    title: 'Kostenlose Meerestiere-Punkt-zu-Punkt-Bilder für Kinder',
    description: 'Entdecke Meerestiere und Meerjungfrauen mit kostenlosen Vorlagen zum Zahlen verbinden für Kinder. PDFs herunterladen und ausdrucken.',
    ogTitle: 'Kostenlose Meerestiere-Punkt-zu-Punkt-Rätsel',
    ogDescription: 'Kostenlose druckbare Punkt-zu-Punkt-Vorlagen mit Meerestieren.'
  },
  playgrounds: {
    title: 'Kostenlose Spielplatz-Punkt-zu-Punkt-Bilder für Kinder',
    description: 'Kostenlose Spielplatz-Vorlagen zum Zahlen verbinden mit Schaukeln, Rutschen und weiteren Motiven als druckfertige PDFs – auch mit über 100 Punkten für Geübte.',
    ogTitle: 'Kostenlose Spielplatz-Punkt-zu-Punkt-Rätsel',
    ogDescription: 'Kostenlose druckbare Spielplatz-Vorlagen für Kinder.'
  },
  garden: {
    title: 'Kostenlose Garten-Punkt-zu-Punkt-Bilder für Kinder',
    description: 'Kostenlose Garten-Vorlagen zum Zahlen verbinden mit Handschuhen, Schaufeln und Gartengeräten als druckfertige PDFs herunterladen.',
    ogTitle: 'Kostenlose Garten-Punkt-zu-Punkt-Rätsel',
    ogDescription: 'Kostenlose druckbare Garten-Vorlagen für Kinder.'
  },
  uae: {
    title: 'Kostenlose VAE-Punkt-zu-Punkt-Bilder für Kinder',
    description: 'Entdecke Wahrzeichen und Kultur der Vereinigten Arabischen Emirate mit kostenlosen Vorlagen zum Zahlen verbinden und Ausdrucken.',
    ogTitle: 'Kostenlose VAE-Punkt-zu-Punkt-Rätsel',
    ogDescription: 'Kostenlose druckbare Punkt-zu-Punkt-Vorlagen aus den Emiraten.'
  },
  cute: {
    title: 'Kostenlose niedliche Punkt-zu-Punkt-Bilder für Kinder',
    description: 'Niedliche kostenlose Vorlagen zum Zahlen verbinden mit Welpen, Fahrzeugen und weiteren Motiven als druckfertige PDFs herunterladen.',
    ogTitle: 'Kostenlose niedliche Punkt-zu-Punkt-Rätsel',
    ogDescription: 'Niedliche kostenlose Punkt-zu-Punkt-Vorlagen zum Ausdrucken.'
  },
  canada: {
    title: 'Kostenlose Kanada-Punkt-zu-Punkt-Bilder für Kinder',
    description: 'Entdecke Kanada mit kostenlosen Vorlagen zum Zahlen verbinden – kanadische Tiere, Ahornblätter und weitere Motive zum Ausdrucken.',
    ogTitle: 'Kostenlose Kanada-Punkt-zu-Punkt-Rätsel',
    ogDescription: 'Kostenlose druckbare Kanada-Vorlagen für Kinder.'
  },
  'usa-250': {
    title: 'USA 250: Kostenlose Punkt-zu-Punkt-Bilder für Kinder',
    description: 'Feiere 250 Jahre USA mit kostenlosen patriotischen Vorlagen zum Zahlen verbinden für Kinder, fertig zum Herunterladen und Ausdrucken.',
    ogTitle: 'Kostenlose USA-250-Punkt-zu-Punkt-Rätsel',
    ogDescription: 'Kostenlose patriotische Vorlagen zum 250-jährigen Jubiläum der USA.'
  }
};

const russianCollections: typeof collections = {
  dinosaurs: {
    title: 'Бесплатные задания по точкам с динозаврами для детей',
    description: 'Скачивайте бесплатные задания по точкам с тираннозавром, трицератопсом и другими динозаврами. PDF готовы к печати.',
    ogTitle: 'Бесплатные задания по точкам с динозаврами',
    ogDescription: 'Бесплатные распечатки по точкам с динозаврами для детей.'
  },
  ocean: {
    title: 'Бесплатные задания по точкам с морскими животными',
    description: 'Открывайте морских животных и русалок с бесплатными заданиями по точкам для детей. Скачивайте и печатайте PDF.',
    ogTitle: 'Бесплатные задания по точкам на морскую тему',
    ogDescription: 'Бесплатные распечатки по точкам с морскими животными.'
  },
  playgrounds: {
    title: 'Бесплатные задания по точкам с детской площадкой',
    description: 'Скачивайте бесплатные задания по точкам с качелями, горками и другими объектами детской площадки. PDF готовы к печати.',
    ogTitle: 'Задания по точкам с детской площадкой',
    ogDescription: 'Бесплатные распечатки по точкам с детской площадкой.'
  },
  garden: {
    title: 'Бесплатные задания по точкам на тему сада для детей',
    description: 'Скачивайте бесплатные задания по точкам с садовыми перчатками, совками и инструментами. PDF готовы к печати.',
    ogTitle: 'Бесплатные задания по точкам на тему сада',
    ogDescription: 'Бесплатные садовые задания по точкам для печати.'
  },
  uae: {
    title: 'Бесплатные задания по точкам об ОАЭ для детей',
    description: 'Знакомьтесь с достопримечательностями и культурой ОАЭ с бесплатными заданиями по точкам, готовыми к печати.',
    ogTitle: 'Бесплатные задания по точкам об ОАЭ',
    ogDescription: 'Бесплатные распечатки по точкам об Эмиратах для детей.'
  },
  cute: {
    title: 'Бесплатные милые задания по точкам для детей',
    description: 'Скачивайте милые бесплатные задания по точкам со щенками, машинками и другими сюжетами. PDF готовы к печати.',
    ogTitle: 'Бесплатные милые задания по точкам',
    ogDescription: 'Милые бесплатные задания по точкам для печати.'
  },
  canada: {
    title: 'Бесплатные задания по точкам о Канаде для детей',
    description: 'Открывайте Канаду с бесплатными заданиями по точкам о канадских животных, кленовых листьях и других символах.',
    ogTitle: 'Бесплатные задания по точкам о Канаде',
    ogDescription: 'Бесплатные распечатки по точкам о Канаде для детей.'
  },
  'usa-250': {
    title: 'США 250: бесплатные задания по точкам для детей',
    description: 'Отпразднуйте 250-летие США с бесплатными патриотическими заданиями по точкам для детей, готовыми к печати.',
    ogTitle: 'Бесплатные задания по точкам к 250-летию США',
    ogDescription: 'Бесплатные патриотические распечатки к 250-летию США.'
  }
};

const finnishCollections: typeof collections = {
  dinosaurs: {
    title: 'Dinosaurusten pisteestä pisteeseen tulostettava lapsille',
    description: 'Lataa ilmaisia dinosaurusten pisteestä pisteeseen tulostettavia tehtäviä: T-Rex, Triceratops ja muita. Tulostusvalmiit PDF-tiedostot, ei rekisteröitymistä.',
    ogTitle: 'Ilmaisia dinosaurusten pisteestä pisteeseen -pulmia lapsille',
    ogDescription: 'Ilmaisia tulostettavia dinosaurustehtäviä lapsille.'
  },
  ocean: {
    title: 'Valtameren pisteestä pisteeseen tulostettava lapsille',
    description: 'Tutustu merieläimiin ja merenneitoihin ilmaisilla valtameren pisteestä pisteeseen tulostettavilla tehtävillä. Lataa tulostusvalmiit PDF-tiedostot.',
    ogTitle: 'Ilmaisia valtameren pisteestä pisteeseen -pulmia lapsille',
    ogDescription: 'Ilmaisia tulostettavia merieläintehtäviä lapsille.'
  },
  playgrounds: {
    title: 'Leikkikentän pisteestä pisteeseen tulostettava lapsille',
    description: 'Lataa ilmaisia leikkikentän pisteestä pisteeseen tulostettavia tehtäviä keinuineen ja liukumäkineen. Tulostusvalmis PDF.',
    ogTitle: 'Ilmaisia leikkikentän pisteestä pisteeseen -pulmia lapsille',
    ogDescription: 'Ilmaisia tulostettavia leikkikenttätehtäviä lapsille.'
  },
  garden: {
    title: 'Puutarhan pisteestä pisteeseen tulostettava lapsille',
    description: 'Lataa ilmaisia puutarhan pisteestä pisteeseen tulostettavia tehtäviä käsineineen ja työkaluineen. Tulostusvalmis PDF.',
    ogTitle: 'Ilmaisia puutarhan pisteestä pisteeseen -pulmia lapsille',
    ogDescription: 'Ilmaisia tulostettavia puutarhatehtäviä lapsille.'
  },
  uae: {
    title: 'Arabiemiirikuntien pisteestä pisteeseen tulostettava lapsille',
    description: 'Tutustu Arabiemiirikuntien maamerkkeihin ilmaisilla pisteestä pisteeseen tulostettavilla tehtävillä. Tulostusvalmis PDF, ei rekisteröitymistä.',
    ogTitle: 'Ilmaisia Arabiemiirikuntien pisteestä pisteeseen -pulmia lapsille',
    ogDescription: 'Ilmaisia tulostettavia Arabiemiirikuntien tehtäviä lapsille.'
  },
  cute: {
    title: 'Söpöjä pisteestä pisteeseen tulostettavia lapsille',
    description: 'Lataa söpöjä ilmaisia pisteestä pisteeseen tulostettavia tehtäviä pentuineen ja pikkuautoineen. Tulostusvalmis PDF.',
    ogTitle: 'Ilmaisia söpöjä pisteestä pisteeseen -pulmia lapsille',
    ogDescription: 'Ilmaisia söpöjä tulostettavia tehtäviä lapsille.'
  },
  canada: {
    title: 'Kanadan pisteestä pisteeseen tulostettava lapsille',
    description: 'Tutustu Kanadaan ilmaisilla pisteestä pisteeseen tulostettavilla tehtävillä: eläimiä, vaahteranlehtiä ja muuta. Tulostusvalmis PDF.',
    ogTitle: 'Ilmaisia Kanadan pisteestä pisteeseen -pulmia lapsille',
    ogDescription: 'Ilmaisia tulostettavia Kanada-aiheisia tehtäviä lapsille.'
  },
  'usa-250': {
    title: 'Amerikka 250 vuotta — pisteestä pisteeseen tulostettava lapsille',
    description: 'Juhlista Amerikan 250-vuotisjuhlaa ilmaisilla isänmaallisilla pisteestä pisteeseen tulostettavilla tehtävillä. Tulostusvalmis PDF.',
    ogTitle: 'Ilmaisia Amerikka 250 -pisteestä pisteeseen -pulmia lapsille',
    ogDescription: 'Ilmaisia isänmaallisia tulostettavia tehtäviä lapsille.'
  },
  flowers: {
    title: 'Kukkien pisteestä pisteeseen tulostettava lapsille',
    description: 'Lataa ilmaisia kukkien pisteestä pisteeseen tulostettavia tehtäviä: ruusuja, tulppaaneja ja muita kukkia. Tulostusvalmis PDF, ei rekisteröitymistä.',
    ogTitle: 'Ilmaisia kukkien pisteestä pisteeseen -pulmia lapsille',
    ogDescription: 'Ilmaisia tulostettavia kukka-aiheisia tehtäviä lapsille.'
  }
};

const dutchCollections: typeof collections = {
  dinosaurs: {
    title: 'Gratis dinosaurus-punt-tot-punt puzzels voor kinderen',
    description: 'Download gratis dinosaurus-werkbladen om de punten te verbinden, met T-Rex, Triceratops en meer. Printklare PDF\'s, geen account nodig.',
    ogTitle: 'Gratis dinosaurus punt-tot-punt puzzels',
    ogDescription: 'Gratis printbare dinosaurus-punt-tot-punt werkbladen voor kinderen.'
  },
  ocean: {
    title: 'Gratis oceaan-punt-tot-punt puzzels voor kinderen',
    description: 'Ontdek zeedieren en zeemeerminnen met gratis werkbladen om de punten te verbinden. Download en print de PDF\'s.',
    ogTitle: 'Gratis oceaan punt-tot-punt puzzels',
    ogDescription: 'Gratis printbare punt-tot-punt werkbladen met zeedieren.'
  },
  playgrounds: {
    title: 'Gratis speeltuin-punt-tot-punt puzzels voor kinderen',
    description: 'Gratis speeltuin-werkbladen om de punten te verbinden met schommels, glijbanen en meer, als printklare PDF – ook met meer dan 100 stippen voor gevorderden.',
    ogTitle: 'Gratis speeltuin punt-tot-punt puzzels',
    ogDescription: 'Gratis printbare speeltuin-werkbladen voor kinderen.'
  },
  garden: {
    title: 'Gratis tuin-punt-tot-punt puzzels voor kinderen',
    description: 'Gratis tuin-werkbladen om de punten te verbinden met handschoenen, schepjes en tuingereedschap, als printklare PDF.',
    ogTitle: 'Gratis tuin punt-tot-punt puzzels',
    ogDescription: 'Gratis printbare tuin-werkbladen voor kinderen.'
  },
  uae: {
    title: 'Gratis VAE-punt-tot-punt puzzels voor kinderen',
    description: 'Ontdek bezienswaardigheden en cultuur van de Verenigde Arabische Emiraten met gratis werkbladen om de punten te verbinden en te printen.',
    ogTitle: 'Gratis VAE punt-tot-punt puzzels',
    ogDescription: 'Gratis printbare punt-tot-punt werkbladen uit de Emiraten.'
  },
  cute: {
    title: 'Gratis schattige punt-tot-punt puzzels voor kinderen',
    description: 'Schattige gratis werkbladen om de punten te verbinden met puppy\'s, autootjes en meer, als printklare PDF.',
    ogTitle: 'Gratis schattige punt-tot-punt puzzels',
    ogDescription: 'Schattige gratis printbare punt-tot-punt werkbladen.'
  },
  canada: {
    title: 'Gratis Canada-punt-tot-punt puzzels voor kinderen',
    description: 'Ontdek Canada met gratis werkbladen om de punten te verbinden – Canadese dieren, esdoornbladeren en meer om te printen.',
    ogTitle: 'Gratis Canada punt-tot-punt puzzels',
    ogDescription: 'Gratis printbare Canada-werkbladen voor kinderen.'
  },
  'usa-250': {
    title: 'Amerika 250: gratis punt-tot-punt puzzels voor kinderen',
    description: 'Vier 250 jaar Amerika met gratis patriottische werkbladen om de punten te verbinden voor kinderen, klaar om te downloaden en te printen.',
    ogTitle: 'Gratis Amerika 250 punt-tot-punt puzzels',
    ogDescription: 'Gratis patriottische werkbladen voor het 250-jarig jubileum van de VS.'
  }
};

const frenchCollections: typeof collections = {
  dinosaurs: {
    title: 'Points à relier dinosaures gratuits pour enfants',
    description: 'Téléchargez gratuitement des fiches de points à relier avec des dinosaures : T-Rex, Tricératops et plus. PDF prêts à imprimer, sans inscription.',
    ogTitle: 'Points à relier dinosaures gratuits pour enfants',
    ogDescription: 'Fiches gratuites de dinosaures à imprimer, points à relier.'
  },
  ocean: {
    title: 'Points à relier océan gratuits pour enfants',
    description: 'Découvrez les animaux marins et les sirènes avec des fiches gratuites de points à relier. Téléchargez et imprimez les PDF.',
    ogTitle: 'Points à relier océan gratuits pour enfants',
    ogDescription: 'Fiches gratuites d\'animaux marins à imprimer, points à relier.'
  },
  playgrounds: {
    title: 'Points à relier aire de jeux gratuits pour enfants',
    description: 'Téléchargez des fiches gratuites de points à relier avec balançoires, toboggans et plus. PDF prêt à imprimer.',
    ogTitle: 'Points à relier aire de jeux gratuits',
    ogDescription: 'Fiches gratuites d\'aire de jeux à imprimer pour enfants.'
  },
  garden: {
    title: 'Points à relier jardin gratuits pour enfants',
    description: 'Téléchargez des fiches gratuites de points à relier sur le thème du jardin. PDF prêt à imprimer.',
    ogTitle: 'Points à relier jardin gratuits',
    ogDescription: 'Fiches gratuites de jardin à imprimer pour enfants.'
  },
  uae: {
    title: 'Points à relier Émirats arabes unis gratuits pour enfants',
    description: 'Découvrez les monuments et la culture des Émirats arabes unis avec des fiches gratuites de points à relier, prêtes à imprimer.',
    ogTitle: 'Points à relier Émirats arabes unis gratuits',
    ogDescription: 'Fiches gratuites des Émirats à imprimer pour enfants.'
  },
  cute: {
    title: 'Points à relier mignons gratuits pour enfants',
    description: 'Téléchargez de mignonnes fiches gratuites de points à relier avec chiots, petites voitures et plus. PDF prêt à imprimer.',
    ogTitle: 'Points à relier mignons gratuits',
    ogDescription: 'Fiches mignonnes gratuites de points à relier à imprimer.'
  },
  canada: {
    title: 'Points à relier Canada gratuits pour enfants',
    description: 'Découvrez le Canada avec des fiches gratuites de points à relier : animaux canadiens, feuille d\'érable et plus, prêtes à imprimer.',
    ogTitle: 'Points à relier Canada gratuits',
    ogDescription: 'Fiches gratuites du Canada à imprimer pour enfants.'
  },
  'usa-250': {
    title: 'Points à relier USA 250 ans gratuits pour enfants',
    description: 'Célébrez les 250 ans des États-Unis avec des fiches patriotiques gratuites de points à relier, prêtes à imprimer.',
    ogTitle: 'Points à relier USA 250 ans gratuits',
    ogDescription: 'Fiches patriotiques gratuites pour les 250 ans des États-Unis.'
  }
};

const italianCollections: typeof collections = {
  dinosaurs: {
    title: 'Unisci i puntini dinosauri gratis per bambini',
    description: 'Scarica gratis schede unisci i puntini con T-Rex, Triceratopo e altri dinosauri. PDF pronti da stampare, senza registrazione.',
    ogTitle: 'Unisci i puntini dinosauri gratis per bambini',
    ogDescription: 'Schede gratuite di dinosauri da stampare, unisci i puntini.'
  },
  ocean: {
    title: 'Unisci i puntini oceano gratis per bambini',
    description: 'Scopri animali marini e sirene con schede gratuite unisci i puntini. Scarica e stampa i PDF.',
    ogTitle: 'Unisci i puntini oceano gratis per bambini',
    ogDescription: 'Schede gratuite di animali marini da stampare.'
  },
  playgrounds: {
    title: 'Unisci i puntini parco giochi gratis per bambini',
    description: 'Scarica schede gratuite unisci i puntini con altalene, scivoli e altro. PDF pronto da stampare.',
    ogTitle: 'Unisci i puntini parco giochi gratis',
    ogDescription: 'Schede gratuite di parco giochi da stampare per bambini.'
  },
  garden: {
    title: 'Unisci i puntini giardino gratis per bambini',
    description: 'Scarica schede gratuite unisci i puntini a tema giardino. PDF pronto da stampare.',
    ogTitle: 'Unisci i puntini giardino gratis',
    ogDescription: 'Schede gratuite di giardino da stampare per bambini.'
  },
  uae: {
    title: 'Unisci i puntini Emirati Arabi Uniti gratis per bambini',
    description: 'Scopri i monumenti e la cultura degli Emirati Arabi Uniti con schede gratuite unisci i puntini, pronte da stampare.',
    ogTitle: 'Unisci i puntini Emirati Arabi Uniti gratis',
    ogDescription: 'Schede gratuite degli Emirati da stampare per bambini.'
  },
  cute: {
    title: 'Unisci i puntini simpatici gratis per bambini',
    description: 'Scarica simpatiche schede gratuite unisci i puntini con cuccioli, macchinine e altro. PDF pronto da stampare.',
    ogTitle: 'Unisci i puntini simpatici gratis',
    ogDescription: 'Schede simpatiche gratuite da stampare.'
  },
  canada: {
    title: 'Unisci i puntini Canada gratis per bambini',
    description: 'Scopri il Canada con schede gratuite unisci i puntini: animali canadesi, foglia d\'acero e altro, pronte da stampare.',
    ogTitle: 'Unisci i puntini Canada gratis',
    ogDescription: 'Schede gratuite del Canada da stampare per bambini.'
  },
  'usa-250': {
    title: 'Unisci i puntini USA 250 anni gratis per bambini',
    description: 'Festeggia i 250 anni degli Stati Uniti con schede patriottiche gratuite unisci i puntini, pronte da stampare.',
    ogTitle: 'Unisci i puntini USA 250 anni gratis',
    ogDescription: 'Schede patriottiche gratuite per i 250 anni degli Stati Uniti.'
  },
  flowers: {
    title: 'Fiori da unire i puntini gratis per bambini',
    description: 'Scarica schede gratuite di fiori da unire i puntini, con lino, nasturzio, bucaneve, camelia, gelsomino e altri fiori. PDF pronti da stampare, senza registrazione.',
    ogTitle: 'Fiori da unire i puntini gratis',
    ogDescription: 'Schede floreali gratuite da stampare per bambini.'
  }
};

const japaneseCollections: typeof collections = {
  dinosaurs: {
    title: '恐竜の点つなぎ（てんつなぎ）無料プリント（子ども向け）',
    description: 'ティラノサウルスやトリケラトプスなど、恐竜てんつなぎプリントを無料でダウンロード。3〜6歳向けの知育てんつなぎプリントとして人気です。印刷用PDF、登録不要。',
    ogTitle: '恐竜の点つなぎ無料プリント',
    ogDescription: '子ども向け無料印刷の恐竜てんつなぎプリント。運筆練習・知育にも。'
  },
  ocean: {
    title: '海の生き物の点つなぎ無料プリント（子ども向け）',
    description: '人魚や海の生き物のてんつなぎプリントを無料でダウンロード・印刷。どうぶつ好きの幼児にもおすすめです。',
    ogTitle: '海の生き物の点つなぎ無料プリント',
    ogDescription: '子ども向け無料印刷の海の生き物てんつなぎプリント。'
  },
  playgrounds: {
    title: '遊び場の点つなぎ無料プリント（子ども向け）',
    description: 'ブランコや滑り台など、遊び場テーマのてんつなぎプリントを無料でダウンロード。印刷用PDF。',
    ogTitle: '遊び場の点つなぎ無料プリント',
    ogDescription: '子ども向け無料印刷の遊び場点つなぎ（てんつなぎ）プリント。'
  },
  garden: {
    title: '庭の点つなぎ無料プリント（子ども向け）',
    description: '庭テーマの点つなぎ（てんつなぎ）プリントを無料でダウンロード。印刷用PDF。',
    ogTitle: '庭の点つなぎ無料プリント',
    ogDescription: '子ども向け無料印刷の庭の点つなぎプリント。'
  },
  uae: {
    title: 'アラブ首長国連邦（UAE）の点つなぎ無料プリント',
    description: 'UAEの名所や文化をテーマにした点つなぎ（てんつなぎ）プリントを無料でダウンロード・印刷。',
    ogTitle: 'UAEの点つなぎ無料プリント',
    ogDescription: '子ども向け無料印刷のUAE点つなぎプリント。'
  },
  cute: {
    title: 'かわいい点つなぎ（てんつなぎ）無料プリント（子ども向け）',
    description: '子犬やライオンなどのどうぶつ、車といったかわいいてんつなぎプリントを無料でダウンロード。てんつなぎ かんたんな幼児向け知育プリントです。印刷用PDF。',
    ogTitle: 'かわいい点つなぎ無料プリント',
    ogDescription: 'かわいい無料印刷のてんつなぎプリント。幼児のてんつなぎ入門にもおすすめ。'
  },
  canada: {
    title: 'カナダの点つなぎ無料プリント（子ども向け）',
    description: 'カナダの動物やメープルリーフなど、点つなぎ（てんつなぎ）プリントを無料でダウンロード。',
    ogTitle: 'カナダの点つなぎ無料プリント',
    ogDescription: '子ども向け無料印刷のカナダ点つなぎプリント。'
  },
  'usa-250': {
    title: 'アメリカ建国250周年の点つなぎ無料プリント',
    description: 'アメリカ建国250周年を祝う、愛国的な点つなぎ（てんつなぎ）プリントを無料でダウンロード。',
    ogTitle: 'アメリカ250周年の点つなぎ無料プリント',
    ogDescription: 'アメリカ建国250周年の無料印刷プリント。'
  }
};

const portugueseCollections: typeof collections = {
  dinosaurs: {
    title: 'Desenhos de dinossauros para ligar os pontos grátis para crianças',
    description: 'Descarrega grátis fichas de ligar os pontos com dinossauros: T-Rex, Tricerátopo e mais. PDF prontos a imprimir, sem registo.',
    ogTitle: 'Desenhos de dinossauros para ligar os pontos grátis',
    ogDescription: 'Fichas grátis de dinossauros para imprimir, ligar os pontos.'
  },
  ocean: {
    title: 'Desenhos do oceano para ligar os pontos grátis para crianças',
    description: 'Descobre animais marinhos e sereias com fichas grátis de ligar os pontos. Descarrega e imprime os PDF.',
    ogTitle: 'Desenhos do oceano para ligar os pontos grátis',
    ogDescription: 'Fichas grátis de animais marinhos para imprimir.'
  },
  playgrounds: {
    title: 'Desenhos do parque infantil para ligar os pontos grátis',
    description: 'Descarrega fichas grátis de ligar os pontos com baloiços, escorregas e mais. PDF pronto a imprimir.',
    ogTitle: 'Desenhos do parque infantil para ligar os pontos grátis',
    ogDescription: 'Fichas grátis de parque infantil para imprimir para crianças.'
  },
  garden: {
    title: 'Desenhos do jardim para ligar os pontos grátis para crianças',
    description: 'Descarrega fichas grátis de ligar os pontos com tema de jardim. PDF pronto a imprimir.',
    ogTitle: 'Desenhos do jardim para ligar os pontos grátis',
    ogDescription: 'Fichas grátis de jardim para imprimir para crianças.'
  },
  uae: {
    title: 'Desenhos dos Emirados Árabes Unidos para ligar os pontos grátis',
    description: 'Descobre monumentos e cultura dos Emirados Árabes Unidos com fichas grátis de ligar os pontos, prontas a imprimir.',
    ogTitle: 'Desenhos dos Emirados para ligar os pontos grátis',
    ogDescription: 'Fichas grátis dos Emirados para imprimir para crianças.'
  },
  cute: {
    title: 'Desenhos fofos para ligar os pontos grátis para crianças',
    description: 'Descarrega fichas fofas grátis de ligar os pontos com cachorrinhos, carrinhos e mais. PDF pronto a imprimir.',
    ogTitle: 'Desenhos fofos para ligar os pontos grátis',
    ogDescription: 'Fichas fofas grátis para imprimir, ligar os pontos.'
  },
  canada: {
    title: 'Desenhos do Canadá para ligar os pontos grátis para crianças',
    description: 'Descobre o Canadá com fichas grátis de ligar os pontos: animais canadianos, folha de bordo e mais, prontas a imprimir.',
    ogTitle: 'Desenhos do Canadá para ligar os pontos grátis',
    ogDescription: 'Fichas grátis do Canadá para imprimir para crianças.'
  },
  'usa-250': {
    title: 'Desenhos dos 250 anos dos EUA para ligar os pontos grátis',
    description: 'Celebra os 250 anos dos Estados Unidos com fichas patrióticas grátis de ligar os pontos, prontas a imprimir.',
    ogTitle: 'Desenhos dos 250 anos dos EUA para ligar os pontos grátis',
    ogDescription: 'Fichas patrióticas grátis para os 250 anos dos EUA.'
  },
  flowers: {
    title: 'Desenhos de flores para ligar os pontos grátis para crianças',
    description: 'Descarrega grátis fichas de ligar os pontos com flores: rosas, tulipas e mais. PDF pronto a imprimir, sem registo.',
    ogTitle: 'Desenhos de flores para ligar os pontos grátis',
    ogDescription: 'Fichas grátis de flores para imprimir para crianças.'
  }
};

export function localizedCollectionSeo(locale: string, collection: string) {
  if (isGerman(locale)) return germanCollections[collection] ?? null;
  if (isRussian(locale)) return russianCollections[collection] ?? null;
  if (isSpanish(locale)) return spanishCollections[collection] ?? null;
  if (isFinnish(locale)) return finnishCollections[collection] ?? null;
  if (isDutch(locale)) return dutchCollections[collection] ?? null;
  if (isFrench(locale)) return frenchCollections[collection] ?? null;
  if (isItalian(locale)) return italianCollections[collection] ?? null;
  if (isJapanese(locale)) return japaneseCollections[collection] ?? null;
  if (isPortuguese(locale)) return portugueseCollections[collection] ?? null;
  return isArabic(locale) ? collections[collection] ?? null : null;
}

export function localizedStaticSeo(locale: string, page: 'about' | 'contact' | 'search' | 'terms' | 'privacy' | 'blog') {
  if (isGerman(locale)) {
    const copy = {
      about: ['Über uns | Kostenlose Punkt-zu-Punkt-Bilder', 'Erfahre mehr über unsere kostenlosen Vorlagen zum Zahlen verbinden für Kinder und wie wir jedes druckbare Rätsel mit echten Kindern testen.'],
      contact: ['Kontakt | Kostenlose Punkt-zu-Punkt-Bilder', 'Kontaktiere uns für Motivwünsche, Korrekturen, Lizenzfragen oder Feedback zu unseren Punkt-zu-Punkt-Vorlagen.'],
      search: ['Kostenlose Punkt-zu-Punkt-Bilder suchen', 'Suche kostenlose Vorlagen zum Zahlen verbinden nach Thema, Name oder Anzahl der Punkte.'],
      terms: ['Nutzungsbedingungen | Kostenlose Punkt-zu-Punkt-Bilder', 'Lies die Nutzungsbedingungen für unsere kostenlosen druckbaren Punkt-zu-Punkt-Vorlagen.'],
      privacy: ['Datenschutzerklärung | Kostenlose Punkt-zu-Punkt-Bilder', 'Erfahre, wie wir Datenschutz auf unserer Website mit kostenlosen Punkt-zu-Punkt-Vorlagen handhaben.'],
      blog: ['Punkt-zu-Punkt-Lernblog', 'Ideen, Aktivitäten und Tipps für Eltern und Lehrkräfte rund um Punkt-zu-Punkt-Bilder und frühes Lernen.']
    }[page];
    return { title: copy[0], description: copy[1] };
  }
  if (isRussian(locale)) {
    const copy = {
      about: ['О нас | Бесплатные задания по точкам', 'Узнайте о нашем сайте бесплатных заданий по точкам для детей и о том, как мы готовим каждую распечатку.'],
      contact: ['Контакты | Бесплатные задания по точкам', 'Свяжитесь с нами, чтобы предложить тему, сообщить об исправлении, задать вопрос о лицензии или оставить отзыв.'],
      search: ['Поиск бесплатных заданий по точкам', 'Ищите бесплатные задания по точкам по теме, названию или количеству точек.'],
      terms: ['Условия использования | Задания по точкам', 'Ознакомьтесь с условиями использования наших бесплатных заданий по точкам для печати.'],
      privacy: ['Политика конфиденциальности | Задания по точкам', 'Узнайте, как мы обеспечиваем конфиденциальность на сайте бесплатных заданий по точкам.'],
      blog: ['Блог об обучении с заданиями по точкам', 'Идеи, занятия и советы для родителей и педагогов о рисунках по точкам и раннем развитии.']
    }[page];
    return { title: copy[0], description: copy[1] };
  }
  if (isSpanish(locale)) {
    const copy = {
      about: ['Sobre nosotros | Dibujos para unir puntos gratis', 'Conoce nuestro sitio de fichas gratuitas de unir puntos para niños y cómo preparamos cada dibujo imprimible.'],
      contact: ['Contáctanos | Dibujos para unir puntos gratis', 'Contáctanos para solicitar dibujos, informar de correcciones, consultar licencias o enviarnos tus comentarios.'],
      search: ['Buscar dibujos para unir puntos gratis', 'Busca fichas gratuitas de unir puntos por tema, nombre o cantidad de puntos.'],
      terms: ['Términos de uso | Dibujos para unir puntos gratis', 'Consulta los términos de uso de nuestras fichas gratuitas de unir puntos listas para imprimir.'],
      privacy: ['Política de privacidad | Dibujos para unir puntos gratis', 'Consulta cómo gestionamos la privacidad en nuestro sitio de fichas gratuitas de unir puntos.'],
      blog: ['Blog de aprendizaje con dibujos de unir puntos', 'Ideas, actividades y consejos para padres y docentes sobre dibujos de unir puntos y aprendizaje temprano.']
    }[page];
    return { title: copy[0], description: copy[1] };
  }
  if (isFinnish(locale)) {
    const copy = {
      about: ['Meistä | Ilmaisia pisteestä pisteeseen tulostettavia', 'Tutustu sivustoomme, joka tarjoaa ilmaisia pisteestä pisteeseen tulostettavia tehtäviä lapsille, ja siihen, miten valmistamme jokaisen tulostettavan.'],
      contact: ['Ota yhteyttä | Ilmaisia pisteestä pisteeseen tulostettavia', 'Ota yhteyttä toivetehtävistä, korjauksista, lisenssikysymyksistä tai palautteesta koskien pisteestä pisteeseen tulostettaviamme.'],
      search: ['Etsi ilmaisia pisteestä pisteeseen tulostettavia', 'Etsi ilmaisia pisteestä pisteeseen tulostettavia tehtäviä teeman, nimen tai pisteiden määrän mukaan.'],
      terms: ['Käyttöehdot | Ilmaisia pisteestä pisteeseen tulostettavia', 'Lue ilmaisten pisteestä pisteeseen tulostettavien tehtäviemme käyttöehdot.'],
      privacy: ['Tietosuojaseloste | Ilmaisia pisteestä pisteeseen tulostettavia', 'Lue, miten käsittelemme tietosuojaa sivustollamme, joka tarjoaa ilmaisia pisteestä pisteeseen tulostettavia.'],
      blog: ['Pisteestä pisteeseen -oppimisblogi', 'Ideoita, aktiviteetteja ja vinkkejä vanhemmille ja opettajille pisteestä pisteeseen tulostettavista ja varhaisesta oppimisesta.']
    }[page];
    return { title: copy[0], description: copy[1] };
  }
  if (isDutch(locale)) {
    const copy = {
      about: ['Over ons | Gratis punt-tot-punt puzzels', 'Lees meer over onze gratis werkbladen om de punten te verbinden voor kinderen en hoe we elke printbare puzzel testen met echte kinderen.'],
      contact: ['Contact | Gratis punt-tot-punt puzzels', 'Neem contact met ons op voor themawensen, correcties, licentievragen of feedback over onze punt-tot-punt puzzels.'],
      search: ['Zoek gratis punt-tot-punt puzzels', 'Zoek gratis werkbladen om de punten te verbinden op thema, naam of aantal stippen.'],
      terms: ['Gebruiksvoorwaarden | Gratis punt-tot-punt puzzels', 'Lees de gebruiksvoorwaarden voor onze gratis printbare punt-tot-punt werkbladen.'],
      privacy: ['Privacybeleid | Gratis punt-tot-punt puzzels', 'Lees hoe wij omgaan met privacy op onze website met gratis punt-tot-punt puzzels.'],
      blog: ['Punt-tot-punt leerblog', 'Ideeën, activiteiten en tips voor ouders en leerkrachten over punt-tot-punt puzzels en vroeg leren.']
    }[page];
    return { title: copy[0], description: copy[1] };
  }
  if (isFrench(locale)) {
    const copy = {
      about: ['À propos | Points à relier gratuits', 'Découvrez notre site de fiches gratuites de points à relier pour enfants et comment nous testons chaque jeu imprimable.'],
      contact: ['Contact | Points à relier gratuits', 'Contactez-nous pour des demandes de thèmes, des corrections, des questions de licence ou vos commentaires.'],
      search: ['Rechercher des points à relier gratuits', 'Recherchez des fiches gratuites de points à relier par thème, nom ou nombre de points.'],
      terms: ['Conditions d\'utilisation | Points à relier gratuits', 'Consultez les conditions d\'utilisation de nos fiches gratuites de points à relier à imprimer.'],
      privacy: ['Politique de confidentialité | Points à relier gratuits', 'Découvrez comment nous gérons la confidentialité sur notre site de points à relier gratuits.'],
      blog: ['Blog d\'apprentissage points à relier', 'Idées, activités et conseils pour les parents et enseignants sur les points à relier et l\'apprentissage précoce.']
    }[page];
    return { title: copy[0], description: copy[1] };
  }
  if (isItalian(locale)) {
    const copy = {
      about: ['Chi siamo | Unisci i puntini gratis', 'Scopri il nostro sito di schede gratuite unisci i puntini per bambini e come testiamo ogni scheda stampabile.'],
      contact: ['Contatti | Unisci i puntini gratis', 'Contattaci per richieste di temi, correzioni, domande sulla licenza o feedback.'],
      search: ['Cerca unisci i puntini gratis', 'Cerca schede gratuite unisci i puntini per tema, nome o numero di puntini.'],
      terms: ['Termini di utilizzo | Unisci i puntini gratis', 'Leggi i termini di utilizzo delle nostre schede gratuite unisci i puntini da stampare.'],
      privacy: ['Informativa sulla privacy | Unisci i puntini gratis', 'Scopri come gestiamo la privacy sul nostro sito di schede gratuite unisci i puntini.'],
      blog: ['Blog didattico unisci i puntini', 'Idee, attività e consigli per genitori e insegnanti su unisci i puntini e apprendimento precoce.']
    }[page];
    return { title: copy[0], description: copy[1] };
  }
  if (isJapanese(locale)) {
    const copy = {
      about: ['サイトについて｜無料の点つなぎプリント', '子ども向け無料てんつなぎプリントのサイトについて、そして各プリントを実際の子どもでテストしている取り組みをご紹介します。'],
      contact: ['お問い合わせ｜無料の点つなぎプリント', 'テーマのリクエスト、修正のご報告、ライセンスに関するご質問、ご感想はこちらからお問い合わせください。'],
      search: ['無料のてんつなぎプリントを検索', 'テーマ、名前、点の数で無料の点つなぎ（てんつなぎ）プリントを検索できます。'],
      terms: ['利用規約｜無料の点つなぎプリント', '無料の印刷用点つなぎプリントの利用規約をご確認ください。'],
      privacy: ['プライバシーポリシー｜無料の点つなぎプリント', '無料の点つなぎプリントサイトにおけるプライバシーの取り扱いについてご説明します。'],
      blog: ['てんつなぎ学習ブログ', '点つなぎ（てんつなぎ）と早期学習について、保護者や先生向けのアイデア・活動・ヒントをご紹介します。']
    }[page];
    return { title: copy[0], description: copy[1] };
  }
  if (isPortuguese(locale)) {
    const copy = {
      about: ['Sobre nós | Ligar os pontos grátis', 'Conhece o nosso site de fichas grátis de ligar os pontos para crianças e como testamos cada ficha imprimível.'],
      contact: ['Contacto | Ligar os pontos grátis', 'Contacta-nos para pedidos de temas, correções, questões de licença ou os teus comentários.'],
      search: ['Pesquisar ligar os pontos grátis', 'Pesquisa fichas grátis de ligar os pontos por tema, nome ou número de pontos.'],
      terms: ['Termos de utilização | Ligar os pontos grátis', 'Consulta os termos de utilização das nossas fichas grátis de ligar os pontos prontas a imprimir.'],
      privacy: ['Política de privacidade | Ligar os pontos grátis', 'Consulta como gerimos a privacidade no nosso site de fichas grátis de ligar os pontos.'],
      blog: ['Blog de aprendizagem ligar os pontos', 'Ideias, atividades e dicas para pais e professores sobre ligar os pontos e aprendizagem precoce.']
    }[page];
    return { title: copy[0], description: copy[1] };
  }
  if (!isArabic(locale)) return null;
  const copy = {
    about: ['من نحن | لعبة توصيل النقاط المجانية', 'تعرّف إلى موقع أوراق توصيل النقاط والأرقام المجانية للأطفال وكيف نختبر كل لغز قابل للطباعة مع أطفال حقيقيين.'],
    contact: ['اتصل بنا | أوراق توصيل النقاط المجانية', 'تواصل معنا لطلبات الألغاز أو التصحيحات أو أسئلة الترخيص أو ملاحظاتك.'],
    search: ['ابحث عن لعبة توصيل نقاط مجانية', 'ابحث عن ألعاب وأوراق توصيل النقاط المجانية حسب الموضوع أو الاسم أو عدد النقاط.'],
    terms: ['شروط الاستخدام | أوراق توصيل النقاط المجانية', 'اطّلع على شروط استخدام أوراق توصيل النقاط المجانية القابلة للطباعة.'],
    privacy: ['سياسة الخصوصية | أوراق توصيل النقاط المجانية', 'اطّلع على كيفية تعاملنا مع الخصوصية في موقع أوراق توصيل النقاط المجانية.'],
    blog: ['مدونة التعلم بتوصيل النقاط', 'أفكار وأنشطة ونصائح للوالدين والمعلمين حول توصيل النقاط والتعلم المبكر.']
  }[page];
  return { title: copy[0], description: copy[1] };
}
