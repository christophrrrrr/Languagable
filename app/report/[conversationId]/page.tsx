import Link from "next/link";
import { notFound } from "next/navigation";
import { getConversation, getIssues } from "@/lib/db/queries";
import { getConcept } from "@/content/concepts";
import { getTopic } from "@/content/topics";
import { SaveIssueButton } from "@/components/SaveIssueButton";
import type { Issue } from "@/lib/db/schema";
import { isLanguage, type Language } from "@/lib/lang";
import { ui, type UIStrings } from "@/lib/i18n";

function IssueCard({ issue, t }: { issue: Issue; t: UIStrings }) {
  const pct = Math.round(issue.confidence * 100);
  const lowConfidence = issue.confidence < 0.6;
  const concept = issue.conceptSlug ? getConcept(issue.conceptSlug) : undefined;

  return (
    <div className="rounded-lg border border-black/10 p-4 dark:border-white/10">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded bg-black/5 px-1.5 py-0.5 dark:bg-white/10">
          {t.dimensions[issue.dimension] ?? issue.dimension}
        </span>
        {concept && <span className="opacity-70">{concept.label}</span>}
        <span className="opacity-50">·</span>
        <span className="opacity-60">
          {issue.source === "detector" ? t.detectorLabel : t.aiLabel}
        </span>
        <span className="opacity-50">·</span>
        <span className={lowConfidence ? "text-amber-600 dark:text-amber-400" : "opacity-60"}>
          {lowConfidence ? `${t.possible} · ${pct}%` : `${pct}%`}
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
        <SaveIssueButton
          issueId={issue.id}
          label={t.saveToPractice}
          savedLabel={t.savedFlash}
        />
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

  const lang: Language = isLanguage(convo.language) ? convo.language : "es";
  const t = ui(lang);

  const issues = await getIssues(conversationId);
  const errors = issues.filter((i) => i.class === "error");
  const upgrades = issues.filter((i) => i.class === "upgrade");
  const topic = convo.topicSlug ? getTopic(lang, convo.topicSlug) : undefined;
  const strengths = convo.strengths ?? [];

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t.reportTitle}
        </h1>
        <div className="flex gap-4 text-sm">
          <Link href={`/chat/${conversationId}`} className="underline opacity-70">
            {t.keepTalking}
          </Link>
          <Link href={`/${lang}`} className="underline opacity-70">
            {t.home}
          </Link>
        </div>
      </div>
      <p className="mt-1 text-sm opacity-60">{topic?.label ?? t.freeChat}</p>

      {strengths.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm font-medium uppercase tracking-wide opacity-60">
            {t.didWell}
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
          {t.errorsHeading} ({errors.length})
        </h2>
        <p className="mt-1 text-xs opacity-50">{t.errorsSub}</p>
        <div className="mt-3 space-y-3">
          {errors.length === 0 && (
            <p className="text-sm opacity-60">{t.noErrors}</p>
          )}
          {errors.map((issue) => (
            <IssueCard key={issue.id} issue={issue} t={t} />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wide opacity-60">
          {t.upgradesHeading} ({upgrades.length})
        </h2>
        <p className="mt-1 text-xs opacity-50">{t.upgradesSub}</p>
        <div className="mt-3 space-y-3">
          {upgrades.length === 0 && (
            <p className="text-sm opacity-60">{t.noUpgrades}</p>
          )}
          {upgrades.map((issue) => (
            <IssueCard key={issue.id} issue={issue} t={t} />
          ))}
        </div>
      </section>
    </main>
  );
}
