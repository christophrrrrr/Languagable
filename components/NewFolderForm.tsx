"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createFolder } from "@/server/folders";
import type { Language } from "@/lib/lang";
import { ui } from "@/lib/i18n";

export function NewFolderForm({ lang }: { lang: Language }) {
  const t = ui(lang);
  const router = useRouter();
  const [name, setName] = useState("");
  const [pending, start] = useTransition();

  const create = () => {
    if (!name.trim()) return;
    start(async () => {
      await createFolder(lang, name);
      setName("");
      router.refresh();
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        create();
      }}
      className="mt-6 flex gap-2"
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t.newFolderPlaceholder}
        className="flex-1 rounded-md border border-black/15 bg-transparent px-3 py-1.5 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50"
      />
      <button
        type="submit"
        disabled={pending || !name.trim()}
        className="rounded-md border border-black/15 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-white/20"
      >
        {t.createFolder}
      </button>
    </form>
  );
}
