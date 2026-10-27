import { ArrowRight, Clock, MapPin } from 'lucide-react'
import Photo from './Photo.jsx'
import { countdown, km, money, pad2, percentOff } from '../lib/format.js'

/*
 * Art-directed layout pattern for the 12-column grid (lg).
 * Rows: [feature 7 | tall 5] [small 4 | small 4 ↓ | small 4] [tall 5 | feature 7 ⇄] [banner 12]
 */
const PATTERN = ['feature', 'tall', 'small', 'smallOffset', 'small', 'tall', 'featureReverse', 'banner']
const ROW_STARTS = new Set([0, 2, 5, 7])

export function variantFor(position, count) {
  const slot = position % PATTERN.length
  const isLast = position === count - 1
  // A lone last card gets the full-width banner treatment instead of leaving a hole.
  if (isLast && ROW_STARTS.has(slot)) return 'banner'
  return PATTERN[slot]
}

const VARIANTS = {
  feature: {
    item: 'md:col-span-12 lg:col-span-7',
    frame: 'border border-ink/15 lg:flex-row',
    photo: 'aspect-[4/3] lg:aspect-auto lg:min-h-[440px] lg:w-[52%] lg:shrink-0',
    body: 'p-6 lg:p-8',
    title: 'text-[2.1rem] lg:text-[2.4rem]',
    spacious: true,
  },
  featureReverse: {
    item: 'md:col-span-12 lg:col-span-7',
    frame: 'border border-butter bg-butter/20 lg:flex-row-reverse',
    photo: 'aspect-[4/3] lg:aspect-auto lg:min-h-[420px] lg:w-[50%] lg:shrink-0',
    body: 'p-6 lg:p-8',
    title: 'text-[2.1rem] lg:text-[2.3rem]',
    spacious: true,
  },
  tall: {
    item: 'md:col-span-6 lg:col-span-5',
    frame: 'border border-sage/70 bg-sage/20',
    photo: 'aspect-[5/4]',
    body: 'p-6',
    title: 'text-[1.9rem]',
    spacious: false,
  },
  small: {
    item: 'md:col-span-6 lg:col-span-4',
    frame: '',
    photo: 'aspect-square',
    body: 'px-0 pb-0 pt-5',
    title: 'text-[1.7rem]',
    spacious: false,
  },
  smallOffset: {
    item: 'md:col-span-6 lg:col-span-4 lg:mt-14',
    frame: 'border border-ink/10 bg-paper p-3 shadow-[0_24px_40px_-30px_rgba(37,41,35,0.45)]',
    photo: 'aspect-[4/5]',
    body: 'px-3 pb-3 pt-5',
    title: 'text-[1.7rem]',
    spacious: false,
  },
  banner: {
    item: 'md:col-span-12',
    frame: 'bg-forest text-ivory lg:flex-row',
    photo: 'aspect-[16/10] lg:aspect-auto lg:min-h-[420px] lg:w-[58%] lg:shrink-0',
    body: 'p-6 lg:p-10',
    title: 'text-[2.2rem] lg:text-[3rem]',
    spacious: true,
    dark: true,
  },
}

function BoxesLeft({ boxes, dark }) {
  const shown = Math.min(boxes, 7)
  return (
    <p className={`flex items-center gap-2 text-sm ${dark ? 'text-ivory/80' : 'text-ink/70'}`}>
      <span className="flex gap-[3px]" aria-hidden="true">
        {Array.from({ length: shown }, (_, i) => (
          <span key={i} className={`h-2.5 w-2.5 ${dark ? 'bg-butter' : 'bg-forest'}`} />
        ))}
        {boxes === 0 && <span className={`h-2.5 w-2.5 border ${dark ? 'border-ivory/40' : 'border-ink/30'}`} />}
      </span>
      {boxes === 0 ? 'All rescued' : `${boxes} ${boxes === 1 ? 'box' : 'boxes'} left`}
    </p>
  )
}

