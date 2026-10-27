import { MapPin, Ticket } from 'lucide-react'

const links = [
  { href: '#shelf', label: 'Rescue shelf' },
  { href: '#impact', label: 'Impact' },
  { href: '#how', label: 'How it works' },
]

export function Logo({ className = '' }) {
  return (
    <a href="#top" className={`group inline-flex items-baseline gap-1.5 ${className}`} aria-label="RescueBite home">
      <span className="font-display text-[1.65rem] leading-none tracking-tight text-forest">
        Rescue<span className="italic">Bite</span>
      </span>
      <span
        aria-hidden="true"
        className="inline-block h-2 w-2 translate-y-[-2px] rounded-full bg-tomato transition-transform duration-300 group-hover:scale-125"
      />
    </a>
  )
}

export default function Navbar({ passCount, onOpenPass }) {
  return (
    <header id="top" className="sticky top-0 z-40 border-b border-ink/10 bg-ivory/95 backdrop-blur-[2px]">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10"
      >
        <Logo />

        <ul className="hidden items-center gap-8 text-sm md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="relative py-1 text-ink/75 transition-colors hover:text-forest after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-forest after:transition-transform after:duration-300 hover:after:scale-x-100"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-ink/60 lg:inline-flex">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            North Gate Campus
          </span>
          <button
            type="button"
            onClick={onOpenPass}
            disabled={passCount === 0}
            className="relative inline-flex items-center gap-2 rounded-sm border border-forest/30 px-3.5 py-2 text-sm font-medium text-forest transition-colors hover:bg-forest hover:text-ivory disabled:cursor-not-allowed disabled:border-ink/15 disabled:text-ink/40 disabled:hover:bg-transparent"
            aria-label={passCount ? `Open my pickup pass (${passCount} reserved)` : 'No pickup passes yet'}
          >
            <Ticket className="h-4 w-4" aria-hidden="true" />
            <span>My pass</span>
            {passCount > 0 && (
              <span
                key={passCount}
                className="animate-rise grid h-5 min-w-5 place-items-center rounded-full bg-tomato px-1 text-[11px] font-semibold text-ivory"
              >
                {passCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  )
}
