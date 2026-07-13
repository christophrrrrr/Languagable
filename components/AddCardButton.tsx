"use client";

import { useState, useTransition } from "react";
import { addSavedCard } from "@/server/saved";

export function AddCardButton({
  defaultPhrase,
  conversationId,
}: {
  defaultPhrase: string;
  conversationId: string;
}) {
  const [open, setOpen] = useState(false);
  const [phrase, setPhrase] = useState("");
  const [meaning, setMeaning] = useState("");
  const [note, setNote] = useState("");
  const [pending, start] = useTransition();
  const [savedFlash, setSavedFlash] = useState(false);

  const openPanel = () => {
    setPhrase(defaultPhrase);
    setMeaning("");
    setNote("");
    setOpen(true);
  };

  const save = () => {
    if (!phrase.trim() || !meaning.trim()) return;
    start(async () => {
      await addSavedCard({
        phrase,
        meaning,
        note,
        sourceConversationId: conversationId,
      });
      setOpen(false);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1500);
    });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : openPanel())}
        className="rounded-md border border-black/15 px-3 py-1.5 text-sm hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
      >
        {savedFlash ? "Guardada ✓" : "+ Guardar frase"}
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-80 rounded-lg border border-black/15 bg-paper p-3 shadow-lg dark:border-white/20 dark:bg-ink">
          <label className="block text-xs opacity-60">Frase o expresión</label>
          <textarea
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-md border border-black/15 bg-transparent px-2 py-1.5 text-sm outline-none focus:border-black/40 dark:border-white/20"
            placeholder="ir viento en popa"
          />
          <label className="mt-2 block text-xs opacity-60">
            Significado / pista
          </label>
          <input
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            className="mt-1 w-full rounded-md border border-black/15 bg-transparent px-2 py-1.5 text-sm outline-none focus:border-black/40 dark:border-white/20"
            placeholder="ir muy bien, sobre ruedas"
          />
          <label className="mt-2 block text-xs opacity-60">Nota (opcional)</label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-1 w-full rounded-md border border-black/15 bg-transparent px-2 py-1.5 text-sm outline-none focus:border-black/40 dark:border-white/20"
            placeholder=""
          />
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md px-2.5 py-1 text-xs opacity-70 hover:opacity-100"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={save}
              disabled={pending || !phrase.trim() || !meaning.trim()}
              className="rounded-md bg-ink px-2.5 py-1 text-xs font-medium text-paper disabled:opacity-40 dark:bg-paper dark:text-ink"
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
