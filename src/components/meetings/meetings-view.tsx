"use client";

import { CalendarDays, Plus, Users } from "lucide-react";

import { useWineClub } from "@/context/wine-club-provider";
import { formatDate, pluralize } from "@/lib/date";

export function MeetingsView({ onAddMeeting }: { onAddMeeting: () => void }) {
  const { state } = useWineClub();
  const meetings = [...state.meetings].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="section-kicker">Better together</p>
          <h1 className="page-title">Club meetings</h1>
          <p className="mt-2 text-sm text-stone-500">Plans, pours, and who was there.</p>
        </div>
        <button
          aria-label="Log a meeting"
          className="grid min-h-12 min-w-12 place-items-center rounded-2xl bg-wine-800 text-white shadow-lg transition active:scale-95"
          onClick={onAddMeeting}
          type="button"
        >
          <Plus aria-hidden="true" size={22} />
        </button>
      </header>

      <div className="space-y-4">
        {meetings.map((meeting, index) => (
          <article className="overflow-hidden rounded-[1.9rem] bg-white shadow-card" key={meeting.id}>
            <div className={`p-5 ${index === 0 ? "bg-wine-900 text-white" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className={`flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] ${index === 0 ? "text-rose-100" : "text-wine-600"}`}>
                    <CalendarDays aria-hidden="true" size={14} />
                    {index === 0 ? "Next on the calendar" : "Club night"}
                  </p>
                  <h2 className={`mt-3 font-display text-2xl font-semibold tracking-[-0.03em] ${index === 0 ? "text-white" : "text-wine-950"}`}>
                    {meeting.title}
                  </h2>
                  <time className={`mt-1 block text-sm font-semibold ${index === 0 ? "text-rose-50/70" : "text-stone-500"}`} dateTime={meeting.date}>
                    {formatDate(meeting.date, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                  </time>
                </div>
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${index === 0 ? "bg-white/10 text-white" : "bg-wine-100 text-wine-700"}`}>
                  <Users aria-hidden="true" size={20} />
                </span>
              </div>
              <p className={`mt-5 text-sm leading-6 ${index === 0 ? "text-rose-50/80" : "text-stone-600"}`}>{meeting.notes}</p>
            </div>
            <div className="flex items-center justify-between gap-3 px-5 py-4">
              <div aria-label={`Attendees: ${meeting.attendees.join(", ")}`} className="flex -space-x-2">
                {meeting.attendees.slice(0, 5).map((attendee, attendeeIndex) => (
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-full border-2 border-white text-xs font-black ${avatarColors[attendeeIndex % avatarColors.length]}`}
                    key={`${meeting.id}-${attendee}`}
                    title={attendee}
                  >
                    {initials(attendee)}
                  </span>
                ))}
              </div>
              <span className="text-xs font-bold text-stone-500">{pluralize(meeting.attendees.length, "member")}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

const avatarColors = [
  "bg-wine-200 text-wine-900",
  "bg-apricot-200 text-apricot-900",
  "bg-sage-200 text-sage-900",
  "bg-rose-200 text-wine-900",
  "bg-amber-100 text-amber-900",
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
