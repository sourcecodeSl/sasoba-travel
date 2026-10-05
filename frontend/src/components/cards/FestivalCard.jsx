import { CalendarDays, MapPin } from 'lucide-react';

/** Festival entry on the Cultural Escapes timeline (sits on a dark background). */
export default function FestivalCard({ f }) {
  return (
    <div className="glass rounded-3xl p-6 transition hover:bg-white/10">
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-sun">
        {f.month && (
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" /> {f.month}
          </span>
        )}
        {f.place && (
          <span className="flex items-center gap-1.5 text-white/60">
            <MapPin className="h-3.5 w-3.5" /> {f.place}
          </span>
        )}
      </div>
      <h3 className="mt-2 font-display text-2xl font-semibold break-words text-white">{f.name}</h3>
      {f.text && <p className="mt-1 line-clamp-4 text-sm text-white/70">{f.text}</p>}
    </div>
  );
}
