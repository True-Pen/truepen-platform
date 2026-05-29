import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import { TruePenBackground } from "@/components/truepen-background";
import { TruePenLogo } from "@/components/truepen-logo";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function formatShortDate(input: string) {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function previewText(input: string, max = 160) {
  const cleaned = input.replace(/\s+/g, " ").trim();
  if (cleaned.length <= max) return cleaned;
  return `${cleaned.slice(0, max - 1)}…`;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const monthStartIso = monthStart.toISOString();

  const [{ data: recentAnalyses, error: recentError }, { count: monthCount }] =
    await Promise.all([
      supabase
        .from("analyses")
        .select("id, created_at, text, ai_score, human_score, academic_score")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(8),
      supabase
        .from("analyses")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("created_at", monthStartIso),
    ]);

  if (recentError) {
    // If reads fail, keep the dashboard usable (logout + analyze) and show a small warning.
    // We intentionally avoid throwing to prevent a hard error screen.
  }

  const latest = recentAnalyses?.[0];
  const analysesThisMonth = monthCount ?? 0;
  const latestDate = latest?.created_at ? formatShortDate(latest.created_at) : "—";

  return (
    <div className="min-h-screen bg-[#06080f] font-sans text-zinc-300">
      <TruePenBackground />
      <header className="relative z-10 border-b border-white/[0.06] bg-[#06080f]/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
          <TruePenLogo />
          <div className="flex items-center gap-3">
            <Link
              href="/pricing"
              className="hidden rounded-lg px-4 py-2 text-sm font-medium text-zinc-400 transition hover:text-white sm:inline-block"
            >
              Pricing
            </Link>
            <LogoutButton />
          </div>
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-400">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            Welcome back
          </h1>
          <p className="mt-2 text-zinc-400">
            Signed in as{" "}
            <span className="font-medium text-zinc-200">{user.email}</span>
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              label: "Analyses this month",
              value: String(analysesThisMonth),
              hint: "Saved to your account",
            },
            {
              label: "Last analysis",
              value: latestDate,
              hint: latest ? "Your most recent saved run" : "Run your first analysis",
            },
            {
              label: "Plan",
              value: "Free",
              hint: (
                <Link href="/pricing" className="text-blue-400 hover:text-blue-300">
                  View Pro plans →
                </Link>
              ),
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6"
            >
              <p className="text-sm text-zinc-500">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
              <p className="mt-1 text-xs text-zinc-500">{stat.hint}</p>
            </div>
          ))}
        </div>

        <section className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-medium text-white">Recent analyses</h2>
            <Link
              href="/analyze"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-400 hover:to-indigo-500"
            >
              New analysis
            </Link>
          </div>

          {recentError && (
            <div className="mt-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
              Couldn&apos;t load your saved analyses right now. Please refresh and try again.
            </div>
          )}

          {!recentError && (!recentAnalyses || recentAnalyses.length === 0) && (
            <div className="mt-4 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-8 text-center">
              <p className="text-sm text-zinc-500">
                No saved analyses yet. Run your first one to see it here.
              </p>
            </div>
          )}

          {!recentError && recentAnalyses && recentAnalyses.length > 0 && (
            <div className="mt-4 space-y-3">
              {recentAnalyses.map((a) => (
                <Link
                  key={a.id}
                  href={`/analysis/${a.id}`}
                  className="block rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-5 transition hover:border-blue-500/30 hover:bg-white/[0.06]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-medium text-white">
                      {formatShortDate(a.created_at)}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-zinc-300">
                        AI {a.ai_score}/100
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-zinc-300">
                        Human {a.human_score}/100
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-zinc-300">
                        Academic {a.academic_score}/100
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                    {previewText(a.text)}
                  </p>
                  <p className="mt-3 text-xs font-medium text-blue-400">
                    View details →
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <div className="mt-8 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-8 text-center">
          <h2 className="text-xl font-semibold text-white">Start your first analysis</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
            Paste or upload an essay to see AI-likeness, authenticity, and academic
            quality scores.
          </p>
          <Link
            href="/analyze"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:from-blue-400 hover:to-indigo-500"
          >
            New analysis
          </Link>
        </div>

        <p className="mt-8 text-center text-sm text-zinc-500">
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            ← Back to home
          </Link>
        </p>
      </main>
    </div>
  );
}
