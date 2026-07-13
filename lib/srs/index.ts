import {
  fsrs,
  generatorParameters,
  createEmptyCard,
  Rating,
  type Card,
} from "ts-fsrs";
import type { FsrsCardJson } from "@/lib/db/schema";

export type DrillRating = "again" | "hard" | "good" | "easy";

const scheduler = fsrs(generatorParameters({ enable_fuzz: true }));

// `as const` keeps the values as literal Grade members (not the whole Rating
// enum, which includes Manual and would not type-check against next()).
const RATING_MAP = {
  again: Rating.Again,
  hard: Rating.Hard,
  good: Rating.Good,
  easy: Rating.Easy,
} as const;

function toJson(card: Card): FsrsCardJson {
  return {
    due: card.due.toISOString(),
    stability: card.stability,
    difficulty: card.difficulty,
    elapsed_days: card.elapsed_days,
    scheduled_days: card.scheduled_days,
    learning_steps: card.learning_steps,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state,
    last_review: card.last_review ? card.last_review.toISOString() : null,
  };
}

export function newFsrsCard(now: Date = new Date()): FsrsCardJson {
  return toJson(createEmptyCard(now));
}

export interface ReviewResult {
  card: FsrsCardJson;
  due: Date;
  state: number;
  prevState: number;
}

export function reviewFsrsCard(
  stored: FsrsCardJson,
  rating: DrillRating,
  now: Date = new Date(),
): ReviewResult {
  const prevState = stored.state;
  // ts-fsrs CardInput accepts string dates, so `stored` passes through directly.
  const { card } = scheduler.next(stored, now, RATING_MAP[rating]);
  return {
    card: toJson(card),
    due: card.due,
    state: card.state,
    prevState,
  };
}
