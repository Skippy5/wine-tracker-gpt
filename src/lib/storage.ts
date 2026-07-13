import { createSeedData } from "@/lib/seed-data";
import type { WineClubState } from "@/types/wine";

export const STORAGE_KEY = "pour-choices:wine-club:v1";

function isWineClubState(value: unknown): value is WineClubState {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<WineClubState>;
  return (
    candidate.version === 1 &&
    Array.isArray(candidate.batches) &&
    Array.isArray(candidate.readings) &&
    Array.isArray(candidate.additions) &&
    Array.isArray(candidate.meetings)
  );
}

export function loadWineClubState(): WineClubState {
  if (typeof window === "undefined") return createSeedData();

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return createSeedData();
    const parsed: unknown = JSON.parse(saved);
    return isWineClubState(parsed) ? parsed : createSeedData();
  } catch {
    return createSeedData();
  }
}

export function saveWineClubState(state: WineClubState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage can be unavailable in private browsing or when the quota is full.
  }
}
