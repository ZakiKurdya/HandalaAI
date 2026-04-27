import { NextRequest } from "next/server";
import { chatService } from "@/modules/chat/chat.service";
import { chatRequestSchema } from "@/modules/chat/chat.dto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const parsed = chatRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error.flatten() }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { history, message } = parsed.data;
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        );
      };

      try {
        for await (const chunk of chatService.stream(history, message)) {
          if (chunk.type === "meta") send("meta", { sources: chunk.sources, evidenceBased: chunk.evidenceBased });
          else if (chunk.type === "delta") send("delta", { text: chunk.text });
          else if (chunk.type === "done") send("done", { sourcesBlock: chunk.sourcesBlock });
          else if (chunk.type === "error") send("error", { message: chunk.message });
        }
      } catch (err) {
        send("error", { message: err instanceof Error ? err.message : "stream failed" });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
