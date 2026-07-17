import type { Language } from "./lang";

// Full-immersion UI: every user-facing string exists in the three target
// languages and the site renders entirely in the language being learned.
// Informal address ("tú"/"tu"/"tu") everywhere, matching the tutor's voice.
export interface UIStrings {
  // -- shared chrome
  home: string;
  cardsNav: string;
  changeLanguage: string;
  save: string;
  cancel: string;
  delete: string;
  dbNotConfigured: string;

  // -- home page
  tagline: string;
  yourCards: string;
  viewFolders: string;
  cardsDueLine: (n: number, due: number) => string;
  practiceN: (n: number) => string;
  noFolder: string;
  topicsHeading: string;
  freeChat: string;
  tenseHeading: string;
  tenseSub: string;
  recentHeading: string;
  practicePrefix: string;
  status: Record<string, string>;

  // -- tarjetas hub
  cardsTitle: string;
  hubSubtitle: string;
  practiceAllN: (n: number) => string;
  allCards: string;
  nCards: (n: number) => string;
  dueBadge: (n: number) => string;
  newFolderPlaceholder: string;
  createFolder: string;
  rename: string;
  deleteFolderTitle: string;
  deleteFolderConfirm: (name: string) => string;

  // -- folder page
  foldersLink: string;
  allSub: string;
  unfiledSub: string;
  folderSub: string;

  // -- card list + practice
  reviewAll: string;
  emptyFolder: string;
  ratings: { again: string; hard: string; good: string; easy: string };
  stateNew: string;
  stateLearning: string;
  stateMastered: string;
  showAnswer: string;
  sessionDone: string;
  back: string;
  moveToFolder: string;

  // -- chat
  conversationTitle: string;
  inputPlaceholder: string;
  send: string;
  noAnswer: string;
  connectionError: string;
  savePhrase: string;
  savedFlash: string;
  phraseLabel: string;
  phrasePlaceholder: string;
  meaningLabel: string;
  meaningPlaceholder: string;
  folderLabel: string;
  newFolderOption: string;
  folderNamePlaceholder: string;
  noteLabel: string;
  finishAnalyze: string;
  analyzing: string;

  // -- report
  reportTitle: string;
  keepTalking: string;
  didWell: string;
  errorsHeading: string;
  errorsSub: string;
  noErrors: string;
  upgradesHeading: string;
  upgradesSub: string;
  noUpgrades: string;
  saveToPractice: string;
  possible: string;
  detectorLabel: string;
  aiLabel: string;
  dimensions: Record<string, string>;
}

