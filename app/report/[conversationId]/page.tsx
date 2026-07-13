import Link from "next/link";
import { notFound } from "next/navigation";
import { getConversation, getIssues } from "@/lib/db/queries";
import { getConcept } from "@/content/concepts";
import { getTopic } from "@/content/topics";
import { SaveIssueButton } from "@/components/SaveIssueButton";
import type { Issue } from "@/lib/db/schema";

const DIMENSION_LABEL: Record<string, string> = {
  grammar: "Gramática",
  vocab: "Vocabulario",
  naturalness: "Naturalidad",
  flow: "Fluidez",
};

function IssueCard({ issue }: { issue: Issue }) {
  const pct = Math.round(issue.confidence * 100);
  const lowConfidence = issue.confidence < 0.6;
  const concept = issue.conceptSlug ? getConcept(issue.conceptSlug) : undefined;

  return (
    <div className="rounded-lg border border-black/10 p-4 dark:border-white/10">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded bg-black/5 px-1.5 py-0.5 dark:bg-white/10">
          {DIMENSION_LABEL[issue.dimension] ?? issue.dimension}
        </span>
        {concept && <span className="opacity-70">{concept.label}</span>}
        <span className="opacity-50">·</span>
        <span className="opacity-60">
          {issue.source === "detector" ? "detector" : "IA"}
        </span>
        <span className="opacity-50">·</span>
        <span className={lowConfidence ? "text-amber-600 dark:text-amber-400" : "opacity-60"}>
          {lowConfidence ? `posible · ${pct}%` : `${pct}%`}
        </span>
      </div>

      <div className="mt-2 text-[15px]">
        <span className="text-red-700 line-through decoration-red-400/60 dark:text-red-300">
          {issue.original}
        </span>{" "}
        <span className="opacity-40">→</span>{" "}
        <span className="text-green-700 dark:text-green-300">
          {issue.correction}
        </span>
      </div>

      <p className="mt-1 text-sm opacity-75">{issue.explanation}</p>

      <div className="mt-3">
        <SaveIssueButton issueId={issue.id} />
      </div>
    </div>
  );
}

export default async function ReportPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;

  const convo = await getConversation(conversationId);
  if (!convo) notFound();

  const issues = await getIssues(conversationId);
  const errors = issues.filter((i) => i.class === "error");
  const upgrades = issues.filter((i) => i.class === "upgrade");
  const topic = convo.topicSlug ? getTopic(convo.topicSlug) : undefined;
  const strengths = convo.strengths ?? [];

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Informe</h1>
        <div className="flex gap-4 text-sm">
          <Link href={`/chat/${conversationId}`} className="underline opacity-70">
            Seguir hablando
          </Link>
          <Link href="/" className="underline opacity-70">
            Inicio
          </Link>
        </div>
      </div>
      <p className="mt-1 text-sm opacity-60">{topic?.label ?? "Charla libre"}</p>

      {strengths.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-medium uppercase tracking-wide opacity-60">
            Lo que has hecho bien
          </h2>
          <ul className="mt-2 space-y-1 text-sm">
            {strengths.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-green-600 dark:text-green-400">✓</span>
                <span className="opacity-85">{s}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wide opacity-60">
          Errores ({errors.length})
        </h2>
        <p className="mt-1 text-xs opacity-50">
          Cosas que están mal. Guarda las que quieras practicar.
        </p>
        <div className="mt-3 space-y-3">
          {errors.length === 0 && (
            <p className="text-sm opacity-60">Ningún error detectado. 🎉</p>
          )}
          {errors.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wide opacity-60">
          Mejoras ({upgrades.length})
        </h2>
        <p className="mt-1 text-xs opacity-50">
          Correcto, pero un nativo lo diría de otra forma (sugerencias, no errores).
        </p>
        <div className="mt-3 space-y-3">
          {upgrades.length === 0 && (
            <p className="text-sm opacity-60">Sin sugerencias.</p>
          )}
          {upgrades.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </section>
    </main>
  );
}
