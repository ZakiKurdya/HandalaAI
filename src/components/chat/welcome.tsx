"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useI18n } from "@/i18n/provider";

export function ChatWelcome({ onPick }: { onPick: (s: string) => void }) {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.88 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="inline-block"
      >
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [0, -1.5, 1.5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.1, rotate: -3 }}
        >
          <Image
            src="/handala-character.png"
            alt="Handala"
            width={120}
            height={145}
            className="mx-auto object-contain drop-shadow-xl"
            priority
          />
        </motion.div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="mt-5 text-2xl font-semibold tracking-tight"
      >
        {t.chat.welcomeTitle}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.18 }}
        className="mt-1 text-sm text-muted"
      >
        {t.chat.welcomeSub}
      </motion.p>

      <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
        {t.chat.starters.map((s, i) => (
          <motion.button
            key={s}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, delay: 0.22 + i * 0.06 }}
            whileHover={{ scale: 1.02, y: -2, boxShadow: "0 4px 20px rgb(0 0 0 / 0.08)" }}
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={() => onPick(s)}
            className="text-start rounded-xl border bg-white/50 dark:bg-olive-950/40 px-4 py-3 text-sm hover:border-olive-400 hover:bg-olive-50 dark:hover:bg-olive-900/40 transition-colors"
          >
            {s}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