const es: UIStrings = {
  home: "Inicio",
  cardsNav: "Tarjetas",
  changeLanguage: "Cambiar de idioma",
  save: "Guardar",
  cancel: "Cancelar",
  delete: "Eliminar",
  dbNotConfigured: "La base de datos no está configurada.",

  tagline: "Habla en español de España y te corrijo sobre la marcha.",
  yourCards: "Tus tarjetas",
  viewFolders: "Ver carpetas",
  cardsDueLine: (n, due) => `${n} tarjetas · ${due} pendientes`,
  practiceN: (n) => `Practicar (${n})`,
  noFolder: "Sin carpeta",
  topicsHeading: "¿De qué hablamos hoy?",
  freeChat: "Charla libre",
  tenseHeading: "Practica un tiempo verbal",
  tenseSub:
    "Elige un tiempo y conversamos forzándolo; te corrijo la conjugación.",
  recentHeading: "Conversaciones recientes",
  practicePrefix: "Práctica: ",
  status: { active: "en curso", analyzing: "analizando", analyzed: "analizada" },

  cardsTitle: "Tarjetas",
  hubSubtitle: "Tus carpetas de práctica. Elige una para repasar solo lo suyo.",
  practiceAllN: (n) => `Practicar todo (${n})`,
  allCards: "Todas las tarjetas",
  nCards: (n) => `${n} tarjetas`,
  dueBadge: (n) => `${n} pendientes`,
  newFolderPlaceholder: "Nueva carpeta (p. ej. Dichos)",
  createFolder: "Crear carpeta",
  rename: "Renombrar",
  deleteFolderTitle: "Eliminar carpeta",
  deleteFolderConfirm: (name) =>
    `¿Eliminar la carpeta «${name}»? Sus tarjetas no se borran.`,

  foldersLink: "Carpetas",
  allSub: "Todo lo que has guardado, de todas las carpetas.",
  unfiledSub: "Tarjetas que aún no has metido en ninguna carpeta.",
  folderSub: "Solo las tarjetas de esta carpeta.",

  reviewAll: "Repasar todas",
  emptyFolder:
    "No hay tarjetas aquí. Usa «+ Guardar frase» en una conversación o «Guardar para practicar» en un informe.",
  ratings: { again: "Otra vez", hard: "Difícil", good: "Bien", easy: "Fácil" },
  stateNew: "nueva",
  stateLearning: "aprendiendo",
  stateMastered: "dominada",
  showAnswer: "Mostrar respuesta",
  sessionDone: "¡Repaso terminado! 🎉",
  back: "Volver",
  moveToFolder: "Mover a carpeta",

  conversationTitle: "Conversación",
  inputPlaceholder: "Escribe en español…",
  send: "Enviar",
  noAnswer: "⚠️ No se pudo obtener respuesta.",
  connectionError: "Error de conexión",
  savePhrase: "+ Guardar frase",
  savedFlash: "Guardada ✓",
  phraseLabel: "Frase o expresión",
  phrasePlaceholder: "ir viento en popa",
  meaningLabel: "Significado / pista",
  meaningPlaceholder: "ir muy bien, sobre ruedas",
  folderLabel: "Carpeta",
  newFolderOption: "+ Nueva carpeta…",
  folderNamePlaceholder: "Nombre de la carpeta",
  noteLabel: "Nota (opcional)",
  finishAnalyze: "Terminar y analizar",
  analyzing: "Analizando…",

  reportTitle: "Informe",
  keepTalking: "Seguir hablando",
  didWell: "Lo que has hecho bien",
  errorsHeading: "Errores",
  errorsSub: "Cosas que están mal. Guarda las que quieras practicar.",
  noErrors: "Ningún error detectado. 🎉",
  upgradesHeading: "Mejoras",
  upgradesSub:
    "Correcto, pero un nativo lo diría de otra forma (sugerencias, no errores).",
  noUpgrades: "Sin sugerencias.",
  saveToPractice: "Guardar para practicar",
  possible: "posible",
  detectorLabel: "detector",
  aiLabel: "IA",
  dimensions: {
    grammar: "Gramática",
    vocab: "Vocabulario",
    naturalness: "Naturalidad",
    flow: "Fluidez",
  },
};

