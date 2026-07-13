"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="grid min-h-dvh place-items-center px-6 text-center">
      <div className="max-w-md rounded-[2rem] bg-white p-8 shadow-card">
        <p className="section-kicker">A small spill</p>
        <h1 className="font-display text-4xl font-semibold text-wine-950">The cellar log hit a snag.</h1>
        <p className="mt-3 text-sm leading-6 text-stone-500">Your saved records are still on this device. Try opening the log again.</p>
        <button className="mt-6 min-h-12 rounded-2xl bg-wine-800 px-6 font-bold text-white" onClick={reset} type="button">
          Try again
        </button>
      </div>
    </main>
  );
}
