import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, Reorder, motion, useDragControls } from 'framer-motion';
import { ArrowDown, ArrowUp, Check, Crop, GripVertical, ImagePlus, Link2, Loader2, Plus, Trash2, Upload } from 'lucide-react';
import ImageCropper from './ImageCropper.jsx';
import { uploadImage } from '../api.js';
import { ICONS } from '../../components/ui/icons.js';
import { MONTHS } from '../../data/destinations.js';
import { useToast } from './Toast.jsx';

export const inputCls =
  'w-full rounded-xl border border-navy-900/10 bg-white px-3.5 py-2.5 text-sm text-navy-900 transition placeholder:text-navy-800/35 focus:border-teal focus:ring-2 focus:ring-teal/15 focus:outline-none';

export function Label({ field, children }) {
  return (
    <div className="block">
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-xs font-semibold text-navy-800">
          {field.label} {field.required && <span className="text-sunset">*</span>}
        </span>
        {field.hint && <span className="text-right text-[11px] text-navy-800/45">{field.hint}</span>}
      </div>
      {children}
    </div>
  );
}

function ChipSelect({ options, value = [], onChange }) {
  const list = Array.isArray(value) ? value : [];
  const toggle = (v) => onChange(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const v = typeof o === 'string' ? o : o.value;
        const label = typeof o === 'string' ? o : o.label;
        const on = list.includes(v);
        return (
          <button
            key={v}
            type="button"
            onClick={() => toggle(v)}
            aria-pressed={on}
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition ${
              on ? 'bg-teal text-white ring-teal' : 'bg-white text-navy-800/70 ring-navy-900/10 hover:ring-teal/50'
            }`}
          >
            {on && <Check className="h-3 w-3" strokeWidth={3} />} {label}
          </button>
        );
      })}
    </div>
  );
}

function ImageField({ value, onChange, frame }) {
  const toast = useToast();
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [broken, setBroken] = useState(false);
  const [cropSrc, setCropSrc] = useState(null); // image currently open in the cropper
  useEffect(() => setBroken(false), [value]);

  const send = async (file) => {
    setBusy(true);
    try {
      const { url } = await uploadImage(file);
      onChange(url);
      toast(frame ? 'Photo cropped and uploaded' : 'Image uploaded');
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  // With a frame, every new photo goes through the cropper first.
  const upload = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast('Please choose an image file.', 'error');
    if (frame) setCropSrc(URL.createObjectURL(file));
    else send(file);
  };

  const closeCropper = () => {
    if (cropSrc?.startsWith('blob:')) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          upload(e.dataTransfer.files?.[0]);
        }}
        style={{ aspectRatio: frame?.aspect || 16 / 9, width: `min(100%, ${20 * (frame?.aspect || 16 / 9)}rem)` }}
        className={`group relative mx-auto flex items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition ${
          drag ? 'border-teal bg-teal/5' : 'border-navy-900/10 bg-navy-900/[0.03]'
        }`}
      >
        {value && !broken ? (
          <>
            <img src={value} alt="" onError={() => setBroken(true)} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-navy-950/55 opacity-0 transition group-hover:opacity-100">
              {frame && (
                <button type="button" onClick={() => setCropSrc(value)} className="inline-flex items-center gap-1.5 rounded-full bg-sun px-4 py-2 text-xs font-semibold text-navy-900">
                  <Crop className="h-3.5 w-3.5" /> Adjust crop
                </button>
              )}
              <button type="button" onClick={() => fileRef.current?.click()} className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-navy-900">
                Replace
              </button>
              <button type="button" onClick={() => onChange('')} className="rounded-full bg-white/20 px-4 py-2 text-xs font-semibold text-white">
                Remove
              </button>
            </div>
          </>
        ) : (
          <button type="button" onClick={() => fileRef.current?.click()} className="flex flex-col items-center gap-2 p-6 text-center text-navy-800/55">
            <span className="bg-feather grid h-12 w-12 place-items-center rounded-2xl text-white">
              <ImagePlus className="h-6 w-6" />
            </span>
            <span className="text-sm font-medium text-navy-900">{broken ? 'Image not found. Upload a new one' : 'Drop an image or click to upload'}</span>
            <span className="text-xs">{frame ? 'You’ll crop it to fit the website next' : 'JPG, PNG or WEBP · up to 8 MB'}</span>
          </button>
        )}
        {busy && (
          <div className="absolute inset-0 grid place-items-center bg-white/70">
            <Loader2 className="h-7 w-7 animate-spin text-teal" />
          </div>
        )}
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
      </div>
      {frame && (
        <p className="text-center text-[11px] text-navy-800/45">
          Shown as: {frame.label} · {Math.round(frame.width)} × {Math.round(frame.width / frame.aspect)} px
        </p>
      )}
      <AnimatePresence>
        {cropSrc && (
          <ImageCropper
            src={cropSrc}
            frame={frame}
            onCancel={closeCropper}
            onDone={({ blob }) => {
              closeCropper();
              send(new File([blob], 'photo.jpg', { type: 'image/jpeg' }));
            }}
          />
        )}
      </AnimatePresence>
      <label className="flex items-center gap-2 rounded-xl border border-navy-900/10 bg-white px-3">
        <Link2 className="h-3.5 w-3.5 shrink-0 text-navy-800/40" />
        <input value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="…or paste an image URL" className="w-full bg-transparent py-2 text-xs focus:outline-none" />
        <button type="button" onClick={() => fileRef.current?.click()} className="shrink-0 text-navy-800/50 hover:text-teal" aria-label="Upload image">
          <Upload className="h-4 w-4" />
        </button>
      </label>
    </div>
  );
}

function ItemControls({ index, length, move, remove, controls }) {
  return (
    <div className="flex shrink-0 items-center gap-0.5 text-navy-800/40">
      {controls && (
        <span onPointerDown={(e) => controls.start(e)} className="cursor-grab touch-none rounded-lg p-1.5 hover:bg-navy-900/5 active:cursor-grabbing" title="Drag to reorder">
          <GripVertical className="h-4 w-4" />
        </span>
      )}
      <button type="button" disabled={index === 0} onClick={() => move(index, -1)} className="rounded-lg p-1.5 hover:bg-navy-900/5 disabled:opacity-30" aria-label="Move up">
        <ArrowUp className="h-3.5 w-3.5" />
      </button>
      <button type="button" disabled={index === length - 1} onClick={() => move(index, 1)} className="rounded-lg p-1.5 hover:bg-navy-900/5 disabled:opacity-30" aria-label="Move down">
        <ArrowDown className="h-3.5 w-3.5" />
      </button>
      <button type="button" onClick={() => remove(index)} className="rounded-lg p-1.5 hover:bg-sunset/10 hover:text-sunset" aria-label="Remove">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/** A list of short texts (highlights, features…). */
function StringList({ value, onChange, placeholder, multiline }) {
  const list = Array.isArray(value) ? value : [];
  const update = (i, v) => onChange(list.map((x, j) => (j === i ? v : x)));
  const move = (i, d) => {
    const next = [...list];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };
  const remove = (i) => onChange(list.filter((_, j) => j !== i));
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {list.map((item, i) => (
          <motion.div key={i} layout initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} className="flex items-start gap-2">
            <span className="mt-2.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-teal/10 text-[10px] font-bold text-teal">{i + 1}</span>
            <Tag value={item} rows={multiline ? 3 : undefined} onChange={(e) => update(i, e.target.value)} placeholder={placeholder} className={`${inputCls} ${multiline ? 'resize-y' : ''}`} />
            <ItemControls index={i} length={list.length} move={move} remove={remove} />
          </motion.div>
        ))}
      </AnimatePresence>
      <button type="button" onClick={() => onChange([...list, ''])} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-teal hover:bg-teal/10">
        <Plus className="h-3.5 w-3.5" /> Add item
      </button>
    </div>
  );
}

function ObjectItem({ item, index, length, fields, update, move, remove, title }) {
  const controls = useDragControls();
  return (
    <Reorder.Item value={item} dragListener={false} dragControls={controls} className="rounded-2xl border border-navy-900/10 bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-navy-800/60">
          {title} {index + 1}
        </span>
        <ItemControls index={index} length={length} move={move} remove={remove} controls={controls} />
      </div>
      <div className="grid gap-3 sm:grid-cols-6">
        {fields.map((f) => (
          <div key={f.key} className={f.span === 'full' ? 'sm:col-span-6' : f.span === 'third' ? 'sm:col-span-2' : 'sm:col-span-3'}>
            <Label field={f}>
              <FieldInput field={f} value={item[f.key]} onChange={(v) => update(index, f.key, v)} />
            </Label>
          </div>
        ))}
      </div>
    </Reorder.Item>
  );
}

/** A list of small records (itinerary days, experiences, values…). Items carry a hidden _k for stable keys. */
function ObjectList({ value, onChange, fields, itemLabel = 'Item' }) {
  // Index-based fallback keys stay identical across renders, so typing never remounts an input.
  const list = (Array.isArray(value) ? value : []).map((x, i) => (x && x._k ? x : { ...x, _k: `i${i}` }));
  const emit = (next) => onChange(next);
  const update = (i, key, v) => emit(list.map((x, j) => (j === i ? { ...x, [key]: v } : x)));
  const move = (i, d) => {
    const next = [...list];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    emit(next);
  };
  const remove = (i) => emit(list.filter((_, j) => j !== i));
  const blank = Object.fromEntries(fields.map((f) => [f.key, '']));

  return (
    <div className="space-y-3">
      <Reorder.Group axis="y" values={list} onReorder={emit} className="space-y-3">
        {list.map((item, i) => (
          <ObjectItem key={item._k} item={item} index={i} length={list.length} fields={fields} update={update} move={move} remove={remove} title={itemLabel} />
        ))}
      </Reorder.Group>
      <button
        type="button"
        onClick={() => emit([...list, { ...blank, _k: `n${Date.now()}` }])}
        className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-teal/40 px-4 py-2 text-xs font-semibold text-teal hover:bg-teal/5"
      >
        <Plus className="h-3.5 w-3.5" /> Add {itemLabel.toLowerCase()}
      </button>
    </div>
  );
}

function MonthsField({ value, onChange }) {
  const list = Array.isArray(value) ? value : [];
  const toggle = (m) => onChange(list.includes(m) ? list.filter((x) => x !== m) : [...list, m].sort((a, b) => a - b));
  return (
    <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-12">
      {MONTHS.map((m, i) => {
        const on = list.includes(i + 1);
        return (
          <button
            key={m}
            type="button"
            onClick={() => toggle(i + 1)}
            aria-pressed={on}
            className={`rounded-xl py-2 text-xs font-semibold transition ${on ? 'bg-feather text-white shadow' : 'bg-white text-navy-800/50 ring-1 ring-navy-900/10 hover:ring-teal/40'}`}
          >
            {m}
          </button>
        );
      })}
    </div>
  );
}

function IconField({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {Object.entries(ICONS).map(([name, Icon]) => (
        <button
          key={name}
          type="button"
          title={name}
          onClick={() => onChange(name)}
          aria-pressed={value === name}
          className={`grid h-10 w-10 place-items-center rounded-xl transition ${value === name ? 'bg-feather text-white shadow' : 'bg-white text-navy-800/60 ring-1 ring-navy-900/10 hover:text-teal'}`}
        >
          <Icon className="h-4.5 w-4.5" />
        </button>
      ))}
    </div>
  );
}

/** Live length guide: turns amber past the length that fits the design (the site still clamps longer text). */
function Counter({ value, max }) {
  if (!max) return null;
  const len = (value || '').length;
  const over = len > max;
  return (
    <p className={`mt-1 text-right text-[11px] tabular-nums ${over ? 'font-semibold text-gold' : 'text-navy-800/40'}`}>
      {over ? `${len - max} characters over the recommended ${max}; it may be shortened on the website` : `${len} / ${max}`}
    </p>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="inline-flex items-center gap-3 text-sm font-medium text-navy-900">
      <span className={`relative h-6 w-11 rounded-full transition-colors ${checked ? 'bg-emerald' : 'bg-navy-900/15'}`}>
        <motion.span layout transition={{ type: 'spring', stiffness: 500, damping: 30 }} className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow ${checked ? 'right-0.5' : 'left-0.5'}`} />
      </span>
      {label}
    </button>
  );
}

