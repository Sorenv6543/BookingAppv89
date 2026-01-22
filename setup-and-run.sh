#!/bin/bash
#
# setup-and-run.sh - Quick setup and run script
#
# This is a simplified script for first-time setup and running the project.
# For more advanced commit-by-commit testing, use ./run-commit.sh
#
# Usage:
#   ./setup-and-run.sh              # Setup and run dev server
#   ./setup-and-run.sh build        # Setup and build
#   ./setup-and-run.sh test         # Setup and run tests
#

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }

# Change to script directory
cd "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

print_info "Property Cleaning Scheduler - Quick Setup"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed!"
    print_info "Please install Node.js v20 or later from https://nodejs.org"
    exit 1
fi
print_success "Node.js $(node --version) detected"

# Check/Install pnpm
if ! command -v pnpm &> /dev/null; then
    print_info "Installing pnpm..."
    npm install -g pnpm
fi
print_success "pnpm $(pnpm --version) detected"

# Install dependencies
if [ ! -d "node_modules" ]; then
    print_info "Installing dependencies (this may take a few minutes)..."
    pnpm install
    print_success "Dependencies installed"
else
    print_info "Dependencies already installed (skipping)"
fi

# Run command
COMMAND=${1:-dev}
print_info "Running: pnpm run $COMMAND"
echo ""

pnpm run "$COMMAND"
