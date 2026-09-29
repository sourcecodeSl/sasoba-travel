import { motion } from 'framer-motion';
import Reveal from './Reveal.jsx';

const EASE = [0.22, 1, 0.36, 1];

/** Words rise out of a mask one after another. */
function MaskedWords({ text, className = '', startIndex = 0 }) {
  return text.split(' ').map((word, i) => (
    <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
      <motion.span
        className={`inline-block ${className}`}
        variants={{
          hidden: { y: '110%', rotate: 4 },
          show: { y: '0%', rotate: 0, transition: { duration: 0.9, ease: EASE, delay: (startIndex + i) * 0.07 } },
        }}
      >
        {word}&nbsp;
      </motion.span>
    </span>
  ));
}

export default function SectionHeading({ eyebrow, title, accent, text, dark = false, align = 'center' }) {
  const alignment = align === 'center' ? 'mx-auto text-center items-center' : 'items-start text-left';
  const titleWords = title.split(' ').length;

  return (
    <Reveal className={`flex max-w-3xl flex-col gap-4 ${alignment}`}>
      <span
        className={`inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] ${
          dark ? 'text-sun' : 'text-teal'
        }`}
      >
        <motion.span
          className="h-px bg-current"
          variants={{ hidden: { width: 0 }, show: { width: 32, transition: { duration: 0.8, ease: EASE } } }}
        />
        {eyebrow}
        <motion.span
          className="h-px bg-current"
          variants={{ hidden: { width: 0 }, show: { width: 32, transition: { duration: 0.8, ease: EASE } } }}
        />
      </span>
      <motion.h2
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        className={`font-display text-4xl leading-[1.05] font-semibold text-balance sm:text-5xl lg:text-6xl ${
          dark ? 'text-white' : 'text-navy-900'
        }`}
      >
        <MaskedWords text={title} />
        {accent && <MaskedWords text={accent} startIndex={titleWords} className="text-feather italic" />}
      </motion.h2>
      {text && (
        <p className={`max-w-2xl text-base text-pretty sm:text-lg ${dark ? 'text-white/70' : 'text-navy-800/70'}`}>{text}</p>
      )}
    </Reveal>
  );
}
