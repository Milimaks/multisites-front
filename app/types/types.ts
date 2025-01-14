export interface SearchableItem {
  id: string;
  [key: string]: any;
}

export interface SearchInputProps<T extends SearchableItem> {
  handleSearch: (query: string) => Promise<T[]>;
  onSelect?: (item: T) => void;
  renderItem: (item: T) => React.ReactNode;
  placeholder?: string;
  noResultsMessage?: string;
  errorMessage?: string;
  debounceMs?: number;
}

export interface Message {
  id: number;
  content: string;
  sender: { id: string };
}
