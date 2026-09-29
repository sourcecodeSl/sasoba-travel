import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Sparkles, X } from 'lucide-react';
import { PACKAGES } from '../../data/siteData.js';
import SectionHeading from '../ui/SectionHeading.jsx';
import { stagger } from '../ui/Reveal.jsx';
import PackageCard from './PackageCard.jsx';
import ItineraryModal from './ItineraryModal.jsx';

const matchesSearch = (pkg, search) => {
  if (!search) return false;
  const dest = search.destination.trim().toLowerCase();
  const destOk = !dest || pkg.places.some((p) => p.toLowerCase().includes(dest)) || pkg.route.some((r) => r.toLowerCase().includes(dest));
  const styleOk = !search.style || pkg.styles.includes(search.style);
  return destOk && styleOk && (dest || search.style);
};

const formatDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });

export default function Packages({ search, onClearSearch }) {
  const [active, setActive] = useState(null);
  const closeModal = useCallback(() => setActive(null), []);

  // Matching journeys float to the featured slot.
  const ordered = useMemo(() => {
    const scored = PACKAGES.map((p) => ({ pkg: p, matched: matchesSearch(p, search) }));
    return [...scored.filter((s) => s.matched), ...scored.filter((s) => !s.matched)].slice(0, 3);
  }, [search]);

  const summary = search
    ? [
        search.destination || 'All of Ceylon',
        search.style || 'Any style',
        search.checkIn && search.checkOut ? `${formatDate(search.checkIn)} – ${formatDate(search.checkOut)}` : null,
        `${search.adults + search.children} guest${search.adults + search.children > 1 ? 's' : ''}`,
      ].filter(Boolean)
    : null;
  const anyMatch = ordered.some((o) => o.matched);

  return (
    <section id="journeys" className="relative overflow-hidden bg-navy-950 py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute top-0 left-1/2 h-[30rem] w-[60rem] -translate-x-1/2 rounded-full bg-teal/20 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading
            dark
            align="left"
            eyebrow="Signature Journeys"
            title="Curated escapes,"
            accent="crafted to be yours"
            text="Begin with one of our signature routes, then let your journey designer reshape every day around you."
          />
          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              to="/journeys"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-navy-900 transition hover:bg-sun"
            >
              View all journeys <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#builder"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-sun hover:text-sun"
            >
              <Sparkles className="h-4 w-4" /> Build your own
            </a>
          </div>
        </div>

        <AnimatePresence>
          {summary && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass mt-10 flex flex-wrap items-center gap-3 rounded-2xl px-5 py-4 text-sm text-white"
            >
              <span className="font-semibold text-sun">Your search:</span>
              {summary.map((s) => (
                <span key={s} className="rounded-full bg-white/10 px-3 py-1 text-xs">
                  {s}
                </span>
              ))}
              <span className="text-xs text-white/60">
                {anyMatch
                  ? '— matching journeys are highlighted below.'
                  : '— no exact match, but every journey can be tailored to you.'}
              </span>
              <button
                type="button"
                onClick={onClearSearch}
                className="ml-auto inline-flex items-center gap-1 text-xs text-white/60 hover:text-white"
              >
                <X className="h-3.5 w-3.5" /> Clear
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          variants={stagger(0.15)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-12 grid gap-6 lg:grid-cols-2 lg:grid-rows-2"
        >
          {ordered.map(({ pkg, matched }, i) => (
            <PackageCard key={pkg.id} pkg={pkg} featured={i === 0} matched={matched} onOpen={setActive} />
          ))}
        </motion.div>
      </div>

      <ItineraryModal pkg={active} onClose={closeModal} />
    </section>
  );
}
