import { notFound } from "next/navigation";
import { Chat } from "@/components/Chat";
import { getConversation, getMessages } from "@/lib/db/queries";
import { getTopic } from "@/content/topics";
import { isPracticeTense, tenseLabel } from "@/lib/tense";
import { isLanguage, type Language } from "@/lib/lang";
import { ui } from "@/lib/i18n";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;

  const convo = await getConversation(conversationId);
  if (!convo) notFound();

  const lang: Language = isLanguage(convo.language) ? convo.language : "es";
  const t = ui(lang);

  const rows = await getMessages(conversationId);
  const topic = convo.topicSlug ? getTopic(lang, convo.topicSlug) : undefined;
  const label =
    convo.focusTense && isPracticeTense(lang, convo.focusTense)
      ? `${t.practicePrefix}${tenseLabel(lang, convo.focusTense)}`
      : (topic?.label ?? null);

  const initialMessages = rows
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

  return (
    <Chat
      lang={lang}
      conversationId={conversationId}
      topicLabel={label}
      initialMessages={initialMessages}
    />
  );
}
