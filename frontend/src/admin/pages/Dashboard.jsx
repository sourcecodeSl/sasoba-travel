import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BedDouble, Database, ExternalLink, Inbox, Landmark, MapPinned, MessageSquareQuote, PhoneCall, Route, Sparkles } from 'lucide-react';
import { api } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import { STATUS, timeAgo } from './EnquiriesPage.jsx';
import CountUp from '../../components/ui/CountUp.jsx';
import { useToast } from '../ui/Toast.jsx';

export const PHPMYADMIN_URL = 'http://localhost/phpmyadmin/index.php?route=/database/structure&db=sasoba';

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

/** Enquiries per day, last 14 days: single series, so the title names it and no legend is needed. */
function EnquiryChart({ series }) {
  const [hover, setHover] = useState(null);
  // Clean, even axis ceiling (at least 4) so tick labels never repeat.
  const top = Math.max(...series.map((d) => d.count));
  const max = Math.max(4, Math.ceil(top / 2) * 2);
  const peak = series.reduce((a, b) => (b.count > a.count ? b : a), series[0]);
  const label = (d) => new Date(`${d}T00:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  const total = series.reduce((a, b) => a + b.count, 0);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="font-display text-2xl font-semibold text-navy-900">Enquiries, last 14 days</h2>
          <p className="text-xs text-navy-800/50">{total} received{peak.count > 0 && ` · busiest day ${label(peak.date)} (${peak.count})`}</p>
        </div>
      </div>
      <div className="relative mt-6 h-44" role="img" aria-label={`Enquiries per day over the last 14 days, ${total} in total.`}>
        {/* Recessive hairline gridlines at clean values */}
        {[0, 0.5, 1].map((f) => (
          <div key={f} className="absolute inset-x-0 border-t border-navy-900/[0.07]" style={{ bottom: `${f * 100}%` }}>
            <span className="absolute -top-2 -left-0.5 -translate-x-full pr-2 text-[10px] text-navy-800/40">{max * f}</span>
          </div>
        ))}
        <div className="absolute inset-0 ml-2 grid grid-cols-14 items-end gap-0.5">
          {series.map((d, i) => (
            <div
              key={d.date}
              className="relative flex h-full cursor-default items-end justify-center"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(d.count / max) * 100}%` }}
                transition={{ delay: i * 0.03, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`w-full max-w-6 rounded-t-[4px] transition-colors ${hover === i ? 'bg-navy-900' : 'bg-teal'}`}
                style={{ minHeight: d.count ? 3 : 0 }}
              />
              {hover === i && (
                <div className="pointer-events-none absolute bottom-full z-10 mb-2 rounded-lg bg-navy-900 px-2.5 py-1.5 text-center text-[11px] whitespace-nowrap text-white shadow-lg">
                  <span className="font-semibold">{d.count}</span> {d.count === 1 ? 'enquiry' : 'enquiries'}
                  <span className="block text-white/60">{label(d.date)}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 ml-2 grid grid-cols-14 gap-0.5 text-center text-[10px] text-navy-800/40">
        {series.map((d, i) => (
          <span key={d.date} className="whitespace-nowrap">{i % 3 === 0 || i === series.length - 1 ? label(d.date) : ''}</span>
        ))}
      </div>
      <table className="sr-only">
        <caption>Enquiries per day</caption>
        <tbody>
          {series.map((d) => (
            <tr key={d.date}>
              <th>{label(d.date)}</th>
              <td>{d.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const CONTENT = [
  { key: 'destinations', label: 'Destinations', icon: MapPinned, to: '/admin/destinations' },
  { key: 'journeys', label: 'Journeys', icon: Route, to: '/admin/journeys' },
  { key: 'stays', label: 'Luxury stays', icon: BedDouble, to: '/admin/stays' },
  { key: 'testimonials', label: 'Travel stories', icon: MessageSquareQuote, to: '/admin/stories' },
  { key: 'moments', label: 'Sasoba moments', icon: Sparkles, to: '/admin/moments' },
  { key: 'festivals', label: 'Festivals', icon: Landmark, to: '/admin/cultural' },
];

export default function Dashboard() {
  const { admin } = useAuth();
  const toast = useToast();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api('admin/stats').then(setStats).catch((e) => toast(e.message, 'error'));
  }, [toast]);

  const fresh = stats?.enquiries.new ?? 0;

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] bg-navy-900 p-7 text-white sm:p-9"
      >
        <motion.img
          src="/brand/sasoba-feathers.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 h-80 w-80 opacity-25"
          animate={{ rotate: 360 }}
          transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
        />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_100%,rgb(13_148_136/0.35),transparent_55%)]" />
        <div className="relative max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sun">{new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">
            {greeting()}, <span className="text-feather italic">{admin?.name?.split(' ')[0]}</span>
          </h1>
          <p className="mt-2 text-white/70">
            {stats == null
              ? 'Loading your overview…'
              : fresh > 0
                ? `You have ${fresh} new ${fresh === 1 ? 'enquiry' : 'enquiries'} waiting for a reply.`
                : 'You’re all caught up. No new enquiries right now.'}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link to="/admin/enquiries?status=new" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-sunset px-5 py-2.5 text-sm font-semibold text-navy-900 shadow-glow">
              <Inbox className="h-4 w-4" /> Open inbox
            </Link>
            <a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold ring-1 ring-white/15 hover:bg-white/15">
              <ExternalLink className="h-4 w-4" /> View website
            </a>
          </div>
        </div>
      </motion.section>

      {/* Enquiry status tiles */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Object.entries(STATUS).map(([id, s], i) => (
          <motion.div key={id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
            <Link to={`/admin/enquiries?status=${id}`} className="group block rounded-3xl bg-white p-5 ring-1 ring-navy-900/5 transition hover:-translate-y-1 hover:shadow-luxe">
              <p className="flex items-center gap-2 text-xs font-semibold text-navy-800/60">
                <span className={`h-2 w-2 rounded-full ${s.dot}`} /> {s.label}
              </p>
              <p className="mt-2 font-sans text-4xl font-bold tracking-tight text-navy-900 tabular-nums">{stats ? <CountUp value={String(stats.enquiries[id])} duration={1} /> : '–'}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-navy-800/40 group-hover:text-teal">
                View <ArrowRight className="h-3 w-3" />
              </p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-3xl bg-white p-6 pl-10 ring-1 ring-navy-900/5">
          {stats ? <EnquiryChart series={stats.daily} /> : <div className="h-56 animate-pulse rounded-2xl bg-cream" />}
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-navy-900/5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold text-navy-900">Latest enquiries</h2>
            <Link to="/admin/enquiries" className="text-xs font-semibold text-teal hover:underline">
              See all
            </Link>
          </div>
          <ul className="mt-4 flex-1 space-y-1">
            {stats?.recent.length === 0 && <li className="py-10 text-center text-sm text-navy-800/45">No enquiries yet. They’ll appear here.</li>}
            {stats?.recent.map((e) => (
              <li key={e.id}>
                <Link to={`/admin/enquiries?id=${e.id}`} className="flex items-center gap-3 rounded-2xl p-2.5 transition hover:bg-cream">
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${STATUS[e.status].dot}`} title={STATUS[e.status].label} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-navy-900">{e.name}</span>
                    <span className="block truncate text-xs text-navy-800/50">{e.source || 'Website'}</span>
                  </span>
                  <span className="shrink-0 text-[11px] text-navy-800/40">{timeAgo(e.createdAt)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </motion.section>
      </div>

      {/* Content overview */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <h2 className="mb-4 font-display text-2xl font-semibold text-navy-900">Website content</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {CONTENT.map(({ key, label, icon: Icon, to }) => (
            <Link key={key} to={to} className="group rounded-3xl bg-white p-5 ring-1 ring-navy-900/5 transition hover:-translate-y-1 hover:shadow-luxe">
              <span className="bg-feather grid h-10 w-10 place-items-center rounded-xl text-white transition group-hover:rotate-6">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-4 font-sans text-3xl font-bold tracking-tight text-navy-900 tabular-nums">{stats ? stats.counts[key] : '–'}</p>
              <p className="text-xs text-navy-800/55">{label}</p>
            </Link>
          ))}
        </div>
      </motion.section>

      <div className="grid gap-4 md:grid-cols-2">
        <Link to="/admin/contact" className="flex items-center gap-4 rounded-3xl bg-white p-5 ring-1 ring-navy-900/5 transition hover:ring-teal/40">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald/10 text-emerald">
            <PhoneCall className="h-5 w-5" />
          </span>
          <span className="flex-1">
            <span className="block font-semibold text-navy-900">Contact details</span>
            <span className="text-xs text-navy-800/55">WhatsApp number, email and social links used across the site</span>
          </span>
          <ArrowRight className="h-4 w-4 text-navy-800/30" />
        </Link>
        <a href={PHPMYADMIN_URL} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-3xl bg-white p-5 ring-1 ring-navy-900/5 transition hover:ring-teal/40">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-navy-900/5 text-navy-900">
            <Database className="h-5 w-5" />
          </span>
          <span className="flex-1">
            <span className="block font-semibold text-navy-900">Database (phpMyAdmin)</span>
            <span className="text-xs text-navy-800/55">Advanced: browse the raw “sasoba” tables</span>
          </span>
          <ExternalLink className="h-4 w-4 text-navy-800/30" />
        </a>
      </div>
    </div>
  );
}
