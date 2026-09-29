import { useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, MapPin, Pause, Play } from 'lucide-react';
import { HERO_SLIDES } from '../../data/siteData.js';
import { useLocale } from '../../context/CurrencyContext.jsx';
import { useAutoplay } from '../../hooks/useAutoplay.js';
import SmartImage from '../ui/SmartImage.jsx';
import SearchWidget from './SearchWidget.jsx';
import FeatherParticles from '../ui/FeatherParticles.jsx';
import { useIntroDelay } from '../ui/Preloader.jsx';

const SLIDE_MS = 7000;

export default function Hero({ onSearch }) {
  const { t } = useLocale();
  const INTRO_DELAY = useIntroDelay();
  const [paused, setPaused] = useState(false);
  const { index, setIndex } = useAutoplay(HERO_SLIDES.length, SLIDE_MS, paused);
  const slide = HERO_SLIDES[index];

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section id="top" ref={ref} className="relative isolate z-10 flex min-h-[100svh] flex-col bg-navy-950">
      {/* Cinematic slideshow with slow Ken Burns zoom */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: 'easeInOut' }}
          >
            <motion.div
              className="h-full w-full"
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: SLIDE_MS / 1000 + 1.6, ease: 'linear' }}
            >
              <SmartImage src={slide.image} alt={slide.place} eager className="h-full w-full" />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
      </div>

      {/* Legibility gradients */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-navy-950/70 via-navy-950/30 to-navy-950/90" />
      <FeatherParticles count={10} className="-z-10 opacity-60" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_20%_60%,rgb(13_148_136/0.35),transparent_60%)]" />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pt-32 pb-10 sm:px-6 lg:px-8"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: INTRO_DELAY + 0.3, duration: 0.8 }}
          className="mb-6 inline-flex w-fit items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-sun backdrop-blur"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald" />
          {t('hero.eyebrow')}
        </motion.p>

        <h1 className="max-w-4xl font-display text-5xl leading-[0.95] font-semibold text-white sm:text-7xl lg:text-8xl">
          {[t('hero.title1'), t('hero.title2')].map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className={`block ${i === 1 ? 'text-feather italic' : ''}`}
                initial={{ y: '105%', rotate: 3 }}
                animate={{ y: '0%', rotate: 0 }}
                transition={{ delay: INTRO_DELAY + 0.45 + i * 0.15, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: INTRO_DELAY + 0.75, duration: 0.9 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg"
        >
          {t('hero.subtitle')}
        </motion.p>

        <div className="mt-10 lg:mt-14">
          <SearchWidget onSearch={onSearch} />
        </div>
      </motion.div>

      {/* Slide caption + controls */}
      <div className="mx-auto flex w-full max-w-7xl items-end justify-between gap-6 px-4 pb-8 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.place}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 text-white"
          >
            <MapPin className="h-4 w-4 text-sun" />
            <div>
              <p className="text-sm font-semibold">{slide.place}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-white/50">{slide.region}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            {HERO_SLIDES.map((s, i) => (
              <button
                key={s.place}
                type="button"
                aria-label={`Show ${s.place}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className="relative h-1 w-10 overflow-hidden rounded-full bg-white/20"
              >
                {i === index && (
                  <motion.span
                    key={`${index}-${paused}`}
                    className="absolute inset-y-0 left-0 bg-sun"
                    initial={{ width: paused ? '100%' : '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: paused ? 0 : SLIDE_MS / 1000, ease: 'linear' }}
                  />
                )}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/20 text-white transition hover:border-sun hover:text-sun"
          >
            {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <motion.a
        href="#why"
        aria-label="Scroll to content"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.2 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-white/60 hover:text-white md:block"
      >
        <ChevronDown className="h-6 w-6" />
      </motion.a>
    </section>
  );
}
