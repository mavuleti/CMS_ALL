"use client";

import type { MouseEvent, ReactNode } from "react";
import { recordPuzzleDownload } from "@/lib/firebase";

export default function DownloadTracker({ puzzleId, locale, children }: { puzzleId: string; locale?: string; children: ReactNode }) {
  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (!target.closest("a[download]")) return;
    void recordPuzzleDownload(puzzleId, locale)
      .then(() => window.dispatchEvent(new CustomEvent("puzzle-download-recorded", { detail: { puzzleId } })))
      .catch((error) => {
        if (process.env.NODE_ENV !== "production") console.error("Download tracking failed", error);
      });
  };
  return <div onClick={onClick}>{children}</div>;
}
