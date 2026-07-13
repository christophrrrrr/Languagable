import type { Dimension } from "@/content/concepts";

export interface DetectorMatch {
  /** The exact offending span, as found in the text (original casing). */
  original: string;
  correction: string;
  explanation: string;
  class: "error" | "upgrade";
  dimension: Dimension;
  conceptSlug: string;
  /** 1 (trivial) .. 5 (impedes communication). */
  severity: number;
  /** 0..1. Detectors are deliberately conservative and high-confidence. */
  confidence: number;
  /** Character offsets into the input text. */
  start: number;
  end: number;
  /** Which detector produced this (for debugging / suppression). */
  detector: string;
}

export interface Detector {
  slug: string;
  run(text: string): DetectorMatch[];
}
