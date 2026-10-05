import { useCallback, useEffect, useState } from 'react';
import Cropper from 'react-easy-crop';
import { motion } from 'framer-motion';
import { Crop, Loader2, RotateCcw, RotateCw, X, ZoomIn, ZoomOut } from 'lucide-react';

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('This image can’t be edited here. Please upload the file instead.'));
    img.src = src;
  });

/** Renders the chosen area to a JPEG at most `maxWidth` wide (never upscaled). */
async function renderCrop(src, area, rotation, maxWidth, aspect) {
  const img = await loadImage(src);
  const rad = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));
  const bw = img.width * cos + img.height * sin;
  const bh = img.width * sin + img.height * cos;

  // Draw the rotated image onto a canvas the size of its bounding box…
  const stage = document.createElement('canvas');
  stage.width = bw;
  stage.height = bh;
  const s = stage.getContext('2d');
  s.translate(bw / 2, bh / 2);
  s.rotate(rad);
  s.drawImage(img, -img.width / 2, -img.height / 2);

  // …then copy the cropped area out at the target size.
  const width = Math.round(Math.min(maxWidth, area.width));
  const height = Math.round(width / aspect);
  const out = document.createElement('canvas');
  out.width = width;
  out.height = height;
  const o = out.getContext('2d');
  o.imageSmoothingQuality = 'high';
  o.fillStyle = '#ffffff';
  o.fillRect(0, 0, width, height);
  o.drawImage(stage, area.x, area.y, area.width, area.height, 0, 0, width, height);

  return new Promise((resolve, reject) =>
    out.toBlob((blob) => (blob ? resolve({ blob, width, height }) : reject(new Error('Could not process the image.'))), 'image/jpeg', 0.86)
  );
}

/**
 * Full-screen cropper locked to the shape the website uses for this image.
 *   frame: { aspect, width, label, safe }  — `safe` describes where text overlays the image
 */
export default function ImageCropper({ src, frame, onCancel, onDone }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [area, setArea] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [natural, setNatural] = useState(null);
  const [frameSize, setFrameSize] = useState(null); // on-screen crop frame, for the text guide

  useEffect(() => {
    loadImage(src)
      .then((img) => setNatural({ w: img.width, h: img.height }))
      .catch((e) => setError(e.message));
  }, [src]);

  useEffect(() => {
    // Capture Esc first so it closes only the cropper, not the editor behind it.
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      e.stopImmediatePropagation();
      onCancel();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onCancel]);

  const onComplete = useCallback((_, pixels) => setArea(pixels), []);

  const apply = async () => {
    if (!area) return;
    setBusy(true);
    setError('');
    try {
      onDone(await renderCrop(src, area, rotation, frame.width, frame.aspect));
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  };

  const outW = area ? Math.round(Math.min(frame.width, area.width)) : null;
  const lowRes = outW !== null && outW < frame.width * 0.6;

  return (
    <motion.div className="fixed inset-0 z-[160] flex flex-col bg-navy-950/95 backdrop-blur" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <header className="flex items-center gap-4 px-5 py-4 text-white sm:px-8">
        <span className="bg-feather grid h-10 w-10 place-items-center rounded-xl">
          <Crop className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-2xl font-semibold">Crop for the website</h2>
          <p className="truncate text-xs text-white/55">{frame.label}. Drag to position, scroll or use the slider to zoom.</p>
        </div>
        <button type="button" onClick={onCancel} aria-label="Cancel" className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white">
          <X className="h-6 w-6" />
        </button>
      </header>

      <div className="relative flex-1">
        {!error && (
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={frame.aspect}
            minZoom={1}
            maxZoom={4}
            zoomSpeed={0.15}
            showGrid
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onComplete}
            onCropSizeChange={setFrameSize}
            mediaProps={{ crossOrigin: 'anonymous' }}
            style={{ cropAreaStyle: { border: '2px solid #fbbf24', borderRadius: frame.round ? '50%' : 14, boxShadow: '0 0 0 9999px rgb(6 15 30 / 0.72)' } }}
          />
        )}
        {/* Where the website places text over this image */}
        {frame.safe && frameSize && !error && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="relative" style={{ width: frameSize.width, height: frameSize.height }}>
              <div className="absolute inset-x-0 bottom-0 flex items-end rounded-b-[14px] bg-gradient-to-t from-navy-950/70 to-transparent p-3" style={{ height: frame.safe }}>
                <span className="rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white/80">Title & text appear here</span>
              </div>
            </div>
          </div>
        )}
        {error && <p className="absolute inset-x-0 top-1/3 mx-auto max-w-md rounded-2xl bg-white p-5 text-center text-sm text-sunset">{error}</p>}
      </div>

      <footer className="flex flex-col gap-4 px-5 py-5 text-white sm:flex-row sm:items-center sm:px-8">
        <div className="flex flex-1 items-center gap-3">
          <ZoomOut className="h-4 w-4 text-white/50" />
          <input
            type="range"
            min={1}
            max={4}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            aria-label="Zoom"
            className="w-full max-w-xs accent-[#fbbf24]"
          />
          <ZoomIn className="h-4 w-4 text-white/50" />
          <span className="mx-2 h-6 w-px bg-white/15" />
          <button type="button" onClick={() => setRotation((r) => (r - 90 + 360) % 360)} className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white" aria-label="Rotate left">
            <RotateCcw className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => setRotation((r) => (r + 90) % 360)} className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white" aria-label="Rotate right">
            <RotateCw className="h-4 w-4" />
          </button>
        </div>
        <p className={`text-xs ${lowRes ? 'text-sun' : 'text-white/50'}`}>
          {outW ? `Saves as ${outW} × ${Math.round(outW / frame.aspect)} px` : natural ? '' : 'Loading…'}
          {lowRes && ' · low resolution, may look soft on large screens'}
        </p>
        <div className="flex gap-2">
          <button type="button" onClick={onCancel} className="rounded-full px-5 py-2.5 text-sm font-semibold text-white/70 hover:bg-white/10">
            Cancel
          </button>
          <button
            type="button"
            onClick={apply}
            disabled={busy || !area || !!error}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-sunset px-6 py-2.5 text-sm font-semibold text-navy-900 shadow-glow disabled:opacity-50"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crop className="h-4 w-4" />} Crop & use photo
          </button>
        </div>
      </footer>
    </motion.div>
  );
}
