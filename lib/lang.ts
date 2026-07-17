// The languages Languagable teaches. Each targets ONE specific variety —
// the whole product is built around variety-faithful correction.
export const LANGUAGES = ["es", "fr", "pt"] as const;
export type Language = (typeof LANGUAGES)[number];

export function isLanguage(x: string): x is Language {
  return (LANGUAGES as readonly string[]).includes(x);
}

export interface LanguageMeta {
  /** Native-language name shown on the selector. */
  name: string;
  /** The variety we correct toward, in that language. */
  variety: string;
  flag: string;
}

export const LANGUAGE_META: Record<Language, LanguageMeta> = {
  es: { name: "Español", variety: "de España", flag: "🇪🇸" },
  fr: { name: "Français", variety: "de France", flag: "🇫🇷" },
  pt: { name: "Português", variety: "de Portugal", flag: "🇵🇹" },
};
