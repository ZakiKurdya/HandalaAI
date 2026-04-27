# Handala — حنظلة

A bilingual, citation-first AI companion for learning Palestinian history, geography, and culture. This repo replaces the original Gradio + LangGraph notebook with a production-ready Next.js application that preserves the verbatim Handala system prompt and the corpus-grounding contract.

> **ذاكرة لا تموت** — A memory that never dies.

## Stack

- **Next.js 14** (App Router, RSC where possible, API routes for the backend)
- **Tailwind CSS** + custom design system (olive / sand / carmine, tatreez & kufiya motifs)
- **Framer Motion** for transitions, parallax, and micro-interactions
- **next-themes** for system-aware dark/light with smooth toggle
- **@google/generative-ai** for Gemini 2.5 Flash (matches the notebook)
- **Zod** for DTO validation in the API layer

## Architecture

```
src/
├── app/                      Next.js App Router
│   ├── api/                  Route handlers (controllers)
│   │   ├── chat/route.ts     SSE streaming endpoint
│   │   ├── resources/route.ts
│   │   └── contributions/route.ts
│   ├── chat/                 Chat UI page (sidebar + stream)
│   ├── resources/            Curated resources dashboard
│   ├── contribute/           Public contribution form + guide
│   └── verification/         Verification pipeline page
├── modules/                  NestJS-style backend modules
│   ├── chat/                 chat.service + chat.dto
│   ├── resources/            in-memory store + Zod schema
│   └── contributions/        submission queue
├── lib/
│   ├── ai/
│   │   ├── system-prompt.ts  Verbatim Handala prompt from the notebook
│   │   ├── retrieval.ts      Pluggable retriever (local keyword scorer or remote)
│   │   └── gemini.ts         Streaming Gemini wrapper + deterministic mock fallback
│   └── storage.ts            localStorage-backed conversation store
├── components/               UI components (chat, layout, landing, patterns)
├── i18n/                     EN/AR dictionary + RTL provider
└── data/resources.json       Seed corpus (Khalidi, Said, Pappé, Palquest, MoC, Wikipedia)
```

The `modules/` layout mirrors a NestJS `controller / service / dto` split. To extract into a standalone NestJS service, lift each module folder, wrap its service in `@Injectable()`, and replace the Next.js route handlers with NestJS controllers. The retrieval layer is already an HTTP-callable interface (`RETRIEVAL_ENDPOINT`).

## Running

```bash
cp .env.example .env.local
# Optional: set GOOGLE_API_KEY for live Gemini responses.
# Without a key, the chat falls back to a deterministic mock that streams
# the retrieved snippets verbatim, so the UI is fully usable offline.

npm install
npm run dev
```

Open `http://localhost:3000`.

### Hooking the original notebook pipeline

The notebook builds a Chroma index over Khalidi, Said, and Pappé plus a set of Wikipedia pages, and exposes retrieval through a LangGraph node. To use that pipeline instead of the bundled in-memory keyword scorer:

1. Wrap the LangGraph `retrieve` tool in a small FastAPI service that accepts `POST { query, k }` and returns `{ docs: [{ index, content, source: { title, url, page } }] }`.
2. Set `RETRIEVAL_ENDPOINT=http://localhost:8000/retrieve` in `.env.local`.

The Gemini wrapper will pull from your endpoint, build the numbered context block, and feed it into the same `{context}` placeholder the notebook uses.

## Features

### Chat
- ChatGPT-style layout with collapsible sidebar (drawer on mobile)
- SSE streaming with token-by-token rendering and a typing indicator
- Persistent conversation history in `localStorage` (search, rename, delete)
- Per-message **Evidence-based** badge, collapsible **Sources** block, copy/share
- Message-level animations via Framer Motion

### Landing
- Parallax hero with olive-branch and kufiya overlays
- Bilingual hero: Arabic tagline rendered in the Cairo display weight
- "Why / How / Trust" sections with scroll-in motion
- A live example of a citation-formatted answer

### Resources / Contribute / Verification
- Searchable, filterable resource grid with verified badges
- Inline "Add resource" form (POST `/api/resources`)
- Public contribution form with a guide block (POST `/api/contributions`)
- Verification pipeline visualized as a 6-step rail with a disputed-content callout

### i18n + RTL
- Full RTL flip (`dir="rtl"`, logical properties throughout: `start/end`, `me/ms`)
- Cairo for Arabic, Inter for Latin — applied via Next.js font loader
- One-tap language toggle persisted to `localStorage`
- System-language detection on first load

### Theming
- `next-themes` with `attribute="class"`; CSS custom properties for light/dark
- Smooth icon flip animation on the toggle
- Tatreez patterns adapt their stroke color per theme

## System prompt

`src/lib/ai/system-prompt.ts` contains the Handala system prompt **verbatim** from the notebook (`handala-chatbot` LangSmith hub prompt), with `{context}` replaced at request time by the numbered retrieval block. The greeting/identity rule, citation integrity, scope gate, and "From general knowledge" labeling all flow through unchanged.

## Notes

- Conversation persistence is client-side (localStorage). For multi-device sync, point the storage layer at a backend.
- The in-memory resource and contribution stores reset per server process — wire them to a database (Postgres + Prisma is a clean fit) before deploying.
- The mock chat fallback exists so the entire UI is testable without an API key. It will not produce model-quality answers — set `GOOGLE_API_KEY` for production.
