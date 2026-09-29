import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Clock, Mail, Minus, Plus, Sparkles } from 'lucide-react';
import { BUILDER, CONTACT, whatsappLink } from '../../data/siteData.js';
import { useLocale } from '../../context/CurrencyContext.jsx';
import { useTripEstimate } from '../../hooks/useTripEstimate.js';
import { ICONS } from '../ui/icons.js';
import { WhatsAppIcon } from '../ui/BrandIcons.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import Reveal from '../ui/Reveal.jsx';

const STEPS = ['Interests', 'Duration', 'Stay', 'Your Estimate'];

const slide = {
  enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

function OptionCard({ selected, onClick, icon: Icon, title, text, multi }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`relative flex h-full flex-col items-start gap-3 rounded-2xl border p-5 text-left transition ${
        selected
          ? 'border-sun bg-gradient-to-br from-navy-900 to-navy-800 text-white shadow-glow'
          : 'border-navy-900/10 bg-white text-navy-900 hover:border-teal/50'
      }`}
    >
      <span
        className={`absolute top-4 right-4 grid h-6 w-6 place-items-center border transition ${multi ? 'rounded-md' : 'rounded-full'} ${
          selected ? 'border-sun bg-sun text-navy-900' : 'border-navy-900/20'
        }`}
      >
        {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      </span>
      {Icon && (
        <span className={`grid h-12 w-12 place-items-center rounded-xl ${selected ? 'bg-feather text-white' : 'bg-teal/10 text-teal'}`}>
          <Icon className="h-6 w-6" />
        </span>
      )}
      <span className="font-display text-xl font-semibold">{title}</span>
      {text && <span className={`text-sm ${selected ? 'text-white/70' : 'text-navy-800/60'}`}>{text}</span>}
    </motion.button>
  );
}

