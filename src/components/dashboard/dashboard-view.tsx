"use client";

import { ArrowUpRight, CalendarDays, ChevronRight, Droplets, FlaskConical, Sparkles, Wine } from "lucide-react";

import { BottleArt } from "@/components/brand/bottle-art";
import { StatusPill } from "@/components/ui/status-pill";
import { useWineClub } from "@/context/wine-club-provider";
import { getActivity, type ActivityKind } from "@/lib/activity";
import { formatDate, formatShortDate, pluralize } from "@/lib/date";
import type { AppView } from "@/components/navigation/bottom-nav";

interface DashboardViewProps {
  onNavigate: (view: AppView) => void;
  onQuickLog: () => void;
}

const activityIcons: Record<ActivityKind, typeof FlaskConical> = {
  reading: FlaskConical,
  addition: Droplets,
  meeting: CalendarDays,
  phase: Wine,
};

export function DashboardView({ onNavigate, onQuickLog }: DashboardViewProps) {
  const { state } = useWineClub();
  const activeBatches = state.batches.filter((batch) => batch.currentPhase !== "Bottled");
  const recentActivity = getActivity(state).slice(0, 4);
  const latestReading = [...state.readings].sort((a, b) => b.date.localeCompare(a.date))[0];
  const nextMeeting = [...state.meetings].sort((a, b) => b.date.localeCompare(a.date))[0];

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-[2rem] bg-wine-900 p-6 text-white shadow-[0_20px_45px_rgba(93,24,53,0.18)] sm:p-8">
        <div aria-hidden="true" className="absolute -right-10 -top-12 h-44 w-44 rounded-full border-[32px] border-white/5" />
        <div aria-hidden="true" className="absolute bottom-3 right-7 grid grid-cols-2 gap-1.5 opacity-20">
          {[0, 1, 2, 3, 4, 5].map((dot) => (
            <span className="h-5 w-5 rounded-full border border-white" key={dot} />
          ))}
        </div>
        <div className="relative max-w-lg">
          <div className="mb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-rose-100">
            <Sparkles aria-hidden="true" size={15} />
            Next club night
          </div>
          <p className="font-display text-[2rem] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[2.6rem]">
            {nextMeeting ? formatDate(nextMeeting.date, { weekday: "long", month: "long", day: "numeric" }) : "Date to be poured"}
          </p>
          {nextMeeting && (
            <>
              <p className="mt-3 max-w-sm text-sm leading-6 text-rose-50/75">{nextMeeting.notes}</p>
              <button
                className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-extrabold text-wine-900 transition hover:bg-cream-100 active:scale-95"
                onClick={() => onNavigate("meetings")}
                type="button"
              >
                View meeting <ArrowUpRight aria-hidden="true" size={17} />
              </button>
            </>
          )}
        </div>
      </section>

      <section aria-labelledby="cellar-snapshot">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="section-kicker">At a glance</p>
            <h2 className="section-title" id="cellar-snapshot">Cellar snapshot</h2>
          </div>
          <button className="text-sm font-extrabold text-wine-700" onClick={() => onNavigate("activity")} type="button">
            All records
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <button
            className="group min-h-32 rounded-[1.5rem] bg-white p-4 text-left shadow-card transition hover:-translate-y-0.5 active:scale-[0.98]"
            onClick={() => onNavigate("batches")}
            type="button"
          >
            <span className="mb-5 grid h-9 w-9 place-items-center rounded-xl bg-wine-100 text-wine-800">
              <Wine aria-hidden="true" size={18} />
            </span>
            <strong className="block font-display text-3xl font-semibold text-wine-950">{activeBatches.length}</strong>
            <span className="text-xs font-semibold text-stone-500">active batches</span>
          </button>
          <button
            className="group min-h-32 rounded-[1.5rem] bg-apricot-100 p-4 text-left shadow-card transition hover:-translate-y-0.5 active:scale-[0.98]"
            onClick={() => onNavigate("activity")}
            type="button"
          >
            <span className="mb-5 grid h-9 w-9 place-items-center rounded-xl bg-white/70 text-apricot-800">
              <FlaskConical aria-hidden="true" size={18} />
            </span>
            <strong className="block font-display text-3xl font-semibold text-wine-950">
              {latestReading?.specificGravity.toFixed(3) ?? "—"}
            </strong>
            <span className="text-xs font-semibold text-stone-600">latest SG</span>
          </button>
          <button
            className="col-span-2 min-h-28 rounded-[1.5rem] bg-sage-100 p-4 text-left shadow-card transition hover:-translate-y-0.5 active:scale-[0.98] sm:col-span-1 sm:min-h-32"
            onClick={onQuickLog}
            type="button"
          >
            <span className="mb-3 grid h-9 w-9 place-items-center rounded-xl bg-white/70 text-sage-800 sm:mb-5">
              <Droplets aria-hidden="true" size={18} />
            </span>
            <strong className="block font-display text-2xl font-semibold text-wine-950">Quick log</strong>
            <span className="text-xs font-semibold text-stone-600">Reading, addition & more</span>
          </button>
        </div>
      </section>

      <section aria-labelledby="active-pours">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="section-kicker">In progress</p>
            <h2 className="section-title" id="active-pours">Active pours</h2>
          </div>
          <button
            aria-label="View all batches"
            className="grid min-h-11 min-w-11 place-items-center rounded-full bg-white text-wine-800 shadow-sm"
            onClick={() => onNavigate("batches")}
            type="button"
          >
            <ChevronRight aria-hidden="true" size={20} />
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {activeBatches.map((batch) => {
            const reading = [...state.readings]
              .filter((item) => item.batchId === batch.id)
              .sort((a, b) => b.date.localeCompare(a.date))[0];
            return (
              <button
                className="relative flex min-h-48 overflow-hidden rounded-[1.75rem] bg-white p-5 text-left shadow-card transition hover:-translate-y-0.5 active:scale-[0.99]"
                key={batch.id}
                onClick={() => onNavigate("batches")}
                type="button"
              >
                <div className="relative z-10 flex-1 pr-2">
                  <StatusPill phase={batch.currentPhase} />
                  <h3 className="mt-4 font-display text-2xl font-semibold tracking-[-0.03em] text-wine-950">{batch.name}</h3>
                  <p className="mt-1 text-sm font-medium text-stone-500">{batch.varietal}</p>
                  <div className="mt-5 flex gap-4 text-xs font-bold text-stone-500">
                    <span>{batch.volumeGallons} gal</span>
                    <span>{reading ? `SG ${reading.specificGravity.toFixed(3)}` : "No readings"}</span>
                  </div>
                </div>
                <BottleArt className="absolute -bottom-7 right-3 h-44 w-20 rotate-[5deg] drop-shadow-xl" style={batch.style} />
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="recent-activity">
        <div className="mb-4">
          <p className="section-kicker">The logbook</p>
          <h2 className="section-title" id="recent-activity">Recent activity</h2>
        </div>
        <div className="overflow-hidden rounded-[1.75rem] bg-white shadow-card">
          {recentActivity.map((activity, index) => {
            const Icon = activityIcons[activity.kind];
            return (
              <article
                className={`flex gap-3 p-4 ${index !== recentActivity.length - 1 ? "border-b border-wine-950/6" : ""}`}
                key={`${activity.kind}-${activity.id}`}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-cream-200 text-wine-700">
                  <Icon aria-hidden="true" size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="truncate text-sm font-extrabold text-wine-950">{activity.title}</h3>
                    <time className="shrink-0 text-[0.68rem] font-bold text-stone-400" dateTime={activity.date}>
                      {formatShortDate(activity.date)}
                    </time>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-stone-500">{activity.detail}</p>
                </div>
              </article>
            );
          })}
        </div>
        <p className="mt-3 text-center text-xs font-medium text-stone-400">
          {pluralize(state.readings.length, "reading")} and {pluralize(state.additions.length, "addition")} saved on this device
        </p>
      </section>
    </div>
  );
}