/** Renders the right control for a field definition. */
export function FieldInput({ field, value, onChange, options }) {
  switch (field.type) {
    case 'textarea':
      return (
        <>
          <textarea value={value ?? ''} rows={field.rows || 4} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} className={`${inputCls} resize-y`} />
          <Counter value={value} max={field.max} />
        </>
      );
    case 'number':
      return (
        <input
          type="number"
          value={value ?? ''}
          min={field.min}
          max={field.max}
          step={field.step || 'any'}
          onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
          placeholder={field.placeholder}
          className={inputCls}
        />
      );
    case 'select':
      return (
        <select value={value ?? ''} onChange={(e) => onChange(e.target.value)} className={`${inputCls} cursor-pointer`}>
          <option value="">Choose…</option>
          {(options || field.options).map((o) => {
            const v = typeof o === 'string' ? o : o.value;
            return (
              <option key={v} value={v}>
                {typeof o === 'string' ? o : o.label}
              </option>
            );
          })}
        </select>
      );
    case 'chips':
      return <ChipSelect options={options || field.options} value={value} onChange={onChange} />;
    case 'toggle':
      return <Toggle checked={Boolean(value)} onChange={onChange} label={field.toggleLabel} />;
    case 'image':
      return <ImageField value={value} onChange={onChange} frame={field.frame} />;
    case 'list':
      return <StringList value={value} onChange={onChange} placeholder={field.placeholder} multiline={field.multiline} />;
    case 'objects':
      return <ObjectList value={value} onChange={onChange} fields={field.fields} itemLabel={field.itemLabel} />;
    case 'months':
      return <MonthsField value={value} onChange={onChange} />;
    case 'icon':
      return <IconField value={value} onChange={onChange} />;
    case 'group':
      return (
        <div className="grid gap-3 rounded-2xl border border-navy-900/10 bg-white/60 p-4 sm:grid-cols-3">
          {field.fields.map((f) => (
            <Label key={f.key} field={f}>
              <FieldInput field={f} value={value?.[f.key]} onChange={(v) => onChange({ ...(value || {}), [f.key]: v })} />
            </Label>
          ))}
        </div>
      );
    default:
      return (
        <>
          <input
            type={field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text'}
            value={value ?? ''}
            maxLength={255}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={inputCls}
          />
          <Counter value={value} max={field.max} />
        </>
      );
  }
}

/** Removes the internal _k keys before saving. */
export function cleanForSave(fields, data) {
  const out = { ...data };
  for (const f of fields) {
    if (f.type === 'objects' && Array.isArray(out[f.key])) {
      out[f.key] = out[f.key].map(({ _k, ...rest }) => rest);
    }
    if (f.type === 'list' && Array.isArray(out[f.key])) {
      out[f.key] = out[f.key].map((s) => s.trim()).filter(Boolean);
    }
  }
  return out;
}
