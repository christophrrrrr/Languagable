"use client";

import { useState, useTransition } from "react";
import { saveIssueAsCard } from "@/server/saved";

export function SaveIssueButton({
  issueId,
  label,
  savedLabel,
}: {
  issueId: string;
  label: string;
  savedLabel: string;
}) {
  const [pending, start] = useTransition();
  const [saved, setSaved] = useState(false);

  if (saved) {
    return <span className="text-xs opacity-60">{savedLabel}</span>;
  }

  return (
    <button
      disabled={pending}
      onClick={() =>
        start(async () => {
          await saveIssueAsCard(issueId);
          setSaved(true);
        })
      }
      className="rounded-md border border-black/15 px-2.5 py-1 text-xs disabled:opacity-40 dark:border-white/20"
    >
      {label}
    </button>
  );
}
