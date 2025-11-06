# GitHub Setup Guide for Care-Crew Project

This guide will help you push your Care-Crew project to GitHub.

## Prerequisites

### Step 1: Install Git

If Git is not installed on your system, download and install it:

1. **Download Git for Windows:**
   - Visit: https://git-scm.com/download/win
   - Download the latest version
   - Run the installer
   - **Important:** During installation, select "Git from the command line and also from 3rd-party software" option
   - Complete the installation

2. **Verify Installation:**
   - Open a new PowerShell or Command Prompt window
   - Run: `git --version`
   - You should see something like: `git version 2.x.x`

### Step 2: Configure Git (First Time Setup)

Open PowerShell or Command Prompt and run these commands:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Replace with your actual name and email (the one associated with your GitHub account).

## Quick Setup Script

After installing Git, you can run the provided `setup-github.ps1` script which will:
1. Initialize Git repository
2. Add all files
3. Create initial commit
4. Add GitHub remote
5. Push to GitHub

**OR** follow the manual steps below.

## Manual Setup Steps

### Step 3: Navigate to Project Directory

```bash
cd "C:\Users\gagan\OneDrive\Desktop\MedAR"
```

### Step 4: Initialize Git Repository

```bash
git init
```

### Step 5: Add All Files

```bash
git add .
```

### Step 6: Create Initial Commit

```bash
git commit -m "Initial commit: Add Care-Crew project files"
```

### Step 7: Add GitHub Remote

```bash
git remote add origin https://github.com/Gagankumar44/Care-Crew.git
```

### Step 8: Verify Remote

```bash
git remote -v
```

You should see:
```
origin  https://github.com/Gagankumar44/Care-Crew.git (fetch)
origin  https://github.com/Gagankumar44/Care-Crew.git (push)
```

### Step 9: Push to GitHub

```bash
git branch -M main
git push -u origin main
```

**Note:** You may be prompted for your GitHub username and password. If you have 2FA enabled, use a Personal Access Token instead of your password.

## Creating a Personal Access Token (if needed)

If GitHub asks for authentication:

1. Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "Care-Crew Project")
4. Select scopes: `repo` (full control of private repositories)
5. Click "Generate token"
6. Copy the token (you won't see it again!)
7. Use this token as your password when pushing

## Troubleshooting

### If you get "repository not found" error:
- Make sure the repository exists on GitHub
- Check that you have write access to the repository
- Verify the repository URL is correct

### If you get authentication errors:
- Use Personal Access Token instead of password
- Make sure 2FA is properly configured

### If files are too large:
- Check `.gitignore` is properly excluding large files
- Consider using Git LFS for large files

## Project Structure

Your project includes:
- **Backend:** Multiple microservices (admin, auth, AI triage, etc.)
- **Frontend:** HCP Portal (Next.js)
- **Mobile:** Flutter/Dart application
- **Infrastructure:** Docker, Terraform, CI/CD configs
- **Database:** SQL schemas and seed data

All files are properly organized and will be uploaded to GitHub.

## Next Steps After Setup

1. Create a `README.md` file describing your project
2. Add branch protection rules on GitHub
3. Set up CI/CD pipelines
4. Add collaborators if needed

---

**Need Help?** Check GitHub documentation: https://docs.github.com/

