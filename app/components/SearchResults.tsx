import { Loader2, UserRoundPlus } from "lucide-react";
import React, { forwardRef } from "react";
import { User } from "~/lib/user";
import { Method } from "~/services/friendService";

interface SearchResultsProps {
  results: User[];
  friends: User[];
  error?: string | null;
  isLoading: boolean;
  noResultsMessage: string;
  onHandleModal: (
    firstName: string,
    userId: string,
    actionType: Method
  ) => void;
}

const SearchResults = forwardRef<HTMLDivElement, SearchResultsProps>(
  (
    {
      results,
      friends,
      error,
      isLoading,
      noResultsMessage,
      onHandleModal,
    }: SearchResultsProps,
    ref
  ) => {
    return (
      <div
        ref={ref}
        className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto"
      >
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="p-4 text-sm text-red-500">{error}</div>
        ) : results.length > 0 ? (
          results.map((item, index) => (
            <div
              key={index}
              className="p-4 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
            >
              <div>
                {item.firstName} {item.lastName}
              </div>
              {!friends.some((friend) => friend.id === item.id) && (
                <button
                  onClick={() => onHandleModal(item.firstName, item.id, "post")}
                  className="rounded-full w-10 h-10"
                >
                  <UserRoundPlus />
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="p-4 text-sm text-gray-500">{noResultsMessage}</div>
        )}
      </div>
    );
  }
);

SearchResults.displayName = "SearchResults";

export default SearchResults;
