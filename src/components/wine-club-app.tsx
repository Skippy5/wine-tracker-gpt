"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, HardDrive } from "lucide-react";

import { ActivityView } from "@/components/activity/activity-view";
import { BatchesView } from "@/components/batches/batches-view";
import { PourChoicesWordmark } from "@/components/brand/brand-mark";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { QuickLogSheet, type LogMode } from "@/components/logging/quick-log-sheet";
import { MeetingsView } from "@/components/meetings/meetings-view";
import { BottomNav, type AppView } from "@/components/navigation/bottom-nav";
import { useWineClub } from "@/context/wine-club-provider";

export function WineClubApp() {
  const { hydrated } = useWineClub();
  const [activeView, setActiveView] = useState<AppView>("home");
  const [logOpen, setLogOpen] = useState(false);
  const [logMode, setLogMode] = useState<LogMode>("menu");
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const openLog = useCallback((mode: LogMode = "menu") => {
    setLogMode(mode);
    setLogOpen(true);
  }, []);

  const navigate = (view: AppView) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="mx-auto min-h-dvh w-full max-w-6xl px-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))] sm:px-6 lg:px-10 lg:pb-12 lg:pl-36">
        <header className="mb-8 flex min-h-14 items-center justify-between gap-4">
          <PourChoicesWordmark compact />
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full bg-white px-3 py-2 text-[0.68rem] font-bold text-stone-500 shadow-sm sm:flex">
              <HardDrive aria-hidden="true" size={14} />
              {hydrated ? "Saved on this device" : "Opening cellar…"}
            </span>
            <div aria-label="Pour Choices club profile" className="grid h-11 w-11 place-items-center rounded-full bg-apricot-200 text-xs font-black text-wine-900 ring-4 ring-white">
              PC
            </div>
          </div>
        </header>

        <main>
          {activeView === "home" && <DashboardView onNavigate={navigate} onQuickLog={() => openLog()} />}
          {activeView === "batches" && <BatchesView onAddBatch={() => openLog("batch")} />}
          {activeView === "meetings" && <MeetingsView onAddMeeting={() => openLog("meeting")} />}
          {activeView === "activity" && <ActivityView onQuickLog={() => openLog()} />}
        </main>
      </div>

      <BottomNav activeView={activeView} onChange={navigate} onQuickLog={() => openLog()} />
      {logOpen && (
        <QuickLogSheet
          initialMode={logMode}
          onClose={() => setLogOpen(false)}
          onSaved={setToast}
          open
        />
      )}

      {toast && (
        <div
          aria-live="polite"
          className="toast-enter fixed left-1/2 top-[calc(1rem+env(safe-area-inset-top))] z-[60] flex min-h-12 -translate-x-1/2 items-center gap-2 rounded-full bg-wine-950 px-4 py-2 text-sm font-bold text-white shadow-2xl"
          role="status"
        >
          <span className="grid h-6 w-6 place-items-center rounded-full bg-sage-300 text-sage-900">
            <Check aria-hidden="true" size={14} strokeWidth={3} />
          </span>
          {toast}
        </div>
      )}
    </>
  );
}
