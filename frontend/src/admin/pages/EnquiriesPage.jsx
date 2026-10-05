import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Archive, ArrowLeft, CalendarDays, CheckCheck, Clock, Globe, Inbox, Mail, MapPin, Phone, RefreshCw, Search, Trash2, Users } from 'lucide-react';
import { api } from '../api.js';
import PageHeader from '../ui/PageHeader.jsx';
import { useToast } from '../ui/Toast.jsx';
import { useConfirm } from '../ui/Confirm.jsx';
import { WhatsAppIcon } from '../../components/ui/BrandIcons.jsx';

export const STATUS = {
  new: { label: 'New', dot: 'bg-sunset', pill: 'bg-sunset/10 text-sunset' },
  in_progress: { label: 'In progress', dot: 'bg-gold', pill: 'bg-sun/20 text-navy-900' },
  replied: { label: 'Replied', dot: 'bg-emerald', pill: 'bg-emerald/10 text-emerald' },
  archived: { label: 'Archived', dot: 'bg-navy-800/30', pill: 'bg-navy-900/5 text-navy-800/60' },
};

const TABS = [{ id: '', label: 'All' }, ...Object.entries(STATUS).map(([id, s]) => ({ id, label: s.label }))];

// MySQL "YYYY-MM-DD HH:MM:SS" (server local time) → Date
const parse = (s) => new Date(s.replace(' ', 'T'));

