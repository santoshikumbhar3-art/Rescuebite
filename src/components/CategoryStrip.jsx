const items = ['Sourdough', 'Wood-fired slices', 'Grain bowls', 'Curry boxes', 'Wraps', 'Late-night noodles', 'Parfaits', 'Mezze']

export default function CategoryStrip() {
  return (
    <div className="border-y border-forest bg-forest text-ivory" aria-hidden="true">
      <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-hidden whitespace-nowrap px-4 py-3.5 sm:px-6 lg:px-10">
        <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.22em] text-butter">On the shelf</span>
        <p className="font-display text-lg italic text-ivory/90">
          {items.map((item, i) => (
            <span key={item}>
              {item}
              {i < items.length - 1 && <span className="mx-4 not-italic text-sage">✳</span>}
            </span>
          ))}
        </p>
      </div>
    </div>
  )
}
