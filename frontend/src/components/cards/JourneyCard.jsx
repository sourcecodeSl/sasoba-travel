import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react';
import { useLocale } from '../../context/CurrencyContext.jsx';
import SmartImage from '../ui/SmartImage.jsx';
import Stars from '../ui/Stars.jsx';

const BADGE = {
  Trending: 'bg-sunset text-white',
  Exclusive: 'bg-sun text-navy-900',
  'Eco-Certified': 'bg-emerald text-white',
};

export default function JourneyCard({ pkg }) {
  const { formatPrice } = useLocale();
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group h-full"
    >
      <Link
        to={`/journeys/${pkg.id}`}
        className="flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-navy-900 text-white shadow-luxe ring-1 ring-white/5"
      >
        <div className="relative h-64 overflow-hidden">
          <SmartImage src={pkg.image} alt={pkg.title} className="h-full w-full transition-transform duration-[1.2s] ease-out group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/20 to-transparent" />
          <span className={`absolute top-4 left-4 rounded-full px-3 py-1 text-xs font-semibold ${BADGE[pkg.badge]}`}>{pkg.badge}</span>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/65">
            <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-sun" /> {pkg.days} days</span>
            <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-sun" /> {pkg.route.join(' · ')}</span>
          </div>
          <h3 className="mt-3 font-display text-2xl leading-tight font-semibold">{pkg.title}</h3>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {pkg.styles.map((s) => (
              <span key={s} className="rounded-full bg-white/10 px-2.5 py-1 text-[11px]">{s}</span>
            ))}
          </div>
          <div className="mt-auto flex items-end justify-between gap-4 border-t border-white/10 pt-5">
            <div>
              <Stars rating={pkg.rating} className="h-3.5 w-3.5" />
              <p className="mt-1 text-xs text-white/50">
                From <span className="font-display text-2xl font-semibold text-white">{formatPrice(pkg.priceFrom)}</span> pp
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-sun">
              Details <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
