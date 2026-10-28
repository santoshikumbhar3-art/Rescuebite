import { useCallback, useEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import CategoryStrip from './components/CategoryStrip.jsx'
import Impact from './components/Impact.jsx'
import Marketplace from './components/Marketplace.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import ReservationModal from './components/ReservationModal.jsx'
import KitchenDashboard from './components/KitchenDashboard.jsx'
import VerificationTerminal from './components/VerificationTerminal.jsx'
import PostSurplusModal from './components/PostSurplusModal.jsx'
import DemoControlBar from './components/DemoControlBar.jsx'
import Footer from './components/Footer.jsx'
import { CO2_PER_MEAL_KG, INITIAL_IMPACT, LISTINGS } from './data/listings.js'
import { useNow } from './hooks/useNow.js'

const STORAGE_KEY = 'RESCUEBITE_DEMO_STATE_V1'

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

  // Current active view: 'student' | 'kitchen' | 'scanner'
  const [currentView, setCurrentView] = useState('student')

  // Load from localStorage or defaults
  const [listings, setListings] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_LISTINGS`)
      if (saved) return JSON.parse(saved)
    } catch {}
    return createInitialListings()
  })

  const [impact, setImpact] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_IMPACT`)
      if (saved) return JSON.parse(saved)
    } catch {}
    return INITIAL_IMPACT
  })

  const [impactVersion, setImpactVersion] = useState(0)

  const [reservations, setReservations] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_RESERVATIONS`)
      if (saved) return JSON.parse(saved)
    } catch {}
    return []
  })

  // Modals state
  // modal: { listingId, reservationId | null } | null
  const [modal, setModal] = useState(null)
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_LISTINGS`, JSON.stringify(listings))
      localStorage.setItem(`${STORAGE_KEY}_IMPACT`, JSON.stringify(impact))
      localStorage.setItem(`${STORAGE_KEY}_RESERVATIONS`, JSON.stringify(reservations))
    } catch {}
  }, [listings, impact, reservations])

  const openReservation = useCallback((listingId) => setModal({ listingId, reservationId: null }), [])
  const closeModal = useCallback(() => setModal(null), [])

  const openLatestPass = useCallback(() => {
    const latest = reservations[reservations.length - 1]
    if (latest) setModal({ listingId: latest.listing.id, reservationId: latest.id })
  }, [reservations])

  // Demo reservation: updates local state & passes
  const confirmReservation = useCallback(
    (listingId) => {
      const listing = listings.find((l) => l.id === listingId)
      if (!listing || listing.boxes <= 0 || listing.deadline <= Date.now()) return null

      const reservation = {
        id: `${listingId}-${Date.now()}`,
        pin: makePin(new Set(reservations.map((r) => r.pin))),
        createdAt: Date.now(),
        status: 'reserved',
        claimedAt: null,
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

  // Kitchen Partner: Add new surplus meal
  const handleAddListing = useCallback((newListing) => {
    setListings((prev) => [newListing, ...prev])
  }, [])

  // Kitchen Partner: Quick box quantity adjust
  const handleUpdateBoxes = useCallback((listingId, newBoxes) => {
    setListings((prev) =>
      prev.map((l) => (l.id === listingId ? { ...l, boxes: Math.max(0, newBoxes) } : l)),
    )
  }, [])

  // Kitchen Partner: Verify & Redeem Pass at Counter
  const handleVerifyReservation = useCallback((reservationId) => {
    setReservations((prev) =>
      prev.map((r) =>
        r.id === reservationId
          ? { ...r, status: 'claimed', claimedAt: Date.now() }
          : r,
      ),
    )
  }, [])

  // Demo Helper: Auto-create a test reservation
  const handleSimulateReservation = useCallback(() => {
    const available = listings.find((l) => l.boxes > 0 && l.deadline > Date.now()) || listings[0]
    if (available) {
      confirmReservation(available.id)
    }
  }, [listings, confirmReservation])

  // Demo Helper: Reset all demo data
  const handleResetDemo = useCallback(() => {
    try {
      localStorage.removeItem(`${STORAGE_KEY}_LISTINGS`)
      localStorage.removeItem(`${STORAGE_KEY}_IMPACT`)
      localStorage.removeItem(`${STORAGE_KEY}_RESERVATIONS`)
    } catch {}
    setListings(createInitialListings())
    setImpact(INITIAL_IMPACT)
    setImpactVersion((v) => v + 1)
    setReservations([])
    setModal(null)
  }, [])

  const modalListing = modal && listings.find((l) => l.id === modal.listingId)
  const modalReservation = modal?.reservationId
    ? reservations.find((r) => r.id === modal.reservationId)
    : null

  const boxesTonight = useMemo(
    () => listings.reduce((sum, l) => sum + (l.deadline > now ? l.boxes : 0), 0),
    [listings, now],
  )

  const pendingPickupsCount = useMemo(
    () => reservations.filter((r) => r.status !== 'claimed').length,
    [reservations],
  )

  return (
    <>
      <a
        href="#shelf"
        className="sr-only z-[60] bg-forest px-4 py-2 text-ivory focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to the rescue shelf
      </a>

      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        passCount={reservations.length}
        pendingCount={pendingPickupsCount}
        onOpenPass={openLatestPass}
        onOpenPostModal={() => setIsPostModalOpen(true)}
      />

      {/* Dynamic Views */}
      <main className="pb-24">
        {currentView === 'student' && (
          <>
            <Hero boxesTonight={boxesTonight} kitchens={listings.length} />
            <CategoryStrip />
            <Impact impact={impact} version={impactVersion} />
            <Marketplace listings={listings} now={now} onReserve={openReservation} />
            <HowItWorks />
          </>
        )}

        {currentView === 'kitchen' && (
          <KitchenDashboard
            listings={listings}
            reservations={reservations}
            now={now}
            onOpenPostModal={() => setIsPostModalOpen(true)}
            onUpdateBoxes={handleUpdateBoxes}
            onVerifyReservation={handleVerifyReservation}
          />
        )}

        {currentView === 'scanner' && (
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <VerificationTerminal
              reservations={reservations}
              onVerifyReservation={handleVerifyReservation}
              onClose={() => setCurrentView('student')}
            />
          </div>
        )}
      </main>

      <Footer />

      {/* Demo Floating Controller Bar */}
      <DemoControlBar
        currentView={currentView}
        onViewChange={setCurrentView}
        onResetDemo={handleResetDemo}
        onSimulateReservation={handleSimulateReservation}
        pendingCount={pendingPickupsCount}
      />

      {/* Student Reservation & Pass Modal */}
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

      {/* Kitchen Post Surplus Modal */}
      <PostSurplusModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onAddListing={handleAddListing}
      />
    </>
  )
}
