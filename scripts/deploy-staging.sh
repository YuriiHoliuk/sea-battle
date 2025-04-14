#!/bin/bash

# Sea Battle Staging Deployment Script
# This script deploys the Sea Battle application to staging

set -e

# Script configuration
REPO_URL="git@github.com:username/sea-battle.git"
APP_DIR="/opt/sea-battle-staging"
BRANCH="develop"  # Using develop branch for staging
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment of Sea Battle to staging...${NC}"

# Check if docker-compose exists
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: docker-compose is not installed. Please install it first.${NC}"
    exit 1
fi

# Create app directory if it doesn't exist
mkdir -p $APP_DIR

# Clone/pull the repository
if [ -d "$APP_DIR/.git" ]; then
    echo -e "${YELLOW}Updating repository...${NC}"
    cd $APP_DIR
    git fetch --all
    git reset --hard origin/$BRANCH
else
    echo -e "${YELLOW}Cloning repository...${NC}"
    git clone -b $BRANCH $REPO_URL $APP_DIR
    cd $APP_DIR
fi

# Ensure .env.staging file exists
if [ ! -f "$APP_DIR/.env.staging" ]; then
    echo -e "${RED}Error: .env.staging file not found.${NC}"
    echo -e "${YELLOW}Creating from production example file. Please update with proper values.${NC}"
    cp $APP_DIR/.env.production.example $APP_DIR/.env.staging
    
    # Replace production values with staging-specific ones
    sed -i 's/NODE_ENV=production/NODE_ENV=staging/g' $APP_DIR/.env.staging
    sed -i 's/yourdomain.com/staging.yourdomain.com/g' $APP_DIR/.env.staging
    sed -i 's/sea_battle/sea_battle_staging/g' $APP_DIR/.env.staging
fi

# Build and start the Docker containers
echo -e "${YELLOW}Building and starting Docker containers...${NC}"
cd $APP_DIR
docker-compose -f docker-compose.staging.yml down
docker-compose -f docker-compose.staging.yml build --no-cache
docker-compose -f docker-compose.staging.yml up -d

# Wait for services to start
echo -e "${YELLOW}Waiting for services to start...${NC}"
sleep 10

# Check if containers are running
if docker-compose -f docker-compose.staging.yml ps | grep -q "Up"; then
    echo -e "${GREEN}Deployment successful!${NC}"
    echo -e "${GREEN}The staging application is now running at:${NC}"
    echo -e "${GREEN}Client: http://localhost:8080${NC}"
    echo -e "${GREEN}Server API: http://localhost:8081${NC}"
else
    echo -e "${RED}Deployment failed. Containers are not running.${NC}"
    echo -e "${YELLOW}Check the logs with: docker-compose -f docker-compose.staging.yml logs${NC}"
    exit 1
fi

echo -e "${GREEN}Staging deployment process completed!${NC}" 