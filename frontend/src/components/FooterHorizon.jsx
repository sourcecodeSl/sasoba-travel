import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

/**
 * Sine-like wave spanning two identical halves (0–1440 and 1440–2880),
 * so sliding it by -50% loops seamlessly.
 */
function wavePath({ baseline, amplitude, period, height = 220 }) {
  let d = `M0 ${baseline} Q${period / 4} ${baseline - amplitude} ${period / 2} ${baseline}`;
  for (let x = period; x <= 2880; x += period / 2) d += ` T${x} ${baseline}`;
  return `${d} L2880 ${height} L0 ${height} Z`;
}

const LAYERS = [
  { baseline: 96, amplitude: 22, period: 720, fill: 'url(#fh-teal)', speed: 38, reverse: false, depth: 30 },
  { baseline: 116, amplitude: 16, period: 480, fill: 'url(#fh-emerald)', speed: 26, reverse: true, depth: 18 },
  { baseline: 138, amplitude: 12, period: 1440, fill: '#0a192f', speed: 44, reverse: false, depth: 8 },
  { baseline: 156, amplitude: 9, period: 720, fill: '#060f1e', speed: 30, reverse: true, depth: 0 },
];

// Peacock-feather eyes bobbing on the water, and birds crossing the sky.
const FEATHERS = [
  { left: '9%', delay: '0s', size: 20 },
  { left: '27%', delay: '-1.4s', size: 14 },
  { left: '52%', delay: '-2.1s', size: 18 },
  { left: '71%', delay: '-0.6s', size: 13 },
  { left: '88%', delay: '-2.8s', size: 17 },
];
const BIRDS = [
  { top: '14%', delay: '0s', duration: '26s', scale: 1 },
  { top: '24%', delay: '-9s', duration: '32s', scale: 0.7 },
  { top: '8%', delay: '-17s', duration: '29s', scale: 0.85 },
];

export default function FooterHorizon() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 20 });

  // The sun sets as the footer comes into view.
  const sunY = useTransform(p, [0, 1], ['-10%', '75%']);
  const sunScale = useTransform(p, [0, 1], [0.85, 1.15]);
  const glow = useTransform(p, [0, 0.5, 1], [0.5, 1, 0.7]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none relative z-10 -mt-24 h-48 overflow-hidden select-none sm:-mt-28 sm:h-56">
      {/* Sun + glow */}
      <motion.div style={{ opacity: glow }} className="absolute inset-x-0 bottom-0 h-full bg-[radial-gradient(ellipse_60%_70%_at_50%_100%,rgb(249_115_22/0.28),transparent_70%)]" />
      <motion.div
        style={{ y: sunY, scale: sunScale }}
        className="absolute bottom-6 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_50%_40%,#fde68a,#fbbf24_45%,#f97316_80%)] shadow-[0_0_80px_30px_rgb(251_191_36/0.35)] sm:h-52 sm:w-52"
      />

      {/* Birds */}
      {BIRDS.map((b, i) => (
        <div
          key={i}
          className="absolute left-0 animate-[fh-fly_linear_infinite]"
          style={{ top: b.top, animationDuration: b.duration, animationDelay: b.delay }}
        >
          <svg viewBox="0 0 40 16" className="h-4 w-10 animate-[fh-flap_0.9s_ease-in-out_infinite] text-navy-800/70" style={{ scale: b.scale }}>
            <path d="M2 10 Q11 1 20 9 Q29 1 38 10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </div>
      ))}

      {/* Waves */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1440 220" preserveAspectRatio="none">
        <defs>
          <linearGradient id="fh-teal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0d9488" stopOpacity=".55" />
            <stop offset="1" stopColor="#0a192f" stopOpacity=".9" />
          </linearGradient>
          <linearGradient id="fh-emerald" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#10b981" stopOpacity=".55" />
            <stop offset="1" stopColor="#0a192f" />
          </linearGradient>
          <linearGradient id="fh-crest" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#0d9488" />
            <stop offset=".35" stopColor="#10b981" />
            <stop offset=".7" stopColor="#fbbf24" />
            <stop offset="1" stopColor="#f97316" />
          </linearGradient>
        </defs>
        {LAYERS.map((l, i) => (
          <ParallaxLayer key={i} progress={p} depth={l.depth}>
            <g
              className={`animate-[fh-wave_linear_infinite] ${l.reverse ? '[animation-direction:reverse]' : ''}`}
              style={{ animationDuration: `${l.speed}s` }}
            >
              <path d={wavePath(l)} fill={l.fill} />
              {i === 1 && (
                <path d={wavePath(l).split(' L2880')[0]} fill="none" stroke="url(#fh-crest)" strokeWidth="2.5" opacity=".9" />
              )}
            </g>
          </ParallaxLayer>
        ))}
      </svg>

      {/* Sun reflection shimmering on the water */}
      <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5 sm:bottom-4">
        {[220, 150, 96, 48].map((w, i) => (
          <span
            key={w}
            className="block h-[2px] animate-[fh-shimmer_3.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-sun to-transparent"
            style={{ width: w, animationDelay: `${i * 0.35}s`, marginLeft: i % 2 ? 24 : -18 }}
          />
        ))}
      </div>

      {/* Feathers riding the waves */}
      {FEATHERS.map((f) => (
        <span
          key={f.left}
          className="absolute bottom-[34%] animate-[fh-bob_3.6s_ease-in-out_infinite]"
          style={{ left: f.left, animationDelay: f.delay }}
        >
          <span
            className="block rounded-[50%_50%_50%_50%/60%_60%_40%_40%] shadow-[0_0_12px_rgb(251_191_36/0.4)]"
            style={{
              width: f.size,
              height: f.size * 1.35,
              background:
                'radial-gradient(circle at 50% 58%, #1f5fb0 0 14%, #fbbf24 15% 30%, #f97316 31% 42%, #233d7b 43% 52%, #3fb8b5 53% 100%)',
            }}
          />
        </span>
      ))}
    </div>
  );
}

function ParallaxLayer({ progress, depth, children }) {
  const y = useTransform(progress, [0, 1], [depth, -depth / 2]);
  return <motion.g style={{ y }}>{children}</motion.g>;
}
