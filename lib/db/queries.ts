import { and, asc, desc, eq, isNull, lte, sql } from "drizzle-orm";
import { getDb } from "./client";
import { conversations, folders, issues, messages, savedCards } from "./schema";

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

export async function getFolders() {
  return getDb().select().from(folders).orderBy(asc(folders.name));
}

export async function getFolder(id: string) {
  const [row] = await getDb()
    .select()
    .from(folders)
    .where(eq(folders.id, id))
    .limit(1);
  return row ?? null;
}

/** Card + due counts grouped by folder (folderId null = unfiled cards). */
export async function getFolderStats() {
  return getDb()
    .select({
      folderId: savedCards.folderId,
      total: sql<number>`count(*)::int`,
      due: sql<number>`(count(*) filter (where ${savedCards.due} <= now()))::int`,
    })
    .from(savedCards)
    .groupBy(savedCards.folderId);
}

/**
 * Saved cards, optionally scoped to a folder.
 * `undefined` = all cards, `null` = unfiled cards only, string = that folder.
 */
function folderFilter(folderId?: string | null) {
  if (folderId === undefined) return undefined;
  return folderId === null
    ? isNull(savedCards.folderId)
    : eq(savedCards.folderId, folderId);
}

export async function getSavedCards(folderId?: string | null) {
  return getDb()
    .select()
    .from(savedCards)
    .where(folderFilter(folderId))
    .orderBy(desc(savedCards.createdAt));
}

export async function getDueSavedCards(
  now: Date = new Date(),
  folderId?: string | null,
) {
  return getDb()
    .select()
    .from(savedCards)
    .where(and(lte(savedCards.due, now), folderFilter(folderId)))
    .orderBy(asc(savedCards.due));
}
