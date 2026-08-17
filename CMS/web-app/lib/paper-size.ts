/**
 * Paper size logic for puzzle PDF downloads.
 *
 * Context: every puzzle PDF in /public is authored on US Letter
 * (8.5" x 11") and has a matching "<name>_A4.pdf" sibling generated via
 * PDF_TO_A4/script/pdf_to_a4.py (vector-transform, no rasterization —
 * see CUSTOMER-RETENTION-2026-PLAN.md §3a for the full locale mapping).
 *
 * Most of the 19 live locales map to a single dominant paper size, but a
 * few (en, es, fr) genuinely split between Letter and A4 markets within
 * the same locale code (no country-level routing exists yet), so the
 * default below is a best-effort majority pick — the UI always also
 * offers the alternate size link so nobody is stuck with the wrong one.
 */

export type PaperSize = "letter" | "a4";

// Locales whose PRIMARY/majority market prints A4.
// (de, it, nl, pt, pt-BR, sv, no, pl, da, fi, cs, hu, ro, tr, el, ar — all
// single-market A4 per the retention-plan table.)
const A4_DEFAULT_LOCALES = new Set<string>([
  "de",
  "it",
  "nl",
  "pt",
  "pt-BR",
  "sv",
  "no",
  "pl",
  "da",
  "fi",
  "cs",
  "hu",
  "ro",
  "tr",
  "el",
  "ar",
  "lv",
  "sl",
]);

// en, es, fr default to Letter (current behavior / majority reach: US for
// en, Mexico + Latin America for es, Québec being the smaller-but-existing
// Letter market for fr) — kept as Letter defaults, with an A4 link always
// shown alongside.

// Locales that genuinely split between Letter and A4 markets within the
// same locale code (en: US/CA vs UK/AU/IN/IE/NZ/ZA; es: MX/Latam vs
// Spain/Argentina; fr: Québec vs France/Belgium/Switzerland). For these,
// the UI shows two equal-weight buttons instead of one primary + a small
// alternate link, since neither paper size is a safe default guess.
const AMBIGUOUS_LOCALES = new Set<string>(["en", "es", "fr"]);

/** Returns the paper size that should be served by default for a locale. */
export function getDefaultPaperSize(locale: string): PaperSize {
  return A4_DEFAULT_LOCALES.has(locale) ? "a4" : "letter";
}

/** True when the locale mixes Letter and A4 markets and both sizes should be shown as equal, prominent buttons. */
export function isAmbiguousPaperLocale(locale: string): boolean {
  return AMBIGUOUS_LOCALES.has(locale);
}

/** Given a Letter pdf path like "/dinosaurs/trex.pdf", returns the A4 sibling path "/dinosaurs/trex_A4.pdf". */
export function toA4PdfUrl(pdfUrl: string): string {
  if (pdfUrl.endsWith("_A4.pdf")) return pdfUrl;
  return pdfUrl.replace(/\.pdf$/i, "_A4.pdf");
}

/** Given either a Letter or A4 pdf path, returns the plain Letter path. */
export function toLetterPdfUrl(pdfUrl: string): string {
  return pdfUrl.replace(/_A4\.pdf$/i, ".pdf");
}

/**
 * Resolves the primary download URL + label, and the alternate
 * (opposite paper size) URL + label, for a given locale and base
 * (Letter) pdf path.
 */
export function resolvePdfVariants(pdfUrl: string, locale: string) {
  const defaultSize = getDefaultPaperSize(locale);
  const letterUrl = toLetterPdfUrl(pdfUrl);
  const a4Url = toA4PdfUrl(pdfUrl);

  const primary = defaultSize === "a4"
    ? { url: a4Url, size: "a4" as PaperSize }
    : { url: letterUrl, size: "letter" as PaperSize };

  const alternate = defaultSize === "a4"
    ? { url: letterUrl, size: "letter" as PaperSize }
    : { url: a4Url, size: "a4" as PaperSize };

  return { primary, alternate };
}
