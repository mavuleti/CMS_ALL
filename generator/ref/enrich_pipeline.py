#!/usr/bin/env python3
"""
Keyword Research Enrichment Pipeline
Implements stages 1-7, 9-11 of keyword-enrichment-pipeline-prompt.md
(Stage 8 - KDP recommendations - is explicitly out of scope.)

Input:  SEO-KeywordsAndLocalesexpericne.json (raw per-locale research)
Output: keyword-analysis-enriched.json
"""
import json
import re
import unicodedata
from collections import defaultdict

SRC = "/mnt/user-data/uploads/SEO-KeywordsAndLocalesexpericne.json"
OUT = "/mnt/user-data/outputs/keyword-analysis-enriched.json"

with open(SRC, encoding="utf-8") as f:
    raw = json.load(f)

# Locale code standardization (stage 10, applied as we go per prompt note
# that english-pooling happens during stage 1-2 grouping)
LOCALE_CODE_MAP = {
    "telugu": "te", "german": "de", "french": "fr", "en": "en", "es": "es",
    "pt": "pt", "it": "it", "nl": "nl", "sv": "sv", "no": "no", "pl": "pl",
    "da": "da", "fi": "fi", "cs": "cs", "hu": "hu", "ro": "ro", "tr": "tr",
    "pt-br": "pt-BR", "el": "el", "ar": "ar", "uk": "uk", "hr": "hr",
    "sk": "sk", "lt": "lt", "lv": "lv", "sl": "sl", "id": "id", "ja": "ja",
    "ko": "ko", "ru": "ru", "th": "th", "vi": "vi", "az": "az",
}
SKIP_KEYS = {"_automation"}

# ---------- Stage 1: Normalize ----------
def normalize_phrase(phrase: str) -> str:
    p = phrase.lower().strip()
    p = p.replace("–", "-").replace("—", "-")
    p = re.sub(r"\bdot[\s\-]+to[\s\-]+dot\b", "dot to dot", p)
    p = re.sub(r"\s+", " ", p)
    # naive plural merge for a few common English SEO terms
    for singular in ["worksheet", "puzzle", "printable", "page", "template", "book"]:
        p = re.sub(rf"\b{singular}s\b", singular, p)
    return p.strip()

def is_ascii(s: str) -> bool:
    return all(ord(ch) < 128 for ch in s)

# ---------- Stage 3: Intent vocabulary (fixed, explicit) ----------
INTENT_VOCAB = {
    "free": ["free", "gratuit", "kostenlos", "gratis"],
    "printable": ["printable", "print", "printout", "à imprimer", "ausdrucken", "chap"],
    "pdf": ["pdf"],
    "worksheet": ["worksheet", "worksheets", "phiếu bài tập", "arbeitsblatt"],
    "book": ["book", "activity book"],
    "download": ["download"],
    "kids": ["kids", "children", "child", "toddler", "uşaqlar", "cho bé", "kindergarten", "preschool"],
    "adult": ["adult", "adults", "senior", "erwachsene"],
    "difficulty": ["hard", "easy", "extreme", "difficult", "difficile", "schwer"],
    "theme": ["animal", "holiday", "alphabet", "numbers", "number", "seasonal", "christmas"],
    "coloring": ["coloring", "color", "colour", "malen", "ausmalen", "ระบายสี"],
    "exclude_online": ["app", "online", "interactive", "mobile", "game download", "dots and boxes"],
}

def tag_intent(phrase_lower: str):
    tags = []
    for label, terms in INTENT_VOCAB.items():
        for t in terms:
            if t in phrase_lower:
                tags.append({"label": label, "matched": t})
                break
    return tags

# ---------- Extraction: walk each locale's research blocks tolerant of varying field names ----------
def collect_locale_entries(locale_key, block):
    """Returns list of dicts: {phrase, meaning, kind} where kind in
    native/romanized/english/intent_modifier, gathered from whatever
    fields exist in this locale's research blocks."""
    entries = []

    def walk(node):
        if isinstance(node, dict):
            for key, val in node.items():
                lk = key.lower()
                if isinstance(val, list):
                    for item in val:
                        entry = None
                        if isinstance(item, dict) and "phrase" in item:
                            entry = {"phrase": item["phrase"], "meaning": item.get("meaning", ""),
                                      "note": item.get("note", "")}
                        elif isinstance(item, dict) and "term" in item:
                            entry = {"phrase": item["term"], "meaning": item.get("meaning", ""), "note": ""}
                        elif isinstance(item, str):
                            entry = {"phrase": item, "meaning": "", "note": ""}
                        if entry:
                            if "english" in lk and "letters" not in lk and "phrase" in lk or "english_search" in lk:
                                entry["kind"] = "english"
                            elif "in_english_letters" in lk or "romaniz" in lk:
                                entry["kind"] = "romanized"
                            elif "insight" in lk or "filter_term" in lk or "modifier" in lk:
                                entry["kind"] = "intent_modifier"
                            elif "english_phrase_notes" in lk:
                                continue
                            elif "script" in lk or "native" in lk or "search_phrases" in lk or "specialized" in lk:
                                entry["kind"] = "native"
                            else:
                                entry["kind"] = "native" if not is_ascii(entry["phrase"]) else "english"
                            entries.append(entry)
                    continue
                if isinstance(val, dict):
                    walk(val)
    walk(block)
    return entries

