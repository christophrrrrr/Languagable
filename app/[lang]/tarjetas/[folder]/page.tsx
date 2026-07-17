import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getFolder,
  getFolders,
  getSavedCards,
  getDueSavedCards,
} from "@/lib/db/queries";
import { FolderCards, type SavedCardView } from "@/components/FolderCards";
import { isLanguage } from "@/lib/lang";
import { ui } from "@/lib/i18n";

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
  params: Promise<{ lang: string; folder: string }>;
  searchParams: Promise<{ practicar?: string }>;
}) {
  const { lang, folder: slug } = await params;
  if (!isLanguage(lang)) notFound();
  const t = ui(lang);
  const { practicar } = await searchParams;

  // "todas" = all cards, "sueltas" = unfiled, otherwise a folder id.
  let scope: string | null | undefined;
  let title: string;
  let subtitle: string;
  if (slug === "todas") {
    scope = undefined;
    title = t.allCards;
    subtitle = t.allSub;
  } else if (slug === "sueltas") {
    scope = null;
    title = t.noFolder;
    subtitle = t.unfiledSub;
  } else {
    const folder = await getFolder(slug).catch(() => null);
    if (!folder || folder.language !== lang) notFound();
    scope = folder.id;
    title = folder.name;
    subtitle = t.folderSub;
  }

  const [all, due, folders] = await Promise.all([
    getSavedCards(lang, scope),
    getDueSavedCards(lang, new Date(), scope),
    getFolders(lang),
  ]);

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <Link href={`/${lang}/tarjetas`} className="text-sm underline opacity-70">
          {t.foldersLink}
        </Link>
      </div>
      <p className="mt-1 text-sm opacity-70">{subtitle}</p>

      <FolderCards
        lang={lang}
        cards={all.map(toView)}
        due={due.map(toView)}
        folders={folders.map((f) => ({ id: f.id, name: f.name }))}
        autoStart={practicar === "1"}
      />
    </main>
  );
}
