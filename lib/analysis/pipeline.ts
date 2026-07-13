import type { Dimension } from "@/content/concepts";
import { resolveConceptSlug } from "@/content/concepts";
import { runDetectors } from "@/lib/detectors";
import { analyzeConversation } from "@/lib/ai/analysis";

export interface PipelineMessage {
  id: string;
  index: number;
  role: "user" | "assistant";
  content: string;
}

export interface PreparedIssue {
  messageId: string | null;
  original: string;
  correction: string;
  explanation: string;
  class: "error" | "upgrade";
  dimension: Dimension;
  conceptSlug: string | null;
  severity: number;
  confidence: number;
  source: "detector" | "llm";
}

export interface PipelineResult {
  strengths: string[];
  issues: PreparedIssue[];
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFC")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

const clamp = (n: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, n));

/**
 * Runs detectors (deterministic, high-trust) and the LLM analysis over a
 * conversation, then merges them: detector findings win on overlap, and LLM
 * findings that duplicate a detector span (same message + same text) are
 * dropped. The result is a flat list ready to persist as `issues`.
 */
export async function runAnalysisPipeline(
  messages: PipelineMessage[],
): Promise<PipelineResult> {
  const learner = messages.filter((m) => m.role === "user");
  const indexToId = new Map(messages.map((m) => [m.index, m.id]));

  // 1. Deterministic detectors on each learner message.
  const detectorIssues: PreparedIssue[] = [];
  for (const msg of learner) {
    for (const match of runDetectors(msg.content)) {
      detectorIssues.push({
        messageId: msg.id,
        original: match.original,
        correction: match.correction,
        explanation: match.explanation,
        class: match.class,
        dimension: match.dimension,
        conceptSlug: resolveConceptSlug(match.conceptSlug),
        severity: match.severity,
        confidence: match.confidence,
        source: "detector",
      });
    }
  }

  const detectorKeys = new Set(
    detectorIssues.map((i) => `${i.messageId}::${normalize(i.original)}`),
  );

  // 2. LLM analysis over the whole transcript. If it fails or times out, we
  //    still return the detector findings — the report must always generate.
  let strengths: string[] = [];
  const llmIssues: PreparedIssue[] = [];
  try {
    const result = await analyzeConversation(
      messages.map((m) => ({ index: m.index, role: m.role, content: m.content })),
    );
    strengths = result.strengths;
    for (const issue of result.issues) {
      const messageId = indexToId.get(issue.messageIndex) ?? null;
      const key = `${messageId}::${normalize(issue.original)}`;
      if (detectorKeys.has(key)) continue; // detector already caught this span

      llmIssues.push({
        messageId,
        original: issue.original,
        correction: issue.correction,
        explanation: issue.explanation,
        class: issue.class,
        dimension: issue.dimension,
        conceptSlug: resolveConceptSlug(issue.conceptSlug),
        severity: clamp(Math.round(issue.severity), 1, 5),
        confidence: clamp(issue.confidence, 0, 1),
        source: "llm",
      });
    }
  } catch (err) {
    console.error("[analysis] LLM analysis failed; using detectors only:", err);
  }

  // Cap total LLM issues (highest severity first) so the report stays focused.
  const topLlm = llmIssues
    .sort((a, b) => b.severity - a.severity || b.confidence - a.confidence)
    .slice(0, 10);

  return {
    strengths,
    issues: [...detectorIssues, ...topLlm],
  };
}
