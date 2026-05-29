import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";
import { TruePenBackground } from "@/components/truepen-background";
import { TruePenLogo } from "@/components/truepen-logo";
import {
  FREE_MONTHLY_ANALYSIS_LIMIT,
  getCurrentMonthStartIso,
} from "@/lib/analysis-limits";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function formatMemberSince(input: string | undefined) {
  if (!input) return "—";
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { count: monthCount } = await supabase
    .from("analyses")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", getCurrentMonthStartIso());

  const analysesUsed = monthCount ?? 0;
  const usagePct = Math.min(
    100,
    (analysesUsed / FREE_MONTHLY_ANALYSIS_LIMIT) * 100,
  );

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
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-400">Account</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            Settings
          </h1>
          <p className="mt-2 text-zinc-400">Manage your TruePen account and plan.</p>
        </div>

        <div className="mx-auto max-w-2xl space-y-6">
          <section className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
            <h2 className="text-sm font-medium text-white">Profile</h2>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-xs text-zinc-500">Email</dt>
                <dd className="mt-1 text-sm font-medium text-zinc-200">
                  {user.email ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-500">Member since</dt>
                <dd className="mt-1 text-sm font-medium text-zinc-200">
                  {formatMemberSince(user.created_at)}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-medium text-white">Plan</h2>
              <span className="rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
                Free
              </span>
            </div>
            <p className="mt-3 text-sm text-zinc-400">
              You&apos;re on the Free plan with {FREE_MONTHLY_ANALYSIS_LIMIT} analyses
              per month.
            </p>
            <div className="mt-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Analyses this month</span>
                <span className="font-medium text-white">
                  {analysesUsed} / {FREE_MONTHLY_ANALYSIS_LIMIT}
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all"
                  style={{ width: `${usagePct}%` }}
                />
              </div>
            </div>
            <Link
              href="/pricing"
              className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-400 hover:to-indigo-500"
            >
              View Pro plans
            </Link>
          </section>

          <section className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/dashboard"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.08] sm:flex-none"
            >
              Back to dashboard
            </Link>
            <Link
              href="/pricing"
              className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-6 text-sm font-semibold text-white transition hover:bg-white/[0.08] sm:flex-none"
            >
              Pricing
            </Link>
            <div className="sm:flex-none">
              <LogoutButton />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
