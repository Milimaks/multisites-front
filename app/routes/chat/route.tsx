import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { useState, useRef } from "react";
import { getFriends } from "~/api/friends.api";
import { requireAuthCookie } from "~/auth.server";
import { createConversation } from "~/server/chat.server";
import { Method, useFriendRequestAction } from "~/services/friendService";
import Modal from "~/components/ModalClickOutside";
import SearchInput from "~/components/SearchInput";
import { Button } from "~/components/ui/button";
import { ChatFriendList } from "~/features/chat/ChatFriendList";
import { useFetchFriendList } from "~/hooks/useFetchFriendList";
import { useFetcherInputSearch } from "~/hooks/useFetcherInputSearch";
import { User } from "~/lib/user";

interface ModalData {
  userId: string;
  firstName: string;
  actionType: Method;
}

interface Friend {
  id: string;
  name: string;
}

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

export default function ChatRoute() {
  const { id: userId, friends } = useLoaderData<typeof loader>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalUserData, setModalUserData] = useState<ModalData | null>(null);

  const { searchQuery, handleSearch, searchFetcherData, error, isLoading } =
    useFetcherInputSearch("/users-search");

  const { handleFriendRequestAction } = useFriendRequestAction();

  const friendFetcher = useFetchFriendList(userId);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleModal = (
    firstName: string,
    userId: string,
    actionType: Method
  ) => {
    setModalUserData({ firstName, userId, actionType });
    setIsModalOpen(true);
  };

  const handleActionModal = (
    senderUserId: any,
    receiverUserId: any,
    method: any
  ) => {
    handleFriendRequestAction(senderUserId, receiverUserId, method);
    setIsModalOpen(false);
  };

  return (
    <div className="w-full h-full flex">
      <aside
        className="flex flex-col h-85dvh w-80 bg-gray-100"
        ref={containerRef}
      >
        <SearchInput
          query={searchQuery}
          results={searchFetcherData}
          friends={friendFetcher.data as User[]}
          onSearch={handleSearch}
          error={error}
          isLoading={isLoading}
          placeholder="Search for users..."
          onHandleModal={handleModal}
        />

        {friendFetcher &&
          Array.isArray(friendFetcher.data) &&
          friendFetcher.data.length > 0 && (
            <ChatFriendList
              friendFetcher={friendFetcher.data as User[]}
              handleModal={handleModal}
            />
          )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          className="p-10"
        >
          {modalUserData?.actionType === "post" && (
            <p>
              Voulez vous rajouter{" "}
              <span className="font-semibold">{modalUserData?.firstName}</span>{" "}
              à votre liste d'amis ?
            </p>
          )}
          {modalUserData?.actionType === "delete" && (
            <p>
              Voulez vous supprimer{" "}
              <span className="font-semibold">{modalUserData?.firstName}</span>{" "}
              de votre liste d'amis ?
            </p>
          )}
          <div className="flex justify-end pt-4">
            <Button
              variant={"ghost"}
              className="mr-2"
              onClick={() =>
                modalUserData?.userId &&
                handleActionModal(
                  userId,
                  modalUserData.userId,
                  modalUserData.actionType
                )
              }
            >
              Oui
            </Button>
            <Button variant={"default"} onClick={() => setIsModalOpen(false)}>
              Non
            </Button>
          </div>
        </Modal>
      </aside>
      <div className="flex-1 flex items-center justify-center">
        {!friends[0] ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">
              Sélectionnez un ami pour commencer à discuter
            </p>
          </div>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
}

export const action = async ({ request }: LoaderFunctionArgs) => {
  const user = await requireAuthCookie(request);
  const { userId, actionType } = await request.json();
  const conversation = await createConversation({
    request,
    recipientId: userId,
  });

  return json({ conversationId: conversation.conversationId });
};
