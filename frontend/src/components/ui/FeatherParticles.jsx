import { motion } from 'framer-motion';

// Deterministic pseudo-random so positions are stable between renders.
const rand = (seed) => {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

const COLORS = ['#FBBF24', '#F97316', '#10B981', '#0D9488'];

/** Tiny peacock "eyes" drifting upward — ambient decoration for dark sections. */
export default function FeatherParticles({ count = 18, className = '' }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {Array.from({ length: count }, (_, i) => {
        const size = 5 + rand(i) * 10;
        const left = rand(i + 1) * 100;
        const duration = 14 + rand(i + 2) * 16;
        const delay = -rand(i + 3) * duration;
        const drift = (rand(i + 4) - 0.5) * 80;
        const color = COLORS[i % COLORS.length];
        return (
          <motion.span
            key={i}
            className="absolute bottom-[-40px] rounded-full"
            style={{
              left: `${left}%`,
              width: size,
              height: size * 1.35,
              background: `radial-gradient(circle at 50% 42%, #FBBF24 0 18%, #1A365D 19% 32%, ${color} 33% 70%, transparent 71%)`,
              filter: 'blur(0.3px)',
            }}
            animate={{ y: [0, -900], x: [0, drift, 0], rotate: [0, 180], opacity: [0, 0.35, 0.35, 0] }}
            transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
          />
        );
      })}
    </div>
  );
}
