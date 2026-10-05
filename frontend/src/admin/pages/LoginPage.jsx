import { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../AuthContext.jsx';
import FeatherParticles from '../../components/ui/FeatherParticles.jsx';

const EASE = [0.22, 1, 0.36, 1];

function strength(pw) {
  let s = 0;
  if (pw.length >= 10) s++;
  if (pw.length >= 14) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(4, s);
}
const STRENGTH = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];

function InputRow({ icon: Icon, children }) {
  return (
    <div className="group flex items-center gap-3 rounded-2xl bg-white/[0.06] px-4 ring-1 ring-white/10 transition focus-within:bg-white/[0.1] focus-within:ring-sun/60">
      <Icon className="h-4 w-4 shrink-0 text-white/40 transition group-focus-within:text-sun" />
      {children}
    </div>
  );
}

const field = 'autofill-dark w-full bg-transparent py-3.5 text-sm text-white placeholder:text-white/35 focus:outline-none';

/** Animated peacock mandala that leans toward the cursor. */
function Mandala() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [10, -10]), { stiffness: 80, damping: 15 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-10, 10]), { stiffness: 80, damping: 15 });

  return (
    <div
      className="relative grid place-items-center [perspective:1200px]"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
        my.set(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <motion.div style={{ rotateX: rx, rotateY: ry }} className="relative h-[min(64vw,26rem)] w-[min(64vw,26rem)] [transform-style:preserve-3d]">
        {/* Orbit rings */}
        {[1.25, 1.5].map((s, i) => (
          <motion.div
            key={s}
            aria-hidden
            className="absolute inset-0 rounded-full border border-dashed border-white/10"
            style={{ scale: s }}
            animate={{ rotate: i ? -360 : 360 }}
            transition={{ duration: 60 + i * 30, repeat: Infinity, ease: 'linear' }}
          >
            <span className="bg-feather absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full shadow-[0_0_14px_rgb(251_191_36/0.8)]" />
          </motion.div>
        ))}
        <div aria-hidden className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle,rgb(251_191_36/0.35),transparent_65%)] blur-2xl" />
        {/* Feather ring: unfurls on load, then turns slowly forever */}
        <motion.div className="absolute inset-0" animate={{ rotate: 360 }} transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}>
          <motion.img
            src="/brand/sasoba-feathers.svg"
            alt=""
            aria-hidden
            className="h-full w-full drop-shadow-[0_20px_40px_rgb(0_0_0/0.45)]"
            initial={{ scale: 0.3, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ duration: 1.6, ease: EASE }}
          />
        </motion.div>
        <motion.img
          src="/brand/sasoba-emblem.svg"
          alt="Sasoba Travels"
          className="absolute inset-0 h-full w-full [transform:translateZ(60px)]"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 160, damping: 14 }}
        />
      </motion.div>
    </div>
  );
}

