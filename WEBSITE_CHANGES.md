# Website Changes Guide

**Project:** Orphan Educational Sponsorship and Tracking System (OESTS)  
**Scope:** Frontend UI polish + related backend donation email update  
**Audience:** Anyone who needs to understand what changed and why

This document explains the website updates in plain language so you can review, demo, or continue development easily.

---

## 1. Overview (what changed in short)

The website was improved to look more **professional**, **clear**, and **user-friendly**. Main work areas:

1. Auth pages (Login, Register, Forgot Password, Reset Password)
2. Home page design (hero, cards, shadows, orphan details)
3. Reusable UI components (notifications, modals, tabs)
4. Donor sponsorship payment UI (dummy credit card form)
5. Portal screens (Admin, Donor, School, Orphan)
6. Image file cleanup and footer contact polish
7. Thank-you email after donation (backend)

---

## 2. Auth pages (Login / Create Account / Forgot / Reset)

### What you will notice
- **Navbar and Footer are hidden** on these pages.
- Pages use a **full-screen auth layout**:
  - Left side (desktop): brand panel / role selection
  - Right side: form card
- Design uses navy + gold colors and Plus Jakarta Sans font.

### Why
Auth pages feel more like a real product login experience, not a normal website page with navigation.

### Main files
- `orphan-sponsorship-frontend/src/App.jsx`  
  Detects auth routes and hides Navbar/Footer.
- `orphan-sponsorship-frontend/src/components/ui/AuthLayout.jsx`  
  Shared layout for all auth pages.
- `orphan-sponsorship-frontend/src/pages/Login.jsx`
- `orphan-sponsorship-frontend/src/pages/Register.jsx`
- `orphan-sponsorship-frontend/src/pages/ForgotPassword.jsx`
- `orphan-sponsorship-frontend/src/pages/ResetPassword.jsx`

### Role selection
- On **Login** and **Register**, roles were moved to the **left panel** on desktop.
- On mobile, roles still appear above the form (because the left panel is hidden on small screens).

---

## 3. Success notification (toast from top-right)

### What it is
A reusable popup that slides in from the **top-right** of the screen.

### When it appears
Examples:
- Successful login
- Successful account creation
- Successful donation
- Admin approve/reject
- School report submit
- Orphan application submit

### How to reuse it
Import and control with `open` state:

```jsx
import SuccessNotification from '../components/SuccessNotification'

<SuccessNotification
  open={showNotice}
  type="login" // login | register | donate | approve | reject | report | success
  onClose={() => setShowNotice(false)}
/>
```

### File
- `orphan-sponsorship-frontend/src/components/SuccessNotification.jsx`

---

## 4. Home page improvements

### Hero section
- Full-width hero background image: `/hero-education.jpg`
- Dark gradient overlay so white text stays readable
- Keeps only: tagline, headline, short sentence, and CTA buttons

### Elevated cards (shadows)
- Stats boxes, mission box, orphan cards, “How it works”, newsletter, and trust boxes use stronger shadows and a slight hover lift.
- CSS class: `ui-card-elevated` in `src/index.css`

### Featured Orphan Profiles
- Clicking a profile opens **Orphan Detail Modal** (photo + details).
- Clicking **Sponsor Now**:
  - If **not logged in** → goes to Login
  - If logged in as **donor** → opens donation modal
  - If logged in as another role → goes to Login

### Files
- `orphan-sponsorship-frontend/src/pages/Home.jsx`
- `orphan-sponsorship-frontend/src/components/OrphanDetailModal.jsx`
- `orphan-sponsorship-frontend/src/components/OrphanCard.jsx`
- `orphan-sponsorship-frontend/public/hero-education.jpg`

---

## 5. Orphan detail modal

### What it shows
- Large orphan photo
- Name + verified badge
- Age, class, school, location
- Short bio (when available)
- Buttons: **Sponsor Now** and **Close**

### File
- `orphan-sponsorship-frontend/src/components/OrphanDetailModal.jsx`

### How to reuse

```jsx
import OrphanDetailModal from '../components/OrphanDetailModal'

<OrphanDetailModal
  open={!!selectedOrphan}
  orphan={selectedOrphan}
  onClose={() => setSelectedOrphan(null)}
  onSponsor={(orphan) => { /* open donation or navigate */ }}
/>
```

---

## 6. Dummy credit card donation flow (frontend professional UI)

### Goal
Make sponsorship look professional with a credit-card style payment form, without requiring real card processing for this demo UI.

### User flow
1. Logged-in **donor** clicks **Sponsor**.
2. Modal opens with:
   - Donation amount (PKR)
   - Card holder name
   - Card number
   - Expiry (MM/YY)
   - CVV
3. On submit:
   - Card details stay in the frontend only (not saved to backend).
   - Donation amount + orphan are sent to backend API.
   - Top-right success notification appears.
   - Backend sends a thank-you email to the donor (includes amount).

### Important note
- Card fields are for **UI / demo professionalism**.
- Real donation record is created through `/api/donations/`.
- In development, emails are printed in the **Django backend terminal** (console email backend), not a real inbox.

