"use client";

import { Languages } from "lucide-react";
import { useI18n } from "@/i18n/provider";

export function LanguageToggle() {
  const { t, toggleLocale } = useI18n();
  return (
    <button
      type="button"
      onClick={toggleLocale}
      className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full muted-surface ring-soft text-xs font-medium hover:bg-olive-100 dark:hover:bg-olive-900/40 focus-ring"
    >
      <Languages className="h-3.5 w-3.5" />
      <span>{t.common.languageToggle}</span>
    </button>
  );
}
