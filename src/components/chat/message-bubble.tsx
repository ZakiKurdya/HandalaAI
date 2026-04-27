"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, Share2, ShieldCheck, ChevronDown, X, ExternalLink } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useI18n } from "@/i18n/provider";
import type { ChatMessage } from "@/lib/storage";
import { MiniMarkdown } from "./markdown";
import { TypingDots } from "./typing-dots";
import { cn } from "@/lib/utils";

function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

type LightboxItem = {
  ytId: string | null;
  thumb: string;
  title: string;
  href: string;
};

function Lightbox({ item, onClose }: { item: LightboxItem; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Controls row */}
        <div className="flex items-center justify-between mb-2 px-1">
          <p className="text-sm text-white/80 font-medium truncate max-w-[80%]">{item.title}</p>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-white/70 hover:text-white transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Media */}
        <div className="rounded-xl overflow-hidden bg-black shadow-2xl">
          {item.ytId ? (
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src={`https://www.youtube.com/embed/${item.ytId}?autoplay=1&rel=0`}
                title={item.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.thumb}
              alt={item.title}
              className="w-full max-h-[80vh] object-contain"
            />
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

export function MessageBubble({
  message,
  isStreaming,
}: {
  message: ChatMessage;
  isStreaming?: boolean;
}) {
  const { t, locale } = useI18n();
  const [copied, setCopied] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [lightbox, setLightbox] = useState<LightboxItem | null>(null);
  const isUser = message.role === "user";
  const isArabicContent = /[؀-ۿ]/.test(message.content);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const onShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try { await navigator.share({ title: "Handala", text: message.content }); } catch {}
    } else { onCopy(); }
  };

  return (
    <>
      <AnimatePresence>
        {lightbox && <Lightbox key="lightbox" item={lightbox} onClose={closeLightbox} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        dir={!isUser ? "ltr" : undefined}
        className={cn("group flex gap-3", isUser ? "justify-end rtl:justify-start" : "justify-start")}
      >
        {!isUser && (
          <motion.div
            className="mt-1 shrink-0"
            whileHover={{ scale: 1.12, rotate: -4 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
          >
            <Image
              src="/handala-character.png"
              alt="Handala"
              width={32}
              height={39}
              className="object-contain drop-shadow-sm"
            />
          </motion.div>
        )}

        <div className={cn("max-w-[80%] sm:max-w-[72%]", isUser && "order-1")}>
          <motion.div
            whileHover={!isUser ? { y: -1 } : {}}
            dir={isArabicContent ? "rtl" : "ltr"}
            className={cn(
              "rounded-2xl px-4 py-3 text-[15px] leading-relaxed",
              isUser
                ? "bg-olive-700 text-sand-50 dark:bg-olive-400 dark:text-olive-950"
                : "muted-surface ring-soft"
            )}
          >
            {!isUser && message.evidenceBased && (
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-olive-100 dark:bg-olive-900/60 px-2 py-0.5 text-[11px] font-medium text-olive-800 dark:text-olive-100">
                <ShieldCheck className="h-3 w-3" /> {t.chat.verified}
              </div>
            )}

            {/* Media grid */}
            {!isUser && message.content && (() => {
              const mediaItems = (message.sources ?? []).filter((s) => s.image || s.video);
              if (!mediaItems.length) return null;
              const cols =
                mediaItems.length === 1 ? "grid-cols-1" :
                mediaItems.length === 2 ? "grid-cols-2" :
                "grid-cols-2 sm:grid-cols-4";
              return (
                <div className={`mb-4 grid gap-2 ${cols}`}>
                  {mediaItems.map((s) => {
                    const ytId = s.video ? youtubeId(s.video) : null;
                    const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : s.image!;
                    return (
                      <button
                        key={s.index}
                        type="button"
                        onClick={() => setLightbox({ ytId, thumb, title: s.title, href: s.url })}
                        className="group/img flex flex-col gap-1.5 text-start"
                      >
                        <div className="relative overflow-hidden rounded-xl aspect-[4/3] bg-black/5 dark:bg-white/5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={thumb}
                            alt={s.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
                            loading="lazy"
                          />
                          {/* hover overlay */}
                          <span className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors rounded-xl" />
                          {ytId ? (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md group-hover/img:scale-110 transition-transform">
                                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-red-600 ms-0.5"><path d="M8 5v14l11-7z" /></svg>
                              </span>
                            </span>
                          ) : (
                            <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md">
                                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-olive-800"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
                              </span>
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted text-center leading-tight line-clamp-2 px-0.5">{s.title}</p>
                      </button>
                    );
                  })}
                </div>
              );
            })()}

            {message.content ? (
              <MiniMarkdown text={message.content} />
            ) : (
              <span className="text-muted inline-flex items-center gap-2">
                {t.chat.thinking} <TypingDots />
              </span>
            )}
            {!isUser && isStreaming && message.content && (
              <span className="ms-1 inline-block h-3 w-1.5 align-middle bg-current animate-pulse" />
            )}
          </motion.div>

          {!isUser && message.sources && message.sources.length > 0 && (
            <div className="mt-2 rounded-xl border bg-white/40 dark:bg-olive-950/40 overflow-hidden">
              <button
                type="button"
                onClick={() => setSourcesOpen((v) => !v)}
                className="flex w-full items-center justify-between gap-2 px-3 py-2 text-xs font-medium hover:bg-olive-50 dark:hover:bg-olive-900/30"
              >
                <span className="accent-text">{t.chat.sources} · {message.sources.length}</span>
                <motion.span animate={{ rotate: sourcesOpen ? 180 : 0 }} transition={{ duration: 0.22 }}>
                  <ChevronDown className="h-3.5 w-3.5" />
                </motion.span>
              </button>
              <AnimatePresence>
                {sourcesOpen && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden px-3 pb-3 space-y-1.5 text-xs text-muted"
                  >
                    {message.sources.map((s) => (
                      <li key={s.index} className="leading-relaxed">
                        <span className="accent-text font-semibold me-1">[{s.index}]</span>
                        <a href={s.url} target="_blank" rel="noreferrer" className="hover:underline">{s.title}</a>
                        {s.page != null && <span className="ms-1">(p.{s.page})</span>}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          )}

          {!isUser && message.content && !isStreaming && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="mt-2 flex items-center gap-1 group-hover:opacity-100 opacity-0 transition-opacity"
            >
              <motion.button
                type="button"
                onClick={onCopy}
                whileTap={{ scale: 0.9 }}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted hover:bg-olive-100 dark:hover:bg-olive-900/40"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? "check" : "copy"}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="inline-flex"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </motion.span>
                </AnimatePresence>
                {copied ? t.chat.copied : t.chat.copy}
              </motion.button>
              <motion.button
                type="button"
                onClick={onShare}
                whileTap={{ scale: 0.9 }}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted hover:bg-olive-100 dark:hover:bg-olive-900/40"
              >
                <Share2 className="h-3 w-3" /> {t.chat.share}
              </motion.button>
              <span className="ms-auto text-[10px] text-muted">
                {new Date(message.createdAt).toLocaleTimeString(locale === "ar" ? "ar-PS" : "en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
}
