import type { ModelMessage } from "ai";
import { streamText } from "ai";
import { conversationModel } from "@/lib/ai/provider";
import { conversationSystemPrompt, OPENING_PROMPT } from "@/lib/ai/prompts";
import { getDb } from "@/lib/db/client";
import { messages as messagesTable } from "@/lib/db/schema";
import { getConversation, getMessages } from "@/lib/db/queries";
import { getTopic } from "@/content/topics";
import { isPracticeTense, tenseLabel } from "@/lib/tense";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: Request) {
  const { conversationId, content } = (await req.json()) as {
    conversationId?: string;
    content?: string;
  };

  if (!conversationId) {
    return new Response("Missing conversationId", { status: 400 });
  }

  const convo = await getConversation(conversationId);
  if (!convo) return new Response("Conversation not found", { status: 404 });

  const topic = convo.topicSlug ? getTopic(convo.topicSlug) : undefined;
  const focusTenseLabel =
    convo.focusTense && isPracticeTense(convo.focusTense)
      ? tenseLabel(convo.focusTense)
      : null;
  const system = conversationSystemPrompt({
    topicSeed: topic?.seed ?? null,
    focusTenseLabel,
  });

  const history = await getMessages(conversationId);
  const trimmed = (content ?? "").trim();
  const isOpening = trimmed === "" && history.length === 0;

  if (!isOpening && trimmed === "") {
    return new Response("Empty message", { status: 400 });
  }

  // Build the model message history (narrowed to user/assistant).
  const modelMessages: ModelMessage[] = [];
  for (const m of history) {
    if (m.role === "user") modelMessages.push({ role: "user", content: m.content });
    else if (m.role === "assistant")
      modelMessages.push({ role: "assistant", content: m.content });
  }

  const db = getDb();
  let nextIndex = history.length;

  if (!isOpening) {
    await db.insert(messagesTable).values({
      conversationId,
      role: "user",
      content: trimmed,
      index: nextIndex,
    });
    modelMessages.push({ role: "user", content: trimmed });
    nextIndex += 1;
  }

  const assistantIndex = nextIndex;

  const result = streamText({
    model: conversationModel(),
    system,
    ...(isOpening
      ? { prompt: OPENING_PROMPT }
      : { messages: modelMessages }),
    onError: (err) => {
      console.error("[chat] streamText error:", err);
    },
    onFinish: async (event) => {
      try {
        await db.insert(messagesTable).values({
          conversationId,
          role: "assistant",
          content: event.text,
          index: assistantIndex,
        });
      } catch (err) {
        console.error("[chat] failed to persist assistant message:", err);
      }
    },
  });

  return result.toTextStreamResponse();
}
