import Link from "next/link";
import { redirect } from "next/navigation";
import { AnalyzeForm } from "@/components/analyze-form";
import { LogoutButton } from "@/components/logout-button";
import { TruePenBackground } from "@/components/truepen-background";
import { TruePenLogo } from "@/components/truepen-logo";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AnalyzePage() {
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
          <p className="text-sm font-medium text-blue-400">Analyze</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            Analyze your writing
          </h1>
          <p className="mt-2 max-w-2xl text-zinc-400">
            Paste academic text below to preview AI-likeness, human authenticity, and
            academic quality scores.
          </p>
        </div>

        <AnalyzeForm />

        <p className="mt-8 text-center text-sm text-zinc-500">
          <Link href="/dashboard" className="text-blue-400 hover:text-blue-300">
            ← Back to dashboard
          </Link>
        </p>
      </main>
    </div>
  );
}
