import { useEffect, useState } from 'react';
import { NavLink, useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BedDouble,
  ExternalLink,
  Inbox,
  Info,
  Landmark,
  LayoutDashboard,
  LogOut,
  MapPinned,
  Menu,
  MessageSquareQuote,
  PhoneCall,
  Route,
  Sparkles,
  UserCog,
  X,
} from 'lucide-react';
import { useAuth } from './AuthContext.jsx';
import { api } from './api.js';

const NAV = [
  { heading: null, items: [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true }, { to: '/admin/enquiries', label: 'Enquiries', icon: Inbox, badge: true }] },
  {
    heading: 'Home page',
    items: [
      { to: '/admin/stories', label: 'Travel Stories', icon: MessageSquareQuote },
      { to: '/admin/moments', label: 'Sasoba Moments', icon: Sparkles },
    ],
  },
  {
    heading: 'Pages',
    items: [
      { to: '/admin/destinations', label: 'Destinations', icon: MapPinned },
      { to: '/admin/journeys', label: 'Curated Journeys', icon: Route },
      { to: '/admin/cultural', label: 'Cultural Escapes', icon: Landmark },
      { to: '/admin/stays', label: 'Luxury Stays', icon: BedDouble },
      { to: '/admin/about', label: 'About Us', icon: Info },
    ],
  },
  { heading: 'Settings', items: [{ to: '/admin/contact', label: 'Contact Details', icon: PhoneCall }, { to: '/admin/account', label: 'Your Account', icon: UserCog }] },
];

function Sidebar({ newCount, onNavigate }) {
  const { admin, signOut } = useAuth();
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-navy-950 text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,rgb(13_148_136/0.3),transparent_60%)]" />
      <motion.img
        aria-hidden
        src="/brand/sasoba-feathers.svg"
        alt=""
        className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 opacity-[0.08]"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative flex items-center gap-3 px-5 pt-6 pb-5">
        <span className="relative h-11 w-11">
          <img src="/brand/sasoba-feathers.svg" alt="" className="absolute inset-0 h-full w-full" />
          <img src="/brand/sasoba-emblem.svg" alt="" className="absolute inset-0 h-full w-full" />
        </span>
        <div className="leading-none">
          <p className="font-brand text-lg font-extrabold">
            <span className="bg-gradient-to-br from-[#7DB2FF] to-[#3FD1B5] bg-clip-text text-transparent">S</span>asoba
          </p>
          <p className="mt-1 text-[10px] font-semibold tracking-[0.3em] text-sun uppercase">Admin Studio</p>
        </div>
      </div>

      <nav className="no-scrollbar relative flex-1 space-y-5 overflow-y-auto px-3 pb-4">
        {NAV.map((group) => (
          <div key={group.heading || 'main'}>
            {group.heading && <p className="mb-1.5 px-3 text-[10px] font-semibold tracking-[0.25em] text-white/35 uppercase">{group.heading}</p>}
            <ul className="space-y-0.5">
              {group.items.map(({ to, label, icon: Icon, end, badge }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    onClick={onNavigate}
                    className={({ isActive }) => `relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${isActive ? 'text-white' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <motion.span layoutId="admin-nav" className="absolute inset-0 rounded-xl bg-white/10 ring-1 ring-white/10" transition={{ type: 'spring', stiffness: 400, damping: 32 }}>
                            <span className="bg-feather absolute top-2 bottom-2 left-0 w-1 rounded-full" />
                          </motion.span>
                        )}
                        <Icon className={`relative h-4.5 w-4.5 ${isActive ? 'text-sun' : ''}`} />
                        <span className="relative flex-1 font-medium">{label}</span>
                        {badge && newCount > 0 && (
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative grid h-5 min-w-5 place-items-center rounded-full bg-sunset px-1.5 text-[10px] font-bold text-white">
                            {newCount}
                          </motion.span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="relative space-y-1 border-t border-white/10 p-3">
        <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white">
          <ExternalLink className="h-4 w-4" /> View website
        </a>
        <div className="mt-2 flex items-center gap-3 rounded-2xl bg-white/5 p-2.5">
          <span className="bg-feather grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-bold">{admin?.name?.[0]?.toUpperCase()}</span>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-semibold">{admin?.name}</p>
            <p className="truncate text-[11px] text-white/45">{admin?.email}</p>
          </div>
          <button type="button" onClick={signOut} title="Sign out" aria-label="Sign out" className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const location = useLocation();
  const outlet = useOutlet();
  const [open, setOpen] = useState(false);
  const [newCount, setNewCount] = useState(0);

  // Poll for new enquiries so the badge stays fresh.
  useEffect(() => {
    let alive = true;
    const tick = () =>
      api('admin/enquiries?status=new')
        .then((d) => alive && setNewCount(d.counts?.new ?? 0))
        .catch(() => {});
    tick();
    const id = setInterval(tick, 60000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [location.pathname, location.search]);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <div className="min-h-screen bg-cream">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-68 lg:block">
        <Sidebar newCount={newCount} />
      </aside>

      {/* Mobile top bar + drawer */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-navy-950 px-4 py-3 text-white lg:hidden">
        <span className="flex items-center gap-2 font-brand font-extrabold">
          <img src="/brand/sasoba-mark.svg" alt="" className="h-8 w-8" /> Sasoba Admin
        </span>
        <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="relative rounded-lg p-2 hover:bg-white/10">
          <Menu className="h-6 w-6" />
          {newCount > 0 && <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-sunset" />}
        </button>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-navy-950/60" onClick={() => setOpen(false)} />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', stiffness: 300, damping: 32 }} className="absolute inset-y-0 left-0 w-72">
              <Sidebar newCount={newCount} onNavigate={() => setOpen(false)} />
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="absolute top-5 -right-12 rounded-full bg-white p-2 text-navy-900">
                <X className="h-5 w-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="lg:pl-68">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-8 sm:py-10"
          >
            {outlet}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
