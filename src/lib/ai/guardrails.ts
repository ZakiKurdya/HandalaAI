// ── Language detection ──────────────────────────────────────────────────────

export function detectLanguage(text: string): "ar" | "en" {
  const arabicChars = (text.match(/[؀-ۿ]/g) ?? []).length;
  return arabicChars / Math.max(text.replace(/\s/g, "").length, 1) > 0.3 ? "ar" : "en";
}

// ── Jailbreak patterns ──────────────────────────────────────────────────────

const JAILBREAK_PATTERNS = [
  /ignore\s+(your\s+)?(previous\s+|all\s+|above\s+)?(instructions?|rules?|guidelines?|prompt|system)/i,
  /\byou\s+are\s+now\b/i,
  /\bpretend\s+(you\s+are|to\s+be)\b/i,
  /\bact\s+as\b/i,
  /\bforget\s+(your\s+|everything|all)/i,
  /\boverride\b/i,
  /\bDAN\b/,
  /\bjailbreak\b/i,
  /\bdeveloper\s+mode\b/i,
  /\bsystem\s+prompt\b/i,
  /reveal\s+(your\s+)?(instructions?|prompt|rules?|system)/i,
];

export function isJailbreakAttempt(message: string): boolean {
  return JAILBREAK_PATTERNS.some((p) => p.test(message));
}

// ── Off-topic blocklist ─────────────────────────────────────────────────────

const BLOCKLIST_PATTERNS = [
  /\b(diagnose|prescription|dosage|medical\s+advice|symptoms?\s+of)\b/i,
  /\b(stock\s+tip|buy\s+crypto|investment\s+advice|trading\s+signal)\b/i,
];

export function isBlocklisted(message: string): boolean {
  return BLOCKLIST_PATTERNS.some((p) => p.test(message));
}

// ── Monolingual refusal ─────────────────────────────────────────────────────

export function refusalMessage(lang: "ar" | "en"): string {
  return lang === "ar"
    ? "أنا شاهدٌ فلسطيني يركز على الأسئلة المتعلقة بفلسطين. يُرجى طرح سؤال متعلق بفلسطين."
    : "I'm a Palestinian witness focusing on questions about Palestine. Please ask a Palestine-related question.";
}

// ── Citation sanitizer ──────────────────────────────────────────────────────

export function sanitizeCitations(text: string, maxN: number): string {
  if (maxN === 0) return text.replace(/\[\d+\]/g, "");
  return text.replace(/\[(\d+)\]/g, (match, n) => (parseInt(n) <= maxN ? match : ""));
}
