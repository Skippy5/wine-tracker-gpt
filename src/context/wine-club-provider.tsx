"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from "react";

import { createSeedData } from "@/lib/seed-data";
import { loadWineClubState, saveWineClubState } from "@/lib/storage";
import { BATCH_PHASES } from "@/types/wine";
import type {
  NewAddition,
  NewBatch,
  NewMeeting,
  NewReading,
  WineClubState,
} from "@/types/wine";

type WineClubAction =
  | { type: "hydrate"; state: WineClubState }
  | { type: "addBatch"; id: string; batch: NewBatch }
  | { type: "advanceBatch"; batchId: string; date: string }
  | { type: "addReading"; id: string; reading: NewReading }
  | { type: "addAddition"; id: string; addition: NewAddition }
  | { type: "addMeeting"; id: string; meeting: NewMeeting };

export function wineClubReducer(state: WineClubState, action: WineClubAction): WineClubState {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "addBatch":
      return {
        ...state,
        batches: [
          {
            id: action.id,
            name: action.batch.name,
            varietal: action.batch.varietal,
            style: action.batch.style,
            volumeGallons: action.batch.volumeGallons,
            notes: action.batch.notes,
            currentPhase: "Started",
            phaseHistory: [{ phase: "Started", date: action.batch.startDate }],
            createdAt: action.batch.startDate,
          },
          ...state.batches,
        ],
      };
    case "advanceBatch": {
      const batch = state.batches.find((item) => item.id === action.batchId);
      if (!batch || batch.currentPhase === "Bottled") return state;
      const phaseIndex = BATCH_PHASES.indexOf(batch.currentPhase);
      const nextPhase = BATCH_PHASES[phaseIndex + 1];
      return {
        ...state,
        batches: state.batches.map((item) =>
          item.id === action.batchId
            ? {
                ...item,
                currentPhase: nextPhase,
                phaseHistory: [...item.phaseHistory, { phase: nextPhase, date: action.date }],
              }
            : item,
        ),
      };
    }
    case "addReading":
      return {
        ...state,
        readings: [{ ...action.reading, id: action.id }, ...state.readings],
      };
    case "addAddition":
      return {
        ...state,
        additions: [{ ...action.addition, id: action.id }, ...state.additions],
      };
    case "addMeeting":
      return {
        ...state,
        meetings: [{ ...action.meeting, id: action.id }, ...state.meetings],
      };
    default:
      return state;
  }
}

function makeId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

interface WineClubContextValue {
  state: WineClubState;
  hydrated: boolean;
  addBatch: (batch: NewBatch) => void;
  advanceBatch: (batchId: string, date: string) => void;
  addReading: (reading: NewReading) => void;
  addAddition: (addition: NewAddition) => void;
  addMeeting: (meeting: NewMeeting) => void;
}

const WineClubContext = createContext<WineClubContextValue | null>(null);

export function WineClubProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wineClubReducer, undefined, createSeedData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      dispatch({ type: "hydrate", state: loadWineClubState() });
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hydrated) saveWineClubState(state);
  }, [hydrated, state]);

  const value = useMemo<WineClubContextValue>(
    () => ({
      state,
      hydrated,
      addBatch: (batch) => dispatch({ type: "addBatch", id: makeId("batch"), batch }),
      advanceBatch: (batchId, date) => dispatch({ type: "advanceBatch", batchId, date }),
      addReading: (reading) =>
        dispatch({ type: "addReading", id: makeId("reading"), reading }),
      addAddition: (addition) =>
        dispatch({ type: "addAddition", id: makeId("addition"), addition }),
      addMeeting: (meeting) =>
        dispatch({ type: "addMeeting", id: makeId("meeting"), meeting }),
    }),
    [hydrated, state],
  );

  return <WineClubContext.Provider value={value}>{children}</WineClubContext.Provider>;
}

export function useWineClub() {
  const context = useContext(WineClubContext);
  if (!context) throw new Error("useWineClub must be used within WineClubProvider");
  return context;
}
