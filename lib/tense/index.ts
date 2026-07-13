import { conjugateAll } from "@/lib/conjugation/engine";
import { VERB_BY_INF } from "@/lib/conjugation/verbs";
import { TENSE_LABEL, type Tense } from "@/lib/conjugation/types";

// Tenses offered for practice (presente omitted — too easy for conversation).
export const PRACTICE_TENSES: Tense[] = [
  "preterito",
  "imperfecto",
  "futuro",
  "condicional",
  "subjPresente",
  "subjImperfecto",
];

export function isPracticeTense(x: string): x is Tense {
  return (PRACTICE_TENSES as string[]).includes(x);
}

export function tenseLabel(tense: Tense): string {
  return TENSE_LABEL[tense];
}

// Tense-appropriate opening question that pulls the learner into using it.
const STARTERS: Record<Tense, string> = {
  presente: "Para empezar: ¿cómo es un día normal para ti?",
  preterito: "Para empezar: ¿qué hiciste ayer?",
  imperfecto: "Para empezar: ¿cómo era tu vida cuando eras pequeño?",
  futuro: "Para empezar: ¿qué harás el fin de semana que viene?",
  condicional: "Para empezar: si te tocara la lotería, ¿qué harías?",
  subjPresente: "Para empezar: ¿qué esperas que pase este año? Empieza con «Espero que…».",
  subjImperfecto:
    "Para empezar: imagina que pudieras vivir en cualquier país. ¿Dónde y por qué? Usa «Si…».",
};

const MODELS = ["hablar", "comer", "vivir"] as const;

/** Deterministic opening message for a tense-practice conversation. */
export function buildTenseOpening(tense: Tense): string {
  const label = TENSE_LABEL[tense];
  const reference = MODELS.map((inf) => {
    const forms = conjugateAll(VERB_BY_INF.get(inf)!)[tense];
    return `• ${inf}: ${forms.join(", ")}`;
  }).join("\n");

  return [
    `¡Vale! Vamos a practicar el ${label}.`,
    `Te iré haciendo preguntas y tú respondes usando el ${label} siempre que puedas. Si te equivocas, te corrijo brevemente antes de seguir con la charla. 💪`,
    ``,
    `Referencia — verbos regulares en ${label}:`,
    reference,
    ``,
    STARTERS[tense],
  ].join("\n");
}
