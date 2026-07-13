"use client";

import { useFormStatus } from "react-dom";

export function FinishButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="rounded-md bg-ink px-3 py-1.5 text-sm font-medium text-paper disabled:opacity-40 dark:bg-paper dark:text-ink"
    >
      {pending ? "Analizando…" : "Terminar y analizar"}
    </button>
  );
}
