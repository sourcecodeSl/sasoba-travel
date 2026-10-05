import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { DESTINATIONS, MONTHS } from '../data/destinations.js';
import { PACKAGES } from '../data/siteData.js';
import { PAGE_IMAGES, PARK_SPECIES, SAFARI_EXPERIENCES, WILDLIFE_CALENDAR } from '../data/pagesData.js';
import PageHero from '../components/layout/PageHero.jsx';
import CtaBand from '../components/layout/CtaBand.jsx';
import JourneyCard from '../components/cards/JourneyCard.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import SmartImage from '../components/ui/SmartImage.jsx';
import CountUp from '../components/ui/CountUp.jsx';
import { fadeUp, stagger } from '../components/ui/Reveal.jsx';
import { getIcon } from '../components/ui/icons.js';

const LAND = ['yala', 'wilpattu', 'udawalawe', 'minneriya', 'sinharaja', 'horton-plains'];
const SEA = ['mirissa', 'trincomalee', 'kalpitiya'];

function ParkCard({ d, i }) {
  return (
    <motion.div variants={fadeUp} className={i === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}>
      <Link to={`/destinations/${d.slug}`} className="group relative flex h-full min-h-72 overflow-hidden rounded-[1.75rem]">
        <SmartImage src={d.image} alt={d.name} className="absolute inset-0 h-full w-full transition-transform duration-[1.4s] group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
        <div className="relative mt-auto w-full p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sun">{d.tagline}</p>
          <h3 className={`mt-1 font-display font-semibold text-white ${i === 0 ? 'text-4xl' : 'text-2xl'}`}>{d.name}</h3>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {(PARK_SPECIES[d.slug] || []).map((s) => (
              <span key={s} className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] text-white backdrop-blur">{s}</span>
            ))}
          </div>
        </div>
        <span className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-navy-900 opacity-0 transition group-hover:opacity-100">
          <ArrowUpRight className="h-5 w-5" />
        </span>
      </Link>
    </motion.div>
  );
}

// Header, rows and the highlight column all share this template so months line up exactly.
const CAL_GRID = 'grid px-4 sm:grid-cols-[13rem_1fr] sm:gap-4 sm:px-6';