const fr: UIStrings = {
  home: "Accueil",
  cardsNav: "Cartes",
  changeLanguage: "Changer de langue",
  save: "Enregistrer",
  cancel: "Annuler",
  delete: "Supprimer",
  dbNotConfigured: "La base de données n'est pas configurée.",

  tagline: "Parle en français de France et je te corrige au fil de l'eau.",
  yourCards: "Tes cartes",
  viewFolders: "Voir les dossiers",
  cardsDueLine: (n, due) => `${n} cartes · ${due} à réviser`,
  practiceN: (n) => `Réviser (${n})`,
  noFolder: "Sans dossier",
  topicsHeading: "De quoi parle-t-on aujourd'hui ?",
  freeChat: "Discussion libre",
  tenseHeading: "Travaille un temps verbal",
  tenseSub:
    "Choisis un temps et on discute en le forçant ; je corrige ta conjugaison.",
  recentHeading: "Conversations récentes",
  practicePrefix: "Entraînement : ",
  status: {
    active: "en cours",
    analyzing: "analyse en cours",
    analyzed: "analysée",
  },

  cardsTitle: "Cartes",
  hubSubtitle:
    "Tes dossiers de révision. Choisis-en un pour ne réviser que lui.",
  practiceAllN: (n) => `Tout réviser (${n})`,
  allCards: "Toutes les cartes",
  nCards: (n) => `${n} cartes`,
  dueBadge: (n) => `${n} à réviser`,
  newFolderPlaceholder: "Nouveau dossier (p. ex. Dictons)",
  createFolder: "Créer le dossier",
  rename: "Renommer",
  deleteFolderTitle: "Supprimer le dossier",
  deleteFolderConfirm: (name) =>
    `Supprimer le dossier « ${name} » ? Ses cartes ne seront pas effacées.`,

  foldersLink: "Dossiers",
  allSub: "Tout ce que tu as enregistré, tous dossiers confondus.",
  unfiledSub: "Cartes que tu n'as encore rangées dans aucun dossier.",
  folderSub: "Uniquement les cartes de ce dossier.",

  reviewAll: "Tout revoir",
  emptyFolder:
    "Aucune carte ici. Utilise « + Enregistrer une phrase » dans une conversation ou « Garder pour réviser » dans un bilan.",
  ratings: { again: "Encore", hard: "Difficile", good: "Bien", easy: "Facile" },
  stateNew: "nouvelle",
  stateLearning: "en cours",
  stateMastered: "maîtrisée",
  showAnswer: "Voir la réponse",
  sessionDone: "Révision terminée ! 🎉",
  back: "Retour",
  moveToFolder: "Déplacer vers un dossier",

  conversationTitle: "Conversation",
  inputPlaceholder: "Écris en français…",
  send: "Envoyer",
  noAnswer: "⚠️ Impossible d'obtenir une réponse.",
  connectionError: "Erreur de connexion",
  savePhrase: "+ Enregistrer une phrase",
  savedFlash: "Enregistrée ✓",
  phraseLabel: "Phrase ou expression",
  phrasePlaceholder: "avoir le vent en poupe",
  meaningLabel: "Sens / indice",
  meaningPlaceholder: "très bien marcher, réussir",
  folderLabel: "Dossier",
  newFolderOption: "+ Nouveau dossier…",
  folderNamePlaceholder: "Nom du dossier",
  noteLabel: "Note (facultatif)",
  finishAnalyze: "Terminer et analyser",
  analyzing: "Analyse en cours…",

  reportTitle: "Bilan",
  keepTalking: "Continuer à discuter",
  didWell: "Ce que tu as bien fait",
  errorsHeading: "Erreurs",
  errorsSub: "Ce qui est incorrect. Garde ce que tu veux réviser.",
  noErrors: "Aucune erreur détectée. 🎉",
  upgradesHeading: "Améliorations",
  upgradesSub:
    "Correct, mais un natif le dirait autrement (suggestions, pas des erreurs).",
  noUpgrades: "Pas de suggestions.",
  saveToPractice: "Garder pour réviser",
  possible: "possible",
  detectorLabel: "détecteur",
  aiLabel: "IA",
  dimensions: {
    grammar: "Grammaire",
    vocab: "Vocabulaire",
    naturalness: "Naturel",
    flow: "Fluidité",
  },
};

