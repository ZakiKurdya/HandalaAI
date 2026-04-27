import { buildSystemPrompt } from "./system-prompt";
import { buildContextBlock, formatSourcesBlock, retrieve, type RetrievedDoc } from "./retrieval";
import { detectLanguage, isJailbreakAttempt, isBlocklisted, refusalMessage, sanitizeCitations } from "./guardrails";

export type ChatTurn = { role: "user" | "assistant"; content: string };

export type StreamChunk =
  | { type: "meta"; sources: RetrievedDoc[]; evidenceBased: boolean }
  | { type: "delta"; text: string }
  | { type: "done"; sourcesBlock: string }
  | { type: "error"; message: string };

const MAIN_MODEL      = process.env.GEMINI_MODEL          || "gemini-3.1-flash-lite-preview";
const FALLBACK_MODEL  = process.env.GEMINI_FALLBACK_MODEL || "gemma-4-31b-it";
const FALLBACK_MODEL2 = "gemini-2.5-flash-lite";
const LLM_TIMEOUT_MS = 30_000;

// ── Greeting — handled server-side to avoid false scope-gate refusals ────────

const GREETING_RE = /^(hi|hello|hey|marhaba|salam|salaam|مرحبا|السلام|كيفك|كيف حالك|how are you|what's up)\b/i;

function getGreetingReply(message: string, lang: "ar" | "en", hasHistory: boolean): string | null {
  if (hasHistory || !GREETING_RE.test(message.trim())) return null;
  return lang === "ar"
    ? "مرحبًا — أنا **حنظلة**، شاهدٌ فلسطيني. هدفي تقديم إجابات موثوقة ومستندة إلى المصادر عن تاريخ فلسطين وجغرافيتها وثقافتها وتأثيرات الاحتلال. كيف يمكنني المساعدة؟"
    : "Hi — I'm **Handala**, a Palestinian witness. I'm here to provide truthful, cited answers about Palestine's history, geography, culture, and the impacts of the occupation. How can I help?";
}

// ── Direct Gemini REST streaming ─────────────────────────────────────────────

type GeminiContent = { role: "user" | "model"; parts: [{ text: string }] };

function buildPayload(history: ChatTurn[], message: string, systemPrompt: string) {
  return {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [
      ...history.map((t): GeminiContent => ({
        role: t.role === "user" ? "user" : "model",
        parts: [{ text: t.content }],
      })),
      { role: "user" as const, parts: [{ text: message }] },
    ],
    generationConfig: { temperature: 0, maxOutputTokens: 2048 },
  };
}

async function* streamWithModel(
  modelName: string,
  payload: ReturnType<typeof buildPayload>
): AsyncGenerator<string, void, void> {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/${modelName}` +
    `:generateContent?key=${process.env.GOOGLE_API_KEY}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), LLM_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    throw new Error(
      (err as Error).name === "AbortError" ? "LLM connection timed out" : (err as Error).message
    );
  }
  clearTimeout(timeoutId);

  const body = await res.text();

  if (!res.ok) {
    if (res.status === 429) {
      const retryMatch = body.match(/retry in ([\d.]+)s/i);
      const wait = retryMatch ? `Please wait ${Math.ceil(parseFloat(retryMatch[1]))} seconds and try again.` : "Please wait a moment and try again.";
      throw new Error(`Rate limit reached for model ${modelName}. ${wait}`);
    }
    throw new Error(`Gemini API ${res.status}: ${body}`);
  }

  try {
    const json = JSON.parse(body);
    const text: string = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    if (text) yield text;
  } catch {
    throw new Error("Failed to parse Gemini response");
  }
}

// ── Main export ──────────────────────────────────────────────────────────────

