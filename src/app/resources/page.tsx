"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, Search, ShieldCheck, Tag } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import type { Resource } from "@/modules/resources/resources.service";
import { TatreezDivider } from "@/components/patterns/tatreez-divider";

const TYPES: Array<Resource["type"]> = ["book", "article", "website", "archive", "video", "image"];
const ITEMS_PER_PAGE = 12;

export default function ResourcesPage() {
  const { t } = useI18n();
  const [items, setItems] = useState<Resource[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Resource["type"] | "all">("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetch("/api/resources");
      const data = await res.json();
      setItems(data.items ?? []);
      setLoading(false);
    })();
  }, []);

  // Reset to page 1 whenever the filter or search query changes
  useEffect(() => {
    setPage(1);
  }, [filter, query]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((r) => {
      if (filter !== "all" && r.type !== filter) return false;
      if (!q) return true;
      const hay = [r.title, r.author, r.summary, ...(r.tags ?? [])].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [items, query, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, page]);

  return (
    <>
      {/* Decorative olive-branch background */}
      <img
        src="/olive-branch-light.png"
        alt=""
        aria-hidden
        className="pointer-events-none select-none fixed inset-0 w-full h-full object-cover opacity-[0.06] dark:opacity-[0.04] -z-10"
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{t.resources.title}</h1>
          <p className="mt-2 text-muted max-w-2xl">{t.resources.sub}</p>
        </div>

        <TatreezDivider className="my-6 h-3" />

        {/* Search + filters */}
        <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.resources.search}
              className="w-full ps-9 pe-3 h-11 rounded-xl border bg-white/60 dark:bg-olive-950/60 focus:outline-none focus:border-olive-400"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <FilterPill active={filter === "all"} onClick={() => setFilter("all")}>
              {t.resources.filterAll}
            </FilterPill>
            {TYPES.map((tp) => (
              <FilterPill key={tp} active={filter === tp} onClick={() => setFilter(tp)}>
                {t.resources.types[tp]}
              </FilterPill>
            ))}
          </div>
        </div>

        {/* Resource grid */}
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-44 rounded-2xl bg-olive-100/60 dark:bg-olive-900/30 animate-pulse" />
            ))
          ) : filtered.length === 0 ? (
            <p className="col-span-full text-center text-muted py-12">{t.resources.empty}</p>
          ) : (
            paginated.map((r, i) => (
              <motion.article
                key={r.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="rounded-2xl border bg-white/60 dark:bg-olive-950/60 p-5 hover:border-olive-400 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] uppercase tracking-wider text-muted">
                        {t.resources.types[r.type]}
                      </span>
                      {r.verified && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-olive-700 dark:text-olive-300">
                          <ShieldCheck className="h-3 w-3" /> {t.chat.verified}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1 font-semibold leading-snug">{r.title}</h3>
                    <p className="text-sm text-muted">
                      {r.author}
                      {r.year ? ` · ${r.year}` : ""}
                    </p>
                  </div>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 inline-flex items-center justify-center h-8 w-8 rounded-lg muted-surface hover:bg-olive-100 dark:hover:bg-olive-900/40"
                    aria-label="Open"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
                <p className="mt-3 text-sm leading-relaxed">{r.summary}</p>
                {r.tags && r.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {r.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full bg-olive-50 dark:bg-olive-900/40 text-olive-800 dark:text-olive-200 px-2 py-0.5 text-[11px]"
                      >
                        <Tag className="h-2.5 w-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.article>
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center justify-center h-9 w-9 rounded-full muted-surface ring-soft hover:bg-olive-100 dark:hover:bg-olive-900/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-muted tabular-nums">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center justify-center h-9 w-9 rounded-full muted-surface ring-soft hover:bg-olive-100 dark:hover:bg-olive-900/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 h-9 rounded-full text-xs font-medium transition-colors ${
        active
          ? "bg-olive-700 text-sand-50 dark:bg-olive-400 dark:text-olive-950"
          : "muted-surface ring-soft hover:bg-olive-100 dark:hover:bg-olive-900/40"
      }`}
    >
      {children}
    </button>
  );
}
