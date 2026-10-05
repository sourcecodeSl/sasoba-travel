import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, Reorder, motion, useDragControls } from 'framer-motion';
import { Copy, ExternalLink, GripVertical, Inbox, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { api } from '../api.js';
import { COLLECTIONS } from '../schemas.js';
import { ICONS } from '../../components/ui/icons.js';
import PageHeader from '../ui/PageHeader.jsx';
import RecordEditor from '../ui/RecordEditor.jsx';
import { Toggle } from '../ui/Fields.jsx';
import { useToast } from '../ui/Toast.jsx';
import { useConfirm } from '../ui/Confirm.jsx';

const pick = (spec, item) => (typeof spec === 'function' ? spec(item) : spec ? item[spec] : null);

function Thumb({ def, item }) {
  if (def.list.icon) {
    const Icon = ICONS[item[def.list.icon]] || ICONS.Sparkles;
    return (
      <span className="bg-feather grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-white">
        <Icon className="h-6 w-6" />
      </span>
    );
  }
  const src = pick(def.list.image, item);
  return (
    <span className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-navy-800 to-teal">
      {src && <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />}
    </span>
  );
}

function Row({ def, item, draggable, onEdit, onDelete, onDuplicate, onTogglePublish, onDragEnd }) {
  const controls = useDragControls();
  const badge = pick(def.list.badge, item);
  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onDragEnd}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30 }}
      whileDrag={{ scale: 1.02, boxShadow: '0 20px 40px -20px rgb(10 25 47 / 0.45)' }}
      className={`group flex items-center gap-3 rounded-2xl bg-white p-3 pr-4 ring-1 ring-navy-900/5 transition-colors hover:ring-teal/30 sm:gap-4 ${item.published ? '' : 'opacity-60'}`}
    >
      {draggable && (
        <span onPointerDown={(e) => controls.start(e)} className="cursor-grab touch-none rounded-lg p-1 text-navy-800/30 hover:bg-navy-900/5 hover:text-navy-800 active:cursor-grabbing" title="Drag to reorder">
          <GripVertical className="h-5 w-5" />
        </span>
      )}
      <button type="button" onClick={onEdit} className="flex min-w-0 flex-1 items-center gap-4 text-left">
        <Thumb def={def} item={item} />
        <span className="min-w-0">
          <span className="flex items-center gap-2">
            <span className="truncate font-semibold text-navy-900 group-hover:text-teal">{pick(def.list.title, item) || 'Untitled'}</span>
            {badge && <span className="shrink-0 rounded-full bg-sun/20 px-2 py-0.5 text-[10px] font-bold text-navy-900">{badge}</span>}
          </span>
          <span className="mt-0.5 line-clamp-1 block text-xs text-navy-800/55">{pick(def.list.subtitle, item)}</span>
        </span>
      </button>
      <span className="hidden sm:block" title={item.published ? 'Visible on website' : 'Hidden from website'}>
        <Toggle checked={item.published} onChange={onTogglePublish} />
      </span>
      <div className="flex items-center gap-0.5 text-navy-800/50">
        {def.preview && (
          <a href={def.preview(item)} target="_blank" rel="noreferrer" className="hidden rounded-lg p-2 hover:bg-navy-900/5 hover:text-navy-900 md:block" title="View on website">
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
        <button type="button" onClick={onDuplicate} className="hidden rounded-lg p-2 hover:bg-navy-900/5 hover:text-navy-900 md:block" title="Duplicate">
          <Copy className="h-4 w-4" />
        </button>
        <button type="button" onClick={onEdit} className="rounded-lg p-2 hover:bg-teal/10 hover:text-teal" title="Edit">
          <Pencil className="h-4 w-4" />
        </button>
        <button type="button" onClick={onDelete} className="rounded-lg p-2 hover:bg-sunset/10 hover:text-sunset" title="Delete">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </Reorder.Item>
  );
}

