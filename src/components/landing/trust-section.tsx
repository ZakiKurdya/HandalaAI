"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/i18n/provider";
import { ShieldCheck, Quote } from "lucide-react";

export function TrustSection() {
  const { t, locale } = useI18n();
  const isAr = locale === "ar";

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid gap-10 md:grid-cols-2 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">{t.landing.trust.title}</h2>
          <p className="mt-3 text-muted max-w-lg">{t.landing.trust.body}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-olive-100 dark:bg-olive-900/50 text-olive-800 dark:text-olive-100 px-3 py-1 text-xs font-medium">
              <ShieldCheck className="h-3.5 w-3.5" /> {t.chat.verified}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-dashed px-3 py-1 text-xs text-muted">
              {t.chat.generalKnowledge}
            </span>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl border bg-white/70 dark:bg-olive-950/70 p-6 shadow-sm"
        >
          <Quote className="h-6 w-6 accent-text" />
          {isAr ? (
            <p className="mt-3 leading-relaxed prose-chat font-arabic" dir="rtl">
              <strong className="accent-text">من السياق:</strong> بحلول نهاية عام 1948، كان أكثر من 750,000 فلسطيني قد هُجِّروا
              وأُفرِغت ما لا تقلّ عن 531 قرية <strong>[3]</strong>.
              <br />
              <strong className="accent-text">من المعرفة العامة:</strong> يُعرف هذا التهجير في العربية بـ«النكبة».
            </p>
          ) : (
            <p className="mt-3 leading-relaxed prose-chat">
              <strong className="accent-text">From context:</strong> By the end of 1948, more than 750,000 Palestinians had been displaced
              and at least 531 villages depopulated <strong>[3]</strong>.
              <br />
              <strong className="accent-text">From general knowledge:</strong> The displacement is referred to in Arabic as the Nakba.
            </p>
          )}
          <div className="mt-4 border-t pt-3 text-xs text-muted">
            <p className="font-medium accent-text mb-1">{t.chat.sources}</p>
            {isAr ? (
              <p dir="rtl" className="font-arabic">[3] التطهير العرقي لفلسطين — إيلان بابيه</p>
            ) : (
              <p>[3] The Ethnic Cleansing of Palestine — Ilan Pappé</p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
