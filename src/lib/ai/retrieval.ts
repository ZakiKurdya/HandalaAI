import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { Document } from "@langchain/core/documents";
import resources from "@/data/resources.json";

export type RetrievedDoc = {
  index: number;
  content: string;
  source: {
    title: string;
    url: string;
    author?: string;
    page?: number | string | null;
    type?: string;
    image?: string;
    video?: string;
  };
};

type CorpusEntry = {
  doc: Document;
  title: string;
  author: string;
  url: string;
  type: string;
  image?: string;
  video?: string;
};

// ── In-memory semantic index ────────────────────────────────────────────────

let embeddingsModel: GoogleGenerativeAIEmbeddings | null = null;
let corpusEmbeddings: number[][] | null = null;
let corpusEntries: CorpusEntry[] = [];
let indexBuildPromise: Promise<void> | null = null;

function getEmbeddings(): GoogleGenerativeAIEmbeddings {
  if (!embeddingsModel) {
    embeddingsModel = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY!,
      model: "text-embedding-004",
    });
  }
  return embeddingsModel;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-10);
}

async function buildIndex(): Promise<void> {
  if (corpusEmbeddings) return;

  const entries: CorpusEntry[] = resources.flatMap((r) =>
    (r.snippets || []).map((snippet) => ({
      doc: new Document({ pageContent: snippet }),
      title: r.title,
      author: r.author,
      url: r.url,
      type: r.type,
      image: (r as { image?: string }).image,
      video: (r as { video?: string }).video,
    }))
  );

  const texts = entries.map((e) => e.doc.pageContent);
  const embeddings = await getEmbeddings().embedDocuments(texts);
  // Assign atomically only after successful build
  corpusEntries = entries;
  corpusEmbeddings = embeddings;
}

// Returns the in-flight build promise, or starts one. Never throws.
function startIndexBuild(): Promise<void> {
  if (!indexBuildPromise) {
    indexBuildPromise = buildIndex().catch(() => {
      indexBuildPromise = null;
      corpusEmbeddings = null;
    });
  }
  return indexBuildPromise;
}

// Pre-warm: kick off index build at module load so it's ready before first request.
if (process.env.GOOGLE_API_KEY) {
  startIndexBuild();
}

const SIMILARITY_THRESHOLD = 0.35;
// How long to wait for an in-progress index build before falling back to keyword search.
const INDEX_WAIT_MS = 5_000;

async function semanticRetrieve(query: string, k: number): Promise<RetrievedDoc[]> {
  if (!corpusEmbeddings) {
    // Wait up to INDEX_WAIT_MS for the background build to finish
    const ready = await Promise.race([
      startIndexBuild().then(() => true),
      new Promise<false>((resolve) => setTimeout(() => resolve(false), INDEX_WAIT_MS)),
    ]);
    if (!ready || !corpusEmbeddings) {
      throw new Error("Semantic index not ready — falling back to keyword search");
    }
  }

  const queryEmbedding = await getEmbeddings().embedQuery(query);

  const scored = (corpusEmbeddings ?? []).map((emb, i) => ({
    entry: corpusEntries[i],
    score: cosineSimilarity(queryEmbedding, emb),
  }));

  // Deduplicate by URL — keep only the best-scoring snippet per resource
  const best = new Map<string, typeof scored[0]>();
  for (const item of scored) {
    const existing = best.get(item.entry.url);
    if (!existing || item.score > existing.score) best.set(item.entry.url, item);
  }

  return [...best.values()]
    .filter((s) => s.score >= SIMILARITY_THRESHOLD)
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((s, i) => ({
      index: i + 1,
      content: s.entry.doc.pageContent,
      source: {
        title: s.entry.title,
        url: s.entry.url,
        author: s.entry.author,
        type: s.entry.type,
        image: s.entry.image,
        video: s.entry.video,
        page: null,
      },
    }));
}

// ── Public retrieve function ────────────────────────────────────────────────

export async function retrieve(query: string, k = 3): Promise<RetrievedDoc[]> {
  // Remote vector endpoint (e.g. Chroma + HuggingFace sidecar)
  const endpoint = process.env.RETRIEVAL_ENDPOINT;
  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, k }),
      });
      if (res.ok) {
        const data = (await res.json()) as { docs: RetrievedDoc[] };
        if (Array.isArray(data.docs)) return data.docs.slice(0, k);
      }
    } catch {
      // fall through
    }
  }

  // No API key — fall back to keyword scoring
  if (!process.env.GOOGLE_API_KEY) return keywordRetrieve(query, k);

  try {
    return await semanticRetrieve(query, k);
  } catch {
    return keywordRetrieve(query, k);
  }
}

// ── Keyword fallback ────────────────────────────────────────────────────────

const STOPWORDS = new Set([
  "the", "a", "an", "of", "and", "or", "to", "in", "on", "for", "is", "are", "was", "were",
  "with", "by", "as", "at", "from", "that", "this", "it", "its", "be", "been", "being",
  "what", "who", "why", "how", "where", "when", "do", "does", "did", "tell", "me", "about",
  "في", "من", "على", "إلى", "عن", "هو", "هي", "ما", "هل", "كيف", "متى", "لماذا", "أي",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

type KeywordEntry = { title: string; author: string; url: string; type: string; snippet: string; image?: string; video?: string };

const keywordCorpus: KeywordEntry[] = resources.flatMap((r) =>
  (r.snippets || []).map((s) => ({
    title: r.title, author: r.author, url: r.url, type: r.type, snippet: s,
    image: (r as { image?: string }).image,
    video: (r as { video?: string }).video,
  }))
);

function keywordRetrieve(query: string, k: number): RetrievedDoc[] {
  const qTokens = new Set(tokenize(query));
  if (qTokens.size === 0) return [];

  const scored = keywordCorpus
    .map((entry) => {
      const docTokens = tokenize(`${entry.title} ${entry.snippet}`);
      let score = 0;
      for (const t of docTokens) if (qTokens.has(t)) score += 1;
      for (const t of tokenize(entry.title)) if (qTokens.has(t)) score += 0.5;
      return { entry, score };
    })
    .filter((s) => s.score > 0);

  // Deduplicate by URL — keep only the best-scoring snippet per resource
  const best = new Map<string, typeof scored[0]>();
  for (const item of scored) {
    const existing = best.get(item.entry.url);
    if (!existing || item.score > existing.score) best.set(item.entry.url, item);
  }

  return [...best.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
    .map((s, i) => ({
      index: i + 1,
      content: s.entry.snippet,
      source: { title: s.entry.title, url: s.entry.url, author: s.entry.author, type: s.entry.type, image: s.entry.image, video: s.entry.video, page: null },
    }));
}

// ── Helpers ─────────────────────────────────────────────────────────────────

export function buildContextBlock(docs: RetrievedDoc[]): string {
  if (!docs.length) return "";
  return docs.map((d) => `[${d.index}] ${d.content}`).join("\n\n");
}

export function formatSourcesBlock(docs: RetrievedDoc[]): string {
  if (!docs.length) return "";
  return docs
    .map((d) => {
      const author = d.source.author ? ` — ${d.source.author}` : "";
      const page = d.source.page != null ? ` (p.${d.source.page})` : "";
      return `[${d.index}] ${d.source.title}${author} — ${d.source.url}${page}`;
    })
    .join("\n");
}
