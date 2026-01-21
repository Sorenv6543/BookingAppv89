#!/bin/bash
#
# run-commit.sh - Ready-to-run script for testing commits
#
# This script sets up Node, installs dependencies, and runs each commit cleanly
# with its own dependencies. It ensures proper isolation between commits.
#
# Usage:
#   ./run-commit.sh [commit-hash] [command]
#   ./run-commit.sh HEAD "dev"           # Run dev server on current commit
#   ./run-commit.sh abc123 "build"       # Build specific commit
#   ./run-commit.sh --all "test"         # Run tests on all commits
#   ./run-commit.sh --list               # List available commits
#
# Commands: dev, build, test, lint, preview, or any npm script
#

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
NODE_VERSION="20.19.6"
PNPM_VERSION="10.10.0"
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Functions
print_header() {
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  Property Cleaning Scheduler - Commit Runner              ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

check_node() {
    print_info "Checking Node.js installation..."
    if command -v node &> /dev/null; then
        CURRENT_NODE=$(node --version)
        print_success "Node.js is installed: $CURRENT_NODE"
        return 0
    else
        print_warning "Node.js is not installed"
        return 1
    fi
}

install_node() {
    print_info "Installing Node.js v${NODE_VERSION}..."
    
    # Check if nvm is available
    if [ -s "$HOME/.nvm/nvm.sh" ]; then
        print_info "Using nvm to install Node.js..."
        source "$HOME/.nvm/nvm.sh"
        nvm install ${NODE_VERSION}
        nvm use ${NODE_VERSION}
        print_success "Node.js v${NODE_VERSION} installed via nvm"
    elif command -v curl &> /dev/null; then
        # Install nvm first
        print_info "Installing nvm..."
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        nvm install ${NODE_VERSION}
        nvm use ${NODE_VERSION}
        print_success "Node.js v${NODE_VERSION} installed"
    else
        print_error "Cannot install Node.js - neither nvm nor curl is available"
        print_info "Please install Node.js v${NODE_VERSION} manually from https://nodejs.org"
        exit 1
    fi
}

check_pnpm() {
    print_info "Checking pnpm installation..."
    if command -v pnpm &> /dev/null; then
        CURRENT_PNPM=$(pnpm --version)
        print_success "pnpm is installed: v$CURRENT_PNPM"
        return 0
    else
        print_warning "pnpm is not installed"
        return 1
    fi
}

install_pnpm() {
    print_info "Installing pnpm v${PNPM_VERSION}..."
    if command -v npm &> /dev/null; then
        npm install -g pnpm@${PNPM_VERSION}
        print_success "pnpm v${PNPM_VERSION} installed"
    else
        print_error "npm is not available, cannot install pnpm"
        exit 1
    fi
}

setup_environment() {
    print_header
    
    # Check and install Node if needed
    if ! check_node; then
        install_node
    fi
    
    # Check and install pnpm if needed
    if ! check_pnpm; then
        install_pnpm
    fi
    
    print_success "Environment setup complete"
    echo ""
}

clean_dependencies() {
    print_info "Cleaning old dependencies..."
    rm -rf node_modules
    rm -rf .pnpm-store
    rm -rf dist
    rm -rf build
    rm -f pnpm-lock.yaml
    print_success "Dependencies cleaned"
}

install_dependencies() {
    print_info "Installing dependencies with pnpm..."
    pnpm install --frozen-lockfile || pnpm install
    print_success "Dependencies installed"
}

list_commits() {
    print_header
    print_info "Recent commits:"
    echo ""
    git log --oneline --graph --decorate -20
    echo ""
}

checkout_commit() {
    local commit=$1
    print_info "Checking out commit: $commit"
    
    # Stash any changes
    git stash push -m "Auto-stash before checkout" || true
    
    # Checkout the commit
    git checkout "$commit"
    print_success "Checked out: $(git log -1 --oneline)"
}

run_command() {
    local cmd=$1
    print_info "Running command: $cmd"
    
    case $cmd in
        "dev")
            print_warning "Starting dev server (press Ctrl+C to stop)..."
            pnpm run dev
            ;;
        "build")
            pnpm run build
            ;;
        "build:fast")
            pnpm run build:fast
            ;;
        "test")
            pnpm run test:run
            ;;
        "test:coverage")
            pnpm run test:coverage
            ;;
        "lint")
            pnpm run lint
            ;;
        "preview")
            print_warning "Starting preview server (press Ctrl+C to stop)..."
            pnpm run preview
            ;;
        *)
            # Run any custom npm script
            pnpm run "$cmd"
            ;;
    esac
    
    print_success "Command completed: $cmd"
}

run_single_commit() {
    local commit=$1
    local command=$2
    
    print_header
    print_info "Processing commit: $commit"
    print_info "Command: $command"
    echo ""
    
    # Checkout commit
    checkout_commit "$commit"
    
    # Clean and install dependencies
    clean_dependencies
    install_dependencies
    
    # Run command
    echo ""
    run_command "$command"
    
    echo ""
    print_success "✓ Commit $commit processed successfully"
}

run_all_commits() {
    local command=$1
    local commits=$(git log --oneline --reverse | cut -d' ' -f1)
    
    print_header
    print_info "Running command '$command' on all commits"
    echo ""
    
    for commit in $commits; do
        echo ""
        print_info "═══════════════════════════════════════════════════"
        run_single_commit "$commit" "$command"
        print_info "═══════════════════════════════════════════════════"
        echo ""
    done
    
    print_success "All commits processed successfully"
}

show_usage() {
    cat << EOF
Usage: $0 [OPTIONS] [COMMIT] [COMMAND]

A ready-to-run script that sets up Node, installs dependencies,
and runs each commit cleanly with its own dependencies.

OPTIONS:
    --list              List recent commits
    --all COMMAND       Run COMMAND on all commits
    --help              Show this help message

COMMIT:
    HEAD                Current commit
    <commit-hash>       Specific commit hash (e.g., abc123)
    <branch-name>       Branch name

COMMAND:
    dev                 Start development server
    build               Build the project
    build:fast          Fast build (skip type checking)
    test                Run tests
    test:coverage       Run tests with coverage
    lint                Run linter
    preview             Preview production build
    <custom>            Any npm script from package.json

EXAMPLES:
    $0 --list
    $0 HEAD build
    $0 abc123 test
    $0 --all test
    $0 main dev

EOF
}

# Main script
main() {
    cd "$REPO_DIR"
    
    # Parse arguments
    if [ $# -eq 0 ]; then
        show_usage
        exit 0
    fi
    
    case "$1" in
        --help|-h)
            show_usage
            exit 0
            ;;
        --list|-l)
            list_commits
            exit 0
            ;;
        --all|-a)
            if [ -z "$2" ]; then
                print_error "Please specify a command to run on all commits"
                show_usage
                exit 1
            fi
            setup_environment
            run_all_commits "$2"
            exit 0
            ;;
        *)
            if [ -z "$1" ] || [ -z "$2" ]; then
                print_error "Please specify both commit and command"
                show_usage
                exit 1
            fi
            setup_environment
            run_single_commit "$1" "$2"
            exit 0
            ;;
    esac
}

# Run main function
main "$@"
