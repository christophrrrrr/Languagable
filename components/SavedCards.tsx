"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { reviewSavedCard, deleteSavedCard } from "@/server/saved";
import type { DrillRating } from "@/lib/srs";

export interface SavedCardView {
  id: string;
  phrase: string;
  meaning: string;
  note: string | null;
  state: number;
}

const RATINGS: { key: DrillRating; label: string }[] = [
  { key: "again", label: "Otra vez" },
  { key: "hard", label: "Difícil" },
  { key: "good", label: "Bien" },
  { key: "easy", label: "Fácil" },
];

function stateLabel(state: number): string {
  if (state === 0) return "nueva";
  if (state === 2) return "dominada";
  return "aprendiendo";
}

export function SavedCards({
  cards,
  due,
}: {
  cards: SavedCardView[];
  due: SavedCardView[];
}) {
  const router = useRouter();
  const [mode, setMode] = useState<"list" | "practice">("list");
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  // Snapshot of the cards to review this session — fixed at "Practicar" time so
  // it never shifts as reviews reschedule cards underneath us.
  const [session, setSession] = useState<SavedCardView[]>([]);
  const [, start] = useTransition();

  // ---- practice mode ----
  if (mode === "practice") {
    if (idx >= session.length) {
      return (
        <div className="mt-12 text-center">
          <p className="text-lg">¡Repaso terminado! 🎉</p>
          <button
            onClick={() => {
              setMode("list");
              setIdx(0);
              setRevealed(false);
              router.refresh();
            }}
            className="mt-4 text-sm underline opacity-70"
          >
            Volver
          </button>
        </div>
      );
    }
    const card = session[idx];
    const rate = (rating: DrillRating) => {
      start(async () => {
        await reviewSavedCard(card.id, rating);
      });
      setRevealed(false);
      setIdx((i) => i + 1);
    };
    return (
      <div className="mt-8">
        <div className="text-xs opacity-50">
          {idx + 1} / {session.length}
        </div>
        <div className="mt-3 rounded-xl border border-black/10 p-6 dark:border-white/10">
          <p className="text-xl">{card.meaning}</p>
          {revealed && (
            <div className="mt-5 border-t border-black/10 pt-4 dark:border-white/10">
              <p className="text-xl text-green-700 dark:text-green-300">
                {card.phrase}
              </p>
              {card.note && (
                <p className="mt-2 text-sm opacity-70">{card.note}</p>
              )}
            </div>
          )}
        </div>
        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="mt-4 w-full rounded-md bg-ink py-2.5 text-sm font-medium text-paper dark:bg-paper dark:text-ink"
          >
            Mostrar respuesta
          </button>
        ) : (
          <div className="mt-4 grid grid-cols-4 gap-2">
            {RATINGS.map((r) => (
              <button
                key={r.key}
                onClick={() => rate(r.key)}
                className="rounded-md border border-black/15 py-2.5 text-sm hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
              >
                {r.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ---- list mode ----
  const del = (id: string) => {
    start(async () => {
      await deleteSavedCard(id);
      router.refresh();
    });
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <p className="text-sm opacity-70">
          {cards.length} tarjetas · {due.length} pendientes
        </p>
        {due.length > 0 && (
          <button
            onClick={() => {
              setSession(due); // snapshot the current due cards for this session
              setMode("practice");
              setIdx(0);
              setRevealed(false);
            }}
            className="rounded-md bg-ink px-4 py-1.5 text-sm font-medium text-paper dark:bg-paper dark:text-ink"
          >
            Practicar ({due.length})
          </button>
        )}
      </div>

      {cards.length === 0 ? (
        <p className="mt-8 text-sm opacity-70">
          Aún no has guardado nada. Usa «+ Guardar frase» en una conversación o
          «Guardar para practicar» en un informe.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {cards.map((c) => (
            <li
              key={c.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-black/10 px-4 py-3 dark:border-white/10"
            >
              <div className="min-w-0">
                <div className="text-sm font-medium">{c.phrase}</div>
                <div className="text-xs opacity-60">{c.meaning}</div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-xs opacity-45">{stateLabel(c.state)}</span>
                <button
                  onClick={() => del(c.id)}
                  className="text-xs opacity-40 hover:opacity-100"
                  title="Eliminar"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
