"use client";

import { useI18n } from "@/i18n/provider";

export function OliveBranchBg() {
  const { dir } = useI18n();
  return (
    <img
      src="/olive-branch-light.png"
      alt=""
      aria-hidden
      className={`pointer-events-none select-none fixed top-0 h-full w-auto object-contain opacity-[0.07] dark:opacity-[0.05] -z-10 ${
        dir === "ltr" ? "left-0" : "right-0"
      }`}
    />
  );
}
