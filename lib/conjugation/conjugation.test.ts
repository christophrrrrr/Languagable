import { describe, it, expect } from "vitest";
import { conjugateAll } from "./engine";
import { VERB_BY_INF } from "./verbs";
import type { Tense } from "./types";

function forms(inf: string, tense: Tense): string[] {
  const spec = VERB_BY_INF.get(inf);
  if (!spec) throw new Error(`no verb ${inf}`);
  return conjugateAll(spec)[tense];
}

describe("regular verbs — full paradigms", () => {
  it("hablar (-ar)", () => {
    expect(forms("hablar", "presente")).toEqual(["hablo", "hablas", "habla", "hablamos", "habláis", "hablan"]);
    expect(forms("hablar", "preterito")).toEqual(["hablé", "hablaste", "habló", "hablamos", "hablasteis", "hablaron"]);
    expect(forms("hablar", "imperfecto")).toEqual(["hablaba", "hablabas", "hablaba", "hablábamos", "hablabais", "hablaban"]);
    expect(forms("hablar", "futuro")).toEqual(["hablaré", "hablarás", "hablará", "hablaremos", "hablaréis", "hablarán"]);
    expect(forms("hablar", "condicional")).toEqual(["hablaría", "hablarías", "hablaría", "hablaríamos", "hablaríais", "hablarían"]);
    expect(forms("hablar", "subjPresente")).toEqual(["hable", "hables", "hable", "hablemos", "habléis", "hablen"]);
    expect(forms("hablar", "subjImperfecto")).toEqual(["hablara", "hablaras", "hablara", "habláramos", "hablarais", "hablaran"]);
  });

  it("comer (-er)", () => {
    expect(forms("comer", "presente")).toEqual(["como", "comes", "come", "comemos", "coméis", "comen"]);
    expect(forms("comer", "preterito")).toEqual(["comí", "comiste", "comió", "comimos", "comisteis", "comieron"]);
    expect(forms("comer", "imperfecto")).toEqual(["comía", "comías", "comía", "comíamos", "comíais", "comían"]);
    expect(forms("comer", "subjPresente")).toEqual(["coma", "comas", "coma", "comamos", "comáis", "coman"]);
    expect(forms("comer", "subjImperfecto")).toEqual(["comiera", "comieras", "comiera", "comiéramos", "comierais", "comieran"]);
  });

  it("vivir (-ir)", () => {
    expect(forms("vivir", "presente")).toEqual(["vivo", "vives", "vive", "vivimos", "vivís", "viven"]);
    expect(forms("vivir", "preterito")).toEqual(["viví", "viviste", "vivió", "vivimos", "vivisteis", "vivieron"]);
    expect(forms("vivir", "futuro")).toEqual(["viviré", "vivirás", "vivirá", "viviremos", "viviréis", "vivirán"]);
  });
});

