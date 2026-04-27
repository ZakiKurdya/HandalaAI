"use client";

import { Square } from "lucide-react";
import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

function VictoryIcon() {
  return (
    <>
      <img src="/peace-black.png" alt="" aria-hidden className="h-5 w-5 object-contain dark:hidden" />
      <img src="/peace-white.png" alt="" aria-hidden className="h-5 w-5 object-contain hidden dark:block" />
    </>
  );
}

export function Composer({
  value,
  onChange,
  onSubmit,
  onStop,
  isStreaming,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onStop?: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}) {
  const { t } = useI18n();
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [value]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) onSubmit();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!disabled && value.trim()) onSubmit();
      }}
      className={cn(
        "relative flex items-end gap-2 rounded-2xl border bg-white/80 dark:bg-olive-950/80 backdrop-blur p-2.5 shadow-sm transition-shadow",
        "focus-within:border-olive-400 dark:focus-within:border-olive-500 focus-within:shadow-md"
      )}
    >
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKey}
        placeholder={t.chat.placeholder}
        rows={1}
        disabled={disabled || isStreaming}
        className="flex-1 resize-none bg-transparent px-3 py-2 text-[15px] outline-none placeholder:text-muted scrollbar-thin disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {isStreaming ? (
        <motion.button
          type="button"
          onClick={onStop}
          aria-label={t.chat.stop}
          whileTap={{ scale: 0.92 }}
          className="h-10 w-10 inline-flex items-center justify-center rounded-xl bg-carmine-600 text-sand-50 hover:bg-carmine-700 focus-ring"
        >
          <Square className="h-4 w-4" />
        </motion.button>
      ) : (
        <motion.button
          type="submit"
          disabled={disabled || !value.trim()}
          aria-label={t.chat.send}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9, rotate: -5 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          className="h-10 w-10 inline-flex items-center justify-center rounded-xl bg-olive-700 text-sand-50 hover:bg-olive-800 dark:bg-olive-400 dark:text-olive-950 dark:hover:bg-olive-300 disabled:bg-olive-700/40 dark:disabled:bg-olive-400/40 disabled:pointer-events-none focus-ring"
        >
          <VictoryIcon />
        </motion.button>
      )}
    </form>
  );
}
