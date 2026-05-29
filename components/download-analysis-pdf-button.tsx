"use client";

import { useState } from "react";
import {
  downloadAnalysisPdf,
  type AnalysisPdfData,
} from "@/lib/generate-analysis-pdf";

export function DownloadAnalysisPdfButton(props: AnalysisPdfData) {
  const [loading, setLoading] = useState(false);

  function handleDownload() {
    setLoading(true);
    try {
      downloadAnalysisPdf(props);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className="inline-flex h-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-zinc-200 transition hover:border-blue-500/40 hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
    >
      {loading ? "Generating…" : "Download PDF"}
    </button>
  );
}
