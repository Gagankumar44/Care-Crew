@echo off
REM Quick Start Script for Next.js Portal
echo Starting MediAR Web Portal...
echo.

cd /d "%~dp0"

echo Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo.
echo Starting Next.js dev server...
echo Server will be available at http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

timeout /t 3 /nobreak >nul
start http://localhost:3000

call npm run dev

