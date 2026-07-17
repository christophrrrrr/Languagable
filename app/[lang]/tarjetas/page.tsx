import Link from "next/link";
import { notFound } from "next/navigation";
import { getFolders, getFolderStats } from "@/lib/db/queries";
import { FolderTile } from "@/components/FolderTile";
import { NewFolderForm } from "@/components/NewFolderForm";
import { isLanguage } from "@/lib/lang";
import { ui } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function TarjetasPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const t = ui(lang);

  let dbReady = true;
  let folders: Awaited<ReturnType<typeof getFolders>> = [];
  let stats: Awaited<ReturnType<typeof getFolderStats>> = [];
  try {
    [folders, stats] = await Promise.all([
      getFolders(lang),
      getFolderStats(lang),
    ]);
  } catch {
    dbReady = false;
  }

  const byFolder = new Map(stats.map((s) => [s.folderId, s]));
  const totals = stats.reduce(
    (acc, s) => ({ total: acc.total + s.total, due: acc.due + s.due }),
    { total: 0, due: 0 },
  );
  const unfiled = byFolder.get(null);

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t.cardsTitle}
        </h1>
        <Link href={`/${lang}`} className="text-sm underline opacity-70">
          {t.home}
        </Link>
      </div>
      <p className="mt-1 text-sm opacity-70">{t.hubSubtitle}</p>

      {!dbReady ? (
        <p className="mt-8 text-sm opacity-70">{t.dbNotConfigured}</p>
      ) : (
        <>
          <div className="mt-6 flex items-center justify-between rounded-xl border border-black/10 px-4 py-3 dark:border-white/10">
            <p className="text-sm opacity-70">
              {t.cardsDueLine(totals.total, totals.due)}
            </p>
            {totals.due > 0 && (
              <Link
                href={`/${lang}/tarjetas/todas?practicar=1`}
                className="rounded-md bg-ink px-4 py-1.5 text-sm font-medium text-paper dark:bg-paper dark:text-ink"
              >
                {t.practiceAllN(totals.due)}
              </Link>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              href={`/${lang}/tarjetas/todas`}
              className="rounded-xl border border-black/10 p-4 transition hover:border-black/30 dark:border-white/10 dark:hover:border-white/30"
            >
              <div className="text-base font-medium">{t.allCards}</div>
              <div className="mt-1 text-xs opacity-60">
                {t.nCards(totals.total)}
                {totals.due > 0 && (
                  <span className="ml-2 rounded-full bg-ink px-2 py-0.5 text-[11px] font-medium text-paper dark:bg-paper dark:text-ink">
                    {t.dueBadge(totals.due)}
                  </span>
                )}
              </div>
            </Link>

            {folders.map((f) => {
              const s = byFolder.get(f.id);
              return (
                <FolderTile
                  key={f.id}
                  lang={lang}
                  id={f.id}
                  name={f.name}
                  total={s?.total ?? 0}
                  due={s?.due ?? 0}
                />
              );
            })}

            {unfiled && unfiled.total > 0 && (
              <Link
                href={`/${lang}/tarjetas/sueltas`}
                className="rounded-xl border border-dashed border-black/15 p-4 transition hover:border-black/30 dark:border-white/15 dark:hover:border-white/30"
              >
                <div className="text-base font-medium opacity-80">
                  {t.noFolder}
                </div>
                <div className="mt-1 text-xs opacity-60">
                  {t.nCards(unfiled.total)}
                  {unfiled.due > 0 && (
                    <span className="ml-2 rounded-full bg-ink px-2 py-0.5 text-[11px] font-medium text-paper dark:bg-paper dark:text-ink">
                      {t.dueBadge(unfiled.due)}
                    </span>
                  )}
                </div>
              </Link>
            )}
          </div>

          <NewFolderForm lang={lang} />
        </>
      )}
    </main>
  );
}
