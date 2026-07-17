"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import {
  conversations,
  issues,
  messages,
  type NewIssue,
} from "@/lib/db/schema";
import { getConversation, getMessages } from "@/lib/db/queries";
import { runAnalysisPipeline, type PipelineMessage } from "@/lib/analysis/pipeline";
import { buildTenseOpening, isPracticeTense } from "@/lib/tense";
import { isLanguage, type Language } from "@/lib/lang";

function readLanguage(formData: FormData): Language {
  const raw = String(formData.get("language") ?? "");
  return isLanguage(raw) ? raw : "es";
}

/** Create a new conversation and go to it. Called from the start screen form. */
export async function startConversation(formData: FormData) {
  const language = readLanguage(formData);
  const raw = formData.get("topicSlug");
  const topicSlug = typeof raw === "string" && raw.length > 0 ? raw : null;

  const [row] = await getDb()
    .insert(conversations)
    .values({ language, topicSlug })
    .returning({ id: conversations.id });

  redirect(`/chat/${row.id}`);
}

/** Start a tense-practice conversation with a deterministic opening message. */
export async function startTensePractice(formData: FormData) {
  const language = readLanguage(formData);
  const tense = String(formData.get("tense") ?? "");
  if (!isPracticeTense(language, tense)) redirect(`/${language}`);

  const db = getDb();
  const [row] = await db
    .insert(conversations)
    .values({ language, topicSlug: null, focusTense: tense })
    .returning({ id: conversations.id });

  await db.insert(messages).values({
    conversationId: row.id,
    role: "assistant",
    content: buildTenseOpening(language, tense),
    index: 0,
  });

  redirect(`/chat/${row.id}`);
}

/** Run the end-of-session analysis, persist issues, then show the report. */
export async function finishAndAnalyze(formData: FormData) {
  const conversationId = String(formData.get("conversationId") ?? "");
  if (!conversationId) redirect("/");

  const convo = await getConversation(conversationId);
  if (!convo) redirect("/");
  const language: Language = isLanguage(convo.language) ? convo.language : "es";

  const rows = await getMessages(conversationId);
  const pipelineMessages: PipelineMessage[] = rows
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      id: m.id,
      index: m.index,
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

  const { strengths, issues: prepared } = await runAnalysisPipeline(
    language,
    pipelineMessages,
  );

  const db = getDb();
  // Idempotent: replace any prior analysis for this conversation.
  await db.delete(issues).where(eq(issues.conversationId, conversationId));
  if (prepared.length > 0) {
    const values: NewIssue[] = prepared.map((p) => ({
      conversationId,
      messageId: p.messageId,
      original: p.original,
      correction: p.correction,
      explanation: p.explanation,
      class: p.class,
      dimension: p.dimension,
      conceptSlug: p.conceptSlug,
      severity: p.severity,
      confidence: p.confidence,
      source: p.source,
      status: "open",
    }));
    await db.insert(issues).values(values);
  }

  await db
    .update(conversations)
    .set({ status: "analyzed", strengths, endedAt: new Date() })
    .where(eq(conversations.id, conversationId));

  redirect(`/report/${conversationId}`);
}
