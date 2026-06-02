import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TruePen — Write with confidence",
  description:
    "Analyze academic writing for AI-like patterns, human authenticity, and academic quality.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>

        <footer className="border-t border-white/5 bg-[#06080f] py-6">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-zinc-500 md:flex-row">
            <p>© 2026 TruePen. All rights reserved.</p>

            <div className="flex items-center gap-6">
              <a
                href="/support"
                className="transition hover:text-white"
              >
                Support
              </a>

              <a
                href="/privacy"
                className="transition hover:text-white"
              >
                Privacy Policy
              </a>

              <a
                href="/terms"
                className="transition hover:text-white"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}