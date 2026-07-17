import Link from "next/link";
import { getFolders, getFolderStats } from "@/lib/db/queries";
import { FolderTile } from "@/components/FolderTile";
import { NewFolderForm } from "@/components/NewFolderForm";

export const dynamic = "force-dynamic";

export default async function TarjetasPage() {
  let dbReady = true;
  let folders: Awaited<ReturnType<typeof getFolders>> = [];
  let stats: Awaited<ReturnType<typeof getFolderStats>> = [];
  try {
    [folders, stats] = await Promise.all([getFolders(), getFolderStats()]);
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
        <h1 className="text-2xl font-semibold tracking-tight">Tarjetas</h1>
        <Link href="/" className="text-sm underline opacity-70">
          Inicio
        </Link>
      </div>
      <p className="mt-1 text-sm opacity-70">
        Tus carpetas de práctica. Elige una para repasar solo lo suyo.
      </p>

      {!dbReady ? (
        <p className="mt-8 text-sm opacity-70">
          La base de datos no está configurada.
        </p>
      ) : (
        <>
          <div className="mt-6 flex items-center justify-between rounded-xl border border-black/10 px-4 py-3 dark:border-white/10">
            <p className="text-sm opacity-70">
              {totals.total} tarjetas · {totals.due} pendientes
            </p>
            {totals.due > 0 && (
              <Link
                href="/tarjetas/todas?practicar=1"
                className="rounded-md bg-ink px-4 py-1.5 text-sm font-medium text-paper dark:bg-paper dark:text-ink"
              >
                Practicar todo ({totals.due})
              </Link>
            )}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              href="/tarjetas/todas"
              className="rounded-xl border border-black/10 p-4 transition hover:border-black/30 dark:border-white/10 dark:hover:border-white/30"
            >
              <div className="text-base font-medium">Todas las tarjetas</div>
              <div className="mt-1 text-xs opacity-60">
                {totals.total} tarjetas
                {totals.due > 0 && (
                  <span className="ml-2 rounded-full bg-ink px-2 py-0.5 text-[11px] font-medium text-paper dark:bg-paper dark:text-ink">
                    {totals.due} pendientes
                  </span>
                )}
              </div>
            </Link>

            {folders.map((f) => {
              const s = byFolder.get(f.id);
              return (
                <FolderTile
                  key={f.id}
                  id={f.id}
                  name={f.name}
                  total={s?.total ?? 0}
                  due={s?.due ?? 0}
                />
              );
            })}

            {unfiled && unfiled.total > 0 && (
              <Link
                href="/tarjetas/sueltas"
                className="rounded-xl border border-dashed border-black/15 p-4 transition hover:border-black/30 dark:border-white/15 dark:hover:border-white/30"
              >
                <div className="text-base font-medium opacity-80">
                  Sin carpeta
                </div>
                <div className="mt-1 text-xs opacity-60">
                  {unfiled.total} tarjetas
                  {unfiled.due > 0 && (
                    <span className="ml-2 rounded-full bg-ink px-2 py-0.5 text-[11px] font-medium text-paper dark:bg-paper dark:text-ink">
                      {unfiled.due} pendientes
                    </span>
                  )}
                </div>
              </Link>
            )}
          </div>

          <NewFolderForm />
        </>
      )}
    </main>
  );
}
