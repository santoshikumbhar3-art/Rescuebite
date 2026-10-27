import { Search, X } from 'lucide-react'

export const FILTERS = [
  { key: 'vegetarian', label: 'Vegetarian' },
  { key: 'vegan', label: 'Vegan' },
  { key: 'under5', label: 'Under $5' },
  { key: 'free', label: 'Free' },
  { key: 'nearby', label: 'Nearby · ≤1 km' },
]

export const SORTS = [
  { key: 'deadline', label: 'Ending soonest' },
  { key: 'price', label: 'Lowest price' },
  { key: 'distance', label: 'Closest to campus' },
]

function Toggle({ active, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`group inline-flex shrink-0 items-center gap-2 rounded-sm border px-3 py-2 text-sm transition-colors duration-200 ${
        active
          ? 'border-forest bg-forest text-ivory'
          : 'border-ink/20 text-ink/80 hover:border-forest hover:text-forest'
      }`}
    >
      <span
        aria-hidden="true"
        className={`grid h-3.5 w-3.5 place-items-center border transition-colors ${
          active ? 'border-butter bg-butter' : 'border-current'
        }`}
      >
        {active && (
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 text-forest">
            <path d="M2.5 6.2 5 8.5 9.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        )}
      </span>
      {children}
    </button>
  )
}

export default function FilterBar({ query, onQuery, filters, onToggle, sort, onSort, shown, total, onClear }) {
  const anyActive = query.trim() !== '' || Object.values(filters).some(Boolean)

  return (
    <div className="relative z-30 -mx-4 md:sticky md:top-16 border-y border-ink/10 bg-ivory/95 px-4 py-4 backdrop-blur-[2px] sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
        <label className="relative flex min-w-0 items-center lg:w-72 lg:shrink-0">
          <span className="sr-only">Search by food or restaurant</span>
          <Search className="pointer-events-none absolute left-0 h-4 w-4 text-ink/50" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search food or restaurant…"
            className="w-full border-0 border-b border-ink/25 bg-transparent py-2 pl-7 pr-2 text-[15px] placeholder:text-ink/45 transition-colors focus:border-forest focus:outline-none focus-visible:outline-none"
          />
        </label>

        <div
          role="group"
          aria-label="Filters"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0"
        >
          {FILTERS.map((f) => (
            <Toggle key={f.key} active={filters[f.key]} onClick={() => onToggle(f.key)}>
              {f.label}
            </Toggle>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 lg:ml-auto lg:shrink-0">
          <label className="flex items-center gap-2 text-sm">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink/55">Sort</span>
            <select
              value={sort}
              onChange={(e) => onSort(e.target.value)}
              className="cursor-pointer appearance-none border-0 border-b border-ink/25 bg-transparent bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20d%3D%22M3%204.5l3%203%203-3%22%20fill%3D%22none%22%20stroke%3D%22%23252923%22%20stroke-width%3D%221.4%22/%3E%3C/svg%3E')] bg-[length:12px] bg-[right_0_center] bg-no-repeat py-1.5 pr-6 font-medium text-forest focus:border-forest focus:outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-ink/60" aria-live="polite">
        <span>
          Showing <strong className="font-semibold text-forest">{shown}</strong> of {total} rescues
        </span>
        {anyActive && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 font-medium text-tomato-ink underline-offset-4 hover:underline"
          >
            <X className="h-3 w-3" aria-hidden="true" />
            Clear all
          </button>
        )}
      </div>
    </div>
  )
}
