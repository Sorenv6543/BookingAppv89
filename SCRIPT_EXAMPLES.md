# Script Usage Examples

This document provides practical examples of using the ready-to-run scripts.

## 📖 Table of Contents
- [First Time Setup](#first-time-setup)
- [Daily Development](#daily-development)
- [Testing Commits](#testing-commits)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting Workflows](#troubleshooting-workflows)

---

## First Time Setup

### Scenario: Fresh clone, never run before

```bash
# 1. Clone the repository
git clone https://github.com/Sorenv6543/BookingAppv89.git
cd BookingAppv89

# 2. Run the quick setup (one command does everything!)
bash setup-and-run.sh
```

**What happens:**
```
ℹ Property Cleaning Scheduler - Quick Setup

✓ Node.js v20.19.6 detected
✓ pnpm 10.10.0 detected
ℹ Installing dependencies (this may take a few minutes)...
✓ Dependencies installed
ℹ Running: pnpm run dev

  VITE v5.0.12  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## Daily Development

### Scenario: Start working on a feature

```bash
# Just run dev server
bash setup-and-run.sh
```

### Scenario: Build and test before committing

```bash
# Run linter
bash setup-and-run.sh lint

# Run tests
bash setup-and-run.sh test

# Build to verify it compiles
bash setup-and-run.sh build:fast
```

### Scenario: Test with production build

```bash
# Build for production
bash setup-and-run.sh build

# Preview the build
bash setup-and-run.sh preview
```

---

## Testing Commits

### Scenario: Test the current commit

```bash
# Run tests on current commit (HEAD)
bash run-commit.sh HEAD test

# Build current commit
bash run-commit.sh HEAD build
```

**Output:**
```
╔════════════════════════════════════════════════════════════╗
║  Property Cleaning Scheduler - Commit Runner              ║
╚════════════════════════════════════════════════════════════╝

ℹ Processing commit: HEAD
ℹ Command: test

ℹ Checking out commit: HEAD
✓ Checked out: 12b122b Add ready-to-run scripts...
ℹ Cleaning old dependencies...
✓ Dependencies cleaned
ℹ Installing dependencies with pnpm...
✓ Dependencies installed
ℹ Running command: test
✓ Command completed: test

✓ Commit HEAD processed successfully
```

### Scenario: Test a specific old commit

```bash
# First, list available commits
bash run-commit.sh --list

# Then test a specific one
bash run-commit.sh 507c219 test
```

### Scenario: Verify a bug fix across commits

```bash
# Test the bug fix commit
bash run-commit.sh abc123 test

# Test the commit before it (to confirm bug exists)
bash run-commit.sh abc122 test
```

### Scenario: Run tests on all commits

```bash
# This will checkout each commit, install dependencies, and run tests
bash run-commit.sh --all test
```

**Use case:** Ensure no commit in your history breaks the test suite

---

## CI/CD Integration

### Scenario: GitHub Actions workflow

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run tests on current commit
        run: bash run-commit.sh HEAD test
      
      - name: Build project
        run: bash run-commit.sh HEAD build
```

### Scenario: Pre-commit hook

```bash
# .git/hooks/pre-commit
#!/bin/bash
bash setup-and-run.sh lint
bash setup-and-run.sh test:run
```

### Scenario: Jenkins pipeline

```groovy
pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                sh 'bash run-commit.sh HEAD test'
            }
        }
        stage('Build') {
            steps {
                sh 'bash run-commit.sh HEAD build'
            }
        }
    }
}
```

---

## Troubleshooting Workflows

### Scenario: "It works on my machine" debugging

```bash
# Test on the exact commit that works for you
bash run-commit.sh abc123 dev

# Test on the commit that fails for someone else
bash run-commit.sh def456 dev
```

### Scenario: Finding when a test started failing

```bash
# Test commits one by one
bash run-commit.sh abc123 test  # Passes
bash run-commit.sh abc124 test  # Passes
bash run-commit.sh abc125 test  # Fails! Found it!
```

### Scenario: Reproducing a production bug

```bash
# Checkout the production commit
bash run-commit.sh v2.0.0 dev

# Run with production build
bash run-commit.sh v2.0.0 build
bash run-commit.sh v2.0.0 preview
```

### Scenario: Clean install after dependency issues

```bash
# The run-commit script cleans everything automatically
bash run-commit.sh HEAD test

# This will:
# 1. Remove node_modules
# 2. Remove pnpm-lock.yaml
# 3. Fresh install dependencies
# 4. Run tests
```

### Scenario: Testing different Node versions

```bash
# If you have nvm installed, the script will use it
# Edit run-commit.sh to change NODE_VERSION variable

# Then run
bash run-commit.sh HEAD build
```

---

## Advanced Examples

### Scenario: Testing performance across commits

```bash
# Test multiple commits
bash run-commit.sh abc123 "test:performance"
bash run-commit.sh abc124 "test:performance"
bash run-commit.sh abc125 "test:performance"

# Compare results
```

### Scenario: Building for different roles

```bash
# Build owner-only version
bash setup-and-run.sh build:owner-only

# Build admin-only version
bash setup-and-run.sh build:admin-only

# Build full version
bash setup-and-run.sh build:production
```

### Scenario: Running custom npm scripts

```bash
# Any script from package.json works
bash setup-and-run.sh analyze:bundle
bash setup-and-run.sh test:coverage
bash setup-and-run.sh preview:pwa
```

### Scenario: Batch testing with logging

```bash
# Test all commits and save output
bash run-commit.sh --all test > test-results.log 2>&1

# Review results
cat test-results.log
```

---

## Quick Reference

### setup-and-run.sh
**Purpose:** Quick start for development
**Best for:** Daily development workflow
```bash
bash setup-and-run.sh [command]
```

### run-commit.sh
**Purpose:** Testing different commits with clean environments
**Best for:** Debugging, CI/CD, commit validation
```bash
bash run-commit.sh [--list|--all] [commit] [command]
```

### Common Commands
- `dev` - Development server
- `build` - Production build
- `build:fast` - Fast build (skip type check)
- `test` - Run tests
- `lint` - Check code quality
- `preview` - Preview production build

---

## Tips & Best Practices

1. **First time?** Always use `setup-and-run.sh` for initial setup
2. **Testing old commits?** Use `run-commit.sh` for clean isolation
3. **Quick builds?** Use `build:fast` to skip TypeScript checking
4. **Before committing?** Run `lint` and `test`
5. **Debugging?** Use `--list` to find commit hashes
6. **CI/CD?** `run-commit.sh HEAD` ensures clean environment

---

For more information, see:
- [QUICK_START.md](QUICK_START.md) - Detailed documentation
- [README.md](README.md) - Project overview
- [package.json](package.json) - All available npm scripts
