"use client";

import { useEffect, useRef, useState } from "react";
import { finishAndAnalyze } from "@/server/conversations";
import { AddCardButton } from "@/components/AddCardButton";
import { FinishButton } from "@/components/FinishButton";
import type { Language } from "@/lib/lang";
import { ui } from "@/lib/i18n";

type ChatMessage = { role: "user" | "assistant"; content: string };

export function Chat({
  lang,
  conversationId,
  topicLabel,
  initialMessages,
}: {
  lang: Language;
  conversationId: string;
  topicLabel: string | null;
  initialMessages: ChatMessage[];
}) {
  const t = ui(lang);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    if (streaming) return;
    const userText = text.trim();
    const opening = userText === "" && messagesRef.current.length === 0;
    if (!opening && userText === "") return;

    setError(null);
    setInput("");
    setMessages((prev) => {
      const base = opening ? prev : [...prev, { role: "user" as const, content: userText }];
      return [...base, { role: "assistant" as const, content: "" }];
    });
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, content: opening ? "" : userText }),
      });
      if (!res.ok || !res.body) {
        throw new Error((await res.text().catch(() => "")) || t.connectionError);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = prev.slice();
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : t.connectionError);
      setMessages((prev) => {
        const copy = prev.slice();
        copy[copy.length - 1] = {
          role: "assistant",
          content: t.noAnswer,
        };
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  }

  const openedRef = useRef(false);
  useEffect(() => {
    if (openedRef.current) return;
    openedRef.current = true;
    if (initialMessages.length === 0) void send("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userTurns = messages.filter((m) => m.role === "user").length;
  const lastAssistant =
    [...messages].reverse().find((m) => m.role === "assistant")?.content ?? "";

  return (
    <div className="mx-auto flex h-dvh max-w-2xl flex-col px-4">
      <header className="flex items-center justify-between border-b border-black/10 py-3 dark:border-white/10">
        <div>
          <div className="text-sm font-medium">{t.conversationTitle}</div>
          <div className="text-xs opacity-60">{topicLabel ?? t.freeChat}</div>
        </div>
        <div className="flex items-center gap-2">
          <AddCardButton
            lang={lang}
            defaultPhrase={lastAssistant}
            conversationId={conversationId}
          />
          <form action={finishAndAnalyze}>
            <input type="hidden" name="conversationId" value={conversationId} />
            <FinishButton
              disabled={streaming || userTurns === 0}
              label={t.finishAnalyze}
              pendingLabel={t.analyzing}
            />
          </form>
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto py-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
          >
            <div
              className={
                "max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2 text-[15px] " +
                (m.role === "user"
                  ? "bg-ink text-paper dark:bg-paper dark:text-ink"
                  : "bg-black/5 dark:bg-white/10")
              }
            >
              {m.content || (streaming ? "…" : "")}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {error && (
        <div className="pb-1 text-xs text-red-600 dark:text-red-400">{error}</div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
        className="flex gap-2 border-t border-black/10 py-3 dark:border-white/10"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.inputPlaceholder}
          className="flex-1 rounded-md border border-black/15 bg-transparent px-3 py-2 outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50"
        />
        <button
          type="submit"
          disabled={streaming || input.trim() === ""}
          className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium disabled:opacity-40 dark:border-white/20"
        >
          {t.send}
        </button>
      </form>
    </div>
  );
}
