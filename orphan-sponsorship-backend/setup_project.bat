@echo off
REM ============================================================
REM Backend-only setup (creates DB + all tables + demo data)
REM Pass credentials as args OR answer the prompts.
REM
REM Example:
REM   setup_project.bat --db-name orphan_dbase --db-user postgres --db-password mypass --db-host localhost --db-port 5432
REM ============================================================

cd /d "%~dp0"

echo.
echo [setup] Orphan Sponsorship backend
echo.

if not exist "venv\Scripts\python.exe" (
  echo Creating virtual environment...
  py -3.12 -m venv venv 2>nul || python -m venv venv
)

call venv\Scripts\activate.bat
python setup_from_credentials.py %*
if errorlevel 1 (
  echo Setup failed.
  pause
  exit /b 1
)

echo.
echo Start backend with:
echo   venv\Scripts\python.exe manage.py runserver
echo.
pause
