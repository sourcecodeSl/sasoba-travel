import { motion, useScroll, useSpring } from 'framer-motion';

/** Thin feather-gradient reading bar pinned to the top of the viewport. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="bg-feather fixed inset-x-0 top-0 z-[80] h-[3px] origin-left shadow-[0_0_12px_rgb(251_191_36/0.6)]"
    />
  );
}
