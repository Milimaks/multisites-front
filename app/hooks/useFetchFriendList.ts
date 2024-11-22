import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";

// This hook is used to fetch the friend list of a user

export function useFetchFriendList(userId: string) {
  const friendFetcher = useFetcher();

  useEffect(() => {
    if (userId) {
      friendFetcher.load("/friend-list");
    }
  }, [userId]);

  return friendFetcher;
}
