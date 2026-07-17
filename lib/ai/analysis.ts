import { generateObject } from "ai";
import type { Language } from "@/lib/lang";
import { analysisModel } from "./provider";
import { analysisSystemPrompt } from "./prompts";
import { analysisResultSchema, type AnalysisResult } from "./schemas";

export interface TranscriptMessage {
  index: number;
  role: "user" | "assistant";
  content: string;
}

/**
 * Runs the structured analysis pass over a transcript. Returns the LLM's
 * proposed strengths + issues, validated against the Zod contract. Nothing
 * here is trusted yet — the pipeline merges/dedupes and gates on confidence.
 */
export async function analyzeConversation(
  lang: Language,
  messages: TranscriptMessage[],
): Promise<AnalysisResult> {
  const transcript = messages
    .map(
      (m) =>
        `[#${m.index}] ${m.role === "user" ? "LEARNER" : "PARTNER"}: ${m.content}`,
    )
    .join("\n");

  const { object } = await generateObject({
    model: analysisModel(),
    schema: analysisResultSchema,
    system: analysisSystemPrompt(lang),
    prompt: `Analyse ONLY the LEARNER messages in this transcript.\n\n${transcript}`,
    // Cap latency: the analysis is a blocking step in "Terminar y analizar".
    abortSignal: AbortSignal.timeout(50_000),
    // Gemini 2.5-flash "thinks" by default (~40s here); disable it for this
    // extraction task. Harmless for non-Google providers (namespaced option).
    providerOptions: { google: { thinkingConfig: { thinkingBudget: 0 } } },
  });

  return object;
}
