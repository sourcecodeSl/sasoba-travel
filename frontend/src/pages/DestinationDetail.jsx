import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Award, Check, Clock, Info, MapPin, Moon, Send } from 'lucide-react';
import { DESTINATIONS, findDestination } from '../data/destinations.js';
import { PACKAGES, whatsappLink } from '../data/siteData.js';
import { PARK_SPECIES } from '../data/pagesData.js';
import PageHero from '../components/layout/PageHero.jsx';
import CtaBand from '../components/layout/CtaBand.jsx';
import DestinationCard from '../components/cards/DestinationCard.jsx';
import JourneyCard from '../components/cards/JourneyCard.jsx';
import MonthBar from '../components/cards/MonthBar.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import Reveal, { fadeUp, stagger } from '../components/ui/Reveal.jsx';
import { WhatsAppIcon } from '../components/ui/BrandIcons.jsx';
import EnquiryModal from '../components/enquiry/EnquiryModal.jsx';
import NotFound from './NotFound.jsx';

export default function DestinationDetail() {
  const { slug } = useParams();
  const [enquire, setEnquire] = useState(false);
  const d = findDestination(slug);
  if (!d) return <NotFound />;

  const journeys = PACKAGES.filter((p) => p.destinations?.includes(d.slug));
  const nearby = DESTINATIONS.filter((x) => x.region === d.region && x.slug !== d.slug).slice(0, 3);
  const species = PARK_SPECIES[d.slug];

  const facts = [
    { icon: MapPin, label: 'Region', value: d.region },
    { icon: Clock, label: 'From Colombo', value: d.fromColombo },
    { icon: Moon, label: 'Ideal stay', value: d.idealStay },
  ];

  return (
    <>
      <PageHero
        image={d.image}
        credit={d.credit}
        eyebrow={d.region}
        title={d.name}
        accent={d.tagline}
        crumbs={[{ label: 'Destinations', to: '/destinations' }, { label: d.name }]}
        tall
      >
        <div className="flex flex-wrap gap-2">
          {d.unesco && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sun px-3 py-1.5 text-xs font-semibold text-navy-900">
              <Award className="h-3.5 w-3.5" /> UNESCO World Heritage
            </span>
          )}
          {d.categories.map((c) => (
            <span key={c} className="glass rounded-full px-3 py-1.5 text-xs font-medium text-white">{c}</span>
          ))}
        </div>
      </PageHero>

      <section className="bg-porcelain py-16 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.6fr_1fr] lg:px-8">
          <div>
            <Reveal>
              <p className="font-display text-2xl leading-relaxed text-navy-900 sm:text-3xl">{d.intro || d.tagline}</p>
            </Reveal>

            {d.highlights.length > 0 && (
            <Reveal className="mt-12">
              <h2 className="font-display text-3xl font-semibold">Highlights</h2>
              <motion.ul variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-6 grid gap-3 sm:grid-cols-2">
                {d.highlights.map((h) => (
                  <motion.li key={h} variants={fadeUp} className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-navy-900/5">
                    <span className="bg-feather mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-white">
                      <Check className="h-3.5 w-3.5" strokeWidth={3} />
                    </span>
                    <span className="text-sm font-medium">{h}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </Reveal>
            )}

            {species && (
              <Reveal className="mt-12">
                <h2 className="font-display text-3xl font-semibold">What you might see</h2>
                <div className="mt-5 flex flex-wrap gap-2">
                  {species.map((s) => (
                    <span key={s} className="rounded-full bg-emerald/10 px-4 py-2 text-sm font-medium text-emerald">{s}</span>
                  ))}
                </div>
              </Reveal>
            )}

            {d.experiences.length > 0 && (
            <div className="mt-12">
              <Reveal>
                <h2 className="font-display text-3xl font-semibold">Sasoba experiences</h2>
                <p className="mt-2 text-navy-800/60">Our favourite ways to experience {d.name}, arranged privately for you.</p>
              </Reveal>
              <motion.div variants={stagger(0.12)} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-6 grid gap-4 md:grid-cols-3">
                {d.experiences.map((e, i) => (
                  <motion.div
                    key={e.title}
                    variants={fadeUp}
                    whileHover={{ y: -6 }}
                    className="rounded-3xl bg-navy-900 p-6 text-white shadow-luxe"
                  >
                    <span className="font-display text-4xl text-sun/80">0{i + 1}</span>
                    <h3 className="mt-3 font-display text-xl font-semibold">{e.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">{e.text}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
            )}
          </div>

          {/* Sticky facts panel */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Reveal className="rounded-[2rem] bg-white p-6 shadow-luxe ring-1 ring-navy-900/5 sm:p-8">
              <h2 className="font-display text-2xl font-semibold">Plan your visit</h2>
              <dl className="mt-6 space-y-4">
                {facts.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal/10 text-teal">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-navy-800/50">{label}</dt>
                      <dd className="font-medium">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
              <div className="mt-6 border-t border-navy-900/5 pt-6">
                <MonthBar months={d.bestMonths} />
              </div>
              {d.note && (
                <p className="mt-4 flex gap-2 rounded-2xl bg-sun/10 p-3 text-xs text-navy-800">
                  <Info className="h-4 w-4 shrink-0 text-gold" /> {d.note}
                </p>
              )}
              <button
                type="button"
                onClick={() => setEnquire(true)}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold to-sunset px-5 py-3.5 text-sm font-semibold text-navy-900 shadow-glow transition hover:brightness-110"
              >
                <Send className="h-4 w-4" /> Plan a trip here
              </button>
              <a
                href={whatsappLink(`Hello Sasoba Travels! I'd love to include ${d.name} in my Sri Lanka trip.`)}
                target="_blank"
                rel="noreferrer"
                className="mt-2 flex items-center justify-center gap-2 rounded-full bg-emerald px-5 py-3.5 text-sm font-semibold text-white transition hover:brightness-110"
              >
                <WhatsAppIcon className="h-4 w-4" /> Add {d.name.split(' (')[0]} to my trip
              </a>
              <Link to="/destinations" className="mt-3 flex items-center justify-center gap-2 text-sm font-medium text-navy-800/60 hover:text-navy-900">
                <ArrowLeft className="h-4 w-4" /> All destinations
              </Link>
            </Reveal>
          </aside>
        </div>
      </section>

      {journeys.length > 0 && (
        <section className="bg-navy-950 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading dark align="left" eyebrow="Journeys" title={`Journeys featuring`} accent={d.name.split(' (')[0]} />
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {journeys.map((p) => (
                <JourneyCard key={p.id} pkg={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {nearby.length > 0 && (
        <section className="bg-cream py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading align="left" eyebrow={d.region} title="Also in the" accent={d.region} />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {nearby.map((x) => (
                <DestinationCard key={x.slug} d={x} size="sm" />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand message={`Hello Sasoba Travels! I'm interested in visiting ${d.name}.`} />
      <EnquiryModal
        open={enquire}
        onClose={() => setEnquire(false)}
        title={`Visit ${d.name}`}
        subtitle={d.tagline}
        source={`Destination: ${d.name}`}
        whatsappMessage={`Hello Sasoba Travels! I'd love to include ${d.name} in my Sri Lanka trip.`}
        trip={{ destination: d.name, region: d.region }}
      />
    </>
  );
}
