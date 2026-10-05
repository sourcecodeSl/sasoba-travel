import { motion } from 'framer-motion';
import { BadgeCheck } from 'lucide-react';
import { CONTACT, WHY_US } from '../data/siteData.js';
import { DESTINATIONS } from '../data/destinations.js';
import { ABOUT_STEPS, ABOUT_STORY, ABOUT_TEAM, ABOUT_VALUES, PAGE_IMAGES } from '../data/pagesData.js';
import PageHero from '../components/layout/PageHero.jsx';
import CtaBand from '../components/layout/CtaBand.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import PeacockLogo from '../components/ui/PeacockLogo.jsx';
import CountUp from '../components/ui/CountUp.jsx';
import Reveal, { fadeUp, stagger } from '../components/ui/Reveal.jsx';
import { getIcon } from '../components/ui/icons.js';

export default function AboutPage() {
  return (
    <>
      <PageHero
        image={PAGE_IMAGES.about}
        credit={DESTINATIONS.find((d) => d.slug === 'sigiriya').credit}
        eyebrow="About Sasoba"
        title="Born in Ceylon,"
        accent="made for the world"
        text="We are a Sri Lankan travel house crafting private, tailor-made journeys for travellers who want to see our island the way we do."
        crumbs={[{ label: 'About Us' }]}
      />

      {/* Story + peacock */}
      <section className="overflow-hidden bg-porcelain py-20 sm:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeading align="left" eyebrow="Our story" title="Why the" accent="peacock?" />
            <Reveal className="mt-6 space-y-4 text-lg leading-relaxed text-navy-800/75">
              {ABOUT_STORY.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </Reveal>
          </div>
          <Reveal className="relative mx-auto grid aspect-square w-full max-w-md place-items-center">
            <motion.div
              aria-hidden
              className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgb(251_191_36/0.25),transparent_65%)]"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <PeacockLogo className="h-full w-full" spin />
          </Reveal>
        </div>
      </section>

      {/* Numbers */}
      <section className="bg-navy-950 py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {WHY_US.map((w) => (
            <Reveal key={w.title} className="text-center">
              <p className="text-feather font-display text-5xl font-bold"><CountUp value={w.stat} /></p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/60">{w.statLabel}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="bg-cream py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="What we believe" title="Our" accent="values" />
          <motion.div variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ABOUT_VALUES.map((v) => {
              const Icon = getIcon(v.icon);
              return (
                <motion.div key={v.title} variants={fadeUp} whileHover={{ y: -6 }} className="rounded-3xl bg-white p-7 ring-1 ring-navy-900/5 transition-shadow hover:shadow-luxe">
                  <span className="bg-feather grid h-12 w-12 place-items-center rounded-2xl text-white"><Icon className="h-6 w-6" /></span>
                  <h3 className="mt-5 font-display text-2xl font-semibold">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-navy-800/65">{v.text}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-porcelain py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="How it works" title="From first message" accent="to first sunrise" />
          <ol className="relative mt-14 grid gap-6 md:grid-cols-4">
            <motion.span
              aria-hidden
              className="bg-feather absolute top-7 right-[12%] left-[12%] hidden h-0.5 origin-left md:block"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            />
            {ABOUT_STEPS.map((s, i) => (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
                className="relative text-center"
              >
                <span className="relative mx-auto grid h-14 w-14 place-items-center rounded-full bg-navy-900 font-display text-2xl text-sun ring-8 ring-porcelain">{i + 1}</span>
                <h3 className="mt-5 font-display text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-navy-800/65">{s.text}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* Team */}
      <section className="bg-navy-900 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading dark eyebrow="Our people" title="The team" accent="behind your journey" />
          <motion.div variants={stagger(0.1)} initial="hidden" whileInView="show" viewport={{ once: true }} className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ABOUT_TEAM.map((t) => {
              const Icon = getIcon(t.icon);
              return (
                <motion.div key={t.role} variants={fadeUp} whileHover={{ y: -6 }} className="glass rounded-3xl p-7 text-white">
                  <Icon className="h-8 w-8 text-sun" />
                  <h3 className="mt-5 font-display text-2xl font-semibold">{t.role}</h3>
                  <p className="mt-2 text-sm text-white/70">{t.text}</p>
                </motion.div>
              );
            })}
          </motion.div>
          <Reveal className="mx-auto mt-14 flex max-w-2xl flex-col items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-6 text-center text-sm text-white/70 sm:flex-row sm:text-left">
            <BadgeCheck className="h-10 w-10 shrink-0 text-emerald" />
            <p>
              Licensed by the Sri Lanka Tourism Development Authority. Visit us at {CONTACT.address} or write to{' '}
              <a href={`mailto:${CONTACT.email}`} className="text-sun hover:underline">{CONTACT.email}</a>.
            </p>
          </Reveal>
        </div>
      </section>

      <CtaBand title="Let’s plan something beautiful." />
    </>
  );
}
