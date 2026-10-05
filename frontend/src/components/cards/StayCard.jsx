import { motion } from 'framer-motion';
import { Check, MapPin } from 'lucide-react';
import { BUILDER, whatsappLink } from '../../data/siteData.js';
import { useLocale } from '../../context/CurrencyContext.jsx';
import SmartImage from '../ui/SmartImage.jsx';
import TiltCard from '../ui/TiltCard.jsx';

const TIER_LABEL = Object.fromEntries(BUILDER.tiers.map((t) => [t.id, t.label]));

export default function StayCard({ s }) {
  const { formatPrice } = useLocale();
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group [perspective:1000px]"
    >
      <TiltCard max={5} className="h-full overflow-hidden rounded-[1.75rem] bg-white shadow-[0_10px_40px_-20px_rgb(10_25_47/0.3)] ring-1 ring-navy-900/5">
        <div className="relative h-60 overflow-hidden">
          <SmartImage src={s.image} alt={s.title} className="h-full w-full transition-transform duration-[1.2s] group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
          <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy-900">{TIER_LABEL[s.tier]}</span>
          {s.location && (
            <p className="absolute right-4 bottom-3 left-4 flex items-center gap-1.5 truncate text-xs text-white">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-sun" /> {s.location}
            </p>
          )}
        </div>
        <div className="p-6">
          <h3 className="line-clamp-2 font-display text-2xl font-semibold break-words">{s.title}</h3>
          {s.text && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-navy-800/65">{s.text}</p>}
          <ul className="mt-4 space-y-1.5">
            {s.features.slice(0, 4).map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-emerald" /> {f}</li>
            ))}
          </ul>
          <div className="mt-5 flex items-end justify-between border-t border-navy-900/5 pt-4">
            <p className="text-xs text-navy-800/50">
              {s.priceFrom > 0 ? (
                <>
                  From <span className="font-display text-2xl font-semibold text-navy-900">{formatPrice(s.priceFrom)}</span> / night
                </>
              ) : (
                <span className="text-sm font-semibold text-navy-900">Price on request</span>
              )}
            </p>
            <a
              href={whatsappLink(`Hello Sasoba Travels! I'm interested in a "${s.title}" stay in ${s.location}.`)}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-navy-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-teal"
            >
              Enquire
            </a>
          </div>
        </div>
      </TiltCard>
    </motion.article>
  );
}
