import Link from "next/link";

const analysisMetrics = [
  { label: "AI-Likeness", score: 23, max: 100, accent: "from-sky-400 to-blue-500" },
  { label: "Human Authenticity", score: 87, max: 100, accent: "from-blue-400 to-indigo-500" },
  { label: "Academic Quality", score: 72, max: 100, accent: "from-indigo-400 to-violet-500" },
];

const features = [
  {
    title: "AI-Likeness Detection",
    description:
      "See how closely your draft matches patterns often found in AI-generated writing—before you submit.",
    icon: "◈",
  },
  {
    title: "Human Authenticity Score",
    description:
      "Measure voice, variation, and natural flow so your work reads unmistakably like you.",
    icon: "◎",
  },
  {
    title: "Academic Quality Review",
    description:
      "Get feedback on structure, argumentation, and scholarly tone aligned with real assignments.",
    icon: "▣",
  },
  {
    title: "PDF Reports",
    description:
      "Download a polished PDF with scores, feedback, and your full text—ready to share or archive.",
    icon: "↓",
  },
];

const howItWorksSteps = [
  {
    step: "1",
    title: "Upload your document",
    text: "Paste your essay or upload a .docx or .pdf. TruePen extracts your text in seconds.",
  },
  {
    step: "2",
    title: "Get instant analysis",
    text: "Review AI-likeness, human authenticity, and academic quality scores with clear feedback.",
  },
  {
    step: "3",
    title: "Download your report",
    text: "Save to your dashboard and export a PDF report whenever you need it.",
  },
];

const faqItems = [
  {
    question: "What file types are supported?",
    answer:
      "You can paste text directly or upload .docx and .pdf files. TruePen extracts the text for analysis; other formats are not supported yet.",
  },
  {
    question: "Is my data private?",
    answer:
      "Yes. Your analyses are tied to your account and only visible to you. We do not share your writing with other users.",
  },
  {
    question: "How many free analyses do I get?",
    answer:
      "The Free plan includes 3 analyses per month. Usage is tracked separately from your history, so deleting past analyses does not reset your monthly limit.",
  },
  {
    question: "Does TruePen use AI?",
    answer:
      "Scoring is currently demo-based while we build AI-powered analysis for Pro. Future releases will use AI for deeper, more accurate feedback.",
  },
];

const pricingPlans = [
  {
    name: "Free Plan",
    price: "€0",
    period: "/month",
    description: "Perfect for essays, reports, and trying TruePen on real work.",
    features: [
      "3 analyses per month",
      "DOCX & PDF upload",
      "Demo scoring & feedback",
      "Analysis history & PDF export",
    ],
    cta: "Start Free",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Pro Plan",
    price: "€4.99",
    period: "/month",
    description: "Unlimited analyses and advanced features when billing launches.",
    features: [
      "Unlimited analyses",
      "Priority processing",
      "AI-powered scoring (coming soon)",
      "Advanced feedback",
    ],
    cta: "View Pricing",
    href: "/pricing",
    highlighted: true,
  },
];

function TruePenLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
        <span className="text-sm font-bold text-white">TP</span>
      </div>
      <span className="text-lg font-semibold tracking-tight text-white">TruePen</span>
    </div>
  );
}

