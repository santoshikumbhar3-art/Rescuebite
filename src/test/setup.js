import '@testing-library/jest-dom/vitest'

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}))

// Mock window.AudioContext
class MockAudioContext {
  currentTime = 0
  createOscillator() {
    return {
      type: 'sine',
      frequency: { setValueAtTime: vi.fn() },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    }
  }
  createGain() {
    return {
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    }
  }
  destination = {}
}

window.AudioContext = MockAudioContext
window.webkitAudioContext = MockAudioContext

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn()
