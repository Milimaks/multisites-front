import { useFetcher } from "@remix-run/react";

export type Method = "post" | "delete";

export const useFriendRequestAction = () => {
  const friendRequestfetcher = useFetcher();

  const handleFriendRequestAction = (
    senderUserId: string,
    receiverUserId: string,
    method: Method
  ) => {
    const url = "/friend-request";
    const body = { senderUserId, receiverUserId };

    friendRequestfetcher.submit(body, { method, action: url });
  };

  return { handleFriendRequestAction, friendRequestfetcher };
};
