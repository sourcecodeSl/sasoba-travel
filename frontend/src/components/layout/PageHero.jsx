import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import SmartImage from '../ui/SmartImage.jsx';
import PhotoCredit from '../ui/PhotoCredit.jsx';

const EASE = [0.22, 1, 0.36, 1];

/** Cinematic banner used at the top of every inner page. */
export default function PageHero({ image, eyebrow, title, accent, text, crumbs = [], credit, children, tall = false }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className={`relative isolate flex items-end overflow-hidden bg-navy-950 ${tall ? 'min-h-[88svh]' : 'min-h-[68svh]'}`}>
      <motion.div style={{ y }} className="absolute inset-0 -z-20">
        <motion.div
          className="h-full w-full"
          initial={{ scale: 1.18 }}
          animate={{ scale: 1.02 }}
          transition={{ duration: 2.4, ease: EASE }}
        >
          <SmartImage src={image} alt="" eager className="h-full w-full" />
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-navy-950 via-navy-950/55 to-navy-950/35" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_15%_90%,rgb(13_148_136/0.35),transparent_55%)]" />

      <motion.div style={{ opacity: fade }} className="mx-auto w-full max-w-7xl px-4 pt-36 pb-14 sm:px-6 lg:px-8 lg:pb-20">
        <motion.nav
          aria-label="Breadcrumb"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 flex flex-wrap items-center gap-1.5 text-xs font-medium text-white/60"
        >
          <Link to="/" className="transition hover:text-sun">Home</Link>
          {crumbs.map((c) => (
            <span key={c.label} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5" />
              {c.to ? (
                <Link to={c.to} className="transition hover:text-sun">{c.label}</Link>
              ) : (
                <span className="text-white/90">{c.label}</span>
              )}
            </span>
          ))}
        </motion.nav>

        {eyebrow && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mb-4 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-sun"
          >
            <span className="h-px w-8 bg-current" /> {eyebrow}
          </motion.p>
        )}

        <h1 className="max-w-4xl font-display text-5xl leading-[0.98] font-semibold text-balance text-white sm:text-6xl lg:text-7xl">
          <span className="block overflow-hidden pb-[0.08em]">
            <motion.span className="block" initial={{ y: '105%' }} animate={{ y: 0 }} transition={{ duration: 1, delay: 0.2, ease: EASE }}>
              {title}
            </motion.span>
          </span>
          {accent && (
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className="text-feather block italic"
                initial={{ y: '105%' }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.32, ease: EASE }}
              >
                {accent}
              </motion.span>
            </span>
          )}
        </h1>

        {text && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-pretty text-white/75 sm:text-lg"
          >
            {text}
          </motion.p>
        )}
        {children && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.55 }} className="mt-8">
            {children}
          </motion.div>
        )}
      </motion.div>

      {credit && <PhotoCredit credit={credit} className="absolute right-4 bottom-3 sm:right-6" />}
    </section>
  );
}
