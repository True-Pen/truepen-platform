"use client";

import { useMemo, useState } from "react";
import { DashboardAnalysisCard } from "@/components/dashboard-analysis-card";

export type DashboardAnalysisItem = {
  id: string;
  dateLabel: string;
  preview: string;
  searchText: string;
  aiScore: number;
  humanScore: number;
  academicScore: number;
};

const searchInputClass =
  "w-full rounded-xl border border-white/10 bg-[#0a0e18] px-4 py-2.5 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20";

export function DashboardAnalysesList({
  analyses,
  loadError,
}: {
  analyses: DashboardAnalysisItem[];
  loadError: boolean;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return analyses;
    return analyses.filter((a) => a.searchText.toLowerCase().includes(trimmed));
  }, [analyses, query]);

  if (loadError) {
    return (
      <div className="mt-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
        Couldn&apos;t load your saved analyses right now. Please refresh and try again.
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="mt-4 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-8 text-center">
        <p className="text-sm text-zinc-500">
          No saved analyses yet. Run your first one to see it here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-4">
        <label htmlFor="analysis-search" className="sr-only">
          Search analyses
        </label>
        <input
          id="analysis-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by text content…"
          className={searchInputClass}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-4 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-8 text-center">
          <p className="text-sm text-zinc-500">No analyses match your search.</p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {filtered.map((a) => (
            <DashboardAnalysisCard
              key={a.id}
              id={a.id}
              dateLabel={a.dateLabel}
              preview={a.preview}
              aiScore={a.aiScore}
              humanScore={a.humanScore}
              academicScore={a.academicScore}
            />
          ))}
        </div>
      )}
    </>
  );
}