export default function FoodCard({ listing, number, variant, now, onReserve }) {
  const v = VARIANTS[variant]
  const dark = Boolean(v.dark)
  const remaining = listing.deadline - now
  const expired = remaining <= 0
  const soldOut = listing.boxes <= 0
  const urgent = !expired && remaining < 30 * 60_000
  const unavailable = expired || soldOut
  const isFree = listing.price === 0

  const muted = dark ? 'text-ivory/70' : 'text-ink/60'
  const headingColor = dark ? 'text-ivory' : 'text-forest'

  return (
    <li className={`${v.item} animate-rise`}>
      <article
        aria-labelledby={`${listing.id}-title`}
        className={`group flex h-full flex-col overflow-hidden rounded-sm ${v.frame} ${unavailable ? 'opacity-80' : ''}`}
      >
        <div className={`relative overflow-hidden ${v.photo}`}>
          <Photo
            src={listing.image}
            alt={listing.imageAlt}
            fallbackLabel={listing.name}
            position={listing.focal}
            className="absolute inset-0"
            imgClassName={`transition-transform duration-[900ms] ease-out group-hover:scale-[1.045] ${unavailable ? 'grayscale-[60%]' : ''}`}
          />

          {/* Price sticker */}
          <div
            className={`absolute right-4 top-4 flex h-[74px] w-[74px] rotate-[8deg] flex-col items-center justify-center rounded-full text-center shadow-[0_8px_18px_-10px_rgba(37,41,35,0.7)] ${
              isFree ? 'bg-tomato text-ivory' : 'bg-butter text-ink'
            }`}
          >
            {isFree ? (
              <>
                <span className="font-display text-xl leading-none">Free</span>
                <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.12em]">today</span>
              </>
            ) : (
              <>
                <span className="font-display text-[1.45rem] leading-none">{percentOff(listing.originalPrice, listing.price)}%</span>
                <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.14em]">off</span>
              </>
            )}
          </div>

          {/* Editorial paper label */}
          {listing.label && (
            <span className="absolute bottom-4 left-4 -rotate-2 bg-ivory px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink shadow-sm">
              {listing.label}
            </span>
          )}

          {soldOut && (
            <span className="absolute inset-0 grid place-items-center bg-ink/35">
              <span className="-rotate-6 border-2 border-ivory px-4 py-1.5 font-display text-2xl uppercase tracking-wide text-ivory">
                All rescued
              </span>
            </span>
          )}
        </div>

        <div className={`flex flex-1 flex-col ${v.body}`}>
          <div className={`flex items-center justify-between gap-3 text-[11px] font-medium uppercase tracking-[0.18em] ${muted}`}>
            <span>
              N°{pad2(number)} — {listing.category}
            </span>
            <span className="inline-flex items-center gap-1 normal-case tracking-normal">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {km(listing.distanceKm)} from campus
            </span>
          </div>

          <h3 id={`${listing.id}-title`} className={`mt-3 font-display leading-[1.02] ${v.title} ${headingColor}`}>
            {listing.name}
          </h3>
          <p className={`mt-1.5 text-[15px] ${dark ? 'text-ivory/85' : 'text-ink/75'}`}>
            from <span className={`font-medium ${dark ? 'text-ivory' : 'text-ink'}`}>{listing.restaurant}</span>
          </p>

          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Dietary information">
            {listing.tags.map((tag) => (
              <li
                key={tag}
                className={`border px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.12em] ${
                  dark ? 'border-ivory/30 text-ivory/90' : 'border-ink/20 text-ink/75'
                }`}
              >
                {tag}
              </li>
            ))}
          </ul>

          {v.spacious && (
            <p className={`mt-5 max-w-md text-[15px] leading-relaxed ${dark ? 'text-ivory/80' : 'text-ink/70'}`}>
              <span className={`font-display italic ${dark ? 'text-butter' : 'text-forest'}`}>Inside:</span> {listing.contents}
            </p>
          )}

          <div className={`mt-auto pt-6`}>
            <div className={`flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-t pt-4 ${dark ? 'border-ivory/20' : 'border-ink/15'}`}>
              <p className="flex items-baseline gap-2.5">
                <span className="sr-only">Rescue price</span>
                <span
                  className={`font-display text-[2.4rem] leading-none tabular-nums ${
                    isFree ? (dark ? 'text-butter' : 'text-tomato-ink') : headingColor
                  }`}
                >
                  {money(listing.price)}
                </span>
                <span className="sr-only">Original price</span>
                <s className={`text-base tabular-nums ${muted}`}>{money(listing.originalPrice)}</s>
              </p>

              <div className="flex flex-col items-end gap-1.5 text-right">
                <p className={`flex items-center gap-1.5 text-sm ${dark ? 'text-ivory/85' : 'text-ink/75'}`}>
                  {urgent && (
                    <span className="mr-1 bg-tomato px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-ivory">
                      Last call
                    </span>
                  )}
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {expired ? (
                    <span>Pickup closed</span>
                  ) : (
                    <span>
                      closes in{' '}
                      <time
                        className={`font-semibold tabular-nums ${urgent ? (dark ? 'text-butter' : 'text-tomato-ink') : dark ? 'text-ivory' : 'text-ink'}`}
                        aria-label={`${Math.floor(remaining / 60000)} minutes`}
                      >
                        {countdown(remaining)}
                      </time>
                    </span>
                  )}
                </p>
                <BoxesLeft boxes={listing.boxes} dark={dark} />
              </div>
            </div>

            <button
              type="button"
              onClick={() => onReserve(listing.id)}
              disabled={unavailable}
              className={`group/btn mt-5 flex w-full items-center justify-between rounded-sm px-5 py-3.5 text-[15px] font-medium transition-colors duration-200 disabled:cursor-not-allowed ${
                dark
                  ? 'bg-ivory text-forest hover:bg-butter disabled:bg-ivory/30 disabled:text-ivory/70'
                  : 'bg-forest text-ivory hover:bg-forest-deep disabled:bg-ink/10 disabled:text-ink/50'
              }`}
            >
              <span>{soldOut ? 'All rescued — check back tomorrow' : expired ? 'Pickup window closed' : 'Reserve for pickup'}</span>
              {!unavailable && (
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </article>
    </li>
  )
}
