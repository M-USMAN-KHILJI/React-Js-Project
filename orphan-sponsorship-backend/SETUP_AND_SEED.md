# Database Setup & Seeder Guide (Other Laptop)

This project uses **one PostgreSQL database** with multiple **tables**.

Your `.env` currently points to:

```env
DB_NAME=orphan_dbase
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
```

## Quick setup on a new computer

### 1. Install prerequisites
- Python 3.12+
- PostgreSQL (running on port 5432)
- Node.js 18+

### 2. Backend (creates DB + tables + demo data)

```bat
cd orphan-sponsorship-backend
setup_project.bat
```

Or manually:

```bat
cd orphan-sponsorship-backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python create_db.py
python manage.py migrate
python manage.py seed_demo_data
python manage.py runserver
```

### 3. Frontend

```bat
cd orphan-sponsorship-frontend
npm install
npm run dev
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
