"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function HandalaMark({ className }: { className?: string }) {
  return (
    <motion.span
      whileHover={{ scale: 1.08, rotate: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn("inline-block relative", className)}
    >
      <Image
        src="/handala-character.png"
        alt="Handala"
        width={48}
        height={58}
        className="object-contain drop-shadow-md"
        priority
      />
    </motion.span>
  );
}

export function HandalaWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <HandalaMark className="h-11 w-9" />
      <span className="flex flex-col leading-none">
        <span className="font-display font-bold text-lg tracking-tight">Handala</span>
        <span className="font-arabic text-sm text-muted tracking-wide">حنظلة</span>
      </span>
    </span>
  );
}
