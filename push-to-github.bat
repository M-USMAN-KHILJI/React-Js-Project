@echo off
setlocal
cd /d "%~dp0"

echo === Push OESTS project to GitHub ===
echo Repo: https://github.com/M-USMAN-KHILJI/React-Js-Project.git
echo.

REM Keep secrets and nested git backup out of the commit
if not exist ".gitignore" (
  echo ERROR: .gitignore missing
  pause
  exit /b 1
)

REM Move nested git backup out of the tree if still present
if exist "orphan-sponsorship-backend\.git_nested_backup" (
  echo Moving nested git backup out of project folder...
  if exist "%TEMP%\oests-git-nested-backup" rmdir /s /q "%TEMP%\oests-git-nested-backup"
  move "orphan-sponsorship-backend\.git_nested_backup" "%TEMP%\oests-git-nested-backup" >nul
)

if exist ".git\index.lock" (
  echo Removing stale git lock...
  del /f /q ".git\index.lock"
)

echo Staging files...
git add -A
git reset HEAD -- .env 2>nul
git reset HEAD -- "**/.env" 2>nul
git reset HEAD -- orphan-sponsorship-backend/.env 2>nul
git reset HEAD -- orphan-sponsorship-backend/.env.txt 2>nul

echo.
echo Checking that secrets are not staged...
git diff --cached --name-only | findstr /i "\.env$" >nul
if not errorlevel 1 (
  echo ERROR: A .env file is staged. Unstage it before pushing.
  git diff --cached --name-only | findstr /i "\.env"
  pause
  exit /b 1
)

echo Creating commit if needed...
git diff --cached --quiet
if errorlevel 1 (
  git commit -m "Initial commit: Orphan Educational Sponsorship and Tracking System"
) else (
  echo No new staged changes to commit.
)

echo.
echo Setting remote origin...
git remote remove origin 2>nul
git remote add origin https://github.com/M-USMAN-KHILJI/React-Js-Project.git

echo.
echo Pushing to GitHub (branch: main)...
git branch -M main
git push -u origin main

if errorlevel 1 (
  echo.
  echo Push failed. If the remote already has a README commit, try:
  echo   git pull origin main --allow-unrelated-histories
  echo   git push -u origin main
  echo.
  echo Or force overwrite the empty remote README with:
  echo   git push -u origin main --force
  pause
  exit /b 1
)

echo.
echo SUCCESS: Project pushed to https://github.com/M-USMAN-KHILJI/React-Js-Project
pause
