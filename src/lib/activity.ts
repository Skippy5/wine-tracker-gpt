import type { WineClubState } from "@/types/wine";

export type ActivityKind = "reading" | "addition" | "meeting" | "phase";

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  date: string;
  title: string;
  detail: string;
}

export function getActivity(state: WineClubState): ActivityItem[] {
  const batchNames = new Map(state.batches.map((batch) => [batch.id, batch.name]));
  const readings: ActivityItem[] = state.readings.map((reading) => ({
    id: reading.id,
    kind: "reading",
    date: reading.date,
    title: `SG ${reading.specificGravity.toFixed(3)} recorded`,
    detail: `${batchNames.get(reading.batchId) ?? "Unknown batch"} · ${reading.temperatureF}°F · pH ${reading.ph.toFixed(2)}`,
  }));
  const additions: ActivityItem[] = state.additions.map((addition) => ({
    id: addition.id,
    kind: "addition",
    date: addition.date,
    title: `${addition.agent} added`,
    detail: `${batchNames.get(addition.batchId) ?? "Unknown batch"} · ${addition.amount} ${addition.unit}`,
  }));
  const meetings: ActivityItem[] = state.meetings.map((meeting) => ({
    id: meeting.id,
    kind: "meeting",
    date: meeting.date,
    title: meeting.title,
    detail: `${meeting.attendees.length} attendees · ${meeting.notes}`,
  }));
  const phases: ActivityItem[] = state.batches.flatMap((batch) =>
    batch.phaseHistory.map((event, index) => ({
      id: `${batch.id}-${event.phase}-${index}`,
      kind: "phase" as const,
      date: event.date,
      title: `${batch.name} ${event.phase.toLowerCase()}`,
      detail: `${batch.varietal} · ${batch.volumeGallons} gal`,
    })),
  );

  return [...readings, ...additions, ...meetings, ...phases].sort((a, b) =>
    b.date.localeCompare(a.date),
  );
}
