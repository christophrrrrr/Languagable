// Seeds the concept taxonomies (content-as-code) and starter card folders
// for every language. Run with: npm run seed
import { allConcepts } from "../content/concepts";
import { getDb } from "../lib/db/client";
import { concepts as conceptsTable, folders } from "../lib/db/schema";
import type { Language } from "../lib/lang";

for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch {
    // not present — ignore
  }
}

const STARTER_FOLDERS: Record<Language, string[]> = {
  es: ["Dichos", "Vocabulario", "Expresiones"],
  fr: ["Dictons", "Vocabulaire", "Expressions"],
  pt: ["Ditados", "Vocabulário", "Expressões"],
};

async function main() {
  const db = getDb();
  for (const c of allConcepts) {
    await db
      .insert(conceptsTable)
      .values({
        slug: c.slug,
        label: c.label,
        dimension: c.dimension,
        description: c.description,
        peninsularNotes: c.peninsularNotes ?? null,
      })
      .onConflictDoUpdate({
        target: conceptsTable.slug,
        set: {
          label: c.label,
          dimension: c.dimension,
          description: c.description,
          peninsularNotes: c.peninsularNotes ?? null,
        },
      });
  }
  console.log(`Seeded ${allConcepts.length} concepts.`);

  let folderCount = 0;
  for (const [language, names] of Object.entries(STARTER_FOLDERS)) {
    for (const name of names) {
      await db
        .insert(folders)
        .values({ language, name })
        .onConflictDoNothing({ target: [folders.language, folders.name] });
      folderCount++;
    }
  }
  console.log(`Seeded ${folderCount} starter folders.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
