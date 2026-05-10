# MedBook — Patient Appointment Booking

A patient appointment booking system built as a technical work sample. The app includes a polished multi-step patient wizard and a fully functional admin dashboard — no backend required.

---

## How to Run

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173)

---

## What I Built

MedBook is a single-page React application with two distinct flows: a patient-facing booking wizard and a physician/admin dashboard. Both share a single in-memory bookings array — appointments created through the patient flow appear instantly in the admin view.

The patient flow is a four-step wizard: choose a physician, select a date and time slot, fill in personal and insurance details, and receive a confirmation screen with a generated booking ID. The experience is designed to feel calm and trustworthy — a warm off-white palette, editorial serif typography, and soft transitions rather than the sterile or frantic aesthetic common in healthcare UIs.

The admin dashboard gives physicians a live view of all appointments. Stats at the top react to every status change. The filter bar narrows the list by status, and each row's action buttons let a physician confirm or cancel a pending request with a single click. The dashboard is seeded with eight realistic bookings across six physicians so it reads as a live system from the moment it loads — an empty state would have undersold the feature.

---

## Key Technical & Product Decisions

**1. `useState` + custom hook over Redux or Zustand.**
All booking state lives in `useBookings`, a single custom hook exported from `src/hooks/useBookings.js`. It exposes `bookings`, `addBooking`, and `updateBookingStatus` — a minimal, readable API. The state surface here is genuinely small: one array, two mutations. Pulling in a state library would add indirection, boilerplate, and cognitive overhead with zero functional benefit at this scope. The hook pattern also makes the data flow easy to audit — you can trace every state change from the hook to the component that triggers it.

**2. Mock data over a local database (SQLite, json-server).**
The brief asked for a frontend-only demo that can be cloned and run with `npm run dev` and nothing else. A `json-server` backend would require a second terminal process and a coordinated startup sequence; SQLite would require native bindings. Mock data in `src/data/` files costs nothing to run, is instantly reproducible, and is honest about what this exercise is testing. Date-based fields in `mockBookings.js` use absolute ISO strings so the admin table always renders coherently regardless of when you open it.

**3. Controlled step state vs. router-based wizard.**
The wizard uses a single `step` integer in `BookingWizard.jsx` to determine which step component renders. React Router would have been the instinct for multi-view navigation, but it would also have introduced URL management, route params for passing doctor/date/time selection between steps, and scroll restoration concerns — all complexity that adds no UX value in a linear wizard. Step state in a single parent component keeps the data flow flat and gives the wizard full control over transitions (a `key={step}` on the wrapper triggers the CSS fade-slide-up animation on every step change).

**4. Manual form validation over react-hook-form.**
`StepPatientForm.jsx` uses a plain `validate()` function: build an errors object, set it in state, render inline error messages. This is roughly 20 lines and has no dependencies. `react-hook-form` is the right call when you have complex async validation, field arrays, or deeply nested schemas. For six fields with simple required/email checks, a library would obscure more logic than it eliminates. The approach also makes the validation rules immediately readable to any reviewer without knowing the library's API.

**5. Seeding the admin view with realistic data.**
An admin dashboard with no bookings looks like a broken feature, not a demo. The eight seeded bookings — spread across multiple physicians, statuses, and dates — let a reviewer immediately see the filter bar in action, the stat counters increment when they confirm a booking, and the color-coded status badges at a glance. This is a product judgment call: a technically correct empty state would have made the feature harder to evaluate fairly.

---

## What I'd Improve With More Time

- **Real authentication.** Currently the admin tab is unprotected. Production would gate it behind a session check — at minimum a separate login route, ideally SSO tied to the physician's identity provider.

- **Persistent storage.** Refreshing the page resets all state. Swapping `useState` for a Supabase client (or even `localStorage`) would make new bookings survive a reload without changing the component API — the hook's return signature is already the right abstraction boundary.

- **Transactional email.** The confirmation screen tells the patient their booking is pending, but nothing actually notifies them. Integrating Resend or SendGrid on a lightweight serverless function would close that loop.

- **Calendar view in admin.** A table is the right starting point for information density, but physicians think in terms of their weekly schedule. A month-view calendar with color-coded appointment blocks would be more natural for daily use.

- **Real availability logic.** `StepTimeSelect` generates the same 14 weekdays and 15 time slots for every physician. A production system would have physicians define weekly availability templates and block off holidays — the slot generation function would hit a database, not a hardcoded constant.

- **Accessibility pass.** Focus management between wizard steps, `aria-live` announcements on status changes, and visible keyboard navigation for the date chip list need work before this meets WCAG 2.1 AA.