const pt: UIStrings = {
  home: "Início",
  cardsNav: "Cartões",
  changeLanguage: "Mudar de língua",
  save: "Guardar",
  cancel: "Cancelar",
  delete: "Eliminar",
  dbNotConfigured: "A base de dados não está configurada.",

  tagline: "Fala em português de Portugal e eu corrijo-te em tempo real.",
  yourCards: "Os teus cartões",
  viewFolders: "Ver as pastas",
  cardsDueLine: (n, due) => `${n} cartões · ${due} pendentes`,
  practiceN: (n) => `Praticar (${n})`,
  noFolder: "Sem pasta",
  topicsHeading: "De que falamos hoje?",
  freeChat: "Conversa livre",
  tenseHeading: "Pratica um tempo verbal",
  tenseSub:
    "Escolhe um tempo e conversamos a forçá-lo; corrijo-te a conjugação.",
  recentHeading: "Conversas recentes",
  practicePrefix: "Prática: ",
  status: { active: "em curso", analyzing: "a analisar", analyzed: "analisada" },

  cardsTitle: "Cartões",
  hubSubtitle:
    "As tuas pastas de prática. Escolhe uma para rever só o que lá está.",
  practiceAllN: (n) => `Praticar tudo (${n})`,
  allCards: "Todos os cartões",
  nCards: (n) => `${n} cartões`,
  dueBadge: (n) => `${n} pendentes`,
  newFolderPlaceholder: "Nova pasta (p. ex. Ditados)",
  createFolder: "Criar pasta",
  rename: "Renomear",
  deleteFolderTitle: "Eliminar pasta",
  deleteFolderConfirm: (name) =>
    `Eliminar a pasta «${name}»? Os cartões não são apagados.`,

  foldersLink: "Pastas",
  allSub: "Tudo o que guardaste, de todas as pastas.",
  unfiledSub: "Cartões que ainda não puseste em nenhuma pasta.",
  folderSub: "Só os cartões desta pasta.",

  reviewAll: "Rever todos",
  emptyFolder:
    "Não há cartões aqui. Usa «+ Guardar frase» numa conversa ou «Guardar para praticar» num relatório.",
  ratings: { again: "Outra vez", hard: "Difícil", good: "Bem", easy: "Fácil" },
  stateNew: "novo",
  stateLearning: "a aprender",
  stateMastered: "dominado",
  showAnswer: "Mostrar resposta",
  sessionDone: "Revisão terminada! 🎉",
  back: "Voltar",
  moveToFolder: "Mover para uma pasta",

  conversationTitle: "Conversa",
  inputPlaceholder: "Escreve em português…",
  send: "Enviar",
  noAnswer: "⚠️ Não foi possível obter resposta.",
  connectionError: "Erro de ligação",
  savePhrase: "+ Guardar frase",
  savedFlash: "Guardado ✓",
  phraseLabel: "Frase ou expressão",
  phrasePlaceholder: "ir de vento em popa",
  meaningLabel: "Significado / pista",
  meaningPlaceholder: "correr muito bem",
  folderLabel: "Pasta",
  newFolderOption: "+ Nova pasta…",
  folderNamePlaceholder: "Nome da pasta",
  noteLabel: "Nota (opcional)",
  finishAnalyze: "Terminar e analisar",
  analyzing: "A analisar…",

  reportTitle: "Relatório",
  keepTalking: "Continuar a falar",
  didWell: "O que fizeste bem",
  errorsHeading: "Erros",
  errorsSub: "Coisas que estão erradas. Guarda as que quiseres praticar.",
  noErrors: "Nenhum erro detetado. 🎉",
  upgradesHeading: "Melhorias",
  upgradesSub:
    "Correto, mas um nativo diria de outra forma (sugestões, não erros).",
  noUpgrades: "Sem sugestões.",
  saveToPractice: "Guardar para praticar",
  possible: "possível",
  detectorLabel: "detetor",
  aiLabel: "IA",
  dimensions: {
    grammar: "Gramática",
    vocab: "Vocabulário",
    naturalness: "Naturalidade",
    flow: "Fluidez",
  },
};

const STRINGS: Record<Language, UIStrings> = { es, fr, pt };

export function ui(lang: Language): UIStrings {
  return STRINGS[lang];
}

/** The "you said this before" note on cards saved from a report issue. */
export function issueCardNote(lang: Language, original: string): string {
  if (lang === "fr") return `Avant tu disais : « ${original} »`;
  if (lang === "pt") return `Antes disseste: «${original}»`;
  return `Antes dijiste: «${original}»`;
}
