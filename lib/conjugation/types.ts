export const TENSES = [
  "presente",
  "preterito",
  "imperfecto",
  "futuro",
  "condicional",
  "subjPresente",
  "subjImperfecto",
] as const;
export type Tense = (typeof TENSES)[number];

// Persons in fixed order (Peninsular — includes vosotros).
export const PERSONS = ["yo", "tu", "el", "nosotros", "vosotros", "ellos"] as const;
export type Person = (typeof PERSONS)[number];

export const TENSE_LABEL: Record<Tense, string> = {
  presente: "presente",
  preterito: "pretérito indefinido",
  imperfecto: "imperfecto",
  futuro: "futuro",
  condicional: "condicional",
  subjPresente: "presente de subjuntivo",
  subjImperfecto: "imperfecto de subjuntivo",
};

export const PERSON_LABEL: Record<Person, string> = {
  yo: "yo",
  tu: "tú",
  el: "él/ella",
  nosotros: "nosotros",
  vosotros: "vosotros",
  ellos: "ellos/ellas",
};

/**
 * A verb definition. Fully regular verbs need only `infinitive`. Irregular verbs
 * supply explicit 6-form arrays (PERSONS order) ONLY for the tenses that deviate;
 * everything else is computed. `futureStem` handles irregular future/conditional
 * stems (e.g. tendr-, har-). Imperfecto de subjuntivo is ALWAYS derived from the
 * pretérito (correct even for irregulars), so it is never overridden.
 */
export interface VerbSpec {
  infinitive: string;
  /** Display gloss (English), for card notes. */
  gloss?: string;
  futureStem?: string;
  forms?: Partial<Record<Exclude<Tense, "subjImperfecto">, string[]>>;
}
