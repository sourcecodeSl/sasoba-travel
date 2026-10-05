import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PACKAGES, TRAVEL_STYLES } from '../data/siteData.js';
import { PAGE_IMAGES } from '../data/pagesData.js';
import PageHero from '../components/layout/PageHero.jsx';
import CtaBand from '../components/layout/CtaBand.jsx';
import JourneyCard from '../components/cards/JourneyCard.jsx';

const DURATIONS = [
  { id: 'all', label: 'Any length', test: () => true },
  { id: 'short', label: 'Up to 9 days', test: (d) => d <= 9 },
  { id: 'long', label: '10+ days', test: (d) => d >= 10 },
];

function Pill({ group, active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
        active ? 'text-navy-900' : 'text-white/70 hover:text-white'
      }`}
    >
      {active && <motion.span layoutId={`pill-${group}`} className="absolute inset-0 rounded-full bg-sun" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
      <span className="relative">{children}</span>
    </button>
  );
}

export default function JourneysPage() {
  const [style, setStyle] = useState('All');
  const [duration, setDuration] = useState('all');

  const results = useMemo(() => {
    const test = DURATIONS.find((d) => d.id === duration).test;
    return PACKAGES.filter((p) => (style === 'All' || p.styles.includes(style)) && test(p.days));
  }, [style, duration]);

  return (
    <>
      <PageHero
        image={PAGE_IMAGES.journeys}
        eyebrow="Curated Journeys"
        title="Signature journeys,"
        accent="shaped around you"
        text="Each route is a starting point. Change the pace, swap the hotels, add a day by the sea. Every journey is fully private and fully flexible."
        crumbs={[{ label: 'Curated Journeys' }]}
      />

      <section className="bg-navy-950 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="glass flex flex-col gap-2 rounded-3xl p-2 lg:flex-row lg:items-center lg:justify-between">
            <div className="no-scrollbar flex gap-1 overflow-x-auto">
              {['All', ...TRAVEL_STYLES].map((s) => (
                <Pill key={s} group="style" active={style === s} onClick={() => setStyle(s)}>{s === 'All' ? 'All styles' : s}</Pill>
              ))}
            </div>
            <div className="no-scrollbar flex gap-1 overflow-x-auto border-t border-white/10 pt-2 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-2">
              {DURATIONS.map((d) => (
                <Pill key={d.id} group="duration" active={duration === d.id} onClick={() => setDuration(d.id)}>{d.label}</Pill>
              ))}
            </div>
          </div>

          <p className="mt-8 text-sm text-white/60">
            <span className="font-semibold text-white">{results.length}</span> journeys
          </p>

          <motion.div layout className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {results.map((p) => (
                <JourneyCard key={p.id} pkg={p} />
              ))}
            </AnimatePresence>
          </motion.div>
          {results.length === 0 && <p className="py-16 text-center text-white/60">No journeys match, but we can design one just for you.</p>}
        </div>
      </section>

      <CtaBand title="Want something completely different?" text="Use our itinerary builder or message us. We design journeys from scratch every day." />
    </>
  );
}
