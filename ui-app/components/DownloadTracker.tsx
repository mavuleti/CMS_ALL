"use client";

import type { MouseEvent, ReactNode } from "react";
import { recordPuzzleDownload } from "@/lib/firebase";

export default function DownloadTracker({ puzzleId, locale, children }: { puzzleId: string; locale?: string; children: ReactNode }) {
  const onClick = (_event: MouseEvent<HTMLDivElement>) => {
    void recordPuzzleDownload(puzzleId, locale)
      .then(() => window.dispatchEvent(new CustomEvent("puzzle-download-recorded", { detail: { puzzleId } })))
      .catch((error) => {
        if (process.env.NODE_ENV !== "production") console.error("Download tracking failed", error);
      });
  };
  return <div onClick={onClick}>{children}</div>;
}
