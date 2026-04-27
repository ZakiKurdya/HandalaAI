"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ChatSidebar } from "@/components/chat/sidebar";
import { MessageBubble } from "@/components/chat/message-bubble";
import { Composer } from "@/components/chat/composer";
import { ChatWelcome } from "@/components/chat/welcome";
import {
  conversationStore,
  newMessage,
  type ChatMessage,
  type Conversation,
  type Source,
} from "@/lib/storage";
import { useI18n } from "@/i18n/provider";

type SSEEvent =
  | { event: "meta"; data: { sources: Array<{ index: number; source: { title: string; url: string; page?: string | number | null; image?: string; video?: string } }>; evidenceBased: boolean } }
  | { event: "delta"; data: { text: string } }
  | { event: "done"; data: { sourcesBlock: string } }
  | { event: "error"; data: { message: string } };

export default function ChatPage() {
  const { t } = useI18n();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [draft, setDraft] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load most recent conversation or start fresh
  useEffect(() => {
    const list = conversationStore.list();
    if (list.length) {
      setActiveId(list[0].id);
      setConversation(list[0]);
    }
  }, []);

  // When activeId changes, load the conversation
  useEffect(() => {
    if (!activeId) {
      setConversation(null);
      return;
    }
    const c = conversationStore.get(activeId);
    setConversation(c);
  }, [activeId]);

  // Auto-scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [conversation?.messages.length, streamingMessageId]);

  const handleNew = useCallback(() => {
    setActiveId(null);
    setConversation(null);
    setDraft("");
    setMobileSidebarOpen(false);
  }, []);

  const handleSelect = useCallback((id: string) => {
    setActiveId(id);
    setMobileSidebarOpen(false);
  }, []);

  const handleAfterDelete = useCallback(
    (id: string) => {
      if (activeId === id) {
        const list = conversationStore.list();
        setActiveId(list[0]?.id ?? null);
      }
    },
    [activeId]
  );

  const ensureConversation = useCallback(
    (firstUserMessage: string): Conversation => {
      if (conversation) return conversation;
      const created = conversationStore.create(firstUserMessage.slice(0, 60));
      setActiveId(created.id);
      setConversation(created);
      setRefreshKey((k) => k + 1);
      return created;
    },
    [conversation]
  );

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isStreaming) return;

      const conv = ensureConversation(trimmed);
      const userMsg = newMessage("user", trimmed);
      const assistantMsg = newMessage("assistant", "", { evidenceBased: false, sources: [] });

      let updated = conversationStore.appendMessage(conv.id, userMsg);
      updated = updated && conversationStore.appendMessage(conv.id, assistantMsg);
      setConversation(updated);
      setRefreshKey((k) => k + 1);
      setDraft("");
      setIsStreaming(true);
      setStreamingMessageId(assistantMsg.id);

      const history = (updated?.messages ?? [])
        .filter((m) => m.id !== userMsg.id && m.id !== assistantMsg.id)
        .slice(-20) // cap to last 20 messages (10 turns) to avoid large payloads
        .map((m) => ({ role: m.role, content: m.content }));

      const ac = new AbortController();
      abortRef.current = ac;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: trimmed, history }),
          signal: ac.signal,
        });
        if (!res.body) throw new Error("No response body");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let assistantText = "";
        let sources: Source[] = [];
        let evidenceBased = false;

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // Parse SSE: events separated by blank line
          let idx;
          while ((idx = buffer.indexOf("\n\n")) >= 0) {
            const raw = buffer.slice(0, idx);
            buffer = buffer.slice(idx + 2);
            const eventLine = raw.match(/^event:\s*(.*)$/m)?.[1]?.trim();
            const dataLine = raw.match(/^data:\s*(.*)$/m)?.[1] ?? "";
            if (!eventLine) continue;
            let data: unknown = {};
            try { data = JSON.parse(dataLine); } catch { continue; }
            const evt = { event: eventLine, data } as unknown as SSEEvent;

            if (evt.event === "meta") {
              evidenceBased = evt.data.evidenceBased;
              sources = (evt.data.sources || []).map((s) => ({
                index: s.index,
                title: s.source.title,
                url: s.source.url,
                page: s.source.page ?? null,
                image: s.source.image,
                video: s.source.video,
              }));
              conversationStore.updateMessage(conv.id, assistantMsg.id, { sources, evidenceBased });
              setConversation(conversationStore.get(conv.id));
            } else if (evt.event === "delta") {
              assistantText += evt.data.text;
              conversationStore.updateMessage(conv.id, assistantMsg.id, { content: assistantText });
              setConversation(conversationStore.get(conv.id));
            } else if (evt.event === "done") {
              // sourcesBlock is informational — sources already set via meta
            } else if (evt.event === "error") {
              assistantText += `\n\n_${evt.data.message}_`;
              conversationStore.updateMessage(conv.id, assistantMsg.id, { content: assistantText });
              setConversation(conversationStore.get(conv.id));
            }
          }
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          const raw = (err as Error).message ?? "";
          const isNetwork = raw === "Failed to fetch" || raw === "Load failed" || raw.includes("network");
          const friendlyMsg = isNetwork
            ? "_Could not reach the server. Please check your connection and try again._"
            : `_${raw}_`;
          conversationStore.updateMessage(conv.id, assistantMsg.id, { content: friendlyMsg });
          setConversation(conversationStore.get(conv.id));
        }
      } finally {
        setIsStreaming(false);
        setStreamingMessageId(null);
        abortRef.current = null;
        setRefreshKey((k) => k + 1);
      }
    },
    [ensureConversation, isStreaming]
  );

  const stop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const messages = conversation?.messages ?? [];
  const showWelcome = messages.length === 0;


  const sidebar = useMemo(
    () => (
      <ChatSidebar
        activeId={activeId}
        onSelect={handleSelect}
        onNew={handleNew}
        refreshKey={refreshKey}
        onAfterDelete={handleAfterDelete}
        className="h-full"
      />
    ),
    [activeId, handleSelect, handleNew, refreshKey, handleAfterDelete]
  );

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      <div className="hidden md:block w-72 lg:w-80 shrink-0">{sidebar}</div>

      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 start-0 z-50 w-[80%] max-w-xs md:hidden"
            >
              {sidebar}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Kufiya background pattern — full chat area */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/chat-background.png')",
            backgroundSize: "320px",
            backgroundRepeat: "repeat",
            opacity: 0.06,
          }}
        />
        <div className="md:hidden flex items-center justify-between border-b px-3 py-2 relative z-10">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(true)}
            className="h-9 w-9 inline-flex items-center justify-center rounded-full muted-surface ring-soft"
            aria-label={t.common.openMenu}
          >
            <Menu className="h-4 w-4" />
          </button>
          <p className="text-sm font-medium truncate max-w-[60%]">
            {conversation?.title ?? t.chat.newChat}
          </p>
          <button
            type="button"
            onClick={handleNew}
            className="text-xs px-2 py-1 rounded-lg bg-olive-700 text-sand-50 dark:bg-olive-400 dark:text-olive-950"
          >
            {t.chat.newChat}
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin relative z-10">
          {showWelcome ? (
            <ChatWelcome onPick={(s) => setDraft(s)} />
          ) : (
            <div className="mx-auto max-w-3xl px-4 py-6 space-y-5">
              {messages.map((m) => (
                <MessageBubble
                  key={m.id}
                  message={m}
                  isStreaming={isStreaming && m.id === streamingMessageId}
                />
              ))}
            </div>
          )}
        </div>

        <div className="relative z-10 border-t">
          <div className="mx-auto max-w-3xl px-4 py-2">
            <Composer
              value={draft}
              onChange={setDraft}
              onSubmit={() => send(draft)}
              onStop={stop}
              isStreaming={isStreaming}
              disabled={isStreaming}
            />
            <p className="text-[11px] text-muted text-center">
              {t.chat.verified} · {t.landing.footer.sources}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
