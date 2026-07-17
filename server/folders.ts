"use server";

import { revalidatePath } from "next/cache";
import { asc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { folders, type Folder } from "@/lib/db/schema";

function revalidateTarjetas() {
  revalidatePath("/tarjetas");
  revalidatePath("/");
}

export async function listFolders(): Promise<Folder[]> {
  return getDb().select().from(folders).orderBy(asc(folders.name));
}

/** Create a folder; if the name already exists, return the existing one. */
export async function createFolder(name: string): Promise<Folder | null> {
  const trimmed = name.trim();
  if (!trimmed) return null;

  const db = getDb();
  const [created] = await db
    .insert(folders)
    .values({ name: trimmed })
    .onConflictDoNothing({ target: folders.name })
    .returning();
  const folder =
    created ??
    (
      await db.select().from(folders).where(eq(folders.name, trimmed)).limit(1)
    )[0];
  revalidateTarjetas();
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
  revalidateTarjetas();
}

/** Delete a folder; its cards become unfiled (FK sets folder_id to null). */
export async function deleteFolder(id: string) {
  await getDb().delete(folders).where(eq(folders.id, id));
  revalidateTarjetas();
}
