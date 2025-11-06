# Setup script for Theme V2 feature branch (PowerShell)
# Run this from the hcp-portal directory

Write-Host "Setting up Theme V2 feature branch..." -ForegroundColor Cyan

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
}

# Get current branch
$currentBranch = git branch --show-current 2>$null
if ($LASTEXITCODE -ne 0) {
    $currentBranch = ""
}

# Create feature branch if not already on it
if ($currentBranch -ne "redesign/mediar-v2") {
    Write-Host "Creating branch: redesign/mediar-v2" -ForegroundColor Yellow
    git checkout -b redesign/mediar-v2 2>$null
    if ($LASTEXITCODE -ne 0) {
        git branch redesign/mediar-v2
        git checkout redesign/mediar-v2
    }
}

# Stage all changes
Write-Host "Staging changes..." -ForegroundColor Yellow
git add .

# Commit changes
Write-Host "Committing changes..." -ForegroundColor Yellow
$commitMessage = @"
feat: add Theme V2 feature flag with query param support

- Add THEME_V2 environment variable support
- Implement runtime toggle via ?theme=v2 query parameter
- Create ThemeV2Provider component with Suspense boundary
- Add useThemeV2 hook for component usage
- Update layout to include ThemeV2Provider
- Add theme utility functions in lib/theme.ts
- Update next.config.js to expose THEME_V2 env var
- Add documentation (THEME_V2_FEATURE_FLAG.md)

Feature flag priority:
1. Query param ?theme=v2 (highest priority)
2. Environment variable THEME_V2/NEXT_PUBLIC_THEME_V2
3. Session storage (persistence)

Enables gradual rollout of new design system.
"@

git commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Theme V2 feature branch created and committed!" -ForegroundColor Green
    Write-Host "`nCurrent branch: $(git branch --show-current)" -ForegroundColor Cyan
    Write-Host "`nTo enable Theme V2:" -ForegroundColor Yellow
    Write-Host "  - Add ?theme=v2 to any URL" -ForegroundColor White
    Write-Host "  - Or set NEXT_PUBLIC_THEME_V2=true in .env.local" -ForegroundColor White
} else {
    Write-Host "`n⚠️  Git commit failed. Please check git status." -ForegroundColor Red
    Write-Host "Run: git status" -ForegroundColor Yellow
}

