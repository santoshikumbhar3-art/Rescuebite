import { useEffect, useState } from 'react'

/**
 * Returns the current timestamp, refreshed every `intervalMs`.
 * One shared ticker drives every countdown on the page.
 */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])

  return now
}
