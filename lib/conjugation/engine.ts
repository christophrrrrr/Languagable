import type { Person, Tense, VerbSpec } from "./types";
import { PERSONS } from "./types";

type Klass = "ar" | "er" | "ir";

function klassOf(inf: string): Klass {
  if (inf.endsWith("ar")) return "ar";
  if (inf.endsWith("er")) return "er";
  return "ir";
}

// Regular endings, PERSONS order: [yo, tú, él, nosotros, vosotros, ellos].
const PRESENTE: Record<Klass, string[]> = {
  ar: ["o", "as", "a", "amos", "áis", "an"],
  er: ["o", "es", "e", "emos", "éis", "en"],
  ir: ["o", "es", "e", "imos", "ís", "en"],
};
const PRETERITO: Record<Klass, string[]> = {
  ar: ["é", "aste", "ó", "amos", "asteis", "aron"],
  er: ["í", "iste", "ió", "imos", "isteis", "ieron"],
  ir: ["í", "iste", "ió", "imos", "isteis", "ieron"],
};
const IMPERFECTO: Record<Klass, string[]> = {
  ar: ["aba", "abas", "aba", "ábamos", "abais", "aban"],
  er: ["ía", "ías", "ía", "íamos", "íais", "ían"],
  ir: ["ía", "ías", "ía", "íamos", "íais", "ían"],
};
const FUTURO_END = ["é", "ás", "á", "emos", "éis", "án"];
const CONDICIONAL_END = ["ía", "ías", "ía", "íamos", "íais", "ían"];
const SUBJ_PRES_END: Record<Klass, string[]> = {
  ar: ["e", "es", "e", "emos", "éis", "en"],
  er: ["a", "as", "a", "amos", "áis", "an"],
  ir: ["a", "as", "a", "amos", "áis", "an"],
};

const VOWELS: Record<string, string> = {
  a: "á",
  e: "é",
  i: "í",
  o: "ó",
  u: "ú",
};

/** Accent the last vowel of a stem (for the nosotros imperfect-subjunctive). */
function accentLastVowel(stem: string): string {
  for (let i = stem.length - 1; i >= 0; i--) {
    const v = VOWELS[stem[i]];
    if (v) return stem.slice(0, i) + v + stem.slice(i + 1);
  }
  return stem;
}

function regular(stem: string, endings: string[]): string[] {
  return endings.map((e) => stem + e);
}

// Present subjunctive derives from the present-indicative 'yo' form (drop -o),
// e.g. tengo -> tenga. Works for -go / -zco / -oy? (oy handled via override).
function deriveSubjPresente(presenteYo: string, klass: Klass): string[] {
  const base = presenteYo.replace(/o$/, "");
  return SUBJ_PRES_END[klass].map((e) => base + e);
}

// Imperfect subjunctive ALWAYS derives from the pretérito 'ellos' form
// (drop -ron), e.g. tuvieron -> tuviera / tuviéramos. Correct for all verbs.
function deriveSubjImperfecto(preteritoEllos: string): string[] {
  const base = preteritoEllos.replace(/ron$/, "");
  return [
    base + "ra",
    base + "ras",
    base + "ra",
    accentLastVowel(base) + "ramos",
    base + "rais",
    base + "ran",
  ];
}

/** Compute all seven tenses (each a 6-form array), applying any overrides. */
export function conjugateAll(spec: VerbSpec): Record<Tense, string[]> {
  const inf = spec.infinitive;
  const klass = klassOf(inf);
  const stem = inf.slice(0, -2);
  const f = spec.forms ?? {};

  const presente = f.presente ?? regular(stem, PRESENTE[klass]);
  const preterito = f.preterito ?? regular(stem, PRETERITO[klass]);
  const imperfecto = f.imperfecto ?? regular(stem, IMPERFECTO[klass]);
  const futuroStem = spec.futureStem ?? inf;
  const futuro = f.futuro ?? regular(futuroStem, FUTURO_END);
  const condicional = f.condicional ?? regular(futuroStem, CONDICIONAL_END);
  const subjPresente = f.subjPresente ?? deriveSubjPresente(presente[0], klass);
  const subjImperfecto = deriveSubjImperfecto(preterito[5]);

  return {
    presente,
    preterito,
    imperfecto,
    futuro,
    condicional,
    subjPresente,
    subjImperfecto,
  };
}

export function conjugate(spec: VerbSpec, tense: Tense, person: Person): string {
  return conjugateAll(spec)[tense][PERSONS.indexOf(person)];
}
