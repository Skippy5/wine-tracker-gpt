import type { WineStyle } from "@/types/wine";

const liquidColors: Record<WineStyle, string> = {
  Red: "#6b1739",
  White: "#d7aa57",
  Rosé: "#dc7f86",
  Fruit: "#7b294d",
  Other: "#8f6758",
};

export function BottleArt({ style, className = "" }: { style: WineStyle; className?: string }) {
  const liquid = liquidColors[style];
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 72 164"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`glass-${style}`} x1="0" x2="1">
          <stop stopColor="#fff" stopOpacity=".78" />
          <stop offset=".5" stopColor="#eadfd5" stopOpacity=".18" />
          <stop offset="1" stopColor="#fff" stopOpacity=".55" />
        </linearGradient>
      </defs>
      <path
        d="M27 5h18v31c0 6 2 10 7 15 8 8 13 21 13 34v65c0 5-4 9-9 9H16c-5 0-9-4-9-9V85c0-13 5-26 13-34 5-5 7-9 7-15V5Z"
        fill="#2d2420"
      />
      <path d="M10 80h52v70c0 3-3 6-6 6H16c-3 0-6-3-6-6V80Z" fill={liquid} />
      <path d="M27 8h18v18H27z" fill="#d9bf86" />
      <path
        d="M18 91h36v43c0 3-2 5-5 5H23c-3 0-5-2-5-5V91Z"
        fill="#f8eee4"
      />
      <path d="M23 100h26v3H23zM26 109h20v2H26zM29 116h14v2H29z" fill="#7b294d" />
      <path
        d="M17 55c-5 8-7 19-7 30v64c0 3 2 6 6 6h5V70c0-14 3-23 9-31V8h-3v28c0 6-3 13-10 19Z"
        fill={`url(#glass-${style})`}
      />
    </svg>
  );
}
