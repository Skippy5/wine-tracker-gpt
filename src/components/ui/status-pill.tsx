import type { BatchPhase } from "@/types/wine";

const statusStyles: Record<BatchPhase, string> = {
  Started: "bg-apricot-100 text-apricot-800",
  Racked: "bg-wine-100 text-wine-800",
  Bottled: "bg-sage-100 text-sage-800",
};

export function StatusPill({ phase }: { phase: BatchPhase }) {
  return (
    <span className={`inline-flex min-h-7 items-center rounded-full px-3 text-xs font-extrabold ${statusStyles[phase]}`}>
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {phase}
    </span>
  );
}
