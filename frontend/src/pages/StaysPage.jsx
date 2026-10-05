import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { BUILDER, whatsappLink } from '../data/siteData.js';
import { PAGE_IMAGES, STAYS, STAY_PROMISES } from '../data/pagesData.js';
import PageHero from '../components/layout/PageHero.jsx';
import StayCard from '../components/cards/StayCard.jsx';
import CtaBand from '../components/layout/CtaBand.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import { fadeUp, stagger } from '../components/ui/Reveal.jsx';
import { getIcon } from '../components/ui/icons.js';
import { WhatsAppIcon } from '../components/ui/BrandIcons.jsx';

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
        text="Planters’ bungalows, clifftop villas, safari tents and rainforest lodges. Every stay hand-picked and personally inspected by our team."
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
              {list.map((s) => <StayCard key={s.id ?? s.title} s={s} />)}
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
              const Icon = getIcon(p.icon);
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
