import { notFound } from "next/navigation";
import { Chat } from "@/components/Chat";
import { getConversation, getMessages } from "@/lib/db/queries";
import { getTopic } from "@/content/topics";
import { isPracticeTense, tenseLabel } from "@/lib/tense";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;

  const convo = await getConversation(conversationId);
  if (!convo) notFound();

  const rows = await getMessages(conversationId);
  const topic = convo.topicSlug ? getTopic(convo.topicSlug) : undefined;
  const label =
    convo.focusTense && isPracticeTense(convo.focusTense)
      ? `Práctica: ${tenseLabel(convo.focusTense)}`
      : (topic?.label ?? null);

  const initialMessages = rows
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

  return (
    <Chat
      conversationId={conversationId}
      topicLabel={label}
      initialMessages={initialMessages}
    />
  );
}
