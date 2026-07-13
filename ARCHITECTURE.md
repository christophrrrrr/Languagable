# Languagable — Architecture

> A personal, text-based tool to refine **Peninsular Spanish** for an already-conversational speaker. It holds open conversations, reliably catches your real mistakes, and drills the recurring ones until they stop.
>
> This document supersedes the original "Chessable for Spanish" framing in `languagable vision.md`. See [Why the reframe](#why-the-reframe) for what changed and why.

---

## 1. What this is (and isn't)

**Is:** a Peninsular-Spanish *sparring partner + error clinic*. You converse freely in text; the system captures the mistakes you actually make across four dimensions (grammar, vocabulary/word-choice, naturalness, fluency/flow), clusters them into recurring **error patterns**, and drills those patterns with spaced repetition until they fade from your real output.

**Isn't:** a scripted course platform, a chatbot to "have interesting conversations" with, or a beginner app. There are no restaurant missions, no XP, no hidden objectives to grade against.

### Confirmed constraints

| Decision | Value | Consequence |
|---|---|---|
| Users | Just you (personal tool) | No multi-tenant concerns; auth optional; overrides/curation are cheap and central. |
| Modality | Text only | Targets production *accuracy*; no STT/TTS/pronunciation. |
| Learner level | Already conversational (intermediate/advanced) | Conversation-first works; the value is refinement, not acquisition. |
| Target variety | **Peninsular Spanish (Spain)** | vosotros + Peninsular vocab are *correct*; Latin-Americanisms are flagged as upgrades. Must never miscorrect valid Peninsular usage. |
| Focus dimensions | Grammar · Vocabulary/word-choice · Naturalness · Fluency/flow | Errors vs. upgrades are treated distinctly (see §4). |
| Review layer | Full spaced-repetition drilling (FSRS) | Recurring mistakes are scheduled and tracked over time. |

### Why the reframe

The original vision modeled the product on Chessable (scripted courses → missions → mastery %). Two problems for this user:
- **Chess is finite and objectively gradeable; language production is open-ended and generative.** Scripted scenarios risk training *recall of scripts* rather than *generative accuracy* — a phrasebook, not fluency.
- **He's already conversational.** Beginner scaffolding (greet the waiter, ask for a table) is the wrong center of gravity. The vision's sidebar idea — *repair courses that target detected weaknesses* — is exactly right for him, so it becomes the **whole** product.

Everything below follows from those two corrections.

---

## 2. The one idea everything hangs on: the concept taxonomy

A single **Peninsular-aware concept taxonomy** (`ser_vs_estar`, `por_vs_para`, `subjuntivo_despues_de`, `concordancia_genero`, `preterito_vs_imperfecto`, `falsos_amigos`, `latinoamericanismo_lexico`, `conectores_discursivos`, …) is the shared key across issues, error patterns, drills, and progress.

This is what closes the loop with plain queries instead of bespoke logic: a mistake is tagged to a concept → clustered into an error pattern for that concept → drilled → and its frequency in fresh writing is tracked to tell you whether that concept is improving. Get this taxonomy right and the "coach that knows my weaknesses" behavior is mostly `GROUP BY concept_id`.

---

## 3. Core loop

```
Converse (open/topic chat, Peninsular)
      ↓  no mid-conversation nagging
Analyze (one structured pass over the transcript)
      ↓  issues: correction + concept + severity + CONFIDENCE + class(error|upgrade)
Coach (prioritized report: strengths + top issues; you accept / dismiss)
      ↓
Capture → cluster into error_patterns → generate drill cards (FSRS)
      ↓
Drill over time (fresh instances, production-biased)
      ↓
Track pattern frequency in NEW output → Improving / Active / New
```

The LLM is present at exactly two points (converse, analyze) and **proposes** only. Everything durable — clustering, scheduling, progress math — is deterministic code. *LLM proposes, code disposes.*

---

## 4. Trust architecture (the spine)

The single biggest risk is a **confidently-wrong correction**: it teaches you bad Spanish *and* destroys trust, and if it feeds progress data, it corrupts everything downstream. The design treats correction reliability as a first-class engineering problem, not an accuracy metric to hope for.

| Mechanism | Purpose |
|---|---|
| **Detectors vs. LLM split** | Deterministic / lemma-based detectors handle categories they can do reliably: gender & number agreement, ser/estar copular use, por/para, subjunctive triggers, common false friends, and Latin-Americanism vocab flags (e.g. `carro→coche`, `computadora→ordenador`, `¿mande?→¿cómo?`). The LLM only judges the inherently subjective dimensions (naturalness, flow, some word-choice). Trustworthy categories become genuinely trustworthy; the model can't hallucinate a grammar rule in a lane it doesn't own. |
| **Confidence on every issue** | Each issue carries a `confidence`. Low-confidence issues render as *"possible — worth checking,"* never asserted. Durable state (creating a drill card, updating a pattern) requires confidence above a threshold. |
| **Errors vs. Upgrades** | Two distinct classes. **Error** = actually wrong → asserted. **Upgrade** = correct but not native/optimal → offered as *"a native would more likely say…"*. This is what prevents *"it marked my correct Spanish as wrong."* All four dimensions are active, but the subjective ones are clearly labeled suggestions and are lenient by default. |
| **One-click override** | Every issue has *this is wrong* / *this is fine → dismiss*. Dismissed issues never become cards and suppress the same false positive going forward, accumulating a personal "known-good / my style" list. This is what makes a wrong correction **recoverable rather than trust-ending** — for a single user it's trivial to build and is the safety valve for LLM fallibility. |
| **Peninsular lock** | The conversation and analysis prompts, plus the detector set, are pinned to Peninsular norms so vosotros and Spain vocabulary are correct and Latin-Americanisms surface as upgrades. (Default-tuned models will "fix" valid vosotros — this must be prevented.) |

**Rule:** only `error`-class, high-confidence, non-dismissed issues create drill cards and move pattern state by default. Upgrades and low-confidence items inform the report but don't silently reshape your progress data.

---

## 5. Drilling: card formats that fight the transfer gap

Reviewing a production skill with multiple-choice recognition trains recognition, not production — the transfer gap. So the card types are biased toward **producing** and **noticing**, and each review uses a **fresh generated instance** of the pattern rather than re-showing the identical card (learn the rule, not the answer to one card).

| Card type | Prompt | Trains | Grading |
|---|---|---|---|
| **Correction** | Produce the Spanish from a meaning/context | Production | Detector where possible; else LLM + your override |
| **Error-spot** | Here's a sentence with your error pattern — fix it | Self-noticing (transfers to mid-conversation self-correction) | Detector / LLM |
| **Contrast** | Minimal-pair context for a confusion (por/para, ser/estar, subj/ind) | The specific decision boundary | Detector (usually deterministic) |
| **Reformulation** | Make this literal phrasing sound native | The upgrade habit | LLM, lenient |

Scheduling is **FSRS** (`ts-fsrs`), fully deterministic and instant — **the LLM is never in the review hot path.**

---

## 6. Progress: error-pattern reduction, not "mastery %"

There is no `Course: 68%`. For an accuracy-focused solo learner the honest, motivating signal is: **for each error pattern, is it getting rarer in my real writing?**

- For each `error_pattern`, track **occurrences per 1,000 words in fresh conversation** over time (from append-only `pattern_observations`), plus drill performance.
- A pattern is **Improving** when its frequency in *new* output drops — the real transfer test, not a card score.
- Presented as three buckets: **Improving · Still active · Newly detected.**
- Nothing decays on a timer. A pattern only "reactivates" if you actually make that mistake again — so there's no arbitrary number to fret over and no fake-urgency treadmill (which the original vision rightly wanted to avoid, yet a decaying % would have reintroduced).
- Guard against early noise: a pattern needs **N observations** before it's called "active" rather than a hypothesis.

---

## 7. Stack

| Layer | Choice | Notes |
|---|---|---|
| App | **Next.js (App Router) + React + TypeScript** | One codebase; Server Components for data; native streaming for the chat. |
| Backend | **Route Handlers + Server Actions** over framework-agnostic `lib/` modules | Thin orchestration; all domain logic is pure and testable in `lib/`. |
| DB | **Supabase Postgres** via **Drizzle ORM** | Relational core + JSONB for transcripts/AI metadata; `pgvector` later if we want semantic clustering of issues. Prisma is an acceptable alternative. |
| Auth | **Optional** (Supabase Auth if/when wanted) | Single user → can run local-first; add auth only for multi-device sync. |
| State | Server Components/Actions default · **TanStack Query** for live chat + review session · **Zustand** for ephemeral UI | Minimal client state. |
| Styling | **Tailwind + shadcn/ui** | Calm, focused, you-own-the-components aesthetic. |
| AI | **Vercel AI SDK (`ai`)** behind `lib/ai` | Provider-agnostic (Claude/OpenAI as config). Streaming for chat; `generateObject` + Zod for the structured analysis pass. |
| SRS | **`ts-fsrs`** | Deterministic scheduling; wrapped behind a `lib/srs` interface. |

### AI usage (two phases, both behind `lib/ai`)

1. **Conversation** — streaming, cheaper/faster model tier. System prompt: natural Peninsular interlocutor; keep it flowing; **do not** correct mid-conversation. Static prompt is prompt-cached across turns.
2. **Analysis** — stronger model tier, **one `generateObject` call** over the full transcript returning a Zod-validated object: strengths, and an array of issues (span, original, correction, class, dimension, concept_id, severity, confidence). Deterministic code then dedupes into patterns, assigns FSRS, updates progress. Model IDs are config, not code.

---

## 8. Data model

Curriculum tables (`courses`/`missions`/`objectives`) are **removed**. A light `topics` list seeds conversations instead.

| Table | Key fields | Notes |
|---|---|---|
| `conversations` | `id, topic, model, started_at, ended_at` | One row per session. |
| `messages` | `id, conversation_id, role, content, index, tokens, created_at` | Ordered transcript, append-only. |
| `issues` | `id, conversation_id, message_id, span, original, correction, class(error\|upgrade), dimension(grammar\|vocab\|naturalness\|flow), concept_id, severity, confidence, status(open\|accepted\|dismissed), source(detector\|llm), created_at` | The atomic unit; carries the trust signals. |
| `concepts` | `id, slug, label, dimension, peninsular_notes` | The taxonomy backbone. Seeded as content-as-code. |
| `error_patterns` | `id, concept_id, signature, label, state(hypothesis\|active\|improving\|resolved), first_seen, last_seen` | Clustering unit for issues. |
| `pattern_observations` | `pattern_id, conversation_id, occurrences, words_in_conversation, observed_at` | **Append-only.** Drives frequency-per-1,000-words over time (the progress signal). |
| `drill_cards` | `id, pattern_id, type(correction\|spot\|contrast\|reformulation), generator_config(jsonb), due, state, stability, difficulty, reps, lapses, last_reviewed_at` | FSRS state inline; `generator_config` produces fresh instances. |
| `review_logs` | `id, card_id, rating(again\|hard\|good\|easy), reviewed_at, prev/next interval + stability` | **Append-only** — analytics, FSRS tuning, history through migrations. |

---

## 9. Folder structure

```
languagable/
  app/
    (app)/
      chat/[conversationId]/     # live conversation
      report/[conversationId]/   # post-session coaching report (accept/dismiss issues)
      drills/                    # FSRS review session
      progress/                  # patterns: improving / active / new
    api/chat/route.ts            # streaming conversation endpoint
  components/ui/                 # shadcn primitives + app components
  lib/
    ai/                          # AI SDK wrappers, prompts/, schemas.ts (Zod), conversation.ts, analysis.ts
    detectors/                   # deterministic + lemma detectors (Peninsular-aware); false-positive suppression
    patterns/                    # cluster issues → error_patterns; frequency math (pure)
    srs/                         # ts-fsrs wrapper (pure)
    progress/                    # improving/active/new bucketing (pure)
    db/                          # schema.ts (drizzle), client.ts, queries/
    supabase/                    # @supabase/ssr helpers (only if auth enabled)
  server/                        # server actions: conversations, analysis, drills, overrides
  content/                       # concepts.ts (taxonomy) + topics.ts — content-as-code, seeded to DB
  drizzle/                       # migrations
  config/  types/  tests/
```

Principle: `app/` + `server/` stay thin. The correctness-critical, LLM-free core — `detectors`, `patterns`, `srs`, `progress` — lives in pure `lib/` modules with explicit interfaces and unit tests.

---

## 10. Open risks (honest)

1. **Naturalness/flow grading is inherently subjective and model-dependent** — keep it lenient, clearly "suggestion," overridable, and never let it drive hard state on its own.
2. **Peninsular detector coverage is a build-up-over-time effort** — the LLM covers gaps early but at lower trust; grow the deterministic set as real error patterns surface.
3. **Pattern-frequency signal is noisy until enough writing accumulates** — enforce the N-observations gate before calling a pattern "active."
4. **LLM categorization drift** (same mistake tagged differently across sessions) — mitigated by pinning to the fixed `concepts` taxonomy and a stable Zod output schema.
5. **Typos vs. real errors** — a slip heuristic + the confidence gate prevent fat-finger noise from spawning bogus patterns.

---

## 11. Verification (as it's built)

- **Unit tests** for the LLM-free core: `lib/detectors` (correct flags, no false positives on valid Peninsular usage incl. vosotros), `lib/patterns` (clustering + frequency math), `lib/srs` (scheduling transitions), `lib/progress` (bucketing).
- **A fixed-transcript eval harness** for the analysis pass: known transcripts with known issues → assert the returned issues' shape, concept tags, and error-vs-upgrade classification before shipping prompt changes.
- **End-to-end walk** via `next dev`: hold a short conversation → get a report → accept/dismiss issues → confirm accepted ones create pattern-clustered drills → run a drill → confirm reschedule and that a repeated mistake in a *new* conversation moves the pattern's frequency.

---

## 12. Out of scope (for now)

Native/mobile, speech & pronunciation, multi-user, exact model IDs/pricing, and any commercial concerns (billing, moat, growth). Revisit only if this stops being a personal tool.

---

## First build slice (recommended)

The highest-leverage starting point is the taxonomy + schema + one thin vertical slice:

1. `content/concepts.ts` — a first Peninsular-aware concept taxonomy.
2. Drizzle schema for `conversations`, `messages`, `issues`, `concepts` (patterns/drills can follow).
3. A single `chat → analyze → issue report` flow you can actually use, with the errors-vs-upgrades + confidence + dismiss UI — so the trust model is proven before the SRS layer is built on top of it.
