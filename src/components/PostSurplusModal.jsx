import { useState } from 'react'
import { X, Sparkles, Plus, Clock, DollarSign, Store, Tag, Check, Gift } from 'lucide-react'

const PRESETS = [
  {
    name: 'Artisan Pastry & Loaf Box',
    restaurant: 'Crumb & Co. Bakery',
    category: 'Bakery',
    originalPrice: 15,
    price: 3.5,
    boxes: 4,
    minutesLeft: 40,
    tags: ['Vegetarian'],
    contents: 'Assorted warm croissants, sourdough loaf, and fruit danishes.',
    address: '12 North Gate Road, beside the library steps',
    instructions: 'Collect from the front bakery counter. Tell staff your PIN.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Artisan sourdough and pastries',
    label: 'Just baked',
  },
  {
    name: 'Late-Night Slice Assortment',
    restaurant: 'Slice & Pie',
    category: 'Pizza',
    originalPrice: 18,
    price: 4.5,
    boxes: 5,
    minutesLeft: 25,
    tags: ['Vegetarian'],
    contents: 'Four large hot slices — margherita, roasted peppers, and mushroom.',
    address: '48 Station Street, ground floor of the Union building',
    instructions: 'Collect from side hatch marked RescueBite.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Fresh hot pizza slices',
    label: 'Hot & ready',
  },
  {
    name: 'Harvest Grain & Protein Bowl',
    restaurant: 'Green Bowl',
    category: 'Salads',
    originalPrice: 13,
    price: 3.0,
    boxes: 3,
    minutesLeft: 45,
    tags: ['Vegan', 'Vegetarian'],
    contents: 'Warm quinoa, spiced chickpeas, pickled cabbage, and lemon tahini dressing.',
    address: '3 Market Lane, unit B',
    instructions: 'Pick up from designated grab-and-go cooler near the till.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Colourful fresh salad bowl',
    label: 'High protein',
  },
  {
    name: 'Student Solidarity Free Meal Box',
    restaurant: 'University Dining Hall',
    category: 'Dinner',
    originalPrice: 14,
    price: 0,
    boxes: 6,
    minutesLeft: 60,
    tags: ['Halal', 'Vegetarian'],
    contents: 'Basmati rice, seasoned lentil dahl, grilled vegetables, and fresh naan bread.',
    address: 'Central Campus Quad, Student Commons 1st Floor',
    instructions: 'Enter via west entrance, pick up at Service Window 3.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Warm dinner bowl with rice and bread',
    label: '100% Free',
  },
]

const ALL_TAGS = ['Vegetarian', 'Vegan', 'Halal', 'Gluten-Free']
const CATEGORIES = ['Bakery', 'Pizza', 'Salads', 'Dinner', 'Wraps', 'Sandwiches', 'Cafe', 'Grocery']

