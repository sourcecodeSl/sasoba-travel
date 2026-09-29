import { motion } from 'framer-motion';
import { CalendarDays, Check, MapPin } from 'lucide-react';
import { DESTINATIONS, PERAHERA_IMAGE } from '../data/destinations.js';
import { PACKAGES } from '../data/siteData.js';
import { CULTURE_EXPERIENCES, ETIQUETTE, FESTIVALS, PAGE_IMAGES } from '../data/pagesData.js';
import PageHero from '../components/layout/PageHero.jsx';
import CtaBand from '../components/layout/CtaBand.jsx';
import DestinationCard from '../components/cards/DestinationCard.jsx';
import JourneyCard from '../components/cards/JourneyCard.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import SmartImage from '../components/ui/SmartImage.jsx';
import PhotoCredit from '../components/ui/PhotoCredit.jsx';
import Reveal, { fadeUp, stagger } from '../components/ui/Reveal.jsx';
import { ICONS } from '../components/ui/icons.js';

export default function CulturalPage() {
  const sites = DESTINATIONS.filter((d) => d.categories.includes('Culture')).slice(0, 9);
  const journeys = PACKAGES.filter((p) => p.styles.includes('Cultural'));

  return (
    <>
      <PageHero
        image={PAGE_IMAGES.cultural}
        credit={DESTINATIONS.find((d) => d.slug === 'anuradhapura').credit}
        eyebrow="Cultural Escapes"
        title="2,500 years"
        accent="of living heritage"
        text="Eight UNESCO World Heritage Sites, ancient royal capitals, cave temples and festivals that fill the streets with drums and fire."
        crumbs={[{ label: 'Cultural Escapes' }]}
        tall
      />

      <section className="bg-porcelain py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Heritage" title="Sacred cities &" accent="royal capitals" text="The Cultural Triangle and beyond — each best explored with a historian at your side." />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sites.map((d) => <DestinationCard key={d.slug} d={d} />)}
          </div>
        </div>
      </section>

      {/* Festivals timeline */}
      <section className="relative overflow-hidden bg-navy-950 py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.3fr] lg:px-8">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading dark align="left" eyebrow="Festivals" title="A year of" accent="celebration" text="Time your journey with one of the island’s great festivals." />
            <Reveal className="relative mt-10 overflow-hidden rounded-[2rem]">
              <SmartImage src={PERAHERA_IMAGE.image} alt="Esala Perahera, Kandy" className="aspect-square w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent" />
              <p className="absolute bottom-10 left-5 font-display text-2xl text-white">Esala Perahera, Kandy</p>
              <PhotoCredit credit={PERAHERA_IMAGE.credit} className="absolute right-3 bottom-3" />
            </Reveal>
          </div>
          <ol className="relative space-y-4 border-l border-white/15 pl-8">
            {FESTIVALS.map((f, i) => (
              <motion.li
                key={f.name}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <span className="bg-feather absolute top-6 -left-[39px] h-3.5 w-3.5 rounded-full ring-4 ring-navy-950" />
                <div className="glass rounded-3xl p-6 transition hover:bg-white/10">
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-sun">
                    <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> {f.month}</span>
                    <span className="flex items-center gap-1.5 text-white/60"><MapPin className="h-3.5 w-3.5" /> {f.place}</span>
                  </div>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-white">{f.name}</h3>
                  <p className="mt-1 text-sm text-white/70">{f.text}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-cream py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Hands-on" title="Live the culture," accent="don’t just see it" />
          <motion.div variants={stagger(0.08)} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CULTURE_EXPERIENCES.map((e) => {
              const Icon = ICONS[e.icon];
              return (
                <motion.div key={e.title} variants={fadeUp} whileHover={{ y: -6 }} className="group rounded-3xl bg-white p-7 ring-1 ring-navy-900/5 transition-shadow hover:shadow-luxe">
                  <motion.span whileHover={{ rotate: 12 }} className="bg-feather grid h-12 w-12 place-items-center rounded-2xl text-white"><Icon className="h-6 w-6" /></motion.span>
                  <h3 className="mt-5 font-display text-2xl font-semibold">{e.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-800/65">{e.text}</p>
                </motion.div>
              );
            })}
          </motion.div>

          <Reveal className="mx-auto mt-16 max-w-3xl rounded-[2rem] bg-navy-900 p-8 text-white sm:p-10">
            <h3 className="font-display text-3xl font-semibold">Temple etiquette</h3>
            <p className="mt-2 text-sm text-white/60">A few simple courtesies that locals greatly appreciate.</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {ETIQUETTE.map((t) => (
                <li key={t} className="flex gap-2 text-sm text-white/80"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald" /> {t}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {journeys.length > 0 && (
        <section className="bg-navy-950 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading dark align="left" eyebrow="Cultural journeys" title="Journeys through" accent="history" />
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {journeys.map((p) => <JourneyCard key={p.id} pkg={p} />)}
            </div>
          </div>
        </section>
      )}

      <CtaBand message="Hello Sasoba Travels! I'd like to plan a cultural journey in Sri Lanka." />
    </>
  );
}
