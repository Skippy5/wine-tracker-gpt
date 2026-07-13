"use client";

import { useState, type FormEvent } from "react";
import { ArrowLeft, CalendarDays, Droplets, FlaskConical, Wine } from "lucide-react";

import { Field, PrimaryButton, fieldClassName, textAreaClassName } from "@/components/ui/form-controls";
import { Sheet } from "@/components/ui/sheet";
import { useWineClub } from "@/context/wine-club-provider";
import { getTodayInputValue } from "@/lib/date";
import type { WineStyle } from "@/types/wine";

export type LogMode = "menu" | "reading" | "addition" | "meeting" | "batch";

interface QuickLogSheetProps {
  open: boolean;
  initialMode?: LogMode;
  onClose: () => void;
  onSaved: (message: string) => void;
}

const menuItems = [
  {
    id: "reading" as const,
    title: "Cellar reading",
    detail: "Specific gravity, temperature & pH",
    icon: FlaskConical,
    className: "bg-apricot-100 text-apricot-900",
  },
  {
    id: "addition" as const,
    title: "Batch addition",
    detail: "Yeast, sulfites, enzymes & more",
    icon: Droplets,
    className: "bg-sage-100 text-sage-900",
  },
  {
    id: "meeting" as const,
    title: "Club meeting",
    detail: "Date, members and general notes",
    icon: CalendarDays,
    className: "bg-rose-100 text-wine-900",
  },
  {
    id: "batch" as const,
    title: "New batch",
    detail: "Start a new cellar lifecycle",
    icon: Wine,
    className: "bg-wine-100 text-wine-900",
  },
];

