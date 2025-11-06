#!/bin/bash

# MediAR Startup Script
# This script starts all backend services and initializes the database

set -e

echo "🚀 Starting MediAR Platform..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cat > .env << EOF
# MediAR Environment Configuration
JWT_SECRET=$(openssl rand -hex 32)
JWT_REFRESH_SECRET=$(openssl rand -hex 32)
HIPAA_ENCRYPTION_KEY=$(openssl rand -hex 16)
GCP_PROJECT_ID=your-gcp-project-id
GCP_LOCATION=us-central1
STUN_SERVER=stun:stun.l.google.com:19302
EOF
    echo "${GREEN}✅ Created .env file${NC}"
    echo "${YELLOW}⚠️  Please edit .env file with your GCP project ID before proceeding${NC}"
fi

# Start PostgreSQL first
echo "📦 Starting PostgreSQL database..."
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
for i in {1..30}; do
    if docker exec mediar-postgres pg_isready -U mediar_user > /dev/null 2>&1; then
        echo "${GREEN}✅ PostgreSQL is ready${NC}"
        break
    fi
    sleep 1
done

# Initialize database
if [ -f backend/init-db.sql ]; then
    echo "📊 Initializing database schema..."
    docker exec -i mediar-postgres psql -U mediar_user -d mediar_db < backend/init-db.sql 2>/dev/null || {
        echo "${YELLOW}⚠️  Database might already be initialized${NC}"
    }
    echo "${GREEN}✅ Database initialized${NC}"
else
    echo "${YELLOW}⚠️  init-db.sql not found, skipping database initialization${NC}"
fi

# Start all services
echo "🚀 Starting all backend services..."
docker-compose up -d

# Wait a bit for services to start
echo "⏳ Waiting for services to start..."
sleep 5

# Check service health
echo ""
echo "🏥 Checking service health..."
echo ""

services=(
    "auth-service:3000"
    "ai-triage-service:3001"
    "patient-data-service:3002"
    "webrtc-signal-service:3003"
    "rpm-data-service:3004"
)

all_healthy=true

for service in "${services[@]}"; do
    name=$(echo $service | cut -d: -f1)
    port=$(echo $service | cut -d: -f2)
    
    if curl -s http://localhost:$port/health > /dev/null 2>&1; then
        echo "${GREEN}✅ $name is healthy${NC}"
    else
        echo "${YELLOW}⚠️  $name is not responding yet${NC}"
        all_healthy=false
    fi
done

echo ""
if [ "$all_healthy" = true ]; then
    echo "${GREEN}🎉 All services are running!${NC}"
    echo ""
    echo "Service URLs:"
    echo "  - Auth Service:        http://localhost:3000"
    echo "  - AI Triage Service:   http://localhost:3001"
    echo "  - Patient Data Service: http://localhost:3002"
    echo "  - WebRTC Signaling:    http://localhost:3003"
    echo "  - RPM Data Service:    http://localhost:3004"
    echo ""
    echo "Next steps:"
    echo "  1. Start mobile app: cd mobile && flutter run"
    echo "  2. View logs: docker-compose logs -f"
    echo "  3. Stop services: docker-compose down"
else
    echo "${YELLOW}⚠️  Some services may still be starting. Check logs with: docker-compose logs${NC}"
fi

echo ""
echo "📝 View logs: docker-compose logs -f [service-name]"
echo "🛑 Stop all: docker-compose down"

