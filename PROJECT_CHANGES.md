# Project Changes — Easy Explanation

**Project:** Orphan Educational Sponsorship and Tracking System (OESTS)  
**GitHub:** https://github.com/M-USMAN-KHILJI/React-Js-Project  
**Who this is for:** Teachers, teammates, examiners, friends — anyone who wants to understand what was built and changed, in simple language.

---

## 1. What this project is

This is a full website system for an NGO that helps **orphan students** get education support.

| Part | Technology | What it does |
|------|------------|--------------|
| Frontend | React (Vite) | The website people see and click |
| Backend | Django REST API | Saves data, login, approvals, reports |
| Database | PostgreSQL | Stores users, orphans, schools, donations, feedback |

**Main users (roles):**
- **Admin (NGO)** — approves orphans, views reports, donations, feedback
- **Donor** — sponsors orphans / makes donations
- **School** — uploads monthly progress reports for enrolled students
- **Guardian** — applies for an orphan to join the program

---

## 2. Big picture of what we changed

We improved the project so it is:

1. **Easier to use** (better forms, screens, messages)
2. **More complete** (admin panel, feedback, newsletter, reports)
3. **Easier to share** (friend can set up database with one command / Antigravity prompt)
4. **Safer for GitHub** (real passwords stay on your PC; not uploaded)

Older UI polish notes are also in `WEBSITE_CHANGES.md`. This file covers the **full project changes**.

---

## 3. Orphan application improvements

### What changed
- Guardian must enter the child’s **age**.
- **School name** and **class** are **optional** on the application form.
- If school/class are left empty, the system marks the child as **not currently studying**.
- When Admin **approves**, Admin must choose a **registered school** and **class** (so the child is assigned properly).

### Why
Many children may not be in school yet. The form should still work. Admin decides the school later during approval.

### Also fixed
- Submitting the form with photo / death certificate upload works correctly.
- Clear error messages if something fails.
- Phone number: **11 digits** only (example: `03112233445`).
- Guardian CNIC: **13 digits**, shown as `XXXXX-XXXXXXX-X`.

---

## 4. School portal — only “their” students

### What changed
A school login only sees orphans who are:
- **Approved**, and
- Assigned / studying at **that school**.

### Why
Schools should not see other schools’ students. Reports stay private to the correct school.

---

## 5. Homepage and images

### What changed
- Featured orphans show proper photos (seeded demo photos + public images).
- Images display without ugly cropping where possible.
- Home navbar is **transparent over the hero**, then becomes solid when you scroll.
- Soft animations: scroll reveal, hero zoom, How-It-Works highlight, button/card motion.
- Hero text stays visible (fixed a bug where text could disappear).

---

## 6. Admin panel redesign

### What changed
Admin now has a **side menu** with clear sections:

| Section | Purpose |
|---------|---------|
| Overview | Counts + recent applications, donations, schools |
| Orphans | View applications, open details, approve / reject |
| Student Monthly Reports | Read school progress reports |
| Schools | Manage / view schools |
| Donors | See donors and donations |
| Website Feedback | Feedback messages + newsletter subscribers |

### Extra details
- Click a row to open a **detail popup** (orphan, report, donation, feedback).
- Death certificate PDF can be viewed when uploaded.
- New backend APIs support orphan detail, reports list, donors list, feedback, newsletter list.

---

## 7. Feedback and newsletter

### Feedback form
- Visitor must enter **email** (required).
- Admin can see name, email, and comments.
- Clicking a feedback row opens full details.

### Newsletter
- Visitor enters email to subscribe.
- Confirmation is handled by email settings (on a friend’s PC, messages can print in the backend terminal for local demo).
- If email is already subscribed → clear “already subscribed” message.
- Admin can see subscriber emails under Feedback.

---

## 8. Register / login experience

### What changed
- After register → go to **Verify Email** page → success message → then login.
- Success toasts (popup messages) for login, register, donate, approve, reject, reports, etc.
- Auth pages (login/register/forgot/reset) use a clean full-screen layout without normal website navbar/footer.

---

## 9. Donations

