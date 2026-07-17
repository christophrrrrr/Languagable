"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { savedCards, issues, conversations } from "@/lib/db/schema";
import { newFsrsCard, reviewFsrsCard, type DrillRating } from "@/lib/srs";
import { isLanguage, type Language } from "@/lib/lang";
import { issueCardNote } from "@/lib/i18n";

// Cards pages live under /[lang]/tarjetas and counts surface on /[lang] — a
// layout-wide revalidate keeps every language's views fresh.
function revalidateCards() {
  revalidatePath("/", "layout");
}

async function conversationLanguage(id: string): Promise<Language | null> {
  const [row] = await getDb()
    .select({ language: conversations.language })
    .from(conversations)
    .where(eq(conversations.id, id))
    .limit(1);
  return row && isLanguage(row.language) ? row.language : null;
}

export async function addSavedCard(input: {
  phrase: string;
  meaning: string;
  note?: string;
  folderId?: string | null;
  sourceConversationId?: string | null;
}) {
  const phrase = input.phrase.trim();
  const meaning = input.meaning.trim();
  if (!phrase || !meaning) return;

  const language = input.sourceConversationId
    ? ((await conversationLanguage(input.sourceConversationId)) ?? "es")
    : "es";

  await getDb().insert(savedCards).values({
    language,
    phrase,
    meaning,
    note: input.note?.trim() || null,
    folderId: input.folderId ?? null,
    sourceConversationId: input.sourceConversationId ?? null,
    due: new Date(),
    state: 0,
    fsrs: newFsrsCard(),
  });
  revalidateCards();
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
  revalidateCards();
}

/** Move a card to a folder (null = unfiled). */
export async function moveSavedCard(cardId: string, folderId: string | null) {
  await getDb()
    .update(savedCards)
    .set({ folderId })
    .where(eq(savedCards.id, cardId));
  revalidateCards();
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

  const language =
    (await conversationLanguage(issue.conversationId)) ?? "es";

  await db.insert(savedCards).values({
    language,
    phrase: issue.correction,
    meaning: issue.explanation,
    note: issueCardNote(language, issue.original),
    sourceConversationId: issue.conversationId,
    due: new Date(),
    state: 0,
    fsrs: newFsrsCard(),
  });
  revalidatePath(`/report/${issue.conversationId}`);
  revalidateCards();
}
