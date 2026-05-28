const analysisMetrics = [
  { label: "AI-Likeness", score: 23, max: 100, accent: "from-sky-400 to-blue-500" },
  { label: "Human Authenticity", score: 87, max: 100, accent: "from-blue-400 to-indigo-500" },
  { label: "Academic Quality", score: 72, max: 100, accent: "from-indigo-400 to-violet-500" },
];

const features = [
  {
    title: "AI Pattern Detection",
    description:
      "Surface linguistic patterns commonly associated with AI-generated text so you can revise with clarity.",
    icon: "◇",
  },
  {
    title: "Authenticity Signals",
    description:
      "Understand voice, variation, and human-like flow across your draft—not just a single score.",
    icon: "◎",
  },
  {
    title: "Academic Quality",
    description:
      "Get feedback aligned with structure, argumentation, and scholarly tone for stronger submissions.",
    icon: "▣",
  },
  {
    title: "Actionable Insights",
    description:
      "See where to improve with clear, student-friendly explanations—not vague warnings.",
    icon: "→",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "€0",
    period: "forever",
    description: "Perfect for trying TruePen on a single essay or assignment.",
    features: [
      "3 analyses per month",
      "Core AI-likeness score",
      "Basic authenticity report",
      "Email support",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "€3.99",
    period: "/month",
    description: "For students who write often and want deeper, unlimited insight.",
    features: [
      "Unlimited analyses",
      "Full authenticity breakdown",
      "Academic quality scoring",
      "Priority support",
      "Exportable reports",
    ],
    cta: "Get Pro",
    highlighted: true,
  },
];

function TruePenLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
        <span className="text-sm font-bold text-white">TP</span>
      </div>
      <span className="text-lg font-semibold tracking-tight text-white">
        TruePen
      </span>
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

export default function Home() {
  return (
    <div className="min-h-screen bg-[#06080f] font-sans text-zinc-300">
      {/* ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute top-1/3 -right-32 h-80 w-80 rounded-full bg-indigo-600/15 blur-[100px]" />
        <div className="absolute bottom-0 -left-24 h-64 w-64 rounded-full bg-sky-500/10 blur-[80px]" />
      </div>

      {/* navbar */}
      <header className="relative z-10 border-b border-white/[0.06] bg-[#06080f]/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
          <a href="#" className="shrink-0">
            <TruePenLogo />
          </a>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-zinc-400 transition-colors hover:text-white">
              Features
            </a>
            <a href="#pricing" className="text-sm text-zinc-400 transition-colors hover:text-white">
              Pricing
            </a>
            <a href="#how-it-works" className="text-sm text-zinc-400 transition-colors hover:text-white">
              How It Works
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="hidden rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white sm:inline-block"
            >
              Sign In
            </a>
            <a
              href="#"
              className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/25 transition hover:from-blue-400 hover:to-indigo-500"
            >
              Get Started
            </a>
          </div>
        </nav>
      </header>

      <main className="relative z-10">
        {/* hero */}
        <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 lg:px-8 lg:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-medium text-blue-300">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                Academic writing analysis
              </p>
              <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-[3.25rem]">
                Write with{" "}
                <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  confidence
                </span>
                .{" "}
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  Prove it&apos;s you
                </span>
                .
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
                TruePen helps students analyze academic writing for AI-like patterns,
                human authenticity, and academic quality.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:from-blue-400 hover:to-indigo-500"
                >
                  Start Free Analysis
                </a>
                <a
                  href="#"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-6 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.08]"
                >
                  View Demo
                </a>
              </div>
            </div>

            {/* analysis preview */}
            <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 shadow-2xl shadow-black/40 backdrop-blur-sm">
              <div className="mb-5 flex items-center justify-between">
                <span className="text-sm font-medium text-white">Analysis Preview</span>
                <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400">
                  Complete
                </span>
              </div>
              <div className="space-y-5">
                {analysisMetrics.map((metric) => (
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
                    <MetricBar score={metric.score} max={metric.max} accent={metric.accent} />
                  </div>
                ))}
              </div>
              <p className="mt-4 text-center text-xs text-zinc-500">
                Sample report · Your document stays private
              </p>
            </div>
          </div>
        </section>

        {/* features */}
        <section id="features" className="border-t border-white/[0.06] bg-[#080b14]/50 py-20">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Everything you need to write with integrity
              </h2>
              <p className="mt-4 text-zinc-400">
                Built for students who want honest feedback—not fear-based scanning.
              </p>
            </div>
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 transition hover:border-blue-500/30 hover:bg-white/[0.05]"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 text-lg text-blue-400 transition group-hover:bg-blue-500/25">
                    {feature.icon}
                  </div>
                  <h3 className="text-base font-semibold text-white">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* how it works */}
        <section id="how-it-works" className="py-20">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                How it works
              </h2>
              <p className="mt-4 text-zinc-400">
                Three steps from draft to confident submission.
              </p>
            </div>
            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Upload your draft",
                  text: "Paste or upload your essay. We analyze structure and language—not your identity.",
                },
                {
                  step: "02",
                  title: "Review your scores",
                  text: "See AI-likeness, authenticity, and academic quality in one clear dashboard.",
                },
                {
                  step: "03",
                  title: "Revise with purpose",
                  text: "Use targeted suggestions to strengthen your voice before you submit.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="relative rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-8"
                >
                  <span className="text-4xl font-bold bg-gradient-to-r from-blue-500/40 to-indigo-500/40 bg-clip-text text-transparent">
                    {item.step}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* pricing */}
        <section id="pricing" className="border-t border-white/[0.06] bg-[#080b14]/50 py-20">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Simple, student-friendly pricing
              </h2>
              <p className="mt-4 text-zinc-400">
                Start free. Upgrade when you need unlimited analyses.
              </p>
            </div>
            <div className="mx-auto mt-14 grid max-w-4xl gap-8 md:grid-cols-2">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`relative flex flex-col rounded-2xl border p-8 ${
                    plan.highlighted
                      ? "border-blue-500/40 bg-gradient-to-b from-blue-500/10 to-indigo-500/5 shadow-xl shadow-blue-500/10"
                      : "border-white/[0.08] bg-white/[0.03]"
                  }`}
                >
                  {plan.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-3 py-1 text-xs font-semibold text-white">
                      Most popular
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold tracking-tight text-white">
                      {plan.price}
                    </span>
                    <span className="text-sm text-zinc-500">{plan.period}</span>
                  </div>
                  <p className="mt-3 text-sm text-zinc-400">{plan.description}</p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                        <span className="mt-0.5 text-blue-400">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#"
                    className={`mt-8 inline-flex h-11 items-center justify-center rounded-xl text-sm font-semibold transition ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:from-blue-400 hover:to-indigo-500"
                        : "border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]"
                    }`}
                  >
                    {plan.cta}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* footer CTA */}
        <section className="py-20">
          <div className="mx-auto max-w-6xl px-6 lg:px-8">
            <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-transparent px-8 py-14 text-center sm:px-12">
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Ready to prove it&apos;s your work?
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-zinc-400">
                Join students who use TruePen to understand their writing—not just pass a check.
              </p>
              <a
                href="#"
                className="mt-8 inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-8 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:from-blue-400 hover:to-indigo-500"
              >
                Start Free Analysis
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/[0.06] py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row lg:px-8">
          <TruePenLogo />
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} TruePen. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
