import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, X } from 'lucide-react';
import { TESTIMONIALS } from '../../data/siteData.js';
import { useAutoplay } from '../../hooks/useAutoplay.js';
import { useLockBody } from '../../hooks/useLockBody.js';
import SmartImage from '../ui/SmartImage.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import TestimonialCard from '../cards/TestimonialCard.jsx';

function StoryModal({ story, onClose }) {
  useLockBody(Boolean(story), onClose);
  return (
    <AnimatePresence>
      {story && (
        <motion.div
          className="fixed inset-0 z-[70] grid place-items-center bg-navy-950/85 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Story from ${story.name}`}
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-3xl bg-black shadow-luxe"
          >
            {story.video ? (
              <video src={story.video} poster={story.image} controls autoPlay className="h-full w-full object-cover" />
            ) : (
              <>
                <SmartImage src={story.image} alt="" className="h-full w-full" />
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent p-6 sm:p-10">
                  <Quote className="h-8 w-8 text-sun" />
                  <p className="mt-3 font-display text-2xl leading-snug text-white sm:text-3xl">“{story.quote}”</p>
                  <p className="mt-4 text-sm text-white/70">
                    {story.flag} {story.name} · {story.trip}
                  </p>
                </div>
              </>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close story"
              autoFocus
              className="glass absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Testimonials() {
  const [hovered, setHovered] = useState(false);
  const [story, setStory] = useState(null);
  const { index, setIndex, next, prev } = useAutoplay(TESTIMONIALS.length, 6500, hovered || Boolean(story));
  const closeStory = useCallback(() => setStory(null), []);

  // Show the active card plus its neighbours for a layered carousel.
  const offsetOf = (i) => {
    const n = TESTIMONIALS.length;
    let o = (i - index + n) % n;
    if (o > n / 2) o -= n;
    return o;
  };

  return (
    <section id="stories" className="relative overflow-hidden bg-navy-900 py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgb(16_185_129/0.18),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          dark
          eyebrow="Traveller Stories"
          title="Told by those who"
          accent="flew with us"
          text="From London to Melbourne, hear why travellers return to Sasoba again and again."
        />

        <div
          className="relative mt-16 h-[30rem] sm:h-[32rem]"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {TESTIMONIALS.map((t, i) => {
            const o = offsetOf(i);
            const visible = Math.abs(o) <= 1;
            return (
              <motion.article
                key={t.id ?? t.name}
                aria-hidden={o !== 0}
                animate={{
                  x: `${o * 72}%`,
                  scale: o === 0 ? 1 : 0.84,
                  opacity: visible ? (o === 0 ? 1 : 0.4) : 0,
                  zIndex: o === 0 ? 3 : visible ? 2 : 1,
                  filter: o === 0 ? 'blur(0px)' : 'blur(2px)',
                }}
                transition={{ type: 'spring', stiffness: 160, damping: 24 }}
                className="absolute inset-y-0 left-1/2 -ml-[min(45%,15rem)] w-[min(90%,30rem)] sm:-ml-[min(38%,15rem)] sm:w-[min(76%,30rem)]"
                style={{ pointerEvents: visible ? 'auto' : 'none' }}
                onClick={() => o !== 0 && setIndex(i)}
              >
                <TestimonialCard t={t} onPlay={setStory} focusable={o === 0} />
              </motion.article>
            );
          })}
        </div>

        <div className="mt-10 flex items-center justify-center gap-6">
          <button type="button" onClick={prev} aria-label="Previous story" className="grid h-12 w-12 place-items-center rounded-full border border-white/20 text-white transition hover:border-sun hover:text-sun">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.name}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show story ${i + 1}`}
                className={`h-2 rounded-full transition-all ${i === index ? 'w-8 bg-sun' : 'w-2 bg-white/30 hover:bg-white/60'}`}
              />
            ))}
          </div>
          <button type="button" onClick={next} aria-label="Next story" className="grid h-12 w-12 place-items-center rounded-full border border-white/20 text-white transition hover:border-sun hover:text-sun">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <StoryModal story={story} onClose={closeStory} />
    </section>
  );
}
