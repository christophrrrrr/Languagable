import { conjugateAll } from "@/lib/conjugation/engine";
import { VERB_BY_INF } from "@/lib/conjugation/verbs";
import { TENSE_LABEL, type Tense } from "@/lib/conjugation/types";
import type { Language } from "@/lib/lang";

// Per-language tense practice. Spanish keeps the deterministic conjugation
// engine for its reference tables; French and Portuguese use hand-authored
// tables for three regular model verbs (the drilling itself is LLM-driven —
// the conversation prompt forces the tense and corrects conjugation).

// ------------------------------------------------------------------ Spanish
// (presente omitted — too easy for conversation)
const PRACTICE_TENSES_ES: Tense[] = [
  "preterito",
  "imperfecto",
  "futuro",
  "condicional",
  "subjPresente",
  "subjImperfecto",
];

// Tense-appropriate opening question that pulls the learner into using it.
const STARTERS_ES: Record<Tense, string> = {
  presente: "Para empezar: ¿cómo es un día normal para ti?",
  preterito: "Para empezar: ¿qué hiciste ayer?",
  imperfecto: "Para empezar: ¿cómo era tu vida cuando eras pequeño?",
  futuro: "Para empezar: ¿qué harás el fin de semana que viene?",
  condicional: "Para empezar: si te tocara la lotería, ¿qué harías?",
  subjPresente: "Para empezar: ¿qué esperas que pase este año? Empieza con «Espero que…».",
  subjImperfecto:
    "Para empezar: imagina que pudieras vivir en cualquier país. ¿Dónde y por qué? Usa «Si…».",
};

const MODELS_ES = ["hablar", "comer", "vivir"] as const;

function esReference(tense: Tense): string {
  return MODELS_ES.map((inf) => {
    const forms = conjugateAll(VERB_BY_INF.get(inf)!)[tense];
    return `• ${inf}: ${forms.join(", ")}`;
  }).join("\n");
}

// ------------------------------------------------------------------- French
interface AuthoredTense {
  slug: string;
  label: string;
  /** "• infinitive: form, form, …" reference lines for regular model verbs. */
  reference: string;
  starter: string;
}

const TENSES_FR: AuthoredTense[] = [
  {
    slug: "passeCompose",
    label: "passé composé",
    reference: [
      "• parler : j'ai parlé, tu as parlé, il a parlé, nous avons parlé, vous avez parlé, ils ont parlé",
      "• finir : j'ai fini, tu as fini, il a fini, nous avons fini, vous avez fini, ils ont fini",
      "• vendre : j'ai vendu, tu as vendu, il a vendu, nous avons vendu, vous avez vendu, ils ont vendu",
    ].join("\n"),
    starter: "Pour commencer : qu'est-ce que tu as fait hier ?",
  },
  {
    slug: "imparfait",
    label: "imparfait",
    reference: [
      "• parler : parlais, parlais, parlait, parlions, parliez, parlaient",
      "• finir : finissais, finissais, finissait, finissions, finissiez, finissaient",
      "• vendre : vendais, vendais, vendait, vendions, vendiez, vendaient",
    ].join("\n"),
    starter: "Pour commencer : comment était ta vie quand tu étais petit ?",
  },
  {
    slug: "plusQueParfait",
    label: "plus-que-parfait",
    reference: [
      "• parler : j'avais parlé, tu avais parlé, il avait parlé, nous avions parlé, vous aviez parlé, ils avaient parlé",
      "• finir : j'avais fini, tu avais fini, il avait fini, nous avions fini, vous aviez fini, ils avaient fini",
      "• vendre : j'avais vendu, tu avais vendu, il avait vendu, nous avions vendu, vous aviez vendu, ils avaient vendu",
    ].join("\n"),
    starter:
      "Pour commencer : raconte-moi une fois où tu es arrivé quelque part et où quelque chose s'était déjà passé.",
  },
  {
    slug: "futurSimple",
    label: "futur simple",
    reference: [
      "• parler : parlerai, parleras, parlera, parlerons, parlerez, parleront",
      "• finir : finirai, finiras, finira, finirons, finirez, finiront",
      "• vendre : vendrai, vendras, vendra, vendrons, vendrez, vendront",
    ].join("\n"),
    starter: "Pour commencer : que feras-tu le week-end prochain ?",
  },
  {
    slug: "conditionnel",
    label: "conditionnel présent",
    reference: [
      "• parler : parlerais, parlerais, parlerait, parlerions, parleriez, parleraient",
      "• finir : finirais, finirais, finirait, finirions, finiriez, finiraient",
      "• vendre : vendrais, vendrais, vendrait, vendrions, vendriez, vendraient",
    ].join("\n"),
    starter: "Pour commencer : si tu gagnais au loto, que ferais-tu ?",
  },
  {
    slug: "subjonctifPresent",
    label: "subjonctif présent",
    reference: [
      "• parler : que je parle, que tu parles, qu'il parle, que nous parlions, que vous parliez, qu'ils parlent",
      "• finir : que je finisse, que tu finisses, qu'il finisse, que nous finissions, que vous finissiez, qu'ils finissent",
      "• vendre : que je vende, que tu vendes, qu'il vende, que nous vendions, que vous vendiez, qu'ils vendent",
    ].join("\n"),
    starter:
      "Pour commencer : qu'est-ce que tu veux qu'il se passe cette année ? Commence par « Je veux que… ».",
  },
];

