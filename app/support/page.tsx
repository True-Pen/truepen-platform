import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#06080f] text-zinc-300">
      <header className="border-b border-white/[0.06]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-white">
            TruePen
          </Link>

          <Link
            href="/dashboard"
            className="text-sm text-zinc-400 hover:text-white"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-sm font-medium text-blue-400">Support</p>

        <h1 className="mt-2 text-4xl font-bold text-white">
          Contact TruePen Support
        </h1>

        <p className="mt-3 text-zinc-400">
          Having trouble with your account, subscription, PDF export, or
          analyses? Send us a message and we'll help you.
        </p>

        <form
          action="/api/support"
          method="POST"
          className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
        >
          <input
            name="name"
            required
            placeholder="Your name"
            className="w-full rounded-xl border border-white/10 bg-[#0a0e18] px-4 py-3 text-white"
          />

          <input
            name="email"
            type="email"
            required
            placeholder="Your email"
            className="w-full rounded-xl border border-white/10 bg-[#0a0e18] px-4 py-3 text-white"
          />

          <input
            name="subject"
            required
            placeholder="Subject"
            className="w-full rounded-xl border border-white/10 bg-[#0a0e18] px-4 py-3 text-white"
          />

          <textarea
            name="message"
            required
            rows={8}
            placeholder="Describe your issue..."
            className="w-full rounded-xl border border-white/10 bg-[#0a0e18] px-4 py-3 text-white"
          />

          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-500"
          >
            Send Message
          </button>
        </form>

        <p className="mt-6 text-sm text-zinc-500">
          Or contact us directly:
          <a
            href="mailto:truepenplatform@gmail.com"
            className="ml-2 text-blue-400"
          >
            truepenplatform@gmail.com
          </a>
        </p>
      </main>
    </div>
  );
}