import { motion } from 'framer-motion';
import { MONTHS } from '../../data/destinations.js';

/** Twelve-month strip highlighting the best time to visit. */
export default function MonthBar({ months, compact = false, dark = false }) {
  return (
    <div>
      {!compact && (
        <p className={`mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] ${dark ? 'text-white/50' : 'text-navy-800/50'}`}>Best time to visit</p>
      )}
      <div className="grid grid-cols-12 gap-1" aria-label={`Best months: ${months.map((m) => MONTHS[m - 1]).join(', ')}`}>
        {MONTHS.map((m, i) => {
          const good = months.includes(i + 1);
          return (
            <div key={m} className="flex flex-col items-center gap-1">
              <motion.span
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03, duration: 0.4 }}
                className={`block w-full origin-bottom rounded-full ${compact ? 'h-1.5' : 'h-2.5'} ${
                  good ? 'bg-feather' : dark ? 'bg-white/10' : 'bg-navy-900/10'
                }`}
              />
              {!compact && (
                <span className={`text-[10px] ${good ? (dark ? 'text-white' : 'text-navy-900') : dark ? 'text-white/35' : 'text-navy-800/35'}`}>
                  {m[0]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