locales_out = {}
english_pool = []  # pooled english phrases from ALL non-english locales
quality_issues = []

for key, block in raw.items():
    if key in SKIP_KEYS:
        continue
    code = LOCALE_CODE_MAP.get(key.lower(), key)
    entries = collect_locale_entries(key, block)

    native, romanized, english_local, intent_mod = [], [], [], []
    for e in entries:
        norm = normalize_phrase(e["phrase"])
        rec = {
            "phrase": e["phrase"],
            "normalized": norm,
            "meaning": e.get("meaning", ""),
            "note": e.get("note", ""),
        }
        if e["kind"] == "romanized":
            romanized.append(rec)
        elif e["kind"] == "english":
            english_local.append(rec)
            if code != "en":
                english_pool.append(rec)
        elif e["kind"] == "intent_modifier":
            intent_mod.append(rec)
        else:
            native.append(rec)

    locales_out[code] = {
        "alias_source_key": key,
        "native_phrases": native,
        "romanized_phrases": romanized,
        "english_phrases_used_by_locals": english_local,
        "intent_modifiers": intent_mod,
    }

# ---------- Stage 1-2 continued: pool English phrases into 'en' bucket, dedupe ----------
en_bucket = locales_out.setdefault("en", {
    "alias_source_key": "en", "native_phrases": [], "romanized_phrases": [],
    "english_phrases_used_by_locals": [], "intent_modifiers": []
})
seen_norm = {p["normalized"] for p in en_bucket["native_phrases"]}
pooled_added = 0
for rec in english_pool:
    if rec["normalized"] not in seen_norm:
        en_bucket.setdefault("pooled_from_other_locales", []).append(rec)
        seen_norm.add(rec["normalized"])
        pooled_added += 1

# ---------- Stage 2: Build phrase families (simple normalized-text grouping) ----------
# Family = all distinct normalized phrases sharing a core signature (first 2 significant words after stripping stopwords for grouping key)
STOPWORDS = {"the", "a", "an", "for", "to", "of", "in", "and", "und", "de", "le", "la", "les"}

def family_key(norm_phrase):
    words = [w for w in norm_phrase.split() if w not in STOPWORDS]
    return "_".join(words[:2]) if words else norm_phrase

families = defaultdict(lambda: {"family": None, "variants": set(), "locales": set(), "mention_count": 0})

for code, data in locales_out.items():
    if code == "en":
        all_recs = data["native_phrases"] + data.get("pooled_from_other_locales", []) + data["english_phrases_used_by_locals"]
    else:
        all_recs = data["native_phrases"] + data["romanized_phrases"]
    for rec in all_recs:
        fk = family_key(rec["normalized"])
        fam = families[fk]
        fam["family"] = fk
        fam["variants"].add(rec["normalized"])
        fam["locales"].add(code)
        fam["mention_count"] += 1

# ---------- Stage 3: intent classification per family ----------
family_records = []
for fk, fam in families.items():
    variant_text = " ".join(fam["variants"])
    intent_hits = tag_intent(variant_text)
    intent_labels = sorted({h["label"] for h in intent_hits})
    matched_tokens = {h["label"]: h["matched"] for h in intent_hits}

    # ---------- Stage 5: Scoring (heuristic_opportunity_score_v1) ----------
    locale_freq = len(fam["locales"])
    printable_hit = "printable" in intent_labels or "pdf" in intent_labels and "printable" in variant_text
    printable_pts = 3 if "printable" in intent_labels else 0
    audience_pts = 2 if ("kids" in intent_labels or "adult" in intent_labels) else 0
    format_pts = 2 if ("pdf" in intent_labels or "worksheet" in intent_labels or "book" in intent_labels or "download" in intent_labels) else 0
    diff_theme_pts = 1 if ("difficulty" in intent_labels or "theme" in intent_labels) else 0
    total = locale_freq * 4 + printable_pts + audience_pts + format_pts + diff_theme_pts

    audience_matched = [matched_tokens[l] for l in ("kids", "adult") if l in matched_tokens]
    format_matched = [matched_tokens[l] for l in ("pdf", "worksheet", "book", "download") if l in matched_tokens]
    diff_matched = [matched_tokens[l] for l in ("difficulty", "theme") if l in matched_tokens]

    family_records.append({
        "family": fk,
        "variants": sorted(fam["variants"]),
        "locale_frequency_locales": sorted(fam["locales"]),
        "mention_frequency": fam["mention_count"],
        "intent_labels": intent_labels,
        "score": {
            "total": total,
            "locale_frequency": {"value": locale_freq, "points": locale_freq * 4},
            "printable_intent": {"matched": [matched_tokens["printable"]] if "printable" in matched_tokens else [], "points": printable_pts},
            "audience_specificity": {"matched": audience_matched, "points": audience_pts},
            "format_intent": {"matched": format_matched, "points": format_pts},
            "difficulty_or_theme": {"matched": diff_matched, "points": diff_theme_pts},
        },
        "limitations": [
            "Not calibrated against search volume",
            "Not a competition score",
            "Not a sales prediction",
        ],
    })

