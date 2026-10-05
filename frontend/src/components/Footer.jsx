import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUp, BadgeCheck, Download, Lock, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { CONTACT, FOOTER_LINKS, whatsappLink } from '../data/siteData.js';
import FooterHorizon from './FooterHorizon.jsx';
import PeacockLogo, { Wordmark as BrandWordmark } from './ui/PeacockLogo.jsx';
import FeatherParticles from './ui/FeatherParticles.jsx';
import { FacebookIcon, InstagramIcon, TripadvisorBadge, WhatsAppIcon, YouTubeIcon } from './ui/BrandIcons.jsx';

const EASE = [0.22, 1, 0.36, 1];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const container = (stagger = 0.08, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};
const inView = { initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '-40px' } };

function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | error | done

  const submit = (e) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) return setStatus('error');
    // TODO: POST to the backend / mailing-list provider here.
    setStatus('done');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1, ease: EASE }}
      className="relative overflow-hidden rounded-[2rem] p-[1.5px]"
    >
      {/* Rotating feather-gradient border */}
      <motion.div
        aria-hidden
        className="absolute top-1/2 left-1/2 aspect-square w-[160%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,#0d9488,#10b981,#fbbf24,#f97316,transparent_60%,#0d9488)]"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      <div className="relative overflow-hidden rounded-[calc(2rem-1.5px)] bg-gradient-to-br from-navy-800 via-navy-900 to-navy-950 p-8 sm:p-12">
        <motion.div
          aria-hidden
          className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-sun/20 blur-3xl"
          animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-teal/25 blur-3xl"
          animate={{ scale: [1.2, 1, 1.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative grid items-center gap-8 lg:grid-cols-2">
          <motion.div variants={container(0.12, 0.3)} {...inView}>
            <motion.p variants={item} className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-sun">
              <motion.span
                className="grid h-8 w-8 place-items-center rounded-full bg-sun/15"
                animate={{ y: [0, -4, 0], rotate: [0, -8, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Mail className="h-4 w-4" />
              </motion.span>
              Free Travel Guide
            </motion.p>
            <motion.h3 variants={item} className="mt-4 font-display text-3xl leading-tight font-semibold text-balance text-white sm:text-4xl">
              The Insider’s Guide to Ceylon, <em className="text-feather">yours free</em>
            </motion.h3>
            <motion.p variants={item} className="mt-3 text-sm text-white/65">
              48 pages of hidden beaches, seasonal wildlife calendars and secret tables. Join our letter for instant access.
            </motion.p>
          </motion.div>

          <AnimatePresence mode="wait">
            {status === 'done' ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18 }}
                className="flex flex-col items-start gap-4 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10"
              >
                <p className="flex items-center gap-2 font-semibold text-white">
                  <motion.span
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 12, delay: 0.15 }}
                  >
                    <BadgeCheck className="h-6 w-6 text-emerald" />
                  </motion.span>
                  Welcome to the Sasoba circle!
                </p>
                <a
                  href="/guides/sasoba-ceylon-guide.pdf"
                  download
                  className="inline-flex items-center gap-2 rounded-full bg-sun px-5 py-3 text-sm font-semibold text-navy-900 transition hover:bg-gold"
                >
                  <Download className="h-4 w-4 animate-bounce" /> Download your guide (PDF)
                </a>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={submit}
                noValidate
                className="w-full"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
              >
                <motion.div
                  animate={status === 'error' ? { x: [0, -10, 10, -6, 6, 0] } : { x: 0 }}
                  transition={{ duration: 0.45 }}
                  className="flex flex-col gap-3 rounded-2xl bg-white/5 p-2 ring-1 ring-white/15 transition focus-within:bg-white/10 focus-within:ring-sun sm:flex-row sm:rounded-full"
                >
                  <label className="flex flex-1 items-center gap-3 px-4">
                    <Mail className="h-5 w-5 shrink-0 text-white/50" />
                    <span className="sr-only">Email address</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === 'error') setStatus('idle');
                      }}
                      placeholder="your@email.com"
                      aria-invalid={status === 'error'}
                      className="w-full bg-transparent py-3 text-sm text-white placeholder:text-white/40 focus:outline-none"
                    />
                  </label>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-gold to-sunset px-6 py-3 text-sm font-semibold text-navy-900"
                  >
                    <span
                      aria-hidden
                      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                    />
                    <span className="relative">Get the Guide</span>
                    <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </motion.button>
                </motion.div>
                <p className={`mt-3 px-4 text-xs ${status === 'error' ? 'text-sunset' : 'text-white/40'}`}>
                  {status === 'error' ? 'Please enter a valid email address.' : 'No spam, just one beautiful letter a month. Unsubscribe anytime.'}
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

