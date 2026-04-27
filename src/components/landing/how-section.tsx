"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/i18n/provider";

export function HowSection() {
  const { t } = useI18n();
  const { howTitle, howSub, howSteps } = t.landing.sections;

  return (
    <section className="relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-olive-50/60 to-transparent dark:from-olive-900/20" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{howTitle}</h2>
          <p className="mt-3 text-muted">{howSub}</p>
        </div>
        <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4 relative">
          {howSteps.map((s, i) => (
            <motion.li
              key={s.n}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              whileHover={{ y: -3, scale: 1.02 }}
              className="rounded-2xl border bg-white/60 dark:bg-olive-950/60 p-5 cursor-default"
            >
              <motion.div
                className="text-xs font-mono accent-text"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
              >
                {s.n}
              </motion.div>
              <h3 className="mt-2 font-semibold">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted">{s.body}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
