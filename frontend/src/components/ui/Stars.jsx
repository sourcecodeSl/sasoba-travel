import { Star } from 'lucide-react';

export default function Stars({ rating = 5, className = 'h-4 w-4' }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`${className} ${i < Math.round(rating) ? 'fill-sun text-sun' : 'text-white/30'}`} />
      ))}
    </span>
  );
}
