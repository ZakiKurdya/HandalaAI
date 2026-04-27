"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, FileCheck, Quote, Tags, Users } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { Button } from "@/components/ui/button";
import { TatreezDivider } from "@/components/patterns/tatreez-divider";

const ICONS = [Quote, FileCheck, Tags, Users];
const TYPES = ["book", "article", "website", "archive", "video", "image"] as const;

export default function ContributePage() {
  const { t } = useI18n();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: "",
    author: "",
    url: "",
    type: "article" as (typeof TYPES)[number],
    tags: "",
    summary: "",
    submittedBy: "",
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/contributions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
      }),
    });
    if (res.ok) setSubmitted(true);
  };

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
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{t.contribute.title}</h1>
        <p className="mt-2 text-muted max-w-2xl">{t.contribute.sub}</p>

        <TatreezDivider className="my-6 h-3" />

        <section>
          <h2 className="text-xl font-semibold">{t.contribute.guideTitle}</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {t.contribute.guide.map((g, i) => {
              const Icon = ICONS[i];
              return (
                <motion.div
                  key={g.title}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="rounded-2xl border bg-white/60 dark:bg-olive-950/60 p-5"
                >
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-olive-100 text-olive-800 dark:bg-olive-900/60 dark:text-olive-100">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="mt-3 font-semibold">{g.title}</h3>
                  <p className="mt-1 text-sm text-muted">{g.body}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-xl font-semibold">{t.contribute.formTitle}</h2>
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-olive-300 dark:border-olive-700 bg-olive-50 dark:bg-olive-900/40 px-4 py-3"
            >
              <Check className="h-4 w-4 accent-text" />
              <span className="text-sm">{t.contribute.success}</span>
            </motion.div>
          ) : (
            <form onSubmit={submit} className="mt-4 grid gap-3 md:grid-cols-2">
              <Field label={t.resources.titleField}>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} />
              </Field>
              <Field label={t.resources.authorField}>
                <input required value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className={inputCls} />
              </Field>
              <Field label={t.resources.urlField}>
                <input required type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className={inputCls} />
              </Field>
              <Field label={t.resources.typeField}>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as (typeof TYPES)[number] })}
                  className={inputCls}
                >
                  {TYPES.map((tp) => (
                    <option key={tp} value={tp}>
                      {t.resources.types[tp]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t.resources.tagsField}>
                <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className={inputCls} />
              </Field>
              <Field label="Submitted by (optional)">
                <input value={form.submittedBy} onChange={(e) => setForm({ ...form, submittedBy: e.target.value })} className={inputCls} />
              </Field>
              <div className="md:col-span-2">
                <Field label={t.resources.summaryField}>
                  <textarea
                    required
                    rows={4}
                    value={form.summary}
                    onChange={(e) => setForm({ ...form, summary: e.target.value })}
                    className={`${inputCls} h-auto py-2 resize-y`}
                  />
                </Field>
              </div>
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit">{t.resources.submit}</Button>
              </div>
            </form>
          )}
        </section>
      </div>
    </>
  );
}

const inputCls =
  "w-full h-10 px-3 rounded-lg border bg-white/80 dark:bg-olive-950/80 text-sm focus:outline-none focus:border-olive-400";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
