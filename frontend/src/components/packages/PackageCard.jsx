import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, CalendarDays, Flame, Gem, Leaf, MapPin } from 'lucide-react';
import { useLocale } from '../../context/CurrencyContext.jsx';
import SmartImage from '../ui/SmartImage.jsx';
import Stars from '../ui/Stars.jsx';

const reveal = {
  hidden: { clipPath: 'inset(18% 10% 18% 10% round 2rem)', opacity: 0, y: 40 },
  show: {
    clipPath: 'inset(0% 0% 0% 0% round 2rem)',
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] },
  },
};

const BADGES = {
  Trending: { icon: Flame, className: 'bg-sunset text-white' },
  Exclusive: { icon: Gem, className: 'bg-sun text-navy-900' },
  'Eco-Certified': { icon: Leaf, className: 'bg-emerald text-white' },
};

export default function PackageCard({ pkg, featured = false, matched = false, onOpen }) {
  const { formatPrice } = useLocale();
  const badge = BADGES[pkg.badge];

  // Subtle parallax: image drifts opposite the cursor.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 20 });
  const sy = useSpring(my, { stiffness: 120, damping: 20 });
  const imgX = useTransform(sx, [-0.5, 0.5], ['3%', '-3%']);
  const imgY = useTransform(sy, [-0.5, 0.5], ['3%', '-3%']);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.article
      variants={reveal}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`group relative isolate flex overflow-hidden rounded-[2rem] bg-navy-900 shadow-luxe ${
        featured ? 'min-h-[34rem] lg:row-span-2 lg:min-h-[40rem]' : 'min-h-[26rem] lg:min-h-0'
      } ${matched ? 'ring-2 ring-sun ring-offset-4 ring-offset-navy-950' : ''}`}
    >
      <motion.div style={{ x: imgX, y: imgY }} className="absolute -inset-[4%] -z-10">
        <SmartImage
          src={pkg.image}
          alt={pkg.title}
          className="h-full w-full transition-transform duration-[1.4s] ease-out group-hover:scale-110"
        />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-navy-950/55 to-navy-950/5" />

      <div className="flex w-full flex-col justify-between p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-lg ${badge.className}`}>
            <badge.icon className="h-3.5 w-3.5" />
            {pkg.badge}
          </span>
          {matched && (
            <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-navy-900">Matches your search</span>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-white/75">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-sun" />
              {pkg.days} days / {pkg.days - 1} nights
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-sun" />
              {pkg.route.join(' · ')}
            </span>
          </div>

          <h3 className={`mt-3 font-display leading-[1.05] font-semibold text-white ${featured ? 'text-4xl sm:text-5xl' : 'text-3xl'}`}>
            {pkg.title}
          </h3>

          <ul
            className={`mt-4 space-y-1.5 text-sm text-white/75 ${
              featured ? '' : 'transition-all duration-500 lg:max-h-0 lg:overflow-hidden lg:opacity-0 lg:group-hover:max-h-40 lg:group-hover:opacity-100 lg:group-focus-within:max-h-40 lg:group-focus-within:opacity-100'
            }`}
          >
            {pkg.highlights.slice(0, featured ? 4 : 3).map((h) => (
              <li key={h} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-sun" />
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-white/15 pt-5">
            <div>
              <div className="flex items-center gap-2">
                <Stars rating={pkg.rating} className="h-3.5 w-3.5" />
                <span className="text-xs text-white/70">
                  {pkg.rating.toFixed(1)} · {pkg.reviews} reviews
                </span>
              </div>
              <p className="mt-1.5 text-xs uppercase tracking-widest text-white/50">
                From <span className="font-display text-2xl font-semibold tracking-normal text-white normal-case">{formatPrice(pkg.priceFrom)}</span> pp
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpen(pkg)}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-navy-900 transition hover:bg-sun"
            >
              View Itinerary
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
