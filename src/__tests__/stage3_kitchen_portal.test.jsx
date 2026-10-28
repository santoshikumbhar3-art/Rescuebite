import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import PostSurplusModal from '../components/PostSurplusModal.jsx'
import KitchenDashboard from '../components/KitchenDashboard.jsx'

describe('Stage 3: Kitchen Partner Portal & Inventory Dispatch (Member 2)', () => {
  const mockListings = [
    {
      id: 'crumb-1',
      name: 'Croissant Surprise',
      restaurant: 'Crumb & Co. Bakery',
      category: 'Bakery',
      originalPrice: 15,
      price: 3.5,
      boxes: 4,
      deadline: Date.now() + 45 * 60_000,
      tags: ['Vegetarian'],
    },
    {
      id: 'slice-1',
      name: 'Pizza Slices Box',
      restaurant: 'Slice & Pie',
      category: 'Pizza',
      originalPrice: 18,
      price: 5.0,
      boxes: 6,
      deadline: Date.now() + 20 * 60_000,
      tags: ['Vegetarian'],
    },
  ]

  const mockReservations = [
    {
      id: 'res-1',
      pin: 'RB-1001',
      status: 'reserved',
      createdAt: Date.now() - 60000,
      listing: mockListings[0],
    },
  ]

  it('renders kitchen KPIs accurately on the dashboard', () => {
    render(
      <KitchenDashboard
        listings={mockListings}
        reservations={mockReservations}
        now={Date.now()}
        onOpenPostModal={vi.fn()}
        onUpdateBoxes={vi.fn()}
        onVerifyReservation={vi.fn()}
      />,
    )

    // Headline
    expect(screen.getByText('Surplus Inventory & Dispatch')).toBeInTheDocument()

    // 4 + 6 = 10 active surplus boxes
    expect(screen.getByText('10')).toBeInTheDocument()

    // Pending Pickups card should show 1
    const pendingCard = screen.getByText('Pending Pickups').closest('div')
    expect(within(pendingCard).getByText('1')).toBeInTheDocument()
  })

  it('allows kitchen staff to adjust stock using + and - buttons', () => {
    const handleUpdateBoxes = vi.fn()
    render(
      <KitchenDashboard
        listings={mockListings}
        reservations={mockReservations}
        now={Date.now()}
        onOpenPostModal={vi.fn()}
        onUpdateBoxes={handleUpdateBoxes}
        onVerifyReservation={vi.fn()}
      />,
    )

    const minusButtons = screen.getAllByRole('button', { name: '-' })
    fireEvent.click(minusButtons[0])
    expect(handleUpdateBoxes).toHaveBeenCalledWith('crumb-1', 3)

    const plusButtons = screen.getAllByRole('button', { name: '+' })
    fireEvent.click(plusButtons[0])
    expect(handleUpdateBoxes).toHaveBeenCalledWith('crumb-1', 5)
  })

  it('submits a new surplus meal via PostSurplusModal with preset autofill and free donation toggle', () => {
    const handleAddListing = vi.fn()
    render(
      <PostSurplusModal
        isOpen={true}
        onClose={vi.fn()}
        onAddListing={handleAddListing}
      />,
    )

    expect(screen.getByText(/Quick-Fill Demo Presets/i)).toBeInTheDocument()

    // Click Student Solidarity Free Meal Box preset
    const freePresetBtn = screen.getByText('Student Solidarity Free Meal Box')
    fireEvent.click(freePresetBtn)

    // Free donation toggle should be active ($0)
    const submitBtn = screen.getByRole('button', { name: /Publish Live to Student Shelf/i })
    fireEvent.click(submitBtn)

    expect(handleAddListing).toHaveBeenCalledTimes(1)
    const newListing = handleAddListing.mock.calls[0][0]
    expect(newListing.restaurant).toBe('University Dining Hall')
    expect(newListing.price).toBe(0)
    expect(newListing.label).toBe('100% Free')
  })
})
