import { Link } from 'react-router-dom';
import { DESTINATIONS } from '../data/destinations.js';

export default function DestinationsMarquee() {
  const items = DESTINATIONS.filter((d) => d.slug !== 'colombo');
  return (
    <section aria-label="Destinations" className="relative overflow-hidden border-y border-white/5 bg-navy-950 py-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-navy-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-navy-950 to-transparent" />
      <div className="flex w-max animate-[marquee_70s_linear_infinite] will-change-transform hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:[animation-duration:140s]">
        {[...items, ...items].map((d, i) => (
          <Link
            key={`${d.slug}-${i}`}
            to={`/destinations/${d.slug}`}
            aria-hidden={i >= items.length}
            tabIndex={i >= items.length ? -1 : 0}
            className="flex shrink-0 items-center gap-10 pr-10 font-display text-2xl whitespace-nowrap text-white/70 italic transition hover:text-sun sm:text-3xl"
          >
            {d.name}
            <span className="bg-feather h-2 w-2 rounded-full" />
          </Link>
        ))}
      </div>
    </section>
  );
}
