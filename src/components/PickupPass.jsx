import { QRCodeSVG } from 'qrcode.react'
import { Check, Clock, MapPin, CheckCircle2 } from 'lucide-react'
import { clock, countdown, money } from '../lib/format.js'

export default function PickupPass({ reservation, now, titleId, onDone }) {
  const { listing, pin, createdAt, status, claimedAt } = reservation
  const remaining = listing.deadline - now
  const qrValue = `RESCUEBITE|DEMO|${pin}|${listing.id}|${createdAt}`
  const isClaimed = status === 'claimed'

  return (
    <div className="grain px-5 pb-8 pt-10 sm:px-10 sm:pb-10">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-3">
          <span
            className={`animate-rise grid h-9 w-9 place-items-center rounded-full ${
              isClaimed ? 'bg-forest text-ivory' : 'bg-tomato text-ivory'
            }`}
          >
            {isClaimed ? <CheckCircle2 className="h-5 w-5" /> : <Check className="h-5 w-5" />}
          </span>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-forest">
            {isClaimed ? 'Pickup verified & complete · demo' : 'Reservation confirmed · demo'}
          </p>
        </div>
        <h2 id={titleId} className="mt-4 font-display text-4xl leading-[1.02] text-forest sm:text-5xl">
          {isClaimed ? (
            <>Box collected. <em className="text-forest">Enjoy your meal!</em></>
          ) : (
            <>Your box is saved. <em className="text-tomato">Go get it.</em></>
          )}
        </h2>
        <p className="mt-3 max-w-lg text-ink/70">
          {isClaimed
            ? 'This pass has been verified by the kitchen counter. Thank you for rescuing surplus food!'
            : 'Show this pass at the counter. The kitchen scans the QR code or checks your rescue PIN.'}
        </p>

        {/* Ticket */}
        <article
          aria-label="Digital pickup pass"
          className="relative mt-8 overflow-hidden rounded-sm border border-ink/15 bg-paper shadow-[0_30px_50px_-35px_rgba(37,41,35,0.6)]"
        >
          <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 bg-forest px-5 py-3 text-ivory sm:px-7">
            <span className="whitespace-nowrap font-display text-lg">
              Rescue<em>Bite</em> <span className="text-sm not-italic text-ivory/70">pickup pass</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-butter">Demo · not a real booking</span>
          </header>

          <div className="grid gap-6 p-5 sm:grid-cols-[auto_1fr] sm:gap-8 sm:p-7">
            <div className="mx-auto flex flex-col items-center sm:mx-0">
              <div className="border border-ink/15 bg-white p-3">
                <QRCodeSVG value={qrValue} size={156} level="M" fgColor="#252923" bgColor="#ffffff" title={`QR code for pickup PIN ${pin}`} />
              </div>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/50">Rescue PIN</p>
              <p className="font-display text-[2.4rem] leading-none tracking-wide text-forest tabular-nums">{pin}</p>
            </div>

            <div className="relative min-w-0">
              {isClaimed ? (
                <span
                  aria-hidden="true"
                  className="animate-stamp absolute -top-1 right-0 border-2 border-forest bg-forest/10 px-2.5 py-1 font-display text-lg uppercase tracking-wider text-forest"
                >
                  ✓ Collected
                </span>
              ) : (
                <span
                  aria-hidden="true"
                  className="animate-stamp absolute -top-1 right-0 border-2 border-tomato px-2.5 py-1 font-display text-lg uppercase tracking-wider text-tomato"
                >
                  Reserved
                </span>
              )}

              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink/55">Your meal</p>
              <h3 className="mt-1 pr-32 font-display text-[1.7rem] leading-tight text-forest">{listing.name}</h3>
              <p className="text-ink/75">
                from <span className="font-medium text-ink">{listing.restaurant}</span>
              </p>

              <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink/55">Price at pickup</dt>
                  <dd className="mt-1 flex items-baseline gap-2">
                    <span className="font-display text-2xl text-forest">{money(listing.price)}</span>
                    <s className="text-ink/50">{money(listing.originalPrice)}</s>
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink/55">Collect before</dt>
                  <dd className="mt-1 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-forest" aria-hidden="true" />
                    <span className="font-display text-2xl text-forest">{clock(listing.deadline)}</span>
                    <span className="text-ink/55">({remaining > 0 ? countdown(remaining) : 'closed'})</span>
                  </dd>
                </div>
              </dl>

              <div className="perforation my-5 h-1" aria-hidden="true" />

              <div className="flex gap-2.5 text-sm">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-forest" aria-hidden="true" />
                <p>
                  <span className="font-medium">{listing.address}</span>
                  <span className="mt-1 block text-ink/65">{listing.instructions}</span>
                </p>
              </div>
            </div>
          </div>

          <footer className="flex flex-wrap justify-between gap-2 border-t border-dashed border-ink/20 px-5 py-3 text-[11px] text-ink/55 sm:px-7">
            <span>
              {isClaimed
                ? `Handed over at ${clock(claimedAt || Date.now())} · Ref ${reservation.id.slice(-6).toUpperCase()}`
                : `Reserved ${clock(createdAt)} · Ref ${reservation.id.slice(-6).toUpperCase()}`}
            </span>
            <span>{isClaimed ? 'Verified by Kitchen Counter' : 'Simulated pass — no payment taken'}</span>
          </footer>
        </article>

        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          <button
            type="button"
            onClick={onDone}
            className="rounded-sm bg-forest px-6 py-3.5 text-[15px] font-medium text-ivory transition-colors hover:bg-forest-deep"
          >
            Done — back to the shelf
          </button>
          <p className="text-sm text-ink/60">Find this pass again under &ldquo;My pass&rdquo; in the top bar.</p>
        </div>
      </div>
    </div>
  )
}
