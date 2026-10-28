import { describe, it, expect } from 'vitest'
import { LISTINGS, INITIAL_IMPACT, CO2_PER_MEAL_KG } from '../data/listings.js'
import { money, countdown, clock, percentOff } from '../lib/format.js'

describe('Stage 1: Data Integrity & Schema Validation', () => {
  it('validates pre-loaded mock listings have correct structure and values', () => {
    expect(LISTINGS.length).toBeGreaterThanOrEqual(6)

    LISTINGS.forEach((item) => {
      expect(item.id).toBeDefined()
      expect(typeof item.name).toBe('string')
      expect(typeof item.restaurant).toBe('string')
      expect(typeof item.category).toBe('string')
      expect(item.originalPrice).toBeGreaterThan(0)
      expect(item.price).toBeGreaterThanOrEqual(0)
      expect(item.price).toBeLessThanOrEqual(item.originalPrice)
      expect(item.boxes).toBeGreaterThan(0)
      expect(item.minutesLeft).toBeGreaterThan(0)
      expect(Array.isArray(item.tags)).toBe(true)
      expect(typeof item.address).toBe('string')
      expect(typeof item.instructions).toBe('string')
    })
  })

  it('validates carbon offset calibration (2.5 kg CO2 per meal)', () => {
    expect(CO2_PER_MEAL_KG).toBe(2.5)
    expect(INITIAL_IMPACT.meals).toBeGreaterThan(0)
    expect(INITIAL_IMPACT.co2Kg).toBe(INITIAL_IMPACT.meals * CO2_PER_MEAL_KG)
    expect(INITIAL_IMPACT.saved).toBeGreaterThan(0)
  })

  it('validates formatting helpers for currency, percent discount, and countdowns', () => {
    expect(money(0)).toBe('FREE')
    expect(money(3.5)).toBe('$3.50')
    expect(money(12)).toBe('$12')

    expect(percentOff(16, 4)).toBe(75)
    expect(percentOff(10, 5)).toBe(50)

    expect(countdown(65000)).toBe('01:05')
    expect(countdown(0)).toBe('00:00')
    expect(countdown(-1000)).toBe('00:00')

    const ts = new Date('2026-10-27T20:30:00').getTime()
    expect(clock(ts)).toMatch(/\d{1,2}:\d{2}/)
  })
})
