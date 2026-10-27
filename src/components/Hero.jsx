import { ArrowDownRight } from 'lucide-react'
import Photo from './Photo.jsx'
import { HERO_IMAGES } from '../data/listings.js'

export default function Hero({ boxesTonight, kitchens }) {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-10 lg:pb-28 lg:pt-16">
        {/* Copy */}
        <div className="animate-rise lg:col-span-6 lg:pt-8">
          <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-ink/60">
            <span className="h-px w-8 bg-ink/40" aria-hidden="true" />
            Evening edition · rescued daily after 7pm
          </p>

          <h1
            id="hero-title"
            className="mt-6 font-display text-[3.25rem] leading-[0.94] tracking-[-0.015em] text-forest sm:text-7xl lg:text-[5.4rem] xl:text-[6rem]"
          >
            Good food deserves a <em className="text-tomato">second</em> chance.
          </h1>

          <p className="mt-7 max-w-md text-lg leading-relaxed text-ink/75">
            Your neighbourhood&rsquo;s best bites, rescued before closing. Less waste, more taste,
            student-friendly prices.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <a
              href="#shelf"
              className="group inline-flex items-center gap-3 rounded-sm bg-forest px-6 py-4 text-[15px] font-medium text-ivory shadow-[4px_4px_0_0_#252923] transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#252923]"
            >
              Explore the rescue shelf
              <ArrowDownRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" aria-hidden="true" />
            </a>
            <a
              href="#impact"
              className="text-[15px] font-medium text-forest underline decoration-forest/30 decoration-1 underline-offset-[6px] transition-colors hover:decoration-forest"
            >
              See our impact
            </a>
          </div>

          <dl className="mt-14 grid max-w-md grid-cols-3 border-t border-ink/15 pt-5">
            {[
              [String(kitchens), 'kitchens open'],
              [String(boxesTonight), 'boxes tonight'],
              ['≤80%', 'off the menu'],
            ].map(([value, label]) => (
              <div key={label} className="pr-3">
                <dt className="sr-only">{label}</dt>
                <dd className="font-display text-3xl text-forest tabular-nums">{value}</dd>
                <dd className="mt-1 text-[11px] uppercase tracking-[0.16em] text-ink/55">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Composition */}
        <div className="relative lg:col-span-6">
          <figure className="relative ml-auto w-[88%] sm:w-[80%] lg:w-[86%]">
            <Photo
              src={HERO_IMAGES.main.src}
              alt={HERO_IMAGES.main.alt}
              fallbackLabel="Tonight’s rescue table"
              eager
              position="50% 40%"
              className="aspect-[4/5] rounded-sm"
            />
            <figcaption className="mt-3 flex justify-between text-[11px] uppercase tracking-[0.16em] text-ink/55">
              <span>Fig. 01 — Tonight&rsquo;s shelf</span>
              <span>Photographed before closing</span>
            </figcaption>
          </figure>

          <div className="absolute bottom-20 left-0 w-[44%] -rotate-3 border-[6px] border-ivory shadow-[0_18px_40px_-18px_rgba(37,41,35,0.45)] sm:w-[38%]">
            <Photo
              src={HERO_IMAGES.inset.src}
              alt={HERO_IMAGES.inset.alt}
              fallbackLabel="Fresh pastries"
              eager
              className="aspect-square"
            />
          </div>

          <div
            className="tape absolute left-[2%] top-8 -rotate-[7deg] bg-butter px-5 py-3.5 shadow-[0_10px_24px_-14px_rgba(37,41,35,0.6)] sm:left-[6%]"
            aria-hidden="true"
          >
            <p className="font-display text-xl leading-[1.05] text-ink sm:text-2xl">
              GOOD FOOD.
              <br />
              NO WASTE.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
