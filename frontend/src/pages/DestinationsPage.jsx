import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, Search, X } from 'lucide-react';
import { CATEGORIES, DESTINATIONS, MONTHS, REGIONS } from '../data/destinations.js';
import { PAGE_IMAGES } from '../data/pagesData.js';
import PageHero from '../components/layout/PageHero.jsx';
import CtaBand from '../components/layout/CtaBand.jsx';
import DestinationCard from '../components/cards/DestinationCard.jsx';

export default function DestinationsPage() {
  const [params, setParams] = useSearchParams();
  const region = params.get('region') || 'All';
  const category = params.get('type') || 'All';
  const month = Number(params.get('month')) || 0;
  const [query, setQuery] = useState('');

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (!value || value === 'All' || value === 0) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const results = useMemo(
    () =>
      DESTINATIONS.filter(
        (d) =>
          (region === 'All' || d.region === region) &&
          (category === 'All' || d.categories.includes(category)) &&
          (!month || d.bestMonths.includes(month)) &&
          (!query.trim() || `${d.name} ${d.tagline} ${d.highlights.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase()))
      ),
    [region, category, month, query]
  );

  const filtered = region !== 'All' || category !== 'All' || month || query;

  return (
    <>
      <PageHero
        image={PAGE_IMAGES.destinations}
        eyebrow="Destinations"
        title="An island of"
        accent="endless wonders"
        text={`From misty tea hills to leopard jungles and sleepy surf towns — explore ${DESTINATIONS.length} of our favourite places in Sri Lanka.`}
        crumbs={[{ label: 'Destinations' }]}
      />

      <section className="bg-porcelain py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="sticky top-24 z-30 -mx-2 rounded-3xl bg-white/85 p-3 shadow-[0_10px_40px_-20px_rgb(10_25_47/0.35)] ring-1 ring-navy-900/5 backdrop-blur-xl sm:p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <label className="flex flex-1 items-center gap-2 rounded-full bg-navy-900/5 px-4 py-2.5">
                <Search className="h-4 w-4 text-navy-800/50" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search temples, whales, tea…"
                  aria-label="Search destinations"
                  className="w-full bg-transparent text-sm focus:outline-none"
                />
              </label>
              <label className="flex items-center gap-2 rounded-full bg-navy-900/5 px-4 py-2.5 text-sm">
                <CalendarDays className="h-4 w-4 text-navy-800/50" />
                <select
                  value={month}
                  onChange={(e) => setParam('month', Number(e.target.value))}
                  aria-label="Travel month"
                  className="cursor-pointer bg-transparent focus:outline-none"
                >
                  <option value={0}>Any month</option>
                  {MONTHS.map((m, i) => (
                    <option key={m} value={i + 1}>Great in {m}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="no-scrollbar mt-3 flex gap-1 overflow-x-auto">
              {['All', ...REGIONS].map((r) => (
                <RegionChip key={r} active={region === r} onClick={() => setParam('region', r)}>{r}</RegionChip>
              ))}
            </div>
            <div className="no-scrollbar mt-1 flex gap-1 overflow-x-auto border-t border-navy-900/5 pt-2">
              {['All', ...CATEGORIES].map((c) => (
                <TypeChip key={c} active={category === c} onClick={() => setParam('type', c)}>{c === 'All' ? 'All experiences' : c}</TypeChip>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between gap-4">
            <p className="text-sm text-navy-800/60">
              Showing <span className="font-semibold text-navy-900">{results.length}</span> of {DESTINATIONS.length} destinations
            </p>
            {filtered && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setParams({}, { replace: true });
                }}
                className="inline-flex items-center gap-1 text-sm font-medium text-teal hover:underline"
              >
                <X className="h-4 w-4" /> Clear filters
              </button>
            )}
          </div>

          <motion.div layout className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {results.map((d) => (
                <DestinationCard key={d.slug} d={d} />
              ))}
            </AnimatePresence>
          </motion.div>

          {results.length === 0 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center text-navy-800/60">
              No destinations match — try another month or clear the filters.
            </motion.p>
          )}
        </div>
      </section>

      <CtaBand title="Can’t choose? You don’t have to." text="Most of our guests combine four to six destinations. Tell us your dates and we’ll draw the perfect route." />
    </>
  );
}

// Separate components so each chip row gets its own sliding highlight.
function RegionChip(props) {
  return <FilterChip group="region" {...props} />;
}
function TypeChip(props) {
  return <FilterChip group="type" {...props} />;
}
function FilterChip({ group, active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`relative shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
        active ? 'text-navy-900' : 'text-navy-800/70 hover:bg-navy-900/5 hover:text-navy-900'
      }`}
    >
      {active && (
        <motion.span layoutId={`chip-${group}`} className="absolute inset-0 rounded-full bg-sun" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
      )}
      <span className="relative">{children}</span>
    </button>
  );
}
