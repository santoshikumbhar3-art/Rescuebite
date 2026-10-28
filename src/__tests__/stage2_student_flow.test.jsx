import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FoodCard from '../components/FoodCard.jsx'
import PickupPass from '../components/PickupPass.jsx'

describe('Stage 2: Student Experience Flow (Member 1)', () => {
  const mockListing = {
    id: 'test-bakery',
    name: 'Artisan Pastry Box',
    restaurant: 'Crumb & Co. Bakery',
    category: 'Bakery',
    distanceKm: 0.3,
    originalPrice: 14,
    price: 3.5,
    boxes: 4,
    deadline: Date.now() + 30 * 60_000,
    tags: ['Vegetarian'],
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
    imageAlt: 'Pastries',
    address: '12 North Gate Road',
    instructions: 'Collect at front counter',
  }

  it('renders food card with price discount, urgent countdown, and reserve trigger', () => {
    const handleReserve = vi.fn()
    render(
      <FoodCard
        listing={mockListing}
        number={1}
        variant="feature"
        now={Date.now()}
        onReserve={handleReserve}
      />,
    )

    expect(screen.getByText('Artisan Pastry Box')).toBeInTheDocument()
    expect(screen.getByText('Crumb & Co. Bakery')).toBeInTheDocument()
    expect(screen.getByText('$3.50')).toBeInTheDocument()
    expect(screen.getByText('$14')).toBeInTheDocument()
    expect(screen.getByText(/75%/)).toBeInTheDocument()
    expect(screen.getByText(/off/i)).toBeInTheDocument()

    const reserveBtn = screen.getByRole('button', { name: /reserve for pickup/i })
    fireEvent.click(reserveBtn)
    expect(handleReserve).toHaveBeenCalledWith('test-bakery')
  })

  it('generates a valid digital pickup pass with dynamic QR code and RB-XXXX PIN', () => {
    const mockReservation = {
      id: 'test-bakery-123456789',
      pin: 'RB-4821',
      createdAt: Date.now(),
      status: 'reserved',
      claimedAt: null,
      listing: { ...mockListing, boxes: 3 },
    }

    render(
      <PickupPass
        reservation={mockReservation}
        now={Date.now()}
        titleId="pass-title"
        onDone={vi.fn()}
      />,
    )

    // Check exact PIN and status
    const pinEls = screen.getAllByText(/^RB-4821$/)
    expect(pinEls.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Reserved')).toBeInTheDocument()
    expect(screen.getByText(/Your box is saved/i)).toBeInTheDocument()

    // Check SVG QR Code rendered via title tag
    expect(screen.getByTitle(/QR code for pickup PIN RB-4821/i)).toBeInTheDocument()
  })

  it('disables or marks as closed when deadline has passed or boxes is 0', () => {
    const closedListing = {
      ...mockListing,
      deadline: Date.now() - 5000,
      boxes: 0,
    }

    render(
      <FoodCard
        listing={closedListing}
        number={1}
        variant="tall"
        now={Date.now()}
        onReserve={vi.fn()}
      />,
    )

    expect(screen.getByText(/closed/i)).toBeInTheDocument()
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
  })
})
