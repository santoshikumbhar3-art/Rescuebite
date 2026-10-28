import { useState } from 'react'
import confetti from 'canvas-confetti'
import { QrCode, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Sparkles, RefreshCw, Clock, Ticket } from 'lucide-react'
import { playSuccessChime } from '../lib/sound.js'
import { clock, money } from '../lib/format.js'

export default function VerificationTerminal({
  reservations = [],
  onVerifyReservation,
  onClose,
}) {
  const [pinInput, setPinInput] = useState('')
  const [scanResult, setScanResult] = useState(null) // { status: 'success' | 'already_claimed' | 'not_found', reservation?: obj }
  const [isScanning, setIsScanning] = useState(false)

  // Find all pending reservations waiting for pickup
  const pendingReservations = reservations.filter((r) => r.status !== 'claimed')
  const claimedReservations = reservations.filter((r) => r.status === 'claimed')

  const handleVerify = (codeToVerify) => {
    const raw = (codeToVerify || pinInput).trim().toUpperCase()
    if (!raw) return

    // Extract PIN if full QR payload was pasted: "RESCUEBITE|DEMO|RB-1234|..."
    let targetPin = raw
    if (raw.includes('|')) {
      const parts = raw.split('|')
      if (parts.length >= 3) targetPin = parts[2]
    }
    // Handle short 4-digit input like "4821" -> "RB-4821"
    if (!targetPin.startsWith('RB-') && targetPin.length === 4) {
      targetPin = `RB-${targetPin}`
    }

    const matched = reservations.find(
      (r) => r.pin.toUpperCase() === targetPin || r.id.toUpperCase() === targetPin,
    )

    if (!matched) {
      setScanResult({
        status: 'not_found',
        searchedPin: targetPin,
      })
      return
    }

    if (matched.status === 'claimed') {
      setScanResult({
        status: 'already_claimed',
        reservation: matched,
      })
      return
    }

    // Success! Verify pickup
    onVerifyReservation(matched.id)
    playSuccessChime()
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#234b38', '#d85c43', '#f0cb78', '#efe8d8'],
      })
    } catch {
      // Confetti fallback
    }

    setScanResult({
      status: 'success',
      reservation: {
        ...matched,
        status: 'claimed',
        claimedAt: Date.now(),
      },
    })
    setPinInput('')
  }

  const handleSimulateQuickScan = (reservation) => {
    setIsScanning(true)
    setTimeout(() => {
      setIsScanning(false)
      handleVerify(reservation.pin)
    }, 450)
  }

  const resetResult = () => {
    setScanResult(null)
    setPinInput('')
  }

  return (
    <div className="grain rounded-sm border border-ink/20 bg-paper p-5 shadow-lg sm:p-8">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-sm bg-forest text-ivory">
            <QrCode className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-2xl leading-none text-forest sm:text-3xl">
              Kitchen Redemption Terminal
            </h2>
            <p className="mt-1 text-xs text-ink/70">
              Verify student QR passes or Rescue PINs to complete handover
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-forest/30 bg-forest/10 px-3 py-1 text-xs font-semibold text-forest">
            <span className="h-2 w-2 rounded-full bg-forest animate-pulse" />
            Scanner Active
          </span>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-medium text-ink/60 hover:text-ink underline"
            >
              Back to Shelf
            </button>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-12">
        {/* Left Column: Scanner & Keypad (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          {/* Simulated Optical Viewfinder */}
          <div className="relative overflow-hidden rounded-sm border-2 border-dashed border-forest/40 bg-ink/5 p-6 text-center">
            <div className="mx-auto flex h-36 w-36 flex-col items-center justify-center rounded-lg border-2 border-forest bg-forest/5 p-4 shadow-inner">
              <QrCode
                className={`h-16 w-16 text-forest transition-transform duration-300 ${
                  isScanning ? 'scale-110 text-tomato animate-pulse' : ''
                }`}
              />
              <span className="mt-2 text-[10px] font-mono uppercase tracking-wider text-forest/70">
                {isScanning ? 'Reading pass...' : 'Align QR Code'}
              </span>
            </div>

            <p className="mt-4 text-xs font-medium text-ink/75">
              Simulate camera scan with active demo passes:
            </p>

            {/* Quick Demo Scan Buttons */}
            {pendingReservations.length > 0 ? (
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {pendingReservations.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    disabled={isScanning}
                    onClick={() => handleSimulateQuickScan(r)}
                    className="group inline-flex items-center gap-2 rounded-sm border border-tomato/40 bg-white px-3 py-1.5 text-xs font-semibold text-tomato shadow-xs transition-all hover:border-tomato hover:bg-tomato hover:text-white"
                  >
                    <Sparkles className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                    <span>⚡ Quick Scan {r.pin}</span>
                    <span className="text-[10px] opacity-75">({r.listing.restaurant})</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-xs italic text-ink/50">
                No student reservations currently waiting. Reserve a box on the shelf first to test!
              </p>
            )}
          </div>

          {/* Manual PIN / Code Entry */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleVerify()
            }}
            className="rounded-sm border border-ink/15 bg-white p-5 shadow-xs"
          >
            <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-ink/70">
              Or Enter 4-Digit Rescue PIN Manually
            </label>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="e.g. RB-4821 or 4821"
                className="w-full rounded-xs border border-ink/20 px-3 py-2.5 font-mono text-base font-bold uppercase tracking-wider text-ink focus:border-forest focus:outline-none"
              />
              <button
                type="submit"
                disabled={!pinInput.trim()}
                className="inline-flex items-center gap-1.5 rounded-xs bg-forest px-5 py-2.5 text-sm font-semibold text-ivory transition-colors hover:bg-forest-deep disabled:opacity-40"
              >
                <span>Verify</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-ink/55">
              Cashiers can type just the 4 digits or the full code from the student's phone.
            </p>
          </form>

          {/* Scan Result Feedback Banner */}
          {scanResult && (
            <div
              className={`rounded-sm border p-5 transition-all ${
                scanResult.status === 'success'
                  ? 'border-forest/40 bg-forest/10 text-forest'
                  : scanResult.status === 'already_claimed'
                  ? 'border-tomato/40 bg-tomato/10 text-tomato-ink'
                  : 'border-ink/20 bg-ink/5 text-ink'
              }`}
            >
              {scanResult.status === 'success' && (
                <div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-6 w-6 text-forest" />
                    <h3 className="font-display text-xl leading-none text-forest">
                      Verified! Hand Over the Box 🎉
                    </h3>
                  </div>
                  <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                    <div>
                      <span className="font-semibold uppercase tracking-wider text-forest/70">
                        Meal Item:
                      </span>
                      <p className="font-bold text-ink">{scanResult.reservation.listing.name}</p>
                    </div>
                    <div>
                      <span className="font-semibold uppercase tracking-wider text-forest/70">
                        Rescue PIN:
                      </span>
                      <p className="font-mono font-bold text-forest">{scanResult.reservation.pin}</p>
                    </div>
                    <div>
                      <span className="font-semibold uppercase tracking-wider text-forest/70">
                        Collect Amount:
                      </span>
                      <p className="font-bold text-forest">
                        {money(scanResult.reservation.listing.price)}
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold uppercase tracking-wider text-forest/70">
                        Impact Added:
                      </span>
                      <p className="font-bold text-tomato">+1 Meal Rescued · +2.5 kg CO₂</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={resetResult}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xs bg-forest px-3.5 py-1.5 text-xs font-semibold text-ivory hover:bg-forest-deep"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Ready for Next Customer
                  </button>
                </div>
              )}

              {scanResult.status === 'already_claimed' && (
                <div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-tomato" />
                    <h3 className="font-display text-lg text-tomato-ink">
                      Warning: Pass Already Redeemed
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-ink/80">
                    PIN <span className="font-mono font-bold">{scanResult.reservation.pin}</span> was already marked collected at {clock(scanResult.reservation.claimedAt || Date.now())}. Double-claiming is blocked.
                  </p>
                  <button
                    type="button"
                    onClick={resetResult}
                    className="mt-3 text-xs underline text-ink/70 hover:text-ink"
                  >
                    Clear alert
                  </button>
                </div>
              )}

              {scanResult.status === 'not_found' && (
                <div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-ink/70" />
                    <h3 className="font-display text-lg text-ink">PIN Not Found</h3>
                  </div>
                  <p className="mt-1 text-xs text-ink/80">
                    No active reservation matching <span className="font-mono font-bold">{scanResult.searchedPin}</span>. Please verify the code on the student's screen.
                  </p>
                  <button
                    type="button"
                    onClick={resetResult}
                    className="mt-3 text-xs underline text-ink/70 hover:text-ink"
                  >
                    Try another code
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Queue & Activity Log (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          {/* Awaiting Pickup Queue */}
          <div className="rounded-sm border border-ink/15 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-forest">
                <Clock className="h-4 w-4" />
                Awaiting Pickup ({pendingReservations.length})
              </h3>
              <span className="text-[11px] text-ink/50">Live queue</span>
            </div>

            {pendingReservations.length === 0 ? (
              <div className="py-8 text-center">
                <Ticket className="mx-auto h-8 w-8 text-ink/25" />
                <p className="mt-2 text-xs text-ink/50">Queue is clear! All reserved meals collected.</p>
              </div>
            ) : (
              <ul className="mt-3 divide-y divide-ink/10 text-xs">
                {pendingReservations.map((r) => (
                  <li key={r.id} className="py-2.5 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-forest">{r.pin}</span>
                        <span className="text-[10px] rounded bg-tomato/15 px-1 font-semibold text-tomato">Pending</span>
                      </div>
                      <p className="truncate font-medium text-ink">{r.listing.name}</p>
                      <p className="text-[10px] text-ink/55">Reserved at {clock(r.createdAt)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleVerify(r.pin)}
                      className="shrink-0 rounded-xs border border-forest/40 bg-forest/5 px-2.5 py-1 text-[11px] font-semibold text-forest hover:bg-forest hover:text-ivory"
                    >
                      Redeem
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Rescued History Log */}
          <div className="rounded-sm border border-ink/15 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-forest">
                <ShieldCheck className="h-4 w-4 text-forest" />
                Recently Handed Over ({claimedReservations.length})
              </h3>
              <span className="text-[10px] font-bold text-forest">Verified</span>
            </div>

            {claimedReservations.length === 0 ? (
              <div className="py-6 text-center text-xs text-ink/40">
                Redeem a pass above to view verification history.
              </div>
            ) : (
              <ul className="mt-3 divide-y divide-ink/10 text-xs">
                {claimedReservations.slice(-4).reverse().map((r) => (
                  <li key={r.id} className="py-2 flex items-center justify-between">
                    <div>
                      <span className="font-mono font-semibold text-forest line-through">{r.pin}</span>
                      <p className="font-medium text-ink/80">{r.listing.name}</p>
                    </div>
                    <span className="text-[11px] font-semibold text-forest">
                      Rescued · {clock(r.claimedAt || Date.now())}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
