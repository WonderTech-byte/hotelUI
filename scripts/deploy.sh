#!/bin/bash

# Hotel UI Auto-Deploy Script
# This script builds a Docker image and deploys to Vercel

set -e

echo "🚀 Starting deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if required commands exist
check_command() {
  if ! command -v $1 &> /dev/null; then
    echo -e "${RED}✗ $1 is not installed. Please install it first.${NC}"
    exit 1
  fi
}

check_command "docker"
check_command "npm"

# Get project info
PROJECT_NAME=$(node -p "require('./package.json').name")
PROJECT_VERSION=$(node -p "require('./package.json').version")
IMAGE_TAG="${PROJECT_NAME}:${PROJECT_VERSION}"

echo -e "${YELLOW}📦 Building Docker image: ${IMAGE_TAG}${NC}"
docker build -t $IMAGE_TAG .

echo -e "${GREEN}✓ Docker image built successfully${NC}"

# Check if running locally or in CI/CD
if [ "$CI" = "true" ]; then
  echo -e "${YELLOW}🔄 CI/CD environment detected${NC}"
  echo -e "${YELLOW}📤 Deploying to Vercel...${NC}"
  
  # Vercel CLI deployment
  if command -v vercel &> /dev/null; then
    vercel --prod --token $VERCEL_TOKEN
    echo -e "${GREEN}✓ Deployed to Vercel successfully!${NC}"
  else
    echo -e "${YELLOW}⚠ Vercel CLI not found. Install with: npm install -g vercel${NC}"
  fi
else
  echo -e "${YELLOW}🏠 Local environment detected${NC}"
  echo -e "${YELLOW}🐳 Running Docker container locally...${NC}"
  docker run -p 3000:3000 $IMAGE_TAG
fi

echo -e "${GREEN}✓ Deployment process completed!${NC}"
