import { MapPin, Ticket, Store, QrCode, Plus } from 'lucide-react'

export function Logo({ className = '', onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-baseline gap-1.5 text-left ${className}`}
      aria-label="RescueBite home"
    >
      <span className="font-display text-[1.65rem] leading-none tracking-tight text-forest">
        Rescue<span className="italic">Bite</span>
      </span>
      <span
        aria-hidden="true"
        className="inline-block h-2 w-2 translate-y-[-2px] rounded-full bg-tomato transition-transform duration-300 group-hover:scale-125"
      />
    </button>
  )
}

export default function Navbar({
  currentView = 'student',
  onViewChange,
  passCount = 0,
  pendingCount = 0,
  onOpenPass,
  onOpenPostModal,
}) {
  return (
    <header id="top" className="sticky top-0 z-40 border-b border-ink/10 bg-ivory/95 backdrop-blur-[2px]">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-10"
      >
        <Logo onClick={() => onViewChange?.('student')} />

        {/* View Switcher Pills in Navbar */}
        <div className="flex items-center rounded-full border border-ink/15 bg-paper p-1 text-xs">
          <button
            type="button"
            onClick={() => onViewChange?.('student')}
            className={`rounded-full px-3.5 py-1.5 font-medium transition-all ${
              currentView === 'student'
                ? 'bg-forest text-ivory shadow-xs font-semibold'
                : 'text-ink/70 hover:text-forest'
            }`}
          >
            🎓 Student Shelf
          </button>
          <button
            type="button"
            onClick={() => onViewChange?.('kitchen')}
            className={`rounded-full px-3.5 py-1.5 font-medium transition-all ${
              currentView === 'kitchen'
                ? 'bg-forest text-ivory shadow-xs font-semibold'
                : 'text-ink/70 hover:text-forest'
            }`}
          >
            🏪 Kitchen Hub
          </button>
          <button
            type="button"
            onClick={() => onViewChange?.('scanner')}
            className={`relative rounded-full px-3.5 py-1.5 font-medium transition-all ${
              currentView === 'scanner'
                ? 'bg-forest text-ivory shadow-xs font-semibold'
                : 'text-ink/70 hover:text-forest'
            }`}
          >
            📱 QR Scanner
            {pendingCount > 0 && (
              <span className="ml-1.5 rounded-full bg-tomato px-1.5 py-0.2 text-[10px] font-bold text-ivory">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-ink/60 lg:inline-flex">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            North Gate Campus
          </span>

          {currentView === 'kitchen' && (
            <button
              type="button"
              onClick={onOpenPostModal}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-sm bg-forest px-3.5 py-2 text-sm font-medium text-ivory hover:bg-forest-deep shadow-2xs"
            >
              <Plus className="h-4 w-4" />
              <span>Post Surplus</span>
            </button>
          )}

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