export function QuickLogSheet({ open, initialMode = "menu", onClose, onSaved }: QuickLogSheetProps) {
  const [mode, setMode] = useState<LogMode>(initialMode);

  const finish = (message: string) => {
    onSaved(message);
    onClose();
  };

  const titles: Record<LogMode, string> = {
    menu: "What are we pouring in?",
    reading: "Log a reading",
    addition: "Log an addition",
    meeting: "Log a meeting",
    batch: "Start a new batch",
  };

  return (
    <Sheet eyebrow="Quick log" onClose={onClose} open={open} title={titles[mode]}>
      {mode === "menu" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className="flex min-h-24 items-center gap-4 rounded-[1.5rem] bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 active:scale-[0.98] sm:flex-col sm:items-start"
                key={item.id}
                onClick={() => setMode(item.id)}
                type="button"
              >
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${item.className}`}>
                  <Icon aria-hidden="true" size={20} />
                </span>
                <span>
                  <strong className="block text-sm font-extrabold text-wine-950">{item.title}</strong>
                  <span className="mt-1 block text-xs leading-5 text-stone-500">{item.detail}</span>
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <div>
          <button
            className="mb-5 inline-flex min-h-11 items-center gap-2 rounded-full px-2 text-sm font-extrabold text-wine-700"
            onClick={() => setMode("menu")}
            type="button"
          >
            <ArrowLeft aria-hidden="true" size={17} /> Choose another
          </button>
          {mode === "reading" && <ReadingForm onSaved={() => finish("Reading saved to the cellar log.")} />}
          {mode === "addition" && <AdditionForm onSaved={() => finish("Addition saved to the batch.")} />}
          {mode === "meeting" && <MeetingForm onSaved={() => finish("Meeting saved for the club.")} />}
          {mode === "batch" && <BatchForm onSaved={() => finish("New batch started. Cheers!")} />}
        </div>
      )}
    </Sheet>
  );
}

function ReadingForm({ onSaved }: { onSaved: () => void }) {
  const { state, addReading } = useWineClub();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    addReading({
      batchId: String(data.get("batchId")),
      date: String(data.get("date")),
      stage: String(data.get("stage")),
      specificGravity: Number(data.get("specificGravity")),
      temperatureF: Number(data.get("temperatureF")),
      ph: Number(data.get("ph")),
      notes: String(data.get("notes")),
    });
    onSaved();
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <BatchSelect batches={state.batches} />
      <div className="grid grid-cols-2 gap-3">
        <Field htmlFor="reading-date" label="Date">
          <input className={fieldClassName} defaultValue={getTodayInputValue()} id="reading-date" name="date" required type="date" />
        </Field>
        <Field htmlFor="reading-stage" label="Stage">
          <select className={fieldClassName} defaultValue="Primary fermentation" id="reading-stage" name="stage" required>
            <option>Initial must</option>
            <option>Primary fermentation</option>
            <option>After racking</option>
            <option>Pre-bottling</option>
            <option>Aging</option>
          </select>
        </Field>
      </div>
      <div className="rounded-[1.5rem] bg-wine-100 p-4">
        <Field hint="Usually 0.990–1.120" htmlFor="specific-gravity" label="Specific gravity (SG)">
          <input
            autoFocus
            className={`${fieldClassName} font-mono text-xl font-bold tabular-nums`}
            id="specific-gravity"
            inputMode="decimal"
            max="1.3"
            min="0.8"
            name="specificGravity"
            placeholder="1.050"
            required
            step="0.001"
            type="number"
          />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field htmlFor="temperature" label="Temperature" hint="°F">
          <input className={fieldClassName} id="temperature" inputMode="decimal" max="120" min="30" name="temperatureF" placeholder="68" required step="0.1" type="number" />
        </Field>
        <Field htmlFor="ph" label="pH" hint="2.00–5.00">
          <input className={fieldClassName} id="ph" inputMode="decimal" max="5" min="2" name="ph" placeholder="3.40" required step="0.01" type="number" />
        </Field>
      </div>
      <Field htmlFor="reading-notes" label="Notes" hint="Optional">
        <textarea className={textAreaClassName} id="reading-notes" name="notes" placeholder="Clarity, aroma, airlock activity…" />
      </Field>
      <PrimaryButton className="w-full" type="submit">Save reading</PrimaryButton>
    </form>
  );
}

function AdditionForm({ onSaved }: { onSaved: () => void }) {
  const { state, addAddition } = useWineClub();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    addAddition({
      batchId: String(data.get("batchId")),
      date: String(data.get("date")),
      agent: String(data.get("agent")),
      amount: Number(data.get("amount")),
      unit: String(data.get("unit")),
      notes: String(data.get("notes")),
    });
    onSaved();
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <BatchSelect batches={state.batches} />
      <Field htmlFor="addition-agent" label="Agent or chemical">
        <input className={fieldClassName} id="addition-agent" list="common-agents" name="agent" placeholder="e.g. Potassium metabisulfite" required />
        <datalist id="common-agents">
          <option value="Wine yeast" />
          <option value="Potassium metabisulfite" />
          <option value="Pectic enzyme" />
          <option value="Yeast nutrient" />
          <option value="Potassium sorbate" />
          <option value="Bentonite" />
          <option value="Tannin" />
          <option value="Acid blend" />
        </datalist>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field htmlFor="addition-amount" label="Amount">
          <input className={fieldClassName} id="addition-amount" inputMode="decimal" min="0.001" name="amount" placeholder="2.5" required step="0.001" type="number" />
        </Field>
        <Field htmlFor="addition-unit" label="Unit">
          <select className={fieldClassName} defaultValue="tsp" id="addition-unit" name="unit" required>
            <option value="tsp">tsp</option>
            <option value="tbsp">tbsp</option>
            <option value="g">grams</option>
            <option value="mL">mL</option>
            <option value="oz">ounces</option>
            <option value="packet">packet</option>
            <option value="ppm">ppm</option>
          </select>
        </Field>
      </div>
      <Field htmlFor="addition-date" label="Date added">
        <input className={fieldClassName} defaultValue={getTodayInputValue()} id="addition-date" name="date" required type="date" />
      </Field>
      <Field htmlFor="addition-notes" label="Notes" hint="Optional">
        <textarea className={textAreaClassName} id="addition-notes" name="notes" placeholder="Why it was added, preparation details…" />
      </Field>
      <PrimaryButton className="w-full" type="submit">Save addition</PrimaryButton>
    </form>
  );
}

function MeetingForm({ onSaved }: { onSaved: () => void }) {
  const { addMeeting } = useWineClub();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const attendees = String(data.get("attendees"))
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean);
    addMeeting({
      date: String(data.get("date")),
      title: String(data.get("title")),
      attendees,
      notes: String(data.get("notes")),
    });
    onSaved();
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Field htmlFor="meeting-title" label="Meeting name">
        <input className={fieldClassName} id="meeting-title" name="title" placeholder="e.g. August tasting night" required />
      </Field>
      <Field htmlFor="meeting-date" label="Date">
        <input className={fieldClassName} defaultValue={getTodayInputValue()} id="meeting-date" name="date" required type="date" />
      </Field>
      <Field hint="Separate names with commas" htmlFor="meeting-attendees" label="Attendees">
        <input className={fieldClassName} id="meeting-attendees" name="attendees" placeholder="Maya, Jordan, Alex" required />
      </Field>
      <Field htmlFor="meeting-notes" label="General notes">
        <textarea className={textAreaClassName} id="meeting-notes" name="notes" placeholder="What did the club taste, decide, or plan?" required />
      </Field>
      <PrimaryButton className="w-full" type="submit">Save meeting</PrimaryButton>
    </form>
  );
}

function BatchForm({ onSaved }: { onSaved: () => void }) {
  const { addBatch } = useWineClub();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    addBatch({
      name: String(data.get("name")),
      varietal: String(data.get("varietal")),
      style: String(data.get("style")) as WineStyle,
      volumeGallons: Number(data.get("volumeGallons")),
      startDate: String(data.get("startDate")),
      notes: String(data.get("notes")),
    });
    onSaved();
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Field htmlFor="batch-name" label="Batch nickname">
        <input className={fieldClassName} id="batch-name" name="name" placeholder="e.g. Sunday Best" required />
      </Field>
      <Field htmlFor="batch-varietal" label="Varietal or recipe">
        <input className={fieldClassName} id="batch-varietal" name="varietal" placeholder="e.g. Blackberry Cabernet" required />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field htmlFor="batch-style" label="Style">
          <select className={fieldClassName} defaultValue="Red" id="batch-style" name="style" required>
            <option>Red</option>
            <option>White</option>
            <option>Rosé</option>
            <option>Fruit</option>
            <option>Other</option>
          </select>
        </Field>
        <Field htmlFor="batch-volume" label="Volume" hint="gallons">
          <input className={fieldClassName} defaultValue="6" id="batch-volume" inputMode="decimal" min="0.1" name="volumeGallons" required step="0.1" type="number" />
        </Field>
      </div>
      <Field htmlFor="batch-start-date" label="Start date">
        <input className={fieldClassName} defaultValue={getTodayInputValue()} id="batch-start-date" name="startDate" required type="date" />
      </Field>
      <Field htmlFor="batch-notes" label="Notes" hint="Optional">
        <textarea className={textAreaClassName} id="batch-notes" name="notes" placeholder="Recipe source, goals, special instructions…" />
      </Field>
      <PrimaryButton className="w-full" type="submit">Start batch</PrimaryButton>
    </form>
  );
}

function BatchSelect({ batches }: { batches: { id: string; name: string; currentPhase: string }[] }) {
  const activeBatches = batches.filter((batch) => batch.currentPhase !== "Bottled");
  const options = activeBatches.length > 0 ? activeBatches : batches;
  return (
    <Field htmlFor="log-batch" label="Batch">
      <select className={fieldClassName} id="log-batch" name="batchId" required>
        {options.map((batch) => (
          <option key={batch.id} value={batch.id}>
            {batch.name}
          </option>
        ))}
      </select>
    </Field>
  );
}
