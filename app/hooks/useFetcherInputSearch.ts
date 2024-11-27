import { useFetcher } from "@remix-run/react";
import { useState, useRef } from "react";
import { User } from "~/lib/user";

export function useFetcherInputSearch(url: string) {
  const fetcher = useFetcher<User[]>();
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setError(null);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      if (query.trim() !== "" && query.length > 1) {
        try {
          await fetcher.load(`${url}?query=${query}`);
        } catch (err) {
          console.error("Erreur lors de la récupération des données :", err);
          setError(
            "Une erreur est survenue lors de la récupération des données."
          );
        }
      }
    }, 500);
  };

  return {
    searchQuery,
    setSearchQuery,
    handleSearch,
    searchFetcherData: fetcher.data || [],
    error,
    isLoading: fetcher.state === "loading",
  };
}
