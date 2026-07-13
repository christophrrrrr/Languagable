import { describe, it, expect } from "vitest";
import { runDetectors } from "./index";
import { latinoamericanismoDetector } from "./latinoamericanismo";
import { generoDetector } from "./genero";

describe("latinoamericanismo detector", () => {
  it("flags a Latin-American word as an upgrade to the Peninsular term", () => {
    const m = latinoamericanismoDetector.run("Necesito una computadora nueva.");
    expect(m).toHaveLength(1);
    expect(m[0]).toMatchObject({
      original: "computadora",
      correction: "ordenador",
      class: "upgrade",
      dimension: "vocab",
      conceptSlug: "latinoamericanismo_lexico",
    });
  });

  it("preserves capitalization in the correction", () => {
    const m = latinoamericanismoDetector.run("Computadora nueva.");
    expect(m[0]?.correction).toBe("Ordenador");
  });

  it("does NOT flag the correct Peninsular words", () => {
    const m = latinoamericanismoDetector.run(
      "Necesito un ordenador y un móvil.",
    );
    expect(m).toHaveLength(0);
  });

  it("does not match substrings inside other words", () => {
    // 'jugo' must not match inside 'conjugo' / 'juguete'
    const m = latinoamericanismoDetector.run("Yo conjugo verbos con el juguete.");
    expect(m).toHaveLength(0);
  });
});

describe("genero (gender agreement) detector", () => {
  it("flags a wrongly-feminized masculine noun", () => {
    const m = generoDetector.run("Tengo la problema de siempre.");
    expect(m).toHaveLength(1);
    expect(m[0]).toMatchObject({
      original: "la problema",
      correction: "el problema",
      class: "error",
      conceptSlug: "concordancia_genero",
    });
  });

  it("flags a wrongly-masculinized feminine noun", () => {
    const m = generoDetector.run("Me duele el mano.");
    expect(m[0]?.correction).toBe("la mano");
  });

  it("preserves article definiteness and casing", () => {
    expect(generoDetector.run("Una problema.")[0]?.correction).toBe(
      "Un problema",
    );
    expect(generoDetector.run("La problema.")[0]?.correction).toBe(
      "El problema",
    );
  });

  it("does NOT flag correct agreement", () => {
    expect(generoDetector.run("Tengo el problema.")).toHaveLength(0);
    expect(generoDetector.run("Me duele la mano.")).toHaveLength(0);
    expect(generoDetector.run("Vamos en el coche.")).toHaveLength(0);
  });

  it("does NOT flag the phonetic 'el agua' exception class", () => {
    // agua/área/hambre are intentionally excluded from the lexicon.
    expect(generoDetector.run("El agua está fría.")).toHaveLength(0);
    expect(generoDetector.run("Un área grande.")).toHaveLength(0);
  });

  it("handles accented nouns", () => {
    expect(generoDetector.run("la día")[0]?.correction).toBe("el día");
    expect(generoDetector.run("el día")).toHaveLength(0);
  });
});

describe("no false positives on valid Peninsular usage", () => {
  it("leaves a correct Peninsular sentence untouched", () => {
    // vosotros, leísmo de persona, 'coger', 'vale', 'coche' are all valid here.
    const sentence =
      "Vosotros habéis cogido el coche esta mañana, ¿vale? Le vi a Juan y hablamos un rato.";
    expect(runDetectors(sentence)).toHaveLength(0);
  });
});

describe("runDetectors aggregation", () => {
  it("returns matches from multiple detectors sorted by position", () => {
    const matches = runDetectors("El jugo y la problema del celular.");
    // jugo (upgrade), la problema (error), celular (upgrade)
    const concepts = matches.map((m) => m.conceptSlug);
    expect(concepts).toContain("latinoamericanismo_lexico");
    expect(concepts).toContain("concordancia_genero");
    expect(matches.length).toBeGreaterThanOrEqual(3);
    // sorted
    const starts = matches.map((m) => m.start);
    expect(starts).toEqual([...starts].sort((a, b) => a - b));
  });
});
