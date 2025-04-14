#!/bin/bash

# Sea Battle Deployment Script
# This script deploys the Sea Battle application to production

set -e

# Script configuration
REPO_URL="git@github.com:username/sea-battle.git"
APP_DIR="/opt/sea-battle"
BACKUP_DIR="/opt/backups/sea-battle"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment of Sea Battle...${NC}"

# Check if docker-compose exists
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: docker-compose is not installed. Please install it first.${NC}"
    exit 1
fi

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Backup current version if exists
if [ -d "$APP_DIR" ]; then
    echo -e "${YELLOW}Creating backup of current version...${NC}"
    tar -czf "$BACKUP_DIR/sea-battle_backup_$TIMESTAMP.tar.gz" -C $(dirname $APP_DIR) $(basename $APP_DIR)
    echo -e "${GREEN}Backup created at $BACKUP_DIR/sea-battle_backup_$TIMESTAMP.tar.gz${NC}"
fi

# Create app directory if it doesn't exist
mkdir -p $APP_DIR

# Clone/pull the repository
if [ -d "$APP_DIR/.git" ]; then
    echo -e "${YELLOW}Updating repository...${NC}"
    cd $APP_DIR
    git fetch --all
    git reset --hard origin/main
else
    echo -e "${YELLOW}Cloning repository...${NC}"
    git clone $REPO_URL $APP_DIR
    cd $APP_DIR
fi

# Ensure .env.production file exists
if [ ! -f "$APP_DIR/.env.production" ]; then
    echo -e "${RED}Error: .env.production file not found.${NC}"
    echo -e "${YELLOW}Creating from example file. Please update with proper values.${NC}"
    cp $APP_DIR/.env.production.example $APP_DIR/.env.production
fi

# Build and start the Docker containers
echo -e "${YELLOW}Building and starting Docker containers...${NC}"
cd $APP_DIR
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build --no-cache
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to start
echo -e "${YELLOW}Waiting for services to start...${NC}"
sleep 10

# Check if containers are running
if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo -e "${GREEN}Deployment successful!${NC}"
    echo -e "${GREEN}The application is now running at http://yourdomain.com${NC}"
else
    echo -e "${RED}Deployment failed. Containers are not running.${NC}"
    echo -e "${YELLOW}Check the logs with: docker-compose -f docker-compose.prod.yml logs${NC}"
    exit 1
fi

# Clean up old backups (keep last 5)
echo -e "${YELLOW}Cleaning up old backups...${NC}"
ls -t $BACKUP_DIR/sea-battle_backup_*.tar.gz | tail -n +6 | xargs -r rm
echo -e "${GREEN}Deployment process completed!${NC}" 