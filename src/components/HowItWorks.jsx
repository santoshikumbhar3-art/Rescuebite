const steps = [
  {
    n: '01',
    title: 'Browse the shelf',
    body: 'Kitchens near campus list their end-of-day surplus with a pickup window.',
  },
  {
    n: '02',
    title: 'Reserve a box',
    body: 'Pick what you fancy at a rescue price — sometimes it’s free.',
  },
  {
    n: '03',
    title: 'Show your pass',
    body: 'Head over before the timer ends and show your QR code or PIN.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-title" className="border-t border-ink/10">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:px-10 lg:py-24">
        <div className="lg:col-span-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-tomato-ink">How it works</p>
          <h2 id="how-title" className="mt-4 font-display text-5xl leading-[0.98] text-forest">
            Three steps to <em>dinner.</em>
          </h2>
        </div>
        <ol className="grid gap-10 sm:grid-cols-3 lg:col-span-8">
          {steps.map((step) => (
            <li key={step.n} className="border-t-2 border-forest pt-5">
              <span className="font-display text-5xl text-sage">{step.n}</span>
              <h3 className="mt-3 text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-ink/65">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
