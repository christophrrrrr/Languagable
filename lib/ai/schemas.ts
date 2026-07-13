import { z } from "zod";

// The contract the analysis model must satisfy. Everything the LLM proposes is
// validated against this before any of it is allowed to touch durable state.
//
// Design notes tied to the trust architecture:
//  - `class` separates asserted errors from offered upgrades.
//  - `confidence` gates what becomes durable (drills / pattern updates).
//  - `conceptSlug` is a plain string here and is resolved against the taxonomy
//    in code (unknown slugs are mapped to null) rather than enumerated in the
//    schema, so a new/unknown tag never breaks parsing.

export const issueClassSchema = z.enum(["error", "upgrade"]);
export const dimensionSchema = z.enum([
  "grammar",
  "vocab",
  "naturalness",
  "flow",
]);

export const analysisIssueSchema = z.object({
  messageIndex: z
    .number()
    .int()
    .describe("Index of the learner message this issue comes from."),
  original: z
    .string()
    .describe("The exact span from the learner's message that is wrong or improvable."),
  correction: z.string().describe("The corrected or more native version."),
  explanation: z
    .string()
    .describe("One or two concise sentences, in English, explaining the fix."),
  class: issueClassSchema.describe(
    "'error' = genuinely incorrect. 'upgrade' = correct but not native/optimal.",
  ),
  dimension: dimensionSchema,
  conceptSlug: z
    .string()
    .describe(
      "A slug from the provided concept taxonomy, or 'unknown' if none fits.",
    ),
  severity: z
    .number()
    .int()
    .min(1)
    .max(5)
    .describe("1 = trivial, 5 = seriously impedes communication."),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe(
      "0-1: how confident this is a genuine issue for PENINSULAR Spanish. Be honest; low is fine.",
    ),
});

export const analysisResultSchema = z.object({
  strengths: z
    .array(z.string())
    .describe("2-4 concrete things the learner did well."),
  issues: z.array(analysisIssueSchema),
});

export type AnalysisIssue = z.infer<typeof analysisIssueSchema>;
export type AnalysisResult = z.infer<typeof analysisResultSchema>;
