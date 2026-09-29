import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, Compass, MapPin, Minus, Plus, Search, Users } from 'lucide-react';
import { DESTINATIONS, TRAVEL_STYLES } from '../../data/siteData.js';
import { useLocale } from '../../context/CurrencyContext.jsx';
import { useIntroDelay } from '../ui/Preloader.jsx';

const today = () => new Date().toISOString().slice(0, 10);

function Field({ icon: Icon, label, children, className = '' }) {
  return (
    <div className={`relative flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-4 py-3 transition hover:bg-white/5 ${className}`}>
      <Icon className="h-5 w-5 shrink-0 text-sun" />
      <div className="min-w-0 flex-1">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">{label}</span>
        {children}
      </div>
    </div>
  );
}

function useClickOutside(open, onClose) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e) => !ref.current?.contains(e.target) && onClose();
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);
  return ref;
}

function DestinationCombobox({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(open, () => setOpen(false));

  const matches = useMemo(
    () => DESTINATIONS.filter((d) => d.toLowerCase().includes(value.trim().toLowerCase())),
    [value]
  );

  const pick = (d) => {
    onChange(d);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && open && matches[0]) {
            e.preventDefault();
            pick(matches[0]);
          }
          if (e.key === 'Escape') setOpen(false);
        }}
        placeholder="Anywhere in Ceylon"
        aria-label="Destination"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        className="w-full truncate bg-transparent text-sm font-medium text-white placeholder:text-white/60 focus:outline-none"
      />
      <AnimatePresence>
        {open && matches.length > 0 && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="glass-dark no-scrollbar absolute -left-8 top-full z-30 mt-5 max-h-64 w-72 overflow-y-auto rounded-2xl p-1.5 shadow-luxe"
          >
            {matches.map((d) => (
              <li key={d}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(d)}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-white/80 hover:bg-white/10 hover:text-white"
                >
                  <MapPin className="h-3.5 w-3.5 text-emerald" />
                  {d}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function Counter({ label, sub, value, min, onChange }) {
  const btn =
    'grid h-8 w-8 place-items-center rounded-full border border-white/20 text-white transition hover:border-sun disabled:opacity-30';
  return (
    <div className="flex items-center justify-between gap-6 py-2">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-white/50">{sub}</p>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" aria-label={`Fewer ${label.toLowerCase()}`} disabled={value <= min} onClick={() => onChange(value - 1)} className={btn}>
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-4 text-center text-sm font-semibold text-white">{value}</span>
        <button type="button" aria-label={`More ${label.toLowerCase()}`} disabled={value >= 12} onClick={() => onChange(value + 1)} className={btn}>
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function GuestsPicker({ adults, childCount, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(open, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full truncate text-left text-sm font-medium text-white"
      >
        {adults} adult{adults > 1 ? 's' : ''}
        {childCount > 0 && `, ${childCount} child${childCount > 1 ? 'ren' : ''}`}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="glass-dark absolute right-0 top-full z-30 mt-5 w-72 rounded-2xl p-4 shadow-luxe"
          >
            <Counter label="Adults" sub="Age 13+" value={adults} min={1} onChange={(v) => onChange('adults', v)} />
            <Counter label="Children" sub="Age 2–12" value={childCount} min={0} onChange={(v) => onChange('children', v)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SearchWidget({ onSearch }) {
  const { t } = useLocale();
  const INTRO_DELAY = useIntroDelay();
  const [form, setForm] = useState({
    destination: '',
    style: '',
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0,
  });
  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const submit = (e) => {
    e.preventDefault();
    onSearch?.(form);
  };

  const dateInput = 'w-full min-w-0 bg-transparent text-sm font-medium text-white [color-scheme:dark] focus:outline-none';

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: INTRO_DELAY + 0.9, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="glass-dark relative z-20 grid w-full grid-cols-1 gap-1 rounded-3xl p-2 shadow-luxe sm:grid-cols-2 lg:flex lg:items-center lg:rounded-full"
    >
      <Field icon={MapPin} label="Destination">
        <DestinationCombobox value={form.destination} onChange={(v) => set('destination', v)} />
      </Field>
      <span className="hidden h-10 w-px bg-white/10 lg:block" />
      <Field icon={Compass} label="Travel style">
        <select
          value={form.style}
          onChange={(e) => set('style', e.target.value)}
          aria-label="Travel style"
          className="w-full cursor-pointer appearance-none truncate bg-transparent text-sm font-medium text-white focus:outline-none"
        >
          <option value="" className="bg-navy-900">Any style</option>
          {TRAVEL_STYLES.map((s) => (
            <option key={s} value={s} className="bg-navy-900">
              {s}
            </option>
          ))}
        </select>
      </Field>
      <span className="hidden h-10 w-px bg-white/10 lg:block" />
      <Field icon={CalendarDays} label="Dates" className="lg:flex-[1.5]">
        <div className="flex items-center gap-2">
          <input
            type="date"
            aria-label="Arrival date"
            min={today()}
            value={form.checkIn}
            onChange={(e) => {
              const checkIn = e.target.value;
              setForm((f) => ({ ...f, checkIn, checkOut: f.checkOut && f.checkOut <= checkIn ? '' : f.checkOut }));
            }}
            className={dateInput}
          />
          <span className="text-white/40">→</span>
          <input
            type="date"
            aria-label="Departure date"
            min={form.checkIn || today()}
            value={form.checkOut}
            onChange={(e) => set('checkOut', e.target.value)}
            className={dateInput}
          />
        </div>
      </Field>
      <span className="hidden h-10 w-px bg-white/10 lg:block" />
      <Field icon={Users} label="Guests">
        <GuestsPicker adults={form.adults} childCount={form.children} onChange={set} />
      </Field>
      <motion.button
        type="submit"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center justify-center gap-2 rounded-2xl sm:col-span-2 bg-gradient-to-r from-gold to-sunset px-7 py-4 text-sm font-semibold whitespace-nowrap text-navy-900 shadow-glow lg:rounded-full"
      >
        <Search className="h-4 w-4" />
        {t('search.cta')}
      </motion.button>
    </motion.form>
  );
}
