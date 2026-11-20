import { useEffect, useState } from 'react';

/** useState that persists to localStorage. Fails silently (private mode, blocked storage). */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable: keep state in memory only */
    }
  }, [key, value]);

  return [value, setValue];
}
