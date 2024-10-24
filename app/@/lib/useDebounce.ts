import { useEffect, useState, useRef } from "react";

export function useDebounce(value: string, delay = 800) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  // Use a ref to store the timeout id so it can be cleared and reset and avoid memory leaks by conserving the same reference
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear timeout if the value changes (also on initial render)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Start a new timeout
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear timeout if the component is unmounted or the value changes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay]);

  return debouncedValue;
}
