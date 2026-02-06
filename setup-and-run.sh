#!/bin/bash

# BookingApp v89 - Quick Setup and Run Script
# This script automatically sets up the development environment and runs the project

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
    echo -e "${2}${1}${NC}"
}

print_message "================================================" "$BLUE"
print_message "  BookingApp v89 - Setup & Run Script" "$BLUE"
print_message "================================================" "$BLUE"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_message "❌ Node.js is not installed" "$RED"
    print_message "Please install Node.js 18+ from https://nodejs.org/" "$YELLOW"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_message "❌ Node.js version is too old (found v$NODE_VERSION)" "$RED"
    print_message "Please install Node.js 18+ from https://nodejs.org/" "$YELLOW"
    exit 1
fi

print_message "✅ Node.js $(node -v) detected" "$GREEN"

# Check if pnpm is installed, if not install it
if ! command -v pnpm &> /dev/null; then
    print_message "📦 Installing pnpm package manager..." "$YELLOW"
    npm install -g pnpm@10.10.0
    print_message "✅ pnpm installed successfully" "$GREEN"
else
    print_message "✅ pnpm $(pnpm -v) detected" "$GREEN"
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_message "📦 Installing project dependencies..." "$YELLOW"
    pnpm install
    print_message "✅ Dependencies installed successfully" "$GREEN"
else
    print_message "✅ Dependencies already installed" "$GREEN"
fi

echo ""
print_message "================================================" "$BLUE"
print_message "  Setup Complete!" "$GREEN"
print_message "================================================" "$BLUE"
echo ""

# Determine what command to run based on argument
COMMAND=${1:-dev}

case "$COMMAND" in
    dev)
        print_message "🚀 Starting development server..." "$BLUE"
        echo ""
        pnpm run dev
        ;;
    build)
        print_message "🔨 Building project..." "$BLUE"
        echo ""
        pnpm run build
        ;;
    test)
        print_message "🧪 Running tests..." "$BLUE"
        echo ""
        pnpm run test:run
        ;;
    *)
        print_message "❌ Unknown command: $COMMAND" "$RED"
        echo ""
        print_message "Usage: bash setup-and-run.sh [command]" "$YELLOW"
        print_message "Commands:" "$YELLOW"
        print_message "  dev   - Start development server (default)" "$YELLOW"
        print_message "  build - Build the project" "$YELLOW"
        print_message "  test  - Run tests" "$YELLOW"
        exit 1
        ;;
esac
