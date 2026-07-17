"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  reviewSavedCard,
  deleteSavedCard,
  moveSavedCard,
} from "@/server/saved";
import type { DrillRating } from "@/lib/srs";
import type { Language } from "@/lib/lang";
import { ui } from "@/lib/i18n";

export interface SavedCardView {
  id: string;
  phrase: string;
  meaning: string;
  note: string | null;
  state: number;
  folderId: string | null;
}

export interface FolderOption {
  id: string;
  name: string;
}

const RATING_KEYS: DrillRating[] = ["again", "hard", "good", "easy"];

export function FolderCards({
  lang,
  cards,
  due,
  folders,
  autoStart = false,
}: {
  lang: Language;
  cards: SavedCardView[];
  due: SavedCardView[];
  folders: FolderOption[];
  autoStart?: boolean;
}) {
  const t = ui(lang);
  const router = useRouter();
  const startPractice = autoStart && due.length > 0;
  const [mode, setMode] = useState<"list" | "practice">(
    startPractice ? "practice" : "list",
  );
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  // Snapshot of the cards to review this session — fixed at practice-start so
  // it never shifts as reviews reschedule cards underneath us.
  const [session, setSession] = useState<SavedCardView[]>(
    startPractice ? due : [],
  );
  const [, start] = useTransition();

  const stateLabel = (state: number): string => {
    if (state === 0) return t.stateNew;
    if (state === 2) return t.stateMastered;
    return t.stateLearning;
  };

  const beginSession = (deck: SavedCardView[]) => {
    setSession(deck);
    setMode("practice");
    setIdx(0);
    setRevealed(false);
  };

  // ---- practice mode ----
  if (mode === "practice") {
    if (idx >= session.length) {
      return (
        <div className="mt-12 text-center">
          <p className="text-lg">{t.sessionDone}</p>
          <button
            onClick={() => {
              setMode("list");
              setIdx(0);
              setRevealed(false);
              router.refresh();
            }}
            className="mt-4 text-sm underline opacity-70"
          >
            {t.back}
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
            {t.showAnswer}
          </button>
        ) : (
          <div className="mt-4 grid grid-cols-4 gap-2">
            {RATING_KEYS.map((key) => (
              <button
                key={key}
                onClick={() => rate(key)}
                className="rounded-md border border-black/15 py-2.5 text-sm hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
              >
                {t.ratings[key]}
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

  const move = (id: string, folderId: string | null) => {
    start(async () => {
      await moveSavedCard(id, folderId);
      router.refresh();
    });
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm opacity-70">
          {t.cardsDueLine(cards.length, due.length)}
        </p>
        <div className="flex items-center gap-3">
          {cards.length > 0 && (
            <button
              onClick={() => beginSession(cards)}
              className="text-sm underline opacity-70 hover:opacity-100"
            >
              {t.reviewAll}
            </button>
          )}
          {due.length > 0 && (
            <button
              onClick={() => beginSession(due)}
              className="rounded-md bg-ink px-4 py-1.5 text-sm font-medium text-paper dark:bg-paper dark:text-ink"
            >
              {t.practiceN(due.length)}
            </button>
          )}
        </div>
      </div>

      {cards.length === 0 ? (
        <p className="mt-8 text-sm opacity-70">{t.emptyFolder}</p>
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
                <select
                  value={c.folderId ?? ""}
                  onChange={(e) => move(c.id, e.target.value || null)}
                  className="max-w-32 rounded-md border border-black/15 bg-transparent px-1.5 py-1 text-xs opacity-70 hover:opacity-100 dark:border-white/20 dark:bg-ink"
                  title={t.moveToFolder}
                >
                  <option value="">{t.noFolder}</option>
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => del(c.id)}
                  className="text-xs opacity-40 hover:opacity-100"
                  title={t.delete}
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
