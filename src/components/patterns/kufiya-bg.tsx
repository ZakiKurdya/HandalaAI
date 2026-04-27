import { cn } from "@/lib/utils";

/** Subtle, low-opacity kufiya-inspired motif used as a background overlay. */
export function KufiyaBg({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.06] dark:opacity-[0.08] text-olive-900 dark:text-olive-200"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="kufiya" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
            <g fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M0 30 L15 15 L30 30 L45 15 L60 30" />
              <path d="M0 60 L15 45 L30 60 L45 45 L60 60" />
              <path d="M0 0 L15 -15 L30 0 L45 -15 L60 0" />
              <path d="M30 0 L30 60" strokeDasharray="2 4" opacity="0.4" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#kufiya)" />
      </svg>
    </div>
  );
}
