"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { PUZZLE_BADGE_MIN_COUNT } from "@/lib/social-proof-config";
import { displayedDistributionTotal } from "@/lib/distribution-counts";

export default function DownloadBadge({ puzzleId, bakedCount }: { puzzleId: string; bakedCount: number }) {
  const t = useTranslations("downloadBadge");
  const locale = useLocale();
  const [count, setCount] = useState(bakedCount);
  useEffect(() => {
    const key = `download-count:${puzzleId}`;
    try {
      // localStorage (not sessionStorage) so a locally-recorded increment is
      // visible in a newly opened tab instead of appearing to "reset" to the
      // SSR-baked floor.
      const cached = JSON.parse(localStorage.getItem(key) ?? "null");
      if (cached && cached.expiresAt > Date.now()) setCount(Math.max(bakedCount, cached.count));
      const freshen = async () => {
        const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
        if (!projectId) return;
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return;
        const useEmulator = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === "true";
        const firestoreBase = useEmulator
          ? `http://127.0.0.1:8080/v1/projects/${projectId}/databases/(default)/documents`
          : `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
        let response: Response;
        try {
          response = await fetch(`${firestoreBase}/puzzleDistributionCounts/${puzzleId}`);
        } catch {
          return;
        }
        if (!response.ok) return;
        const document = await response.json();
        const freshCount = displayedDistributionTotal({
          offlineDistributionCount: document.fields?.offlineDistributionCount?.integerValue,
          onlineDistributionCount: document.fields?.onlineDistributionCount?.integerValue
        });
        setCount((current) => Math.max(current, freshCount));
        localStorage.setItem(key, JSON.stringify({ count: freshCount, expiresAt: Date.now() + 3600000 }));
      };
      const onRecorded = (event: Event) => {
        if ((event as CustomEvent<{ puzzleId?: string }>).detail?.puzzleId !== puzzleId) return;
        setCount((current) => {
          const next = current + 1;
          localStorage.setItem(key, JSON.stringify({ count: next, expiresAt: Date.now() + 3600000 }));
          return next;
        });
      };
      window.addEventListener("puzzle-download-recorded", onRecorded);
      let cleanup = () => window.removeEventListener("puzzle-download-recorded", onRecorded);
      if (typeof window.requestIdleCallback === 'function') {
        const idle = window.requestIdleCallback(freshen);
        cleanup = () => { window.cancelIdleCallback(idle); window.removeEventListener("puzzle-download-recorded", onRecorded); };
      } else {
        const timeout = window.setTimeout(freshen, 1000);
        cleanup = () => { window.clearTimeout(timeout); window.removeEventListener("puzzle-download-recorded", onRecorded); };
      }
      return cleanup;
    } catch { /* storage may be unavailable */ }
  }, [bakedCount, puzzleId]);
  if (count < PUZZLE_BADGE_MIN_COUNT) return null;
  return <div className="download-count-badge" aria-label={`${t("downloaded")} ${count}+ ${t("times")}`}>
    <span aria-hidden="true" className="download-count-badge__ripple" />
    <span aria-hidden="true" className="download-count-badge__medal"><span>★</span></span>
    <span className="download-count-badge__copy">
      <strong>{t("downloaded")}</strong>
      <span className="download-count-badge__number">{count.toLocaleString(locale)}+</span>
      <span className="download-count-badge__times">{t("times")}</span>
      <small>{t("greatChoice")}</small>
    </span>
    <span aria-hidden="true" className="download-count-badge__sparkle download-count-badge__sparkle--left">✦</span>
    <span aria-hidden="true" className="download-count-badge__sparkle download-count-badge__sparkle--right">✦</span>
  </div>;
}