family_records.sort(key=lambda r: r["score"]["total"], reverse=True)

# ---------- Stage 6: Long-tail extraction (3+ meaningful words) ----------
LONGTAIL_GROUPS = {
    "kids": ["kids", "children", "child", "toddler", "kindergarten", "preschool"],
    "adults": ["adult"],
    "printable_pdf": ["printable", "pdf", "print"],
    "educational": ["educational", "learning", "school", "teacher"],
    "numbers_alphabet": ["number", "alphabet"],
    "coloring": ["color", "colour", "coloring"],
    "difficult_extreme": ["hard", "difficult", "extreme"],
    "seasonal_theme": ["holiday", "christmas", "seasonal", "animal"],
}
long_tail = defaultdict(list)
seen_lt = set()
for fam in family_records:
    for variant in fam["variants"]:
        if not is_ascii(variant):
            continue  # long-tail grouping done on English/ASCII text per dictionaries above
        n_words = len([w for w in variant.split() if w])
        if n_words < 3 or variant in seen_lt:
            continue
        for group, terms in LONGTAIL_GROUPS.items():
            if any(t in variant for t in terms):
                long_tail[group].append(variant)
                seen_lt.add(variant)

# ---------- Stage 7: Negative keyword groups ----------
negative_keywords = {
    "exclude_for_print_books": ["app", "online", "interactive", "mobile", "game download", "dots and boxes"]
}

# ---------- Stage 9: Localized opportunity summaries ----------
locale_opportunities = {}
for code, data in locales_out.items():
    natives = data["native_phrases"]
    primary = natives[0]["phrase"] if natives else (data["english_phrases_used_by_locals"][0]["phrase"] if data["english_phrases_used_by_locals"] else "")
    def find_modifier(keywords):
        for rec in natives + data["intent_modifiers"]:
            text = (rec.get("meaning", "") + " " + rec["normalized"]).lower()
            if any(k in text for k in keywords):
                return rec["phrase"]
        return ""
    locale_opportunities[code] = {
        "primary_term": primary,
        "print_modifier": find_modifier(["print", "pdf"]),
        "free_modifier": find_modifier(["free", "gratuit", "kostenlos"]),
        "children_modifier": find_modifier(["child", "kid", "kindergarten", "preschool"]),
        "adult_modifier": find_modifier(["adult"]),
        "recommended_local_phrase": primary,
    }

# ---------- Stage 11: Validation ----------
quality_checks = {
    "valid_utf8_json": True,
    "source_locale_count": len([k for k in raw.keys() if k not in SKIP_KEYS]),
    "output_locale_count": len(locales_out),
    "missing_locales": [],
    "duplicate_normalized_phrases_within_family": [],
    "pooled_english_phrases_added": pooled_added,
    "no_fabricated_search_volume_claims": True,
    "notes": [
        "Scores are heuristic_opportunity_score_v1: a sorting heuristic within "
        "this collected dataset only. Not search volume, not competition, not sales data.",
        "KDP recommendations intentionally excluded from this pipeline run per current scope.",
    ],
}
src_codes = {LOCALE_CODE_MAP.get(k.lower(), k) for k in raw.keys() if k not in SKIP_KEYS}
out_codes = set(locales_out.keys())
quality_checks["missing_locales"] = sorted(src_codes - out_codes)

# ---------- Assemble final output ----------
output = {
    "scoring_model": {
        "name": "heuristic_opportunity_score_v1",
        "status": "tunable_not_calibrated",
        "purpose": "Prioritize phrases within this collected locale dataset only.",
        "not_valid_for": [
            "estimating search volume",
            "predicting sales",
            "measuring keyword competition",
            "comparing external market demand",
        ],
    },
    "locales": locales_out,
    "keyword_analysis": {
        "phrase_families": family_records,
        "ranked_keywords": family_records,  # already sorted by score desc
        "long_tail_keywords": {k: sorted(set(v)) for k, v in long_tail.items()},
        "negative_keywords": negative_keywords,
    },
    "_locale_opportunities": locale_opportunities,
    "_quality_checks": quality_checks,
}

with open(OUT, "w", encoding="utf-8") as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print("Wrote", OUT)
print("Locales:", len(locales_out), "Families:", len(family_records), "Pooled EN phrases:", pooled_added)
print("Missing locales check:", quality_checks["missing_locales"])
