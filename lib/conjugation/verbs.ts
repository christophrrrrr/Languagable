import type { VerbSpec } from "./types";

// Forms are always in PERSONS order: [yo, tú, él, nosotros, vosotros, ellos].
// Only tenses that deviate from the regular rules are overridden; the rest are
// computed. Imperfecto de subjuntivo is always derived from the pretérito.

export const VERBS: VerbSpec[] = [
  // ---- regular models ----
  { infinitive: "hablar", gloss: "to speak" },
  { infinitive: "comer", gloss: "to eat" },
  { infinitive: "vivir", gloss: "to live" },
  { infinitive: "trabajar", gloss: "to work" },
  { infinitive: "estudiar", gloss: "to study" },
  { infinitive: "comprar", gloss: "to buy" },
  { infinitive: "tomar", gloss: "to take / drink" },
  { infinitive: "necesitar", gloss: "to need" },
  { infinitive: "beber", gloss: "to drink" },
  { infinitive: "aprender", gloss: "to learn" },
  { infinitive: "escribir", gloss: "to write" },
  { infinitive: "abrir", gloss: "to open" },

  // ---- -ar/-er stem changers (e→ie, o→ue) ----
  {
    infinitive: "pensar",
    gloss: "to think",
    forms: {
      presente: ["pienso", "piensas", "piensa", "pensamos", "pensáis", "piensan"],
      subjPresente: ["piense", "pienses", "piense", "pensemos", "penséis", "piensen"],
    },
  },
  {
    infinitive: "entender",
    gloss: "to understand",
    forms: {
      presente: ["entiendo", "entiendes", "entiende", "entendemos", "entendéis", "entienden"],
      subjPresente: ["entienda", "entiendas", "entienda", "entendamos", "entendáis", "entiendan"],
    },
  },
  {
    infinitive: "volver",
    gloss: "to return",
    forms: {
      presente: ["vuelvo", "vuelves", "vuelve", "volvemos", "volvéis", "vuelven"],
      subjPresente: ["vuelva", "vuelvas", "vuelva", "volvamos", "volváis", "vuelvan"],
    },
  },
  {
    infinitive: "contar",
    gloss: "to count / tell",
    forms: {
      presente: ["cuento", "cuentas", "cuenta", "contamos", "contáis", "cuentan"],
      subjPresente: ["cuente", "cuentes", "cuente", "contemos", "contéis", "cuenten"],
    },
  },
  {
    infinitive: "encontrar",
    gloss: "to find",
    forms: {
      presente: ["encuentro", "encuentras", "encuentra", "encontramos", "encontráis", "encuentran"],
      subjPresente: ["encuentre", "encuentres", "encuentre", "encontremos", "encontréis", "encuentren"],
    },
  },

  // ---- -ir stem changers ----
  {
    infinitive: "pedir",
    gloss: "to ask for",
    forms: {
      presente: ["pido", "pides", "pide", "pedimos", "pedís", "piden"],
      preterito: ["pedí", "pediste", "pidió", "pedimos", "pedisteis", "pidieron"],
      subjPresente: ["pida", "pidas", "pida", "pidamos", "pidáis", "pidan"],
    },
  },
  {
    infinitive: "servir",
    gloss: "to serve",
    forms: {
      presente: ["sirvo", "sirves", "sirve", "servimos", "servís", "sirven"],
      preterito: ["serví", "serviste", "sirvió", "servimos", "servisteis", "sirvieron"],
      subjPresente: ["sirva", "sirvas", "sirva", "sirvamos", "sirváis", "sirvan"],
    },
  },
  {
    infinitive: "dormir",
    gloss: "to sleep",
    forms: {
      presente: ["duermo", "duermes", "duerme", "dormimos", "dormís", "duermen"],
      preterito: ["dormí", "dormiste", "durmió", "dormimos", "dormisteis", "durmieron"],
      subjPresente: ["duerma", "duermas", "duerma", "durmamos", "durmáis", "duerman"],
    },
  },
  {
    infinitive: "sentir",
    gloss: "to feel",
    forms: {
      presente: ["siento", "sientes", "siente", "sentimos", "sentís", "sienten"],
      preterito: ["sentí", "sentiste", "sintió", "sentimos", "sentisteis", "sintieron"],
      subjPresente: ["sienta", "sientas", "sienta", "sintamos", "sintáis", "sientan"],
    },
  },
  {
    infinitive: "preferir",
    gloss: "to prefer",
    forms: {
      presente: ["prefiero", "prefieres", "prefiere", "preferimos", "preferís", "prefieren"],
      preterito: ["preferí", "preferiste", "prefirió", "preferimos", "preferisteis", "prefirieron"],
      subjPresente: ["prefiera", "prefieras", "prefiera", "prefiramos", "prefiráis", "prefieran"],
    },
  },
  {
    infinitive: "seguir",
    gloss: "to follow / continue",
    forms: {
      presente: ["sigo", "sigues", "sigue", "seguimos", "seguís", "siguen"],
      preterito: ["seguí", "seguiste", "siguió", "seguimos", "seguisteis", "siguieron"],
      subjPresente: ["siga", "sigas", "siga", "sigamos", "sigáis", "sigan"],
    },
  },

  // ---- orthographic (-car/-gar/-zar) ----
  {
    infinitive: "buscar",
    gloss: "to look for",
    forms: {
      preterito: ["busqué", "buscaste", "buscó", "buscamos", "buscasteis", "buscaron"],
      subjPresente: ["busque", "busques", "busque", "busquemos", "busquéis", "busquen"],
    },
  },
  {
    infinitive: "llegar",
    gloss: "to arrive",
    forms: {
      preterito: ["llegué", "llegaste", "llegó", "llegamos", "llegasteis", "llegaron"],
      subjPresente: ["llegue", "llegues", "llegue", "lleguemos", "lleguéis", "lleguen"],
    },
  },
  {
    infinitive: "empezar",
    gloss: "to begin",
    forms: {
      presente: ["empiezo", "empiezas", "empieza", "empezamos", "empezáis", "empiezan"],
      preterito: ["empecé", "empezaste", "empezó", "empezamos", "empezasteis", "empezaron"],
      subjPresente: ["empiece", "empieces", "empiece", "empecemos", "empecéis", "empiecen"],
    },
  },
  {
    infinitive: "jugar",
    gloss: "to play",
    forms: {
      presente: ["juego", "juegas", "juega", "jugamos", "jugáis", "juegan"],
      preterito: ["jugué", "jugaste", "jugó", "jugamos", "jugasteis", "jugaron"],
      subjPresente: ["juegue", "juegues", "juegue", "juguemos", "juguéis", "jueguen"],
    },
  },

  // ---- i→y pretérito ----
  {
    infinitive: "leer",
    gloss: "to read",
    forms: {
      preterito: ["leí", "leíste", "leyó", "leímos", "leísteis", "leyeron"],
    },
  },

  // ---- fully irregular ----
  {
    infinitive: "ser",
    gloss: "to be (essence)",
    forms: {
      presente: ["soy", "eres", "es", "somos", "sois", "son"],
      preterito: ["fui", "fuiste", "fue", "fuimos", "fuisteis", "fueron"],
      imperfecto: ["era", "eras", "era", "éramos", "erais", "eran"],
      subjPresente: ["sea", "seas", "sea", "seamos", "seáis", "sean"],
    },
  },
  {
    infinitive: "estar",
    gloss: "to be (state)",
    forms: {
      presente: ["estoy", "estás", "está", "estamos", "estáis", "están"],
      preterito: ["estuve", "estuviste", "estuvo", "estuvimos", "estuvisteis", "estuvieron"],
      subjPresente: ["esté", "estés", "esté", "estemos", "estéis", "estén"],
    },
  },
  {
    infinitive: "ir",
    gloss: "to go",
    forms: {
      presente: ["voy", "vas", "va", "vamos", "vais", "van"],
      preterito: ["fui", "fuiste", "fue", "fuimos", "fuisteis", "fueron"],
      imperfecto: ["iba", "ibas", "iba", "íbamos", "ibais", "iban"],
      subjPresente: ["vaya", "vayas", "vaya", "vayamos", "vayáis", "vayan"],
    },
  },
  {
    infinitive: "haber",
    gloss: "to have (auxiliary)",
    futureStem: "habr",
    forms: {
      presente: ["he", "has", "ha", "hemos", "habéis", "han"],
      preterito: ["hube", "hubiste", "hubo", "hubimos", "hubisteis", "hubieron"],
      subjPresente: ["haya", "hayas", "haya", "hayamos", "hayáis", "hayan"],
    },
  },
  {
    infinitive: "tener",
    gloss: "to have",
    futureStem: "tendr",
    forms: {
      presente: ["tengo", "tienes", "tiene", "tenemos", "tenéis", "tienen"],
      preterito: ["tuve", "tuviste", "tuvo", "tuvimos", "tuvisteis", "tuvieron"],
    },
  },
  {
    infinitive: "hacer",
    gloss: "to do / make",
    futureStem: "har",
    forms: {
      presente: ["hago", "haces", "hace", "hacemos", "hacéis", "hacen"],
      preterito: ["hice", "hiciste", "hizo", "hicimos", "hicisteis", "hicieron"],
    },
  },
  {
    infinitive: "decir",
    gloss: "to say / tell",
    futureStem: "dir",
    forms: {
      presente: ["digo", "dices", "dice", "decimos", "decís", "dicen"],
      preterito: ["dije", "dijiste", "dijo", "dijimos", "dijisteis", "dijeron"],
    },
  },
  {
    infinitive: "poner",
    gloss: "to put",
    futureStem: "pondr",
    forms: {
      presente: ["pongo", "pones", "pone", "ponemos", "ponéis", "ponen"],
      preterito: ["puse", "pusiste", "puso", "pusimos", "pusisteis", "pusieron"],
    },
  },
  {
    infinitive: "poder",
    gloss: "to be able",
    futureStem: "podr",
    forms: {
      presente: ["puedo", "puedes", "puede", "podemos", "podéis", "pueden"],
      preterito: ["pude", "pudiste", "pudo", "pudimos", "pudisteis", "pudieron"],
      subjPresente: ["pueda", "puedas", "pueda", "podamos", "podáis", "puedan"],
    },
  },
  {
    infinitive: "querer",
    gloss: "to want / love",
    futureStem: "querr",
    forms: {
      presente: ["quiero", "quieres", "quiere", "queremos", "queréis", "quieren"],
      preterito: ["quise", "quisiste", "quiso", "quisimos", "quisisteis", "quisieron"],
      subjPresente: ["quiera", "quieras", "quiera", "queramos", "queráis", "quieran"],
    },
  },
  {
    infinitive: "venir",
    gloss: "to come",
    futureStem: "vendr",
    forms: {
      presente: ["vengo", "vienes", "viene", "venimos", "venís", "vienen"],
      preterito: ["vine", "viniste", "vino", "vinimos", "vinisteis", "vinieron"],
    },
  },
  {
    infinitive: "salir",
    gloss: "to leave / go out",
    futureStem: "saldr",
    forms: {
      presente: ["salgo", "sales", "sale", "salimos", "salís", "salen"],
    },
  },
  {
    infinitive: "saber",
    gloss: "to know (facts)",
    futureStem: "sabr",
    forms: {
      presente: ["sé", "sabes", "sabe", "sabemos", "sabéis", "saben"],
      preterito: ["supe", "supiste", "supo", "supimos", "supisteis", "supieron"],
      subjPresente: ["sepa", "sepas", "sepa", "sepamos", "sepáis", "sepan"],
    },
  },
  {
    infinitive: "dar",
    gloss: "to give",
    forms: {
      presente: ["doy", "das", "da", "damos", "dais", "dan"],
      preterito: ["di", "diste", "dio", "dimos", "disteis", "dieron"],
      subjPresente: ["dé", "des", "dé", "demos", "deis", "den"],
    },
  },
  {
    infinitive: "ver",
    gloss: "to see",
    forms: {
      presente: ["veo", "ves", "ve", "vemos", "veis", "ven"],
      preterito: ["vi", "viste", "vio", "vimos", "visteis", "vieron"],
      imperfecto: ["veía", "veías", "veía", "veíamos", "veíais", "veían"],
      subjPresente: ["vea", "veas", "vea", "veamos", "veáis", "vean"],
    },
  },
  {
    infinitive: "conocer",
    gloss: "to know (people/places)",
    forms: {
      presente: ["conozco", "conoces", "conoce", "conocemos", "conocéis", "conocen"],
    },
  },
  {
    infinitive: "traer",
    gloss: "to bring",
    forms: {
      presente: ["traigo", "traes", "trae", "traemos", "traéis", "traen"],
      preterito: ["traje", "trajiste", "trajo", "trajimos", "trajisteis", "trajeron"],
    },
  },
  {
    infinitive: "oír",
    gloss: "to hear",
    forms: {
      presente: ["oigo", "oyes", "oye", "oímos", "oís", "oyen"],
      preterito: ["oí", "oíste", "oyó", "oímos", "oísteis", "oyeron"],
    },
  },
];

export const VERB_BY_INF = new Map(VERBS.map((v) => [v.infinitive, v]));
