# MedBook - Patient Appointment Booking

A patient-facing appointment booking system with a physician admin dashboard. Built with React + Vite and Tailwind CSS — no backend required.

---

## How to Run

**Requirements:** Node.js 18+

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## What I Built

MedBook has two views that share a single live bookings state — anything booked through the patient flow appears immediately in the admin dashboard.

**Patient Flow — 4-step wizard**

1. **Choose a Physician** - Browse six physicians with their specialty, bio, rating, years of experience, and available slot count. Selecting a card moves to the next step.
2. **Select a Time** - Pick a date from the next 14 weekdays, then choose a morning or afternoon slot. Slots already booked for that physician are automatically filtered out.
3. **Patient Details** - Form collects name, date of birth, email, phone, reason for visit, and insurance provider (Canadian insurers + No Insurance). Client-side validation runs on submit with inline errors per field.
4. **Confirmation** - Shows a generated booking ID (`BK-XXXX`), full appointment summary, and a "Pending Confirmation" status badge. A "Book Another Appointment" button resets the wizard.

**Admin Dashboard**

- Live stats row: Total, Pending, Confirmed, Cancelled — updates instantly on every status change
- Filter bar to narrow the list by status
- Full booking table on desktop; stacked card layout on mobile (no horizontal scroll)
- Confirm and Cancel actions per booking, correct buttons shown based on current status
- Pre-seeded with 8 realistic bookings so the dashboard looks live on first load

---

## Key Technical & Product Decisions

**`useState` + custom hook over Redux or Zustand**
All booking state lives in a single `useBookings` hook that exposes `bookings`, `addBooking`, and `updateBookingStatus`. The state surface is small — one array, two mutations — so a state library would've added boilerplate without any real benefit. Keeping it in a hook also makes the data flow easy to follow: every update traces directly from the hook to the component that triggers it.

**Mock data over a local database**
The brief didn't ask for persistence, and adding `json-server` or SQLite would've required a second process to run and native bindings to install. Plain JS files in `src/data/` are zero-config and instantly reproducible. The seeded bookings use absolute ISO date strings, so the admin table always looks current regardless of when someone runs it.

**Step-based wizard over React Router**
A single `step` integer in `BookingWizard.jsx` drives the whole flow. React Router would've introduced URL management, route params for carrying selected doctor/time between steps, and scroll restoration concerns; none of which add any UX value for a linear four-step form. Using `key={step}` on the step wrapper also gives me the fade-slide animation for free on every transition.

**Manual form validation over react-hook-form**
Six fields with straightforward required/email checks don't need a library. A plain `validate()` function that returns an errors object is about 20 lines and zero dependencies — and any reviewer can read it without knowing a library's API. I'd reach for react-hook-form if the form had async validation, field arrays, or deeply nested schemas.

**Seeding the admin view**
An empty admin dashboard looks broken, not minimal. The eight seeded bookings — spread across all six physicians with a mix of statuses — let you immediately see the filter bar working, watch the stats react when you confirm a booking, and get a real sense of how the product would feel in use.

---

## What I'd Improve With More Time

- **Auth separation.** The admin tab is wide open right now. In production, it'd sit behind a session check, ideally with a separate physician login rather than just a nav toggle.

- **Persistence.** Refreshing resets everything. Swapping the `useState` array for a Supabase table or even `localStorage` would be a small change inside the hook; the component API wouldn't need to touch at all.

- **Email notifications.** The confirmation screen says "you'll be contacted to confirm", but nothing actually sends. Wiring up Resend on a simple serverless function would close that loop for both booking confirmation and status changes.

- **Calendar view in admin.** The table works well for dense information, but physicians think in schedules. A weekly calendar view with colour-coded appointment blocks would be more natural for daily use.

- **Real availability logic.** Every physician currently shows the same 14 weekdays and time slots. A real system would let physicians set recurring weekly availability and block off time off; that logic would live in the database, not a hardcoded constant.

- **Accessibility.** Focus management between wizard steps, `aria-live` regions on status updates, and proper keyboard nav for the date grid are the main gaps before this is production-ready.
