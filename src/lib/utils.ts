import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatTimestamp(date: Date | string | number, locale: "ar" | "en"): string {
  const d = new Date(date);
  return d.toLocaleString(locale === "ar" ? "ar-PS" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function shortDate(date: Date | string | number, locale: "ar" | "en"): string {
  const d = new Date(date);
  return d.toLocaleDateString(locale === "ar" ? "ar-PS" : "en-US", {
    month: "short",
    day: "numeric",
  });
}

export function relativeDay(date: Date | string | number, locale: "ar" | "en"): string {
  const d = new Date(date);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diff <= 0) return locale === "ar" ? "اليوم" : "Today";
  if (diff === 1) return locale === "ar" ? "أمس" : "Yesterday";
  if (diff < 7) return locale === "ar" ? `قبل ${diff} أيام` : `${diff} days ago`;
  return shortDate(d, locale);
}
