import { CalendarDays, FlaskConical, Home, ListPlus, Wine } from "lucide-react";

export type AppView = "home" | "batches" | "meetings" | "activity";

interface BottomNavProps {
  activeView: AppView;
  onChange: (view: AppView) => void;
  onQuickLog: () => void;
}

const items = [
  { id: "home" as const, label: "Home", icon: Home },
  { id: "batches" as const, label: "Batches", icon: Wine },
  { id: "meetings" as const, label: "Meetings", icon: CalendarDays },
  { id: "activity" as const, label: "Records", icon: FlaskConical },
];

export function BottomNav({ activeView, onChange, onQuickLog }: BottomNavProps) {
  return (
    <nav
      aria-label="Primary navigation"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-wine-950/8 bg-cream-50/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:inset-x-auto lg:bottom-auto lg:left-6 lg:top-1/2 lg:w-24 lg:-translate-y-1/2 lg:rounded-[2rem] lg:border lg:pb-3 lg:pt-3 lg:shadow-xl"
    >
      <div className="mx-auto grid h-[4.5rem] max-w-xl grid-cols-5 items-center px-2 lg:h-auto lg:grid-cols-1 lg:gap-1 lg:px-3">
        {items.slice(0, 2).map((item) => (
          <NavButton key={item.id} item={item} active={activeView === item.id} onChange={onChange} />
        ))}
        <button
          aria-label="Open quick log"
          className="mx-auto -mt-7 grid h-14 w-14 place-items-center rounded-full border-[5px] border-cream-50 bg-wine-800 text-white shadow-[0_8px_24px_rgba(93,24,53,0.28)] transition hover:bg-wine-900 active:scale-95 lg:order-last lg:mt-1 lg:border-0"
          onClick={onQuickLog}
          type="button"
        >
          <ListPlus aria-hidden="true" size={24} strokeWidth={2.4} />
        </button>
        {items.slice(2).map((item) => (
          <NavButton key={item.id} item={item} active={activeView === item.id} onChange={onChange} />
        ))}
      </div>
    </nav>
  );
}

function NavButton({
  item,
  active,
  onChange,
}: {
  item: (typeof items)[number];
  active: boolean;
  onChange: (view: AppView) => void;
}) {
  const Icon = item.icon;
  return (
    <button
      aria-current={active ? "page" : undefined}
      className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[0.65rem] font-bold transition active:scale-95 lg:min-h-16 ${
        active ? "text-wine-800" : "text-stone-500 hover:text-wine-800"
      }`}
      onClick={() => onChange(item.id)}
      type="button"
    >
      <Icon aria-hidden="true" fill={active ? "currentColor" : "none"} size={20} strokeWidth={active ? 2.2 : 1.8} />
      {item.label}
    </button>
  );
}
