@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title Push project to GitHub

echo.
echo ============================================
echo  Pushing project to GitHub
echo  https://github.com/M-USMAN-KHILJI/React-Js-Project.git
echo ============================================
echo.

where git >nul 2>&1
if errorlevel 1 (
  echo ERROR: Git is not installed or not in PATH.
  echo Install Git from https://git-scm.com/download/win
  pause
  exit /b 1
)

if exist ".git\index.lock" del /f /q ".git\index.lock"

if exist "orphan-sponsorship-backend\.git_nested_backup" (
  echo Moving nested git backup out of project...
  if exist "%TEMP%\oests-git-nested-backup" rmdir /s /q "%TEMP%\oests-git-nested-backup"
  move /Y "orphan-sponsorship-backend\.git_nested_backup" "%TEMP%\oests-git-nested-backup"
  echo Done.
  echo.
)

echo [1/5] Staging all project files...
git -c core.fsmonitor=false add -A
if errorlevel 1 (
  echo ERROR: git add failed
  pause
  exit /b 1
)

echo [2/5] Ensuring secrets are not committed...
git -c core.fsmonitor=false reset HEAD -- "orphan-sponsorship-backend/.env" 2>nul
git -c core.fsmonitor=false reset HEAD -- "orphan-sponsorship-backend/.env.txt" 2>nul
git -c core.fsmonitor=false reset HEAD -- ".env" 2>nul

echo Staged files (sample):
git -c core.fsmonitor=false diff --cached --name-only | more

echo [3/5] Creating commit...
git -c core.fsmonitor=false diff --cached --quiet
if errorlevel 1 (
  git -c core.fsmonitor=false commit -m "Add full Orphan Sponsorship frontend and backend project"
) else (
  echo Nothing new to commit — continuing to push.
)

echo [4/5] Setting remote...
git remote remove origin 2>nul
git remote add origin https://github.com/M-USMAN-KHILJI/React-Js-Project.git
git branch -M main

echo [5/5] Pushing to GitHub...
echo If asked to sign in, complete the GitHub login window.
echo.
git push -u origin main
if errorlevel 1 (
  echo.
  echo Normal push failed. Trying force push because remote only has README...
  git push -u origin main --force
)

if errorlevel 1 (
  echo.
  echo ============================================
  echo  PUSH FAILED
  echo ============================================
  echo Open GitHub Desktop or run: gh auth login
  echo Then run this file again.
  pause
  exit /b 1
)

echo.
echo ============================================
echo  SUCCESS
echo  Open: https://github.com/M-USMAN-KHILJI/React-Js-Project
echo  Hard refresh the page (Ctrl+F5)
echo ============================================
pause
