"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createFolder } from "@/server/folders";

export function NewFolderForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [pending, start] = useTransition();

  const create = () => {
    if (!name.trim()) return;
    start(async () => {
      await createFolder(name);
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
        placeholder="Nueva carpeta (p. ej. Dichos)"
        className="flex-1 rounded-md border border-black/15 bg-transparent px-3 py-1.5 text-sm outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50"
      />
      <button
        type="submit"
        disabled={pending || !name.trim()}
        className="rounded-md border border-black/15 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-white/20"
      >
        Crear carpeta
      </button>
    </form>
  );
}
