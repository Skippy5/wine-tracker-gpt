"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Calendar, ChevronRight, Plus, Ruler, Sparkles } from "lucide-react";

import { BottleArt } from "@/components/brand/bottle-art";
import { PrimaryButton, fieldClassName } from "@/components/ui/form-controls";
import { Sheet } from "@/components/ui/sheet";
import { StatusPill } from "@/components/ui/status-pill";
import { useWineClub } from "@/context/wine-club-provider";
import { formatDate, formatShortDate, getTodayInputValue } from "@/lib/date";
import { BATCH_PHASES, type BatchPhase } from "@/types/wine";

type BatchFilter = "All" | "Active" | "Bottled";

interface BatchesViewProps {
  onAddBatch: () => void;
}

export function BatchesView({ onAddBatch }: BatchesViewProps) {
  const { state, advanceBatch } = useWineClub();
  const [filter, setFilter] = useState<BatchFilter>("All");
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [advanceDate, setAdvanceDate] = useState(getTodayInputValue);

  const batches = useMemo(
    () =>
      state.batches.filter((batch) => {
        if (filter === "Active") return batch.currentPhase !== "Bottled";
        if (filter === "Bottled") return batch.currentPhase === "Bottled";
        return true;
      }),
    [filter, state.batches],
  );
  const selectedBatch = state.batches.find((batch) => batch.id === selectedBatchId) ?? null;
  const selectedReadings = state.readings
    .filter((reading) => reading.batchId === selectedBatchId)
    .sort((a, b) => b.date.localeCompare(a.date));
  const selectedAdditions = state.additions
    .filter((addition) => addition.batchId === selectedBatchId)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="section-kicker">From must to bottle</p>
          <h1 className="page-title">Our batches</h1>
          <p className="mt-2 text-sm text-stone-500">Every pour has a paper trail.</p>
        </div>
        <button
          aria-label="Start a new batch"
          className="grid min-h-12 min-w-12 place-items-center rounded-2xl bg-wine-800 text-white shadow-lg transition active:scale-95"
          onClick={onAddBatch}
          type="button"
        >
          <Plus aria-hidden="true" size={22} />
        </button>
      </header>

      <div aria-label="Filter batches" className="flex gap-2 overflow-x-auto pb-1" role="group">
        {(["All", "Active", "Bottled"] as BatchFilter[]).map((item) => (
          <button
            aria-pressed={filter === item}
            className={`min-h-11 shrink-0 rounded-full px-5 text-sm font-extrabold transition ${
              filter === item ? "bg-wine-900 text-white" : "bg-white text-stone-500 shadow-sm"
            }`}
            key={item}
            onClick={() => setFilter(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {batches.map((batch) => {
          const batchReadings = state.readings
            .filter((reading) => reading.batchId === batch.id)
            .sort((a, b) => b.date.localeCompare(a.date));
          const latestReading = batchReadings[0];
          return (
            <article className="overflow-hidden rounded-[1.9rem] bg-white shadow-card" key={batch.id}>
              <button
                className="relative flex min-h-48 w-full overflow-hidden p-5 text-left transition hover:bg-cream-50 active:bg-cream-100"
                onClick={() => setSelectedBatchId(batch.id)}
                type="button"
              >
                <div className="relative z-10 min-w-0 flex-1 pr-20">
                  <StatusPill phase={batch.currentPhase} />
                  <h2 className="mt-4 truncate font-display text-[1.65rem] font-semibold tracking-[-0.035em] text-wine-950">
                    {batch.name}
                  </h2>
                  <p className="mt-1 truncate text-sm font-medium text-stone-500">{batch.varietal}</p>
                  <div className="mt-5 flex items-center gap-4 text-xs font-bold text-stone-500">
                    <span className="inline-flex items-center gap-1.5">
                      <Ruler aria-hidden="true" size={14} /> {batch.volumeGallons} gal
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar aria-hidden="true" size={14} /> {formatShortDate(batch.createdAt)}
                    </span>
                  </div>
                </div>
                <BottleArt className="absolute -bottom-5 right-4 h-44 w-20 rotate-[4deg] drop-shadow-xl" style={batch.style} />
              </button>
              <div className="border-t border-wine-950/6 px-5 py-4">
                <PhaseTimeline currentPhase={batch.currentPhase} />
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold text-stone-500">
                    {latestReading ? `Latest SG ${latestReading.specificGravity.toFixed(3)}` : "No readings yet"}
                  </p>
                  <button
                    className="inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-xs font-extrabold text-wine-700"
                    onClick={() => setSelectedBatchId(batch.id)}
                    type="button"
                  >
                    Details <ChevronRight aria-hidden="true" size={16} />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {batches.length === 0 && (
        <div className="rounded-[2rem] bg-white p-8 text-center shadow-card">
          <Sparkles className="mx-auto text-wine-400" size={28} />
          <h2 className="mt-3 font-display text-xl font-semibold text-wine-950">Nothing in this rack</h2>
          <p className="mt-1 text-sm text-stone-500">Try another filter or start a fresh batch.</p>
        </div>
      )}

      <Sheet
        eyebrow={selectedBatch?.varietal}
        onClose={() => setSelectedBatchId(null)}
        open={Boolean(selectedBatch)}
        title={selectedBatch?.name ?? "Batch details"}
      >
        {selectedBatch && (
          <div className="space-y-6">
            <div className="flex items-center justify-between rounded-[1.5rem] bg-white p-4 shadow-sm">
              <div>
                <StatusPill phase={selectedBatch.currentPhase} />
                <p className="mt-2 text-xs font-semibold text-stone-500">
                  Started {formatDate(selectedBatch.createdAt)} · {selectedBatch.volumeGallons} gallons
                </p>
              </div>
              <BottleArt className="h-24 w-12" style={selectedBatch.style} />
            </div>

            <div>
              <h3 className="mb-3 text-sm font-extrabold text-wine-950">Lifecycle</h3>
              <div className="space-y-3 rounded-[1.5rem] bg-white p-4">
                {BATCH_PHASES.map((phase) => {
                  const event = selectedBatch.phaseHistory.find((item) => item.phase === phase);
                  return (
                    <div className="flex items-center gap-3" key={phase}>
                      <span className={`grid h-8 w-8 place-items-center rounded-full text-xs font-black ${event ? "bg-wine-800 text-white" : "bg-stone-100 text-stone-400"}`}>
                        {BATCH_PHASES.indexOf(phase) + 1}
                      </span>
                      <div className="flex-1">
                        <p className={`text-sm font-extrabold ${event ? "text-wine-950" : "text-stone-400"}`}>{phase}</p>
                        <p className="text-xs text-stone-400">{event ? formatDate(event.date) : "Not reached yet"}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedBatch.currentPhase !== "Bottled" && (
              <div className="rounded-[1.5rem] bg-wine-100 p-4">
                <label className="mb-2 block text-sm font-extrabold text-wine-950" htmlFor="advance-date">
                  Date moved to {selectedBatch.currentPhase === "Started" ? "Racked" : "Bottled"}
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    className={fieldClassName}
                    id="advance-date"
                    onChange={(event) => setAdvanceDate(event.target.value)}
                    type="date"
                    value={advanceDate}
                  />
                  <PrimaryButton
                    className="inline-flex shrink-0 items-center justify-center gap-2"
                    onClick={() => advanceBatch(selectedBatch.id, advanceDate)}
                    type="button"
                  >
                    Advance <ArrowRight aria-hidden="true" size={17} />
                  </PrimaryButton>
                </div>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <RecordList
                empty="No readings yet"
                items={selectedReadings.map((reading) => ({
                  id: reading.id,
                  title: `SG ${reading.specificGravity.toFixed(3)}`,
                  detail: `${formatShortDate(reading.date)} · ${reading.temperatureF}°F · pH ${reading.ph.toFixed(2)}`,
                }))}
                title={`Readings (${selectedReadings.length})`}
              />
              <RecordList
                empty="No additions yet"
                items={selectedAdditions.map((addition) => ({
                  id: addition.id,
                  title: addition.agent,
                  detail: `${formatShortDate(addition.date)} · ${addition.amount} ${addition.unit}`,
                }))}
                title={`Additions (${selectedAdditions.length})`}
              />
            </div>

            {selectedBatch.notes && (
              <div>
                <h3 className="mb-2 text-sm font-extrabold text-wine-950">Cellar notes</h3>
                <p className="rounded-[1.5rem] bg-white p-4 text-sm leading-6 text-stone-600">{selectedBatch.notes}</p>
              </div>
            )}
          </div>
        )}
      </Sheet>
    </div>
  );
}

function PhaseTimeline({ currentPhase }: { currentPhase: BatchPhase }) {
  const currentIndex = BATCH_PHASES.indexOf(currentPhase);
  return (
    <div aria-label={`Batch phase: ${currentPhase}`} className="flex items-center">
      {BATCH_PHASES.map((phase, index) => (
        <div className="flex flex-1 items-center last:flex-none" key={phase}>
          <span className={`h-2.5 w-2.5 rounded-full ${index <= currentIndex ? "bg-wine-700" : "bg-stone-200"}`} />
          {index < BATCH_PHASES.length - 1 && (
            <span className={`h-0.5 flex-1 ${index < currentIndex ? "bg-wine-500" : "bg-stone-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function RecordList({
  title,
  items,
  empty,
}: {
  title: string;
  items: { id: string; title: string; detail: string }[];
  empty: string;
}) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-extrabold text-wine-950">{title}</h3>
      <div className="overflow-hidden rounded-[1.5rem] bg-white">
        {items.length === 0 ? (
          <p className="p-4 text-sm text-stone-400">{empty}</p>
        ) : (
          items.slice(0, 3).map((item, index) => (
            <div className={`p-4 ${index ? "border-t border-wine-950/6" : ""}`} key={item.id}>
              <p className="text-sm font-extrabold text-wine-950">{item.title}</p>
              <p className="mt-1 text-xs text-stone-500">{item.detail}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
