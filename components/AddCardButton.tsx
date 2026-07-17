"use client";

import { useState, useTransition } from "react";
import { addSavedCard } from "@/server/saved";
import { listFolders, createFolder } from "@/server/folders";
import type { Language } from "@/lib/lang";
import { ui } from "@/lib/i18n";

const NEW_FOLDER = "__new__";

export function AddCardButton({
  lang,
  defaultPhrase,
  conversationId,
}: {
  lang: Language;
  defaultPhrase: string;
  conversationId: string;
}) {
  const t = ui(lang);
  const [open, setOpen] = useState(false);
  const [phrase, setPhrase] = useState("");
  const [meaning, setMeaning] = useState("");
  const [note, setNote] = useState("");
  const [folders, setFolders] = useState<{ id: string; name: string }[]>([]);
  const [folderId, setFolderId] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [pending, start] = useTransition();
  const [savedFlash, setSavedFlash] = useState(false);

  const openPanel = () => {
    setPhrase(defaultPhrase);
    setMeaning("");
    setNote("");
    setNewFolderName("");
    setOpen(true);
    void listFolders(lang)
      .then((rows) => setFolders(rows.map((f) => ({ id: f.id, name: f.name }))))
      .catch(() => setFolders([]));
  };

  const save = () => {
    if (!phrase.trim() || !meaning.trim()) return;
    start(async () => {
      let targetFolderId: string | null = folderId || null;
      if (folderId === NEW_FOLDER) {
        const created = newFolderName.trim()
          ? await createFolder(lang, newFolderName)
          : null;
        targetFolderId = created?.id ?? null;
      }
      await addSavedCard({
        phrase,
        meaning,
        note,
        folderId: targetFolderId,
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
        {savedFlash ? t.savedFlash : t.savePhrase}
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-80 rounded-lg border border-black/15 bg-paper p-3 shadow-lg dark:border-white/20 dark:bg-ink">
          <label className="block text-xs opacity-60">{t.phraseLabel}</label>
          <textarea
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-md border border-black/15 bg-transparent px-2 py-1.5 text-sm outline-none focus:border-black/40 dark:border-white/20"
            placeholder={t.phrasePlaceholder}
          />
          <label className="mt-2 block text-xs opacity-60">
            {t.meaningLabel}
          </label>
          <input
            value={meaning}
            onChange={(e) => setMeaning(e.target.value)}
            className="mt-1 w-full rounded-md border border-black/15 bg-transparent px-2 py-1.5 text-sm outline-none focus:border-black/40 dark:border-white/20"
            placeholder={t.meaningPlaceholder}
          />
          <label className="mt-2 block text-xs opacity-60">{t.folderLabel}</label>
          <select
            value={folderId}
            onChange={(e) => setFolderId(e.target.value)}
            className="mt-1 w-full rounded-md border border-black/15 bg-transparent px-2 py-1.5 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:bg-ink"
          >
            <option value="">{t.noFolder}</option>
            {folders.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
            <option value={NEW_FOLDER}>{t.newFolderOption}</option>
          </select>
          {folderId === NEW_FOLDER && (
            <input
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              autoFocus
              className="mt-1.5 w-full rounded-md border border-black/15 bg-transparent px-2 py-1.5 text-sm outline-none focus:border-black/40 dark:border-white/20"
              placeholder={t.folderNamePlaceholder}
            />
          )}
          <label className="mt-2 block text-xs opacity-60">{t.noteLabel}</label>
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
              {t.cancel}
            </button>
            <button
              type="button"
              onClick={save}
              disabled={pending || !phrase.trim() || !meaning.trim()}
              className="rounded-md bg-ink px-2.5 py-1 text-xs font-medium text-paper disabled:opacity-40 dark:bg-paper dark:text-ink"
            >
              {t.save}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
