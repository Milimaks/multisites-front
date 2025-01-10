import { UserRoundX } from "lucide-react";
import { Method } from "~/services/friendService";
import { useNavigate } from "@remix-run/react";

interface ChatFriendListProps {
  friendFetcher: any;
  handleModal: (firstName: string, userId: string, actionType: Method) => void;
}

export const ChatFriendList = ({
  friendFetcher,
  handleModal,
}: ChatFriendListProps) => {
  const navigate = useNavigate();

  const handleFriendClick = async (
    conversationId: string,
    friendId: string
  ) => {
    try {
      if (!conversationId) {
        const response = await fetch("/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: friendId }),
        });
        console.log(response);
        if (!response.ok) {
          throw new Error("Failed to create conversation");
        }
        const data = await response.json();
        conversationId = data.conversationId;
      }

      navigate(`/chat/${conversationId}`);
    } catch (error) {
      console.error("Error navigating to chat:", error);
    }
  };

  return (
    <>
      {friendFetcher.map((friend: any, index: number) => (
        <div
          key={index}
          className="flex gap-4 ml-4 mt-4 items-center justify-between hover:bg-gray-100 cursor-pointer p-2 rounded-lg transition-colors"
          onClick={() => handleFriendClick(friend.conversationId, friend.id)}
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
            onClick={(e) => {
              e.stopPropagation();
              handleModal(friend.firstName, friend.id, "delete");
            }}
            className="rounded-full w-10 h-10"
          >
            <UserRoundX />
          </button>
        </div>
      ))}
    </>
  );
};
