"use server";

import { revalidatePath } from "next/cache";
import { and, asc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { folders, type Folder } from "@/lib/db/schema";
import type { Language } from "@/lib/lang";

function revalidateCards() {
  revalidatePath("/", "layout");
}

export async function listFolders(lang: Language): Promise<Folder[]> {
  return getDb()
    .select()
    .from(folders)
    .where(eq(folders.language, lang))
    .orderBy(asc(folders.name));
}

/** Create a folder; if the name already exists in this language, return the existing one. */
export async function createFolder(
  lang: Language,
  name: string,
): Promise<Folder | null> {
  const trimmed = name.trim();
  if (!trimmed) return null;

  const db = getDb();
  const [created] = await db
    .insert(folders)
    .values({ language: lang, name: trimmed })
    .onConflictDoNothing({ target: [folders.language, folders.name] })
    .returning();
  const folder =
    created ??
    (
      await db
        .select()
        .from(folders)
        .where(and(eq(folders.language, lang), eq(folders.name, trimmed)))
        .limit(1)
    )[0];
  revalidateCards();
  return folder ?? null;
}

export async function renameFolder(id: string, name: string) {
  const trimmed = name.trim();
  if (!trimmed) return;
  try {
    await getDb()
      .update(folders)
      .set({ name: trimmed })
      .where(eq(folders.id, id));
  } catch {
    // Duplicate name — keep the old one.
  }
  revalidateCards();
}

/** Delete a folder; its cards become unfiled (FK sets folder_id to null). */
export async function deleteFolder(id: string) {
  await getDb().delete(folders).where(eq(folders.id, id));
  revalidateCards();
}