### What changed
- Donor can sponsor using a **dummy card payment UI** (for demo/project presentation).
- Thank-you flow after donation (including email support when SMTP is configured).

---

## 10. Demo data (seeder)

A command fills the database with sample data so the website looks “alive” for demos:

- 1 Admin, 5 Donors, 3 Schools, 8 Guardians  
- Sample orphan applications (some approved, some pending)  
- Sample donations and school monthly reports  
- Sample contact messages, feedback, newsletter emails  

**Command:**
```bat
python manage.py seed_demo_data
```

**Demo passwords (after seeding):**

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@gmail.com | admin@123 |
| Donor | donor1@gmail.com | Donor@123 |
| School | school1@gmail.com | School@123 |
| Guardian | guardian1@gmail.com | Guardian@123 |

---

## 11. Friend / new laptop setup (important for sharing)

### Problem we solved
Your friend downloads the ZIP from GitHub. Their PostgreSQL password and database name are **different** from yours. They need an easy way to create **their** database, create **all tables**, load demo data, and run the app.

### What we added

| File | What it does |
|------|----------------|
| `setup_from_credentials.py` | Asks for (or receives) DB name, user, password, host, port → writes `.env` → creates DB → runs **migrations** → seeds demo data |
| `setup_all.bat` | One double-click setup for Windows (backend + frontend install) |
| `setup_project.bat` | Backend-only setup |
| `FRIEND_SETUP.md` | Step-by-step guide + **Antigravity prompt** |
| `create_db.py` | Creates the PostgreSQL database if it does not exist |
| `.env.example` | Safe example of settings (no real passwords) |

### What “migration” means (simple)
Migration = Django reads the project’s migration files and **creates all database tables** (users, orphans, schools, donations, feedback, etc.) inside PostgreSQL.

So when your friend gives Antigravity the prompt (with their DB password), Antigravity runs `setup_from_credentials.py`, and **yes — migrations are done automatically**.

### Safety
- Real `.env` with passwords is **not** uploaded to GitHub.
- Friend creates their own `.env` on their computer.

---

## 12. Backend settings cleanup

### What changed
- Database settings read from `.env` (`DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`).
- Default local database name aligned to `orphan_dbase`.
- Email uses **console mode by default** for local demo (OTP / newsletter text appears in the backend terminal). Real Gmail SMTP is optional later.
- Secrets (SECRET_KEY, Stripe keys, email password) come from `.env`, not hardcoded in code for GitHub.

---

## 13. How to run (after setup)

**Terminal 1 — Backend**
```bat
cd orphan-sponsorship-backend
venv\Scripts\activate
python manage.py runserver
```

**Terminal 2 — Frontend**
```bat
cd orphan-sponsorship-frontend
npm run dev
```

Then open: **http://127.0.0.1:5173**  
Backend API: **http://127.0.0.1:8000**

---

## 14. Folder map (so you know where things live)

```
React-Js-Project/
├── README.md                 → Short project intro
├── FRIEND_SETUP.md           → Friend + Antigravity setup guide
├── PROJECT_CHANGES.md        → This file (all changes explained)
├── WEBSITE_CHANGES.md        → Earlier UI polish details
├── setup_all.bat             → Full Windows setup
├── orphan-sponsorship-frontend/   → React website
└── orphan-sponsorship-backend/    → Django API + DB migrations + seeder
    ├── setup_from_credentials.py
    ├── create_db.py
    ├── SETUP_AND_SEED.md
    ├── users / orphans / schools / donors / sitecontent
    └── media/ (local uploads — not for GitHub)
```

---

## 15. Summary for viva / presentation

In one sentence:

> We built a complete orphan sponsorship web system with role-based portals, improved application and admin workflows, feedback/newsletter features, demo data seeding, and a one-command setup so any friend can create the PostgreSQL database, run migrations, and start the project using their own credentials.

---

## 16. Related documents

- `FRIEND_SETUP.md` — how a friend installs the project  
- `orphan-sponsorship-backend/SETUP_AND_SEED.md` — database & seeder details  
- `WEBSITE_CHANGES.md` — UI design changes (auth layout, cards, notifications)  
