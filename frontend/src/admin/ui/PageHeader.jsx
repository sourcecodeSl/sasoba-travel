import { motion } from 'framer-motion';

export default function PageHeader({ eyebrow, title, text, children }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
    >
      <div className="min-w-0">
        {eyebrow && <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-teal">{eyebrow}</p>}
        <h1 className="mt-1 font-display text-4xl font-semibold text-navy-900">{title}</h1>
        {text && <p className="mt-1.5 max-w-2xl text-sm text-navy-800/60">{text}</p>}
      </div>
      {children && <div className="flex shrink-0 flex-wrap items-center gap-2">{children}</div>}
    </motion.header>
  );
}
