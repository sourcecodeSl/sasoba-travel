import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, RotateCcw, Save } from 'lucide-react';
import { api } from '../api.js';
import { SETTINGS, allFields } from '../schemas.js';
import PageHeader from '../ui/PageHeader.jsx';
import { FieldInput, Label, cleanForSave } from '../ui/Fields.jsx';
import { useToast } from '../ui/Toast.jsx';

const spanCls = (f) => (f.span === 'full' || ['objects', 'list', 'textarea'].includes(f.type) ? 'sm:col-span-2' : '');

/** Editor for a single settings document (contact, about, etiquette). */
export default function SettingsPage({ settingKey, embedded = false }) {
  const def = SETTINGS[settingKey];
  const toast = useToast();
  const fields = useMemo(() => allFields(def.sections), [def]);
  const [saved, setSaved] = useState(null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(null);
    api(`admin/settings/${settingKey}`)
      .then(({ value }) => {
        const v = def.isList ? { items: value || [] } : value || {};
        setSaved(v);
        setForm(v);
      })
      .catch((e) => toast(e.message, 'error'));
  }, [settingKey, def, toast]);

  const dirty = form && JSON.stringify(form) !== JSON.stringify(saved);

  const save = async () => {
    setSaving(true);
    try {
      const clean = cleanForSave(fields, form);
      const { value } = await api(`admin/settings/${settingKey}`, { method: 'PUT', body: { value: def.isList ? clean.items : clean } });
      const v = def.isList ? { items: value } : value;
      setSaved(v);
      setForm(v);
      toast(`${def.title} saved. The website is updated.`);
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's' && dirty) {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="space-y-6 pb-24">
      {!embedded && <PageHeader eyebrow="Settings" title={def.title} text={def.description} />}
      {embedded && <p className="text-sm text-navy-800/60">{def.description}</p>}

      {!form ? (
        <div className="h-64 animate-pulse rounded-3xl bg-white/70" />
      ) : (
        def.sections.map((section, i) => (
          <motion.section
            key={section.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-3xl bg-white p-6 ring-1 ring-navy-900/5"
          >
            <h2 className="mb-5 font-display text-2xl font-semibold text-navy-900">{section.title}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {section.fields.map((f) => (
                <div key={f.key} className={spanCls(f)}>
                  <Label field={f}>
                    <FieldInput field={f} value={form[f.key]} onChange={(v) => setForm((x) => ({ ...x, [f.key]: v }))} />
                  </Label>
                </div>
              ))}
            </div>
          </motion.section>
        ))
      )}

      {/* Floating save bar appears when there are unsaved changes */}
      <motion.div
        initial={false}
        animate={{ y: dirty ? 0 : 120, opacity: dirty ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-5 left-1/2 z-40 flex w-[min(92vw,36rem)] -translate-x-1/2 items-center gap-3 rounded-full bg-navy-900 py-2 pr-2 pl-5 text-white shadow-luxe lg:left-[calc(50%+8.5rem)]"
      >
        <span className="flex-1 text-sm">You have unsaved changes</span>
        <button type="button" onClick={() => setForm(saved)} className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-white/70 hover:text-white">
          <RotateCcw className="h-4 w-4" /> Undo
        </button>
        <button type="button" onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-sunset px-5 py-2 text-sm font-semibold text-navy-900">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
        </button>
      </motion.div>
    </div>
  );
}
