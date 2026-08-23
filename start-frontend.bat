@echo off
echo ========================================================
echo Starting Smart Exams System - React Frontend
echo ========================================================

cd /d "%~dp0"

echo Installing dependencies (if missing)...
call npm install

echo Starting Vite Development Server...
call npm run dev

pause
