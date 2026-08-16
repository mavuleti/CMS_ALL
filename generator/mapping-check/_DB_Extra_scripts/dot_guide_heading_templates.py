"""Per-locale template for the synthesized `body.dot_guide.heading` field.

`dot_guide.heading` has no legacy/prod source at all (see
audit_single_puzzle.py) - every locale generates it as
"{prefix}{puzzle name}{suffix}", e.g. English's
"How to Solve the {name} Dot-to-Dot Puzzle". Extracted 2026-08-16 from every
locale's own already-migrated content (content/{locale}/puzzles-garden.json,
puzzle[0]) and verified consistent across every other already-migrated
category (dinosaurs, garden, etc.) before use - do not hand-edit a value here
without doing the same cross-check.

Used by clone_en_to_language.py to regenerate this field for a locale from
that locale's own translated puzzle name, since it is NOT clonable from prod
content the way ordinary fields are.
"""

HEADING_TEMPLATES: dict[str, tuple[str, str]] = {
    'ar': ('كيفية حل لغز توصيل النقاط ', ''),
    'az': ('', ' Nöqtədən Nöqtəyə Tapmacasını Necə Həll Etməli'),
    'cs': ('Jak vyřešit obrázek spoj tečky ', ''),
    'da': ('Sådan løser du prik til prik-puslespillet ', ''),
    'de': ('So löst du das ', ' Punkt-zu-Punkt-Rätsel'),
    'el': ('Πώς να λύσετε το παζλ ένωσης κουκκίδων ', ''),
    'en': ('How to Solve the ', ' Dot-to-Dot Puzzle'),
    'es': ('Cómo resolver el rompecabezas de unir puntos ', ''),
    'fa': ('چگونه پازل نقطه به نقطه ', ' را حل کنیم'),
    'fi': ('Näin ratkaiset ', '-yhdistä pisteet -tehtävän'),
    'fr': ('Comment résoudre le puzzle de points à relier ', ''),
    'hr': ('Kako riješiti puzzle spoji točke ', ''),
    'hu': ('Hogyan oldd meg a ', ' pontösszekötő rejtvényt'),
    'id': ('Cara menyelesaikan teka-teki hubungkan titik ', ''),
    'it': ('Come risolvere il puzzle unisci i puntini ', ''),
    'ja': ('', 'の点つなぎパズルの解き方'),
    'ko': ('', ' 점 잇기 퍼즐 푸는 방법'),
    'lt': ('Kaip išspręsti „Sujunk taškus" galvosūkį ', ''),
    'lv': ('Kā atrisināt "Savieno punktus" mīklu ', ''),
    'nl': ('Zo los je de ', ' stip-tot-stip-puzzel op'),
    'no': ('Slik løser du prikk til prikk-puslespillet ', ''),
    'pl': ('Jak rozwiązać łamigłówkę połącz kropki ', ''),
    'pt': ('Como resolver o puzzle de ligar pontos ', ''),
    'pt-BR': ('Como resolver o quebra-cabeça de ligar pontos ', ''),
    'ro': ('Cum se rezolvă puzzle-ul unește punctele ', ''),
    'ru': ('Как решить головоломку «Соедини точки» ', ''),
    'sk': ('Ako vyriešiť obrázok spoj bodky ', ''),
    'sl': ('Kako rešiti sestavljanko poveži pike ', ''),
    'sv': ('Så löser du prick till prick-pusslet ', ''),
    'th': ('วิธีแก้ปริศนาลากเส้นต่อจุด ', ''),
    'tr': ('', ' noktaları birleştirme bulmacası nasıl çözülür'),
    'uk': ("Як розв'язати головоломку «З'єднай крапки» ", ''),
    'vi': ('Cách giải câu đố nối các chấm ', ''),
}


def heading_for(locale: str, name: str) -> str | None:
    template = HEADING_TEMPLATES.get(locale)
    if not template or not name:
        return None
    prefix, suffix = template
    return f"{prefix}{name}{suffix}"
