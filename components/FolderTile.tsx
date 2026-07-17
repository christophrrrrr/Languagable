"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { renameFolder, deleteFolder } from "@/server/folders";

export function FolderTile({
  id,
  name,
  total,
  due,
}: {
  id: string;
  name: string;
  total: number;
  due: number;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const [pending, start] = useTransition();

  const saveRename = () => {
    const trimmed = draft.trim();
    if (!trimmed || trimmed === name) {
      setEditing(false);
      setDraft(name);
      return;
    }
    start(async () => {
      await renameFolder(id, trimmed);
      setEditing(false);
      router.refresh();
    });
  };

  const remove = () => {
    if (!confirm(`¿Eliminar la carpeta «${name}»? Sus tarjetas no se borran.`))
      return;
    start(async () => {
      await deleteFolder(id);
      router.refresh();
    });
  };

  return (
    <div className="group relative rounded-xl border border-black/10 p-4 transition hover:border-black/30 dark:border-white/10 dark:hover:border-white/30">
      {editing ? (
        <div>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") saveRename();
              if (e.key === "Escape") {
                setEditing(false);
                setDraft(name);
              }
            }}
            autoFocus
            className="w-full rounded-md border border-black/15 bg-transparent px-2 py-1 text-sm outline-none focus:border-black/40 dark:border-white/20"
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={saveRename}
              disabled={pending}
              className="rounded-md bg-ink px-2.5 py-1 text-xs font-medium text-paper disabled:opacity-40 dark:bg-paper dark:text-ink"
            >
              Guardar
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setDraft(name);
              }}
              className="rounded-md px-2 py-1 text-xs opacity-70 hover:opacity-100"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <>
          <Link href={`/tarjetas/${id}`} className="block">
            <div className="text-base font-medium">{name}</div>
            <div className="mt-1 text-xs opacity-60">
              {total} tarjetas
              {due > 0 && (
                <span className="ml-2 rounded-full bg-ink px-2 py-0.5 text-[11px] font-medium text-paper dark:bg-paper dark:text-ink">
                  {due} pendientes
                </span>
              )}
            </div>
          </Link>
          <div className="absolute right-3 top-3 flex gap-2 opacity-0 transition group-hover:opacity-100">
            <button
              onClick={() => setEditing(true)}
              className="text-xs opacity-50 hover:opacity-100"
              title="Renombrar"
            >
              ✎
            </button>
            <button
              onClick={remove}
              disabled={pending}
              className="text-xs opacity-50 hover:opacity-100"
              title="Eliminar carpeta"
            >
              ✕
            </button>
          </div>
        </>
      )}
    </div>
  );
}
