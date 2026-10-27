import { Logo } from './Navbar.jsx'

export default function Footer() {
  return (
    <footer className="bg-forest text-ivory">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="[&_span]:!text-ivory">
              <Logo />
            </div>
            <p className="mt-4 max-w-sm font-display text-3xl leading-tight text-ivory/90">
              Less waste, <em className="text-butter">more taste.</em>
            </p>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-ivory/65">
            A hackathon prototype. Listings, prices and impact figures are sample demo data, and reservations are
            simulated in your browser.
          </p>
        </div>
        <div className="mt-12 flex flex-wrap justify-between gap-4 border-t border-ivory/15 pt-6 text-xs text-ivory/55">
          <span>© {new Date().getFullYear()} RescueBite</span>
          <span>Made for students, by students.</span>
        </div>
      </div>
    </footer>
  )
}
