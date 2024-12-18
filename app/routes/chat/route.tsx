import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { getFriends } from "~/api/friends.api";
import { requireAuthCookie } from "~/auth.server";
import { createConversation, getConversation } from "~/server/chat.server";
import { Method } from "~/services/friendService";

interface ModalData {
  userId: string;
  firstName: string;
  actionType: Method;
}

interface Friend {
  id: string;
  name: string;
}

export type MessagesType = Awaited<
  ReturnType<typeof getConversation>
>["messages"];

export async function loader({ request }: LoaderFunctionArgs) {
  let user = await requireAuthCookie(request);
  const friends = await getFriends(request);

  // Vérifier si nous sommes déjà sur une route de conversation
  const url = new URL(request.url);
  if (!url.pathname.includes("/chat/")) {
    if (friends[0]?.conversationId) {
      return redirect(`/chat/${friends[0].conversationId}`);
    }
    if (friends[0] && !friends[0].conversationId) {
      const conversation = await createConversation({
        request,
        recipientId: friends[0].id,
      });
      if (conversation.conversationId) {
        return redirect(`/chat/${conversation.conversationId}`);
      }
    }
  }

  return json({
    firstName: user.firstName,
    email: user.email,
    id: user.id,
    friends,
  });
}
