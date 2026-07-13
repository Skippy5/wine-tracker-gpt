import type { ComponentProps, ReactNode } from "react";

export const fieldClassName =
  "min-h-12 w-full rounded-2xl border border-wine-950/10 bg-white px-4 text-base text-wine-950 outline-none transition placeholder:text-stone-400 focus:border-wine-500 focus:ring-4 focus:ring-wine-500/10";

export const textAreaClassName = `${fieldClassName} min-h-28 resize-y py-3`;

interface FieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}

export function Field({ label, htmlFor, hint, children }: FieldProps) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label className="text-sm font-bold text-wine-950" htmlFor={htmlFor}>
          {label}
        </label>
        {hint && <span className="text-xs text-stone-500">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export function PrimaryButton({ className = "", ...props }: ComponentProps<"button">) {
  return (
    <button
      className={`min-h-12 rounded-2xl bg-wine-800 px-5 font-bold text-white shadow-[0_8px_20px_rgba(93,24,53,0.18)] transition hover:bg-wine-900 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}

export function SecondaryButton({ className = "", ...props }: ComponentProps<"button">) {
  return (
    <button
      className={`min-h-12 rounded-2xl border border-wine-950/10 bg-white px-5 font-bold text-wine-900 transition hover:border-wine-500/30 hover:bg-cream-100 active:scale-[0.98] ${className}`}
      {...props}
    />
  );
}
