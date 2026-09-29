import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';

// Seconds until the curtain starts lifting — entrance animations elsewhere wait for this.
export const INTRO_DELAY = 1.7;

const loadedAt = typeof performance !== 'undefined' ? performance.now() : 0;

/** Intro delay only applies to the very first page load, not later route changes. */
export function useIntroDelay() {
  const [delay] = useState(() => (performance.now() - loadedAt < (INTRO_DELAY + 0.5) * 1000 ? INTRO_DELAY : 0));
  return delay;
}

/** Brief intro: a peacock fan unfurls around the logo, then the curtain lifts. */
export default function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setDone(true), INTRO_DELAY * 1000);
    return () => clearTimeout(id);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          aria-hidden
          className="fixed inset-0 z-[100] grid place-items-center bg-navy-950"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="relative grid place-items-center">
            <div className="relative h-52 w-52 sm:h-60 sm:w-60">
              <motion.img
                src="/brand/sasoba-feathers.svg"
                alt=""
                className="absolute inset-0 h-full w-full"
                initial={{ scale: 0.2, rotate: -140, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.img
                src="/brand/sasoba-emblem.svg"
                alt=""
                className="absolute inset-0 h-full w-full"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.35, type: 'spring', stiffness: 180, damping: 14 }}
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-sun/20 blur-3xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.4] }}
                transition={{ duration: 1.6 }}
                style={{ zIndex: -1 }}
              />
            </div>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 font-brand text-3xl font-extrabold tracking-tight text-white"
            >
              <span className="bg-gradient-to-br from-[#7DB2FF] to-[#3FD1B5] bg-clip-text text-transparent">S</span>asoba{' '}
              <span className="text-[#6FD6C4]">Travels</span>
            </motion.p>
            <motion.span
              className="bg-feather mt-4 block h-px"
              initial={{ width: 0 }}
              animate={{ width: 160 }}
              transition={{ delay: 0.9, duration: 0.8, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
