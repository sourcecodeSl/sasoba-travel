import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { whatsappLink } from '../../data/siteData.js';
import { WhatsAppIcon } from '../ui/BrandIcons.jsx';
import FeatherParticles from '../ui/FeatherParticles.jsx';

/** Closing call-to-action shown at the bottom of inner pages. */
export default function CtaBand({
  title = 'Ready to write your own story?',
  text = 'Tell us what you dream of, and a journey designer will reply within 24 hours with a hand-crafted proposal.',
  message = "Hello Sasoba Travels! I'd like help planning a trip.",
}) {
  return (
    <section className="relative overflow-hidden bg-navy-900 py-20 sm:py-24">
      <FeatherParticles count={10} />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(245_158_11/0.15),transparent_60%)]" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto flex max-w-3xl flex-col items-center px-4 text-center"
      >
        <h2 className="font-display text-4xl leading-tight font-semibold text-balance text-white sm:text-5xl">{title}</h2>
        <p className="mt-4 max-w-xl text-white/70">{text}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/#builder"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold to-sunset px-7 py-4 text-sm font-semibold text-navy-900 shadow-glow transition hover:brightness-110"
          >
            <Sparkles className="h-4 w-4" /> Plan Your Bespoke Trip
          </Link>
          <a
            href={whatsappLink(message)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 py-4 text-sm font-semibold text-white transition hover:brightness-110"
          >
            <WhatsAppIcon className="h-4 w-4" /> Chat on WhatsApp
          </a>
        </div>
      </motion.div>
    </section>
  );
}
