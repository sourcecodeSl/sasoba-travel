import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, MapPin, Sparkles } from 'lucide-react';
import { BUILDER, whatsappLink } from '../data/siteData.js';
import { PAGE_IMAGES, STAYS, STAY_PROMISES } from '../data/pagesData.js';
import { useLocale } from '../context/CurrencyContext.jsx';
import PageHero from '../components/layout/PageHero.jsx';
import CtaBand from '../components/layout/CtaBand.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import SmartImage from '../components/ui/SmartImage.jsx';
import TiltCard from '../components/ui/TiltCard.jsx';
import { fadeUp, stagger } from '../components/ui/Reveal.jsx';
import { ICONS } from '../components/ui/icons.js';
import { WhatsAppIcon } from '../components/ui/BrandIcons.jsx';

const TIER_LABEL = Object.fromEntries(BUILDER.tiers.map((t) => [t.id, t.label]));

function StayCard({ s }) {
  const { formatPrice } = useLocale();
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group [perspective:1000px]"
    >
      <TiltCard max={5} className="h-full overflow-hidden rounded-[1.75rem] bg-white shadow-[0_10px_40px_-20px_rgb(10_25_47/0.3)] ring-1 ring-navy-900/5">
        <div className="relative h-60 overflow-hidden">
          <SmartImage src={s.image} alt={s.title} className="h-full w-full transition-transform duration-[1.2s] group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
          <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy-900">{TIER_LABEL[s.tier]}</span>
          <p className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs text-white"><MapPin className="h-3.5 w-3.5 text-sun" /> {s.location}</p>
        </div>
        <div className="p-6">
          <h3 className="font-display text-2xl font-semibold">{s.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-navy-800/65">{s.text}</p>
          <ul className="mt-4 space-y-1.5">
            {s.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-emerald" /> {f}</li>
            ))}
          </ul>
          <div className="mt-5 flex items-end justify-between border-t border-navy-900/5 pt-4">
            <p className="text-xs text-navy-800/50">
              From <span className="font-display text-2xl font-semibold text-navy-900">{formatPrice(s.priceFrom)}</span> / night
            </p>
            <a
              href={whatsappLink(`Hello Sasoba Travels! I'm interested in a "${s.title}" stay in ${s.location}.`)}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-navy-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-teal"
            >
              Enquire
            </a>
          </div>
        </div>
      </TiltCard>
    </motion.article>
  );
}

export default function StaysPage() {
  const [tier, setTier] = useState('all');
  const list = STAYS.filter((s) => tier === 'all' || s.tier === tier);

  return (
    <>
      <PageHero
        image={PAGE_IMAGES.stays}
        eyebrow="Luxury Stays"
        title="Where you sleep"
        accent="is part of the story"
        text="Planters’ bungalows, clifftop villas, safari tents and rainforest lodges — every stay hand-picked and personally inspected by our team."
        crumbs={[{ label: 'Luxury Stays' }]}
      />

      <section className="bg-porcelain py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-fit max-w-full gap-1 overflow-x-auto rounded-full bg-white p-1.5 shadow-[0_10px_40px_-20px_rgb(10_25_47/0.35)] ring-1 ring-navy-900/5 no-scrollbar">
            {[{ id: 'all', label: 'All stays' }, ...BUILDER.tiers].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTier(t.id)}
                aria-pressed={tier === t.id}
                className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-medium whitespace-nowrap ${tier === t.id ? 'text-navy-900' : 'text-navy-800/60 hover:text-navy-900'}`}
              >
                {tier === t.id && <motion.span layoutId="tier" className="absolute inset-0 rounded-full bg-sun" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </div>

          <motion.div layout className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {list.map((s) => <StayCard key={s.title} s={s} />)}
            </AnimatePresence>
          </motion.div>
          <p className="mt-8 text-center text-xs text-navy-800/50">
            Indicative prices for two guests per night. Exact properties are matched to your dates and shared in your personal proposal.
          </p>
        </div>
      </section>

      <section className="bg-navy-900 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading dark eyebrow="Our promise" title="Chosen with" accent="care" />
          <motion.div variants={stagger(0.12)} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-14 grid gap-5 md:grid-cols-3">
            {STAY_PROMISES.map((p) => {
              const Icon = ICONS[p.icon];
              return (
                <motion.div key={p.title} variants={fadeUp} className="glass rounded-3xl p-7 text-white">
                  <span className="bg-feather grid h-12 w-12 place-items-center rounded-2xl"><Icon className="h-6 w-6" /></span>
                  <h3 className="mt-5 font-display text-2xl font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{p.text}</p>
                </motion.div>
              );
            })}
          </motion.div>
          <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/#builder" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold to-sunset px-6 py-3.5 text-sm font-semibold text-navy-900">
              <Sparkles className="h-4 w-4" /> Build a trip around these stays
            </Link>
            <a href={whatsappLink('Hello Sasoba Travels! Can you recommend luxury stays for my trip?')} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3.5 text-sm font-semibold text-white hover:border-sun hover:text-sun">
              <WhatsAppIcon className="h-4 w-4" /> Ask for recommendations
            </a>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
