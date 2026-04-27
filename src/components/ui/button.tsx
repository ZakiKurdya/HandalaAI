"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-olive-700 text-sand-50 hover:bg-olive-800 dark:bg-olive-400 dark:text-olive-950 dark:hover:bg-olive-300 shadow-sm",
  secondary:
    "bg-olive-100 text-olive-900 hover:bg-olive-200 dark:bg-olive-900/40 dark:text-olive-100 dark:hover:bg-olive-900/60",
  ghost:
    "text-current hover:bg-olive-100/70 dark:hover:bg-olive-900/40",
  outline:
    "border border-olive-300 text-olive-900 hover:bg-olive-50 dark:border-olive-700 dark:text-olive-100 dark:hover:bg-olive-900/40",
  danger:
    "bg-carmine-600 text-sand-50 hover:bg-carmine-700",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-sm rounded-lg",
  md: "h-10 px-4 text-sm rounded-xl",
  lg: "h-12 px-6 text-base rounded-2xl",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "primary", size = "md", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all focus-ring active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
});