/** Generic manager for any collection in COLLECTIONS. */
export default function CollectionPage({ name, embedded = false }) {
  const def = COLLECTIONS[name];
  const toast = useToast();
  const confirm = useConfirm();
  const [items, setItems] = useState(null);
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null); // null | {} (new) | item
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const load = useCallback(async () => {
    try {
      const { items: list } = await api(`admin/content/${name}`);
      setItems(list);
    } catch (e) {
      toast(e.message, 'error');
      setItems([]);
    }
  }, [name, toast]);

  useEffect(() => {
    setItems(null);
    setQ('');
    load();
  }, [load]);

  const filtered = (items || []).filter((i) => !q || JSON.stringify([pick(def.list.title, i), pick(def.list.subtitle, i)]).toLowerCase().includes(q.toLowerCase()));

  const persistOrder = async (list) => {
    try {
      await api(`admin/content/${name}/reorder`, { method: 'POST', body: { ids: list.map((i) => i.id) } });
    } catch (e) {
      toast(e.message, 'error');
      load();
    }
  };

  const togglePublish = async (item) => {
    setItems((list) => list.map((x) => (x.id === item.id ? { ...x, published: !x.published } : x)));
    try {
      await api(`admin/content/${name}/${item.id}`, { method: 'PUT', body: { published: !item.published } });
      toast(item.published ? 'Hidden from the website' : 'Now visible on the website');
    } catch (e) {
      toast(e.message, 'error');
      load();
    }
  };

  const remove = async (item) => {
    const label = pick(def.list.title, item) || `this ${def.singular}`;
    if (!(await confirm({ title: `Delete ${label}?`, text: 'This removes it from the website and cannot be undone.' }))) return;
    try {
      await api(`admin/content/${name}/${item.id}`, { method: 'DELETE' });
      setItems((list) => list.filter((x) => x.id !== item.id));
      toast(`${label} deleted`);
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  const duplicate = (item) => {
    const { id, updatedAt, sortOrder, ...copy } = item;
    if (copy.slug) copy.slug = `${copy.slug}-copy`;
    if (copy.name) copy.name = `${copy.name} (copy)`;
    if (copy.title) copy.title = `${copy.title} (copy)`;
    setEditing({ ...copy, published: false });
  };

  return (
    <div className="space-y-6">
      {!embedded ? (
        <PageHeader eyebrow="Content" title={def.title} text={def.description}>
          <AddButton def={def} onClick={() => setEditing({})} />
        </PageHeader>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-navy-800/60">{def.description}</p>
          <AddButton def={def} onClick={() => setEditing({})} />
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="flex flex-1 items-center gap-2 rounded-full bg-white px-4 py-2.5 ring-1 ring-navy-900/10 focus-within:ring-teal">
          <Search className="h-4 w-4 text-navy-800/40" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${def.title.toLowerCase()}…`} className="w-full bg-transparent text-sm focus:outline-none" />
        </label>
        <p className="text-xs text-navy-800/50">
          {items ? `${items.length} total · ${items.filter((i) => i.published).length} published` : 'Loading…'}
          {!q && items?.length > 1 && ' · drag ⋮⋮ to reorder'}
        </p>
      </div>

      {items === null ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-white/70" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center rounded-3xl border-2 border-dashed border-navy-900/10 py-16 text-center">
          <Inbox className="h-10 w-10 text-navy-800/25" />
          <p className="mt-3 font-display text-2xl text-navy-900">{q ? 'No matches' : `No ${def.title.toLowerCase()} yet`}</p>
          {!q && (
            <button type="button" onClick={() => setEditing({})} className="mt-4 text-sm font-semibold text-teal hover:underline">
              Add the first {def.singular}
            </button>
          )}
        </motion.div>
      ) : (
        <Reorder.Group
          axis="y"
          values={filtered}
          onReorder={(list) => !q && setItems(list)}
          className="space-y-2.5"
        >
          <AnimatePresence initial={false}>
            {filtered.map((item) => (
              <Row
                key={item.id}
                def={def}
                item={item}
                draggable={!q}
                onEdit={() => setEditing(item)}
                onDelete={() => remove(item)}
                onDuplicate={() => duplicate(item)}
                onTogglePublish={() => togglePublish(item)}
                onDragEnd={() => setTimeout(() => persistOrder(itemsRef.current), 0)}
              />
            ))}
          </AnimatePresence>
        </Reorder.Group>
      )}

      <AnimatePresence>
        {editing && (
          <RecordEditor
            key={editing.id || 'new'}
            name={name}
            def={def}
            item={editing.id ? editing : Object.keys(editing).length ? editing : null}
            onClose={() => setEditing(null)}
            onSaved={(saved, isNew) => {
              setItems((list) => (isNew ? [...list, saved] : list.map((x) => (x.id === saved.id ? saved : x))));
              setEditing(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AddButton({ def, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-sunset px-5 py-2.5 text-sm font-semibold text-navy-900 shadow-glow"
    >
      <Plus className="h-4 w-4" /> Add {def.singular}
    </motion.button>
  );
}
