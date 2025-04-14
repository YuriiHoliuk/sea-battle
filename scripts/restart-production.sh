#!/bin/bash

# Script to restart production containers with a clean rebuild
echo "Restarting production containers with Node.js 22..."

# Stop any running containers
docker-compose -f docker-compose.prod.yml down

# Remove previous images
docker rmi sea-battle-server-prod sea-battle-client-prod 2>/dev/null || true

# Rebuild containers
docker-compose -f docker-compose.prod.yml build --no-cache

# Start containers
docker-compose -f docker-compose.prod.yml up -d

# Watch logs
echo "Containers restarted with Node.js 22. Showing logs:"
docker-compose -f docker-compose.prod.yml logs -f 