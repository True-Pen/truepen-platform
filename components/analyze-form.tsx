"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { MetricBar } from "@/components/metric-bar";
import { FREE_LIMIT_MESSAGE } from "@/lib/analysis-limits";
import {
  isAtFreeMonthlyLimit,
  recordAnalysisUsage,
} from "@/lib/analysis-usage";
import { createClient } from "@/lib/supabase/client";
import { extractTextFromFile } from "@/lib/extract-document-text";

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

const ACCEPTED_TYPES =
  ".docx,.pdf,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const inputClass =
  "w-full min-h-[280px] resize-y rounded-xl border border-white/10 bg-[#0a0e18] px-4 py-3 text-sm leading-relaxed text-white placeholder:text-zinc-500 outline-none transition focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20";

export function AnalyzeForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [limitMessage, setLimitMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounterRef = useRef(0);

  async function processFile(file: File) {
    setSelectedFileName(file.name);
    setUploading(true);
    setUploadError(null);
    setUploadedFileName(null);
    setShowResults(false);
    setSaveError(null);
    setLimitMessage(null);

    try {
      const extracted = await extractTextFromFile(file);
      setText(extracted);
      setUploadedFileName(file.name);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not read this file. Please try again.";
      setUploadError(message);
    } finally {
      setUploading(false);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || busy) return;
    void processFile(file);
  }

  function handleDragEnter(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    dragCounterRef.current += 1;
    setIsDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current <= 0) {
      dragCounterRef.current = 0;
      setIsDragOver(false);
    }
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    setIsDragOver(false);
    if (busy) return;

    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    void processFile(file);
  }

  async function handleAnalyze() {
    if (!text.trim()) return;
    setLoading(true);
    setShowResults(false);
    setSaveError(null);
    setLimitMessage(null);

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

      if (await isAtFreeMonthlyLimit(supabase, data.user)) {
        setLimitMessage(FREE_LIMIT_MESSAGE);
      } else {
        const { error: insertError } = await supabase.from("analyses").insert({
          user_id: data.user.id,
          text,
          ai_score: aiScore,
          human_score: humanScore,
          academic_score: academicScore,
          feedback,
        });

        if (insertError) throw insertError;

        await recordAnalysisUsage(supabase, data.user.id);
      }
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Saving failed. Please try again.";
      setSaveError(message);
    }

    setLoading(false);
    setShowResults(true);
  }

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const busy = loading || uploading;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <label htmlFor="draft" className="mb-2 block text-sm font-medium text-zinc-300">
          Your draft
        </label>

        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`mb-4 rounded-xl border border-dashed p-4 transition ${
            isDragOver
              ? "border-blue-500/60 bg-blue-500/10 ring-2 ring-blue-500/25"
              : "border-white/10 bg-white/[0.02]"
          } ${busy ? "opacity-60" : ""}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES}
            className="hidden"
            onChange={handleFileSelect}
            disabled={busy}
          />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-white">Upload document</p>
              <p className="mt-0.5 text-xs text-zinc-500">
                Drag & drop or choose a .docx / .pdf file
              </p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={busy}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-zinc-200 transition hover:border-blue-500/40 hover:bg-white/[0.08] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? "Extracting…" : "Choose file"}
            </button>
          </div>

          {isDragOver && !busy && (
            <p className="mt-3 text-center text-sm font-medium text-blue-300">
              Drop your file here
            </p>
          )}

          {(selectedFileName || uploadedFileName) && (
            <p className="mt-3 text-sm text-zinc-400">
              Selected file:{" "}
              <span className="font-medium text-zinc-200">
                {uploadedFileName ?? selectedFileName}
              </span>
            </p>
          )}

          {uploading && (
            <div className="mt-3 flex items-center gap-2 text-sm text-blue-300">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500/30 border-t-blue-400" />
              Extracting text from your document…
            </div>
          )}

          {!uploading && uploadedFileName && !uploadError && (
            <p className="mt-2 text-sm text-emerald-400">
              Text loaded successfully — ready to analyze
            </p>
          )}

          {uploadError && (
            <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {uploadError}
            </div>
          )}
        </div>

        <textarea
          id="draft"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (uploadError) setUploadError(null);
          }}
          placeholder="Paste your essay, report, or assignment here…"
          className={inputClass}
          disabled={uploading}
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-zinc-500">
            {wordCount > 0 ? `${wordCount} words` : "Minimum ~50 words recommended"}
          </p>
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={busy || !text.trim()}
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
              Paste or upload your text, then click Analyze to see scores and feedback.
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
            {limitMessage && (
              <div className="rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-4 py-4">
                <p className="text-sm leading-relaxed text-blue-100">{limitMessage}</p>
                <Link
                  href="/pricing"
                  className="mt-3 inline-flex h-9 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-400 hover:to-indigo-500"
                >
                  View Pro plans
                </Link>
              </div>
            )}
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
