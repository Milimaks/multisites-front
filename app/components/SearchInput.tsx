import React, { useRef, useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import SearchResults from "./SearchResults";
import { User } from "~/lib/user";
import { Method } from "~/services/friendService";

interface SearchInputProps {
  query: string;
  friends: User[];
  results: User[];
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | null;
  isLoading: boolean;
  placeholder?: string;
  noResultsMessage?: string;
  onHandleModal: (
    firstName: string,
    userId: string,
    actionType: Method
  ) => void;
}

export default function SearchInput({
  query,
  friends,
  results,
  onSearch,
  error,
  isLoading,
  placeholder = "Search...",
  noResultsMessage = "No results found",
  onHandleModal,
}: SearchInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClear = () => {
    onSearch({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <div className="relative m-2">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={onSearch}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full h-12 pl-12 pr-10 text-sm bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {isOpen && query.length > 1 && (
        <SearchResults
          ref={resultsRef}
          friends={friends}
          results={results}
          error={error}
          isLoading={isLoading}
          noResultsMessage={noResultsMessage}
          onHandleModal={onHandleModal}
        />
      )}
    </div>
  );
}
