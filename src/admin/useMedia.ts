import { useEffect, useState } from 'react';

// True while the media query matches (e.g. '(min-width: 1280px)').
export function useMedia(query: string): boolean {
  const [match, setMatch] = useState(() => {
    try {
      return window.matchMedia(query).matches;
    } catch {
      return false;
    }
  });
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}
