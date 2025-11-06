@echo off
REM MediAR Startup Script for Windows
REM This script starts all backend services and initializes the database

echo Starting MediAR Platform...
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo Docker is not running. Please start Docker Desktop first.
    exit /b 1
)

REM Check if .env file exists
if not exist .env (
    echo .env file not found. Creating from template...
    (
        echo # MediAR Environment Configuration
        echo JWT_SECRET=change-me-in-development
        echo JWT_REFRESH_SECRET=change-me-in-development
        echo HIPAA_ENCRYPTION_KEY=change-me-in-development
        echo GCP_PROJECT_ID=your-gcp-project-id
        echo GCP_LOCATION=us-central1
        echo STUN_SERVER=stun:stun.l.google.com:19302
    ) > .env
    echo Created .env file
    echo Please edit .env file with your configuration before proceeding
)

REM Start PostgreSQL first
echo Starting PostgreSQL database...
docker-compose up -d postgres

REM Wait for PostgreSQL
echo Waiting for PostgreSQL to be ready...
timeout /t 10 /nobreak >nul

REM Initialize database
if exist backend\init-db.sql (
    echo Initializing database schema...
    docker exec -i mediar-postgres psql -U mediar_user -d mediar_db < backend\init-db.sql 2>nul
    echo Database initialized
)

REM Start all services
echo Starting all backend services...
docker-compose up -d

REM Wait for services
echo Waiting for services to start...
timeout /t 5 /nobreak >nul

echo.
echo Checking service health...
echo.

REM Check service health
curl -s http://localhost:3000/health >nul 2>&1 && echo [OK] Auth Service || echo [WARN] Auth Service
curl -s http://localhost:3001/health >nul 2>&1 && echo [OK] AI Triage Service || echo [WARN] AI Triage Service
curl -s http://localhost:3002/health >nul 2>&1 && echo [OK] Patient Data Service || echo [WARN] Patient Data Service
curl -s http://localhost:3003/health >nul 2>&1 && echo [OK] WebRTC Signaling || echo [WARN] WebRTC Signaling
curl -s http://localhost:3004/health >nul 2>&1 && echo [OK] RPM Data Service || echo [WARN] RPM Data Service

echo.
echo Services are starting!
echo.
echo Service URLs:
echo   - Auth Service:        http://localhost:3000
echo   - AI Triage Service:   http://localhost:3001
echo   - Patient Data Service: http://localhost:3002
echo   - WebRTC Signaling:    http://localhost:3003
echo   - RPM Data Service:    http://localhost:3004
echo.
echo Next steps:
echo   1. Start mobile app: cd mobile ^&^& flutter run
echo   2. View logs: docker-compose logs -f
echo   3. Stop services: docker-compose down
echo.

