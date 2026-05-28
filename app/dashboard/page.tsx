import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
import { LogoutButton } from "@/components/logout-button";
import { TruePenBackground } from "@/components/truepen-background";
import { TruePenLogo } from "@/components/truepen-logo";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#06080f] font-sans text-zinc-300">
      <TruePenBackground />
      <header className="relative z-10 border-b border-white/[0.06] bg-[#06080f]/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
          <TruePenLogo />
          <LogoutButton />
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
              value: "0",
              hint: "Free plan: 3 per month",
            },
            {
              label: "Last analysis",
              value: "—",
              hint: "Upload a draft to get started",
            },
            {
              label: "Plan",
              value: "Free",
              hint: "Upgrade anytime",
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

        <div className="mt-8 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-8 text-center">
          <h2 className="text-xl font-semibold text-white">Start your first analysis</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
            Paste or upload an essay to see AI-likeness, authenticity, and academic
            quality scores.
          </p>
          <button
            type="button"
            disabled
            className="mt-6 inline-flex h-11 cursor-not-allowed items-center justify-center rounded-xl bg-gradient-to-r from-blue-500/50 to-indigo-600/50 px-6 text-sm font-semibold text-white/70"
          >
            New analysis (coming soon)
          </button>
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
