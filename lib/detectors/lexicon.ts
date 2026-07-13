// Deliberately conservative lexicons. The whole point of the detector layer is
// HIGH precision: only clearly-unambiguous entries belong here. Anything fuzzy
// (context-dependent false friends, ambiguous words like "carro"/"plata") is
// left to the LLM analysis pass, which labels its output with confidence.

export interface LatinoEntry {
  peninsular: string;
  confidence?: number;
}

// Latin-American words with a clear, low-ambiguity Peninsular equivalent.
export const latinoamericanismos: Record<string, LatinoEntry> = {
  computadora: { peninsular: "ordenador", confidence: 0.9 },
  computador: { peninsular: "ordenador", confidence: 0.9 },
  celular: { peninsular: "móvil", confidence: 0.9 },
  jugo: { peninsular: "zumo", confidence: 0.75 },
  boleto: { peninsular: "billete", confidence: 0.85 },
  frijoles: { peninsular: "judías", confidence: 0.85 },
  frijol: { peninsular: "judía", confidence: 0.85 },
  elevador: { peninsular: "ascensor", confidence: 0.9 },
  refrigerador: { peninsular: "nevera", confidence: 0.85 },
  heladera: { peninsular: "nevera", confidence: 0.85 },
  plomero: { peninsular: "fontanero", confidence: 0.85 },
  durazno: { peninsular: "melocotón", confidence: 0.85 },
  frutilla: { peninsular: "fresa", confidence: 0.85 },
  palta: { peninsular: "aguacate", confidence: 0.85 },
  arveja: { peninsular: "guisante", confidence: 0.85 },
  chévere: { peninsular: "guay", confidence: 0.8 },
  chevere: { peninsular: "guay", confidence: 0.8 },
};

// Common singular nouns learners frequently mis-gender.
// IMPORTANT: excludes feminine nouns that take the singular article "el" for
// phonetic reasons (el agua, el área, el hambre, el aula, el arma) — including
// them would produce false positives on perfectly correct usage.
export const misgenderedNouns: Record<string, "m" | "f"> = {
  // masculine (often wrongly feminized)
  problema: "m",
  tema: "m",
  sistema: "m",
  idioma: "m",
  clima: "m",
  programa: "m",
  mapa: "m",
  día: "m",
  planeta: "m",
  poema: "m",
  dilema: "m",
  sofá: "m",
  garaje: "m",
  coche: "m",
  viaje: "m",
  paisaje: "m",
  mensaje: "m",
  lenguaje: "m",
  // feminine (often wrongly masculinized)
  mano: "f",
  foto: "f",
  moto: "f",
  imagen: "f",
  señal: "f",
  clase: "f",
  calle: "f",
  nariz: "f",
  piel: "f",
  leche: "f",
  gente: "f",
  sal: "f",
  miel: "f",
  costumbre: "f",
  cumbre: "f",
};
