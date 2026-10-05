import { Play } from 'lucide-react';
import SmartImage from '../ui/SmartImage.jsx';
import Stars from '../ui/Stars.jsx';

/** Story card from the home-page carousel. Long quotes are clamped so the card never overflows. */
export default function TestimonialCard({ t, onPlay, focusable = true }) {
  return (
    <div className="group relative h-full overflow-hidden rounded-[2rem] bg-navy-900 shadow-luxe">
      <SmartImage src={t.image} alt="" className="absolute inset-0 h-full w-full transition-transform duration-1000 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/50 to-navy-950/10" />
      <button
        type="button"
        tabIndex={focusable ? 0 : -1}
        onClick={(e) => {
          e.stopPropagation();
          onPlay?.(t);
        }}
        aria-label={`Play story from ${t.name}`}
        className="absolute top-1/3 left-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur-md transition hover:scale-110 hover:bg-sun hover:text-navy-900"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-white/20" />
        <Play className="relative ml-1 h-6 w-6 fill-current" />
      </button>
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
        <Stars rating={t.rating ?? 5} className="h-4 w-4" />
        <p className="mt-3 line-clamp-5 font-display text-xl leading-snug break-words text-white sm:text-2xl">“{t.quote}”</p>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/15 pt-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{t.name}</p>
            <p className="truncate text-xs text-white/60">{t.trip}</p>
          </div>
          {(t.flag || t.country) && (
            <span className="max-w-[45%] shrink-0 truncate rounded-full bg-white/10 px-3 py-1 text-xs text-white">
              {t.flag} {t.country}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
