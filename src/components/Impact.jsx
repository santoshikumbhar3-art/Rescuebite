import { money, number } from '../lib/format.js'

function Stat({ index, value, unit, label, note, version }) {
  return (
    <div className="relative py-8 sm:py-2 sm:pl-8 sm:first:pl-0">
      <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-ink/50">N°{index}</p>
      <p className="mt-3 flex items-baseline gap-2 text-forest">
        <span key={version} className={`${version > 0 ? 'animate-tick' : ''} inline-block font-display text-[3.4rem] leading-none tabular-nums lg:text-[4.6rem]`}>
          {value}
        </span>
        {unit && <span className="font-display text-2xl italic text-forest/70">{unit}</span>}
      </p>
      <p className="mt-3 text-base font-medium text-ink">{label}</p>
      <p className="mt-1 max-w-[16rem] text-sm text-ink/60">{note}</p>
    </div>
  )
}

export default function Impact({ impact, version }) {
  return (
    <section id="impact" aria-labelledby="impact-title" className="grain border-b border-ink/10 bg-cream/60">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-10 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-tomato-ink">The rescue ledger</p>
            <h2 id="impact-title" className="mt-4 font-display text-5xl leading-[0.98] text-forest lg:text-6xl">
              Every box <em>counts.</em>
            </h2>
          </div>
          <p className="max-w-md text-ink/70 lg:col-span-5 lg:col-start-8">
            A running tally of what students have saved from the bin. Reserve a meal below and watch the ledger move.
          </p>
        </div>

        <div className="mt-14 grid divide-y divide-ink/15 border-y border-ink/15 py-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:py-10">
          <Stat
            index="01"
            value={number(impact.meals)}
            label="meals rescued"
            note="Surplus portions collected instead of thrown away."
            version={version}
          />
          <Stat
            index="02"
            value={number(impact.co2Kg)}
            unit="kg"
            label="CO₂e avoided"
            note="Estimated at 2.5 kg CO₂e per rescued meal."
            version={version}
          />
          <Stat
            index="03"
            value={money(impact.saved)}
            label="saved by students"
            note="Difference between menu price and rescue price."
            version={version}
          />
        </div>

        <p className="mt-5 flex items-center gap-2 text-xs text-ink/55">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-tomato" aria-hidden="true" />
          Sample demo data — figures are illustrative and update live with demo reservations in this session.
        </p>
      </div>
    </section>
  )
}
