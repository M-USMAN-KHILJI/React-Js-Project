@echo off
REM ============================================================
REM Full project setup (backend DB + frontend) for a new laptop
REM Prerequisites: Python 3.12+, PostgreSQL, Node.js 18+
REM ============================================================

cd /d "%~dp0"

echo.
echo ============================================
echo  OESTS — full setup for a new computer
echo ============================================
echo.
echo You will be asked for PostgreSQL details:
echo   DB name, DB user, password, host, port
echo.

cd orphan-sponsorship-backend
if not exist "venv\Scripts\python.exe" (
  echo Creating Python virtual environment...
  py -3.12 -m venv venv 2>nul || python -m venv venv
)

call venv\Scripts\activate.bat
python -m pip install --upgrade pip >nul
pip install -r requirements.txt
if errorlevel 1 (
  echo ERROR: pip install failed
  pause
  exit /b 1
)

echo.
echo --- Backend: database + migrations + demo data ---
python setup_from_credentials.py %*
if errorlevel 1 (
  echo ERROR: Backend setup failed
  pause
  exit /b 1
)

cd ..\orphan-sponsorship-frontend
echo.
echo --- Frontend: npm install ---
call npm install
if errorlevel 1 (
  echo ERROR: npm install failed
  pause
  exit /b 1
)

echo.
echo ============================================
echo  Setup finished successfully
echo ============================================
echo.
echo Open TWO terminals:
echo.
echo  Terminal 1 - Backend:
echo    cd orphan-sponsorship-backend
echo    venv\Scripts\activate
echo    python manage.py runserver
echo.
echo  Terminal 2 - Frontend:
echo    cd orphan-sponsorship-frontend
echo    npm run dev
echo.
echo Then open: http://127.0.0.1:5173
echo Admin: admin@gmail.com / admin@123
echo ============================================
pause
