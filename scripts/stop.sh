#!/bin/bash

# MediAR Stop Script
# Stops all services and optionally cleans up

set -e

echo "🛑 Stopping MediAR Platform..."

# Check if containers are running
if docker ps | grep -q mediar; then
    echo "📦 Stopping all services..."
    docker-compose down
    
    if [ "$1" == "--clean" ] || [ "$1" == "-c" ]; then
        echo "🧹 Cleaning up volumes..."
        docker-compose down -v
        echo "✅ All services stopped and volumes removed"
    else
        echo "✅ All services stopped"
        echo "💡 Use './scripts/stop.sh --clean' to also remove volumes"
    fi
else
    echo "ℹ️  No services are currently running"
fi

