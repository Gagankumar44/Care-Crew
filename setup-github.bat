@echo off
REM GitHub Setup Script for Care-Crew Project
REM This script automates the process of pushing your project to GitHub

echo ========================================
echo GitHub Setup Script for Care-Crew
echo ========================================
echo.

REM Check if Git is installed
echo Checking Git installation...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed!
    echo.
    echo Please install Git first:
    echo 1. Visit: https://git-scm.com/download/win
    echo 2. Download and install Git for Windows
    echo 3. Restart Command Prompt and run this script again
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('git --version') do set GIT_VERSION=%%i
echo [OK] Git is installed: %GIT_VERSION%
echo.

REM Check if .git already exists
if exist ".git" (
    echo [WARNING] Git repository already initialized!
    set /p CONTINUE="Do you want to continue? (y/n): "
    if /i not "%CONTINUE%"=="y" (
        echo Exiting...
        exit /b 0
    )
) else (
    REM Initialize Git repository
    echo Initializing Git repository...
    git init
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to initialize Git repository!
        exit /b 1
    )
    echo [OK] Git repository initialized
)

echo.

REM Check if remote already exists
git remote get-url origin >nul 2>&1
if %errorlevel% equ 0 (
    echo [WARNING] Remote 'origin' already exists
    set /p UPDATE_REMOTE="Do you want to update it? (y/n): "
    if /i "%UPDATE_REMOTE%"=="y" (
        git remote set-url origin https://github.com/Gagankumar44/Care-Crew.git
        echo [OK] Remote updated
    )
) else (
    REM Add GitHub remote
    echo Adding GitHub remote...
    git remote add origin https://github.com/Gagankumar44/Care-Crew.git
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to add remote!
        exit /b 1
    )
    echo [OK] GitHub remote added
)

echo.

REM Add all files
echo Adding all files to Git...
git add .
if %errorlevel% neq 0 (
    echo [ERROR] Failed to add files!
    exit /b 1
)
echo [OK] Files added to staging area
echo.

REM Create initial commit
echo Creating initial commit...
git commit -m "Initial commit: Add Care-Crew project files"
if %errorlevel% neq 0 (
    echo [ERROR] Failed to create commit!
    echo Note: Make sure Git user.name and user.email are configured:
    echo   git config --global user.name "Your Name"
    echo   git config --global user.email "your.email@example.com"
    exit /b 1
)
echo [OK] Initial commit created
echo.

REM Set main branch
echo Setting main branch...
git branch -M main
echo [OK] Branch set to 'main'
echo.

REM Push to GitHub
echo Ready to push to GitHub!
echo.
echo Repository URL: https://github.com/Gagankumar44/Care-Crew.git
echo.
echo [WARNING] You will be prompted for GitHub credentials:
echo   - Username: Your GitHub username
echo   - Password: Use a Personal Access Token (not your GitHub password)
echo.
echo To create a Personal Access Token:
echo   1. Go to: https://github.com/settings/tokens
echo   2. Generate new token (classic)
echo   3. Select 'repo' scope
echo   4. Copy and use the token as password
echo.

set /p PUSH_NOW="Do you want to push now? (y/n): "
if /i "%PUSH_NOW%"=="y" (
    echo.
    echo Pushing to GitHub...
    git push -u origin main
    
    if %errorlevel% equ 0 (
        echo.
        echo ========================================
        echo [SUCCESS] Successfully pushed to GitHub!
        echo ========================================
        echo.
        echo View your repository at:
        echo https://github.com/Gagankumar44/Care-Crew
    ) else (
        echo.
        echo [ERROR] Push failed!
        echo Check your credentials and try again.
    )
) else (
    echo.
    echo Setup complete! To push later, run:
    echo   git push -u origin main
)

echo.
pause

