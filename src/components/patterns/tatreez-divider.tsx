import { cn } from "@/lib/utils";

export function TatreezDivider({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className={cn("text-olive-700 dark:text-olive-400 opacity-70", className)}
      aria-hidden
      preserveAspectRatio="none"
    >
      <g stroke="currentColor" strokeWidth="1">
        {Array.from({ length: 12 }).map((_, i) => {
          const x = 10 + i * 20;
          return (
            <g key={i}>
              <path d={`M${x} 0 L${x + 4} 6 L${x + 8} 0 L${x + 12} 6 L${x + 16} 0`} />
              <path d={`M${x} 16 L${x + 4} 10 L${x + 8} 16 L${x + 12} 10 L${x + 16} 16`} />
              <circle cx={x + 8} cy="8" r="1.4" fill="currentColor" />
            </g>
          );
        })}
      </g>
    </svg>
  );
}
