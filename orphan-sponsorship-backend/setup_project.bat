@echo off
REM ============================================================
REM OESTS one-click setup for a new laptop (Windows)
REM Prerequisites: Python 3.12+, PostgreSQL running on port 5432
REM ============================================================

cd /d "%~dp0"

echo.
echo [1/5] Creating virtual environment (if missing)...
if not exist "venv\Scripts\python.exe" (
  py -3.12 -m venv venv 2>nul || python -m venv venv
)

echo [2/5] Installing Python packages...
call venv\Scripts\activate.bat
python -m pip install --upgrade pip
pip install -r requirements.txt

echo [3/5] Creating PostgreSQL database from .env (if needed)...
python create_db.py

echo [4/5] Running migrations (creates all tables)...
python manage.py migrate

echo [5/5] Seeding demo users and sample records...
python manage.py seed_demo_data

echo.
echo ============================================================
echo Setup complete.
echo.
echo Start backend:  venv\Scripts\python.exe manage.py runserver
echo Start frontend: cd ..\orphan-sponsorship-frontend ^&^& npm install ^&^& npm run dev
echo.
echo Admin login: admin@gmail.com / admin@123
echo Donor login: donor1@gmail.com / Donor@123
echo School login: school1@gmail.com / School@123
echo Guardian login: guardian1@gmail.com / Guardian@123
echo ============================================================
pause
