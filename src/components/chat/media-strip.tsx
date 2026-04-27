"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Source } from "@/lib/storage";

function youtubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

export function MediaStrip({ sources }: { sources: Source[] }) {
  const media = sources.filter((s) => s.image || s.video);

  return (
    <AnimatePresence>
      {media.length > 0 && (
        <motion.div
          key="media-strip"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 overflow-hidden border-t bg-white/60 dark:bg-olive-950/60 backdrop-blur-sm"
        >
          <div className="flex gap-2 overflow-x-auto scrollbar-thin px-4 py-2.5">
            {media.map((s) => {
              const ytId = s.video ? youtubeId(s.video) : null;
              const thumb = ytId
                ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
                : s.image!;

              return (
                <a
                  key={s.index}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  title={s.title}
                  className="relative shrink-0 w-32 h-[4.5rem] rounded-lg overflow-hidden group/card ring-1 ring-black/10 dark:ring-white/10"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumb}
                    alt={s.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                    loading="lazy"
                  />

                  {ytId && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover/card:bg-black/40 transition-colors">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-red-600 ms-0.5">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                    </span>
                  )}

                  <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent px-1.5 pb-1 pt-3 text-[9px] leading-tight text-white truncate block">
                    {s.title}
                  </span>
                </a>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
