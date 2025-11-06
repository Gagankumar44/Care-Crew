# GitHub Setup Script for Care-Crew Project
# This script automates the process of pushing your project to GitHub

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GitHub Setup Script for Care-Crew" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Git is installed
Write-Host "Checking Git installation..." -ForegroundColor Yellow
try {
    $gitVersion = git --version 2>&1
    Write-Host "✓ Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Git first:" -ForegroundColor Yellow
    Write-Host "1. Visit: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "2. Download and install Git for Windows" -ForegroundColor Yellow
    Write-Host "3. Restart PowerShell and run this script again" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Check if we're in the right directory
$currentDir = Get-Location
Write-Host "Current directory: $currentDir" -ForegroundColor Cyan

# Check if .git already exists
if (Test-Path ".git") {
    Write-Host "⚠ Git repository already initialized!" -ForegroundColor Yellow
    $response = Read-Host "Do you want to continue? (y/n)"
    if ($response -ne "y" -and $response -ne "Y") {
        Write-Host "Exiting..." -ForegroundColor Yellow
        exit 0
    }
} else {
    # Initialize Git repository
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Failed to initialize Git repository!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
}

Write-Host ""

# Check if remote already exists
$remoteExists = git remote get-url origin 2>$null
if ($remoteExists) {
    Write-Host "⚠ Remote 'origin' already exists: $remoteExists" -ForegroundColor Yellow
    $response = Read-Host "Do you want to update it? (y/n)"
    if ($response -eq "y" -or $response -eq "Y") {
        git remote set-url origin https://github.com/Gagankumar44/Care-Crew.git
        Write-Host "✓ Remote updated" -ForegroundColor Green
    }
} else {
    # Add GitHub remote
    Write-Host "Adding GitHub remote..." -ForegroundColor Yellow
    git remote add origin https://github.com/Gagankumar44/Care-Crew.git
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Failed to add remote!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ GitHub remote added" -ForegroundColor Green
}

Write-Host ""

# Show what will be added
Write-Host "Checking files to be added..." -ForegroundColor Yellow
git status --short
Write-Host ""

# Add all files
Write-Host "Adding all files to Git..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to add files!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Files added to staging area" -ForegroundColor Green

Write-Host ""

# Check if there are changes to commit
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "⚠ No changes to commit. Repository is up to date." -ForegroundColor Yellow
} else {
    # Create initial commit
    Write-Host "Creating initial commit..." -ForegroundColor Yellow
    git commit -m "Initial commit: Add Care-Crew project files"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Failed to create commit!" -ForegroundColor Red
        Write-Host "Note: Make sure Git user.name and user.email are configured:" -ForegroundColor Yellow
        Write-Host "  git config --global user.name 'Your Name'" -ForegroundColor Yellow
        Write-Host "  git config --global user.email 'your.email@example.com'" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "✓ Initial commit created" -ForegroundColor Green
}

Write-Host ""

# Set main branch
Write-Host "Setting main branch..." -ForegroundColor Yellow
git branch -M main
Write-Host "✓ Branch set to 'main'" -ForegroundColor Green

Write-Host ""

# Push to GitHub
Write-Host "Ready to push to GitHub!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Repository URL: https://github.com/Gagankumar44/Care-Crew.git" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠ You will be prompted for GitHub credentials:" -ForegroundColor Yellow
Write-Host "  - Username: Your GitHub username" -ForegroundColor Yellow
Write-Host "  - Password: Use a Personal Access Token (not your GitHub password)" -ForegroundColor Yellow
Write-Host ""
Write-Host "To create a Personal Access Token:" -ForegroundColor Yellow
Write-Host "  1. Go to: https://github.com/settings/tokens" -ForegroundColor Yellow
Write-Host "  2. Generate new token (classic)" -ForegroundColor Yellow
Write-Host "  3. Select 'repo' scope" -ForegroundColor Yellow
Write-Host "  4. Copy and use the token as password" -ForegroundColor Yellow
Write-Host ""

$response = Read-Host "Do you want to push now? (y/n)"
if ($response -eq "y" -or $response -eq "Y") {
    Write-Host ""
    Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "✓ Successfully pushed to GitHub!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "View your repository at:" -ForegroundColor Cyan
        Write-Host "https://github.com/Gagankumar44/Care-Crew" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "✗ Push failed!" -ForegroundColor Red
        Write-Host "Check your credentials and try again." -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "Setup complete! To push later, run:" -ForegroundColor Cyan
    Write-Host "  git push -u origin main" -ForegroundColor Cyan
}

Write-Host ""
Read-Host "Press Enter to exit"

