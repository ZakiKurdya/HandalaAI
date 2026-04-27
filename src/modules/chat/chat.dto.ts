import { z } from "zod";

export const chatTurnSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(8000),
});

export const chatRequestSchema = z.object({
  message: z.string().min(1).max(8000),
  history: z.array(chatTurnSchema).max(40).default([]),
});

export type ChatRequest = z.infer<typeof chatRequestSchema>;