function WildlifeCalendar() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-luxe ring-1 ring-navy-900/5">
      {/* Highlight band behind the selected month, running the full height */}
      <div aria-hidden className={`pointer-events-none absolute inset-0 ${CAL_GRID}`}>
        <div className="hidden sm:block" />
        <div className="grid grid-cols-12 gap-1">
          <motion.div
            className="rounded-2xl bg-sun/12"
            style={{ gridColumn: month, gridRow: 1 }}
            layout
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          />
        </div>
      </div>

      <div className={`relative items-center border-b border-navy-900/5 py-3 ${CAL_GRID}`}>
        <p className="hidden text-xs font-semibold uppercase tracking-[0.2em] text-navy-800/50 sm:block">Choose a month</p>
        <div className="grid grid-cols-12 gap-1">
          {MONTHS.map((m, i) => (
            <button
              key={m}
              type="button"
              onClick={() => setMonth(i + 1)}
              aria-pressed={month === i + 1}
              aria-label={m}
              className={`relative rounded-full py-2 text-center text-xs font-semibold sm:text-sm ${month === i + 1 ? 'text-navy-900' : 'text-navy-800/55 hover:text-navy-900'}`}
            >
              {month === i + 1 && <motion.span layoutId="cal-month" className="absolute inset-0 rounded-full bg-sun" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
              <span className="relative hidden lg:inline">{m}</span>
              <span className="relative lg:hidden">{m[0]}</span>
            </button>
          ))}
        </div>
      </div>

      <ul className="relative divide-y divide-navy-900/5">
        {WILDLIFE_CALENDAR.map((row) => {
          const good = row.months.includes(month);
          return (
            <li key={row.species} className={`items-center gap-y-3 py-4 ${CAL_GRID}`}>
              <div className="flex items-center gap-3">
                <motion.span
                  animate={{ scale: good ? 1 : 0.6, opacity: good ? 1 : 0.35 }}
                  className={`h-3 w-3 shrink-0 rounded-full ${good ? 'bg-emerald shadow-[0_0_0_4px_rgb(16_185_129/0.2)]' : 'bg-navy-900/30'}`}
                />
                <div className="min-w-0">
                  <p className={`truncate font-semibold transition-colors ${good ? 'text-navy-900' : 'text-navy-800/45'}`}>{row.species}</p>
                  <p className="text-xs text-navy-800/50">{row.where}</p>
                </div>
              </div>
              <div className="grid grid-cols-12 gap-1">
                {MONTHS.map((m, i) => {
                  const on = row.months.includes(i + 1);
                  const current = i + 1 === month;
                  return (
                    <span
                      key={m}
                      title={`${m}${on ? ' (good)' : ''}`}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        on ? (current ? 'scale-y-150 bg-sun ring-2 ring-sun/40' : 'bg-feather') : current ? 'bg-navy-900/20' : 'bg-navy-900/[0.07]'
                      }`}
                    />
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function SafariPage() {
  const parks = LAND.map((s) => DESTINATIONS.find((d) => d.slug === s));
  const marine = SEA.map((s) => DESTINATIONS.find((d) => d.slug === s));
  const journeys = PACKAGES.filter((p) => p.styles.includes('Wildlife Safari'));

  return (
    <>
      <PageHero
        image={PAGE_IMAGES.safari}
        eyebrow="Wild & Safari"
        title="Leopards, elephants"
        accent="& blue whales"
        text="Few places pack so much wildlife into so small an island. Track leopards at dawn, watch hundreds of elephants gather, and meet the largest animal that has ever lived."
        crumbs={[{ label: 'Wild & Safari' }]}
        tall
      >
        <div className="grid max-w-xl grid-cols-3 gap-4">
          {[['26', 'National parks'], ['34', 'Endemic birds'], ['100%', 'Private jeeps']].map(([n, l]) => (
            <div key={l} className="glass rounded-2xl p-4 text-white">
              <p className="text-feather font-display text-3xl font-bold"><CountUp value={n} /></p>
              <p className="text-xs text-white/70">{l}</p>
            </div>
          ))}
        </div>
      </PageHero>

      <section className="bg-porcelain py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="On land" title="The great" accent="national parks" text="From the leopard jungles of the south to the quiet lakes of Wilpattu and the rainforest canopy of Sinharaja." />
          <motion.div
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="mt-14 grid auto-rows-[17rem] gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {parks.map((d, i) => <ParkCard key={d.slug} d={d} i={i} />)}
          </motion.div>
        </div>
      </section>

      <section className="bg-cream py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Wildlife calendar" title="What’s best" accent="in which month?" text="Pick your travel month. Green lights show what’s at its best." />
          <div className="mt-12"><WildlifeCalendar /></div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy-900 py-20 sm:py-28">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading dark eyebrow="At sea" title="Whales, dolphins" accent="& coral reefs" />
          <motion.div variants={stagger(0.12)} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-14 grid gap-5 md:grid-cols-3">
            {marine.map((d) => <ParkCard key={d.slug} d={d} i={1} />)}
          </motion.div>
        </div>
      </section>

      <section className="bg-porcelain py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="The Sasoba way" title="Safari," accent="done beautifully" />
          <motion.div variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SAFARI_EXPERIENCES.map((e) => {
              const Icon = getIcon(e.icon);
              return (
                <motion.div key={e.title} variants={fadeUp} whileHover={{ y: -6 }} className="rounded-3xl bg-white p-7 ring-1 ring-navy-900/5 transition-shadow hover:shadow-luxe">
                  <span className="bg-feather grid h-12 w-12 place-items-center rounded-2xl text-white"><Icon className="h-6 w-6" /></span>
                  <h3 className="mt-5 font-display text-2xl font-semibold">{e.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-800/65">{e.text}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {journeys.length > 0 && (
        <section className="bg-navy-950 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading dark align="left" eyebrow="Wildlife journeys" title="Ready-made" accent="safari routes" />
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {journeys.map((p) => <JourneyCard key={p.id} pkg={p} />)}
            </div>
          </div>
        </section>
      )}

      <CtaBand title="Let’s find your leopard." message="Hello Sasoba Travels! I'd like to plan a wildlife safari in Sri Lanka." />
    </>
  );
}
