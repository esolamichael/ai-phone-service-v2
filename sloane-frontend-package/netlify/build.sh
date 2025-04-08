#!/bin/bash
echo "Current directory: $(pwd)"
echo "Directory listing:"
ls -la

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

echo "Installing dependencies..."
npm install --legacy-peer-deps

echo "Building application..."
CI=false npm run build

echo "Build completed. Output directory:"
ls -la build