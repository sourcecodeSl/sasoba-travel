import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Globe, Menu, Sparkles, Wallet, X } from 'lucide-react';
import { NAV_LINKS } from '../data/siteData.js';
import { useLocale } from '../context/CurrencyContext.jsx';
import { useScrolled } from '../hooks/useScrolled.js';
import { useLockBody } from '../hooks/useLockBody.js';
import PeacockLogo, { Wordmark } from './ui/PeacockLogo.jsx';
import Dropdown from './ui/Dropdown.jsx';
import MagneticButton from './ui/MagneticButton.jsx';
import { INTRO_DELAY } from './ui/Preloader.jsx';

export default function Navbar() {
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Close the mobile menu whenever the page changes.
  useEffect(() => setMenuOpen(false), [pathname]);
  const { t, currency, setCurrency, currencies, language, setLanguage, languages } = useLocale();
  useLockBody(menuOpen, () => setMenuOpen(false));

  const currencyOptions = Object.entries(currencies).map(([code, c]) => ({
    value: code,
    label: `${c.symbol}  ${code}`,
    short: code,
  }));
  const languageOptions = languages.map((l) => ({ value: l.code, label: l.label, short: l.code.toUpperCase() }));

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: INTRO_DELAY + 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5"
    >
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full px-4 py-2.5 transition-all duration-500 sm:px-6 ${
          scrolled ? 'glass-dark shadow-luxe' : 'glass'
        }`}
      >
        <Link to="/" className="group flex shrink-0 items-center gap-2.5" aria-label="Sasoba Travels home">
          <PeacockLogo className="-my-2 h-14 w-14 drop-shadow-[0_4px_12px_rgb(0_0_0/0.35)]" />
          <Wordmark />
        </Link>

        <ul className="hidden items-center gap-0.5 xl:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.key}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `relative block rounded-full px-2.5 py-2 text-[13px] font-medium whitespace-nowrap transition ${isActive ? 'text-white' : 'text-white/75 hover:text-white'}`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full bg-white/12 ring-1 ring-white/15"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative">{t(link.key)}</span>
                    {isActive && <motion.span layoutId="nav-dot" className="bg-feather absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full" />}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1 sm:gap-2">
          <div className="hidden items-center sm:flex xl:gap-0">
            <Dropdown label="Currency" icon={Wallet} value={currency} options={currencyOptions} onChange={setCurrency} />
            <Dropdown label="Language" icon={Globe} value={language} options={languageOptions} onChange={setLanguage} />
          </div>
          <div className="hidden md:block">
            <MagneticButton
              as="button"
              type="button"
              onClick={() => navigate('/#builder')}
              className="bg-gradient-to-r from-gold to-sunset px-5 py-2.5 text-sm whitespace-nowrap text-navy-900 shadow-glow"
            >
              <Sparkles className="h-4 w-4" />
              <span className="2xl:hidden">Plan My Trip</span>
              <span className="hidden 2xl:inline">{t('cta.plan')}</span>
            </MagneticButton>
          </div>
          <button
            type="button"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="rounded-full p-2 text-white transition hover:bg-white/10 xl:hidden"
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="glass-dark mx-auto mt-3 max-h-[calc(100dvh-6rem)] !bg-navy-950/95 max-w-7xl overflow-y-auto rounded-3xl p-6 shadow-luxe xl:hidden"
          >
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.key}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                >
                  <NavLink
                    to={link.to}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-xl px-3 py-3 font-display text-2xl transition hover:bg-white/5 hover:text-sun ${isActive ? 'text-sun' : 'text-white/90'}`
                    }
                  >
                    {t(link.key)}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4 sm:hidden">
              <Dropdown label="Currency" icon={Wallet} value={currency} options={currencyOptions} onChange={setCurrency} align="left" />
              <Dropdown label="Language" icon={Globe} value={language} options={languageOptions} onChange={setLanguage} align="left" />
            </div>
            <Link
              to="/#builder"
              onClick={() => setMenuOpen(false)}
              className="mt-4 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold to-sunset px-5 py-3 text-sm font-semibold text-navy-900 md:hidden"
            >
              <Sparkles className="h-4 w-4" />
              {t('cta.plan')}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