### Files
- `orphan-sponsorship-frontend/src/components/DummyDonationModal.jsx` (new)
- `orphan-sponsorship-frontend/src/pages/DonorPortal.jsx` (updated to use dummy modal)
- `orphan-sponsorship-frontend/src/pages/Home.jsx` (sponsor button opens modal for logged-in donors)
- `orphan-sponsorship-backend/donors/views.py` (donation marked paid + clearer thank-you email)

### Where it works
- Donor Portal → **Sponsor This Child**
- Home page → **Sponsor Now** / detail modal sponsor button (donor login required)

---

## 7. Shared UI / design system polish

### Visual identity
- Font: **Plus Jakarta Sans**
- Colors: navy (`nude-*`) + gold accents
- Base body text color/size set for consistency

### Shared components used across pages
| Component | Purpose |
|-----------|---------|
| `Button` | Primary / accent / outline / ghost / danger buttons |
| `Input` | Text fields, select, textarea |
| `Modal` | Center dialog with fade/scale animation |
| `Tabs` | Shared tab underline style (Donor Portal) |
| `PageHeader` | Consistent page title + subtitle |
| `Alert` | Inline success/error messages |
| `EmptyState` | Friendly empty lists |
| `Spinner` | Loading state |
| `StatusBadge` | Application status labels |

### CSS / Tailwind updates
- `src/index.css` → `ui-card-elevated`, base body styles
- `tailwind.config.js` → soft shadow, slide/fade/modal animations

### Bug fix related to this
- A black/blank screen was caused by using custom class `shadow-soft` inside Tailwind `@apply`.
- Fixed by writing the elevated card shadow as normal CSS instead.

---

## 8. Portal screens polish

### Admin Dashboard
- Elevated stat cards and section cards
- Success toast after approve/reject

### Donor Portal
- Shared Tabs component
- Elevated history table card
- Dummy donation modal + success toast

### School Portal
- Elevated cards
- Success toast after submitting monthly report

### Orphan Application / Dashboard
- Elevated cards
- Success toast after application submit

### Progress Report
- Elevated cards for consistency

---

## 9. Navbar and Footer

### Navbar
- Slightly more compact height
- Cleaner spacing and link size

### Footer
- Cleaner demo contact details:
  - Email: `info@oests.org`
  - Phone: `+92 42 111 123 456`
  - Address: University Road, Lahore, Pakistan
- Added “Academic demo project · OESTS” note

### Files
- `orphan-sponsorship-frontend/src/components/Navbar.jsx`
- `orphan-sponsorship-frontend/src/components/Footer.jsx`

---

## 10. Image cleanup

Old messy filenames (like `eman-fatima.jpg.jpeg.jpeg`) were renamed to clean names.

### Current public images
- `hero-education.jpg` (home hero)
- `eman-fatima.jpg`
- `muhammad-ali.jpg`
- `hamza-ahmed.jpg`
- `about-mission.jpg`
- `contact-us.jpg`
- `feedback.jpg`
- `stat-orphans.jpg`
- `stat-donors.jpg`
- `stat-schools.jpg`
- `stat-donations.jpg`
- `favicon.svg`

All page references were updated to the new names.

---

## 11. Backend change linked to donation UI

### File
- `orphan-sponsorship-backend/donors/views.py`

### What changed
When a donor donates through `/api/donations/`:
1. Donation is saved
2. `payment_status` is set to `paid`
3. Email is sent to donor with:
   - Thank-you message
   - Amount donated
   - Sponsored child name
   - Receipt number
   - Date

---

## 12. New / important frontend files to remember

| File | What it does |
|------|----------------|
| `src/components/ui/AuthLayout.jsx` | Auth page shell |
| `src/components/SuccessNotification.jsx` | Top-right success toast |
| `src/components/OrphanDetailModal.jsx` | Orphan profile details popup |
| `src/components/DummyDonationModal.jsx` | Dummy card + amount donation popup |
| `src/components/ui/Tabs.jsx` | Shared tabs UI |

---

## 13. How to test these changes quickly

1. Start frontend (`npm run dev`) and backend (`python manage.py runserver`).
2. Open Home → confirm hero image, shadows, orphan detail modal.
3. Open Login/Register → confirm no navbar/footer, roles on left (desktop).
4. Login as **donor** → Sponsor an orphan → fill dummy card + amount → submit.
5. Confirm:
   - Success toast appears
   - Donation shows in Donation History
   - Thank-you email text appears in backend terminal
6. Login as admin/school/orphan and confirm portal cards/toasts still look consistent.

---

## 14. What was intentionally not changed

- Core business logic of roles (admin, donor, school, orphan) stayed the same.
- Real Stripe flow still exists in code (`StripePaymentForm.jsx`), but the donor UI now uses the **dummy professional card modal** for sponsorship.
- Database models were not redesigned; existing donation/email APIs were reused.

---

## 15. Summary for evaluators / viva

The website UI was upgraded to a professional navy-and-gold design with cleaner auth pages, stronger home-page presentation, reusable notification/modals, and a realistic-looking donation payment form. Donations still create real records in the system and trigger thank-you emails that include the donated amount.

If you need to continue development, start from this file and the components listed in **Section 12**.
