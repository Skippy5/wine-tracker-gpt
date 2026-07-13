"use client";

import { useEffect, useId, type ReactNode } from "react";
import { X } from "lucide-react";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  eyebrow?: string;
  title: string;
  children: ReactNode;
}

export function Sheet({ open, onClose, eyebrow, title, children }: SheetProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-wine-950/45 px-0 backdrop-blur-[2px] sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        aria-labelledby={titleId}
        aria-modal="true"
        className="sheet-enter max-h-[92dvh] w-full overflow-y-auto rounded-t-[2rem] bg-cream-50 px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-3 shadow-2xl sm:max-w-lg sm:rounded-[2rem] sm:p-7"
        role="dialog"
      >
        <div aria-hidden="true" className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-wine-950/15 sm:hidden" />
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            {eyebrow && (
              <p className="mb-1 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-wine-600">
                {eyebrow}
              </p>
            )}
            <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-wine-950" id={titleId}>
              {title}
            </h2>
          </div>
          <button
            aria-label="Close"
            className="grid min-h-11 min-w-11 place-items-center rounded-full bg-white text-wine-900 shadow-sm transition active:scale-95"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" size={20} strokeWidth={2} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
