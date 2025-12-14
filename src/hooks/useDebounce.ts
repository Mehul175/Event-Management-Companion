/**
 * Purpose: Debounce a value over a specified delay.
 * Author: EventCompanion Team
 * Responsibility: Provide a reusable debounce hook for search and API calls.
 */

import { useEffect, useState } from 'react';

function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounced;
}

export default useDebounce;
