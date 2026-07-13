import { and, asc, desc, eq, lte } from "drizzle-orm";
import { getDb } from "./client";
import { conversations, issues, messages, savedCards } from "./schema";

export async function getConversation(id: string) {
  const [row] = await getDb()
    .select()
    .from(conversations)
    .where(eq(conversations.id, id))
    .limit(1);
  return row ?? null;
}

export async function getMessages(conversationId: string) {
  return getDb()
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(messages.index));
}

export async function getIssues(conversationId: string) {
  return getDb()
    .select()
    .from(issues)
    .where(eq(issues.conversationId, conversationId))
    .orderBy(desc(issues.confidence));
}

export async function listRecentConversations(limit = 20) {
  return getDb()
    .select()
    .from(conversations)
    .orderBy(desc(conversations.startedAt))
    .limit(limit);
}

export async function getSavedCards() {
  return getDb()
    .select()
    .from(savedCards)
    .orderBy(desc(savedCards.createdAt));
}

export async function getDueSavedCards(now: Date = new Date()) {
  return getDb()
    .select()
    .from(savedCards)
    .where(lte(savedCards.due, now))
    .orderBy(asc(savedCards.due));
}
