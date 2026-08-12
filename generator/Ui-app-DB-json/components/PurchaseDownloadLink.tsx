"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { getPurchaseDownloadLink } from "@/lib/firebase";

const POLL_INTERVAL_MS = 2000;
const MAX_ATTEMPTS = 15; // ~30s — covers webhook processing lag after redirect.

export default function PurchaseDownloadLink() {
  const locale = useLocale();
  const t = useTranslations("purchase");
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const isDemo = searchParams.get("demo") === "1";
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (isDemo) return;
    if (!sessionId) {
      setFailed(true);
      return;
    }
    let cancelled = false;
    let attempts = 0;

    const poll = async () => {
      try {
        const link = await getPurchaseDownloadLink(sessionId);
        if (cancelled) return;
        if (link) {
          setUrl(link);
          return;
        }
        attempts += 1;
        if (attempts >= MAX_ATTEMPTS) {
          setFailed(true);
          return;
        }
        setTimeout(poll, POLL_INTERVAL_MS);
      } catch (error) {
        if (process.env.NODE_ENV !== "production") console.error("Download link fetch failed", error);
        if (cancelled) return;
        attempts += 1;
        if (attempts >= MAX_ATTEMPTS) {
          setFailed(true);
          return;
        }
        setTimeout(poll, POLL_INTERVAL_MS);
      }
    };

    void poll();
    return () => {
      cancelled = true;
    };
  }, [isDemo, sessionId]);

  if (isDemo) {
    return (
      <div className="purchase-demo">
        <strong>{t("download.demoTitle")}</strong>
        <p>{t("download.demoText")}</p>
        <span className="button primary purchase-demo-download" aria-disabled="true">{t("download.button")}</span>
        <a className="purchase-demo-return" href={`/${locale}/premium/`}>{t("shared.returnToPack")}</a>
      </div>
    );
  }

  if (url) {
    return (
      <div style={{ marginTop: 24 }}>
        <a href={url} className="button primary" target="_blank" rel="noopener noreferrer">
          {t("download.button")}
        </a>
        <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 8 }}>
          {t("download.expires")}
        </p>
        <a href={`/${locale}/contact/`} className="button" style={{ marginTop: 12 }}>
          {t("shared.contactUs")}
        </a>
      </div>
    );
  }

  if (failed) {
    return (
      <div style={{ marginTop: 24 }}>
        <p style={{ color: "var(--error, #c00)" }}>
          {t("download.failed")}
        </p>
        <a href={`/${locale}/contact/`} className="button" style={{ marginTop: 12 }}>
          {t("shared.contactUs")}
        </a>
      </div>
    );
  }

  return (
    <p style={{ marginTop: 24, color: "var(--muted)" }}>{t("download.preparing")}</p>
  );
}
