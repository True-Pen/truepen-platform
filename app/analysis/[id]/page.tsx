import Link from "next/link";
import { redirect } from "next/navigation";
import { DownloadAnalysisPdfButton } from "@/components/download-analysis-pdf-button";
import { LogoutButton } from "@/components/logout-button";
import { MetricBar } from "@/components/metric-bar";
import { TruePenBackground } from "@/components/truepen-background";
import { TruePenLogo } from "@/components/truepen-logo";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function formatDateTime(input: string) {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function parseFeedback(feedback: string) {
  return feedback
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

const SCORE_METRICS = [
  {
    key: "ai_score" as const,
    label: "AI-Likeness",
    accent: "from-sky-400 to-blue-500",
  },
  {
    key: "human_score" as const,
    label: "Human Authenticity",
    accent: "from-blue-400 to-indigo-500",
  },
  {
    key: "academic_score" as const,
    label: "Academic Quality",
    accent: "from-indigo-400 to-violet-500",
  },
];

function AnalysisShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#06080f] font-sans text-zinc-300">
      <TruePenBackground />
      <header className="relative z-10 border-b border-white/[0.06] bg-[#06080f]/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
          <TruePenLogo />
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 transition hover:text-white sm:inline-block"
            >
              Dashboard
            </Link>
            <LogoutButton />
          </div>
        </nav>
      </header>
      <main className="relative z-10 mx-auto max-w-6xl px-6 py-12 lg:px-8">
        {children}
      </main>
    </div>
  );
}

function AnalysisNotFound() {
  return (
    <AnalysisShell>
      <div className="mx-auto max-w-lg rounded-2xl border border-white/[0.08] bg-white/[0.03] p-10 text-center">
        <p className="text-sm font-medium text-blue-400">Analysis</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">
          Analysis not found
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-400">
          This analysis doesn&apos;t exist, or you don&apos;t have permission to view it.
          It may have been removed or the link is incorrect.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:from-blue-400 hover:to-indigo-500"
          >
            Back to dashboard
          </Link>
          <Link
            href="/analyze"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
          >
            New analysis
          </Link>
        </div>
      </div>
    </AnalysisShell>
  );
}

export default async function AnalysisDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: analysis, error } = await supabase
    .from("analyses")
    .select(
      "id, created_at, text, ai_score, human_score, academic_score, feedback",
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !analysis) {
    return <AnalysisNotFound />;
  }

  const feedbackItems = parseFeedback(analysis.feedback ?? "");

  return (
    <AnalysisShell>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-blue-400">Analysis details</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            Saved analysis
          </h1>
          <p className="mt-2 text-zinc-400">
            Created {formatDateTime(analysis.created_at)}
          </p>
        </div>
        <DownloadAnalysisPdfButton
          dateLabel={formatDateTime(analysis.created_at)}
          text={analysis.text}
          aiScore={analysis.ai_score}
          humanScore={analysis.human_score}
          academicScore={analysis.academic_score}
          feedbackItems={feedbackItems}
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6">
          <h2 className="text-sm font-medium text-white">Scores</h2>
          <div className="mt-4 space-y-4">
            {SCORE_METRICS.map((metric) => (
              <div
                key={metric.key}
                className="rounded-xl border border-white/[0.06] bg-[#0a0e18]/80 p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-zinc-400">{metric.label}</span>
                  <span className="text-sm font-semibold text-white">
                    {analysis[metric.key]}
                    <span className="font-normal text-zinc-500">/100</span>
                  </span>
                </div>
                <MetricBar
                  score={analysis[metric.key]}
                  max={100}
                  accent={metric.accent}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
          <h2 className="text-sm font-medium text-white">Feedback</h2>
          {feedbackItems.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {feedbackItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-sm leading-relaxed text-zinc-400"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-zinc-500">No feedback recorded.</p>
          )}
        </section>
      </div>

      <section className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
        <h2 className="text-sm font-medium text-white">Full text</h2>
        <div className="mt-4 max-h-[480px] overflow-y-auto rounded-xl border border-white/[0.06] bg-[#0a0e18] p-4">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
            {analysis.text}
          </p>
        </div>
      </section>

      <p className="mt-8 text-center text-sm text-zinc-500">
        <Link href="/dashboard" className="text-blue-400 hover:text-blue-300">
          ← Back to dashboard
        </Link>
      </p>
    </AnalysisShell>
  );
}
