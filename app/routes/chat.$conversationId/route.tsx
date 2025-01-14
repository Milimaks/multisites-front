import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getConversation, sendMessage } from "~/server/chat.server";
import { requireAuthCookie } from "~/auth.server";
import ChatInterface from "~/features/chat/ChatInterface";
import { ActionFeedback } from "~/components/FeedbackComponent";
import { logout } from "~/session.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const user = await requireAuthCookie(request);
  const { conversationId } = params;

  if (!conversationId) {
    throw new Error("Conversation ID is required");
  }

  const conversation = await getConversation({
    request,
    conversationId,
  });

  return json({
    id: user.id,
    conversation,
  });
}

export default function ChatConversationRoute() {
  const { id: userId, conversation } = useLoaderData<typeof loader>();

  return (
    <ChatInterface
      key={conversation.id}
      conversation={conversation}
      userId={userId}
    />
  );
}

export const action = async ({ request, params }: LoaderFunctionArgs) => {
  console.log("action");
  await requireAuthCookie(request);

  const conversationId = params.conversationId;

  if (!conversationId) {
    throw await logout({
      request,
    });
  }
  const formData = await request.formData();
  const content = formData.get("content") ?? null;
  if (!content) {
    return json<ActionFeedback>({
      error: true,
      message: "Votre message ne doit pas être vide.",
    });
  }

  const apiFeedback = await sendMessage({
    request,
    conversationId,
    content: content as string,
  });
  return json<ActionFeedback>(apiFeedback);
};