export async function* streamHandala(
  history: ChatTurn[],
  message: string
): AsyncGenerator<StreamChunk, void, void> {
  const lang = detectLanguage(message);

  // 1. Jailbreak / blocklist
  if (isJailbreakAttempt(message) || isBlocklisted(message)) {
    yield { type: "meta", sources: [], evidenceBased: false };
    yield { type: "delta", text: refusalMessage(lang) };
    yield { type: "done", sourcesBlock: "" };
    return;
  }

  // 2. Greeting — instant server-side reply, no LLM call, no false refusals
  const greetingReply = getGreetingReply(message, lang, history.length > 0);
  if (greetingReply) {
    yield { type: "meta", sources: [], evidenceBased: false };
    for (const word of greetingReply.split(/(\s+)/)) {
      yield { type: "delta", text: word };
    }
    yield { type: "done", sourcesBlock: "" };
    return;
  }

  // 3. Retrieve context
  const docs = await retrieve(message, 3);
  const maxCitations = docs.length;
  const systemPrompt = buildSystemPrompt(buildContextBlock(docs), lang, maxCitations);

  yield { type: "meta", sources: docs, evidenceBased: docs.length > 0 };

  // 4. Mock mode (no API key)
  if (!process.env.GOOGLE_API_KEY) {
    yield* mockStream(message, docs, lang);
    yield { type: "done", sourcesBlock: formatSourcesBlock(docs) };
    return;
  }

  // 5. Stream from Gemini
  const payload = buildPayload(history, message, systemPrompt);
  let fullText = "";

  try {
    try {
      for await (const text of streamWithModel(MAIN_MODEL, payload)) {
        fullText += text;
        yield { type: "delta", text };
      }
    } catch {
      // Main model failed — try first fallback
      try {
        fullText = "";
        for await (const text of streamWithModel(FALLBACK_MODEL, payload)) {
          fullText += text;
          yield { type: "delta", text };
        }
      } catch {
        // Both failed — try second fallback (separate quota pool)
        fullText = "";
        for await (const text of streamWithModel(FALLBACK_MODEL2, payload)) {
          fullText += text;
          yield { type: "delta", text };
        }
      }
    }

    // If the model returned a scope-gate refusal despite the prompt, treat it as empty
    // so the UI shows the "thinking" state rather than a false refusal.
    const REFUSAL_RE = /أنا شاهدٌ فلسطيني.*يُرجى طرح سؤال|I'm a Palestinian witness.*Please ask/i;
    if (REFUSAL_RE.test(fullText.trim())) {
      fullText = lang === "ar"
        ? "**من المعرفة العامة:** يمكنني الإجابة من معرفتي العامة بفلسطين. يُرجى إعادة صياغة سؤالك."
        : "**From general knowledge:** I can answer from my general knowledge about Palestine. Please rephrase your question.";
      yield { type: "delta", text: fullText };
    }

    const sanitized = sanitizeCitations(fullText, maxCitations);
    if (sanitized !== fullText) yield { type: "delta", text: "​" };

  } catch (err) {
    yield { type: "error", message: err instanceof Error ? err.message : "Unknown error" };
    return;
  }

  yield { type: "done", sourcesBlock: formatSourcesBlock(docs) };
}

// ── Mock fallback (no API key) ───────────────────────────────────────────────

async function* mockStream(
  message: string,
  docs: RetrievedDoc[],
  lang: "ar" | "en"
): AsyncGenerator<StreamChunk, void, void> {
  let body: string;

  if (docs.length === 0) {
    body = lang === "ar"
      ? "**من المعرفة العامة:**\n\nيمكنني الإجابة من معرفتي العامة، لكن لم تُسترجع مصادر محددة.\n\n*(وضع محلي — أضف `GOOGLE_API_KEY` لتفعيل الردود الحية.)*"
      : "**From general knowledge:**\n\nI can speak to this from general knowledge, but no specific sources were retrieved.\n\n*(Local fallback — set `GOOGLE_API_KEY` to enable live responses.)*";
  } else {
    const points = docs.map((d) => `- [${d.index}] ${d.content}`).join("\n");
    body = lang === "ar"
      ? `**من السياق:**\n\n${points}\n\n*(وضع محلي — أضف \`GOOGLE_API_KEY\` لتفعيل الردود الحية.)*`
      : `**From context:**\n\n${points}\n\n*(Local fallback — set \`GOOGLE_API_KEY\` to enable live responses.)*`;
  }

  for (const w of body.split(/(\s+)/)) {
    yield { type: "delta", text: w };
    await new Promise((r) => setTimeout(r, 12));
  }
}
