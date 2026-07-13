import Link from "next/link";
import { getSavedCards, getDueSavedCards } from "@/lib/db/queries";
import { SavedCards, type SavedCardView } from "@/components/SavedCards";

export const dynamic = "force-dynamic";

type Row = Awaited<ReturnType<typeof getSavedCards>>[number];
const toView = (c: Row): SavedCardView => ({
  id: c.id,
  phrase: c.phrase,
  meaning: c.meaning,
  note: c.note,
  state: c.state,
});

export default async function ProgressPage() {
  let cards: SavedCardView[] = [];
  let due: SavedCardView[] = [];
  let dbReady = true;
  try {
    const [all, dueRows] = await Promise.all([
      getSavedCards(),
      getDueSavedCards(),
    ]);
    cards = all.map(toView);
    due = dueRows.map(toView);
  } catch {
    dbReady = false;
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Tus tarjetas</h1>
        <Link href="/" className="text-sm underline opacity-70">
          Inicio
        </Link>
      </div>
      <p className="mt-1 text-sm opacity-70">
        Lo que has guardado para practicar. Repasa cuando quieras.
      </p>

      {!dbReady ? (
        <p className="mt-8 text-sm opacity-70">
          La base de datos no está configurada.
        </p>
      ) : (
        <SavedCards cards={cards} due={due} />
      )}
    </main>
  );
}
