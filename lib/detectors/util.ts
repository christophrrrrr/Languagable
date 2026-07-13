export function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Accent-aware whole-word matcher. JS `\b` treats accented letters as word
 * boundaries (\w is ASCII-only), which breaks on Spanish. We instead assert
 * that the match is not flanked by Unicode letters/numbers.
 */
export function wholeWordRegex(word: string, flags = "giu"): RegExp {
  return new RegExp(
    `(?<![\\p{L}\\p{N}])(${escapeRegex(word)})(?![\\p{L}\\p{N}])`,
    flags,
  );
}

/** Reproduce the capitalization pattern of `sample` onto `target`. */
export function matchCase(sample: string, target: string): string {
  const hasLetters = sample.toLowerCase() !== sample.toUpperCase();
  if (hasLetters && sample === sample.toUpperCase()) {
    return target.toUpperCase();
  }
  const first = sample.charAt(0);
  if (first && first === first.toUpperCase() && first !== first.toLowerCase()) {
    return target.charAt(0).toUpperCase() + target.slice(1);
  }
  return target;
}
