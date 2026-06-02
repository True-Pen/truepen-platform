"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DownloadAnalysisPdfButton } from "@/components/download-analysis-pdf-button";
import { MetricBar } from "@/components/metric-bar";
import { FREE_LIMIT_MESSAGE } from "@/lib/analysis-limits";
import {
  isAtFreeMonthlyLimit,
  recordAnalysisUsage,
} from "@/lib/analysis-usage";
import { createClient } from "@/lib/supabase/client";
import { extractTextFromFile } from "@/lib/extract-document-text";

const MAX_WORDS = 3000;

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
  const dragCounterRef = useRef(0);

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

  const [resultMetrics, setResultMetrics] = useState(DEMO_METRICS);
  const [resultFeedback, setResultFeedback] = useState(DEMO_FEEDBACK);
  const [isAiPowered, setIsAiPowered] = useState(false);
  const [isPro, setIsPro] = useState(false);

  const busy = loading || uploading;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const isOverWordLimit = wordCount > MAX_WORDS;

  useEffect(() => {
    async function loadPlan() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .single();

      setIsPro(profile?.plan === "pro");
    }

    void loadPlan();
  }, []);

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
        err instanceof Error
          ? err.message
          : "Could not read this file. Please try again.";
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
    if (!text.trim() || isOverWordLimit) return;

    setLoading(true);
    setShowResults(false);
    setSaveError(null);
    setLimitMessage(null);
    setResultMetrics(DEMO_METRICS);
    setResultFeedback(DEMO_FEEDBACK);
    setIsAiPowered(false);

    try {
      const supabase = createClient();
      const { data, error: userError } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!data.user) {
        throw new Error("You’re not signed in. Please sign in and try again.");
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", data.user.id)
        .single();

      const currentIsPro = profile?.plan === "pro";
      setIsPro(currentIsPro);

      if (!currentIsPro && (await isAtFreeMonthlyLimit(supabase, data.user))) {
        setLimitMessage(FREE_LIMIT_MESSAGE);
        setShowResults(true);
        return;
      }

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error || "AI analysis failed. Please try again.",
        );
      }

      const aiResult = await response.json();

      const aiScore = Math.max(
        0,
        Math.min(100, Number(aiResult.aiLikeness ?? 0)),
      );
      const humanScore = Math.max(
        0,
        Math.min(100, Number(aiResult.humanAuthenticity ?? 0)),
      );
      const academicScore = Math.max(
        0,
        Math.min(100, Number(aiResult.academicQuality ?? 0)),
      );

      const feedbackItems = Array.isArray(aiResult.feedback)
        ? aiResult.feedback.map(String)
        : DEMO_FEEDBACK;

      const nextMetrics = [
        {
          ...DEMO_METRICS[0],
          score: aiScore,
          description:
            aiScore > 70
              ? "High — this draft may contain AI-like patterns."
              : aiScore > 40
                ? "Medium — some parts may read AI-assisted."
                : "Low — this draft reads mostly human-written.",
        },
        {
          ...DEMO_METRICS[1],
          score: humanScore,
          description:
            humanScore > 70
              ? "High — voice and variation feel natural."
              : humanScore > 40
                ? "Medium — some parts could feel more personal."
                : "Low — the writing may need more natural variation.",
        },
        {
          ...DEMO_METRICS[2],
          score: academicScore,
          description:
            academicScore > 70
              ? "Good — structure and tone are on track."
              : academicScore > 40
                ? "Fair — academic structure could be stronger."
                : "Needs work — improve clarity, structure, and argumentation.",
        },
      ];

      setResultMetrics(nextMetrics);
      setResultFeedback(feedbackItems);
      setIsAiPowered(true);

      const { error: insertError } = await supabase.from("analyses").insert({
        user_id: data.user.id,
        text,
        ai_score: aiScore,
        human_score: humanScore,
        academic_score: academicScore,
        feedback: feedbackItems.join("\n"),
      });

      if (insertError) throw insertError;

      await recordAnalysisUsage(supabase, data.user.id);
      setShowResults(true);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Analysis failed. Please try again.";
      setSaveError(message);
      setShowResults(true);
    } finally {
      setLoading(false);
    }
  }

  const aiScore = resultMetrics[0]?.score ?? 0;
  const humanScore = resultMetrics[1]?.score ?? 0;
  const academicScore = resultMetrics[2]?.score ?? 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="text-sm font-medium text-white">Your draft</label>
        </div>

        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`mb-4 rounded-xl border border-dashed p-4 transition ${
            isDragOver
              ? "border-blue-500/70 bg-blue-500/10"
              : "border-white/10 bg-white/[0.03]"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES}
            className="hidden"
            onChange={handleFileSelect}
          />

          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">
                Upload document
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Drag & drop or choose a .docx / .pdf file
              </p>

              {selectedFileName && (
                <p className="mt-3 text-xs text-zinc-400">
                  Selected file:{" "}
                  <span className="text-zinc-200">{selectedFileName}</span>
                </p>
              )}

              {uploading && (
                <p className="mt-2 text-xs text-blue-300">
                  Reading document…
                </p>
              )}

              {uploadedFileName && !uploading && (
                <p className="mt-2 text-xs text-emerald-400">
                  Text loaded successfully — ready to analyze
                </p>
              )}

              {uploadError && (
                <p className="mt-2 text-xs text-red-300">{uploadError}</p>
              )}
            </div>

            <button
              type="button"
              disabled={busy}
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.1] disabled:opacity-50"
            >
              Choose file
            </button>
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setShowResults(false);
            setSaveError(null);
            setLimitMessage(null);
          }}
          placeholder="Paste your academic text here..."
          className={inputClass}
        />

        <div className="mt-4 flex items-center justify-between gap-4">
          <div>
            <p
              className={`text-sm ${
                isOverWordLimit ? "text-red-300" : "text-zinc-500"
              }`}
            >
              {wordCount} / {MAX_WORDS} words
            </p>

            {isOverWordLimit && (
              <p className="mt-1 text-xs text-red-300">
                Your text is too long. Please shorten it before analyzing.
              </p>
            )}

            {!isAiPowered && !saveError && !limitMessage && (
              <p className="mt-3 text-xs text-zinc-600">
                AI-powered analysis is enabled.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!text.trim() || busy || isOverWordLimit}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-400 hover:to-indigo-500 disabled:opacity-50"
          >
            {loading ? "Analyzing…" : "Analyze"}
          </button>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-medium text-white">Results</h2>

        {limitMessage && (
          <div className="mb-4 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-5 text-sm text-blue-100">
            <p>{limitMessage}</p>
            <Link
              href="/pricing"
              className="mt-4 inline-flex h-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-4 text-sm font-semibold text-white"
            >
              Upgrade to Pro
            </Link>
          </div>
        )}

        {saveError && (
          <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-sm text-red-200">
            {saveError}
          </div>
        )}

        {showResults && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-white">
                  Analysis complete
                </span>
                <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400">
                  {isAiPowered ? "AI" : "Demo"}
                </span>
              </div>

              <div className="space-y-4">
                {resultMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-xl border border-white/[0.06] bg-[#0a0e18]/80 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm text-zinc-400">
                        {metric.label}
                      </span>
                      <span className="text-sm font-semibold text-white">
                        {metric.score}
                        <span className="font-normal text-zinc-500">
                          /{metric.max}
                        </span>
                      </span>
                    </div>

                    <MetricBar
                      score={metric.score}
                      max={metric.max}
                      accent={metric.accent}
                    />

                    <p className="mt-2 text-xs text-zinc-500">
                      {metric.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-medium text-white">Feedback</h3>

                {isPro && (
                  <DownloadAnalysisPdfButton
                    dateLabel={new Date().toLocaleDateString()}
                    text={text}
                    aiScore={aiScore}
                    humanScore={humanScore}
                    academicScore={academicScore}
                    feedbackItems={resultFeedback}
                  />
                )}
              </div>

              {!isPro && (
                <div className="mt-3 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-200">
                  PDF export is available on the Pro plan.
                </div>
              )}

              <ul className="mt-3 space-y-2">
                {resultFeedback.map((item) => (
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