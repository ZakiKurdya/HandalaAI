import { cn } from "@/lib/utils";

export function OliveBranch({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 80"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className={cn("text-olive-600 dark:text-olive-400", className)}
      aria-hidden
    >
      <path
        d="M5 60 C 50 30, 110 25, 195 20"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {[
        [25, 50, -25],
        [50, 42, -18],
        [75, 36, -12],
        [100, 32, -8],
        [125, 28, -5],
        [150, 25, -3],
        [175, 22, 0],
      ].map(([x, y, rot], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${rot})`}>
          <ellipse cx="0" cy="-7" rx="4" ry="9" fill="currentColor" opacity="0.85" />
          <ellipse cx="0" cy="7" rx="4" ry="9" fill="currentColor" opacity="0.55" />
        </g>
      ))}
      <circle cx="80" cy="50" r="3" className="fill-olive-800 dark:fill-olive-300" />
      <circle cx="120" cy="44" r="3" className="fill-olive-800 dark:fill-olive-300" />
      <circle cx="160" cy="36" r="3" className="fill-olive-800 dark:fill-olive-300" />
    </svg>
  );
}
