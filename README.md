# Languagable

A personal, text-based tool to refine **Peninsular Spanish**. Hold open
conversations, get your real mistakes caught reliably, and drill the recurring
ones with spaced repetition until they stop.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full design and reasoning.

## Status

Full loop working end-to-end (chat → analyze → report → drill → progress):

- Next.js 16 (App Router) + TypeScript + Tailwind.
- **Concept taxonomy** (`content/concepts.ts`, 23 concepts) + topics.
- Full **Drizzle schema** (`lib/db/schema.ts`) on Postgres (Neon/Supabase/local).
- **Trust core:** deterministic Peninsular-aware detectors (`lib/detectors/`)
  with unit tests, incl. no-false-positive guards.
- **Provider-agnostic AI** (`lib/ai/`) via the Vercel AI SDK — defaults to
  Google/Gemini; Anthropic and OpenAI are wired for a config-only swap.
- **Conversational tutor with inline correction** (`/api/chat`,
  `lib/ai/prompts.ts`) — a casual Peninsular friend that, each turn, first
  corrects your last message (errors + naturalness, only when needed) and then
  continues the conversation.
- **Tense-practice mode** (`lib/tense/`) — pick a tense; a deterministic opening
  explains the exercise and shows a correct conjugation reference (from the
  unit-tested `lib/conjugation/` engine), then the AI steers the chat to force
  that tense and corrects your conjugations.
- **End-of-chat report** (`/report/[id]`, `lib/analysis/`) — merges deterministic
  detectors + LLM into **errors** vs **upgrades**; each can be saved as a
  practice card.
- **Saved cards** (`/progress`, `components/SavedCards.tsx`) — manually save
  phrases you like/learn (a "+ Guardar frase" button in the chat header,
  pre-filled with the AI's last line) or turn a report error into a card. Cards
  are phrase + meaning; practice the **due** ones with the FSRS reveal-and-rate
  flow (`lib/srs/`). This is what "Progress" tracks now.

## Setup

### 1. Install

```bash
npm install
cp .env.example .env.local
```

### 2. Database (Neon, or any Postgres)

Uses the standard `pg` (node-postgres) driver, so any Postgres works — Neon,
Supabase, or local.

**Neon:**
1. Create a project at [neon.tech](https://neon.tech).
2. On the project dashboard, open **Connection string** and turn **"Pooled
   connection" OFF** (the direct connection is simplest for a single-user app
   and for migrations). It ends with `?sslmode=require`.
3. Put it in `.env.local` as `DATABASE_URL`.

You do **not** need "Neon Auth" — that's for adding user login/signup to
multi-user apps. This is a single-user tool with no accounts.

### 3. AI key (Gemini, free)

1. Get a key at [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
2. Put it in `.env.local` as `GOOGLE_GENERATIVE_AI_API_KEY`.
   (`AI_PROVIDER=google` is the default. To switch later, change `AI_PROVIDER`
   and set the matching key — no code changes.)

### 4. Create tables + seed the taxonomy

```bash
npm run db:push   # create tables from lib/db/schema.ts
npm run seed      # seed the concept taxonomy (required before analysis)
```

### 5. Run

```bash
npm run dev       # http://localhost:3000
```

Pick a topic → chat in Spanish → **Terminar y analizar** → review your report.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Dev server. |
| `npm run build` | Production build. |
| `npm run typecheck` | `tsc --noEmit`. |
| `npm test` | Unit tests (Vitest). |
| `npm run db:push` / `db:generate` / `db:migrate` | Drizzle schema. |
| `npm run seed` | Seed the concept taxonomy. |

## Deploy (Vercel)

The app is a standard Next.js App Router project — Vercel auto-detects it.

1. Push this repo to GitHub (already done if you're reading this there).
2. On [vercel.com](https://vercel.com), **New Project → Import** this repo.
3. Add these **Environment Variables** (copy the values from your `.env.local`):

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | your Neon connection string |
   | `AI_PROVIDER` | `google` |
   | `AI_CONVERSATION_MODEL` | `gemini-2.5-flash` |
   | `AI_ANALYSIS_MODEL` | `gemini-2.5-flash` |
   | `GOOGLE_GENERATIVE_AI_API_KEY` | your Gemini key |

4. Deploy. The same Neon database is used, so the tables/seed are already in
   place — no extra setup.

Tips:
- To reduce DB latency, set the Vercel **Function Region** to Frankfurt (`fra1`)
  under Project Settings → Functions (matches the Neon `eu-central-1` region).
- Netlify also works (it auto-detects Next.js); use the same environment
  variables.

## Notes

- Pin TypeScript to the **5.x** line — Next 16's build-time TS integration does
  not yet support the native TypeScript 7 package.
- Gemini models: `gemini-2.5-flash` (verified working for chat and analysis).
  For stronger analysis set `AI_ANALYSIS_MODEL=gemini-2.5-pro`. Note some older
  IDs (e.g. `gemini-2.0-flash`) are deprecated and will error.
- The DB layer uses `pg` (node-postgres), which works with Neon, Supabase, and
  local Postgres alike.
