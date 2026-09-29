import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CalendarDays, Check, Mail, MapPin, X } from 'lucide-react';
import { CONTACT, PACKAGES, findPackage, whatsappLink } from '../data/siteData.js';
import { findDestination } from '../data/destinations.js';
import { useLocale } from '../context/CurrencyContext.jsx';
import PageHero from '../components/layout/PageHero.jsx';
import CtaBand from '../components/layout/CtaBand.jsx';
import DestinationCard from '../components/cards/DestinationCard.jsx';
import JourneyCard from '../components/cards/JourneyCard.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import Reveal from '../components/ui/Reveal.jsx';
import Stars from '../components/ui/Stars.jsx';
import { TripadvisorBadge, WhatsAppIcon } from '../components/ui/BrandIcons.jsx';
import NotFound from './NotFound.jsx';

const INCLUDED = [
  'Private air-conditioned vehicle with SLTDA-licensed chauffeur-guide',
  'Hand-picked accommodation with daily breakfast',
  'All experiences, safaris and entrance fees listed in the itinerary',
  'VIP airport meet-and-greet and transfers',
  '24/7 WhatsApp concierge throughout your trip',
  'Carbon offset for all road travel',
];
const EXCLUDED = ['International flights', 'Visa (ETA)', 'Lunches & dinners unless stated', 'Travel insurance', 'Tips'];

export default function JourneyDetail() {
  const { id } = useParams();
  const { formatPrice } = useLocale();
  const pkg = findPackage(id);
  if (!pkg) return <NotFound />;

  const places = (pkg.destinations || []).map(findDestination).filter(Boolean);
  const others = PACKAGES.filter((p) => p.id !== pkg.id && p.styles.some((s) => pkg.styles.includes(s))).slice(0, 3);
  const message = `Hello Sasoba Travels! I'd love to know more about "${pkg.title}" (${pkg.days} days, from ${formatPrice(pkg.priceFrom)} pp).`;

  return (
    <>
      <PageHero
        image={pkg.image}
        eyebrow={`${pkg.days} days · ${pkg.badge}`}
        title={pkg.title}
        text={pkg.highlights.join(' · ')}
        crumbs={[{ label: 'Curated Journeys', to: '/journeys' }, { label: pkg.title }]}
        tall
      >
        <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
          <span className="flex items-center gap-2"><Stars rating={pkg.rating} /> {pkg.rating.toFixed(1)} · {pkg.reviews} reviews</span>
          <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-sun" /> {pkg.route.join(' → ')}</span>
        </div>
      </PageHero>

      <section className="bg-porcelain py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.6fr_1fr] lg:px-8">
          <div>
            <Reveal>
              <h2 className="font-display text-4xl font-semibold">Day by day</h2>
              <p className="mt-2 text-navy-800/60">A suggested rhythm — every day can be changed to suit you.</p>
            </Reveal>
            <ol className="relative mt-10 space-y-8 border-l-2 border-dashed border-teal/30 pl-8">
              {pkg.itinerary.map((stop, i) => (
                <motion.li
                  key={stop.day}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="relative"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
                    className="bg-feather absolute top-1 -left-[43px] grid h-6 w-6 place-items-center rounded-full ring-4 ring-porcelain"
                  />
                  <div className="rounded-3xl bg-white p-6 ring-1 ring-navy-900/5 transition-shadow hover:shadow-luxe">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-teal">Day {stop.day}</p>
                    <h3 className="mt-1 font-display text-2xl font-semibold">{stop.title}</h3>
                    <p className="mt-2 leading-relaxed text-navy-800/70">{stop.text}</p>
                  </div>
                </motion.li>
              ))}
            </ol>

            <Reveal className="mt-14 grid gap-6 sm:grid-cols-2">
              <div className="rounded-3xl bg-white p-6 ring-1 ring-navy-900/5">
                <h3 className="font-display text-2xl font-semibold">Included</h3>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {INCLUDED.map((x) => (
                    <li key={x} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald" /> {x}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl bg-white p-6 ring-1 ring-navy-900/5">
                <h3 className="font-display text-2xl font-semibold">Not included</h3>
                <ul className="mt-4 space-y-2.5 text-sm text-navy-800/70">
                  {EXCLUDED.map((x) => (
                    <li key={x} className="flex gap-2"><X className="mt-0.5 h-4 w-4 shrink-0 text-sunset" /> {x}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Reveal className="rounded-[2rem] bg-navy-900 p-6 text-white shadow-luxe sm:p-8">
              <p className="text-xs uppercase tracking-widest text-white/50">Starting from</p>
              <p className="font-display text-5xl font-semibold">{formatPrice(pkg.priceFrom)}</p>
              <p className="text-xs text-white/50">per person, twin share · fully customisable</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs"><CalendarDays className="h-3.5 w-3.5 text-sun" /> {pkg.days} days</span>
                <TripadvisorBadge />
              </div>
              <ul className="mt-6 space-y-2.5 border-t border-white/10 pt-6 text-sm text-white/80">
                {pkg.highlights.map((h) => (
                  <li key={h} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald" /> {h}</li>
                ))}
              </ul>
              <div className="mt-6 space-y-2">
                <a href={whatsappLink(message)} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-full bg-emerald px-5 py-3.5 text-sm font-semibold transition hover:brightness-110">
                  <WhatsAppIcon className="h-4 w-4" /> Enquire on WhatsApp
                </a>
                <a
                  href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(`Enquiry: ${pkg.title}`)}&body=${encodeURIComponent(message)}`}
                  className="flex items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3.5 text-sm font-semibold transition hover:border-sun hover:text-sun"
                >
                  <Mail className="h-4 w-4" /> Request by Email
                </a>
              </div>
              <Link to="/journeys" className="mt-4 flex items-center justify-center gap-2 text-sm text-white/60 hover:text-white">
                <ArrowLeft className="h-4 w-4" /> All journeys
              </Link>
            </Reveal>
          </aside>
        </div>
      </section>

      {places.length > 0 && (
        <section className="bg-cream py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading align="left" eyebrow="Where you'll go" title="Destinations on" accent="this journey" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {places.map((d) => <DestinationCard key={d.slug} d={d} size="sm" />)}
            </div>
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="bg-navy-950 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading dark align="left" eyebrow="You may also like" title="Similar" accent="journeys" />
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {others.map((p) => <JourneyCard key={p.id} pkg={p} />)}
            </div>
          </div>
        </section>
      )}

      <CtaBand message={message} />
    </>
  );
}
