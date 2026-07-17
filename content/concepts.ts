// Per-language concept taxonomies (Peninsular Spanish, France French,
// European Portuguese).
//
// This is the backbone of the whole system: issues, error patterns, drills, and
// progress all key off `slug`. It is authored as content-as-code (version
// controlled, type-checked) and seeded into the DB. Keep slugs STABLE once
// used. Spanish slugs are unprefixed (they predate multi-language); French and
// Portuguese slugs carry `fr_` / `pt_` prefixes so the shared table can't clash.

import type { Language } from "@/lib/lang";

export type Dimension = "grammar" | "vocab" | "naturalness" | "flow";

export interface Concept {
  /** Stable identifier. Never rename once it has data attached. */
  slug: string;
  /** Short human label (in the target language where natural). */
  label: string;
  dimension: Dimension;
  /** What this concept covers — also fed to the analysis prompt. */
  description: string;
  /** Variety-specific guidance so the coach doesn't miscorrect valid usage. */
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

// -------------------------------------------------------------------- French
// (France / metropolitan French)
export const conceptsFr: Concept[] = [
  {
    slug: "fr_passe_compose_vs_imparfait",
    label: "passé composé vs imparfait",
    dimension: "grammar",
    description:
      "Past-tense aspect: completed/punctual events (passé composé) vs ongoing/habitual/background (imparfait).",
  },
  {
    slug: "fr_genre_et_accord",
    label: "genre et accord",
    dimension: "grammar",
    description:
      "Gender of nouns and agreement of articles, adjectives, and past participles (une belle maison, elles sont parties).",
  },
  {
    slug: "fr_subjonctif",
    label: "subjonctif (déclencheurs)",
    dimension: "grammar",
    description:
      "Subjunctive after triggers of will, emotion, doubt, and conjunctions (il faut que, bien que, pour que, avant que).",
  },
  {
    slug: "fr_prepositions",
    label: "prépositions",
    dimension: "grammar",
    description:
      "Preposition choice: à/de/en/dans/chez, verb government (penser à, dépendre de), places (en France, au Portugal, à Paris).",
  },
  {
    slug: "fr_pronoms_objets",
    label: "pronoms objets (le/la/lui/y/en)",
    dimension: "grammar",
    description:
      "Object pronoun choice, order, and placement, including y and en (j'y vais, il m'en a parlé).",
  },
  {
    slug: "fr_articles_partitif",
    label: "articles et partitif",
    dimension: "grammar",
    description:
      "Article system: du/de la/des, des→de before adjectives, pas de + noun after negation.",
  },
  {
    slug: "fr_negation",
    label: "négation",
    dimension: "grammar",
    description:
      "Negation structure (ne…pas/plus/jamais/rien/personne) and its interaction with articles and pronouns.",
    peninsularNotes:
      "Dropping 'ne' in informal speech (je sais pas) is normal spoken French — do not flag it in a casual conversation.",
  },
  {
    slug: "fr_conditionnel_si",
    label: "conditionnel / phrases en si",
    dimension: "grammar",
    description:
      "Si-clauses and sequence of tenses (si + imparfait → conditionnel; si + plus-que-parfait → conditionnel passé). Never 'si je serais'.",
  },
  {
    slug: "fr_faux_amis",
    label: "faux amis",
    dimension: "vocab",
    description:
      "False friends from English (actuellement≠actually, éventuellement≠eventually, librairie≠library, rester≠to rest).",
  },
  {
    slug: "fr_anglicisme",
    label: "calque de l'anglais",
    dimension: "naturalness",
    description:
      "Literal English-to-French translations a native wouldn't use (je suis excité, prendre une décision correcte, faire du sens).",
  },
  {
    slug: "fr_registre_familier",
    label: "registre familier naturel",
    dimension: "naturalness",
    description:
      "Natural informal spoken French: 'on' for 'nous', fillers (bah, du coup, en fait, genre, carrément), contractions (t'as, j'suis).",
    peninsularNotes:
      "Informal spoken forms ('on' instead of 'nous', dropped 'ne', 't'as') are the TARGET register in conversation — never flag them.",
  },
  {
    slug: "fr_expressions_idiomatiques",
    label: "expressions idiomatiques",
    dimension: "naturalness",
    description:
      "Idiomatic phrasing where a fixed expression is more natural (ça marche, n'importe quoi, j'ai la flemme, ça me dit rien).",
  },
  {
    slug: "fr_connecteurs",
    label: "connecteurs du discours",
    dimension: "flow",
    description:
      "Discourse connectors for cohesion (du coup, en fait, par contre, quand même, bref, d'ailleurs).",
  },
  {
    slug: "fr_questions",
    label: "formation des questions",
    dimension: "flow",
    description:
      "Question formation registers: intonation and est-ce que in speech vs inversion in formal contexts.",
  },
];

// ---------------------------------------------------------------- Portuguese
// (European Portuguese — pt-PT)
export const conceptsPt: Concept[] = [
  {
    slug: "pt_ser_vs_estar",
    label: "ser vs estar",
    dimension: "grammar",
    description:
      "Choosing ser or estar: identity/characteristics vs state/location/result (same axis as Spanish but with pt-specific uses like 'é caro' vs 'está caro').",
  },
  {
    slug: "pt_perfeito_vs_imperfeito",
    label: "pretérito perfeito vs imperfeito",
    dimension: "grammar",
    description:
      "Past-tense aspect: completed/punctual (pretérito perfeito simples) vs ongoing/habitual/background (imperfeito).",
  },
  {
    slug: "pt_conjuntivo",
    label: "conjuntivo (incl. futuro)",
    dimension: "grammar",
    description:
      "Subjunctive triggers, including the distinctly Portuguese futuro do conjuntivo (quando puderes, se fores) and pessoal infinitive contrasts.",
  },
  {
    slug: "pt_infinitivo_pessoal",
    label: "infinitivo pessoal",
    dimension: "grammar",
    description:
      "The personal (inflected) infinitive (para fazermos, antes de saíres) — where it's required or more natural.",
  },
  {
    slug: "pt_colocacao_pronominal",
    label: "colocação pronominal",
    dimension: "grammar",
    description:
      "Clitic placement: European Portuguese defaults to ênclise (disse-me, dá-mo) with próclise after triggers (não me disse, que me disse).",
    peninsularNotes:
      "Target is European Portuguese: Brazilian-style systematic próclise (me disse as a sentence opener) should be corrected toward pt-PT placement.",
  },
  {
    slug: "pt_estar_a_infinitivo",
    label: "estar a + infinitivo",
    dimension: "grammar",
    description:
      "Progressive aspect: pt-PT uses 'estar a fazer'; the Brazilian gerund progressive ('estou fazendo') is an upgrade target, not an error.",
    peninsularNotes:
      "'Estou a fazer' is the European norm. Flag 'estou fazendo' as an UPGRADE toward pt-PT, not as an error.",
  },
  {
    slug: "pt_preposicoes_contracoes",
    label: "preposições e contrações",
    dimension: "grammar",
    description:
      "Preposition choice and mandatory contractions (em+o=no, de+a=da, a+o=ao, por+a=pela) and verb government (gostar de, precisar de).",
  },
  {
    slug: "pt_genero_concordancia",
    label: "género e concordância",
    dimension: "grammar",
    description:
      "Gender and agreement, including nouns that differ from Spanish (o leite, o sangue, a árvore, o nariz).",
  },
  {
    slug: "pt_interferencia_espanhol",
    label: "interferência do espanhol",
    dimension: "vocab",
    description:
      "Portuñol: Spanish words or structures carried into Portuguese (bueno→bom/pronto, cerca→perto, olvidar→esquecer, quedar→ficar).",
  },
  {
    slug: "pt_falsos_amigos",
    label: "falsos amigos",
    dimension: "vocab",
    description:
      "False friends from Spanish and English (embaraçada, esquisito≠exquisito, apelido=surname in pt-PT, borracha, oficina).",
  },
  {
    slug: "pt_brasileirismo",
    label: "brasileirismo léxico",
    dimension: "vocab",
    description:
      "Brazilian vocabulary with a European equivalent (ônibus→autocarro, celular→telemóvel, café da manhã→pequeno-almoço, trem→comboio).",
    peninsularNotes:
      "Target is European Portuguese. Flag clearly Brazilian lexical choices as UPGRADES toward the European term — not as errors.",
  },
  {
    slug: "pt_registo_coloquial",
    label: "registo coloquial europeu",
    dimension: "naturalness",
    description:
      "Natural European colloquial register (fixe, giro, pá, então, pois, bué) used appropriately; informal 'tu' conjugation.",
  },
  {
    slug: "pt_expressoes_idiomaticas",
    label: "expressões idiomáticas",
    dimension: "naturalness",
    description:
      "Idiomatic phrasing where a fixed expression is more natural (não faz mal, deixa lá, está bem, se calhar, dar jeito).",
  },
  {
    slug: "pt_conectores",
    label: "conectores do discurso",
    dimension: "flow",
    description:
      "Discourse connectors for cohesion (no entanto, portanto, aliás, ou seja, entretanto, por acaso).",
  },
];

// ------------------------------------------------------------------ helpers
const CONCEPTS_BY_LANG: Record<Language, Concept[]> = {
  es: concepts,
  fr: conceptsFr,
  pt: conceptsPt,
};

export function conceptsFor(lang: Language): Concept[] {
  return CONCEPTS_BY_LANG[lang];
}

export const allConcepts: Concept[] = [...concepts, ...conceptsFr, ...conceptsPt];

const bySlug = new Map(allConcepts.map((c) => [c.slug, c]));

export const conceptSlugs = allConcepts.map((c) => c.slug);

export function getConcept(slug: string): Concept | undefined {
  return bySlug.get(slug);
}

/** Normalize an LLM-provided slug to a known concept slug, or null if unknown. */
export function resolveConceptSlug(slug: string | null | undefined): string | null {
  if (!slug) return null;
  return bySlug.has(slug) ? slug : null;
}
