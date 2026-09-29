import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';

/**
 * Counts up to the numeric part of a stat like "15+" or "100%" when scrolled into view.
 * Values that aren't a plain number + suffix (e.g. "24/7", "1:1") render unchanged.
 */
export default function CountUp({ value, duration = 1.8 }) {
  const match = /^(\d+)([+%]?)$/.exec(value);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!match || !inView) return;
    const controls = animate(0, Number(match[1]), {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return <span ref={ref}>{match ? `${n}${match[2]}` : value}</span>;
}
