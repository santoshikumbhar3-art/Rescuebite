import { useMemo, useState } from 'react'
import FilterBar from './FilterBar.jsx'
import FoodCard, { variantFor } from './FoodCard.jsx'
import { NEARBY_KM } from '../data/listings.js'

const EMPTY_FILTERS = { vegetarian: false, vegan: false, under5: false, free: false, nearby: false }

const matchesFilters = (listing, filters, query) => {
  const q = query.trim().toLowerCase()
  if (q && !`${listing.name} ${listing.restaurant} ${listing.category}`.toLowerCase().includes(q)) return false
  // Vegan food is also vegetarian.
  if (filters.vegetarian && !listing.tags.some((t) => t === 'Vegetarian' || t === 'Vegan')) return false
  if (filters.vegan && !listing.tags.includes('Vegan')) return false
  if (filters.under5 && !(listing.price < 5)) return false
  if (filters.free && listing.price !== 0) return false
  if (filters.nearby && listing.distanceKm > NEARBY_KM) return false
  return true
}

const sorters = {
  deadline: (a, b) => a.deadline - b.deadline,
  price: (a, b) => a.price - b.price || a.distanceKm - b.distanceKm,
  distance: (a, b) => a.distanceKm - b.distanceKm,
}

export default function Marketplace({ listings, now, onReserve }) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [sort, setSort] = useState('deadline')

  const visible = useMemo(
    () => listings.filter((l) => matchesFilters(l, filters, query)).sort(sorters[sort]),
    [listings, filters, query, sort],
  )

  const toggle = (key) => setFilters((prev) => ({ ...prev, [key]: !prev[key] }))
  const clear = () => {
    setFilters(EMPTY_FILTERS)
    setQuery('')
  }

  // Stable catalogue number for each listing, independent of filtering/sorting.
  const indexOf = (id) => listings.findIndex((l) => l.id === id) + 1

  return (
    <section id="shelf" aria-labelledby="shelf-title" className="mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 lg:px-10 lg:pt-24">
      <header className="mb-10 grid gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-tomato-ink">Tonight&rsquo;s rescue shelf</p>
          <h2 id="shelf-title" className="mt-4 font-display text-5xl leading-[0.98] text-forest lg:text-[4.2rem]">
            Rescued before closing,
            <br className="hidden sm:block" /> <em>ready for you.</em>
          </h2>
        </div>
        <p className="max-w-sm text-ink/70 lg:col-span-4 lg:col-start-9">
          Each kitchen lists what&rsquo;s left at the end of service. Reserve a box, then show your pass at pickup
          before the timer runs out.
        </p>
      </header>

      <FilterBar
        query={query}
        onQuery={setQuery}
        filters={filters}
        onToggle={toggle}
        sort={sort}
        onSort={setSort}
        shown={visible.length}
        total={listings.length}
        onClear={clear}
      />

      {visible.length === 0 ? (
        <div className="animate-rise mx-auto max-w-lg py-24 text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink/50">Empty shelf</p>
          <p className="mt-4 font-display text-4xl text-forest">Nothing matches — yet.</p>
          <p className="mt-3 text-ink/65">Try loosening a filter. New surplus is listed every evening as kitchens close.</p>
          <button
            type="button"
            onClick={clear}
            className="mt-7 rounded-sm border border-forest px-5 py-2.5 text-sm font-medium text-forest transition-colors hover:bg-forest hover:text-ivory"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <ul className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-12 lg:gap-x-8 lg:gap-y-14">
          {visible.map((listing, position) => (
            <FoodCard
              key={listing.id}
              listing={listing}
              number={indexOf(listing.id)}
              variant={variantFor(position, visible.length)}
              now={now}
              onReserve={onReserve}
            />
          ))}
        </ul>
      )}
    </section>
  )
}