export function timeAgo(s) {
  const diff = (Date.now() - parse(s)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} d ago`;
  return parse(s).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

const initials = (name) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');

const startCase = (k) => k.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());

function Detail({ e, onChange, onDelete, onBack }) {
  const [notes, setNotes] = useState(e.notes || '');
  useEffect(() => setNotes(e.notes || ''), [e.id, e.notes]);

  const first = e.name.split(' ')[0];
  const replySubject = encodeURIComponent('Your Sri Lanka journey with Sasoba Travels');
  const replyBody = encodeURIComponent(`Dear ${first},\n\nThank you for your enquiry with Sasoba Travels.\n\n`);
  const digits = (e.phone || '').replace(/\D/g, '');

  const facts = [
    { icon: Mail, label: 'Email', value: e.email, href: `mailto:${e.email}` },
    { icon: Phone, label: 'Phone', value: e.phone, href: e.phone ? `tel:${e.phone}` : null },
    { icon: Globe, label: 'Country', value: e.country },
    { icon: CalendarDays, label: 'Travel dates', value: e.travelDate },
    { icon: Users, label: 'Travellers', value: e.travellers },
    { icon: MapPin, label: 'Sent from', value: e.source },
  ].filter((f) => f.value);

  return (
    <motion.article
      key={e.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-navy-900/5"
    >
      <header className="border-b border-navy-900/5 p-5 sm:p-6">
        <button type="button" onClick={onBack} className="mb-3 inline-flex items-center gap-1 text-sm text-navy-800/60 lg:hidden">
          <ArrowLeft className="h-4 w-4" /> All enquiries
        </button>
        <div className="flex items-start gap-4">
          <span className="bg-feather grid h-14 w-14 shrink-0 place-items-center rounded-2xl font-display text-xl font-semibold text-white">{initials(e.name)}</span>
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-display text-3xl font-semibold text-navy-900">{e.name}</h2>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-navy-800/55">
              <Clock className="h-3.5 w-3.5" /> Received {timeAgo(e.createdAt)} · {parse(e.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <a
            href={`mailto:${e.email}?subject=${replySubject}&body=${replyBody}`}
            onClick={() => e.status === 'new' && onChange({ status: 'in_progress' })}
            className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-teal"
          >
            <Mail className="h-4 w-4" /> Reply by email
          </a>
          {digits.length > 6 && (
            <a
              href={`https://wa.me/${digits}?text=${encodeURIComponent(`Hello ${first}, this is Sasoba Travels. Thank you for your enquiry!`)}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => e.status === 'new' && onChange({ status: 'in_progress' })}
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
            >
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp
            </a>
          )}
          <button type="button" onClick={onDelete} className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-navy-800/50 hover:bg-sunset/10 hover:text-sunset">
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      </header>

      <div className="flex-1 space-y-6 overflow-y-auto p-5 sm:p-6">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-navy-800/45">Status</p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(STATUS).map(([id, s]) => (
              <button
                key={id}
                type="button"
                onClick={() => onChange({ status: id })}
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold ring-1 transition ${
                  e.status === id ? `${s.pill} ring-current` : 'bg-white text-navy-800/55 ring-navy-900/10 hover:ring-navy-900/25'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${s.dot}`} /> {s.label}
              </button>
            ))}
          </div>
        </div>

        <dl className="grid gap-3 sm:grid-cols-2">
          {facts.map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex items-start gap-3 rounded-2xl bg-cream/70 p-3.5">
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
              <div className="min-w-0">
                <dt className="text-[11px] font-semibold uppercase tracking-[0.15em] text-navy-800/45">{label}</dt>
                <dd className="truncate text-sm font-medium text-navy-900">
                  {href ? (
                    <a href={href} className="hover:text-teal hover:underline">
                      {value}
                    </a>
                  ) : (
                    value
                  )}
                </dd>
              </div>
            </div>
          ))}
        </dl>

        {e.trip && Object.keys(e.trip).length > 0 && (
          <div className="rounded-2xl bg-navy-900 p-5 text-white">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-sun">Trip details</p>
            <dl className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {Object.entries(e.trip)
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs text-white/50">{startCase(k)}</dt>
                    <dd className="text-sm font-medium">{String(v)}</dd>
                  </div>
                ))}
            </dl>
          </div>
        )}

        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-navy-800/45">Message</p>
          <p className="whitespace-pre-wrap rounded-2xl border border-navy-900/5 p-4 text-sm leading-relaxed text-navy-900">{e.message || <span className="text-navy-800/40">No message.</span>}</p>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-navy-800/45">Private notes</p>
          <textarea
            value={notes}
            onChange={(ev) => setNotes(ev.target.value)}
            onBlur={() => notes !== (e.notes || '') && onChange({ notes })}
            rows={3}
            placeholder="Only your team sees this, e.g. “Sent proposal v1 on 3 Oct”"
            className="w-full resize-y rounded-2xl border border-navy-900/10 bg-sun/5 px-4 py-3 text-sm focus:border-gold focus:ring-2 focus:ring-sun/30 focus:outline-none"
          />
          <p className="mt-1 text-[11px] text-navy-800/40">Saves automatically when you click away.</p>
        </div>
      </div>
    </motion.article>
  );
}

export default function EnquiriesPage() {
  const toast = useToast();
  const confirm = useConfirm();
  const [params, setParams] = useSearchParams();
  const status = params.get('status') || '';
  const selectedId = Number(params.get('id')) || null;
  const [q, setQ] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ ...(status && { status }), ...(q && { q }) }).toString();
      setData(await api(`admin/enquiries${qs ? `?${qs}` : ''}`));
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [status, q, toast]);

  useEffect(() => {
    const t = setTimeout(load, q ? 300 : 0);
    return () => clearTimeout(t);
  }, [load, q]);

  const items = data?.items || [];
  // Keep the open enquiry on screen even if a status change filters it out of the current tab.
  const [cache, setCache] = useState(null);
  const found = useMemo(() => items.find((i) => i.id === selectedId) || null, [items, selectedId]);
  useEffect(() => {
    if (found) setCache(found);
  }, [found]);
  const selected = found || (cache?.id === selectedId ? cache : null);

  const setParam = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    setParams(next, { replace: true });
  };

  const update = async (id, patch) => {
    setData((d) => ({ ...d, items: d.items.map((x) => (x.id === id ? { ...x, ...patch } : x)) }));
    setCache((c) => (c?.id === id ? { ...c, ...patch } : c));
    try {
      const { item } = await api(`admin/enquiries/${id}`, { method: 'PUT', body: patch });
      setCache(item);
      setData((d) => ({ ...d, items: d.items.map((x) => (x.id === id ? item : x)) }));
      if (patch.status) {
        toast(`Marked as ${STATUS[patch.status].label.toLowerCase()}`);
        load();
      } else toast('Notes saved');
    } catch (e) {
      toast(e.message, 'error');
      load();
    }
  };

  const remove = async (e) => {
    if (!(await confirm({ title: `Delete ${e.name}’s enquiry?`, text: 'The message will be permanently removed.' }))) return;
    try {
      await api(`admin/enquiries/${e.id}`, { method: 'DELETE' });
      setParam({ id: null });
      toast('Enquiry deleted');
      load();
    } catch (err) {
      toast(err.message, 'error');
    }
  };

  const total = data ? Object.values(data.counts).reduce((a, b) => a + b, 0) : 0;

  return (
    <div className="flex h-full flex-col gap-6">
      <PageHeader eyebrow="Inbox" title="Enquiries" text="“Plan your trip” requests sent from the website. Reply quickly, since most guests book with whoever answers first.">
        <button type="button" onClick={load} className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium ring-1 ring-navy-900/10 hover:ring-teal">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </PageHeader>

      <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[minmax(20rem,26rem)_1fr]">
        {/* List */}
        <section className={`flex min-h-[60vh] flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-navy-900/5 ${selected ? 'hidden lg:flex' : 'flex'}`}>
          <div className="space-y-3 border-b border-navy-900/5 p-4">
            <label className="flex items-center gap-2 rounded-full bg-cream px-4 py-2.5">
              <Search className="h-4 w-4 text-navy-800/40" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, message…" className="w-full bg-transparent text-sm focus:outline-none" />
            </label>
            <div className="no-scrollbar flex gap-1 overflow-x-auto">
              {TABS.map((t) => {
                const count = t.id ? data?.counts?.[t.id] : total;
                return (
                  <button
                    key={t.id || 'all'}
                    type="button"
                    onClick={() => setParam({ status: t.id, id: null })}
                    className={`relative shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${status === t.id ? 'text-white' : 'text-navy-800/60 hover:text-navy-900'}`}
                  >
                    {status === t.id && <motion.span layoutId="enq-tab" className="absolute inset-0 rounded-full bg-navy-900" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
                    <span className="relative">
                      {t.label} {count > 0 && <span className="opacity-60">{count}</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <ul className="flex-1 divide-y divide-navy-900/5 overflow-y-auto">
            {!data ? (
              Array.from({ length: 6 }, (_, i) => <li key={i} className="m-3 h-16 animate-pulse rounded-2xl bg-cream" />)
            ) : items.length === 0 ? (
              <li className="flex flex-col items-center px-6 py-16 text-center">
                <Inbox className="h-10 w-10 text-navy-800/20" />
                <p className="mt-3 font-display text-xl text-navy-900">{q ? 'No matches' : 'Nothing here yet'}</p>
                <p className="mt-1 text-xs text-navy-800/50">New “Plan your trip” requests will appear here.</p>
              </li>
            ) : (
              <AnimatePresence initial={false}>
                {items.map((e) => (
                  <motion.li key={e.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <button
                      type="button"
                      onClick={() => setParam({ id: e.id })}
                      className={`flex w-full items-start gap-3 px-4 py-3.5 text-left transition ${selectedId === e.id ? 'bg-teal/[0.07]' : 'hover:bg-cream/60'}`}
                    >
                      <span className="relative mt-0.5">
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy-900 text-sm font-semibold text-white">{initials(e.name)}</span>
                        <span className={`absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-white ${STATUS[e.status].dot}`} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline justify-between gap-2">
                          <span className={`truncate text-sm ${e.status === 'new' ? 'font-bold text-navy-900' : 'font-medium text-navy-900/80'}`}>{e.name}</span>
                          <span className="shrink-0 text-[11px] text-navy-800/45">{timeAgo(e.createdAt)}</span>
                        </span>
                        <span className="block truncate text-xs text-navy-800/55">{e.source || 'Website'}{e.country ? ` · ${e.country}` : ''}</span>
                        <span className="mt-0.5 line-clamp-1 block text-xs text-navy-800/45">{e.message || e.trip?.interests || e.email}</span>
                      </span>
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            )}
          </ul>
        </section>

        {/* Detail */}
        <section className={`min-h-[60vh] ${selected ? 'block' : 'hidden lg:block'}`}>
          {selected ? (
            <Detail e={selected} onChange={(patch) => update(selected.id, patch)} onDelete={() => remove(selected)} onBack={() => setParam({ id: null })} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-navy-900/10 p-10 text-center">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="bg-feather grid h-16 w-16 place-items-center rounded-3xl text-white shadow-glow">
                <Mail className="h-7 w-7" />
              </motion.div>
              <p className="mt-5 font-display text-2xl text-navy-900">Select an enquiry</p>
              <p className="mt-1 max-w-xs text-sm text-navy-800/50">Open a message to see the guest’s trip details, reply by email or WhatsApp, and track its status.</p>
              <div className="mt-6 flex gap-4 text-xs text-navy-800/50">
                <span className="flex items-center gap-1.5"><CheckCheck className="h-4 w-4 text-emerald" /> Mark replied</span>
                <span className="flex items-center gap-1.5"><Archive className="h-4 w-4" /> Archive when done</span>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
