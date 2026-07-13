// Lightweight conversation seeds. There are no scripted "missions" — a topic
// just gives the conversation partner a direction and a persona to open with.
// The learner can also start from a blank/free chat (topic = null).

export interface Topic {
  slug: string;
  label: string;
  /** Seed instruction appended to the conversation system prompt (in Spanish). */
  seed: string;
}

export const topics: Topic[] = [
  {
    slug: "vida_cotidiana",
    label: "Vida cotidiana",
    seed: "Habla sobre el día a día: rutinas, planes, cómo ha ido la semana.",
  },
  {
    slug: "viajar_por_espana",
    label: "Viajar por España",
    seed: "Charlad sobre viajes por España: ciudades, rutas, experiencias, recomendaciones.",
  },
  {
    slug: "trabajo_y_estudios",
    label: "Trabajo y estudios",
    seed: "Conversad sobre el trabajo o los estudios: proyectos, retos, ambiciones.",
  },
  {
    slug: "opiniones",
    label: "Dar opiniones",
    seed: "Invita a dar opiniones y a argumentarlas sobre temas de actualidad ligeros.",
  },
  {
    slug: "comida",
    label: "Comida y cocina",
    seed: "Hablad de comida, recetas y costumbres gastronómicas, sobre todo españolas.",
  },
  {
    slug: "contar_una_historia",
    label: "Contar una historia",
    seed: "Anima al aprendiz a contar una anécdota del pasado, fomentando pretérito e imperfecto.",
  },
  {
    slug: "hipoteticos",
    label: "Hipotéticos",
    seed: "Plantea situaciones hipotéticas ('¿qué harías si...?') para practicar el condicional y el subjuntivo.",
  },
];

const bySlug = new Map(topics.map((t) => [t.slug, t]));

export function getTopic(slug: string): Topic | undefined {
  return bySlug.get(slug);
}
