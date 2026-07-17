import Link from "next/link";
import { notFound } from "next/navigation";
import { topicsFor, getTopic } from "@/content/topics";
import { startConversation, startTensePractice } from "@/server/conversations";
import {
  listRecentConversations,
  getFolders,
  getFolderStats,
} from "@/lib/db/queries";
import { practiceTensesFor, tenseLabel, isPracticeTense } from "@/lib/tense";
import { isLanguage } from "@/lib/lang";
import { ui } from "@/lib/i18n";

export const dynamic = "force-dynamic";

const cap = (s: string) => s.replace(/^\w/, (c) => c.toUpperCase());

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  const t = ui(lang);

  let recent: Awaited<ReturnType<typeof listRecentConversations>> = [];
  let folders: Awaited<ReturnType<typeof getFolders>> = [];
  let stats: Awaited<ReturnType<typeof getFolderStats>> = [];
  let dbReady = true;
  try {
    [recent, folders, stats] = await Promise.all([
      listRecentConversations(lang, 10),
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
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Languagable</h1>
          <p className="mt-3 text-lg opacity-80">{t.tagline}</p>
        </div>
        <div className="mt-2 flex flex-col items-end gap-1 text-sm">
          <Link href={`/${lang}/tarjetas`} className="underline opacity-70">
            {t.cardsNav}
          </Link>
          <Link href="/" className="text-xs underline opacity-50">
            {t.changeLanguage}
          </Link>
        </div>
      </div>

      {!dbReady && (
        <p className="mt-4 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm">
          {t.dbNotConfigured} <code>.env.example</code> → <code>.env.local</code>{" "}
          (<code>DATABASE_URL</code>)
        </p>
      )}

      {dbReady && totals.total > 0 && (
        <section className="mt-10">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase tracking-wide opacity-60">
              {t.yourCards}
            </h2>
            <Link
              href={`/${lang}/tarjetas`}
              className="text-xs underline opacity-60"
            >
              {t.viewFolders}
            </Link>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-xl border border-black/10 px-4 py-3 dark:border-white/10">
            <p className="text-sm opacity-70">
              {t.cardsDueLine(totals.total, totals.due)}
            </p>
            {totals.due > 0 && (
              <Link
                href={`/${lang}/tarjetas/todas?practicar=1`}
                className="rounded-md bg-ink px-4 py-1.5 text-sm font-medium text-paper dark:bg-paper dark:text-ink"
              >
                {t.practiceN(totals.due)}
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
                  href={`/${lang}/tarjetas/${f.id}`}
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
                href={`/${lang}/tarjetas/sueltas`}
                className="rounded-full border border-dashed border-black/15 px-4 py-1.5 text-sm opacity-80 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
              >
                {t.noFolder}
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
          {t.topicsHeading}
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <form action={startConversation}>
            <input type="hidden" name="language" value={lang} />
            <input type="hidden" name="topicSlug" value="" />
            <button
              type="submit"
              className="rounded-full bg-ink px-4 py-1.5 text-sm font-medium text-paper dark:bg-paper dark:text-ink"
            >
              {t.freeChat}
            </button>
          </form>
          {topicsFor(lang).map((topic) => (
            <form key={topic.slug} action={startConversation}>
              <input type="hidden" name="language" value={lang} />
              <input type="hidden" name="topicSlug" value={topic.slug} />
              <button
                type="submit"
                className="rounded-full border border-black/15 px-4 py-1.5 text-sm hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
              >
                {topic.label}
              </button>
            </form>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wide opacity-60">
          {t.tenseHeading}
        </h2>
        <p className="mt-1 text-xs opacity-50">{t.tenseSub}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {practiceTensesFor(lang).map((tense) => (
            <form key={tense} action={startTensePractice}>
              <input type="hidden" name="language" value={lang} />
              <input type="hidden" name="tense" value={tense} />
              <button
                type="submit"
                className="rounded-full border border-black/15 px-4 py-1.5 text-sm hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
              >
                {cap(tenseLabel(lang, tense))}
              </button>
            </form>
          ))}
        </div>
      </section>

      {recent.length > 0 && (
        <section className="mt-10">
          <h2 className="text-sm font-medium uppercase tracking-wide opacity-60">
            {t.recentHeading}
          </h2>
          <ul className="mt-3 divide-y divide-black/5 dark:divide-white/10">
            {recent.map((c) => {
              const topic = c.topicSlug
                ? getTopic(lang, c.topicSlug)
                : undefined;
              const label =
                c.focusTense && isPracticeTense(lang, c.focusTense)
                  ? `${t.practicePrefix}${tenseLabel(lang, c.focusTense)}`
                  : (topic?.label ?? t.freeChat);
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
                      {t.status[c.status] ?? c.status} ·{" "}
                      {new Date(c.startedAt).toLocaleDateString(
                        lang === "es" ? "es-ES" : lang === "fr" ? "fr-FR" : "pt-PT",
                      )}
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
