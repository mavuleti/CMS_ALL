import { Download, FileText } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { resolvePdfVariants, isAmbiguousPaperLocale } from "@/lib/paper-size";
import DownloadTracker from "./DownloadTracker";
import DownloadBadge from "./DownloadBadge";
import downloadCounts from "@/lib/download-counts.json";
import { displayedDistributionTotal, type DistributionCount } from "@/lib/distribution-counts";

interface DownloadButtonProps {
  pdfUrl: string;
  locale: string;
  label?: string;
  ariaLabel: string;
  puzzleId: string;
}

export default async function DownloadButton({
  pdfUrl,
  locale,
  label,
  ariaLabel,
  puzzleId,
}: DownloadButtonProps) {
  const t = await getTranslations("downloadButton");
  const { primary, alternate } = resolvePdfVariants(pdfUrl, locale);
  const showBothAsButtons = isAmbiguousPaperLocale(locale);

  const sizeLabel = (size: "letter" | "a4") =>
    size === "a4" ? t("paperA4") : t("paperLetter");
  const bakedCount = displayedDistributionTotal(
    (downloadCounts as { puzzles?: Record<string, DistributionCount> }).puzzles?.[puzzleId]
  );

  // en / es / fr genuinely mix Letter and A4 markets within one locale
  // code — show both sizes as equal, prominent buttons instead of
  // guessing a default and burying the other option in a small link.
  if (showBothAsButtons) {
    return (
      <DownloadTracker puzzleId={puzzleId} locale={locale}><div>
      <DownloadBadge puzzleId={puzzleId} bakedCount={bakedCount} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <a
            href={primary.url}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="button primary download-btn"
            aria-label={`${t("downloadSize", { size: sizeLabel(primary.size) })} – ${ariaLabel}`}
          >
            <Download size={20} aria-hidden="true" />
            {t("downloadSize", { size: sizeLabel(primary.size) })}
          </a>
          <a
            href={alternate.url}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="button primary download-btn"
            aria-label={`${t("downloadSize", { size: sizeLabel(alternate.size) })} – ${ariaLabel}`}
          >
            <Download size={20} aria-hidden="true" />
            {t("downloadSize", { size: sizeLabel(alternate.size) })}
          </a>
        </div>

        <p
          style={{
            fontSize: "0.7rem",
            color: "var(--muted)",
            marginTop: 8,
            lineHeight: 1.5,
          }}
        >
          {t("usage")}
        </p>
      </div></DownloadTracker>
    );
  }

  return (
    <DownloadTracker puzzleId={puzzleId} locale={locale}><div>
    <DownloadBadge puzzleId={puzzleId} bakedCount={bakedCount} />
      <a
        href={primary.url}
        target="_blank"
        rel="noopener noreferrer"
        download
        className="button primary download-btn"
        aria-label={ariaLabel}
      >
        <Download size={20} aria-hidden="true" />
        {label ?? t("label")}
      </a>

      <p
        style={{
          fontSize: "0.7rem",
          color: "var(--muted)",
          marginTop: 8,
          lineHeight: 1.5,
        }}
      >
        {t("usage")} {t("paperNote", { size: sizeLabel(primary.size) })}
      </p>

      <a
        href={alternate.url}
        target="_blank"
        rel="noopener noreferrer"
        download
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          fontSize: "0.75rem",
          fontWeight: 700,
          color: "var(--muted)",
          textDecoration: "underline",
          marginTop: 2,
        }}
      >
        <FileText size={13} aria-hidden="true" />
        {t("alternateLink", { size: sizeLabel(alternate.size) })}
      </a>
    </div></DownloadTracker>
  );
}
