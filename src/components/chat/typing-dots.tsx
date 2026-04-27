export function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-label="typing">
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse-dot" style={{ animationDelay: "0ms" }} />
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse-dot" style={{ animationDelay: "150ms" }} />
      <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse-dot" style={{ animationDelay: "300ms" }} />
    </span>
  );
}