describe("irregular verbs", () => {
  it("ser", () => {
    expect(forms("ser", "presente")).toEqual(["soy", "eres", "es", "somos", "sois", "son"]);
    expect(forms("ser", "preterito")).toEqual(["fui", "fuiste", "fue", "fuimos", "fuisteis", "fueron"]);
    expect(forms("ser", "imperfecto")).toEqual(["era", "eras", "era", "éramos", "erais", "eran"]);
    expect(forms("ser", "subjPresente")).toEqual(["sea", "seas", "sea", "seamos", "seáis", "sean"]);
    expect(forms("ser", "subjImperfecto")).toEqual(["fuera", "fueras", "fuera", "fuéramos", "fuerais", "fueran"]);
  });

  it("ir", () => {
    expect(forms("ir", "presente")).toEqual(["voy", "vas", "va", "vamos", "vais", "van"]);
    expect(forms("ir", "imperfecto")).toEqual(["iba", "ibas", "iba", "íbamos", "ibais", "iban"]);
    expect(forms("ir", "subjPresente")).toEqual(["vaya", "vayas", "vaya", "vayamos", "vayáis", "vayan"]);
    expect(forms("ir", "subjImperfecto")).toEqual(["fuera", "fueras", "fuera", "fuéramos", "fuerais", "fueran"]);
  });

  it("tener — derived subjunctive + irregular future", () => {
    expect(forms("tener", "presente")).toEqual(["tengo", "tienes", "tiene", "tenemos", "tenéis", "tienen"]);
    expect(forms("tener", "preterito")).toEqual(["tuve", "tuviste", "tuvo", "tuvimos", "tuvisteis", "tuvieron"]);
    expect(forms("tener", "futuro")).toEqual(["tendré", "tendrás", "tendrá", "tendremos", "tendréis", "tendrán"]);
    expect(forms("tener", "subjPresente")).toEqual(["tenga", "tengas", "tenga", "tengamos", "tengáis", "tengan"]);
    expect(forms("tener", "subjImperfecto")).toEqual(["tuviera", "tuvieras", "tuviera", "tuviéramos", "tuvierais", "tuvieran"]);
  });

  it("hacer / decir — strong preterite + irregular future", () => {
    expect(forms("hacer", "preterito")).toEqual(["hice", "hiciste", "hizo", "hicimos", "hicisteis", "hicieron"]);
    expect(forms("hacer", "futuro")).toEqual(["haré", "harás", "hará", "haremos", "haréis", "harán"]);
    expect(forms("hacer", "subjPresente")).toEqual(["haga", "hagas", "haga", "hagamos", "hagáis", "hagan"]);
    expect(forms("decir", "preterito")).toEqual(["dije", "dijiste", "dijo", "dijimos", "dijisteis", "dijeron"]);
    expect(forms("decir", "subjImperfecto")).toEqual(["dijera", "dijeras", "dijera", "dijéramos", "dijerais", "dijeran"]);
  });

  it("dar / ver", () => {
    expect(forms("dar", "presente")).toEqual(["doy", "das", "da", "damos", "dais", "dan"]);
    expect(forms("dar", "preterito")).toEqual(["di", "diste", "dio", "dimos", "disteis", "dieron"]);
    expect(forms("dar", "subjPresente")).toEqual(["dé", "des", "dé", "demos", "deis", "den"]);
    expect(forms("ver", "imperfecto")).toEqual(["veía", "veías", "veía", "veíamos", "veíais", "veían"]);
    expect(forms("ver", "preterito")).toEqual(["vi", "viste", "vio", "vimos", "visteis", "vieron"]);
  });
});

describe("stem changers & orthographic", () => {
  it("pensar (e→ie) keeps nosotros/vosotros unchanged in subjunctive", () => {
    expect(forms("pensar", "presente")).toEqual(["pienso", "piensas", "piensa", "pensamos", "pensáis", "piensan"]);
    expect(forms("pensar", "subjPresente")).toEqual(["piense", "pienses", "piense", "pensemos", "penséis", "piensen"]);
    expect(forms("pensar", "preterito")).toEqual(["pensé", "pensaste", "pensó", "pensamos", "pensasteis", "pensaron"]);
  });

  it("poder (o→ue) with strong preterite", () => {
    expect(forms("poder", "presente")).toEqual(["puedo", "puedes", "puede", "podemos", "podéis", "pueden"]);
    expect(forms("poder", "preterito")).toEqual(["pude", "pudiste", "pudo", "pudimos", "pudisteis", "pudieron"]);
    expect(forms("poder", "futuro")).toEqual(["podré", "podrás", "podrá", "podremos", "podréis", "podrán"]);
  });

  it("pedir (e→i) — 3rd-person preterite + derived subjunctive", () => {
    expect(forms("pedir", "preterito")).toEqual(["pedí", "pediste", "pidió", "pedimos", "pedisteis", "pidieron"]);
    expect(forms("pedir", "subjPresente")).toEqual(["pida", "pidas", "pida", "pidamos", "pidáis", "pidan"]);
    expect(forms("pedir", "subjImperfecto")).toEqual(["pidiera", "pidieras", "pidiera", "pidiéramos", "pidierais", "pidieran"]);
  });

  it("dormir (o→ue / u) subjunctive nosotros = durmamos", () => {
    expect(forms("dormir", "subjPresente")).toEqual(["duerma", "duermas", "duerma", "durmamos", "durmáis", "duerman"]);
    expect(forms("dormir", "preterito")).toEqual(["dormí", "dormiste", "durmió", "dormimos", "dormisteis", "durmieron"]);
  });

  it("buscar (-car) and llegar (-gar) preterite/subjunctive spelling", () => {
    expect(forms("buscar", "preterito")[0]).toBe("busqué");
    expect(forms("buscar", "subjPresente")).toEqual(["busque", "busques", "busque", "busquemos", "busquéis", "busquen"]);
    expect(forms("llegar", "preterito")[0]).toBe("llegué");
    expect(forms("llegar", "subjPresente")[0]).toBe("llegue");
  });

  it("leer (i→y) preterite", () => {
    expect(forms("leer", "preterito")).toEqual(["leí", "leíste", "leyó", "leímos", "leísteis", "leyeron"]);
    expect(forms("leer", "subjImperfecto")[0]).toBe("leyera");
  });
});
