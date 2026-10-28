import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import VerificationTerminal from '../components/VerificationTerminal.jsx'
import confetti from 'canvas-confetti'

describe('Stage 4: QR & PIN Verification Terminal (Member 2)', () => {
  const mockReservations = [
    {
      id: 'res-valid',
      pin: 'RB-4821',
      status: 'reserved',
      createdAt: Date.now() - 120000,
      listing: {
        id: 'bakery-1',
        name: 'Artisan Bag',
        restaurant: 'Crumb & Co.',
        price: 3.5,
      },
    },
    {
      id: 'res-claimed',
      pin: 'RB-9999',
      status: 'claimed',
      createdAt: Date.now() - 3600000,
      claimedAt: Date.now() - 1800000,
      listing: {
        id: 'pizza-1',
        name: 'Pizza Box',
        restaurant: 'Slice & Pie',
        price: 5.0,
      },
    },
  ]

  it('successfully verifies a valid PIN and calls onVerifyReservation and triggers confetti', async () => {
    const handleVerify = vi.fn()
    render(
      <VerificationTerminal
        reservations={mockReservations}
        onVerifyReservation={handleVerify}
      />,
    )

    const input = screen.getByPlaceholderText(/e\.g\. RB-4821 or 4821/i)
    fireEvent.change(input, { target: { value: '4821' } })

    const verifyBtn = screen.getByRole('button', { name: /verify/i })
    fireEvent.click(verifyBtn)

    expect(handleVerify).toHaveBeenCalledWith('res-valid')
    expect(confetti).toHaveBeenCalled()

    await waitFor(() => {
      expect(screen.getByText(/Verified! Hand Over the Box/i)).toBeInTheDocument()
      expect(screen.getByText('+1 Meal Rescued · +2.5 kg CO₂')).toBeInTheDocument()
    })
  })

  it('successfully extracts PIN from a full QR code payload string', async () => {
    const handleVerify = vi.fn()
    render(
      <VerificationTerminal
        reservations={mockReservations}
        onVerifyReservation={handleVerify}
      />,
    )

    const input = screen.getByPlaceholderText(/e\.g\. RB-4821 or 4821/i)
    fireEvent.change(input, {
      target: { value: 'RESCUEBITE|DEMO|RB-4821|bakery-1|1730000000' },
    })

    const verifyBtn = screen.getByRole('button', { name: /verify/i })
    fireEvent.click(verifyBtn)

    expect(handleVerify).toHaveBeenCalledWith('res-valid')
  })

  it('blocks double-claiming and displays warning if pass was already claimed', async () => {
    const handleVerify = vi.fn()
    render(
      <VerificationTerminal
        reservations={mockReservations}
        onVerifyReservation={handleVerify}
      />,
    )

    const input = screen.getByPlaceholderText(/e\.g\. RB-4821 or 4821/i)
    fireEvent.change(input, { target: { value: 'RB-9999' } })

    const verifyBtn = screen.getByRole('button', { name: /verify/i })
    fireEvent.click(verifyBtn)

    expect(handleVerify).not.toHaveBeenCalled()
    await waitFor(() => {
      expect(screen.getByText(/Warning: Pass Already Redeemed/i)).toBeInTheDocument()
      expect(screen.getByText(/Double-claiming is blocked/i)).toBeInTheDocument()
    })
  })

  it('rejects an invalid PIN with not found message', async () => {
    const handleVerify = vi.fn()
    render(
      <VerificationTerminal
        reservations={mockReservations}
        onVerifyReservation={handleVerify}
      />,
    )

    const input = screen.getByPlaceholderText(/e\.g\. RB-4821 or 4821/i)
    fireEvent.change(input, { target: { value: 'RB-0000' } })

    const verifyBtn = screen.getByRole('button', { name: /verify/i })
    fireEvent.click(verifyBtn)

    expect(handleVerify).not.toHaveBeenCalled()
    await waitFor(() => {
      expect(screen.getByText(/PIN Not Found/i)).toBeInTheDocument()
    })
  })
})