export default function PostSurplusModal({ isOpen, onClose, onAddListing }) {
  if (!isOpen) return null

  const [form, setForm] = useState({
    name: 'Evening Fresh Surplus Box',
    restaurant: 'Crumb & Co. Bakery',
    category: 'Bakery',
    originalPrice: 14,
    price: 3.5,
    isFree: false,
    boxes: 4,
    minutesLeft: 35,
    tags: ['Vegetarian'],
    contents: 'Freshly baked pastries and sandwiches prepared this afternoon.',
    address: '12 North Gate Road, beside the library steps',
    instructions: 'Show your Rescue PIN at the express collection counter.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
    label: 'Fresh Surplus',
  })

  const [appliedPresetIdx, setAppliedPresetIdx] = useState(null)

  const handleApplyPreset = (preset, idx) => {
    setAppliedPresetIdx(idx)
    setForm({
      ...preset,
      isFree: preset.price === 0,
    })
  }

  const toggleTag = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newListing = {
      id: `listing-${Date.now()}`,
      name: form.name.trim() || 'Surplus Meal Box',
      restaurant: form.restaurant.trim() || 'Campus Kitchen',
      category: form.category,
      distanceKm: 0.4,
      originalPrice: Number(form.originalPrice) || 12,
      price: form.isFree ? 0 : Number(form.price) || 0,
      tags: form.tags,
      boxes: Math.max(1, Number(form.boxes) || 1),
      minutesLeft: Math.max(5, Number(form.minutesLeft) || 30),
      deadline: Date.now() + Math.max(5, Number(form.minutesLeft) || 30) * 60_000,
      image: form.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=80',
      imageAlt: form.name,
      focal: '50% 50%',
      label: form.isFree ? '100% Free' : form.label || 'Newly Posted',
      contents: form.contents.trim() || 'Delicious fresh surplus from tonight’s kitchen service.',
      address: form.address.trim() || 'Main Campus Dining Commons',
      instructions: form.instructions.trim() || 'Collect at front counter. Show digital pass PIN.',
    }

    onAddListing(newListing)
    onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="post-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="grain relative z-10 max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-sm border border-ink/20 bg-paper shadow-2xl">
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-ink/10 bg-forest px-6 py-4 text-ivory">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-butter text-forest">
              <Store className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <h2 id="post-modal-title" className="font-display text-xl leading-none">
                Post Surplus Meal <span className="text-sm italic font-normal text-ivory/80">· Kitchen Portal</span>
              </h2>
              <p className="mt-0.5 text-xs text-ivory/70">Rescue edible food before store closing in ~30 seconds</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-ivory/70 transition-colors hover:bg-ivory/15 hover:text-ivory"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Quick 1-Click Presets */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-forest">
                <Sparkles className="h-3.5 w-3.5 text-tomato" />
                Quick-Fill Demo Presets
              </span>
              <span className="text-[11px] text-ink/50">Click to autofill</span>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PRESETS.map((preset, idx) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleApplyPreset(preset, idx)}
                  className={`flex flex-col items-start rounded border p-2.5 text-left text-xs transition-all ${
                    appliedPresetIdx === idx
                      ? 'border-forest bg-forest/10 font-medium text-forest ring-1 ring-forest'
                      : 'border-ink/15 bg-white/70 hover:border-forest/50 hover:bg-white text-ink/80'
                  }`}
                >
                  <span className="line-clamp-1 font-semibold text-ink">{preset.name}</span>
                  <span className="mt-0.5 text-[11px] text-ink/60">{preset.restaurant}</span>
                  <div className="mt-2 flex w-full items-center justify-between font-mono text-[11px]">
                    <span className="font-bold text-tomato">${preset.price}</span>
                    <span className="text-ink/50">{preset.boxes} boxes</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="perforation h-1" aria-hidden="true" />

          {/* Core Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-ink/70">
                Kitchen / Restaurant Name
              </label>
              <input
                type="text"
                required
                value={form.restaurant}
                onChange={(e) => setForm({ ...form, restaurant: e.target.value })}
                className="mt-1 w-full rounded-xs border border-ink/20 bg-white px-3 py-2 text-sm text-ink focus:border-forest focus:outline-none"
                placeholder="e.g., Campus Central Kitchen"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-ink/70">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="mt-1 w-full rounded-xs border border-ink/20 bg-white px-3 py-2 text-sm text-ink focus:border-forest focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-ink/70">
              Meal Box Title
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded-xs border border-ink/20 bg-white px-3 py-2 text-sm text-ink focus:border-forest focus:outline-none"
              placeholder="e.g. Baker's Surplus Surprise Box"
            />
          </div>

          {/* Pricing & Boxes */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-ink/70">
                Original ($)
              </label>
              <input
                type="number"
                min="1"
                step="0.5"
                required
                value={form.originalPrice}
                onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                className="mt-1 w-full rounded-xs border border-ink/20 bg-white px-3 py-2 text-sm text-ink focus:border-forest focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-ink/70">
                Rescue ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                disabled={form.isFree}
                value={form.isFree ? 0 : form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="mt-1 w-full rounded-xs border border-ink/20 bg-white px-3 py-2 text-sm text-ink disabled:bg-ink/5 disabled:text-ink/40 focus:border-forest focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-ink/70">
                Boxes Left
              </label>
              <input
                type="number"
                min="1"
                max="50"
                required
                value={form.boxes}
                onChange={(e) => setForm({ ...form, boxes: e.target.value })}
                className="mt-1 w-full rounded-xs border border-ink/20 bg-white px-3 py-2 text-sm text-ink focus:border-forest focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-ink/70">
                Pickup Mins
              </label>
              <input
                type="number"
                min="5"
                max="240"
                step="5"
                required
                value={form.minutesLeft}
                onChange={(e) => setForm({ ...form, minutesLeft: e.target.value })}
                className="mt-1 w-full rounded-xs border border-ink/20 bg-white px-3 py-2 text-sm text-ink focus:border-forest focus:outline-none"
              />
            </div>
          </div>

          {/* 100% Free Donation Toggle */}
          <div className="flex items-center justify-between rounded border border-forest/20 bg-forest/5 p-3">
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-forest" />
              <div>
                <span className="text-xs font-bold text-forest">Student Solidarity Free Donation</span>
                <p className="text-[11px] text-ink/65">List this box for $0.00 to support students facing food insecurity</p>
              </div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={form.isFree}
                onChange={(e) => setForm({ ...form, isFree: e.target.checked, price: e.target.checked ? 0 : form.price || 3.5 })}
                className="peer sr-only"
              />
              <div className="peer h-5 w-9 rounded-full bg-ink/20 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 rounded-full bg-white transition-all after:content-[''] peer-checked:bg-forest peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
            </label>
          </div>

          {/* Dietary Tags */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-ink/70 mb-1.5">
              Dietary & Allergen Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_TAGS.map((tag) => {
                const selected = form.tags.includes(tag)
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      selected
                        ? 'bg-forest text-ivory'
                        : 'border border-ink/20 bg-white text-ink/70 hover:border-ink/40'
                    }`}
                  >
                    {selected && <Check className="h-3 w-3" />}
                    {tag}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Location & Instructions */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-ink/70">
                Pickup Address
              </label>
              <input
                type="text"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="mt-1 w-full rounded-xs border border-ink/20 bg-white px-3 py-2 text-sm text-ink focus:border-forest focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.14em] text-ink/70">
                Pickup Instructions
              </label>
              <input
                type="text"
                required
                value={form.instructions}
                onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                className="mt-1 w-full rounded-xs border border-ink/20 bg-white px-3 py-2 text-sm text-ink focus:border-forest focus:outline-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-ink/10 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xs border border-ink/20 px-4 py-2 text-sm font-medium text-ink/70 hover:bg-ink/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xs bg-forest px-5 py-2.5 text-sm font-semibold text-ivory shadow-sm transition-all hover:bg-forest-deep active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              Publish Live to Student Shelf
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
