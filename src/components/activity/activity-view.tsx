"use client";

import { useState } from "react";
import { CalendarDays, Droplets, FlaskConical, Plus, Wine } from "lucide-react";

import { useWineClub } from "@/context/wine-club-provider";
import { getActivity, type ActivityKind } from "@/lib/activity";
import { formatDate } from "@/lib/date";

type RecordFilter = "all" | "reading" | "addition";

const icons: Record<ActivityKind, typeof Wine> = {
  reading: FlaskConical,
  addition: Droplets,
  meeting: CalendarDays,
  phase: Wine,
};

export function ActivityView({ onQuickLog }: { onQuickLog: () => void }) {
  const { state } = useWineClub();
  const [filter, setFilter] = useState<RecordFilter>("all");
  const activity = getActivity(state).filter((item) => filter === "all" || item.kind === filter);

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="section-kicker">Numbers & notes</p>
          <h1 className="page-title">Cellar records</h1>
          <p className="mt-2 text-sm text-stone-500">The complete story of every batch.</p>
        </div>
        <button
          aria-label="Add a cellar record"
          className="grid min-h-12 min-w-12 place-items-center rounded-2xl bg-wine-800 text-white shadow-lg transition active:scale-95"
          onClick={onQuickLog}
          type="button"
        >
          <Plus aria-hidden="true" size={22} />
        </button>
      </header>

      <div aria-label="Filter records" className="flex gap-2 overflow-x-auto pb-1" role="group">
        {([
          ["all", "Everything"],
          ["reading", "Readings"],
          ["addition", "Additions"],
        ] as [RecordFilter, string][]).map(([value, label]) => (
          <button
            aria-pressed={filter === value}
            className={`min-h-11 shrink-0 rounded-full px-5 text-sm font-extrabold transition ${
              filter === value ? "bg-wine-900 text-white" : "bg-white text-stone-500 shadow-sm"
            }`}
            key={value}
            onClick={() => setFilter(value)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="relative pl-4">
        <div aria-hidden="true" className="absolute bottom-6 left-[2.1rem] top-6 w-px bg-wine-200" />
        <div className="space-y-3">
          {activity.map((item) => {
            const Icon = icons[item.kind];
            return (
              <article className="relative flex gap-3" key={`${item.kind}-${item.id}`}>
                <span className="relative z-10 mt-4 grid h-9 w-9 shrink-0 place-items-center rounded-full border-4 border-cream-50 bg-wine-100 text-wine-700">
                  <Icon aria-hidden="true" size={14} strokeWidth={2.2} />
                </span>
                <div className="min-w-0 flex-1 rounded-[1.5rem] bg-white p-4 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-sm font-extrabold text-wine-950">{item.title}</h2>
                    <time className="shrink-0 text-[0.68rem] font-bold text-stone-400" dateTime={item.date}>
                      {formatDate(item.date, { month: "short", day: "numeric" })}
                    </time>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-stone-500">{item.detail}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
