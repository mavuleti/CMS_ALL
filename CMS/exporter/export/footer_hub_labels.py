# Short footer link labels for the age/difficulty hub links, one set per locale.
# Keys map 1:1 to the mapping_audit_home.db new_key suffixes:
#   body.footer.hubAges46, hubAges79, hubAges912, hubDifficultyMedium, hubDifficultyHard
# (hubDifficultyEasy intentionally omitted -- the easy 1-20 dots tier has zero
# matching puzzles in the catalog right now, so it stays out of the footer nav
# for every locale, same guard as page.tsx's generateStaticParams.)

FOOTER_HUB_LABELS = {
"en": {"hubAges46": "Ages 4-6", "hubAges79": "Ages 7-9", "hubAges912": "Ages 9-12", "hubDifficultyMedium": "Medium Puzzles", "hubDifficultyHard": "Hard Puzzles"},
"ar": {"hubAges46": "الأعمار 4-6", "hubAges79": "الأعمار 7-9", "hubAges912": "الأعمار 9-12", "hubDifficultyMedium": "ألغاز متوسطة", "hubDifficultyHard": "ألغاز صعبة"},
"az": {"hubAges46": "Yaş 4-6", "hubAges79": "Yaş 7-9", "hubAges912": "Yaş 9-12", "hubDifficultyMedium": "Orta Tapmacalar", "hubDifficultyHard": "Çətin Tapmacalar"},
"cs": {"hubAges46": "Věk 4-6", "hubAges79": "Věk 7-9", "hubAges912": "Věk 9-12", "hubDifficultyMedium": "Střední skládačky", "hubDifficultyHard": "Těžké skládačky"},
"da": {"hubAges46": "Alder 4-6", "hubAges79": "Alder 7-9", "hubAges912": "Alder 9-12", "hubDifficultyMedium": "Mellemsvære opgaver", "hubDifficultyHard": "Svære opgaver"},
"de": {"hubAges46": "Alter 4-6", "hubAges79": "Alter 7-9", "hubAges912": "Alter 9-12", "hubDifficultyMedium": "Mittlere Rätsel", "hubDifficultyHard": "Schwere Rätsel"},
"el": {"hubAges46": "Ηλικίες 4-6", "hubAges79": "Ηλικίες 7-9", "hubAges912": "Ηλικίες 9-12", "hubDifficultyMedium": "Μέτρια Παζλ", "hubDifficultyHard": "Δύσκολα Παζλ"},
"es": {"hubAges46": "Edades 4-6", "hubAges79": "Edades 7-9", "hubAges912": "Edades 9-12", "hubDifficultyMedium": "Puzles Medios", "hubDifficultyHard": "Puzles Difíciles"},
"fa": {"hubAges46": "سنین 4-6", "hubAges79": "سنین 7-9", "hubAges912": "سنین 9-12", "hubDifficultyMedium": "پازل‌های متوسط", "hubDifficultyHard": "پازل‌های سخت"},
"fi": {"hubAges46": "Ikä 4-6", "hubAges79": "Ikä 7-9", "hubAges912": "Ikä 9-12", "hubDifficultyMedium": "Keskitason tehtävät", "hubDifficultyHard": "Vaikeat tehtävät"},
"fr": {"hubAges46": "Âges 4-6", "hubAges79": "Âges 7-9", "hubAges912": "Âges 9-12", "hubDifficultyMedium": "Puzzles Moyens", "hubDifficultyHard": "Puzzles Difficiles"},
"hr": {"hubAges46": "Dob 4-6", "hubAges79": "Dob 7-9", "hubAges912": "Dob 9-12", "hubDifficultyMedium": "Srednje Zagonetke", "hubDifficultyHard": "Teške Zagonetke"},
"hu": {"hubAges46": "4-6 Éves", "hubAges79": "7-9 Éves", "hubAges912": "9-12 Éves", "hubDifficultyMedium": "Közepes Feladványok", "hubDifficultyHard": "Nehéz Feladványok"},
"id": {"hubAges46": "Usia 4-6", "hubAges79": "Usia 7-9", "hubAges912": "Usia 9-12", "hubDifficultyMedium": "Teka-teki Sedang", "hubDifficultyHard": "Teka-teki Sulit"},
"it": {"hubAges46": "Età 4-6", "hubAges79": "Età 7-9", "hubAges912": "Età 9-12", "hubDifficultyMedium": "Puzzle Medi", "hubDifficultyHard": "Puzzle Difficili"},
"ja": {"hubAges46": "4〜6歳", "hubAges79": "7〜9歳", "hubAges912": "9〜12歳", "hubDifficultyMedium": "ふつうのパズル", "hubDifficultyHard": "むずかしいパズル"},
"ko": {"hubAges46": "4-6세", "hubAges79": "7-9세", "hubAges912": "9-12세", "hubDifficultyMedium": "중간 난이도 퍼즐", "hubDifficultyHard": "어려운 퍼즐"},
"lt": {"hubAges46": "4-6 Metai", "hubAges79": "7-9 Metai", "hubAges912": "9-12 Metai", "hubDifficultyMedium": "Vidutiniai Galvosūkiai", "hubDifficultyHard": "Sunkūs Galvosūkiai"},
"lv": {"hubAges46": "4-6 Gadi", "hubAges79": "7-9 Gadi", "hubAges912": "9-12 Gadi", "hubDifficultyMedium": "Vidēji Grūtas Mīklas", "hubDifficultyHard": "Grūtas Mīklas"},
"nl": {"hubAges46": "Leeftijd 4-6", "hubAges79": "Leeftijd 7-9", "hubAges912": "Leeftijd 9-12", "hubDifficultyMedium": "Gemiddelde Puzzels", "hubDifficultyHard": "Moeilijke Puzzels"},
"no": {"hubAges46": "Alder 4-6", "hubAges79": "Alder 7-9", "hubAges912": "Alder 9-12", "hubDifficultyMedium": "Middels Oppgaver", "hubDifficultyHard": "Vanskelige Oppgaver"},
"pl": {"hubAges46": "Wiek 4-6", "hubAges79": "Wiek 7-9", "hubAges912": "Wiek 9-12", "hubDifficultyMedium": "Średnie Zagadki", "hubDifficultyHard": "Trudne Zagadki"},
"pt": {"hubAges46": "Idades 4-6", "hubAges79": "Idades 7-9", "hubAges912": "Idades 9-12", "hubDifficultyMedium": "Puzzles Médios", "hubDifficultyHard": "Puzzles Difíceis"},
"pt-BR": {"hubAges46": "Idades 4-6", "hubAges79": "Idades 7-9", "hubAges912": "Idades 9-12", "hubDifficultyMedium": "Atividades Médias", "hubDifficultyHard": "Atividades Difíceis"},
"ro": {"hubAges46": "Vârste 4-6", "hubAges79": "Vârste 7-9", "hubAges912": "Vârste 9-12", "hubDifficultyMedium": "Puzzle-uri Medii", "hubDifficultyHard": "Puzzle-uri Grele"},
"ru": {"hubAges46": "Возраст 4-6", "hubAges79": "Возраст 7-9", "hubAges912": "Возраст 9-12", "hubDifficultyMedium": "Средние Головоломки", "hubDifficultyHard": "Сложные Головоломки"},
"sk": {"hubAges46": "Vek 4-6", "hubAges79": "Vek 7-9", "hubAges912": "Vek 9-12", "hubDifficultyMedium": "Stredné Skladačky", "hubDifficultyHard": "Ťažké Skladačky"},
"sl": {"hubAges46": "Starost 4-6", "hubAges79": "Starost 7-9", "hubAges912": "Starost 9-12", "hubDifficultyMedium": "Srednje Uganke", "hubDifficultyHard": "Težke Uganke"},
"sv": {"hubAges46": "Ålder 4-6", "hubAges79": "Ålder 7-9", "hubAges912": "Ålder 9-12", "hubDifficultyMedium": "Medelsvåra Pussel", "hubDifficultyHard": "Svåra Pussel"},
"th": {"hubAges46": "อายุ 4-6", "hubAges79": "อายุ 7-9", "hubAges912": "อายุ 9-12", "hubDifficultyMedium": "ปริศนาปานกลาง", "hubDifficultyHard": "ปริศนายาก"},
"tr": {"hubAges46": "Yaş 4-6", "hubAges79": "Yaş 7-9", "hubAges912": "Yaş 9-12", "hubDifficultyMedium": "Orta Bulmacalar", "hubDifficultyHard": "Zor Bulmacalar"},
"uk": {"hubAges46": "Вік 4-6", "hubAges79": "Вік 7-9", "hubAges912": "Вік 9-12", "hubDifficultyMedium": "Середні Головоломки", "hubDifficultyHard": "Складні Головоломки"},
"vi": {"hubAges46": "Tuổi 4-6", "hubAges79": "Tuổi 7-9", "hubAges912": "Tuổi 9-12", "hubDifficultyMedium": "Câu Đố Trung Bình", "hubDifficultyHard": "Câu Đố Khó"},
}