function FooterLink({ children, to = '/' }) {
  return (
    <Link to={to} className="group inline-flex items-center gap-1.5 text-sm text-white/60 transition-colors hover:text-white">
      <span className="bg-feather h-px w-0 transition-all duration-300 group-hover:w-4" />
      <span className="relative">
        {children}
        <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-sun/60 transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100" />
      </span>
    </Link>
  );
}

function TrustSeal({ icon: Icon, title, sub }) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-sun/40 hover:bg-white/[0.06]"
    >
      <span
        aria-hidden
        className="absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/15 to-transparent transition-all duration-700 group-hover:left-[150%]"
      />
      <motion.span
        className="bg-feather grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white"
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.8 }}
      >
        <Icon className="h-5 w-5" />
      </motion.span>
      <div className="leading-tight">
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-[11px] text-white/50">{sub}</p>
      </div>
    </motion.div>
  );
}

function Wordmark({ progress }) {
  const y = useTransform(progress, [0, 1], ['40%', '0%']);
  const letters = 'SASOBA'.split('');
  return (
    <motion.div style={{ y }} aria-hidden className="pointer-events-none mt-16 flex justify-center overflow-hidden select-none">
      {letters.map((l, i) => (
        <motion.span
          key={i}
          initial={{ y: '100%', opacity: 0 }}
          whileInView={{ y: '0%', opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 1, ease: EASE }}
          className="inline-block bg-gradient-to-b from-white/[0.14] to-white/0 bg-clip-text font-display text-[22vw] leading-[0.8] font-bold text-transparent lg:text-[16rem]"
        >
          {l}
        </motion.span>
      ))}
    </motion.div>
  );
}

function BackToTop() {
  const { scrollYProgress } = useScroll();
  const path = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });
  return (
    <motion.a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      aria-label="Back to top"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.92 }}
      className="group relative grid h-12 w-12 place-items-center rounded-full text-white"
    >
      <svg viewBox="0 0 48 48" className="absolute inset-0 -rotate-90">
        <circle cx="24" cy="24" r="22" fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth="2" />
        <motion.circle cx="24" cy="24" r="22" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" style={{ pathLength: path }} />
      </svg>
      <ArrowUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:text-sun" />
    </motion.a>
  );
}

