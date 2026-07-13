import { describe, expect, it } from "vitest";

import { wineClubReducer } from "@/context/wine-club-provider";
import { createSeedData } from "@/lib/seed-data";

describe("wineClubReducer", () => {
  it("starts a batch in the Started phase without mutating existing data", () => {
    const state = createSeedData();
    const next = wineClubReducer(state, {
      type: "addBatch",
      id: "batch-test",
      batch: {
        name: "Test Pour",
        varietal: "Cabernet Sauvignon",
        style: "Red",
        volumeGallons: 5,
        notes: "A test batch",
        startDate: "2026-07-13",
      },
    });

    expect(next).not.toBe(state);
    expect(state.batches).toHaveLength(3);
    expect(next.batches[0]).toMatchObject({
      id: "batch-test",
      currentPhase: "Started",
      phaseHistory: [{ phase: "Started", date: "2026-07-13" }],
    });
  });

  it("advances a batch from Started to Racked and then Bottled", () => {
    const state = createSeedData();
    const racked = wineClubReducer(state, {
      type: "advanceBatch",
      batchId: "batch-peach-chardonnay",
      date: "2026-07-20",
    });
    const bottled = wineClubReducer(racked, {
      type: "advanceBatch",
      batchId: "batch-peach-chardonnay",
      date: "2026-08-30",
    });

    expect(racked.batches.find((batch) => batch.id === "batch-peach-chardonnay")?.currentPhase).toBe("Racked");
    expect(bottled.batches.find((batch) => batch.id === "batch-peach-chardonnay")?.currentPhase).toBe("Bottled");
  });

  it("does not advance an already bottled batch", () => {
    const state = createSeedData();
    const next = wineClubReducer(state, {
      type: "advanceBatch",
      batchId: "batch-elderberry-merlot",
      date: "2026-09-01",
    });

    expect(next).toBe(state);
  });

  it("stores a numeric cellar reading against its batch", () => {
    const state = createSeedData();
    const next = wineClubReducer(state, {
      type: "addReading",
      id: "reading-test",
      reading: {
        batchId: "batch-blackberry-cabernet",
        date: "2026-07-13",
        stage: "After racking",
        specificGravity: 0.996,
        temperatureF: 67.5,
        ph: 3.41,
        notes: "Stable and clear",
      },
    });

    expect(next.readings[0]).toMatchObject({
      id: "reading-test",
      specificGravity: 0.996,
      temperatureF: 67.5,
      ph: 3.41,
    });
  });

  it("stores a dated addition with its amount, unit, and agent", () => {
    const state = createSeedData();
    const next = wineClubReducer(state, {
      type: "addAddition",
      id: "addition-test",
      addition: {
        batchId: "batch-blackberry-cabernet",
        date: "2026-07-14",
        agent: "Potassium metabisulfite",
        amount: 0.25,
        unit: "tsp",
        notes: "Added after racking",
      },
    });

    expect(next.additions[0]).toMatchObject({
      id: "addition-test",
      date: "2026-07-14",
      agent: "Potassium metabisulfite",
      amount: 0.25,
      unit: "tsp",
    });
  });

  it("stores a meeting with attendees and general notes", () => {
    const state = createSeedData();
    const next = wineClubReducer(state, {
      type: "addMeeting",
      id: "meeting-test",
      meeting: {
        date: "2026-07-21",
        title: "Tuesday tasting",
        attendees: ["Maya", "Jordan", "Sam"],
        notes: "Taste the new batch and plan bottling day.",
      },
    });

    expect(next.meetings[0]).toMatchObject({
      id: "meeting-test",
      attendees: ["Maya", "Jordan", "Sam"],
      notes: "Taste the new batch and plan bottling day.",
    });
  });
});
