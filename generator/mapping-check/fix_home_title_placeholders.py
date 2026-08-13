#!/usr/bin/env python3
"""
mapping_audit_home.db: header.title and header.og.title were left as the
English literal for 22/33 locales (11 locales, incl. en/ar/de/es/fr/it/ja/nl/
pt/ru, already had real translated SEO titles). Fill in the remaining 22 with
translations matching the established style: a keyword-rich <title> ("free
dot-to-dot for kids | printable PDF worksheets") and a shorter og:title
("dot-to-dot / connect the dots -- free puzzles for kids & adults").
"""
from __future__ import annotations

import io
import sqlite3
import sys
from pathlib import Path

if hasattr(sys.stdout, "buffer"):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

HERE = Path(__file__).resolve().parent
DB_PATH = HERE / "mapping_audit_home.db"

TRANSLATIONS = {
    "az": ("Pulsuz nöqtələri birləşdir uşaqlar üçün | PDF çap materialları", "Nöqtələri birləşdir – uşaqlar və böyüklər üçün pulsuz tapmacalar"),
    "cs": ("Spojovačky zdarma pro děti | PDF pracovní listy ke stažení", "Spojovačky – bezplatné hádanky pro děti i dospělé"),
    "da": ("Gratis prik til prik for børn | PDF-ark til print", "Prik til prik – gratis puslespil for børn og voksne"),
    "el": ("Δωρεάν ένωσε τις τελείες για παιδιά | Εκτυπώσιμα φύλλα PDF", "Ένωσε τις τελείες – δωρεάν παζλ για παιδιά και ενήλικες"),
    "fa": ("اتصال نقاط رایگان برای کودکان | کاربرگ‌های PDF قابل چاپ", "اتصال نقاط — پازل رایگان برای کودکان و بزرگسالان"),
    "hr": ("Besplatno spajanje točkica za djecu | PDF radni listovi za ispis", "Spoji točkice – besplatne zagonetke za djecu i odrasle"),
    "hu": ("Ingyenes pontösszekötő gyerekeknek | Nyomtatható PDF feladatlapok", "Pontösszekötő – ingyenes rejtvények gyerekeknek és felnőtteknek"),
    "id": ("Hubungkan titik gratis untuk anak-anak | Lembar kerja PDF cetak", "Hubungkan titik – teka-teki gratis untuk anak-anak dan dewasa"),
    "ko": ("무료 점 잇기 어린이용 | 인쇄 가능한 PDF 워크시트", "점 잇기 — 어린이와 성인을 위한 무료 퍼즐"),
    "lt": ("Nemokamas taškų jungimas vaikams | Spausdinami PDF lapai", "Sujunk taškus – nemokami galvosūkiai vaikams ir suaugusiems"),
    "lv": ("Bezmaksas punktu savienošana bērniem | Drukājamas PDF darblapas", "Savieno punktus – bezmaksas mīklas bērniem un pieaugušajiem"),
    "no": ("Gratis prikk til prikk for barn | PDF-ark til utskrift", "Prikk til prikk – gratis puslespill for barn og voksne"),
    "pl": ("Darmowe łączenie kropek dla dzieci | Karty PDF do druku", "Połącz kropki – darmowe zagadki dla dzieci i dorosłych"),
    "pt-BR": ("Ligue os pontos grátis para crianças | Fichas em PDF para imprimir", "Ligue os pontos — atividades gratuitas para crianças e adultos"),
    "ro": ("Unește punctele gratuit pentru copii | Fișe PDF de printat", "Unește punctele – jocuri gratuite pentru copii și adulți"),
    "sk": ("Bezplatné spájanie bodiek pre deti | PDF pracovné listy na tlač", "Spoj bodky – bezplatné hádanky pre deti a dospelých"),
    "sl": ("Brezplačno povezovanje pik za otroke | PDF delovni listi za tiskanje", "Poveži pike – brezplačne uganke za otroke in odrasle"),
    "sv": ("Gratis prick till prick för barn | PDF-ark att skriva ut", "Prick till prick – gratis pussel för barn och vuxna"),
    "th": ("จุดต่อจุดฟรีสำหรับเด็ก | ใบงาน PDF พร้อมพิมพ์", "จุดต่อจุด — ปริศนาฟรีสำหรับเด็กและผู้ใหญ่"),
    "tr": ("Çocuklar için ücretsiz noktaları birleştir | Yazdırılabilir PDF çalışma sayfaları", "Noktaları birleştir – çocuklar ve yetişkinler için ücretsiz bulmacalar"),
    "uk": ("Безкоштовні з'єднай крапки для дітей | PDF-аркуші для друку", "З'єднай крапки — безкоштовні головоломки для дітей та дорослих"),
    "vi": ("Nối các chấm miễn phí cho trẻ em | Phiếu bài tập PDF để in", "Nối các chấm – trò chơi miễn phí cho trẻ em và người lớn"),
}


def main() -> int:
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    updated = 0
    for locale, (title, og_title) in TRANSLATIONS.items():
        for key, value in (("header.title", title), ("header.og.title", og_title)):
            cur.execute(
                "update mapping_audit set new_value = ?, status = 'OK', "
                "notes = 'fixed: was untranslated English literal, replaced with translated SEO title' "
                "where puzzle_slug = 'home' and language = ? and new_key = ?",
                (value, locale, key),
            )
            if cur.rowcount == 0:
                print(f"WARN no existing row for home/{locale}/{key}")
            updated += cur.rowcount

    conn.commit()

    cur.execute(
        "select language,new_value from mapping_audit where new_key='header.title' order by language"
    )
    print("\n--- header.title after fix ---")
    for row in cur.fetchall():
        print(row)

    conn.close()
    print(f"\nUpdated {updated} rows across {len(TRANSLATIONS)} locales.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