export default function Footer() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });

  const socials = [
    { Icon: InstagramIcon, label: 'Instagram', href: CONTACT.instagram },
    { Icon: FacebookIcon, label: 'Facebook', href: CONTACT.facebook },
    { Icon: YouTubeIcon, label: 'YouTube', href: CONTACT.youtube },
  ].filter((s) => s.href);

  return (
    <>
    <FooterHorizon />
    <footer ref={ref} className="relative overflow-hidden bg-navy-950 pt-12 pb-10 text-white">
      {/* Ambient layers */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgb(13_148_136/0.18),transparent_55%)] [mask-image:linear-gradient(to_bottom,transparent,black_18rem)]" />
      <FeatherParticles count={16} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Newsletter />

        <div className="mt-20 grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <motion.div variants={container(0.1)} {...inView}>
            <motion.div variants={item}>
            <Link to="/" className="group flex w-fit items-center gap-3">
              <motion.span
                initial={{ rotate: -180, scale: 0 }}
                whileInView={{ rotate: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 120, damping: 14 }}
                whileHover={{ scale: 1.06 }}
              >
                <PeacockLogo className="h-20 w-20" spin />
              </motion.span>
              <BrandWordmark size="lg" />
            </Link>
            </motion.div>
            <motion.p variants={item} className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              Bespoke, eco-luxury journeys across Sri Lanka and beyond, crafted with the colour, grace and royal hospitality of the peacock.
            </motion.p>
            <motion.ul variants={container(0.08)} className="mt-6 space-y-3 text-sm text-white/70">
              <motion.li variants={item} className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-sun" /> {CONTACT.address}
              </motion.li>
              <motion.li variants={item}>
                <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} className="group flex items-center gap-3 hover:text-sun">
                  <Phone className="h-4 w-4 text-sun transition-transform group-hover:rotate-12" /> {CONTACT.phone}
                </a>
              </motion.li>
              <motion.li variants={item}>
                <a href={`mailto:${CONTACT.email}`} className="group flex items-center gap-3 hover:text-sun">
                  <Mail className="h-4 w-4 text-sun transition-transform group-hover:-translate-y-0.5" /> {CONTACT.email}
                </a>
              </motion.li>
            </motion.ul>
            <motion.a
              variants={item}
              href={whatsappLink('Hello Sasoba Travels!')}
              target="_blank"
              rel="noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="relative mt-7 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgb(37_211_102/0.7)]"
            >
              <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/30 [animation-duration:2.5s]" />
              <WhatsAppIcon className="relative h-4 w-4" />
              <span className="relative">Chat with our Concierge</span>
            </motion.a>
          </motion.div>

          <motion.div variants={container(0.15, 0.15)} {...inView} className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
              <motion.div key={heading} variants={container(0.06)}>
                <motion.h4 variants={item} className="text-xs font-semibold uppercase tracking-[0.25em] text-sun">
                  {heading}
                </motion.h4>
                <motion.span
                  variants={{ hidden: { width: 0 }, show: { width: 28, transition: { duration: 0.8, ease: EASE } } }}
                  className="bg-feather mt-3 block h-px"
                />
                <ul className="mt-5 space-y-3">
                  {links.map((l) => (
                    <motion.li key={l.label} variants={item}>
                      <FooterLink to={l.to}>{l.label}</FooterLink>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div variants={container(0.1)} {...inView} className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <TrustSeal icon={BadgeCheck} title="SLTDA Verified" sub="Licensed by Sri Lanka Tourism" />
          <TrustSeal icon={ShieldCheck} title="Safe & Secure" sub="Certified safe-travel partner" />
          <TrustSeal icon={Lock} title="Secure Payments" sub="256-bit SSL encrypted" />
          <motion.div
            variants={item}
            whileHover={{ y: -6 }}
            className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-emerald/40"
          >
            <TripadvisorBadge />
          </motion.div>
        </motion.div>

        <Wordmark progress={scrollYProgress} />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative -mt-4 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row"
        >
          <p>© {new Date().getFullYear()} Sasoba Travels (Pvt) Ltd. All rights reserved.</p>
          <motion.div variants={container(0.1)} {...inView} className="flex items-center gap-2">
            {socials.map(({ Icon, label, href }) => (
              <motion.a
                key={label}
                variants={{ hidden: { scale: 0, rotate: -90 }, show: { scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 260, damping: 16 } } }}
                whileHover={{ y: -4, scale: 1.1 }}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/60 transition-colors hover:border-sun hover:bg-sun hover:text-navy-900"
              >
                <Icon className="h-4 w-4" />
              </motion.a>
            ))}
          </motion.div>
          <div className="flex items-center gap-5">
            <FooterLink to="/about">Privacy</FooterLink>
            <FooterLink to="/about">Terms</FooterLink>
            <BackToTop />
          </div>
        </motion.div>
      </div>
    </footer>
    </>
  );
}
