import { useState } from 'react'

/**
 * Image with an art-directed fallback: if a photo ever fails to load we show a
 * paper-toned panel with the dish name instead of a broken-image icon.
 */
export default function Photo({ src, alt, fallbackLabel, position = '50% 50%', className = '', imgClassName = '', eager = false }) {
  const [failed, setFailed] = useState(false)

  return (
    <div className={`${/\babsolute\b/.test(className) ? '' : 'relative'} overflow-hidden bg-cream ${className}`}>
      {failed ? (
        <div
          role="img"
          aria-label={alt}
          className="grain absolute inset-0 flex items-start bg-[linear-gradient(135deg,#efe8d8,#e4dcc6)] p-5"
        >
          <span className="pr-24 font-display text-2xl leading-tight text-forest/80">{fallbackLabel ?? alt}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
          style={{ objectPosition: position }}
          className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
        />
      )}
    </div>
  )
}
