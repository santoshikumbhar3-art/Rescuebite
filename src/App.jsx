import { useCallback, useMemo, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import CategoryStrip from './components/CategoryStrip.jsx'
import Impact from './components/Impact.jsx'
import Marketplace from './components/Marketplace.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import ReservationModal from './components/ReservationModal.jsx'
import Footer from './components/Footer.jsx'
import { CO2_PER_MEAL_KG, INITIAL_IMPACT, LISTINGS } from './data/listings.js'
import { useNow } from './hooks/useNow.js'

const createInitialListings = () => {
  const start = Date.now()
  return LISTINGS.map((listing) => ({
    ...listing,
    deadline: start + listing.minutesLeft * 60_000,
  }))
}

const makePin = (taken) => {
  let pin
  do {
    pin = `RB-${Math.floor(1000 + Math.random() * 9000)}`
  } while (taken.has(pin))
  return pin
}

export default function App() {
  const now = useNow(1000)
  const [listings, setListings] = useState(createInitialListings)
  const [impact, setImpact] = useState(INITIAL_IMPACT)
  const [impactVersion, setImpactVersion] = useState(0)
  const [reservations, setReservations] = useState([])
  // modal: { listingId, reservationId | null } | null
  const [modal, setModal] = useState(null)

  const openReservation = useCallback((listingId) => setModal({ listingId, reservationId: null }), [])
  const closeModal = useCallback(() => setModal(null), [])

  const openLatestPass = useCallback(() => {
    const latest = reservations[reservations.length - 1]
    if (latest) setModal({ listingId: latest.listing.id, reservationId: latest.id })
  }, [reservations])

  // Demo-only reservation: updates local state, no network request is made.
  const confirmReservation = useCallback(
    (listingId) => {
      const listing = listings.find((l) => l.id === listingId)
      if (!listing || listing.boxes <= 0 || listing.deadline <= Date.now()) return null

      const reservation = {
        id: `${listingId}-${Date.now()}`,
        pin: makePin(new Set(reservations.map((r) => r.pin))),
        createdAt: Date.now(),
        listing: { ...listing, boxes: listing.boxes - 1 },
      }

      setListings((prev) => prev.map((l) => (l.id === listingId ? { ...l, boxes: l.boxes - 1 } : l)))
      setImpact((prev) => ({
        meals: prev.meals + 1,
        co2Kg: prev.co2Kg + CO2_PER_MEAL_KG,
        saved: prev.saved + (listing.originalPrice - listing.price),
      }))
      setImpactVersion((v) => v + 1)
      setReservations((prev) => [...prev, reservation])
      setModal({ listingId, reservationId: reservation.id })
      return reservation
    },
    [listings, reservations],
  )

  const modalListing = modal && listings.find((l) => l.id === modal.listingId)
  const modalReservation = modal?.reservationId
    ? reservations.find((r) => r.id === modal.reservationId)
    : null

  const boxesTonight = useMemo(
    () => listings.reduce((sum, l) => sum + (l.deadline > now ? l.boxes : 0), 0),
    [listings, now],
  )

  return (
    <>
      <a
        href="#shelf"
        className="sr-only z-[60] bg-forest px-4 py-2 text-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to the rescue shelf
      </a>
      <Navbar passCount={reservations.length} onOpenPass={openLatestPass} />
      <main>
        <Hero boxesTonight={boxesTonight} kitchens={listings.length} />
        <CategoryStrip />
        <Impact impact={impact} version={impactVersion} />
        <Marketplace listings={listings} now={now} onReserve={openReservation} />
        <HowItWorks />
      </main>
      <Footer />

      {modalListing && (
        <ReservationModal
          key={modal.listingId}
          listing={modalListing}
          reservation={modalReservation}
          now={now}
          onConfirm={confirmReservation}
          onClose={closeModal}
        />
      )}
    </>
  )
}