function Stepper({ label, value, min, onChange }) {
  const btn = 'grid h-9 w-9 place-items-center rounded-full border border-navy-900/15 transition hover:border-teal disabled:opacity-30';
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-white px-4 py-3 ring-1 ring-navy-900/10">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-3">
        <button type="button" aria-label={`Fewer ${label}`} className={btn} disabled={value <= min} onClick={() => onChange(value - 1)}>
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-5 text-center font-semibold">{value}</span>
        <button type="button" aria-label={`More ${label}`} className={btn} disabled={value >= 12} onClick={() => onChange(value + 1)}>
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function TripBuilder() {
  const { formatPrice } = useLocale();
  const [[step, dir], setStep] = useState([0, 1]);
  const [trip, setTrip] = useState({
    interests: [],
    duration: '',
    tier: '',
    adults: 2,
    children: 0,
    name: '',
  });
  const estimate = useTripEstimate(trip);

  const update = (patch) => setTrip((t) => ({ ...t, ...patch }));
  const toggleInterest = (id) =>
    update({ interests: trip.interests.includes(id) ? trip.interests.filter((i) => i !== id) : [...trip.interests, id] });

  const canContinue = [trip.interests.length > 0, Boolean(trip.duration), Boolean(trip.tier), true][step];
  const go = (delta) => setStep(([s]) => [Math.min(Math.max(s + delta, 0), STEPS.length - 1), delta]);

  const labels = {
    interests: BUILDER.interests.filter((i) => trip.interests.includes(i.id)).map((i) => i.label).join(', '),
    duration: BUILDER.durations.find((d) => d.id === trip.duration)?.label,
    tier: BUILDER.tiers.find((t) => t.id === trip.tier)?.label,
  };

  const message = estimate
    ? [
        `Hello Sasoba Travels! ${trip.name ? `I'm ${trip.name} and ` : ''}I'd like a bespoke Sri Lanka itinerary:`,
        `• Interests: ${labels.interests}`,
        `• Duration: ${labels.duration}`,
        `• Accommodation: ${labels.tier}`,
        `• Travellers: ${trip.adults} adult(s), ${trip.children} child(ren)`,
        `• Estimated budget: ${formatPrice(estimate.low)} – ${formatPrice(estimate.high)}`,
      ].join('\n')
    : '';

  return (
    <section id="builder" className="relative overflow-hidden bg-cream py-24 sm:py-32">
      <div aria-hidden className="pointer-events-none absolute -top-20 left-1/4 h-80 w-80 rounded-full bg-sunset/10 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Build Your Own Itinerary"
          title="Design your journey"
          accent="in three steps"
          text="Tell us what moves you. We’ll return a hand-crafted itinerary within 24 hours — no obligation, no templates."
        />

        <Reveal className="mt-14 overflow-hidden rounded-[2rem] bg-porcelain shadow-luxe ring-1 ring-navy-900/5">
          {/* Progress */}
          <div className="border-b border-navy-900/5 bg-white px-6 py-5 sm:px-10">
            <ol className="flex items-center gap-2 sm:gap-4">
              {STEPS.map((label, i) => (
                <li key={label} className="flex flex-1 items-center gap-2 sm:gap-3">
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold transition ${
                      i < step ? 'bg-emerald text-white' : i === step ? 'bg-navy-900 text-sun' : 'bg-navy-900/5 text-navy-900/40'
                    }`}
                  >
                    {i < step ? <Check className="h-4 w-4" /> : i + 1}
                  </span>
                  <span className={`hidden text-sm font-medium md:block ${i === step ? 'text-navy-900' : 'text-navy-900/40'}`}>{label}</span>
                  {i < STEPS.length - 1 && (
                    <span className="relative h-px flex-1 bg-navy-900/10">
                      <motion.span
                        className="bg-feather absolute inset-y-0 left-0"
                        animate={{ width: i < step ? '100%' : '0%' }}
                        transition={{ duration: 0.5 }}
                      />
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>

          <div className="grid lg:grid-cols-[1fr_20rem]">
            <div className="relative min-h-[26rem] overflow-hidden p-6 sm:p-10">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={step}
                  custom={dir}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  {step === 0 && (
                    <>
                      <h3 className="font-display text-3xl font-semibold">What calls to you?</h3>
                      <p className="mt-1 text-sm text-navy-800/60">Choose as many as you like.</p>
                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        {BUILDER.interests.map((i) => (
                          <OptionCard
                            key={i.id}
                            multi
                            icon={ICONS[i.icon]}
                            title={i.label}
                            selected={trip.interests.includes(i.id)}
                            onClick={() => toggleInterest(i.id)}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {step === 1 && (
                    <>
                      <h3 className="font-display text-3xl font-semibold">How long can you escape?</h3>
                      <p className="mt-1 text-sm text-navy-800/60">We recommend at least 10 days for a first visit.</p>
                      <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        {BUILDER.durations.map((d) => (
                          <OptionCard
                            key={d.id}
                            icon={Clock}
                            title={d.label}
                            text={d.id === 'medium' ? 'Most popular' : d.id === 'long' ? 'The grand tour' : 'A taste of Ceylon'}
                            selected={trip.duration === d.id}
                            onClick={() => update({ duration: d.id })}
                          />
                        ))}
                      </div>
                      <div className="mt-8 grid gap-3 sm:grid-cols-2">
                        <Stepper label="Adults" value={trip.adults} min={1} onChange={(v) => update({ adults: v })} />
                        <Stepper label="Children" value={trip.children} min={0} onChange={(v) => update({ children: v })} />
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <h3 className="font-display text-3xl font-semibold">Where would you like to rest?</h3>
                      <p className="mt-1 text-sm text-navy-800/60">Mix and match freely later — this sets the tone.</p>
                      <div className="mt-6 grid gap-4 sm:grid-cols-3">
                        {BUILDER.tiers.map((t) => (
                          <OptionCard
                            key={t.id}
                            icon={ICONS[t.icon]}
                            title={t.label}
                            text={t.text}
                            selected={trip.tier === t.id}
                            onClick={() => update({ tier: t.id })}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  {step === 3 && estimate && (
                    <>
                      <h3 className="font-display text-3xl font-semibold">Your journey, at a glance</h3>
                      <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
                        {[
                          ['Interests', labels.interests],
                          ['Duration', labels.duration],
                          ['Accommodation', labels.tier],
                          ['Travellers', `${trip.adults} adult${trip.adults > 1 ? 's' : ''}${trip.children ? `, ${trip.children} child${trip.children > 1 ? 'ren' : ''}` : ''}`],
                        ].map(([k, v]) => (
                          <div key={k} className="rounded-2xl bg-white p-4 ring-1 ring-navy-900/5">
                            <dt className="text-[11px] font-semibold uppercase tracking-[0.2em] text-teal">{k}</dt>
                            <dd className="mt-1 font-medium">{v}</dd>
                          </div>
                        ))}
                      </dl>
                      <label className="mt-6 block">
                        <span className="text-sm font-medium">Your name (optional)</span>
                        <input
                          value={trip.name}
                          onChange={(e) => update({ name: e.target.value })}
                          placeholder="e.g. Charlotte Whitmore"
                          className="mt-2 w-full rounded-2xl border border-navy-900/10 bg-white px-4 py-3 text-sm focus:border-teal focus:ring-2 focus:ring-teal/20 focus:outline-none"
                        />
                      </label>
                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <a
                          href={whatsappLink(message)}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-2 rounded-full bg-emerald px-6 py-4 text-sm font-semibold text-white shadow-lg transition hover:brightness-110"
                        >
                          <WhatsAppIcon className="h-5 w-5" /> Send via WhatsApp
                        </a>
                        <a
                          href={`mailto:${CONTACT.email}?subject=${encodeURIComponent('Bespoke itinerary request')}&body=${encodeURIComponent(message)}`}
                          className="flex items-center justify-center gap-2 rounded-full bg-navy-900 px-6 py-4 text-sm font-semibold text-white transition hover:bg-navy-800"
                        >
                          <Mail className="h-5 w-5" /> Send via Email
                        </a>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Live estimate panel */}
            <aside className="relative flex flex-col justify-between gap-6 overflow-hidden bg-navy-900 p-6 text-white sm:p-8">
              <div aria-hidden className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-teal/30 blur-3xl" />
              <div className="relative">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-sun">
                  <Sparkles className="h-4 w-4" /> Instant estimate
                </p>
                <AnimatePresence mode="wait">
                  {estimate ? (
                    <motion.div key="est" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                      <p className="mt-4 font-display text-4xl leading-tight font-semibold">
                        {formatPrice(estimate.low)}
                        <span className="block text-2xl text-white/60">to {formatPrice(estimate.high)}</span>
                      </p>
                      <p className="mt-3 text-sm text-white/60">
                        ≈ {formatPrice(estimate.perPerson)} per traveller · {estimate.days} days, private chauffeur-guide included
                      </p>
                    </motion.div>
                  ) : (
                    <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 text-sm text-white/60">
                      Choose your interests, duration and stay style to see an indicative budget for your group.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <p className="relative text-[11px] leading-relaxed text-white/40">
                Estimates exclude international flights and are indicative only. Your final quote is tailored by a journey designer.
              </p>
            </aside>
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-navy-900/5 bg-white px-6 py-4 sm:px-10">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={step === 0}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-navy-900 transition hover:bg-navy-900/5 disabled:invisible"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => go(1)}
                disabled={!canContinue}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-sunset px-6 py-3 text-sm font-semibold text-navy-900 shadow-glow transition disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setStep([0, -1])}
                className="text-sm font-semibold text-teal hover:underline"
              >
                Adjust my choices
              </button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
