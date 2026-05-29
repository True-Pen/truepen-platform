"use client";

import { useState } from "react";
import { MetricBar } from "@/components/metric-bar";
import { createClient } from "@/lib/supabase/client";

const DEMO_METRICS = [
  {
    label: "AI-Likeness",
    score: 23,
    max: 100,
    accent: "from-sky-400 to-blue-500",
    description: "Low — your draft reads mostly human-written.",
  },
  {
    label: "Human Authenticity",
    score: 87,
    max: 100,
    accent: "from-blue-400 to-indigo-500",
    description: "High — voice and variation feel natural.",
  },
  {
    label: "Academic Quality",
    score: 72,
    max: 100,
    accent: "from-indigo-400 to-violet-500",
    description: "Good — structure and tone are on track.",
  },
];

const DEMO_FEEDBACK = [
  "Sentence rhythm is fairly consistent; vary length in key paragraphs for a more natural flow.",
  "Strong use of discipline-specific vocabulary in the introduction.",
  "Argument structure is clear, but the thesis could be stated more explicitly upfront.",
  "Consider adding more personal framing in the conclusion to strengthen authenticity.",
];

const inputClass =
  "w-full min-h-[280px] resize-y rounded-xl border border-white/10 bg-[#0a0e18] px-4 py-3 text-sm leading-relaxed text-white placeholder:text-zinc-500 outline-none transition focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20";

export function AnalyzeForm() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function handleAnalyze() {
    if (!text.trim()) return;
    setLoading(true);
    setShowResults(false);
    setSaveError(null);

    const aiScore = DEMO_METRICS[0]?.score ?? 0;
    const humanScore = DEMO_METRICS[1]?.score ?? 0;
    const academicScore = DEMO_METRICS[2]?.score ?? 0;
    const feedback = DEMO_FEEDBACK.join("\n");

    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const supabase = createClient();
      const { data, error: userError } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!data.user) throw new Error("You’re not signed in. Please sign in and try again.");

      const { error: insertError } = await supabase.from("analyses").insert({
        user_id: data.user.id,
        text,
        ai_score: aiScore,
        human_score: humanScore,
        academic_score: academicScore,
        feedback,
      });

      if (insertError) throw insertError;
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Saving failed. Please try again.";
      setSaveError(message);
    }

    setLoading(false);
    setShowResults(true);
  }

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <label htmlFor="draft" className="mb-2 block text-sm font-medium text-zinc-300">
          Your draft
        </label>
        <textarea
          id="draft"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your essay, report, or assignment here…"
          className={inputClass}
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-zinc-500">
            {wordCount > 0 ? `${wordCount} words` : "Minimum ~50 words recommended"}
          </p>
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:from-blue-400 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Analyzing…" : "Analyze"}
          </button>
        </div>
        <p className="mt-3 text-xs text-zinc-600">
          Demo mode — scores are sample results, not powered by AI yet.
        </p>
      </div>

      <div>
        <h2 className="mb-4 text-sm font-medium text-white">Results</h2>
        {!showResults && !loading && (
          <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] p-8 text-center">
            <p className="text-sm text-zinc-500">
              Paste your text and click Analyze to see scores and feedback.
            </p>
          </div>
        )}
        {loading && (
          <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500/30 border-t-blue-400" />
            <p className="text-sm text-zinc-400">Running demo analysis…</p>
          </div>
        )}
        {showResults && !loading && (
          <div className="space-y-4">
            {saveError && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {saveError}
              </div>
            )}
            <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-white">Analysis complete</span>
                <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400">
                  Demo
                </span>
              </div>
              <div className="space-y-4">
                {DEMO_METRICS.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-xl border border-white/[0.06] bg-[#0a0e18]/80 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-zinc-400">{metric.label}</span>
                      <span className="text-sm font-semibold text-white">
                        {metric.score}
                        <span className="font-normal text-zinc-500">/{metric.max}</span>
                      </span>
                    </div>
                    <MetricBar
                      score={metric.score}
                      max={metric.max}
                      accent={metric.accent}
                    />
                    <p className="mt-2 text-xs text-zinc-500">{metric.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
              <h3 className="text-sm font-medium text-white">Feedback</h3>
              <ul className="mt-3 space-y-2">
                {DEMO_FEEDBACK.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm leading-relaxed text-zinc-400"
                  >
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
