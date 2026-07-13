import type { Detector, DetectorMatch } from "./types";
import { misgenderedNouns } from "./lexicon";
import { escapeRegex, matchCase } from "./util";

type Gender = "m" | "f";

function correctArticle(articleLower: string, nounGender: Gender): string {
  if (nounGender === "m") {
    // article was feminine (la/una) — switch to masculine, preserving def/indef
    return articleLower === "la" ? "el" : "un";
  }
  // noun is feminine, article was masculine (el/un)
  return articleLower === "el" ? "la" : "una";
}

// Flags definite/indefinite singular article + noun where the article's gender
// disagrees with the (curated) noun's gender. High precision by construction:
// it only fires on nouns we've explicitly listed, and excludes the phonetic
// "el agua" class of exceptions.
export const generoDetector: Detector = {
  slug: "concordancia_genero",
  run(text: string): DetectorMatch[] {
    const matches: DetectorMatch[] = [];
    for (const [noun, gender] of Object.entries(misgenderedNouns)) {
      const re = new RegExp(
        `(?<![\\p{L}\\p{N}])(el|la|un|una)(\\s+)(${escapeRegex(noun)})(?![\\p{L}\\p{N}])`,
        "giu",
      );
      let m: RegExpExecArray | null;
      while ((m = re.exec(text)) !== null) {
        const [full, article, space, nounMatch] = m;
        const artLower = article.toLowerCase();
        const artGender: Gender =
          artLower === "el" || artLower === "un" ? "m" : "f";
        if (artGender === gender) continue; // agrees — fine

        const corrected = correctArticle(artLower, gender as Gender);
        matches.push({
          original: full,
          correction: `${matchCase(article, corrected)}${space}${nounMatch}`,
          explanation: `"${nounMatch}" is ${
            gender === "m" ? "masculine" : "feminine"
          } in Spanish, so it takes "${corrected}".`,
          class: "error",
          dimension: "grammar",
          conceptSlug: "concordancia_genero",
          severity: 3,
          confidence: 0.9,
          start: m.index,
          end: m.index + full.length,
          detector: "concordancia_genero",
        });
      }
    }
    return matches;
  },
};
