#!/bin/bash

# Script to check server build output
echo "Checking server build output..."

# Build the server
cd server
yarn build

# Check if the build output exists
if [ ! -d "dist" ]; then
  echo "Error: dist directory not found"
  exit 1
fi

# Check for socket directory
if [ ! -d "dist/socket" ]; then
  echo "Error: socket directory not found in build output"
  exit 1
fi

# Check for socketManager.js file
if [ ! -f "dist/socket/socketManager.js" ]; then
  echo "Error: socketManager.js not found in build output"
  exit 1
fi

# List the directory structure
echo "Build output structure:"
find dist -type f | sort

echo "Build check completed successfully" 