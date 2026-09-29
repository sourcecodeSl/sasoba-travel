import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CalendarDays, Check, Mail, MapPin, X } from 'lucide-react';
import { useLocale } from '../../context/CurrencyContext.jsx';
import { useLockBody } from '../../hooks/useLockBody.js';
import { CONTACT, whatsappLink } from '../../data/siteData.js';
import SmartImage from '../ui/SmartImage.jsx';
import Stars from '../ui/Stars.jsx';
import { TripadvisorBadge, WhatsAppIcon } from '../ui/BrandIcons.jsx';

export default function ItineraryModal({ pkg, onClose }) {
  const { formatPrice } = useLocale();
  const close = useCallback(() => onClose(), [onClose]);
  useLockBody(Boolean(pkg), close);

  const message = pkg
    ? `Hello Sasoba Travels! I'd love to know more about "${pkg.title}" (${pkg.days} days, from ${formatPrice(pkg.priceFrom)} pp).`
    : '';

  return (
    <AnimatePresence>
      {pkg && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-navy-950/70 p-0 backdrop-blur-md sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="itinerary-title"
            initial={{ y: 60, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 220, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-[2rem] bg-porcelain shadow-luxe sm:rounded-[2rem]"
          >
            <div className="relative h-56 shrink-0 sm:h-64">
              <SmartImage src={pkg.image} alt={pkg.title} className="h-full w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
              <button
                type="button"
                onClick={close}
                aria-label="Close itinerary"
                autoFocus
                className="glass absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full text-white transition hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <p className="flex items-center gap-2 text-xs font-medium text-white/75">
                  <MapPin className="h-3.5 w-3.5 text-sun" /> {pkg.route.join(' · ')}
                </p>
                <h3 id="itinerary-title" className="mt-2 font-display text-3xl leading-tight font-semibold text-white sm:text-4xl">
                  {pkg.title}
                </h3>
              </div>
            </div>

            <div className="overflow-y-auto p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-navy-900 px-3 py-1.5 text-xs font-semibold text-white">
                  <CalendarDays className="h-3.5 w-3.5 text-sun" /> {pkg.days} days
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-3 py-1.5 text-xs text-white">
                  <Stars rating={pkg.rating} className="h-3 w-3" /> {pkg.rating.toFixed(1)}
                </span>
                <TripadvisorBadge />
              </div>

              <div className="mt-8 grid gap-10 md:grid-cols-[1.4fr_1fr]">
                <ol className="relative space-y-6 border-l border-dashed border-teal/40 pl-6">
                  {pkg.itinerary.map((stop) => (
                    <li key={stop.day} className="relative">
                      <span className="bg-feather absolute top-1 -left-[31px] h-3 w-3 rounded-full ring-4 ring-porcelain" />
                      <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-teal">Day {stop.day}</p>
                      <h4 className="mt-1 font-display text-xl font-semibold text-navy-900">{stop.title}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-navy-800/70">{stop.text}</p>
                    </li>
                  ))}
                </ol>

                <aside className="h-fit space-y-5 rounded-3xl bg-navy-900 p-6 text-white">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-white/50">Starting from</p>
                    <p className="font-display text-4xl font-semibold">{formatPrice(pkg.priceFrom)}</p>
                    <p className="text-xs text-white/50">per person, twin share · fully customisable</p>
                  </div>
                  <ul className="space-y-2 text-sm text-white/80">
                    {pkg.highlights.map((h) => (
                      <li key={h} className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald" />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="space-y-2 pt-2">
                    <a
                      href={whatsappLink(message)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 rounded-full bg-emerald px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110"
                    >
                      <WhatsAppIcon className="h-4 w-4" /> Enquire on WhatsApp
                    </a>
                    <a
                      href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(`Enquiry: ${pkg.title}`)}&body=${encodeURIComponent(message)}`}
                      className="flex items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-sun hover:text-sun"
                    >
                      <Mail className="h-4 w-4" /> Request by Email
                    </a>
                    <Link
                      to={`/journeys/${pkg.id}`}
                      onClick={close}
                      className="flex items-center justify-center gap-2 pt-2 text-sm font-semibold text-sun hover:underline"
                    >
                      See the full journey page <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </aside>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
