import { Heart } from 'lucide-react';
import SmartImage from '../ui/SmartImage.jsx';
import { InstagramIcon } from '../ui/BrandIcons.jsx';

/** Square #SasobaMoments tile; details appear on hover. */
export default function MomentTile({ post, href, forceHover = false }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group relative block aspect-square overflow-hidden rounded-2xl"
      aria-label={`Instagram post by ${post.handle}`}
    >
      <SmartImage src={post.image} alt={post.caption || ''} className="h-full w-full transition-transform duration-700 group-hover:scale-110" />
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-navy-950/60 p-2 text-center text-white transition-opacity duration-300 group-hover:opacity-100 ${
          forceHover ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <InstagramIcon className="h-6 w-6" />
        <span className="max-w-full truncate text-xs font-medium">{post.handle}</span>
        {post.likes > 0 && (
          <span className="inline-flex items-center gap-1 text-xs text-white/80">
            <Heart className="h-3.5 w-3.5 fill-sunset text-sunset" /> {Number(post.likes).toLocaleString()}
          </span>
        )}
      </div>
    </a>
  );
}
