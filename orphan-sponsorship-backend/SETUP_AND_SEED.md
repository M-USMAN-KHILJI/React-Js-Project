# Database Setup & Seeder Guide (Other Laptop)

This project uses **one PostgreSQL database** with multiple **tables**.

For the full friend/Antigravity guide, see **`FRIEND_SETUP.md`** in the project root.

## Quick setup (credentials → DB → tables → demo data)

```bat
cd orphan-sponsorship-backend
python setup_from_credentials.py --db-name orphan_dbase --db-user postgres --db-password YOUR_PASSWORD --db-host localhost --db-port 5432
```

Or interactive:

```bat
cd orphan-sponsorship-backend
setup_project.bat
```

Or full project (backend + frontend npm install):

```bat
setup_all.bat
```

This will:
1. Write `.env` with your Postgres credentials
2. Create the database if it does not exist
3. Run `migrate` (create all tables)
4. Run `seed_demo_data` (demo users and sample records)

## Prerequisites
- Python 3.12+
- PostgreSQL (running)
- Node.js 18+ (for frontend)

## Frontend

```bat
cd orphan-sponsorship-frontend
npm install
npm run dev
```

Backend:

```bat
cd orphan-sponsorship-backend
venv\Scripts\activate
python manage.py runserver
```

## Demo accounts created by seeder

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@gmail.com` | `admin@123` |
| Donor | `donor1@gmail.com` … `donor5@gmail.com` | `Donor@123` |
| School | `school1@gmail.com` (Dream School) | `School@123` |
| School | `school2@gmail.com` (Central Model School) | `School@123` |
| School | `school3@gmail.com` (Pak Model School) | `School@123` |
| Guardian | `guardian1@gmail.com` … `guardian8@gmail.com` | `Guardian@123` |

## What the seeder creates
- 1 admin + 5 donors + 3 schools + 8 guardians
- 8 orphan applications (6 Approved, 2 Pending)
- 8 donations
- 8 school progress reports
- Contact messages, feedback entries, newsletter subscribers

Re-run safely:

```bat
python manage.py seed_demo_data
```

Optional full reset of demo rows:

```bat
python manage.py seed_demo_data --flush-demo
```

## Important
- School account **full name** must match orphan `school_name_text` for school portal students to appear.
- Homepage featured orphans and stats load from public APIs (no login required).
- Contact, Feedback, and Newsletter forms save to PostgreSQL.
- Do not commit your real `.env` file.
