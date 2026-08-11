import json
import os

BASE = os.path.join("ui-app", "content")

# locale -> { common: {...}, puzzleDetail: {...} }
TRANSLATIONS = {
    "en": {
        "common": {
            "freePrintablePuzzlesCount": "{count} free printable puzzles",
            "backToAllCategories": "Back to all categories",
        },
        "puzzleDetail": {
            "freeCategoryPrintable": "Free {category} Printable",
            "puzzleTitleFallback": "{name} Dot-to-Dot Printable",
            "backToAllCategoryPuzzles": "Back to all {category} puzzles",
            "dotGuideHeading": "{name} Dot-to-Dot Puzzle Guide",
            "moreFreeCategoryPrintables": "More free {category} printables",
            "coloringGuideHeading": "{name} Coloring Guide",
        },
    },
    "ar": {
        "common": {
            "freePrintablePuzzlesCount": "{count} لغز قابل للطباعة مجانًا",
            "backToAllCategories": "العودة إلى جميع الفئات",
        },
        "puzzleDetail": {
            "freeCategoryPrintable": "لغز {category} مجاني للطباعة",
            "puzzleTitleFallback": "لغز توصيل النقاط {name}",
            "backToAllCategoryPuzzles": "العودة إلى جميع ألغاز {category}",
            "dotGuideHeading": "دليل لغز توصيل النقاط {name}",
            "moreFreeCategoryPrintables": "المزيد من ألغاز {category} المجانية للطباعة",
            "coloringGuideHeading": "دليل تلوين {name}",
        },
    },
    "az": {
        "common": {
            "freePrintablePuzzlesCount": "{count} pulsuz çap oluna bilən tapmaca",
            "backToAllCategories": "Bütün kateqoriyalara qayıt",
        },
        "puzzleDetail": {
            "freeCategoryPrintable": "Pulsuz {category} Çap Materialı",
            "puzzleTitleFallback": "{name} Nöqtədən Nöqtəyə Çap Materialı",
            "backToAllCategoryPuzzles": "Bütün {category} tapmacalarına qayıt",
            "dotGuideHeading": "{name} Nöqtədən Nöqtəyə Bələdçisi",
            "moreFreeCategoryPrintables": "Daha çox pulsuz {category} çap materialı",
            "coloringGuideHeading": "{name} Boyama Bələdçisi",
        },
    },
    "cs": {
        "common": {
            "freePrintablePuzzlesCount": "{count} bezplatných tiskových hádanek",
            "backToAllCategories": "Zpět na všechny kategorie",
        },
        "puzzleDetail": {
            "freeCategoryPrintable": "Zdarma tisknutelná hádanka {category}",
            "puzzleTitleFallback": "{name} — Spoj Tečky k Vytisknutí",
            "backToAllCategoryPuzzles": "Zpět na všechny hádanky {category}",
            "dotGuideHeading": "Průvodce hádankou {name}",
            "moreFreeCategoryPrintables": "Další bezplatné tiskoviny {category}",
            "coloringGuideHeading": "Průvodce vybarvováním {name}",
        },
    },
    "da": {
        "common": {
            "freePrintablePuzzlesCount": "{count} gratis printbare puslespil",
            "backToAllCategories": "Tilbage til alle kategorier",
        },
        "puzzleDetail": {
            "freeCategoryPrintable": "Gratis {category} Printark",
            "puzzleTitleFallback": "{name} Prik-til-prik Printark",
            "backToAllCategoryPuzzles": "Tilbage til alle {category} puslespil",
            "dotGuideHeading": "{name} Prik-til-prik Guide",
            "moreFreeCategoryPrintables": "Flere gratis {category} printark",
            "coloringGuideHeading": "{name} Farvelægningsguide",
        },
    },
    "de": {
        "common": {
            "freePrintablePuzzlesCount": "{count} kostenlose Ausmalrätsel zum Ausdrucken",
            "backToAllCategories": "Zurück zu allen Kategorien",
        },
        "puzzleDetail": {
            "freeCategoryPrintable": "Kostenloses {category} Arbeitsblatt",
            "puzzleTitleFallback": "{name} Punkt-zu-Punkt-Arbeitsblatt",
            "backToAllCategoryPuzzles": "Zurück zu allen {category}-Rätseln",
            "dotGuideHeading": "{name} Punkt-zu-Punkt-Anleitung",
            "moreFreeCategoryPrintables": "Weitere kostenlose {category}-Arbeitsblätter",
            "coloringGuideHeading": "{name} Ausmalanleitung",
        },
    },
    "el": {
        "common": {
            "freePrintablePuzzlesCount": "{count} δωρεάν εκτυπώσιμα παζλ",
            "backToAllCategories": "Επιστροφή σε όλες τις κατηγορίες",
        },
        "puzzleDetail": {
            "freeCategoryPrintable": "Δωρεάν εκτυπώσιμο {category}",
            "puzzleTitleFallback": "{name} Εκτυπώσιμο Ένωσε τις Τελείες",
            "backToAllCategoryPuzzles": "Επιστροφή σε όλα τα παζλ {category}",
            "dotGuideHeading": "Οδηγός παζλ {name}",
            "moreFreeCategoryPrintables": "Περισσότερα δωρεάν εκτυπώσιμα {category}",
            "coloringGuideHeading": "Οδηγός χρωματισμού {name}",
        },
    },
    "es": {
        "common": {
            "freePrintablePuzzlesCount": "{count} puzles imprimibles gratis",
            "backToAllCategories": "Volver a todas las categorías",
        },
        "puzzleDetail": {
            "freeCategoryPrintable": "Imprimible Gratis de {category}",
            "puzzleTitleFallback": "{name} Une los Puntos para Imprimir",
            "backToAllCategoryPuzzles": "Volver a todos los puzles de {category}",
            "dotGuideHeading": "Guía del puzle {name}",
            "moreFreeCategoryPrintables": "Más imprimibles gratis de {category}",
            "coloringGuideHeading": "Guía para colorear {name}",
        },
    },
    "fa": {
        "common": {
            "freePrintablePuzzlesCount": "{count} پازل رایگان قابل چاپ",
            "backToAllCategories": "بازگشت به همه دسته‌ها",
        },
        "puzzleDetail": {
            "freeCategoryPrintable": "برگه رایگان {category} برای چاپ",
            "puzzleTitleFallback": "پازل نقطه به نقطه {name}",
            "backToAllCategoryPuzzles": "بازگشت به همه پازل‌های {category}",
            "dotGuideHeading": "راهنمای پازل {name}",
            "moreFreeCategoryPrintables": "برگه‌های رایگان بیشتر {category}",
            "coloringGuideHeading": "راهنمای رنگ‌آمیزی {name}",
        },
    },
    "fi": {
        "common": {
            "freePrintablePuzzlesCount": "{count} ilmaista tulostettavaa palapeliä",
            "backToAllCategories": "Takaisin kaikkiin kategorioihin",
        },
        "puzzleDetail": {
            "freeCategoryPrintable": "Ilmainen {category}-tulostettava",
            "puzzleTitleFallback": "{name} Pisteestä Pisteeseen -tulostettava",
            "backToAllCategoryPuzzles": "Takaisin kaikkiin {category}-palapeleihin",
            "dotGuideHeading": "{name}-palapelin opas",
            "moreFreeCategoryPrintables": "Lisää ilmaisia {category}-tulostettavia",
            "coloringGuideHeading": "{name}-värityksen opas",
        },
    },
    "fr": {
        "common": {
            "freePrintablePuzzlesCount": "{count} puzzles imprimables gratuits",
            "backToAllCategories": "Retour à toutes les catégories",
        },
        "puzzleDetail": {
            "freeCategoryPrintable": "Imprimable Gratuit {category}",
            "puzzleTitleFallback": "{name} Points à Relier à Imprimer",
            "backToAllCategoryPuzzles": "Retour à tous les puzzles {category}",
            "dotGuideHeading": "Guide du puzzle {name}",
            "moreFreeCategoryPrintables": "Plus d'imprimables gratuits {category}",
            "coloringGuideHeading": "Guide de coloriage {name}",
        },
    },
    "hr": {
        "common": {
            "freePrintablePuzzlesCount": "{count} besplatnih zagonetki za ispis",
            "backToAllCategories": "Natrag na sve kategorije",
        },
        "puzzleDetail": {
            "freeCategoryPrintable": "Besplatan {category} za ispis",
            "puzzleTitleFallback": "{name} Spoji Točke za Ispis",
            "backToAllCategoryPuzzles": "Natrag na sve {category} zagonetke",
            "dotGuideHeading": "Vodič za zagonetku {name}",
            "moreFreeCategoryPrintables": "Više besplatnih {category} materijala za ispis",
            "coloringGuideHeading": "Vodič za bojanje {name}",
        },
    },
    "hu": {
        "common": {
            "freePrintablePuzzlesCount": "{count} ingyenesen nyomtatható rejtvény",
            "backToAllCategories": "Vissza az összes kategóriához",
        },
        "puzzleDetail": {
            "freeCategoryPrintable": "Ingyenes {category} nyomtatvány",
            "puzzleTitleFallback": "{name} Kösd Össze a Pontokat Nyomtatvány",
            "backToAllCategoryPuzzles": "Vissza az összes {category} rejtvényhez",
            "dotGuideHeading": "{name} rejtvény útmutató",
            "moreFreeCategoryPrintables": "További ingyenes {category} nyomtatványok",
            "coloringGuideHeading": "{name} színezési útmutató",
        },
    },
    "id": {
        "common": {
            "freePrintablePuzzlesCount": "{count} puzzle cetak gratis",
            "backToAllCategories": "Kembali ke semua kategori",
        },
        "puzzleDetail": {
            "freeCategoryPrintable": "Lembar Cetak Gratis {category}",
            "puzzleTitleFallback": "{name} Lembar Cetak Hubungkan Titik",
            "backToAllCategoryPuzzles": "Kembali ke semua puzzle {category}",
            "dotGuideHeading": "Panduan puzzle {name}",
            "moreFreeCategoryPrintables": "Lembar cetak gratis {category} lainnya",
            "coloringGuideHeading": "Panduan mewarnai {name}",
        },
    },
    "it": {
        "common": {
            "freePrintablePuzzlesCount": "{count} puzzle stampabili gratis",
            "backToAllCategories": "Torna a tutte le categorie",
        },
        "puzzleDetail": {
            "freeCategoryPrintable": "Stampabile Gratuito {category}",
            "puzzleTitleFallback": "{name} Unisci i Puntini da Stampare",
            "backToAllCategoryPuzzles": "Torna a tutti i puzzle di {category}",
            "dotGuideHeading": "Guida al puzzle {name}",
            "moreFreeCategoryPrintables": "Altri stampabili gratuiti di {category}",
            "coloringGuideHeading": "Guida ai colori {name}",
        },
    },
    "ja": {
        "common": {
            "freePrintablePuzzlesCount": "{count}件の無料印刷パズル",
            "backToAllCategories": "すべてのカテゴリーに戻る",
        },
        "puzzleDetail": {
            "freeCategoryPrintable": "無料{category}印刷用プリント",
            "puzzleTitleFallback": "{name} 点つなぎ印刷用プリント",
            "backToAllCategoryPuzzles": "すべての{category}パズルに戻る",
            "dotGuideHeading": "{name} パズルガイド",
            "moreFreeCategoryPrintables": "他の無料{category}プリント",
            "coloringGuideHeading": "{name} 塗り絵ガイド",
        },
    },
    "ko": {
        "common": {
            "freePrintablePuzzlesCount": "무료 인쇄 퍼즐 {count}개",
            "backToAllCategories": "모든 카테고리로 돌아가기",
        },
        "puzzleDetail": {
            "freeCategoryPrintable": "무료 {category} 인쇄물",
            "puzzleTitleFallback": "{name} 점 잇기 인쇄물",
            "backToAllCategoryPuzzles": "모든 {category} 퍼즐로 돌아가기",
            "dotGuideHeading": "{name} 퍼즐 가이드",
            "moreFreeCategoryPrintables": "더 많은 무료 {category} 인쇄물",
            "coloringGuideHeading": "{name} 색칠 가이드",
        },
    },
    "lt": {
        "common": {
            "freePrintablePuzzlesCount": "{count} nemokamų spausdinamų galvosūkių",
            "backToAllCategories": "Grįžti į visas kategorijas",
        },
        "puzzleDetail": {
            "freeCategoryPrintable": "Nemokamas {category} spaudinys",
            "puzzleTitleFallback": "{name} taškų jungimo spaudinys",
            "backToAllCategoryPuzzles": "Grįžti į visus {category} galvosūkius",
            "dotGuideHeading": "{name} galvosūkio vadovas",
            "moreFreeCategoryPrintables": "Daugiau nemokamų {category} spaudinių",
            "coloringGuideHeading": "{name} spalvinimo vadovas",
        },
    },
    "lv": {
        "common": {
            "freePrintablePuzzlesCount": "{count} bezmaksas drukājamas mīklas",
            "backToAllCategories": "Atpakaļ uz visām kategorijām",
        },
        "puzzleDetail": {
            "freeCategoryPrintable": "Bezmaksas {category} izdruka",
            "puzzleTitleFallback": "{name} savieno punktus izdruka",
            "backToAllCategoryPuzzles": "Atpakaļ uz visām {category} mīklām",
            "dotGuideHeading": "{name} mīklas ceļvedis",
            "moreFreeCategoryPrintables": "Vairāk bezmaksas {category} izdruku",
            "coloringGuideHeading": "{name} krāsošanas ceļvedis",
        },
    },
    "nl": {
        "common": {
            "freePrintablePuzzlesCount": "{count} gratis printbare puzzels",
            "backToAllCategories": "Terug naar alle categorieën",
        },
        "puzzleDetail": {
            "freeCategoryPrintable": "Gratis {category} Printblad",
            "puzzleTitleFallback": "{name} Stip-tot-stip Printblad",
            "backToAllCategoryPuzzles": "Terug naar alle {category} puzzels",
            "dotGuideHeading": "{name} puzzelgids",
            "moreFreeCategoryPrintables": "Meer gratis {category} printbladen",
            "coloringGuideHeading": "{name} kleurgids",
        },
    },
    "no": {
        "common": {
            "freePrintablePuzzlesCount": "{count} gratis utskrivbare puslespill",
            "backToAllCategories": "Tilbake til alle kategorier",
        },
        "puzzleDetail": {
            "freeCategoryPrintable": "Gratis {category}-ark",
            "puzzleTitleFallback": "{name} Prikk-til-prikk-ark",
            "backToAllCategoryPuzzles": "Tilbake til alle {category}-puslespill",
            "dotGuideHeading": "{name}-puslespillguide",
            "moreFreeCategoryPrintables": "Flere gratis {category}-ark",
            "coloringGuideHeading": "{name}-fargeleggingsguide",
        },
    },
    "pl": {
        "common": {
            "freePrintablePuzzlesCount": "{count} darmowych łamigłówek do druku",
            "backToAllCategories": "Powrót do wszystkich kategorii",
        },
        "puzzleDetail": {
            "freeCategoryPrintable": "Darmowa łamigłówka {category} do druku",
            "puzzleTitleFallback": "{name} — Połącz Kropki do Druku",
            "backToAllCategoryPuzzles": "Powrót do wszystkich łamigłówek {category}",
            "dotGuideHeading": "Przewodnik po łamigłówce {name}",
            "moreFreeCategoryPrintables": "Więcej darmowych wydruków {category}",
            "coloringGuideHeading": "Przewodnik po kolorowaniu {name}",
        },
    },
    "pt": {
        "common": {
            "freePrintablePuzzlesCount": "{count} puzzles gratuitos para imprimir",
            "backToAllCategories": "Voltar a todas as categorias",
        },
        "puzzleDetail": {
            "freeCategoryPrintable": "Ficha Gratuita de {category}",
            "puzzleTitleFallback": "{name} Liga os Pontos para Imprimir",
            "backToAllCategoryPuzzles": "Voltar a todos os puzzles de {category}",
            "dotGuideHeading": "Guia do puzzle {name}",
            "moreFreeCategoryPrintables": "Mais fichas gratuitas de {category}",
            "coloringGuideHeading": "Guia de coloração {name}",
        },
    },
    "pt-BR": {
        "common": {
            "freePrintablePuzzlesCount": "{count} quebra-cabeças gratuitos para imprimir",
            "backToAllCategories": "Voltar para todas as categorias",
        },
        "puzzleDetail": {
            "freeCategoryPrintable": "Ficha Gratuita de {category}",
            "puzzleTitleFallback": "{name} Ligue os Pontos para Imprimir",
            "backToAllCategoryPuzzles": "Voltar para todos os quebra-cabeças de {category}",
            "dotGuideHeading": "Guia do quebra-cabeça {name}",
            "moreFreeCategoryPrintables": "Mais fichas gratuitas de {category}",
            "coloringGuideHeading": "Guia de colorir {name}",
        },
    },
    "ro": {
        "common": {
            "freePrintablePuzzlesCount": "{count} jocuri de unit puncte gratuite de printat",
            "backToAllCategories": "Înapoi la toate categoriile",
        },
        "puzzleDetail": {
            "freeCategoryPrintable": "Fișă Gratuită {category} de Printat",
            "puzzleTitleFallback": "{name} Unește Punctele de Printat",
            "backToAllCategoryPuzzles": "Înapoi la toate jocurile {category}",
            "dotGuideHeading": "Ghidul jocului {name}",
            "moreFreeCategoryPrintables": "Mai multe fișe gratuite {category}",
            "coloringGuideHeading": "Ghid de colorat {name}",
        },
    },
    "ru": {
        "common": {
            "freePrintablePuzzlesCount": "{count} бесплатных распечатываемых пазлов",
            "backToAllCategories": "Назад ко всем категориям",
        },
        "puzzleDetail": {
            "freeCategoryPrintable": "Бесплатная распечатка {category}",
            "puzzleTitleFallback": "{name} — соедини точки для печати",
            "backToAllCategoryPuzzles": "Назад ко всем пазлам {category}",
            "dotGuideHeading": "Руководство по пазлу {name}",
            "moreFreeCategoryPrintables": "Больше бесплатных распечаток {category}",
            "coloringGuideHeading": "Руководство по раскрашиванию {name}",
        },
    },
    "sk": {
        "common": {
            "freePrintablePuzzlesCount": "{count} bezplatných tlačiteľných hádaniek",
            "backToAllCategories": "Späť na všetky kategórie",
        },
        "puzzleDetail": {
            "freeCategoryPrintable": "Bezplatná tlačiteľná hádanka {category}",
            "puzzleTitleFallback": "{name} — Spoj Bodky na Tlač",
            "backToAllCategoryPuzzles": "Späť na všetky hádanky {category}",
            "dotGuideHeading": "Sprievodca hádankou {name}",
            "moreFreeCategoryPrintables": "Ďalšie bezplatné tlačoviny {category}",
            "coloringGuideHeading": "Sprievodca vyfarbovaním {name}",
        },
    },
    "sl": {
        "common": {
            "freePrintablePuzzlesCount": "{count} brezplačnih ugank za tiskanje",
            "backToAllCategories": "Nazaj na vse kategorije",
        },
        "puzzleDetail": {
            "freeCategoryPrintable": "Brezplačna tiskovina {category}",
            "puzzleTitleFallback": "{name} poveži pike za tiskanje",
            "backToAllCategoryPuzzles": "Nazaj na vse uganke {category}",
            "dotGuideHeading": "Vodnik po uganki {name}",
            "moreFreeCategoryPrintables": "Več brezplačnih tiskovin {category}",
            "coloringGuideHeading": "Vodnik za barvanje {name}",
        },
    },
    "sv": {
        "common": {
            "freePrintablePuzzlesCount": "{count} gratis utskrivbara pussel",
            "backToAllCategories": "Tillbaka till alla kategorier",
        },
        "puzzleDetail": {
            "freeCategoryPrintable": "Gratis {category}-utskrift",
            "puzzleTitleFallback": "{name} Prick-till-prick-utskrift",
            "backToAllCategoryPuzzles": "Tillbaka till alla {category}-pussel",
            "dotGuideHeading": "{name}-pusselguide",
            "moreFreeCategoryPrintables": "Fler gratis {category}-utskrifter",
            "coloringGuideHeading": "{name}-färgläggningsguide",
        },
    },
    "th": {
        "common": {
            "freePrintablePuzzlesCount": "ปริศนาพิมพ์ฟรี {count} ชิ้น",
            "backToAllCategories": "กลับไปยังทุกหมวดหมู่",
        },
        "puzzleDetail": {
            "freeCategoryPrintable": "ใบงาน {category} พิมพ์ฟรี",
            "puzzleTitleFallback": "ใบงานลากเส้นต่อจุด {name}",
            "backToAllCategoryPuzzles": "กลับไปยังปริศนา {category} ทั้งหมด",
            "dotGuideHeading": "คู่มือปริศนา {name}",
            "moreFreeCategoryPrintables": "ใบงาน {category} ฟรีเพิ่มเติม",
            "coloringGuideHeading": "คู่มือระบายสี {name}",
        },
    },
    "tr": {
        "common": {
            "freePrintablePuzzlesCount": "{count} ücretsiz yazdırılabilir bulmaca",
            "backToAllCategories": "Tüm kategorilere dön",
        },
        "puzzleDetail": {
            "freeCategoryPrintable": "Ücretsiz {category} Baskı Sayfası",
            "puzzleTitleFallback": "{name} Noktaları Birleştir Baskı Sayfası",
            "backToAllCategoryPuzzles": "Tüm {category} bulmacalarına dön",
            "dotGuideHeading": "{name} bulmaca rehberi",
            "moreFreeCategoryPrintables": "Daha fazla ücretsiz {category} baskı sayfası",
            "coloringGuideHeading": "{name} boyama rehberi",
        },
    },
    "uk": {
        "common": {
            "freePrintablePuzzlesCount": "{count} безкоштовних пазлів для друку",
            "backToAllCategories": "Назад до всіх категорій",
        },
        "puzzleDetail": {
            "freeCategoryPrintable": "Безкоштовний друк {category}",
            "puzzleTitleFallback": "{name} — з'єднай крапки для друку",
            "backToAllCategoryPuzzles": "Назад до всіх пазлів {category}",
            "dotGuideHeading": "Посібник із пазла {name}",
            "moreFreeCategoryPrintables": "Більше безкоштовних друкованих {category}",
            "coloringGuideHeading": "Посібник із розфарбовування {name}",
        },
    },
    "vi": {
        "common": {
            "freePrintablePuzzlesCount": "{count} câu đố in miễn phí",
            "backToAllCategories": "Quay lại tất cả danh mục",
        },
        "puzzleDetail": {
            "freeCategoryPrintable": "Bản In Miễn Phí {category}",
            "puzzleTitleFallback": "{name} Bản In Nối Các Chấm",
            "backToAllCategoryPuzzles": "Quay lại tất cả câu đố {category}",
            "dotGuideHeading": "Hướng dẫn câu đố {name}",
            "moreFreeCategoryPrintables": "Thêm bản in miễn phí {category}",
            "coloringGuideHeading": "Hướng dẫn tô màu {name}",
        },
    },
}

changed = []
missing = []
for locale, namespaces in TRANSLATIONS.items():
    path = os.path.join(BASE, locale, "messages.json")
    if not os.path.exists(path):
        missing.append(path)
        continue
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    for ns, keys in namespaces.items():
        data.setdefault(ns, {})
        for k, v in keys.items():
            data[ns][k] = v
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")
    changed.append(path)

print(f"Updated {len(changed)} files")
if missing:
    print("Missing files:")
    for m in missing:
        print(" ", m)
