// Peninsular-Spanish concept taxonomy.
//
// This is the backbone of the whole system: issues, error patterns, drills, and
// progress all key off `slug`. It is authored as content-as-code (version
// controlled, type-checked) and seeded into the DB. Keep slugs STABLE once used.

export type Dimension = "grammar" | "vocab" | "naturalness" | "flow";

export interface Concept {
  /** Stable identifier. Never rename once it has data attached. */
  slug: string;
  /** Short human label (Spanish where natural). */
  label: string;
  dimension: Dimension;
  /** What this concept covers — also fed to the analysis prompt. */
  description: string;
  /** Peninsular-specific guidance so the coach doesn't miscorrect valid usage. */
  peninsularNotes?: string;
}

export const concepts: Concept[] = [
  // ---------------------------------------------------------------- grammar
  {
    slug: "ser_vs_estar",
    label: "ser vs estar",
    dimension: "grammar",
    description:
      "Choosing ser or estar: identity/characteristics vs state/location/result.",
  },
  {
    slug: "por_vs_para",
    label: "por vs para",
    dimension: "grammar",
    description:
      "por (cause, exchange, duration, through) vs para (purpose, destination, deadline, recipient).",
  },
  {
    slug: "subjuntivo_triggers",
    label: "subjuntivo (disparadores)",
    dimension: "grammar",
    description:
      "Using the subjunctive after triggers of doubt, emotion, wish, denial, and certain conjunctions (cuando + future, para que, aunque, etc.).",
  },
  {
    slug: "preterito_vs_imperfecto",
    label: "pretérito vs imperfecto",
    dimension: "grammar",
    description:
      "Past-tense aspect: completed/punctual (pretérito) vs ongoing/habitual/background (imperfecto).",
  },
  {
    slug: "concordancia_genero",
    label: "concordancia de género",
    dimension: "grammar",
    description:
      "Gender agreement between articles/adjectives and nouns, including tricky nouns (el problema, la mano).",
  },
  {
    slug: "concordancia_numero",
    label: "concordancia de número",
    dimension: "grammar",
    description: "Number agreement (singular/plural) across the noun phrase and verb.",
  },
  {
    slug: "pronombres_atonos",
    label: "pronombres átonos (le/lo/la)",
    dimension: "grammar",
    description:
      "Object pronoun choice and placement, including leísmo, laísmo, and clitic order.",
    peninsularNotes:
      "Leísmo de persona masculina (le vi = lo vi, referring to a man) is ACCEPTED in the Peninsular standard. Do not flag it as an error. Laísmo (la dije) is non-standard and should be corrected.",
  },
  {
    slug: "preposiciones_regidas",
    label: "preposiciones regidas",
    dimension: "grammar",
    description:
      "Verb + preposition government (soñar con, contar con, depender de, insistir en, casarse con).",
  },
  {
    slug: "verbos_tipo_gustar",
    label: "verbos tipo gustar",
    dimension: "grammar",
    description:
      "gustar-type verbs (gustar, encantar, faltar, doler, apetecer) with indirect object and reversed subject.",
  },
  {
    slug: "correlacion_temporal",
    label: "correlación temporal / condicionales",
    dimension: "grammar",
    description:
      "Sequence of tenses and si-clauses (si tuviera, iría; si hubiera sabido, habría...).",
  },
  {
    slug: "haber_vs_estar",
    label: "haber vs estar (existencia/ubicación)",
    dimension: "grammar",
    description: "hay for existence vs estar for location of known referents.",
  },

  // ------------------------------------------------------------------ vocab
  {
    slug: "falsos_amigos",
    label: "falsos amigos",
    dimension: "vocab",
    description:
      "False friends from English (actualmente≠actually, sensible≠sensible, éxito≠exit, carpeta≠carpet, embarazada≠embarrassed).",
  },
  {
    slug: "latinoamericanismo_lexico",
    label: "latinoamericanismo léxico",
    dimension: "vocab",
    description:
      "Latin-American vocabulary that has a more idiomatic Peninsular equivalent (computadora→ordenador, celular→móvil, jugo→zumo).",
    peninsularNotes:
      "Target is Peninsular Spanish. Flag clearly Latin-American lexical choices as UPGRADES toward the Peninsular term — not as errors.",
  },
  {
    slug: "registro_coloquial_peninsular",
    label: "registro coloquial peninsular",
    dimension: "vocab",
    description:
      "Natural Peninsular colloquial register (vale, tío/tía, guay, majo, currar, mola) used appropriately.",
  },
  {
    slug: "precision_lexica",
    label: "precisión léxica",
    dimension: "vocab",
    description:
      "Choosing the precise word rather than a vague or approximate one (hacer/realizar, decir/comentar).",
  },
  {
    slug: "colocaciones",
    label: "colocaciones",
    dimension: "vocab",
    description:
      "Standard collocations (tomar una decisión, hacer caso, prestar atención, echar de menos).",
  },

  // ------------------------------------------------------------- naturalness
  {
    slug: "calco_del_ingles",
    label: "calco del inglés",
    dimension: "naturalness",
    description:
      "Literal English-to-Spanish translations that a native wouldn't use (estoy caliente, te llamo para atrás, tener un buen tiempo).",
  },
  {
    slug: "orden_palabras_natural",
    label: "orden de palabras natural",
    dimension: "naturalness",
    description:
      "Natural word order and information structure vs mechanically following English order.",
  },
  {
    slug: "muletillas_naturales",
    label: "muletillas naturales",
    dimension: "naturalness",
    description:
      "Natural discourse fillers and softeners (bueno, o sea, pues, la verdad es que, en plan).",
  },
  {
    slug: "expresiones_idiomaticas",
    label: "expresiones idiomáticas",
    dimension: "naturalness",
    description:
      "Idiomatic phrasing where a fixed expression is more natural (me da igual, ni idea, qué va, vaya tela).",
  },

  // -------------------------------------------------------------------- flow
  {
    slug: "conectores_discursivos",
    label: "conectores discursivos",
    dimension: "flow",
    description:
      "Discourse connectors for cohesion (sin embargo, por lo tanto, así que, aunque, de hecho, o sea).",
  },
  {
    slug: "subordinacion_fluidez",
    label: "subordinación / fluidez",
    dimension: "flow",
    description:
      "Combining ideas with subordination and relative clauses instead of short choppy sentences.",
  },
  {
    slug: "cohesion_referencial",
    label: "cohesión referencial",
    dimension: "flow",
    description:
      "Using pronouns and reference to avoid repeating nouns and keep discourse cohesive.",
  },
];

const bySlug = new Map(concepts.map((c) => [c.slug, c]));

export const conceptSlugs = concepts.map((c) => c.slug);

export function getConcept(slug: string): Concept | undefined {
  return bySlug.get(slug);
}

/** Normalize an LLM-provided slug to a known concept slug, or null if unknown. */
export function resolveConceptSlug(slug: string | null | undefined): string | null {
  if (!slug) return null;
  return bySlug.has(slug) ? slug : null;
}
