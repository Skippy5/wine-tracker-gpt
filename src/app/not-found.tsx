import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 text-center">
      <div className="max-w-md">
        <p className="section-kicker">404 · Empty bottle</p>
        <h1 className="font-display text-5xl font-semibold text-wine-950">Nothing was poured here.</h1>
        <Link className="mt-6 inline-flex min-h-12 items-center rounded-2xl bg-wine-800 px-6 font-bold text-white" href="/">
          Back to the cellar
        </Link>
      </div>
    </main>
  );
}
