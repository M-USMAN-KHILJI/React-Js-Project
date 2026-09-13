# Orphan Educational Sponsorship and Tracking System

A web-based platform that connects orphan children, NGOs, schools, and donors
so that donations directly support a child's education in a transparent way.

## Project structure

This repository contains both parts of the project:

```
orphan-sponsorship-backend/    Django REST API (PostgreSQL database)
orphan-sponsorship-frontend/   React + Tailwind CSS frontend
```

## Tech stack

- **Frontend:** React, Tailwind CSS, JavaScript, Vite
- **Backend:** Python, Django, Django REST Framework
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)

## User roles

- **Admin** — approves orphan applications, reviews donations, manages schools
- **Donor** — browses approved orphans, makes donations, views progress reports
- **School** — submits monthly attendance and academic reports for students
- **Orphan/Guardian** — submits an application for sponsorship and tracks its status

## How to run this project

### Backend
```bash
cd orphan-sponsorship-backend
python -m venv venv
source venv/Scripts/activate
pip install -r requirements.txt
cp .env.example .env
```
Then edit `.env` and add your own PostgreSQL password.
```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend
```bash
cd orphan-sponsorship-frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and the backend runs at
`http://127.0.0.1:8000`.

## Notes for collaborators

- Each person must create their own `.env` file locally (from `.env.example`).
  Never commit your real `.env` file — it contains your database password.
- Each person also needs their own local PostgreSQL database named
  `orphan_sponsorship_db` (or update `DB_NAME` in your own `.env`).
- Always run `git pull` before you start working, and `git push` after you
  finish, so both team members stay in sync.