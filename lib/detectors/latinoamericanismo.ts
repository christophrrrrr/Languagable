import type { Detector, DetectorMatch } from "./types";
import { latinoamericanismos } from "./lexicon";
import { matchCase, wholeWordRegex } from "./util";

// Flags clearly Latin-American vocabulary as an UPGRADE toward the Peninsular
// equivalent (never an error — the word isn't wrong, just not the local choice).
export const latinoamericanismoDetector: Detector = {
  slug: "latinoamericanismo_lexico",
  run(text: string): DetectorMatch[] {
    const matches: DetectorMatch[] = [];
    for (const [la, info] of Object.entries(latinoamericanismos)) {
      const re = wholeWordRegex(la);
      let m: RegExpExecArray | null;
      while ((m = re.exec(text)) !== null) {
        const original = m[1];
        matches.push({
          original,
          correction: matchCase(original, info.peninsular),
          explanation: `"${original}" is Latin-American; in Peninsular Spanish "${info.peninsular}" is the usual word.`,
          class: "upgrade",
          dimension: "vocab",
          conceptSlug: "latinoamericanismo_lexico",
          severity: 2,
          confidence: info.confidence ?? 0.85,
          start: m.index,
          end: m.index + original.length,
          detector: "latinoamericanismo_lexico",
        });
      }
    }
    return matches;
  },
};
