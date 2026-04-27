"use client";

import { v4 as uuid } from "uuid";

export type ChatRole = "user" | "assistant";

export type Source = {
  index: number;
  title: string;
  url: string;
  page?: number | string | null;
  image?: string;
  video?: string;
};

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
  sources?: Source[];
  evidenceBased?: boolean;
};

export type Conversation = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
};

const KEY = "handala.conversations.v1";

function read(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Conversation[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function write(conversations: Conversation[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(conversations));
  } catch {}
}

export const conversationStore = {
  list(): Conversation[] {
    return read().sort((a, b) => b.updatedAt - a.updatedAt);
  },
  get(id: string): Conversation | null {
    return read().find((c) => c.id === id) ?? null;
  },
  create(title: string): Conversation {
    const now = Date.now();
    const conv: Conversation = {
      id: uuid(),
      title: title || "New conversation",
      createdAt: now,
      updatedAt: now,
      messages: [],
    };
    const all = read();
    all.unshift(conv);
    write(all);
    return conv;
  },
  upsert(conv: Conversation): Conversation {
    const all = read();
    const idx = all.findIndex((c) => c.id === conv.id);
    const updated = { ...conv, updatedAt: Date.now() };
    if (idx >= 0) all[idx] = updated;
    else all.unshift(updated);
    write(all);
    return updated;
  },
  rename(id: string, title: string): void {
    const all = read();
    const idx = all.findIndex((c) => c.id === id);
    if (idx < 0) return;
    all[idx] = { ...all[idx], title, updatedAt: Date.now() };
    write(all);
  },
  remove(id: string): void {
    const all = read().filter((c) => c.id !== id);
    write(all);
  },
  appendMessage(id: string, message: ChatMessage): Conversation | null {
    const all = read();
    const idx = all.findIndex((c) => c.id === id);
    if (idx < 0) return null;
    const conv = all[idx];
    conv.messages = [...conv.messages, message];
    conv.updatedAt = Date.now();
    if ((!conv.title || conv.title === "New conversation") && message.role === "user") {
      conv.title = message.content.slice(0, 60).trim() || conv.title;
    }
    all[idx] = conv;
    write(all);
    return conv;
  },
  updateMessage(convId: string, messageId: string, patch: Partial<ChatMessage>): Conversation | null {
    const all = read();
    const idx = all.findIndex((c) => c.id === convId);
    if (idx < 0) return null;
    const conv = all[idx];
    conv.messages = conv.messages.map((m) => (m.id === messageId ? { ...m, ...patch } : m));
    conv.updatedAt = Date.now();
    all[idx] = conv;
    write(all);
    return conv;
  },
  clear(): void {
    write([]);
  },
};

export function newMessage(role: ChatRole, content: string, extras?: Partial<ChatMessage>): ChatMessage {
  return {
    id: uuid(),
    role,
    content,
    createdAt: Date.now(),
    ...extras,
  };
}
