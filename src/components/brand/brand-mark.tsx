interface BrandMarkProps {
  size?: number;
  className?: string;
}

export function BrandMark({ size = 44, className = "" }: BrandMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      height={size}
      viewBox="0 0 64 64"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="64" height="64" rx="20" fill="#5d1835" />
      <path
        d="M18 15h28l-2.3 14.2c-1 6.1-5.4 10.8-11.1 11.6V49h7.2a2.5 2.5 0 0 1 0 5H24.2a2.5 2.5 0 0 1 0-5h7.2v-8.2c-5.7-.8-10.1-5.5-11.1-11.6L18 15Z"
        fill="#fffaf5"
      />
      <path
        d="M21.4 26h21.2l-.4 2.4c-.9 5.4-5.1 9.3-10.2 9.3s-9.3-3.9-10.2-9.3l-.4-2.4Z"
        fill="#d87982"
      />
      <circle cx="27" cy="20.5" r="2" fill="#d87982" />
      <circle cx="33" cy="22" r="1.6" fill="#d87982" />
      <circle cx="38" cy="19.5" r="1.8" fill="#d87982" />
    </svg>
  );
}

export function PourChoicesWordmark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <BrandMark size={compact ? 40 : 48} />
      <div className="leading-none">
        <p className="font-display text-[1.25rem] font-semibold tracking-[-0.03em] text-wine-950">
          Pour Choices
        </p>
        {!compact && (
          <p className="mt-1 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-wine-600">
            Wine club cellar
          </p>
        )}
      </div>
    </div>
  );
}
