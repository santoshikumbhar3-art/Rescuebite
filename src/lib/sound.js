// Web Audio API chime for celebratory verification without external assets
export function playSuccessChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()

    const now = ctx.currentTime

    // Note 1: 523.25 Hz (C5)
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'triangle'
    osc1.frequency.setValueAtTime(523.25, now)
    gain1.gain.setValueAtTime(0.18, now)
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.35)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(now)
    osc1.stop(now + 0.35)

    // Note 2: 659.25 Hz (E5)
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'triangle'
    osc2.frequency.setValueAtTime(659.25, now + 0.1)
    gain2.gain.setValueAtTime(0.2, now + 0.1)
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.45)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(now + 0.1)
    osc2.stop(now + 0.45)

    // Note 3: 783.99 Hz (G5)
    const osc3 = ctx.createOscillator()
    const gain3 = ctx.createGain()
    osc3.type = 'triangle'
    osc3.frequency.setValueAtTime(783.99, now + 0.2)
    gain3.gain.setValueAtTime(0.25, now + 0.2)
    gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.7)
    osc3.connect(gain3)
    gain3.connect(ctx.destination)
    osc3.start(now + 0.2)
    osc3.stop(now + 0.7)
  } catch {
    // Graceful fallback if audio is blocked by user autoplay policies
  }
}
