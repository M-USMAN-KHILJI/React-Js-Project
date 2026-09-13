# Orphan Sponsorship Frontend - Project Study Guide

This document provides a comprehensive analysis of the Orphan Sponsorship Frontend application, its architecture, workflows, and folder structure. You can use this guide to understand how the project works and where to find specific functionality.

## 1. Project Overview
This is a modern React web application built using Vite. The application serves as a platform connecting multiple user roles (Admins, Donors, Schools, and Orphans) for an orphan sponsorship program. It interacts with a backend API (expected to be Django) and integrates Stripe for payment processing.

### Tech Stack
*   **Framework**: React (v18)
*   **Build Tool**: Vite
*   **Routing**: React Router DOM (v6)
*   **Styling**: Tailwind CSS
*   **HTTP Client**: Axios
*   **State Management**: React Context API
*   **Payments**: Stripe (`@stripe/react-stripe-js` & `@stripe/stripe-js`)

---

## 2. Directory Structure

The project code is primarily located inside the `src` folder.

```text
orphan-sponsorship-frontend/
├── public/                 # Static assets (images, favicon, etc.)
├── src/                    # Main source code directory
│   ├── components/         # Reusable UI components
│   ├── context/            # Global state management (Authentication)
│   ├── pages/              # Top-level page components (Routes)
│   ├── services/           # External service/API integrations
│   ├── App.jsx             # Main routing and layout component
│   ├── index.css           # Global CSS (Tailwind imports)
│   ├── main.jsx            # Application entry point
│   └── stripe.js           # Stripe configuration
├── package.json            # Project dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite bundler configuration
```

---

## 3. Core Architecture & Flow

### A. Application Entry (`main.jsx`)
The application starts in `src/main.jsx`. Here, the root React component (`App`) is wrapped in two essential providers:
1.  **`BrowserRouter`**: Enables client-side routing.
2.  **`AuthProvider`**: Manages global user authentication state.

### B. Routing & Layout (`App.jsx`)
`src/App.jsx` defines all the routes in the application. It establishes a consistent layout with a `Navbar` at the top and a `Footer` at the bottom. The content between them changes based on the URL.

**Route Types:**
*   **Public Routes**: Accessible by anyone (e.g., `/`, `/login`, `/register`).
*   **Protected Routes**: The `ProtectedRoute` component is used to restrict access to specific pages based on the user's role. For example, only a user with the role "admin" can access the `/admin-dashboard`.

### C. State Management (`context/AuthContext.jsx`)
The `AuthContext` manages the authentication state across the entire application.
*   It reads `oests_user` and `oests_token` from the browser's `localStorage` on initial load to keep users logged in.
*   It provides `login` and `logout` functions that update the state and the `localStorage`.
*   Any component can access the current user state using the `useAuth()` hook.

### D. API Integration (`services/api.js`)
All communication with the backend is centralized in this file. It uses an Axios instance configured with a base URL (`http://127.0.0.1:8000/api`).

**Key Feature - Interceptor**:
The file sets up an Axios request interceptor. This interceptor automatically attaches the JWT token (stored in `localStorage`) to the `Authorization` header of every outgoing request, *except* for authentication endpoints (like login/register).

The API endpoints are grouped logically:
*   **Auth**: Login, OTP, Password Reset.
*   **Orphans**: Fetching orphans, submitting applications.
*   **Donations**: Stripe payment intents, donation history.
*   **School Reports**: Submitting progress reports for students.
*   **Admin**: Dashboard stats, approving/rejecting applications.

---

## 4. User Role Workflows

The platform is designed around four distinct user roles, each with their own dedicated portal.

### 1. Donor Workflow
*   **Portal**: `src/pages/DonorPortal.jsx`
*   **Flow**: Donors can browse available orphans, initiate a sponsorship/donation, and view their past donation history and receipts.
*   **Payment**: Uses `src/components/StripePaymentForm.jsx` to securely collect credit card information and process donations via the Stripe API.

### 2. Orphan Workflow
*   **Portal**: `src/pages/OrphanApplication.jsx`
*   **Flow**: Orphans (or their guardians) use this form to apply for the sponsorship program. Once accepted, they can view their progress reports via `src/pages/ProgressReport.jsx`.

### 3. School Workflow
*   **Portal**: `src/pages/SchoolPortal.jsx`
*   **Flow**: Partner schools can log in to view the sponsored orphans attending their school. They are responsible for submitting periodic academic and social progress reports for these students.

### 4. Admin Workflow
*   **Portal**: `src/pages/AdminDashboard.jsx`
*   **Flow**: Administrators have an overarching view of the platform. They can view platform statistics, review incoming orphan applications (approving or rejecting them), and oversee donations and school reports.

---

## 5. Next Steps for Studying
To fully understand the project, you should study the files in this specific order:

1.  Start with `package.json` to understand the dependencies.
2.  Read `src/main.jsx` and `src/App.jsx` to see how the app is initialized and routed.
3.  Study `src/context/AuthContext.jsx` to see how user sessions are managed.
4.  Review `src/services/api.js` to understand how the frontend talks to the backend.
5.  Pick a specific user flow (e.g., Donor) and trace it from the `pages/DonorPortal.jsx` down to the components it uses (`StripePaymentForm.jsx`, `OrphanCard.jsx`).
