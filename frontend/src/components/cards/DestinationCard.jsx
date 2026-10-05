import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Award, Clock } from 'lucide-react';
import SmartImage from '../ui/SmartImage.jsx';
import MonthBar from './MonthBar.jsx';

export default function DestinationCard({ d, size = 'md' }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group h-full"
    >
      <Link
        to={`/destinations/${d.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_10px_40px_-20px_rgb(10_25_47/0.3)] ring-1 ring-navy-900/5 transition-shadow duration-500 hover:shadow-luxe"
      >
        <div className={`relative overflow-hidden ${size === 'sm' ? 'h-44' : 'h-60'}`}>
          <SmartImage src={d.image} alt={d.name} className="h-full w-full transition-transform duration-[1.2s] ease-out group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {d.unesco && (
              <span className="inline-flex items-center gap-1 rounded-full bg-sun px-2.5 py-1 text-[11px] font-semibold text-navy-900">
                <Award className="h-3 w-3" /> UNESCO
              </span>
            )}
          </div>
          <span className="absolute top-4 right-4 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-white/90 text-navy-900 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <ArrowUpRight className="h-5 w-5" />
          </span>
          <p className="absolute right-4 bottom-3 left-4 truncate text-[11px] font-semibold uppercase tracking-[0.2em] text-white/85">{d.region}</p>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="line-clamp-2 font-display text-2xl leading-tight font-semibold break-words text-navy-900 transition-colors group-hover:text-teal">{d.name}</h3>
          {d.tagline && <p className="mt-1 line-clamp-2 text-sm text-navy-800/65">{d.tagline}</p>}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {d.categories.slice(0, 4).map((c) => (
              <span key={c} className="rounded-full bg-teal/10 px-2.5 py-1 text-[11px] font-medium text-teal">{c}</span>
            ))}
          </div>
          <div className="mt-auto pt-5">
            <MonthBar months={d.bestMonths} compact />
            <p className="mt-3 flex items-center gap-1.5 text-xs text-navy-800/55">
              <Clock className="h-3.5 w-3.5" /> {d.fromColombo} from Colombo · {d.idealStay}
            </p>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