function MetricBar({ score, max, accent }: { score: number; max: number; accent: string }) {
  const pct = (score / max) * 100;
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${accent} transition-all`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-medium uppercase tracking-widest text-blue-400">{children}</p>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#06080f] font-sans text-zinc-300">
      {/* ambient */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-48 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-blue-600/25 blur-[130px]" />
        <div className="absolute top-1/4 -right-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-[110px]" />
        <div className="absolute bottom-1/4 -left-32 h-80 w-80 rounded-full bg-violet-600/15 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <header className="relative z-10 border-b border-white/[0.06] bg-[#06080f]/70 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
          <Link href="/" className="shrink-0">
            <TruePenLogo />
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-zinc-400 transition hover:text-white">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-zinc-400 transition hover:text-white">
              How It Works
            </a>
            <a href="#pricing" className="text-sm text-zinc-400 transition hover:text-white">
              Pricing
            </a>
            <a href="#faq" className="text-sm text-zinc-400 transition hover:text-white">
              FAQ
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 transition hover:text-white sm:inline-block"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/25 transition hover:from-blue-400 hover:to-indigo-500"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        {/* hero */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-6 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-28">
            <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
              <div className="max-w-xl">
                <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-medium text-blue-300 backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-400" />
                  </span>
                  Built for students & researchers
                </p>
                <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
                  Write with{" "}
                  <span className="bg-gradient-to-r from-sky-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    confidence.
                  </span>
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-zinc-400 sm:text-xl">
                  Check AI-likeness, human authenticity, and academic quality before
                  submitting your work.
                </p>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/register"
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-8 text-sm font-semibold text-white shadow-xl shadow-blue-500/30 transition hover:from-blue-400 hover:to-indigo-500 hover:shadow-blue-500/40"
                  >
                    Start Free
                  </Link>
                  <Link
                    href="/pricing"
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-white/15 bg-white/[0.05] px-8 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-white/25 hover:bg-white/[0.1]"
                  >
                    View Pricing
                  </Link>
                </div>
                <div className="mt-10 flex flex-wrap gap-6 border-t border-white/[0.06] pt-8">
                  {[
                    { value: "3", label: "Free analyses / month" },
                    { value: ".docx", label: "& PDF upload" },
                    { value: "PDF", label: "Report export" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <p className="text-lg font-semibold text-white">{stat.value}</p>
                      <p className="text-xs text-zinc-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-violet-500/20 blur-2xl" />
                <div className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-6 shadow-2xl shadow-black/50 backdrop-blur-md">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="text-sm font-medium text-white">Live preview</span>
                    <span className="rounded-md bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-400">
                      Analysis complete
                    </span>
                  </div>
                  <div className="space-y-4">
                    {analysisMetrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="rounded-xl border border-white/[0.06] bg-[#0a0e18]/90 p-4"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm text-zinc-400">{metric.label}</span>
                          <span className="text-sm font-semibold tabular-nums text-white">
                            {metric.score}
                            <span className="font-normal text-zinc-500">/100</span>
                          </span>
                        </div>
                        <MetricBar
                          score={metric.score}
                          max={metric.max}
                          accent={metric.accent}
                        />
                      </div>
                    ))}
                  </div>
                  <p className="mt-5 text-center text-xs text-zinc-500">
                    Sample scores · Your writing stays private
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* features */}
        <section id="features" className="border-t border-white/[0.06] bg-[#080b14]/60 py-24 lg:py-28">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <SectionLabel>Features</SectionLabel>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Everything you need before you submit
              </h2>
              <p className="mt-5 text-lg text-zinc-400">
                Honest, student-friendly analysis—not fear-based scanning.
              </p>
            </div>
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] p-7 transition duration-300 hover:border-blue-500/40 hover:bg-white/[0.05] hover:shadow-lg hover:shadow-blue-500/5"
                >
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl transition group-hover:bg-blue-500/20" />
                  <div className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 text-xl text-blue-300 ring-1 ring-white/10">
                    {feature.icon}
                  </div>
                  <h3 className="relative text-base font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-zinc-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* how it works */}
        <section id="how-it-works" className="py-24 lg:py-28">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <SectionLabel>How it works</SectionLabel>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Three steps to a stronger draft
              </h2>
              <p className="mt-5 text-lg text-zinc-400">
                From upload to export in minutes.
              </p>
            </div>
            <div className="relative mt-16 grid gap-8 md:grid-cols-3">
              <div className="pointer-events-none absolute top-12 hidden h-px w-full bg-gradient-to-r from-transparent via-blue-500/30 to-transparent md:block" />
              {howItWorksSteps.map((item) => (
                <div
                  key={item.step}
                  className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-transparent p-8 text-center md:text-left"
                >
                  <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white shadow-lg shadow-blue-500/30 md:mx-0">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* pricing preview */}
        <section id="pricing" className="border-t border-white/[0.06] bg-[#080b14]/60 py-24 lg:py-28">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <SectionLabel>Pricing</SectionLabel>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Start free, upgrade when you&apos;re ready
              </h2>
              <p className="mt-5 text-lg text-zinc-400">
                No credit card required for the Free plan.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-4xl gap-8 md:grid-cols-2">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative flex flex-col rounded-2xl border p-8 lg:p-10 ${
                    plan.highlighted
                      ? "border-blue-500/50 bg-gradient-to-b from-blue-500/15 via-indigo-500/10 to-transparent shadow-2xl shadow-blue-500/10 ring-1 ring-blue-500/20"
                      : "border-white/[0.08] bg-white/[0.03]"
                  }`}
                >
                  {plan.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-1 text-xs font-semibold text-white shadow-lg">
                      Recommended
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-5xl font-semibold tracking-tight text-white">
                      {plan.price}
                    </span>
                    <span className="text-sm text-zinc-500">{plan.period}</span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-zinc-400">
                    {plan.description}
                  </p>
                  <ul className="mt-8 flex-1 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-zinc-300">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-xs text-blue-400">
                          ✓
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.href}
                    className={`mt-10 inline-flex h-12 items-center justify-center rounded-xl text-sm font-semibold transition ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:from-blue-400 hover:to-indigo-500"
                        : "border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* faq */}
        <section id="faq" className="py-24 lg:py-28">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <SectionLabel>FAQ</SectionLabel>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Questions? We&apos;ve got answers.
              </h2>
            </div>
            <div className="mx-auto mt-16 max-w-3xl space-y-3">
              {faqItems.map((item) => (
                <details
                  key={item.question}
                  className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] transition open:border-blue-500/30 open:bg-white/[0.05]"
                >
                  <summary className="cursor-pointer list-none px-6 py-5 text-base font-medium text-white [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center justify-between gap-4">
                      {item.question}
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-blue-400 transition group-open:rotate-45">
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="border-t border-white/[0.06] px-6 pb-5 pt-1 text-sm leading-relaxed text-zinc-400">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* final CTA */}
        <section className="pb-24 lg:pb-28">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/25 via-indigo-600/15 to-violet-600/10 px-8 py-16 text-center sm:px-16 sm:py-20">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_50%)]" />
              <div className="relative">
                <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Start your first analysis today
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-lg text-zinc-300">
                  Join students who check their work with TruePen before every submission.
                </p>
                <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    href="/register"
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-8 text-sm font-semibold text-[#06080f] shadow-lg transition hover:bg-zinc-100"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-8 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/[0.06] py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row lg:px-8">
          <TruePenLogo />
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
            <a href="#features" className="transition hover:text-zinc-300">
              Features
            </a>
            <a href="#pricing" className="transition hover:text-zinc-300">
              Pricing
            </a>
            <Link href="/login" className="transition hover:text-zinc-300">
              Sign In
            </Link>
          </div>
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} TruePen. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