// --------------------------------------------------------------- Portuguese
// (European Portuguese; vós omitted — archaic in modern pt-PT)
const TENSES_PT: AuthoredTense[] = [
  {
    slug: "preteritoPerfeito",
    label: "pretérito perfeito",
    reference: [
      "• falar: falei, falaste, falou, falámos, falaram",
      "• comer: comi, comeste, comeu, comemos, comeram",
      "• partir: parti, partiste, partiu, partimos, partiram",
    ].join("\n"),
    starter: "Para começar: o que fizeste ontem?",
  },
  {
    slug: "imperfeito",
    label: "pretérito imperfeito",
    reference: [
      "• falar: falava, falavas, falava, falávamos, falavam",
      "• comer: comia, comias, comia, comíamos, comiam",
      "• partir: partia, partias, partia, partíamos, partiam",
    ].join("\n"),
    starter: "Para começar: como era a tua vida quando eras pequeno?",
  },
  {
    slug: "futuro",
    label: "futuro simples",
    reference: [
      "• falar: falarei, falarás, falará, falaremos, falarão",
      "• comer: comerei, comerás, comerá, comeremos, comerão",
      "• partir: partirei, partirás, partirá, partiremos, partirão",
    ].join("\n"),
    starter: "Para começar: o que farás no próximo fim de semana?",
  },
  {
    slug: "condicional",
    label: "condicional",
    reference: [
      "• falar: falaria, falarias, falaria, falaríamos, falariam",
      "• comer: comeria, comerias, comeria, comeríamos, comeriam",
      "• partir: partiria, partirias, partiria, partiríamos, partiriam",
    ].join("\n"),
    starter: "Para começar: se ganhasses a lotaria, o que farias?",
  },
  {
    slug: "conjuntivoPresente",
    label: "presente do conjuntivo",
    reference: [
      "• falar: fale, fales, fale, falemos, falem",
      "• comer: coma, comas, coma, comamos, comam",
      "• partir: parta, partas, parta, partamos, partam",
    ].join("\n"),
    starter:
      "Para começar: o que esperas que aconteça este ano? Começa com «Espero que…».",
  },
  {
    slug: "conjuntivoFuturo",
    label: "futuro do conjuntivo",
    reference: [
      "• falar: falar, falares, falar, falarmos, falarem",
      "• comer: comer, comeres, comer, comermos, comerem",
      "• partir: partir, partires, partir, partirmos, partirem",
    ].join("\n"),
    starter:
      "Para começar: o que vais fazer quando tiveres tempo livre? Usa «quando + futuro do conjuntivo».",
  },
];

const AUTHORED: Record<"fr" | "pt", AuthoredTense[]> = {
  fr: TENSES_FR,
  pt: TENSES_PT,
};

// -------------------------------------------------------------------- API
export function practiceTensesFor(lang: Language): string[] {
  if (lang === "es") return PRACTICE_TENSES_ES;
  return AUTHORED[lang].map((t) => t.slug);
}

export function isPracticeTense(lang: Language, slug: string): boolean {
  return practiceTensesFor(lang).includes(slug);
}

export function tenseLabel(lang: Language, slug: string): string {
  if (lang === "es") return TENSE_LABEL[slug as Tense] ?? slug;
  return AUTHORED[lang].find((t) => t.slug === slug)?.label ?? slug;
}

/** Deterministic opening message for a tense-practice conversation. */
export function buildTenseOpening(lang: Language, slug: string): string {
  if (lang === "es") {
    const tense = slug as Tense;
    const label = TENSE_LABEL[tense];
    return [
      `¡Vale! Vamos a practicar el ${label}.`,
      `Te iré haciendo preguntas y tú respondes usando el ${label} siempre que puedas. Si te equivocas, te corrijo brevemente antes de seguir con la charla. 💪`,
      ``,
      `Referencia — verbos regulares en ${label}:`,
      esReference(tense),
      ``,
      STARTERS_ES[tense],
    ].join("\n");
  }

  const tense = AUTHORED[lang].find((t) => t.slug === slug)!;
  if (lang === "fr") {
    return [
      `Allez ! On va travailler le ${tense.label}.`,
      `Je vais te poser des questions et tu réponds en utilisant le ${tense.label} dès que possible. Si tu te trompes, je te corrige brièvement avant de continuer. 💪`,
      ``,
      `Rappel — verbes réguliers au ${tense.label} :`,
      tense.reference,
      ``,
      tense.starter,
    ].join("\n");
  }
  return [
    `Boa! Vamos praticar o ${tense.label}.`,
    `Vou fazer-te perguntas e tu respondes usando o ${tense.label} sempre que puderes. Se te enganares, corrijo-te brevemente antes de continuar. 💪`,
    ``,
    `Referência — verbos regulares no ${tense.label}:`,
    tense.reference,
    ``,
    tense.starter,
  ].join("\n");
}
