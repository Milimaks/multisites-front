import { useFetcher } from "@remix-run/react";
import { useState, useRef } from "react";

// This hook is used to fetch user search results

export function useFetchUserSearch() {
  const searchUserfetcher = useFetcher<User[]>();
  const [searchQuery, setSearchQuery] = useState("");
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

  return { searchQuery, setSearchQuery, handleSearch, searchUserfetcher };
}
