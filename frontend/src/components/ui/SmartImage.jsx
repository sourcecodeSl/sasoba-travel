import { useState } from 'react';

/**
 * Lazy image with a fade-in and a branded gradient fallback, so a missing
 * remote photo never leaves a broken-image icon on a luxury page.
 */
export default function SmartImage({ src, alt, className = '', eager = false, ...rest }) {
  const [status, setStatus] = useState('loading');
  // Respect a caller-supplied position (e.g. `absolute inset-0`) instead of forcing `relative`.
  const position = className.split(/\s+/).some((c) => ['absolute', 'fixed', 'sticky'].includes(c)) ? '' : 'relative';

  return (
    <div className={`${position} overflow-hidden bg-navy-800 ${className}`}>
      <div
        aria-hidden
        className={`absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#0d9488_0%,transparent_55%),radial-gradient(circle_at_80%_80%,#f59e0b_0%,transparent_50%),linear-gradient(135deg,#0a192f,#1a365d)] transition-opacity duration-700 ${
          status === 'loaded' ? 'opacity-0' : 'opacity-100'
        }`}
      />
      {status !== 'error' && (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={`h-full w-full object-cover transition-opacity duration-700 ${
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          }`}
          {...rest}
        />
      )}
    </div>
  );
}
