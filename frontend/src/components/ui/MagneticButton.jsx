import { motion } from 'framer-motion';
import { useMagnetic } from '../../hooks/useMagnetic.js';

export default function MagneticButton({ as = 'a', children, className = '', strength, ...rest }) {
  const magnetic = useMagnetic(strength);
  const Tag = motion[as];
  return (
    <Tag
      ref={magnetic.ref}
      style={magnetic.style}
      onMouseMove={magnetic.onMouseMove}
      onMouseLeave={magnetic.onMouseLeave}
      whileTap={{ scale: 0.96 }}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold ${className}`}
      {...rest}
    >
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"
      />
      <span className="relative flex items-center gap-2">{children}</span>
    </Tag>
  );
}
