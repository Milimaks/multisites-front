import { UserRoundX } from "lucide-react";
import { Method } from "~/services/friendService";

interface ChatFriendListProps {
  friendFetcher: any;
  handleModal: (firstName: string, userId: string, actionType: Method) => void;
}

export const ChatFriendList = ({
  friendFetcher,
  handleModal,
}: ChatFriendListProps) => {
  return (
    <>
      {friendFetcher.map((friend: any, index: number) => (
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
            onClick={() => handleModal(friend.firstName, friend.id, "delete")}
            className="rounded-full w-10 h-10"
          >
            <UserRoundX />
          </button>
        </div>
      ))}
    </>
  );
};
