import { useCallback, useEffect, useState } from 'react';

/** Cycles an index through `length` items every `delay` ms; pauses while `paused` is true. */
export function useAutoplay(length, delay = 6000, paused = false) {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => setIndex((i) => (i + 1) % length), [length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + length) % length), [length]);

  useEffect(() => {
    if (paused || length < 2) return;
    const id = setTimeout(next, delay);
    return () => clearTimeout(id);
  }, [index, paused, delay, length, next]);

  return { index, setIndex, next, prev };
}
