import { useState, useMemo } from 'react'
import { Plus, QrCode, Store, TrendingUp, Clock, AlertTriangle, CheckCircle, PackagePlus, ArrowUpRight, Flame } from 'lucide-react'
import { money, countdown } from '../lib/format.js'
import VerificationTerminal from './VerificationTerminal.jsx'

export default function KitchenDashboard({
  listings = [],
  reservations = [],
  now,
  onOpenPostModal,
  onUpdateBoxes,
  onVerifyReservation,
}) {
  const [activeTab, setActiveTab] = useState('inventory') // 'inventory' | 'scanner'
  const [selectedKitchen, setSelectedKitchen] = useState('All Kitchens')

  // Available unique kitchens
  const kitchens = useMemo(() => {
    const list = Array.from(new Set(listings.map((l) => l.restaurant)))
    return ['All Kitchens', ...list]
  }, [listings])

  // Filter listings by selected kitchen
  const filteredListings = useMemo(() => {
    if (selectedKitchen === 'All Kitchens') return listings
    return listings.filter((l) => l.restaurant === selectedKitchen)
  }, [listings, selectedKitchen])

  // Metrics
  const claimedCount = reservations.filter((r) => r.status === 'claimed').length
  const pendingCount = reservations.filter((r) => r.status !== 'claimed').length
  const totalBoxesLive = filteredListings.reduce((sum, l) => sum + (l.deadline > now ? l.boxes : 0), 0)
  const revenueRecovered = reservations.reduce((sum, r) => sum + r.listing.price, 0)

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10" aria-label="Kitchen partner dashboard">
      {/* Top Welcome Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded bg-forest text-ivory">
              <Store className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-forest">
              Kitchen Partner Command Hub
            </span>
          </div>
          <h1 className="mt-1 font-display text-3xl text-forest sm:text-4xl">
            Surplus Inventory & Dispatch
          </h1>
          <p className="mt-1 text-sm text-ink/70">
            List leftover food, monitor student pickup holds, and verify QR passes.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'scanner' ? 'inventory' : 'scanner')}
            className={`inline-flex items-center gap-2 rounded-xs border px-4 py-2.5 text-sm font-semibold transition-all ${
              activeTab === 'scanner'
                ? 'border-forest bg-forest text-ivory'
                : 'border-forest/40 bg-white text-forest hover:bg-forest/5'
            }`}
          >
            <QrCode className="h-4 w-4" />
            <span>{activeTab === 'scanner' ? 'View Inventory List' : 'Open Pickup Scanner'}</span>
            {pendingCount > 0 && (
              <span className="rounded-full bg-tomato px-1.5 py-0.2 text-[10px] font-bold text-ivory">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenPostModal}
            className="inline-flex items-center gap-2 rounded-xs bg-forest px-4 py-2.5 text-sm font-semibold text-ivory shadow-xs transition-all hover:bg-forest-deep"
          >
            <Plus className="h-4 w-4" />
            <span>Post New Surplus Meal</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-sm border border-ink/15 bg-paper p-4 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/55">
            Active Surplus Boxes
          </span>
          <p className="mt-2 font-display text-3xl text-forest">{totalBoxesLive}</p>
          <span className="mt-1 flex items-center gap-1 text-[11px] text-forest">
            <PackagePlus className="h-3 w-3" /> Ready for rescue
          </span>
        </div>

        <div className="rounded-sm border border-ink/15 bg-paper p-4 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/55">
            Pending Pickups
          </span>
          <p className="mt-2 font-display text-3xl text-tomato">{pendingCount}</p>
          <span className="mt-1 flex items-center gap-1 text-[11px] text-tomato-ink">
            <Clock className="h-3 w-3" /> Students arriving soon
          </span>
        </div>

        <div className="rounded-sm border border-ink/15 bg-paper p-4 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/55">
            Meals Handed Over
          </span>
          <p className="mt-2 font-display text-3xl text-forest">{claimedCount}</p>
          <span className="mt-1 flex items-center gap-1 text-[11px] text-forest">
            <CheckCircle className="h-3 w-3" /> Verified by counter
          </span>
        </div>

        <div className="rounded-sm border border-ink/15 bg-paper p-4 shadow-2xs">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/55">
            Revenue Recovered
          </span>
          <p className="mt-2 font-display text-3xl text-forest">{money(revenueRecovered)}</p>
          <span className="mt-1 flex items-center gap-1 text-[11px] text-forest">
            <TrendingUp className="h-3 w-3" /> Food cost recouped
          </span>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="mt-8 flex items-center justify-between border-b border-ink/15">
        <div className="flex gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`border-b-2 pb-3 text-sm font-semibold transition-colors ${
              activeTab === 'inventory'
                ? 'border-forest text-forest'
                : 'border-transparent text-ink/60 hover:text-ink'
            }`}
          >
            Live Kitchen Inventory ({filteredListings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('scanner')}
            className={`relative border-b-2 pb-3 text-sm font-semibold transition-colors ${
              activeTab === 'scanner'
                ? 'border-forest text-forest'
                : 'border-transparent text-ink/60 hover:text-ink'
            }`}
          >
            Pickup QR & PIN Terminal
            {pendingCount > 0 && (
              <span className="ml-2 rounded-full bg-tomato px-1.5 py-0.5 text-[10px] font-bold text-ivory">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        {/* Kitchen Filter Dropdown */}
        {activeTab === 'inventory' && (
          <div className="hidden sm:flex items-center gap-2 pb-2">
            <span className="text-xs text-ink/60">Filter by location:</span>
            <select
              value={selectedKitchen}
              onChange={(e) => setSelectedKitchen(e.target.value)}
              className="rounded-xs border border-ink/20 bg-white px-2.5 py-1 text-xs text-ink focus:border-forest focus:outline-none"
            >
              {kitchens.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="mt-6">
        {activeTab === 'scanner' ? (
          <VerificationTerminal
            reservations={reservations}
            onVerifyReservation={onVerifyReservation}
            onClose={() => setActiveTab('inventory')}
          />
        ) : (
          <div className="overflow-hidden rounded-sm border border-ink/15 bg-paper shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-ink/10 bg-forest/5 font-semibold uppercase tracking-[0.14em] text-ink/70">
                  <tr>
                    <th scope="col" className="px-4 py-3">Meal Item</th>
                    <th scope="col" className="px-4 py-3">Kitchen</th>
                    <th scope="col" className="px-4 py-3">Rescue Price</th>
                    <th scope="col" className="px-4 py-3">Expires In</th>
                    <th scope="col" className="px-4 py-3">Boxes Left</th>
                    <th scope="col" className="px-4 py-3">Quick Adjust</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10">
                  {filteredListings.map((listing) => {
                    const remaining = listing.deadline - now
                    const isExpired = remaining <= 0
                    const isSoldOut = listing.boxes <= 0

                    return (
                      <tr
                        key={listing.id}
                        className={`transition-colors hover:bg-ink/[0.02] ${
                          isExpired || isSoldOut ? 'opacity-60 bg-ink/[0.01]' : ''
                        }`}
                      >
                        {/* Meal Title & Tags */}
                        <td className="px-4 py-3">
                          <div className="font-semibold text-ink text-sm">{listing.name}</div>
                          <div className="mt-0.5 flex flex-wrap gap-1">
                            <span className="rounded bg-forest/10 px-1 text-[10px] font-medium text-forest">
                              {listing.category}
                            </span>
                            {listing.tags?.map((t) => (
                              <span key={t} className="rounded bg-ink/5 px-1 text-[10px] text-ink/70">
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Kitchen */}
                        <td className="px-4 py-3 font-medium text-ink/80">
                          {listing.restaurant}
                        </td>

                        {/* Price */}
                        <td className="px-4 py-3">
                          <span className="font-bold text-forest text-sm">{money(listing.price)}</span>
                          <s className="ml-1 text-[11px] text-ink/40">{money(listing.originalPrice)}</s>
                        </td>

                        {/* Countdown */}
                        <td className="px-4 py-3 font-mono font-medium">
                          {isExpired ? (
                            <span className="inline-flex items-center gap-1 rounded bg-ink/10 px-2 py-0.5 text-ink/60">
                              Closed
                            </span>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1 rounded px-2 py-0.5 ${
                                remaining < 15 * 60_000
                                  ? 'bg-tomato/15 text-tomato font-bold animate-pulse'
                                  : 'bg-forest/10 text-forest'
                              }`}
                            >
                              <Clock className="h-3 w-3" />
                              {countdown(remaining)}
                            </span>
                          )}
                        </td>

                        {/* Boxes remaining badge */}
                        <td className="px-4 py-3">
                          {isSoldOut ? (
                            <span className="inline-flex rounded bg-tomato/10 px-2 py-0.5 font-semibold text-tomato">
                              Sold out
                            </span>
                          ) : (
                            <span className="font-display text-base text-forest">
                              {listing.boxes} {listing.boxes === 1 ? 'box' : 'boxes'}
                            </span>
                          )}
                        </td>

                        {/* Quick stock adjusters (+1 / -1) */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              disabled={listing.boxes <= 0}
                              onClick={() => onUpdateBoxes(listing.id, listing.boxes - 1)}
                              className="grid h-6 w-6 place-items-center rounded border border-ink/20 text-xs font-bold hover:bg-ink/5 disabled:opacity-30"
                              title="Decrease 1 box"
                            >
                              -
                            </button>
                            <span className="w-5 text-center font-mono font-bold text-ink">
                              {listing.boxes}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateBoxes(listing.id, listing.boxes + 1)}
                              className="grid h-6 w-6 place-items-center rounded border border-ink/20 text-xs font-bold hover:bg-ink/5"
                              title="Add 1 box"
                            >
                              +
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-ink/10 bg-ivory px-4 py-3 text-xs text-ink/60">
              <span>Showing {filteredListings.length} listings</span>
              <button
                type="button"
                onClick={onOpenPostModal}
                className="font-medium text-forest hover:underline"
              >
                + Add another surplus item
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
