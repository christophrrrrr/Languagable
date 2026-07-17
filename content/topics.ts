// Lightweight conversation seeds. There are no scripted "missions" — a topic
// just gives the conversation partner a direction and a persona to open with.
// The learner can also start from a blank/free chat (topic = null).
// Topics are per-language; slugs are resolved with (language, slug).

import type { Language } from "@/lib/lang";

export interface Topic {
  slug: string;
  label: string;
  /** Seed instruction appended to the conversation system prompt (in the target language). */
  seed: string;
}

const topicsEs: Topic[] = [
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

const topicsFr: Topic[] = [
  {
    slug: "vie_quotidienne",
    label: "Vie quotidienne",
    seed: "Parle du quotidien : routines, projets, comment s'est passée la semaine.",
  },
  {
    slug: "voyager_en_france",
    label: "Voyager en France",
    seed: "Discutez de voyages en France : villes, régions, expériences, recommandations.",
  },
  {
    slug: "travail_et_etudes",
    label: "Travail et études",
    seed: "Parlez du travail ou des études : projets, défis, ambitions.",
  },
  {
    slug: "opinions",
    label: "Donner son avis",
    seed: "Invite à donner son avis et à l'argumenter sur des sujets d'actualité légers.",
  },
  {
    slug: "cuisine",
    label: "Cuisine et gastronomie",
    seed: "Parlez de cuisine, de recettes et d'habitudes gastronomiques, surtout françaises.",
  },
  {
    slug: "raconter_une_histoire",
    label: "Raconter une histoire",
    seed: "Encourage l'apprenant à raconter une anecdote au passé, en favorisant passé composé et imparfait.",
  },
  {
    slug: "hypothetiques",
    label: "Hypothèses",
    seed: "Pose des situations hypothétiques (« que ferais-tu si… ? ») pour travailler le conditionnel et le subjonctif.",
  },
];

const topicsPt: Topic[] = [
  {
    slug: "vida_quotidiana",
    label: "Vida quotidiana",
    seed: "Fala sobre o dia a dia: rotinas, planos, como correu a semana.",
  },
  {
    slug: "viajar_por_portugal",
    label: "Viajar por Portugal",
    seed: "Conversem sobre viagens por Portugal: cidades, roteiros, experiências, recomendações.",
  },
  {
    slug: "trabalho_e_estudos",
    label: "Trabalho e estudos",
    seed: "Conversem sobre o trabalho ou os estudos: projetos, desafios, ambições.",
  },
  {
    slug: "opinioes",
    label: "Dar opiniões",
    seed: "Convida a dar opiniões e a argumentá-las sobre temas leves da atualidade.",
  },
  {
    slug: "comida",
    label: "Comida e cozinha",
    seed: "Falem de comida, receitas e costumes gastronómicos, sobretudo portugueses.",
  },
  {
    slug: "contar_uma_historia",
    label: "Contar uma história",
    seed: "Anima o aprendiz a contar uma história do passado, fomentando o pretérito perfeito e o imperfeito.",
  },
  {
    slug: "hipoteticos",
    label: "Hipotéticos",
    seed: "Coloca situações hipotéticas («o que farias se...?») para praticar o condicional e o conjuntivo.",
  },
];

const TOPICS_BY_LANG: Record<Language, Topic[]> = {
  es: topicsEs,
  fr: topicsFr,
  pt: topicsPt,
};

const bySlug: Record<Language, Map<string, Topic>> = {
  es: new Map(topicsEs.map((t) => [t.slug, t])),
  fr: new Map(topicsFr.map((t) => [t.slug, t])),
  pt: new Map(topicsPt.map((t) => [t.slug, t])),
};

export function topicsFor(lang: Language): Topic[] {
  return TOPICS_BY_LANG[lang];
}

export function getTopic(lang: Language, slug: string): Topic | undefined {
  return bySlug[lang].get(slug);
}
