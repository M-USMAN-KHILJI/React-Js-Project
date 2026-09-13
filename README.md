# React-Js-Project — Orphan Educational Sponsorship and Tracking System (OESTS)

Full-stack demo: **React (Vite) frontend** + **Django REST backend** + **PostgreSQL**.

## Documents

| File | What it explains |
|------|------------------|
| **[PROJECT_CHANGES.md](PROJECT_CHANGES.md)** | All project changes in simple language |
| **[FRIEND_SETUP.md](FRIEND_SETUP.md)** | How a friend sets up DB + runs the app (Antigravity prompt) |
| **[WEBSITE_CHANGES.md](WEBSITE_CHANGES.md)** | UI polish details |

## Quick start for a friend (ZIP / clone)

1. Install Python 3.12+, PostgreSQL, and Node.js 18+
2. Read **[FRIEND_SETUP.md](FRIEND_SETUP.md)** — includes the ready-made **Antigravity prompt**
3. Or double-click **`setup_all.bat`** and enter your Postgres credentials

That creates the database, runs all migrations (tables), seeds demo data, and installs the frontend.

## Project folders

| Folder | Purpose |
|--------|---------|
| `orphan-sponsorship-frontend` | React + Vite + Tailwind UI |
| `orphan-sponsorship-backend` | Django API + migrations + seeder |

## Demo logins (after setup)

- Admin: `admin@gmail.com` / `admin@123`
- Donor: `donor1@gmail.com` / `Donor@123`
- School: `school1@gmail.com` / `School@123`

## Backend-only DB setup

```bat
cd orphan-sponsorship-backend
python setup_from_credentials.py --db-name orphan_dbase --db-user postgres --db-password YOUR_PASSWORD --db-host localhost --db-port 5432
python manage.py runserver
```
