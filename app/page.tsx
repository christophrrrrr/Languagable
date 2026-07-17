import Link from "next/link";
import { LANGUAGES, LANGUAGE_META } from "@/lib/lang";

// Entry screen: pick the language for this session. Everything past this
// point — UI, tutor, cards, folders — lives in that language.
export default function LanguagePickerPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center px-6 py-16">
      <h1 className="text-center text-4xl font-semibold tracking-tight">
        Languagable
      </h1>
      <p className="mt-3 text-center text-sm opacity-60">
        ¿Qué practicamos hoy? · On pratique quoi aujourd&apos;hui ? · O que
        praticamos hoje?
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {LANGUAGES.map((lang) => {
          const meta = LANGUAGE_META[lang];
          return (
            <Link
              key={lang}
              href={`/${lang}`}
              className="group rounded-2xl border border-black/10 p-6 text-center transition hover:border-black/40 hover:shadow-md dark:border-white/10 dark:hover:border-white/40"
            >
              <div className="text-5xl">{meta.flag}</div>
              <div className="mt-4 text-xl font-medium">{meta.name}</div>
              <div className="mt-1 text-sm opacity-60">{meta.variety}</div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
