import { motion } from 'framer-motion';
import { WHY_US } from '../data/siteData.js';
import { getIcon } from './ui/icons.js';
import SectionHeading from './ui/SectionHeading.jsx';
import { fadeUp, stagger } from './ui/Reveal.jsx';
import TiltCard from './ui/TiltCard.jsx';
import CountUp from './ui/CountUp.jsx';

export default function WhyUs() {
  return (
    <section id="why" className="relative overflow-hidden bg-porcelain py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute -top-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-emerald/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-sun/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why Sasoba Travels"
          title="Royal hospitality,"
          accent="feather by feather"
          text="Like the peacock that crowns our name, every Sasoba journey is layered with colour, care and quiet grandeur, designed for travellers who expect the extraordinary."
        />

        <motion.ul
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {WHY_US.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <motion.li key={item.title} variants={fadeUp} className="[perspective:1000px]">
                <TiltCard className="group h-full overflow-hidden rounded-3xl border border-navy-900/5 bg-white p-7 shadow-[0_10px_40px_-20px_rgb(10_25_47/0.25)] transition-shadow duration-500 hover:shadow-luxe">
                  <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-teal opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative [transform:translateZ(40px)]">
                    <motion.div
                      whileHover={{ rotate: [0, -8, 8, 0] }}
                      transition={{ duration: 0.6 }}
                      className="bg-feather relative grid h-14 w-14 place-items-center rounded-2xl text-white shadow-lg"
                    >
                      <span className="absolute inset-0 rounded-2xl bg-feather opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-80" />
                      <Icon className="relative h-6 w-6" />
                    </motion.div>
                    <h3 className="mt-6 font-display text-2xl leading-tight font-semibold text-navy-900 transition-colors duration-500 group-hover:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-navy-800/70 transition-colors duration-500 group-hover:text-white/75">
                      {item.text}
                    </p>
                    <div className="mt-6 flex items-baseline gap-2 border-t border-navy-900/10 pt-5 transition-colors group-hover:border-white/15">
                      <span className="text-feather font-display text-3xl font-bold">
                        <CountUp value={item.stat} />
                      </span>
                      <span className="text-xs uppercase tracking-widest text-navy-800/50 transition-colors duration-500 group-hover:text-white/60">
                        {item.statLabel}
                      </span>
                    </div>
                  </div>
                </TiltCard>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
