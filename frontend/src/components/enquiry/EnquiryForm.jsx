import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Loader2, Mail, Send } from 'lucide-react';
import { CONTACT, whatsappLink } from '../../data/siteData.js';
import { sendEnquiry } from '../../data/content.js';
import { WhatsAppIcon } from '../ui/BrandIcons.jsx';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Field({ label, required, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-semibold tracking-wide text-navy-800/70">
        {label} {required && <span className="text-sunset">*</span>}
      </span>
      {children}
    </label>
  );
}

const input =
  'mt-1.5 w-full rounded-xl border border-navy-900/10 bg-white px-4 py-3 text-sm text-navy-900 transition placeholder:text-navy-800/35 focus:border-teal focus:ring-2 focus:ring-teal/20 focus:outline-none';

/**
 * "Plan your trip" form. Saves to the admin inbox and offers WhatsApp/email as alternatives.
 *   trip    — structured details shown to the team (interests, budget…)
 *   source  — where the enquiry came from, e.g. "Trip builder" or a journey title
 */
export default function EnquiryForm({ trip = null, source = 'Website', whatsappMessage, defaultMessage = '', compact = false }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    travelDate: '',
    travellers: trip?.travellers || '',
    message: defaultMessage,
    website: '', // honeypot
  });
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return (setError('Please tell us your name.'), setStatus('error'));
    if (!EMAIL_RE.test(form.email)) return (setError('Please enter a valid email so we can reply.'), setStatus('error'));
    setStatus('sending');
    setError('');
    try {
      await sendEnquiry({ ...form, trip, source });
      setStatus('done');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  const waText = whatsappMessage || `Hello Sasoba Travels! ${form.message || "I'd like help planning a trip."}`;

  return (
    <AnimatePresence mode="wait">
      {status === 'done' ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center rounded-3xl bg-white p-8 text-center ring-1 ring-navy-900/5"
        >
          <motion.span
            initial={{ scale: 0, rotate: -120 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.1 }}
            className="bg-feather grid h-16 w-16 place-items-center rounded-full text-white shadow-glow"
          >
            <Check className="h-8 w-8" strokeWidth={3} />
          </motion.span>
          <h4 className="mt-5 font-display text-3xl font-semibold text-navy-900">Thank you, {form.name.split(' ')[0]}!</h4>
          <p className="mt-2 max-w-sm text-sm text-navy-800/65">
            Your request is with our journey designers. We’ll reply to <strong>{form.email}</strong> within 24 hours.
          </p>
          <a
            href={whatsappLink(waText)}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald hover:underline"
          >
            <WhatsAppIcon className="h-4 w-4" /> Need us sooner? Message us on WhatsApp
          </a>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className={`grid gap-4 ${compact ? '' : 'sm:grid-cols-2'}`}>
            <Field label="Your name" required>
              <input value={form.name} onChange={set('name')} autoComplete="name" placeholder="e.g. Charlotte Whitmore" className={input} />
            </Field>
            <Field label="Email" required>
              <input type="email" value={form.email} onChange={set('email')} autoComplete="email" placeholder="you@example.com" className={input} />
            </Field>
            <Field label="Phone / WhatsApp">
              <input type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" placeholder="+44 7700 900000" className={input} />
            </Field>
            <Field label="Country">
              <input value={form.country} onChange={set('country')} autoComplete="country-name" placeholder="United Kingdom" className={input} />
            </Field>
            <Field label="When would you like to travel?">
              <input value={form.travelDate} onChange={set('travelDate')} placeholder="e.g. Feb 2027, about 2 weeks" className={input} />
            </Field>
            <Field label="Travellers">
              <input value={form.travellers} onChange={set('travellers')} placeholder="2 adults" className={input} />
            </Field>
          </div>
          <Field label="Anything else we should know?">
            <textarea
              value={form.message}
              onChange={set('message')}
              rows={compact ? 3 : 4}
              placeholder="Celebrations, dietary needs, must-see places…"
              className={`${input} resize-y`}
            />
          </Field>
          {/* Honeypot: hidden from people, irresistible to bots */}
          <input type="text" name="website" value={form.website} onChange={set('website')} tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

          <AnimatePresence>
            {status === 'error' && (
              <motion.p initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-xl bg-sunset/10 px-4 py-2.5 text-sm text-sunset">
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={status === 'sending'}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold to-sunset px-6 py-4 text-sm font-semibold text-navy-900 shadow-glow disabled:opacity-70"
          >
            {status === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {status === 'sending' ? 'Sending…' : 'Send my request'}
          </motion.button>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-navy-800/55">
            <span>Prefer to chat?</span>
            <a href={whatsappLink(waText)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-emerald hover:underline">
              <WhatsAppIcon className="h-3.5 w-3.5" /> WhatsApp
            </a>
            <a
              href={`mailto:${CONTACT.email}?subject=${encodeURIComponent('Trip enquiry')}&body=${encodeURIComponent(waText)}`}
              className="inline-flex items-center gap-1.5 font-semibold text-navy-900 hover:underline"
            >
              <Mail className="h-3.5 w-3.5" /> Email
            </a>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
