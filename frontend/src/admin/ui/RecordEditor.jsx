import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ExternalLink, Loader2, MonitorSmartphone, Save, X } from 'lucide-react';
import { api } from '../api.js';
import { allFields, slugify } from '../schemas.js';
import { FieldInput, Label, Toggle, cleanForSave } from './Fields.jsx';
import { useToast } from './Toast.jsx';
import { useConfirm } from './Confirm.jsx';
import { PREVIEWS } from '../previews.jsx';

const spanCls = (f) => (f.span === 'full' || ['image', 'objects', 'list', 'chips', 'months', 'icon', 'group', 'textarea'].includes(f.type) ? 'sm:col-span-2' : '');

/** Slide-in editor for one record of a collection. */
export default function RecordEditor({ name, def, item, onClose, onSaved }) {
  const toast = useToast();
  const confirm = useConfirm();
  const isNew = !item?.id;
  const fields = useMemo(() => allFields(def.sections), [def]);
  const initial = useMemo(() => item || { published: true }, [item]);
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [optionsFrom, setOptionsFrom] = useState({});
  const slugTouched = useRef(!isNew);
  const preview = PREVIEWS[name];
  const [showPreview, setShowPreview] = useState(false); // small screens only; always visible on xl
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);

  // Option lists that come from other content (e.g. journeys → destinations)
  useEffect(() => {
    const sources = [...new Set(fields.filter((f) => f.optionsFrom).map((f) => f.optionsFrom))];
    sources.forEach((src) =>
      api(`admin/content/${src}`)
        .then(({ items }) => setOptionsFrom((o) => ({ ...o, [src]: items.map((x) => ({ value: x.slug, label: x.name || x.title })) })))
        .catch(() => {})
    );
  }, [fields]);

  const set = (key, value) =>
    setForm((f) => {
      const next = { ...f, [key]: value };
      const slugField = fields.find((x) => x.slugFrom === key);
      if (slugField && !slugTouched.current) next[slugField.key] = slugify(value);
      if (key === 'slug') slugTouched.current = true;
      return next;
    });

  const close = async () => {
    if (dirty && !(await confirm({ title: 'Discard changes?', text: 'Your unsaved edits will be lost.', action: 'Discard' }))) return;
    onClose();
  };

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const payload = cleanForSave(fields, form);
      const { item: saved } = isNew
        ? await api(`admin/content/${name}`, { method: 'POST', body: payload })
        : await api(`admin/content/${name}/${item.id}`, { method: 'PUT', body: payload });
      toast(`${def.singular[0].toUpperCase()}${def.singular.slice(1)} ${isNew ? 'created' : 'saved'}`);
      onSaved(saved, isNew);
    } catch (e) {
      setError(e.message);
      toast(e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Ctrl/Cmd+S saves, Esc closes
  const saveRef = useRef(save);
  saveRef.current = save;
  const closeRef = useRef(close);
  closeRef.current = close;
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveRef.current();
      }
      if (e.key === 'Escape') closeRef.current();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, []);

  const heading = isNew ? `New ${def.singular}` : form.name || form.title || form.handle || `Edit ${def.singular}`;

  return (
    <motion.div className="fixed inset-0 z-[100] flex justify-end" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm" onClick={close} />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-label={heading}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 260, damping: 32 }}
        className={`relative flex h-full w-full flex-col bg-cream shadow-2xl ${preview ? 'max-w-3xl xl:max-w-[78rem]' : 'max-w-3xl'}`}
      >
        <header className="flex items-center gap-4 border-b border-navy-900/10 bg-white px-5 py-4 sm:px-7">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-teal">{def.title}</p>
            <h2 className="truncate font-display text-2xl font-semibold text-navy-900">{heading}</h2>
          </div>
          <Toggle checked={form.published !== false} onChange={(v) => set('published', v)} label={<span className="hidden sm:inline">{form.published !== false ? 'Published' : 'Hidden'}</span>} />
          {preview && (
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-full bg-navy-900/5 px-3 py-2 text-xs font-semibold text-navy-900 hover:bg-navy-900/10 xl:hidden"
            >
              {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} Preview
            </button>
          )}
          {!isNew && def.preview && (
            <a href={def.preview(form)} target="_blank" rel="noreferrer" className="hidden rounded-full p-2 text-navy-800/60 hover:bg-navy-900/5 sm:block" title="View on website">
              <ExternalLink className="h-5 w-5" />
            </a>
          )}
          <button type="button" onClick={close} aria-label="Close editor" className="rounded-full p-2 text-navy-800/60 hover:bg-navy-900/5">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className={`grid gap-6 px-5 py-6 sm:px-7 ${preview ? 'xl:grid-cols-[minmax(0,1fr)_26rem]' : ''}`}>
          {preview && (
            <aside className={`xl:order-2 xl:block ${showPreview ? 'block' : 'hidden'}`}>
              <div className="space-y-4 xl:sticky xl:top-0">
                <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.25em] text-teal uppercase">
                  <MonitorSmartphone className="h-4 w-4" /> Live preview
                </p>
                {preview.views.map((v) => (
                  <div key={v.label}>
                    <p className="mb-2 text-xs text-navy-800/55">{v.label}</p>
                    {/* Real website components, rendered with the current form values (not clickable) */}
                    <div className={`pointer-events-none rounded-3xl p-4 select-none ${v.dark ? 'bg-navy-950' : 'bg-porcelain ring-1 ring-navy-900/5'}`} aria-hidden>
                      {v.render(cleanForSave(fields, form))}
                    </div>
                  </div>
                ))}
                <p className="text-[11px] leading-relaxed text-navy-800/45">Updates as you type. Long text is shortened automatically on the website so the design stays tidy.</p>
              </div>
            </aside>
          )}
          <div className="min-w-0 space-y-5 xl:order-1">
          {error && <p className="rounded-2xl bg-sunset/10 px-4 py-3 text-sm text-sunset">{error}</p>}
          {def.sections.map((section, si) => (
            <motion.section
              key={section.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * si }}
              className="rounded-3xl bg-white p-5 shadow-[0_8px_30px_-20px_rgb(10_25_47/0.35)] ring-1 ring-navy-900/5 sm:p-6"
            >
              <h3 className="mb-4 font-display text-xl font-semibold text-navy-900">{section.title}</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {section.fields.map((f) => (
                  <div key={f.key} className={spanCls(f)}>
                    <Label field={f}>
                      <FieldInput field={f} value={form[f.key]} onChange={(v) => set(f.key, v)} options={f.optionsFrom ? optionsFrom[f.optionsFrom] || [] : undefined} />
                    </Label>
                  </div>
                ))}
              </div>
            </motion.section>
          ))}
          </div>
          </div>
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-navy-900/10 bg-white px-5 py-4 sm:px-7">
          <p className="hidden text-xs text-navy-800/45 sm:block">
            {dirty ? 'Unsaved changes' : 'All changes saved'} · <kbd className="rounded bg-navy-900/5 px-1.5 py-0.5">Ctrl</kbd> + <kbd className="rounded bg-navy-900/5 px-1.5 py-0.5">S</kbd> to save
          </p>
          <div className="ml-auto flex gap-2">
            <button type="button" onClick={close} className="rounded-full px-5 py-2.5 text-sm font-semibold text-navy-800 hover:bg-navy-900/5">
              Cancel
            </button>
            <motion.button
              type="button"
              onClick={save}
              disabled={saving}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-teal disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isNew ? 'Create' : 'Save changes'}
            </motion.button>
          </div>
        </footer>
      </motion.aside>
    </motion.div>
  );
}
