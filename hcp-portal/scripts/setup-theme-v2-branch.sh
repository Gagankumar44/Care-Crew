#!/bin/bash
# Setup script for Theme V2 feature branch
# Run this from the hcp-portal directory

# Check if git is initialized
if [ ! -d ".git" ]; then
  echo "Initializing git repository..."
  git init
  echo "Initializing git..."
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "")

# Create feature branch if not already on it
if [ "$CURRENT_BRANCH" != "redesign/mediar-v2" ]; then
  echo "Creating branch: redesign/mediar-v2"
  git checkout -b redesign/mediar-v2 2>/dev/null || git branch redesign/mediar-v2 && git checkout redesign/mediar-v2
fi

# Stage all changes
echo "Staging changes..."
git add .

# Commit changes
echo "Committing changes..."
git commit -m "feat: add Theme V2 feature flag with query param support

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

Enables gradual rollout of new design system."

echo "✅ Theme V2 feature branch created and committed!"
echo ""
echo "Current branch: $(git branch --show-current)"
echo ""
echo "To enable Theme V2:"
echo "  - Add ?theme=v2 to any URL"
echo "  - Or set NEXT_PUBLIC_THEME_V2=true in .env.local"

