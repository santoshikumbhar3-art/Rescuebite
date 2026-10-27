import { useCallback, useEffect, useRef, useState } from 'react'
import { Clock, Info, Loader2, MapPin, X } from 'lucide-react'
import Photo from './Photo.jsx'
import PickupPass from './PickupPass.jsx'
import { clock, countdown, km, money } from '../lib/format.js'

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'

export default function ReservationModal({ listing, reservation, now, onConfirm, onClose }) {
  const [leaving, setLeaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const panelRef = useRef(null)
  const timers = useRef([])

  const requestClose = useCallback(() => {
    setLeaving(true)
    timers.current.push(setTimeout(onClose, 180))
  }, [onClose])

  // Lock page scroll, manage focus and restore it on close.
  useEffect(() => {
    const previouslyFocused = document.activeElement
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    panelRef.current?.focus()
    const pending = timers.current
    return () => {
      document.body.style.overflow = overflow
      pending.forEach(clearTimeout)
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [])

  // Escape to close, Tab trapped inside the dialog.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') requestClose()
      if (e.key !== 'Tab' || !panelRef.current) return
      const nodes = [...panelRef.current.querySelectorAll(FOCUSABLE)]
      if (!nodes.length) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (e.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [requestClose])

  // Move focus to the top of the panel when the pass appears.
  useEffect(() => {
    if (reservation) panelRef.current?.focus()
  }, [reservation])

  const remaining = listing.deadline - now
  const unavailable = remaining <= 0 || listing.boxes <= 0

  const confirm = () => {
    setSubmitting(true)
    setError('')
    // Short pause so the confirmation feels deliberate; the reservation itself is local demo state.
    timers.current.push(
      setTimeout(() => {
        const result = onConfirm(listing.id)
        if (!result) {
          setError('Sorry — this box was just rescued by someone else or the pickup window closed.')
        }
        setSubmitting(false)
      }, 650),
    )
  }

  const titleId = `dialog-${listing.id}-title`

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div
        className={`absolute inset-0 bg-ink/55 ${leaving ? 'animate-fade-out' : 'animate-fade-in'}`}
        onClick={requestClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative max-h-[94vh] w-full overflow-y-auto rounded-t-md bg-ivory shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] focus:outline-none sm:max-w-4xl sm:rounded-sm ${
          leaving ? 'animate-panel-out' : 'animate-panel-in'
        }`}
      >
        <div className="sticky top-0 z-10 flex h-0 justify-end">
          <button
            type="button"
            onClick={requestClose}
            className="m-3 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ivory/95 text-ink shadow-sm transition-colors hover:bg-butter"
            aria-label="Close"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {reservation ? (
          <PickupPass reservation={reservation} now={now} titleId={titleId} onDone={requestClose} />
        ) : (
          <div className="grid md:grid-cols-[0.95fr_1.05fr]">
            <Photo
              src={listing.image}
              alt={listing.imageAlt}
              fallbackLabel={listing.name}
              position={listing.focal}
              className="aspect-[16/10] md:aspect-auto md:min-h-full"
            />

            <div className="flex flex-col p-6 sm:p-8 lg:p-10">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-tomato-ink">Reserve for pickup</p>
              <h2 id={titleId} className="mt-3 pr-10 font-display text-[2.2rem] leading-[1.02] text-forest sm:text-[2.6rem]">
                {listing.name}
              </h2>
              <p className="mt-1.5 text-ink/75">
                from <span className="font-medium text-ink">{listing.restaurant}</span> · {km(listing.distanceKm)} from campus
              </p>

              <div className="mt-6 flex items-baseline gap-3 border-y border-ink/15 py-4">
                <span className={`font-display text-5xl leading-none ${listing.price === 0 ? 'text-tomato-ink' : 'text-forest'}`}>
                  {money(listing.price)}
                </span>
                <s className="text-lg text-ink/55">{money(listing.originalPrice)}</s>
                <span className="ml-auto text-right text-sm text-ink/70">
                  You save
                  <br />
                  <strong className="font-semibold text-forest">{money(listing.originalPrice - listing.price)}</strong>
                </span>
              </div>

              <p className="mt-5 text-[15px] leading-relaxed text-ink/75">
                <span className="font-display italic text-forest">Inside:</span> {listing.contents}
              </p>

              <dl className="mt-6 space-y-4 text-[15px]">
                <div className="flex gap-3">
                  <dt>
                    <MapPin className="mt-0.5 h-4 w-4 text-forest" aria-hidden="true" />
                    <span className="sr-only">Pickup address</span>
                  </dt>
                  <dd>
                    <span className="font-medium">{listing.address}</span>
                    <span className="mt-0.5 block text-sm text-ink/65">{listing.instructions}</span>
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt>
                    <Clock className="mt-0.5 h-4 w-4 text-forest" aria-hidden="true" />
                    <span className="sr-only">Pickup window</span>
                  </dt>
                  <dd>
                    Collect before <span className="font-medium">{clock(listing.deadline)}</span>
                    <span className="text-ink/60"> · {remaining > 0 ? `${countdown(remaining)} left` : 'closed'}</span>
                    <span className="mt-0.5 block text-sm text-ink/65">
                      {listing.boxes} {listing.boxes === 1 ? 'box' : 'boxes'} remaining
                    </span>
                  </dd>
                </div>
              </dl>

              {error && (
                <p role="alert" className="mt-5 border-l-2 border-tomato bg-tomato/10 px-3 py-2 text-sm text-tomato-ink">
                  {error}
                </p>
              )}

              <div className="mt-8">
                <button
                  type="button"
                  onClick={confirm}
                  disabled={submitting || unavailable}
                  className="flex w-full items-center justify-center gap-2 rounded-sm bg-forest px-6 py-4 text-[15px] font-medium text-ivory shadow-[4px_4px_0_0_#252923] transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#252923] disabled:cursor-not-allowed disabled:bg-ink/20 disabled:text-ink/50 disabled:shadow-none"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Reserving your box…
                    </>
                  ) : unavailable ? (
                    'No longer available'
                  ) : (
                    `Confirm reservation · ${money(listing.price)}`
                  )}
                </button>
                <p className="mt-4 flex gap-2 text-xs leading-relaxed text-ink/60">
                  <Info className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  Demo mode: this simulates a reservation in your browser. No payment is taken and no order is sent to
                  the restaurant.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
