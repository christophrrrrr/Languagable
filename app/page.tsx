import Link from "next/link";
import { topics, getTopic } from "@/content/topics";
import { startConversation, startTensePractice } from "@/server/conversations";
import {
  listRecentConversations,
  getFolders,
  getFolderStats,
} from "@/lib/db/queries";
import { PRACTICE_TENSES, tenseLabel, isPracticeTense } from "@/lib/tense";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  active: "en curso",
  analyzing: "analizando",
  analyzed: "analizada",
};

const cap = (s: string) => s.replace(/^\w/, (c) => c.toUpperCase());

export default async function HomePage() {
  let recent: Awaited<ReturnType<typeof listRecentConversations>> = [];
  let folders: Awaited<ReturnType<typeof getFolders>> = [];
  let stats: Awaited<ReturnType<typeof getFolderStats>> = [];
  let dbReady = true;
  try {
    [recent, folders, stats] = await Promise.all([
      listRecentConversations(10),
      getFolders(),
      getFolderStats(),
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
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Languagable</h1>
          <p className="mt-3 text-lg opacity-80">
            Habla en español de España y te corrijo sobre la marcha.
          </p>
        </div>
        <Link href="/tarjetas" className="mt-2 text-sm underline opacity-70">
          Tarjetas
        </Link>
      </div>

      {!dbReady && (
        <p className="mt-4 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm">
          La base de datos no está configurada. Copia <code>.env.example</code> a{" "}
          <code>.env.local</code> y rellena <code>DATABASE_URL</code>.
        </p>
      )}

      {dbReady && totals.total > 0 && (
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase tracking-wide opacity-60">
              Tus tarjetas
            </h2>
            <Link href="/tarjetas" className="text-xs underline opacity-60">
              Ver carpetas
            </Link>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-xl border border-black/10 px-4 py-3 dark:border-white/10">
            <p className="text-sm opacity-70">
              {totals.total} tarjetas · {totals.due} pendientes
            </p>
            {totals.due > 0 && (
              <Link
                href="/tarjetas/todas?practicar=1"
                className="rounded-md bg-ink px-4 py-1.5 text-sm font-medium text-paper dark:bg-paper dark:text-ink"
              >
                Practicar ({totals.due})
              </Link>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {folders.map((f) => {
              const s = byFolder.get(f.id);
              if (!s || s.total === 0) return null;
              return (
                <Link
                  key={f.id}
                  href={`/tarjetas/${f.id}`}
                  className="rounded-full border border-black/15 px-4 py-1.5 text-sm hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
                >
                  {f.name}
                  {s.due > 0 && (
                    <span className="ml-1.5 text-xs opacity-60">{s.due}</span>
                  )}
                </Link>
              );
            })}
            {unfiled && unfiled.total > 0 && (
              <Link
                href="/tarjetas/sueltas"
                className="rounded-full border border-dashed border-black/15 px-4 py-1.5 text-sm opacity-80 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
              >
                Sin carpeta
                {unfiled.due > 0 && (
                  <span className="ml-1.5 text-xs opacity-60">
                    {unfiled.due}
                  </span>
                )}
              </Link>
            )}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-wide opacity-60">
          ¿De qué hablamos hoy?
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <form action={startConversation}>
            <input type="hidden" name="topicSlug" value="" />
            <button
              type="submit"
              className="rounded-full bg-ink px-4 py-1.5 text-sm font-medium text-paper dark:bg-paper dark:text-ink"
            >
              Charla libre
            </button>
          </form>
          {topics.map((t) => (
            <form key={t.slug} action={startConversation}>
              <input type="hidden" name="topicSlug" value={t.slug} />
              <button
                type="submit"
                className="rounded-full border border-black/15 px-4 py-1.5 text-sm hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
              >
                {t.label}
              </button>
            </form>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wide opacity-60">
          Practica un tiempo verbal
        </h2>
        <p className="mt-1 text-xs opacity-50">
          Elige un tiempo y conversamos forzándolo; te corrijo la conjugación.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRACTICE_TENSES.map((tense) => (
            <form key={tense} action={startTensePractice}>
              <input type="hidden" name="tense" value={tense} />
              <button
                type="submit"
                className="rounded-full border border-black/15 px-4 py-1.5 text-sm hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
              >
                {cap(tenseLabel(tense))}
              </button>
            </form>
          ))}
        </div>
      </section>

      {recent.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-medium uppercase tracking-wide opacity-60">
            Conversaciones recientes
          </h2>
          <ul className="mt-3 divide-y divide-black/5 dark:divide-white/10">
            {recent.map((c) => {
              const topic = c.topicSlug ? getTopic(c.topicSlug) : undefined;
              const label =
                c.focusTense && isPracticeTense(c.focusTense)
                  ? `Práctica: ${tenseLabel(c.focusTense)}`
                  : (topic?.label ?? "Charla libre");
              const href =
                c.status === "analyzed" ? `/report/${c.id}` : `/chat/${c.id}`;
              return (
                <li key={c.id}>
                  <Link
                    href={href}
                    className="flex items-center justify-between py-2.5 text-sm opacity-85 hover:opacity-100"
                  >
                    <span>{label}</span>
                    <span className="text-xs opacity-50">
                      {STATUS_LABEL[c.status] ?? c.status} ·{" "}
                      {new Date(c.startedAt).toLocaleDateString("es-ES")}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </main>
  );
}
