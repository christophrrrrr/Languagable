import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getFolder,
  getFolders,
  getSavedCards,
  getDueSavedCards,
} from "@/lib/db/queries";
import { FolderCards, type SavedCardView } from "@/components/FolderCards";

export const dynamic = "force-dynamic";

type Row = Awaited<ReturnType<typeof getSavedCards>>[number];
const toView = (c: Row): SavedCardView => ({
  id: c.id,
  phrase: c.phrase,
  meaning: c.meaning,
  note: c.note,
  state: c.state,
  folderId: c.folderId,
});

export default async function FolderPage({
  params,
  searchParams,
}: {
  params: Promise<{ folder: string }>;
  searchParams: Promise<{ practicar?: string }>;
}) {
  const { folder: slug } = await params;
  const { practicar } = await searchParams;

  // "todas" = all cards, "sueltas" = unfiled, otherwise a folder id.
  let scope: string | null | undefined;
  let title: string;
  let subtitle: string;
  if (slug === "todas") {
    scope = undefined;
    title = "Todas las tarjetas";
    subtitle = "Todo lo que has guardado, de todas las carpetas.";
  } else if (slug === "sueltas") {
    scope = null;
    title = "Sin carpeta";
    subtitle = "Tarjetas que aún no has metido en ninguna carpeta.";
  } else {
    const folder = await getFolder(slug).catch(() => null);
    if (!folder) notFound();
    scope = folder.id;
    title = folder.name;
    subtitle = "Solo las tarjetas de esta carpeta.";
  }

  const [all, due, folders] = await Promise.all([
    getSavedCards(scope),
    getDueSavedCards(new Date(), scope),
    getFolders(),
  ]);

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <Link href="/tarjetas" className="text-sm underline opacity-70">
          Carpetas
        </Link>
      </div>
      <p className="mt-1 text-sm opacity-70">{subtitle}</p>

      <FolderCards
        cards={all.map(toView)}
        due={due.map(toView)}
        folders={folders.map((f) => ({ id: f.id, name: f.name }))}
        autoStart={practicar === "1"}
      />
    </main>
  );
}
