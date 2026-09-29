import { motion } from 'framer-motion';

/**
 * Official Sasoba Travels peacock mandala (vector, /public/brand).
 * Layered as feather ring + centre emblem so the feathers can turn on their own.
 *   spin  — feathers rotate slowly forever
 *   hover — feathers turn when a parent `.group` is hovered
 */
export default function PeacockLogo({ className = 'h-10 w-10', spin = false, hover = true }) {
  return (
    <span className={`relative inline-block shrink-0 ${className}`}>
      <motion.img
        src="/brand/sasoba-feathers.svg"
        alt=""
        aria-hidden
        draggable={false}
        animate={spin ? { rotate: 360 } : undefined}
        transition={spin ? { duration: 60, repeat: Infinity, ease: 'linear' } : undefined}
        className={`absolute inset-0 h-full w-full select-none ${
          hover && !spin ? 'transition-transform duration-[1.2s] ease-out group-hover:rotate-[30deg]' : ''
        }`}
      />
      <img
        src="/brand/sasoba-emblem.svg"
        alt="Sasoba Travels"
        draggable={false}
        className="absolute inset-0 h-full w-full select-none"
      />
    </span>
  );
}

/** "Sasoba Travels" wordmark in the logo's typeface. */
export function Wordmark({ size = 'md', className = '' }) {
  const s = size === 'lg' ? { top: 'text-3xl', bottom: 'text-base' } : { top: 'text-[22px]', bottom: 'text-[13px]' };
  return (
    <span className={`font-brand leading-none ${className}`}>
      <span className={`block font-extrabold tracking-tight text-white ${s.top}`}>
        <span className="bg-gradient-to-br from-[#7DB2FF] to-[#3FD1B5] bg-clip-text text-transparent">S</span>asoba
      </span>
      <span className={`block font-bold tracking-tight text-[#6FD6C4] ${s.bottom}`}>Travels</span>
    </span>
  );
}
