import Link from "next/link";
import { topics, getTopic } from "@/content/topics";
import { startConversation, startTensePractice } from "@/server/conversations";
import { listRecentConversations } from "@/lib/db/queries";
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
  let dbReady = true;
  try {
    recent = await listRecentConversations(10);
  } catch {
    dbReady = false;
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Languagable</h1>
          <p className="mt-3 text-lg opacity-80">
            Habla en español de España y te corrijo sobre la marcha.
          </p>
        </div>
        <Link href="/progress" className="mt-2 text-sm underline opacity-70">
          Tarjetas
        </Link>
      </div>

      {!dbReady && (
        <p className="mt-4 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm">
          La base de datos no está configurada. Copia <code>.env.example</code> a{" "}
          <code>.env.local</code> y rellena <code>DATABASE_URL</code>.
        </p>
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
