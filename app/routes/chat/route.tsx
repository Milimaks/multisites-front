import { json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { log } from "console";
import { LoaderIcon, Search, UserRoundPlus, UserRoundX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { set } from "zod";
import Modal from "~/@/components/ModalClickOutside";
import { Button } from "~/components/ui/button";
import { getOptionalUser, requireAuthCookie } from "~/auth.server";

interface ModalData {
  userId: string;
  firstName: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
  let user = await requireAuthCookie(request);

  return json({
    firstName: user.firstName,
    email: user.email,
    id: user.id,
  });
}

export default function ChatRoute() {
  const { id: userId } = useLoaderData<typeof loader>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [deleteFriendModal, setDeleteFriendModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [IsFocused, setIsFocused] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  // Fetchers
  const friendFetcher = useFetcher();
  const searchUserfetcher = useFetcher<any>();
  const addFriendFetcher = useFetcher();
  const deleteFriendFetcher = useFetcher();

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (query.trim() !== "" && query.length > 1) {
        searchUserfetcher.load(`/users-search?query=${query}`);
      }
    }, 500);
  };

  const handleModal = (firstName: string, userId: string) => {
    setModalData({ firstName, userId });
    setIsModalOpen(true);
  };
  const handleDeleteModal = (firstName: string, userId: string) => {
    setModalData({ firstName, userId });
    setDeleteFriendModal(true);
  };

  const handleDeleteFriend = (senderUserId: string, receiverUserId: string) => {
    deleteFriendFetcher.submit(
      { senderUserId, receiverUserId },
      { method: "delete", action: "/friend-request" }
    );
    setDeleteFriendModal(false);
  };

  const handleAddFriend = (senderUserId: string, receiverUserId: string) => {
    addFriendFetcher.submit(
      { senderUserId, receiverUserId },
      { method: "post", action: "/friend-request" }
    );
    setIsModalOpen(false);
  };

  const handleFocus = (e: boolean) => {
    setIsFocused(e);
  };

  useEffect(() => {
    if (userId) {
      friendFetcher.load("/friend-list");
    }
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setSearchQuery("");
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full h-full flex">
      <aside
        className="flex flex-col h-85dvh w-80 bg-gray-100"
        ref={containerRef}
      >
        <div className="rounded-md flex items-center justify-center pt-4">
          <Search className="w-5 h-5 text-muted-foreground m-1" />
          <input
            type="text"
            className="border-none hover:border-none focus:border-none focus:outline-none placeholder-gray-400 text-sm"
            placeholder="Recherchez un ami"
            value={searchQuery}
            onChange={handleSearch}
            onFocus={() => handleFocus(true)}
          />
        </div>
        {!IsFocused &&
          friendFetcher &&
          Array.isArray(friendFetcher.data) &&
          friendFetcher.data.length > 0 &&
          friendFetcher.data.map((friend: any, index: number) => (
            <div
              key={index}
              className="flex gap-4 ml-4 mt-4 items-center justify-between"
            >
              <div className="flex gap-4">
                <img
                  src="/image/profile-user.jpeg"
                  className="w-6 h-6"
                  alt="Profile"
                />
                <p>
                  {friend.firstName} {friend.lastName}
                </p>
              </div>
              <button
                onClick={() => handleDeleteModal(friend.firstName, friend.id)}
                className="rounded-full w-10 h-10"
              >
                <UserRoundX />
              </button>
            </div>
          ))}
        {IsFocused && searchQuery.length > 1 && (
          <div className="w-full h-full pt-4">
            {searchUserfetcher.data && searchUserfetcher.data.length > 0 ? (
              searchUserfetcher.data.map((user: any, index: number) => (
                <li
                  key={index}
                  className="flex justify-between list-none p-2 border-b"
                >
                  <div className="flex gap-1 items-center">
                    <img
                      src="/image/profile-user.jpeg"
                      className="w-6 h-6"
                      alt="Profile"
                    />
                    <p>
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                  {Array.isArray(friendFetcher.data) &&
                    !friendFetcher.data.some(
                      (friend: any) => friend.id === user.userId
                    ) && (
                      <button
                        onClick={() => handleModal(user.firstName, user.userId)}
                        className="rounded-full w-10 h-10"
                      >
                        <UserRoundPlus />
                      </button>
                    )}
                </li>
              ))
            ) : (
              <li className="list-none p-2 text-gray-500">
                {searchUserfetcher.data && searchUserfetcher.data.length === 0
                  ? "Aucun utilisateur trouvé"
                  : ""}
              </li>
            )}
          </div>
        )}
        <Modal
          isOpen={deleteFriendModal}
          onClose={() => setDeleteFriendModal(false)}
          className="p-10"
        >
          <p>
            Voulez vous supprimer{" "}
            <span className="font-semibold">{modalData?.firstName}</span> de
            votre liste d'amis ?
          </p>
          <div className="flex justify-end pt-4">
            <Button
              variant={"ghost"}
              className="mr-2"
              onClick={() =>
                modalData?.userId &&
                handleDeleteFriend(userId, modalData.userId)
              }
            >
              Oui
            </Button>
            <Button
              variant={"default"}
              onClick={() => setDeleteFriendModal(false)}
            >
              Non
            </Button>
          </div>
        </Modal>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          className="p-10"
        >
          <p>
            Voulez vous rajouter{" "}
            <span className="font-semibold">{modalData?.firstName}</span> à
            votre liste d'amis ?
          </p>
          <div className="flex justify-end pt-4">
            <Button
              variant={"ghost"}
              className="mr-2"
              onClick={() =>
                modalData?.userId && handleAddFriend(userId, modalData.userId)
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
      <div></div>
    </div>
  );
}
