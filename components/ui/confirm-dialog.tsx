"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  isProcessing = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isProcessing?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    cancelButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isProcessing) {
        onCancel();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isProcessing, onCancel, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-utvt-dark/60 backdrop-blur-md p-4 animate-in fade-in duration-300"
      onClick={() => {
        if (!isProcessing) {
          onCancel();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className="w-full max-w-md scale-100 rounded-[2.5rem] border border-white/20 bg-white p-10 shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-rose-50 text-rose-500 ring-[12px] ring-rose-50/50 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
          </div>
          
          <h3 id="confirm-dialog-title" className="text-3xl font-black text-slate-800 tracking-tight leading-none">
            {title}
          </h3>
          <p id="confirm-dialog-description" className="mt-5 text-sm font-medium text-slate-500 leading-relaxed px-2">
            {description}
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <button
            ref={cancelButtonRef}
            type="button"
            disabled={isProcessing}
            onClick={onCancel}
            className="flex-1 rounded-2xl bg-slate-100 px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 transition-all hover:bg-slate-200 active:scale-95 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <Button
            type="button"
            variant="danger"
            disabled={isProcessing}
            onClick={onConfirm}
            className="flex-1 h-14"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center gap-3">
                <div className="h-5 w-5 animate-spin rounded-full border-3 border-white border-t-transparent"></div>
                <span>Procesando</span>
              </div>
            ) : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
