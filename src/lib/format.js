export const money = (value) =>
  value === 0
    ? 'FREE'
    : new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: value % 1 === 0 ? 0 : 2,
      }).format(value)

export const number = (value) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(value)

export const km = (value) => `${value.toFixed(1)} km`

/** Milliseconds → "MM:SS" (minutes may exceed 59). */
export const countdown = (ms) => {
  const total = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export const clock = (timestamp) =>
  new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

export const percentOff = (original, price) => Math.round((1 - price / original) * 100)

export const pad2 = (n) => String(n).padStart(2, '0')
