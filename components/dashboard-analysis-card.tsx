"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function DashboardAnalysisCard({
  id,
  dateLabel,
  preview,
  aiScore,
  humanScore,
  academicScore,
}: {
  id: string;
  dateLabel: string;
  preview: string;
  aiScore: number;
  humanScore: number;
  academicScore: number;
}) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function openDialog() {
    setError(null);
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    if (!deleting) dialogRef.current?.close();
  }

  async function confirmDelete() {
    setDeleting(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data, error: userError } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!data.user) throw new Error("You must be signed in to delete analyses.");

      const { error: deleteError } = await supabase
        .from("analyses")
        .delete()
        .eq("id", id)
        .eq("user_id", data.user.id);

      if (deleteError) throw deleteError;

      dialogRef.current?.close();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete analysis.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-5 transition hover:border-blue-500/30 hover:bg-white/[0.06]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <Link href={`/analysis/${id}`} className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-white">{dateLabel}</p>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-zinc-300">
                  AI {aiScore}/100
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-zinc-300">
                  Human {humanScore}/100
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-zinc-300">
                  Academic {academicScore}/100
                </span>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-400">{preview}</p>
            <p className="mt-3 text-xs font-medium text-blue-400">View details →</p>
          </Link>
          <button
            type="button"
            onClick={openDialog}
            className="shrink-0 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-300 transition hover:border-red-500/40 hover:bg-red-500/15 hover:text-red-200"
          >
            Delete
          </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        onClose={closeDialog}
        className="fixed inset-0 z-50 m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-white/[0.08] bg-[#0a0e18] p-0 text-zinc-300 shadow-2xl shadow-black/60 backdrop:bg-black/70 open:flex open:flex-col"
      >
        <form method="dialog" className="flex flex-col p-6">
          <h3 className="text-lg font-semibold text-white">Delete analysis?</h3>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            This will permanently remove this analysis from your history. This action
            cannot be undone.
          </p>
          {error && (
            <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </p>
          )}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeDialog}
              disabled={deleting}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-white transition hover:bg-white/[0.08] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={deleting}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-red-500/30 bg-red-500/15 px-4 text-sm font-semibold text-red-200 transition hover:bg-red-500/25 disabled:opacity-50"
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
