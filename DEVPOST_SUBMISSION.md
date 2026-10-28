# RescueBite — Devpost Submission Package
**Hackathon:** Next Byte Hacks V5  
**Judging Criterion Focus:** Real-World Impact (UN SDG 2: Zero Hunger & SDG 12: Responsible Consumption)

---

### 1. Basic Information
- **Project Title:** RescueBite
- **Tagline:** Rescuing surplus meals from campus dining halls and cafes before closing time — feeding students, eliminating food waste.
- **Project Links:**
  - GitHub Repository: `https://github.com/santoshikumbhar3-art/Rescuebite`
  - Video Demo: *(Upload unlisted YouTube/Vimeo link here)*

---

### 2. Project Description (Devpost Markdown)

#### 💡 Inspiration
Every night across college campuses, dining halls, bakeries, pizzerias, and cafes toss out trays of freshly prepared, high-quality food simply because they have reached their closing hour. Simultaneously, over **33% of university students experience food insecurity**, with rising tuition and grocery prices forcing many to skip meals or rely on cheap, low-nutrient junk food.

We asked ourselves: *Why should fresh artisan bread, nutritious grain bowls, and dinner combos end up in landfills when a hungry student is studying 200 meters away?*

That question gave birth to **RescueBite**: a fast, hyper-local rescue platform designed to connect campus kitchens with students in real time before food goes to waste.

---

#### 🥗 What It Does
RescueBite is an end-to-end surplus food rescue platform with two synchronized experiences:

1. **For Students & Campus Community:**
   - **Live Surplus Discovery Shelf:** Browse available surplus meal boxes categorized by dietary preferences (Vegetarian, Vegan, Halal, Gluten-Free) and campus proximity.
   - **Urgent Expiry Countdown Timers:** Real-time ticking clocks indicating exact pickup windows before store closing (e.g. `⏰ 24m remaining`).
   - **Deep Discounts & Free Donations:** Meals are priced at 70–80% off (typically $3 to $5) or marked **100% Free** under the *Student Solidarity* pledge.
   - **Instant Digital Pickup Pass:** 1-click reservations generate an interactive pass with a dynamic **QR Code** and high-contrast **4-digit Rescue PIN** (e.g., `RB-4821`).

2. **For Kitchens, Cafes & Dining Halls:**
   - **60-Second Surplus Listing:** Busy kitchen managers can publish unsold items in under a minute with one-click presets (Bakery surprise bags, woodfired pizza slices, harvest salad bowls).
   - **Kitchen Partner Command Hub:** Live inventory controls, pending pickup queues, and stock adjustments (`+1/-1 Box`).
   - **Pickup Redemption Terminal:** Cashiers verify student passes using optical QR scanning or manual 4-digit PIN lookup.
   - **Fraud-Proof Claim Engine:** Prevents double-claiming and immediately marks orders as `CLAIMED & HANDED OVER` with celebratory feedback.

3. **Real-Time Environmental & Economic Impact Engine:**
   - **Meals Rescued Counter:** Tracks community meal count live.
   - **CO₂ Emissions Avoided:** Calculates greenhouse gases diverted (2.5 kg CO₂ equivalent per rescued meal).
   - **Student Financial Savings:** Calculates total dollars saved compared to original menu retail prices.

---

#### 🛠️ How We Built It
- **Frontend Core:** React 19 + Vite for sub-second build times and silky-smooth client rendering.
- **Styling & Design System:** Tailwind CSS v4 with a custom editorial palette (`forest`, `ivory`, `tomato`, `butter`, `paper`) evoking artisanal bakery menus and tactile paper tickets.
- **Dynamic QR Codes:** `qrcode.react` generating scannable payloads encoded with timestamp, PIN, and listing metadata.
- **Audio & Visual Wow-Factor:** Synthesized Web Audio API celebratory two-tone chimes paired with `canvas-confetti` bursts on verified pickups.
- **Offline-Resilient State Engine:** Reactive state synchronized to `localStorage` with a floating **Demo Controller Bar** allowing instant role toggling (`Student Shelf` vs. `Kitchen Hub` vs. `QR Scanner`) and one-click demo re-seeding.

---

#### 🌍 Real-World Impact (Why It Wins)
Next Byte Hacks V5 judges solely on **Impact**—and RescueBite is built around tangible, measurable good:

1. **UN SDG 2 (Zero Hunger):** Provides students dignified, low-cost or free access to restaurant-grade nutrition without social stigma.
2. **UN SDG 12 & 13 (Responsible Consumption & Climate Action):** Food waste accounts for 8–10% of global greenhouse emissions. Rescuing just 1,000 meals through RescueBite keeps **2.5 metric tons of CO₂** out of the atmosphere.
3. **Economic Recoupment for Small Businesses:** Rather than absorbing total losses, local campus cafes recover baseline ingredient costs while generating immense goodwill with the university student body.

---

#### 🧗 Challenges We Ran Into
- **Designing for Busy Kitchen Staff:** Restaurant employees closing up at 9:30 PM do not have time for multi-step data entry. We solved this by creating **one-click presets** allowing staff to publish surplus in 3 taps.
- **Seamless Redemption Without Complex Hardware:** Balancing high-tech QR scanning with low-tech manual PIN entry so cashiers in low-light environments can verify passes in 2 seconds.
- **Simulating Real-Time Multi-Party State:** Coordinating state between student reservations, kitchen queues, and global impact metrics without relying on flaky backend APIs during live judging.

---

#### 🏆 Accomplishments That We're Proud Of
- A tactile, editorial UI that looks like a high-end food publication rather than a sterile tech portal.
- Zero external audio/asset dependencies: built-in Web Audio synthesis and self-contained vector QR generation.
- Full end-to-end user loop completed: from student browsing $\rightarrow$ countdown reservation $\rightarrow$ kitchen dispatch $\rightarrow$ cashier verification $\rightarrow$ global impact increment.

---

#### 📚 What We Learned
- How to divide responsibilities cleanly into two parallel workstreams (Student UX vs. Business Operations & Verification) to build 2x faster.
- The critical role of urgency cues (countdown timers, stock warnings) in driving prompt consumer action.

---

#### 🚀 What's Next for RescueBite
1. **University Dining Plan Integration:** Allow students to spend excess university dining dollars or meal swipes directly on rescue boxes.
2. **Push Notifications for Favorited Kitchens:** Alert students the moment their favorite campus cafe posts a closing-time surplus drop.
3. **Food Bank Redistribution API:** Automatically route any uncollected meals after final closing time to local community shelters and mutual-aid refrigerators.

---

### 3. Built With (Devpost Tags)
`React` · `JavaScript` · `Vite` · `TailwindCSS` · `Lucide-Icons` · `QRCode` · `WebAudioAPI` · `CanvasConfetti` · `SocialGood` · `FoodWaste` · `Sustainability`
