import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { LoaderIcon, Search, UserRoundPlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { set } from "zod";
import Modal from "~/@/components/ModalClickOutside";
import { Button } from "~/@/components/ui/button";
import { getOptionalUser } from "~/auth.server";

interface ModalData {
  userId: string;
  firstName: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getOptionalUser({ request });
  if (!user) {
    throw new Error("User not found");
  }

  return json({
    firstName: user.firstName,
    email: user.email,
    id: user.id,
  });
}

export default function ChatRoute() {
  const { id: userId } = useLoaderData<typeof loader>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalData, setModalData] = useState<ModalData | null>(null);

  const friendFetcher = useFetcher();
  const fetcher = useFetcher<any>();
  const addFriendFetcher = useFetcher();

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (query.trim() !== "" && query.length > 1) {
        fetcher.load(`/users-search?query=${query}`);
      }
    }, 500);
  };

  const handleModal = (firstName: string, userId: string) => {
    setModalData({ firstName, userId });
    setIsModalOpen(true);
  };

  const handleAddFriend = (senderUserId: string, receiverUserId: string) => {
    addFriendFetcher.submit(
      { senderUserId, receiverUserId },
      { method: "post", action: "/friend-request" }
    );
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (userId) {
      friendFetcher.load("/friend-list");
    }
  }, [userId]);

  return (
    <div className="w-full h-full flex">
      <aside className="flex flex-col h-85dvh w-80 bg-gray-100">
        <div className="rounded-md flex items-center justify-center pt-4">
          <Search className="w-5 h-5 text-muted-foreground m-1" />
          <input
            type="text"
            className="border-none hover:border-none focus:border-none focus:outline-none placeholder-gray-400 text-sm"
            placeholder="Recherchez un ami"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        {friendFetcher &&
          Array.isArray(friendFetcher.data) &&
          friendFetcher.data.length > 0 &&
          friendFetcher.data.map((friend: any, index: number) => (
            <div key={index} className="flex gap-4 ml-4 mt-4">
              <img
                src="/image/profile-user.jpeg"
                className="w-6 h-6"
                alt="Profile"
              />
              <p>
                {friend.firstName} {friend.lastName}
              </p>
            </div>
          ))}
        {searchQuery.length > 1 && (
          <div className="w-full h-full pt-4">
            {fetcher.data && fetcher.data.length > 0 ? (
              fetcher.data.map((user: any, index: number) => (
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
                    <p>{user.firstName}</p>
                  </div>
                  <button
                    onClick={() => handleModal(user.firstName, user.userId)}
                    className="rounded-full w-10 h-10"
                  >
                    <UserRoundPlus />
                  </button>
                </li>
              ))
            ) : (
              <li className="list-none p-2 text-gray-500">
                {fetcher.data && fetcher.data.length === 0
                  ? "Aucun utilisateur trouvé"
                  : ""}
              </li>
            )}
          </div>
        )}
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
