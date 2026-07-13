"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { savedCards, issues } from "@/lib/db/schema";
import { newFsrsCard, reviewFsrsCard, type DrillRating } from "@/lib/srs";

export async function addSavedCard(input: {
  phrase: string;
  meaning: string;
  note?: string;
  sourceConversationId?: string | null;
}) {
  const phrase = input.phrase.trim();
  const meaning = input.meaning.trim();
  if (!phrase || !meaning) return;

  await getDb().insert(savedCards).values({
    phrase,
    meaning,
    note: input.note?.trim() || null,
    sourceConversationId: input.sourceConversationId ?? null,
    due: new Date(),
    state: 0,
    fsrs: newFsrsCard(),
  });
  revalidatePath("/progress");
}

export async function reviewSavedCard(cardId: string, rating: DrillRating) {
  const db = getDb();
  const [card] = await db
    .select()
    .from(savedCards)
    .where(eq(savedCards.id, cardId))
    .limit(1);
  if (!card) return;

  const r = reviewFsrsCard(card.fsrs, rating);
  await db
    .update(savedCards)
    .set({ fsrs: r.card, due: r.due, state: r.state })
    .where(eq(savedCards.id, cardId));
  // No revalidatePath here: the practice session iterates a client-side
  // snapshot; refreshing mid-session would shift the deck. The list is
  // refreshed via router.refresh() when the user returns to it.
}

export async function deleteSavedCard(cardId: string) {
  await getDb().delete(savedCards).where(eq(savedCards.id, cardId));
  revalidatePath("/progress");
}

/** Turn a report issue into a saved practice card (correct version = the phrase). */
export async function saveIssueAsCard(issueId: string) {
  const db = getDb();
  const [issue] = await db
    .select()
    .from(issues)
    .where(eq(issues.id, issueId))
    .limit(1);
  if (!issue) return;

  await db.insert(savedCards).values({
    phrase: issue.correction,
    meaning: issue.explanation,
    note: `Antes dijiste: «${issue.original}»`,
    sourceConversationId: issue.conversationId,
    due: new Date(),
    state: 0,
    fsrs: newFsrsCard(),
  });
  revalidatePath(`/report/${issue.conversationId}`);
  revalidatePath("/progress");
}
