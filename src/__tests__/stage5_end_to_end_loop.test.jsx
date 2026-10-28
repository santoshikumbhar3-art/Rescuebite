import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import App from '../App.jsx'

describe('Stage 5: Cross-System Integration & Impact Loop (Full App)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('allows seamless switching between Student Shelf, Kitchen Hub, and Scanner', () => {
    render(<App />)

    // Initially in Student Shelf (CategoryStrip or Hero is visible)
    expect(screen.getByText(/North Gate Campus/i)).toBeInTheDocument()
    expect(screen.getByText(/Student Shelf/i)).toBeInTheDocument()

    // Switch to Kitchen Hub via Navbar
    const kitchenNavBtn = screen.getByRole('button', { name: /🏪 Kitchen Hub/i })
    fireEvent.click(kitchenNavBtn)
    expect(screen.getByText('Surplus Inventory & Dispatch')).toBeInTheDocument()

    // Switch to Scanner Terminal via Navbar
    const scannerNavBtn = screen.getByRole('button', { name: /📱 QR Scanner/i })
    fireEvent.click(scannerNavBtn)
    expect(screen.getByText('Kitchen Redemption Terminal')).toBeInTheDocument()

    // Switch back to Student Shelf
    const studentNavBtn = screen.getByRole('button', { name: /🎓 Student Shelf/i })
    fireEvent.click(studentNavBtn)
    expect(screen.getByText(/North Gate Campus/i)).toBeInTheDocument()
  })

  it('runs complete lifecycle: reserve meal -> generate pass -> redeem in scanner -> increment impact', async () => {
    render(<App />)

    // 1. Student reserves first available meal
    const reserveButtons = screen.getAllByRole('button', { name: /reserve for/i })
    fireEvent.click(reserveButtons[0])

    // Reservation modal opens
    const confirmButton = screen.getByRole('button', { name: /Confirm reservation/i })
    fireEvent.click(confirmButton)

    // Pickup pass generated with PIN (allow for the 650ms simulated reservation delay)
    await waitFor(
      () => {
        expect(screen.getByText(/Your box is saved/i)).toBeInTheDocument()
      },
      { timeout: 3500 },
    )

    // Extract generated PIN using exact pattern
    const exactPinEls = screen.getAllByText(/^RB-\d{4}$/)
    expect(exactPinEls.length).toBeGreaterThanOrEqual(1)
    const generatedPin = exactPinEls[0].textContent.trim()

    // Close pass modal
    const doneButton = screen.getByRole('button', { name: /Done — back to the shelf/i })
    fireEvent.click(doneButton)
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    // 2. Switch to Scanner
    const scannerNavBtn = screen.getByRole('button', { name: /📱 QR Scanner/i })
    fireEvent.click(scannerNavBtn)

    // 3. Redeem the pass using the exact PIN
    const input = screen.getByPlaceholderText(/e\.g\. RB-4821 or 4821/i)
    fireEvent.change(input, { target: { value: generatedPin } })
    const verifyBtn = screen.getByRole('button', { name: /verify/i })
    fireEvent.click(verifyBtn)

    await waitFor(
      () => {
        expect(screen.getByText(/Verified! Hand Over the Box/i)).toBeInTheDocument()
      },
      { timeout: 3000 },
    )

    // 4. Verify pass now stamped as COLLECTED (query by accessible name matching /pickup pass/i)
    const myPassBtn = screen.getByRole('button', { name: /pickup pass/i })
    fireEvent.click(myPassBtn)

    await waitFor(
      () => {
        expect(screen.getByText(/✓ Collected/i)).toBeInTheDocument()
      },
      { timeout: 3000 },
    )
  })

  it(
    'proves bi-directional interconnectivity: kitchen posting & stock adjustments appear immediately in student view, and student reservations update kitchen & scanner queues',
    async () => {
    render(<App />)

    // STEP 1: Go to Kitchen Hub
    const kitchenNavBtn = screen.getByRole('button', { name: /🏪 Kitchen Hub/i })
    fireEvent.click(kitchenNavBtn)

    // Open Post Modal
    const postBtn = screen.getByRole('button', { name: /Post New Surplus Meal/i })
    fireEvent.click(postBtn)

    // Fill new meal: "Midnight Campus Cookie Box" ($12 -> $2.50, 4 boxes initially in form)
    const titleInput = screen.getByPlaceholderText(/e\.g\. Baker's Surplus Surprise Box/i)
    fireEvent.change(titleInput, { target: { value: 'Midnight Campus Cookie Box' } })

    const kitchenInput = screen.getByPlaceholderText(/e\.g\., Campus Central Kitchen/i)
    fireEvent.change(kitchenInput, { target: { value: 'Late Night Bakery' } })

    const submitPostBtn = screen.getByRole('button', { name: /Publish Live to Student Shelf/i })
    fireEvent.click(submitPostBtn)

    // STEP 2: Switch to Student Shelf -> Verify new meal is immediately visible!
    const studentNavBtn = screen.getByRole('button', { name: /🎓 Student Shelf/i })
    fireEvent.click(studentNavBtn)

    expect(screen.getByText('Midnight Campus Cookie Box')).toBeInTheDocument()
    expect(screen.getByText('Late Night Bakery')).toBeInTheDocument()

    // STEP 3: Switch back to Kitchen Hub -> Adjust quantity using '+' button
    fireEvent.click(screen.getByRole('button', { name: /🏪 Kitchen Hub/i }))
    const cookieRow = screen.getByText('Midnight Campus Cookie Box').closest('tr')
    const plusBtn = within(cookieRow).getByRole('button', { name: '+' })
    fireEvent.click(plusBtn) // 5
    fireEvent.click(plusBtn) // 6
    fireEvent.click(plusBtn) // 7

    // STEP 4: Switch back to Student Shelf -> Verify updated boxes count inside the Cookie card!
    fireEvent.click(screen.getByRole('button', { name: /🎓 Student Shelf/i }))
    const cookieArticle = screen.getByText('Midnight Campus Cookie Box').closest('article')
    expect(within(cookieArticle).getByText(/7 boxes left/i)).toBeInTheDocument()

    // STEP 5: Student reserves 1 box of Midnight Campus Cookie Box
    const reserveCookieBtn = within(cookieArticle).getByRole('button', { name: /reserve for pickup/i })
    fireEvent.click(reserveCookieBtn)

    const confirmBtn = screen.getByRole('button', { name: /Confirm reservation/i })
    fireEvent.click(confirmBtn)

    await waitFor(
      () => {
        expect(screen.getByText(/Your box is saved/i)).toBeInTheDocument()
      },
      { timeout: 3500 },
    )

    // Close pass modal and wait for unmount
    fireEvent.click(screen.getByRole('button', { name: /Done — back to the shelf/i }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    // STEP 6: Check Kitchen Hub -> Stock decremented from 7 to 6, pending pickups = 1!
    fireEvent.click(screen.getByRole('button', { name: /🏪 Kitchen Hub/i }))
    const updatedCookieRow = screen.getByText('Midnight Campus Cookie Box').closest('tr')
    expect(within(updatedCookieRow).getByText('6 boxes')).toBeInTheDocument()

    const pendingCard = screen.getByText('Pending Pickups').closest('div')
    expect(within(pendingCard).getByText('1')).toBeInTheDocument()

    // STEP 7: Check Scanner Terminal -> Midnight Cookie Box appears in Awaiting Pickup queue!
    fireEvent.click(screen.getByRole('button', { name: /📱 QR Scanner/i }))
    expect(screen.getByText('Midnight Campus Cookie Box')).toBeInTheDocument()
  }, 15000)
})
