import { streamHandala, type ChatTurn, type StreamChunk } from "@/lib/ai/gemini";

/**
 * NestJS-style service. In a NestJS extraction this becomes:
 *
 *   @Injectable()
 *   export class ChatService {
 *     constructor(private readonly ai: AiAdapter) {}
 *     stream(history, message) { return this.ai.stream(history, message); }
 *   }
 *
 * The function-based shim here keeps the same shape inside Next.js API routes.
 */
export const chatService = {
  stream(history: ChatTurn[], message: string): AsyncGenerator<StreamChunk, void, void> {
    return streamHandala(history, message);
  },
};
