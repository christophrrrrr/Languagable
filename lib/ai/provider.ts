import type { LanguageModel } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOpenAI } from "@ai-sdk/openai";

// Provider-agnostic model selection. The rest of the app depends only on the
// two functions at the bottom; swapping providers is an env change.

export type Provider = "google" | "anthropic" | "openai";

const DEFAULT_MODELS: Record<
  Provider,
  { conversation: string; analysis: string }
> = {
  // gemini-2.5-flash: fast, free-tier friendly, supports structured output.
  // Bump AI_ANALYSIS_MODEL to gemini-2.5-pro for stronger analysis.
  google: { conversation: "gemini-2.5-flash", analysis: "gemini-2.5-flash" },
  anthropic: { conversation: "claude-haiku-4-5", analysis: "claude-opus-4-8" },
  openai: { conversation: "gpt-4o-mini", analysis: "gpt-4o" },
};

function currentProvider(): Provider {
  const p = (process.env.AI_PROVIDER ?? "google").toLowerCase();
  if (p === "google" || p === "anthropic" || p === "openai") return p;
  throw new Error(
    `Unknown AI_PROVIDER "${p}". Use "google", "anthropic", or "openai".`,
  );
}

function makeModel(provider: Provider, id: string): LanguageModel {
  switch (provider) {
    case "google":
      return createGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      })(id);
    case "anthropic":
      return createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY })(id);
    case "openai":
      return createOpenAI({ apiKey: process.env.OPENAI_API_KEY })(id);
  }
}

/** Fast/cheap model for the live conversation. */
export function conversationModel(): LanguageModel {
  const p = currentProvider();
  const id = process.env.AI_CONVERSATION_MODEL || DEFAULT_MODELS[p].conversation;
  return makeModel(p, id);
}

/** Stronger model for the post-session analysis pass. */
export function analysisModel(): LanguageModel {
  const p = currentProvider();
  const id = process.env.AI_ANALYSIS_MODEL || DEFAULT_MODELS[p].analysis;
  return makeModel(p, id);
}
