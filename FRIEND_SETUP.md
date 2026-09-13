# Friend / new laptop setup (ZIP from GitHub)

This guide is for someone who downloads the project ZIP from GitHub and wants the **same working app** (PostgreSQL database + backend + frontend) on their PC.

Repository: https://github.com/M-USMAN-KHILJI/React-Js-Project

---

## What you need installed first

1. **Python 3.12+** — https://www.python.org/downloads/ (tick “Add Python to PATH”)
2. **PostgreSQL** — https://www.postgresql.org/download/windows/ (remember the password you set for user `postgres`)
3. **Node.js 18+** — https://nodejs.org/

PostgreSQL must be running before setup.

---

## Option A — One double-click (Windows)

1. Unzip the project
2. Double-click **`setup_all.bat`** in the project root
3. When asked, enter your PostgreSQL values, for example:

| Prompt | Example |
|--------|---------|
| DB name | `orphan_dbase` (any new name is fine) |
| DB user | `postgres` |
| DB password | *(your PostgreSQL password)* |
| DB host | `localhost` |
| DB port | `5432` |

4. When it finishes, start both servers (two terminals):

```bat
cd orphan-sponsorship-backend
venv\Scripts\activate
python manage.py runserver
```

```bat
cd orphan-sponsorship-frontend
npm run dev
```

5. Open http://127.0.0.1:5173

---

## Option B — Give this command to Antigravity (recommended for your friend)

Copy everything below into Antigravity. **Replace the 5 credential lines with your friend’s real Postgres values.**

```text
Set up this Orphan Educational Sponsorship project so it runs like a finished local demo.

My PostgreSQL credentials are:
- DB_NAME = orphan_dbase
- DB_USER = postgres
- DB_PASSWORD = PASTE_PASSWORD_HERE
- DB_HOST = localhost
- DB_PORT = 5432

Do all of the following in order:
1. Confirm Python 3.12+, Node.js 18+, and PostgreSQL are available.
2. In orphan-sponsorship-backend, run:
   python setup_from_credentials.py --db-name orphan_dbase --db-user postgres --db-password PASTE_PASSWORD_HERE --db-host localhost --db-port 5432
   This must write .env, create the database if missing, run ALL Django migrations (create every table), and seed demo data.
3. In orphan-sponsorship-frontend, run: npm install
4. Start backend: orphan-sponsorship-backend\venv\Scripts\python.exe manage.py runserver
5. Start frontend: npm run dev (in orphan-sponsorship-frontend)
6. Tell me when http://127.0.0.1:5173 works and give the demo login accounts.

Do not commit .env. Do not invent different DB settings than the ones I listed above.
```

---

## Option C — Manual commands

```bat
cd orphan-sponsorship-backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python setup_from_credentials.py --db-name orphan_dbase --db-user postgres --db-password YOUR_PASSWORD --db-host localhost --db-port 5432
```

```bat
cd orphan-sponsorship-frontend
npm install
npm run dev
```

```bat
cd orphan-sponsorship-backend
venv\Scripts\activate
python manage.py runserver
```

---

## What the setup creates

- PostgreSQL database (name you chose)
- All Django tables via `migrate`
- Demo users / orphans / donations / reports via `seed_demo_data`

### Demo logins

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@gmail.com` | `admin@123` |
| Donor | `donor1@gmail.com` | `Donor@123` |
| School | `school1@gmail.com` | `School@123` |
| Guardian | `guardian1@gmail.com` | `Guardian@123` |

---

## Important notes

- `.env` stays on the friend’s machine only (never on GitHub).
- Frontend talks to backend at `http://127.0.0.1:8000/api` (already configured).
- Emails (OTP / newsletter) print in the backend terminal by default — Gmail SMTP is optional.
- Re-seed anytime: `python manage.py seed_demo_data`
