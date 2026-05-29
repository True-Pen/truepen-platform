import Link from "next/link";
import { TruePenBackground } from "@/components/truepen-background";
import { TruePenLogo } from "@/components/truepen-logo";

const plans = [
  {
    name: "Free",
    price: "€0",
    period: "/month",
    description: "Everything you need to try TruePen on real assignments.",
    features: [
      "3 analyses per month",
      "DOCX/PDF upload",
      "Demo scoring",
      "Analysis history",
    ],
    current: true,
    cta: { label: "Current plan", href: null, disabled: true },
  },
  {
    name: "Pro",
    price: "€4.99",
    period: "/month",
    description: "For students who write often and want unlimited insight.",
    features: [
      "Unlimited analyses",
      "Priority processing",
      "Future AI-powered scoring",
      "Advanced feedback",
    ],
    highlighted: true,
    current: false,
    cta: { label: "Coming soon", href: null, disabled: true },
  },
];

export default function PricingPage() {
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
            <Link
              href="/analyze"
              className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/25 transition hover:from-blue-400 hover:to-indigo-500"
            >
              Analyze
            </Link>
          </div>
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-blue-400">Pricing</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Simple, student-friendly plans
          </h1>
          <p className="mt-4 text-zinc-400">
            Start free with 3 analyses per month. Pro unlocks unlimited analyses when
            billing launches.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-8 md:grid-cols-2">
          {plans.map((plan) => (
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
                  Pro
                </span>
              )}
              {plan.current && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-400">
                  Current plan
                </span>
              )}
              <h2 className="text-lg font-semibold text-white">{plan.name}</h2>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-semibold tracking-tight text-white">
                  {plan.price}
                </span>
                <span className="text-sm text-zinc-500">{plan.period}</span>
              </div>
              <p className="mt-3 text-sm text-zinc-400">{plan.description}</p>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-zinc-300"
                  >
                    <span className="mt-0.5 text-blue-400">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                disabled={plan.cta.disabled}
                className={`mt-8 inline-flex h-11 w-full items-center justify-center rounded-xl text-sm font-semibold transition ${
                  plan.current
                    ? "cursor-default border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : plan.highlighted
                      ? "cursor-not-allowed border border-white/10 bg-white/[0.04] text-zinc-400"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
                }`}
              >
                {plan.cta.label}
              </button>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-zinc-500">
          Payments are not enabled yet. Pro checkout will be available soon.
        </p>

        <p className="mt-6 text-center text-sm text-zinc-500">
          <Link href="/dashboard" className="text-blue-400 hover:text-blue-300">
            ← Back to dashboard
          </Link>
          <span className="mx-2 text-zinc-700">·</span>
          <Link href="/" className="text-blue-400 hover:text-blue-300">
            Home
          </Link>
        </p>
      </main>
    </div>
  );
}
