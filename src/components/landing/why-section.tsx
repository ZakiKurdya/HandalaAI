"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/i18n/provider";
import { ShieldCheck, Library, Languages, Sparkles } from "lucide-react";

const ICONS = [ShieldCheck, Library, Languages, Sparkles];

export function WhySection() {
  const { t } = useI18n();
  const { whyTitle, whySub, whyItems } = t.landing.sections;

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-2xl">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{whyTitle}</h2>
        <p className="mt-3 text-muted">{whySub}</p>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {whyItems.map((item, i) => {
          const Icon = ICONS[i];
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              whileHover={{ y: -4, boxShadow: "0 8px 32px rgb(0 0 0 / 0.09)" }}
              className="group relative rounded-2xl border bg-white/40 dark:bg-olive-950/40 p-5 hover:border-olive-400/70 dark:hover:border-olive-500/60 transition-colors cursor-default"
            >
              <motion.div
                whileHover={{ scale: 1.15, rotate: -6 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-olive-100 text-olive-800 dark:bg-olive-900/60 dark:text-olive-200"
              >
                <Icon className="h-5 w-5" />
              </motion.div>
              <h3 className="mt-4 font-semibold">{item.title}</h3>
              <p className="mt-1.5 text-sm text-muted leading-relaxed">{item.body}</p>
              <div className="absolute inset-0 rounded-2xl ring-1 ring-olive-400/0 group-hover:ring-olive-400/40 dark:group-hover:ring-olive-500/40 transition-all duration-200 pointer-events-none" />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
