#!/bin/bash
# Quick Start Script for Next.js Portal

echo "Starting MediAR Web Portal..."
echo ""

cd "$(dirname "$0")"

# Check dependencies
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo ""
echo "Starting Next.js dev server..."
echo "Server will be available at http://localhost:3000"
echo "Press Ctrl+C to stop the server"
echo ""

sleep 3
open http://localhost:3000 2>/dev/null || xdg-open http://localhost:3000 2>/dev/null || start http://localhost:3000 2>/dev/null

npm run dev

