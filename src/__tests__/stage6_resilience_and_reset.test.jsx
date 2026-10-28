import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import DemoControlBar from '../components/DemoControlBar.jsx'
import { playSuccessChime } from '../lib/sound.js'

describe('Stage 6: Demo State Resilience & Reset (Member 2)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders demo control bar with view pills, test hold trigger, and reset', () => {
    const handleViewChange = vi.fn()
    const handleReset = vi.fn()
    const handleSimulate = vi.fn()

    render(
      <DemoControlBar
        currentView="student"
        onViewChange={handleViewChange}
        onResetDemo={handleReset}
        onSimulateReservation={handleSimulate}
        pendingCount={2}
      />,
    )

    expect(screen.getByText('Demo Mode')).toBeInTheDocument()
    expect(screen.getByText('Student View')).toBeInTheDocument()
    expect(screen.getByText('Kitchen Hub')).toBeInTheDocument()
    expect(screen.getByText('QR Scanner')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()

    const resetBtn = screen.getByRole('button', { name: /Reset/i })
    fireEvent.click(resetBtn)
    expect(handleReset).toHaveBeenCalled()

    const simBtn = screen.getByRole('button', { name: /\+Test Hold/i })
    fireEvent.click(simBtn)
    expect(handleSimulate).toHaveBeenCalled()
  })

  it('executes playSuccessChime without throwing errors even if Web Audio is unsupported', () => {
    expect(() => playSuccessChime()).not.toThrow()

    // Test fallback when window.AudioContext is undefined
    const originalAC = window.AudioContext
    window.AudioContext = undefined
    window.webkitAudioContext = undefined

    expect(() => playSuccessChime()).not.toThrow()

    window.AudioContext = originalAC
    window.webkitAudioContext = originalAC
  })
})
