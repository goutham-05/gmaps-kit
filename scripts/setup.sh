#!/bin/bash

# gmaps-kit Development Setup Script

echo "🚀 Setting up gmaps-kit development environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build packages
echo "🔨 Building packages..."
npm run build

# Run tests
echo "🧪 Running tests..."
npm run test

# Run linter
echo "🔍 Running linter..."
npm run lint

echo "✅ Setup complete! You can now start developing."
echo ""
echo "Available commands:"
echo "  npm run build     - Build all packages"
echo "  npm run test      - Run tests"
echo "  npm run lint      - Run linter"
echo "  npm run format    - Format code"
echo "  npm run dev       - Start development mode"
echo ""
echo "To test the core package:"
echo "  cd packages/core"
echo "  npm run dev"
