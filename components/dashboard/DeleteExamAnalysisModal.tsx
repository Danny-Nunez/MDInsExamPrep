"use client";

import { useEffect, useRef } from "react";

type DeleteExamAnalysisModalProps = {
  open: boolean;
  fileName: string | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DeleteExamAnalysisModal({
  open,
  fileName,
  loading = false,
  onClose,
  onConfirm,
}: DeleteExamAnalysisModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="fixed left-1/2 top-1/2 z-[200] m-0 w-[min(calc(100vw-2rem),28rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-stone-200 bg-white p-0 shadow-xl backdrop:bg-black/40"
      onCancel={(e) => {
        e.preventDefault();
        if (!loading) onClose();
      }}
      onClose={onClose}
    >
      <div className="p-6">
        <h2 className="text-lg font-bold text-md-black">Delete score report?</h2>
        <p className="mt-3 text-sm leading-relaxed text-stone-600">
          {fileName ? (
            <>
              This will permanently remove the analysis for{" "}
              <span className="font-semibold text-md-black">{fileName}</span>.
              Weak areas from this upload will no longer appear on your
              dashboard.
            </>
          ) : (
            <>
              This will permanently remove the uploaded exam analysis. Weak
              areas from this report will no longer appear on your dashboard.
            </>
          )}
        </p>
        <p className="mt-2 text-sm text-stone-500">
          You can upload a new Prometric score report anytime.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-60"
          >
            Keep report
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-md-red px-4 py-2.5 text-sm font-semibold text-white hover:bg-md-red-dark disabled:opacity-60"
          >
            {loading ? "Deleting…" : "Delete report"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
