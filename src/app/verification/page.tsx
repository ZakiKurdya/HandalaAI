"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { TatreezDivider } from "@/components/patterns/tatreez-divider";

export default function VerificationPage() {
  const { t } = useI18n();
  return (
    <>
      {/* Decorative olive-branch background */}
      <img
        src="/olive-branch-light.png"
        alt=""
        aria-hidden
        className="pointer-events-none select-none fixed inset-0 w-full h-full object-cover opacity-[0.06] dark:opacity-[0.04] -z-10"
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{t.verification.title}</h1>
        <p className="mt-2 text-muted max-w-2xl">{t.verification.sub}</p>

        <TatreezDivider className="my-6 h-3" />

        <ol className="relative space-y-4 mt-8 before:content-[''] before:absolute before:top-2 before:bottom-2 before:start-[19px] before:w-px before:bg-olive-200 dark:before:bg-olive-800">
          {t.verification.steps.map((s, i) => (
            <motion.li
              key={s.n}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="relative ps-14"
            >
              <span className="absolute start-0 top-0 h-10 w-10 rounded-full bg-olive-100 dark:bg-olive-900/60 text-olive-800 dark:text-olive-100 text-sm font-mono inline-flex items-center justify-center ring-4 ring-[rgb(var(--background))]">
                {s.n}
              </span>
              <div className="rounded-2xl border bg-white/60 dark:bg-olive-950/60 p-5">
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted leading-relaxed">{s.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>

        <section className="mt-12 rounded-2xl border border-carmine-500/30 bg-carmine-500/5 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 carmine-text shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold">{t.verification.flagsTitle}</h2>
              <p className="mt-1.5 text-sm leading-relaxed">{t.verification.flagsBody}</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
