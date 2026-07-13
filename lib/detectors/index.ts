import type { Detector, DetectorMatch } from "./types";
import { latinoamericanismoDetector } from "./latinoamericanismo";
import { generoDetector } from "./genero";

export type { Detector, DetectorMatch } from "./types";

export const detectors: Detector[] = [
  latinoamericanismoDetector,
  generoDetector,
];

/** Run every detector over `text`, returning matches sorted by position. */
export function runDetectors(text: string): DetectorMatch[] {
  return detectors
    .flatMap((d) => d.run(text))
    .sort((a, b) => a.start - b.start);
}
