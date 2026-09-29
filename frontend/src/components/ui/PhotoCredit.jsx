import { Camera } from 'lucide-react';

/** Attribution required by Creative Commons photo licences. */
export default function PhotoCredit({ credit, className = '' }) {
  if (!credit) return null;
  return (
    <a
      href={credit.source}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex max-w-[80vw] items-center gap-1.5 truncate rounded-full bg-navy-950/60 px-2.5 py-1 text-[10px] text-white/70 backdrop-blur transition hover:text-white ${className}`}
    >
      <Camera className="h-3 w-3 shrink-0" />
      <span className="truncate">
        {credit.author} · {credit.license} · Wikimedia Commons
      </span>
    </a>
  );
}
