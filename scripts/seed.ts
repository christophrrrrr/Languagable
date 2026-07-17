// Seeds the concept taxonomy (content-as-code) and starter card folders.
// Run with: npm run seed
import { concepts as conceptSeed } from "../content/concepts";
import { getDb } from "../lib/db/client";
import { concepts as conceptsTable, folders } from "../lib/db/schema";

for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch {
    // not present — ignore
  }
}

async function main() {
  const db = getDb();
  for (const c of conceptSeed) {
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
  console.log(`Seeded ${conceptSeed.length} concepts.`);

  const starterFolders = ["Dichos", "Vocabulario", "Expresiones"];
  for (const name of starterFolders) {
    await db
      .insert(folders)
      .values({ name })
      .onConflictDoNothing({ target: folders.name });
  }
  console.log(`Seeded ${starterFolders.length} starter folders.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
