import Link from "next/link";

export function TruePenLogo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
        <span className="text-sm font-bold text-white">TP</span>
      </div>
      <span className="text-lg font-semibold tracking-tight text-white">
        TruePen
      </span>
    </Link>
  );
}