export default function LoginPage({ mode = 'signIn' }) {
  const { signIn, setup, expired } = useAuth();
  const isSetup = mode === 'setup';
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', remember: true });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(expired ? 'Your session expired. Please sign in again.' : '');
  const [shake, setShake] = useState(0);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const pwStrength = strength(form.password);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (isSetup && form.password !== form.confirm) {
      setError('The two passwords don’t match.');
      setShake((s) => s + 1);
      return;
    }
    setBusy(true);
    try {
      if (isSetup) await setup(form.name, form.email, form.password);
      else await signIn(form.email, form.password, form.remember);
    } catch (err) {
      setError(err.message);
      setShake((s) => s + 1);
      setBusy(false);
    }
  };

  return (
    <div className="relative grid min-h-screen overflow-hidden bg-navy-950 text-white lg:grid-cols-[1.15fr_1fr]">
      {/* Ambient background */}
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgb(13_148_136/0.35),transparent_55%),radial-gradient(ellipse_at_80%_90%,rgb(249_115_22/0.18),transparent_50%)]" />
      <motion.div
        aria-hidden
        className="absolute -top-40 -left-40 h-[36rem] w-[36rem] rounded-full bg-emerald/15 blur-3xl"
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <FeatherParticles count={22} />

      {/* Brand side */}
      <section className="relative hidden flex-col justify-between p-12 lg:flex">
        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="font-brand text-xl font-extrabold">
          <span className="bg-gradient-to-br from-[#7DB2FF] to-[#3FD1B5] bg-clip-text text-transparent">S</span>asoba <span className="text-[#6FD6C4]">Travels</span>
          <span className="ml-3 rounded-full bg-white/10 px-2.5 py-1 align-middle font-sans text-[10px] font-semibold tracking-[0.25em] text-sun uppercase">Studio</span>
        </motion.p>
        <Mandala />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8, ease: EASE }}>
          <p className="font-display text-4xl leading-tight font-semibold">
            Every journey, <em className="text-feather">beautifully managed.</em>
          </p>
          <p className="mt-2 max-w-md text-sm text-white/55">Destinations, journeys, stays and guest enquiries in one place.</p>
        </motion.div>
      </section>

      {/* Form side */}
      <section className="relative flex items-center justify-center p-5 sm:p-10">
        <motion.div
          key={shake}
          initial={shake ? { x: 0 } : { opacity: 0, y: 30, scale: 0.97 }}
          animate={shake ? { x: [0, -12, 12, -8, 8, 0] } : { opacity: 1, y: 0, scale: 1 }}
          transition={shake ? { duration: 0.45 } : { duration: 0.9, delay: 0.2, ease: EASE }}
          className="w-full max-w-md rounded-[2rem] bg-white/[0.06] p-7 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7)] ring-1 ring-white/10 backdrop-blur-2xl sm:p-9"
        >
          <img src="/brand/sasoba-mark.svg" alt="" className="mx-auto h-20 w-20 lg:hidden" />
          <p className="mt-4 text-center text-[11px] font-semibold tracking-[0.3em] text-sun uppercase lg:mt-0 lg:text-left">{isSetup ? 'First-time setup' : 'Admin access'}</p>
          <h1 className="mt-2 text-center font-display text-4xl font-semibold lg:text-left">{isSetup ? 'Create your admin account' : 'Welcome back'}</h1>
          <p className="mt-2 text-center text-sm text-white/55 lg:text-left">
            {isSetup ? 'This account will manage the Sasoba Travels website. You can add more details later.' : 'Sign in to manage the Sasoba Travels website.'}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-3" noValidate>
            {isSetup && (
              <InputRow icon={User}>
                <input value={form.name} onChange={set('name')} placeholder="Your name" autoComplete="name" className={field} required />
              </InputRow>
            )}
            <InputRow icon={Mail}>
              <input type="email" value={form.email} onChange={set('email')} placeholder="Email address" autoComplete="username" className={field} required autoFocus />
            </InputRow>
            <InputRow icon={Lock}>
              <input
                type={show ? 'text' : 'password'}
                value={form.password}
                onChange={set('password')}
                placeholder={isSetup ? 'Choose a password (10+ characters)' : 'Password'}
                autoComplete={isSetup ? 'new-password' : 'current-password'}
                className={field}
                required
              />
              <button type="button" onClick={() => setShow((s) => !s)} className="text-white/40 hover:text-white" aria-label={show ? 'Hide password' : 'Show password'}>
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </InputRow>

            {isSetup && (
              <>
                <div className="px-1">
                  <div className="grid grid-cols-4 gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <motion.span
                        key={i}
                        animate={{ opacity: pwStrength >= i ? 1 : 0.15 }}
                        className={`h-1 rounded-full ${pwStrength >= 3 ? 'bg-emerald' : pwStrength >= 2 ? 'bg-sun' : 'bg-sunset'}`}
                      />
                    ))}
                  </div>
                  <p className="mt-1.5 text-[11px] text-white/45">{form.password ? STRENGTH[pwStrength] : 'Use 10+ characters with a mix of letters, numbers and symbols.'}</p>
                </div>
                <InputRow icon={ShieldCheck}>
                  <input type={show ? 'text' : 'password'} value={form.confirm} onChange={set('confirm')} placeholder="Confirm password" autoComplete="new-password" className={field} required />
                </InputRow>
              </>
            )}

            {!isSetup && (
              <label className="flex cursor-pointer items-center gap-2.5 px-1 pt-1 text-sm text-white/65">
                <input type="checkbox" checked={form.remember} onChange={set('remember')} className="h-4 w-4 rounded accent-[#f59e0b]" />
                Keep me signed in for 14 days
              </label>
            )}

            {error && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="rounded-xl bg-sunset/15 px-4 py-2.5 text-sm text-orange-200 ring-1 ring-sunset/30">
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={busy}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-gold to-sunset px-6 py-4 text-sm font-bold text-navy-900 shadow-glow disabled:opacity-70"
            >
              <span aria-hidden className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/45 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              {busy ? <Loader2 className="relative h-4 w-4 animate-spin" /> : null}
              <span className="relative">{busy ? 'Please wait…' : isSetup ? 'Create account & continue' : 'Sign in'}</span>
              {!busy && <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </motion.button>
          </form>

          <p className="mt-8 flex items-center justify-center gap-2 text-[11px] text-white/35">
            <Lock className="h-3 w-3" /> Encrypted session · Protected against repeated guesses
          </p>
        </motion.div>
      </section>
    </div>
  );
}
