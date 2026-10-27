# RescueBite — Student Marketplace (Member 1)

An editorial, art-directed food-rescue marketplace for students. Built with React, Vite, Tailwind CSS v4, Lucide icons and `qrcode.react`.

## Run it

```bash
npm install
np
npm run build      # production build → dist/
npm run preview    # serve the production build
```

## Demo story (for judges)

1. Open the site → hero, then the live **rescue ledger** (sample demo data).
2. Scroll to **Tonight's rescue shelf**.
3. Tap **Vegetarian**, **Under $5** and **Nearby · ≤1 km** → two listings remain.
4. Pick **Campus Bakery Surprise Bag — $3.50** → **Reserve for pickup**.
5. **Confirm reservation** → a digital pickup pass appears with a QR code and PIN (e.g. `RB-4092`).
6. Close it: box count drops by one and the ledger ticks up. Re-open any time via **My pass** in the top bar.

Reservations are simulated in local React state and are clearly labelled as demo — no payment or real order.

## Structure

```
src/
  App.jsx                    state: listings, impact, reservations, modal
  data/listings.js           8 sample listings, hero images, initial impact
  hooks/useNow.js            one shared 1s ticker (setInterval + cleanup)
  lib/format.js              money, countdown, distance helpers
  components/
    Navbar.jsx  Hero.jsx  CategoryStrip.jsx  Impact.jsx
    Marketplace.jsx          filtering + sorting logic
    FilterBar.jsx            search, toggles, sort
    FoodCard.jsx             art-directed card variants + countdown
    Photo.jsx                image with designed fallback
    ReservationModal.jsx     accessible dialog (focus trap, Esc, scroll lock)
    PickupPass.jsx           QR code + PIN ticket
    HowItWorks.jsx  Footer.jsx
```

## Connecting the backend

Replace `LISTINGS` in `src/data/listings.js` with a fetch from the API, and swap the body of `confirmReservation` in `App.jsx` for a POST that returns the PIN. Keep each listing's shape (`id, name, restaurant, price, originalPrice, tags, boxes, deadline, …`).

Impact maths: each rescued meal adds 1 meal, 2.5 kg CO₂e and (menu price − rescue price) in savings.

Photos are from Unsplash.
