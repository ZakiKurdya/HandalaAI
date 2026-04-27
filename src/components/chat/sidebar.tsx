"use client";

import { Plus, Search, Trash2, Pencil, Check, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/i18n/provider";
import { conversationStore, type Conversation } from "@/lib/storage";
import { cn, relativeDay } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function ChatSidebar({
  activeId,
  onSelect,
  onNew,
  refreshKey,
  onAfterDelete,
  className,
}: {
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  refreshKey?: number;
  onAfterDelete?: (id: string) => void;
  className?: string;
}) {
  const { t, locale } = useI18n();
  const [items, setItems] = useState<Conversation[]>([]);
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState("");

  const refresh = () => setItems(conversationStore.list());

  useEffect(() => {
    refresh();
  }, [refreshKey]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.messages.some((m) => m.content.toLowerCase().includes(q))
    );
  }, [items, query]);

  const startEdit = (c: Conversation) => {
    setEditingId(c.id);
    setDraftTitle(c.title);
  };
  const saveEdit = (id: string) => {
    if (draftTitle.trim()) conversationStore.rename(id, draftTitle.trim());
    setEditingId(null);
    refresh();
  };
  const cancelEdit = () => setEditingId(null);

  const remove = (id: string) => {
    if (typeof window !== "undefined" && window.confirm(t.chat.confirmDelete)) {
      conversationStore.remove(id);
      refresh();
      onAfterDelete?.(id);
    }
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-full muted-surface border-e",
        className
      )}
    >
      <div className="p-3 space-y-2">
        <button
          type="button"
          onClick={onNew}
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-olive-700 text-sand-50 dark:bg-olive-400 dark:text-olive-950 hover:bg-olive-800 dark:hover:bg-olive-300 h-10 text-sm font-medium focus-ring"
        >
          <Plus className="h-4 w-4" />
          {t.chat.newChat}
        </button>
        <div className="relative">
          <Search className="absolute start-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.chat.searchHistory}
            className="w-full ps-8 pe-3 h-9 text-sm rounded-lg bg-white/60 dark:bg-olive-950/60 border focus:outline-none focus:border-olive-400"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-2 pb-3">
        {filtered.length === 0 ? (
          <p className="px-3 py-6 text-xs text-muted text-center">{t.chat.empty}</p>
        ) : (
          <ul className="space-y-0.5">
            <AnimatePresence initial={false}>
              {filtered.map((c) => {
                const isActive = c.id === activeId;
                const isEditing = editingId === c.id;
                return (
                  <motion.li
                    key={c.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <div
                      className={cn(
                        "group rounded-lg px-2 py-2 text-sm cursor-pointer flex items-center gap-2",
                        isActive
                          ? "bg-olive-100 dark:bg-olive-900/60"
                          : "hover:bg-olive-50 dark:hover:bg-olive-900/30"
                      )}
                      onClick={() => !isEditing && onSelect(c.id)}
                    >
                      <div className="flex-1 min-w-0">
                        {isEditing ? (
                          <input
                            autoFocus
                            value={draftTitle}
                            onChange={(e) => setDraftTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveEdit(c.id);
                              if (e.key === "Escape") cancelEdit();
                            }}
                            className="w-full bg-transparent border-b border-olive-400 outline-none text-sm py-0.5"
                          />
                        ) : (
                          <p className="truncate font-medium">{c.title}</p>
                        )}
                        <p className="text-[11px] text-muted">{relativeDay(c.updatedAt, locale)}</p>
                      </div>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              aria-label={t.chat.save}
                              onClick={(e) => {
                                e.stopPropagation();
                                saveEdit(c.id);
                              }}
                              className="p-1 rounded hover:bg-olive-200 dark:hover:bg-olive-800"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              aria-label={t.chat.cancel}
                              onClick={(e) => {
                                e.stopPropagation();
                                cancelEdit();
                              }}
                              className="p-1 rounded hover:bg-olive-200 dark:hover:bg-olive-800"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              aria-label={t.chat.rename}
                              onClick={(e) => {
                                e.stopPropagation();
                                startEdit(c);
                              }}
                              className="p-1 rounded hover:bg-olive-200 dark:hover:bg-olive-800"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              aria-label={t.chat.delete}
                              onClick={(e) => {
                                e.stopPropagation();
                                remove(c.id);
                              }}
                              className="p-1 rounded hover:bg-olive-200 dark:hover:bg-olive-800 text-carmine-600"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </aside>
  );
}
