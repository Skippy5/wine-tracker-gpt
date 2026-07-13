export const BATCH_PHASES = ["Started", "Racked", "Bottled"] as const;

export type BatchPhase = (typeof BATCH_PHASES)[number];

export type WineStyle = "Red" | "White" | "Rosé" | "Fruit" | "Other";

export interface PhaseEvent {
  phase: BatchPhase;
  date: string;
}

export interface Batch {
  id: string;
  name: string;
  varietal: string;
  style: WineStyle;
  volumeGallons: number;
  currentPhase: BatchPhase;
  phaseHistory: PhaseEvent[];
  notes: string;
  createdAt: string;
}

export interface Reading {
  id: string;
  batchId: string;
  date: string;
  stage: string;
  specificGravity: number;
  temperatureF: number;
  ph: number;
  notes: string;
}

export interface Addition {
  id: string;
  batchId: string;
  date: string;
  agent: string;
  amount: number;
  unit: string;
  notes: string;
}

export interface Meeting {
  id: string;
  date: string;
  title: string;
  attendees: string[];
  notes: string;
}

export interface WineClubState {
  version: 1;
  batches: Batch[];
  readings: Reading[];
  additions: Addition[];
  meetings: Meeting[];
}

export type NewBatch = Omit<Batch, "id" | "currentPhase" | "phaseHistory" | "createdAt"> & {
  startDate: string;
};

export type NewReading = Omit<Reading, "id">;
export type NewAddition = Omit<Addition, "id">;
export type NewMeeting = Omit<Meeting, "id">;
